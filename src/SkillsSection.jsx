import React, { useState } from 'react';
import cameraImage from './assets/camera-video.png';
import StudioCinema from './assets/studCinema.png'
import './style/SkillsSection.css';

// Imports des logos de technologies
import techReact from './assets/tech/react.png';
import techApi from './assets/tech/api.png';
import techHtml from './assets/tech/html.png';
import techCss from './assets/tech/css.png';
import techJs from './assets/tech/js.png';
import techJava from './assets/tech/java.png';
import techCplusplus from './assets/tech/c++.png';
import techBootstrap from './assets/tech/bootstrap.png';
import techWebpack from './assets/tech/webpack.png';

const SkillsSection = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = [
    {
      id: 'java',
      logo: techJava,
      name: 'Java',
      description: 'Langage de programmation orienté objet puissant et polyvalent',
      skillLevel: 85
    },
    {
      id: 'react',
      logo: techReact,
      name: 'React',
      description: 'Bibliothèque JavaScript pour construire des interfaces utilisateur',
      skillLevel: 75
    },
    {
      id: 'html',
      logo: techHtml,
      name: 'HTML',
      description: 'Langage de balisage standard pour la création de pages web',
      skillLevel: 90
    },
    {
      id: 'css',
      logo: techCss,
      name: 'CSS',
      description: 'Langage de feuilles de style pour la mise en page et le design',
      skillLevel: 80
    },
    {
      id: 'javascript',
      logo: techJs,
      name: 'JavaScript',
      description: 'Langage de programmation côté client pour le web interactif',
      skillLevel: 80
    },
    {
      id: 'bootstrap',
      logo: techBootstrap,
      name: 'Bootstrap',
      description: 'Framework CSS pour un développement web rapide et responsive',
      skillLevel: 70
    },
    {
      id: 'webpack',
      logo: techWebpack,
      name: 'Webpack',
      description: 'Outil de bundling pour les applications JavaScript modernes',
      skillLevel: 60
    },
    {
      id: 'C++',
      logo: techCplusplus,
      name: 'C++',
      description: 'Langage de programmation compilé, orienté objet et performance, pour le développement logiciel',
      skillLevel: 90
    }
  ];

  // Fonction pour gérer le clic sur les bulles
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill); // Définit la compétence sélectionnée
  };

  // Fonction pour gérer le dépôt d'une compétence sur la caméra
  const handleDrop = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut
    const techId = e.dataTransfer.getData("text/plain"); // Récupère l'ID de la compétence
    const skill = skills.find(s => s.id === techId); // Cherche la compétence correspondante

    setSelectedSkill(skill || null); // Définit la compétence sélectionnée ou null
  };

  // Fonction pour gérer le drag over
  const handleDragOver = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du navigateur
  };

  return (
    <div className="skills-interactive-container">
      <div className="skills-tech-container" onDragOver={handleDragOver}>
        <div className="skill-bubbles-container">
        <h2 className="skills-title">Compétences maîtrisées :</h2>
          <div className="skill-bubbles-background" />
          <div className="skill-bubbles">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="skill-bubble"
                onClick={() => handleSkillClick(skill)} 
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", skill.id)}
              >
                <img src={skill.logo} alt={skill.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className="camera-section" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <img 
          src={cameraImage} 
          alt="Appareil photo vintage" 
          className="vintage-camera"
        />
      </div>
      <div className="skill-details-container">
        {selectedSkill ? (
          <div className="skill-details">
            <h3>{selectedSkill.name}</h3>
            <p>{selectedSkill.description}</p>
            <div className="skill-progress-bar">
              <div 
                className="skill-progress" 
                style={{ width: `${selectedSkill.skillLevel}%` }}
              >
                {selectedSkill.skillLevel}%
              </div>
            </div>
          </div>
        ) : (
          <div className="no-skill-selected">Aucune compétence sélectionnée</div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;