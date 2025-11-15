import React, { useMemo, useState } from 'react';
import './style/SkillsSection.css';
import DomeGallery from './DomeGallery';

/* Logos */
import techReact from './assets/tech/react.png';
import techApi from './assets/tech/api.png';
import techHtml from './assets/tech/html.png';
import techCss from './assets/tech/css.png';
import techJs from './assets/tech/js.png';
import techJava from './assets/tech/java.png';
import techCplusplus from './assets/tech/c++.png';
import techBootstrap from './assets/tech/bootstrap.png';
import techWebpack from './assets/tech/webpack.png';

const SKILLS = [
  { id:'java',       logo:techJava,       name:'Java',       description:'Langage de programmation orienté objet puissant et polyvalent', skillLevel:85 },
  { id:'react',      logo:techReact,      name:'React',      description:'Bibliothèque JavaScript pour construire des interfaces utilisateur', skillLevel:75 },
  { id:'html',       logo:techHtml,       name:'HTML',       description:'Langage de balisage standard pour la création de pages web',       skillLevel:90 },
  { id:'css',        logo:techCss,        name:'CSS',        description:'Langage de feuilles de style pour la mise en page et le design',   skillLevel:80 },
  { id:'javascript', logo:techJs,         name:'JavaScript', description:'Langage de programmation côté client pour le web interactif',      skillLevel:80 },
  { id:'bootstrap',  logo:techBootstrap,  name:'Bootstrap',  description:'Framework CSS pour un dev web rapide et responsive',               skillLevel:70 },
  { id:'webpack',    logo:techWebpack,    name:'Webpack',    description:'Bundler pour les applications JavaScript modernes',                skillLevel:60 },
  { id:'cpp',        logo:techCplusplus,  name:'C++',        description:'Langage compilé performant et orienté objet',                     skillLevel:90 },
  { id:'api',        logo:techApi,        name:'APIs',       description:'Conception et consommation d’API REST',                           skillLevel:70 },
];

export default function SkillsSection() {
  const [selected, setSelected] = useState(null);

  const images = useMemo(
    () => SKILLS.map(s => ({ src: s.logo, alt: s.name, meta: s })),
    []
  );

  return (
    <div className="skills-interactive-container">
      <div className="dome-wrapper">
        <DomeGallery images={images} onSelect={setSelected} grayscale={false} />
      </div>

      {/* === Popup / Modale === */}
      {selected && (
        <div className="skill-modal" onClick={() => setSelected(null)}>
          <div className="skill-modal-content" onClick={e => e.stopPropagation()}>
            
            <button className="skill-modal-close" onClick={() => setSelected(null)}>
              ×
            </button>

            <div className="skill-header">
              <img src={selected.logo} alt={selected.name} />
              <h3>{selected.name}</h3>
            </div>

            <p className="skill-desc">{selected.description}</p>

            {/* === Barre animée === */}
            <div className="skill-progress">
              <div 
                className="skill-progress-fill"
                style={{
                  width: `${selected.skillLevel}%`,
                  "--target-width": `${selected.skillLevel}%`,
                }}
              >
                <span className="skill-progress-value">{selected.skillLevel}%</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}