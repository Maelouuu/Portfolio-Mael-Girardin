// src/components/CircularGallery.jsx
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { useEffect, useRef } from 'react'
import './CircularGallery.css'

function debounce(func, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>func(...a), wait) } }
function lerp(a,b,t){ return a + (b-a)*t }

function createTextTexture(gl, text, font='bold 30px Figtree, sans-serif', color='white'){
  const c = document.createElement('canvas'); const cx = c.getContext('2d')
  cx.font = font; const m = cx.measureText(text); const tw = Math.ceil(m.width); const th = Math.ceil(parseInt(font,10)*1.2)
  c.width = tw+20; c.height = th+20; cx.font = font; cx.fillStyle = color; cx.textBaseline='middle'; cx.textAlign='center'
  cx.clearRect(0,0,c.width,c.height); cx.fillText(text, c.width/2, c.height/2)
  const texture = new Texture(gl, { generateMipmaps:false }); texture.image = c
  return { texture, width:c.width, height:c.height }
}

class Title{
  constructor({ gl, plane, text, textColor='#e8edf2', font='bold 30px Figtree, sans-serif' }){
    this.gl=gl; this.plane=plane; this.text=text; this.textColor=textColor; this.font=font; this.createMesh()
  }
  createMesh(){
    const {texture, width, height} = createTextTexture(this.gl, this.text, this.font, this.textColor)
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex:`attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix,projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragment:`precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1) discard;gl_FragColor=c;}`,
      uniforms:{ tMap:{ value: texture } },
      transparent:true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width/height
    const textH = this.plane.scale.y*0.15
    const textW = textH*aspect
    this.mesh.scale.set(textW, textH, 1)
    this.mesh.position.y = -this.plane.scale.y*0.5 - textH*0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media{
  constructor({ geometry, gl, image, index, length, scene, screen, text, viewport, bend, textColor, borderRadius=0 }){
    this.extra=0; this.geometry=geometry; this.gl=gl; this.image=image; this.index=index; this.length=length; this.scene=scene; this.screen=screen; this.text=text; this.viewport=viewport; this.bend=bend; this.textColor=textColor; this.borderRadius=borderRadius
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize()
  }
  createShader(){
    const texture = new Texture(this.gl, { generateMipmaps:true })
    this.program = new Program(this.gl,{
      depthTest:false, depthWrite:false,
      vertex:`precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix,projectionMatrix;uniform float uTime,uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.0+uTime)*1.5+cos(p.y*2.0+uTime)*1.5)*(0.1+uSpeed*0.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
      fragment:`precision highp float;uniform vec2 uImageSizes,uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float roundedBoxSDF(vec2 p, vec2 b, float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5, vUv.y*ratio.y+(1.0-ratio.y)*0.5);vec4 color=texture2D(tMap,uv);float d=roundedBoxSDF(vUv-0.5, vec2(0.5-uBorderRadius), uBorderRadius);float edgeSmooth=0.002;float alpha=1.0-smoothstep(-edgeSmooth, edgeSmooth, d);gl_FragColor=vec4(color.rgb, alpha);}`,
      uniforms:{ tMap:{value:texture}, uPlaneSizes:{value:[0,0]}, uImageSizes:{value:[0,0]}, uSpeed:{value:0}, uTime:{value:100*Math.random()}, uBorderRadius:{value:this.borderRadius} },
      transparent:true
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = ()=>{ texture.image = img; this.program.uniforms.uImageSizes.value=[img.naturalWidth,img.naturalHeight] }
  }
  createMesh(){ this.plane = new Mesh(this.gl, { geometry:this.geometry, program:this.program }); this.plane.setParent(this.scene) }
  createTitle(){ this.title = new Title({ gl:this.gl, plane:this.plane, text:this.text, textColor:this.textColor }) }
  update(scroll, direction){
    this.plane.position.x = this.x - scroll.current - this.extra
    const x = this.plane.position.x, H = this.viewport.width/2
    if (this.bend===0){ this.plane.position.y=0; this.plane.rotation.z=0 }
    else {
      const B = Math.abs(this.bend), R = (H*H + B*B) / (2*B), ex = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R*R - ex*ex)
      if (this.bend>0){ this.plane.position.y=-arc; this.plane.rotation.z = -Math.sign(x)*Math.asin(ex/R) }
      else { this.plane.position.y=arc; this.plane.rotation.z = Math.sign(x)*Math.asin(ex/R) }
    }
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = scroll.current - scroll.last
    const planeOffset = this.plane.scale.x/2, viewportOffset = this.viewport.width/2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter  = this.plane.position.x - planeOffset >  viewportOffset
    if (direction==='right' && this.isBefore){ this.extra -= this.widthTotal }
    if (direction==='left'  && this.isAfter ){ this.extra += this.widthTotal }
  }
  onResize({ screen, viewport }={}){
    if (screen) this.screen = screen
    if (viewport){ this.viewport = viewport }
    this.scale = this.screen.height/1500
    this.plane.scale.y = (this.viewport.height*(900*this.scale))/this.screen.height
    this.plane.scale.x = (this.viewport.width *(700*this.scale))/this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width*this.length
    this.x = this.width*this.index
  }
}

