import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './style/DomeGallery.css';

const DEFAULTS = { maxVerticalRotationDeg: 5, dragSensitivity: 20, segments: 35 };
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = deg => { const a = (((deg + 180) % 360) + 360) % 360; return a - 180; };

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs  = [-3, -1, 1, 3, 5];
  const coords = xCols.flatMap((x, c) => (c % 2 === 0 ? evenYs : oddYs).map(y => ({ x, y, sizeX: 2, sizeY: 2 })));

  const normalized = pool.map(image => (typeof image === 'string'
    ? { src: image, alt: '', meta:null }
    : { src: image.src || '', alt: image.alt || '', meta: image.meta ?? null }
  ));
  const used = Array.from({ length: coords.length }, (_, i) => normalized[i % normalized.length]);

  // éviter 2 identiques côte à côte
  for (let i = 1; i < used.length; i++) {
    if (used[i].src === used[i-1].src) {
      for (let j = i + 1; j < used.length; j++) {
        if (used[j].src !== used[i].src) { [used[i], used[j]] = [used[j], used[i]]; break; }
      }
    }
  }
  return coords.map((c, i) => ({ ...c, ...used[i] }));
}

export default function DomeGallery({
  images,
  fit = 0.5, fitBasis = 'auto', minRadius = 600, maxRadius = Infinity, padFactor = 0.25,
  grayscale = false,
  segments = DEFAULTS.segments,
  dragSensitivity = DEFAULTS.dragSensitivity,
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  onSelect
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
  };

  // sizing
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), maxDim = Math.max(w, h), aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min': basis = minDim; break;
        case 'max': basis = maxDim; break;
        case 'width': basis = w; break;
        case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      radius = Math.min(radius, h * 1.35);
      radius = Math.min(Math.max(radius, minRadius), maxRadius);
      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, grayscale]);

  useEffect(() => { applyTransform(rotationRef.current.x, rotationRef.current.y); }, []);

  const stopInertia = useCallback(() => { if (inertiaRAF.current) { cancelAnimationFrame(inertiaRAF.current); inertiaRAF.current = null; } }, []);
  const startInertia = useCallback((vx, vy) => {
    const MAX_V = 1.4; let vX = Math.max(-MAX_V, Math.min(MAX_V, vx)) * 80;
    let vY = Math.max(-MAX_V, Math.min(MAX_V, vy)) * 80;
    let frames = 0;
    const frictionMul = 0.97;
    const stopThreshold = 0.02;
    const maxFrames = 220;
    const step = () => {
      vX *= frictionMul; vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF.current = null; return; }
      if (++frames > maxFrames) { inertiaRAF.current = null; return; }
      const nextX = Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, rotationRef.current.x - vY / 200));
      const nextY = ((rotationRef.current.y + vX / 200 + 540) % 360) - 180;
      rotationRef.current = { x: nextX, y: nextY }; applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia(); inertiaRAF.current = requestAnimationFrame(step);
  }, [maxVerticalRotationDeg, stopInertia]);

  useGesture(
    {
      onDragStart: ({ event }) => {
        stopInertia();
        draggingRef.current = true; movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: event.clientX, y: event.clientY };
      },
      onDrag: ({ event, last, velocity = [0,0], direction = [0,0], movement }) => {
        if (!draggingRef.current || !startPosRef.current) return;
        const dx = event.clientX - startPosRef.current.x;
        const dy = event.clientY - startPosRef.current.y;
        if (!movedRef.current && (dx*dx + dy*dy) > 16) movedRef.current = true;
        const nextX = Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, startRotRef.current.x - dy / dragSensitivity));
        const nextY = ((startRotRef.current.y + dx / dragSensitivity + 540) % 360) - 180;
        rotationRef.current = { x: nextX, y: nextY }; applyTransform(nextX, nextY);
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity; const [dirX, dirY] = direction;
          let vx = vMagX * dirX; let vy = vMagY * dirY;
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
          movedRef.current = false;
        }
      }
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  const onTileClick = useCallback((e) => {
    const idx = parseInt(e.currentTarget.parentElement.dataset.index, 10);
    const it = items[idx];
    onSelect?.(it?.meta || null);
  }, [items, onSelect]);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{ ['--segments-x']: segments, ['--segments-y']: segments }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-index={i}
                style={{
                  ['--offset-x']: it.x,
                  ['--offset-y']: it.y,
                  ['--item-size-x']: it.sizeX,
                  ['--item-size-y']: it.sizeY
                }}
              >
                <div className="item__image" role="button" tabIndex={0} aria-label={it.alt || 'Open'} onClick={onTileClick}>
                  <img src={it.src} alt={it.alt} draggable={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