class App3D{
  constructor(container,{ items, bend=3, textColor='#ffffff', borderRadius=0.05, scrollSpeed=2, scrollEase=0.05 }={}){
    this.container=container; this.scrollSpeed=scrollSpeed; this.scroll={ ease:scrollEase, current:0, target:0, last:0 }
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200)
    this.createRenderer(); this.createCamera(); this.createScene(); this.onResize(); this.createGeometry(); this.createMedias(items,bend,textColor,borderRadius); this.update(); this.addEventListeners()
  }
  createRenderer(){ this.renderer=new Renderer({ alpha:true, antialias:true, dpr:Math.min(window.devicePixelRatio||1,2) }); this.gl=this.renderer.gl; this.gl.clearColor(0,0,0,0); this.container.appendChild(this.gl.canvas) }
  createCamera(){ this.camera = new Camera(this.gl); this.camera.fov=45; this.camera.position.z=20 }
  createScene(){ this.scene = new Transform() }
  createGeometry(){ this.planeGeometry = new Plane(this.gl,{ heightSegments:50, widthSegments:100 }) }
  createMedias(items=[], bend=1, textColor, borderRadius){
    const gallery = items.length? items : [{image:`https://picsum.photos/seed/1/800/600?grayscale`,text:'Bridge'}]
    this.mediasImages = gallery.concat(gallery)
    this.medias = this.mediasImages.map((d,i)=> new Media({ geometry:this.planeGeometry, gl:this.gl, image:d.image, index:i, length:this.mediasImages.length, scene:this.scene, screen:this.screen, text:d.text, viewport:this.viewport, bend, textColor, borderRadius }))
  }
  onTouchDown=e=>{ this.isDown=true; this.scroll.position=this.scroll.current; this.start=e.touches?e.touches[0].clientX:e.clientX }
  onTouchMove=e=>{ if(!this.isDown) return; const x=e.touches?e.touches[0].clientX:e.clientX; const dist=(this.start-x)*(this.scrollSpeed*0.025); this.scroll.target=this.scroll.position+dist }
  onTouchUp=()=>{ this.isDown=false; this.onCheck() }
  onWheel=e=>{ const d=e.deltaY||e.wheelDelta||e.detail; this.scroll.target += (d>0?this.scrollSpeed:-this.scrollSpeed)*0.2; this.onCheckDebounce() }
  onCheck(){ if(!this.medias||!this.medias[0]) return; const w=this.medias[0].width; const idx=Math.round(Math.abs(this.scroll.target)/w); const item=w*idx; this.scroll.target = this.scroll.target<0? -item : item }
  onResize=()=>{ this.screen={ width:this.container.clientWidth, height:this.container.clientHeight }; this.renderer.setSize(this.screen.width,this.screen.height); this.camera.perspective({ aspect:this.screen.width/this.screen.height }); const fov=(this.camera.fov*Math.PI)/180; const h=2*Math.tan(fov/2)*this.camera.position.z; const w=h*this.camera.aspect; this.viewport={ width:w, height:h }; if(this.medias){ this.medias.forEach(m=>m.onResize({screen:this.screen, viewport:this.viewport})) } }
  update=()=>{ this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease); const dir = this.scroll.current>this.scroll.last ? 'right':'left'; if(this.medias){ this.medias.forEach(m=>m.update(this.scroll, dir)) } this.renderer.render({ scene:this.scene, camera:this.camera }); this.scroll.last=this.scroll.current; this.raf=requestAnimationFrame(this.update) }
  addEventListeners(){ window.addEventListener('resize',this.onResize); window.addEventListener('wheel',this.onWheel); window.addEventListener('mousedown',this.onTouchDown); window.addEventListener('mousemove',this.onTouchMove); window.addEventListener('mouseup',this.onTouchUp); window.addEventListener('touchstart',this.onTouchDown); window.addEventListener('touchmove',this.onTouchMove); window.addEventListener('touchend',this.onTouchUp) }
  destroy(){ cancelAnimationFrame(this.raf); window.removeEventListener('resize',this.onResize); window.removeEventListener('wheel',this.onWheel); window.removeEventListener('mousedown',this.onTouchDown); window.removeEventListener('mousemove',this.onTouchMove); window.removeEventListener('mouseup',this.onTouchUp); window.removeEventListener('touchstart',this.onTouchDown); window.removeEventListener('touchmove',this.onTouchMove); window.removeEventListener('touchend',this.onTouchUp); if(this.renderer?.gl?.canvas?.parentNode){ this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas) } }
}

export default function CircularGallery({ items, bend=3, textColor='#ffffff', borderRadius=0.05, scrollSpeed=2, scrollEase=0.05 }){
  const ref = useRef(null)
  useEffect(()=>{ const app=new App3D(ref.current,{items,bend,textColor,borderRadius,scrollSpeed,scrollEase}); return ()=>app.destroy() },[items,bend,textColor,borderRadius,scrollSpeed,scrollEase])
  return <div className="circular-gallery" ref={ref} />
}
