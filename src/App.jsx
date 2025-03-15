import './style/App.css';
import profileImage from './assets/final.JPG';
import photoAccueil from './assets/Banvert.jpg';
import techReact from './assets/tech/react.png';
import techApi from './assets/tech/api.png';
import techHtml from './assets/tech/html.png';
import techCss from './assets/tech/css.png';
import techJs from './assets/tech/js.png';
import techJava from './assets/tech/java.png';
import techBootstrap from './assets/tech/bootstrap.png';
import techWebpack from './assets/tech/webpack.png';
import photoProjetLiseuse from './assets/image de projet/liseuse1.png';
import photoProjetCinema from './assets/image de projet/cinecalendar.png';
import photoProjetSiteIUT from './assets/image de projet/siteIUT3.png';

import SkillsSection from './SkillsSection';

import { useState } from 'react';
import logo from './assets/tortue-de-mer.png';



function App() {
    const [activeSection, setActiveSection] = useState('accueil');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const projectImages = {
        0: [photoProjetSiteIUT, photoProjetCinema],
        1: [photoProjetCinema, photoProjetSiteIUT],
        2: [photoProjetLiseuse],
    };

    const projectTechnologies = {
        0: [techHtml, techCss, techBootstrap],
        1: [techHtml, techCss, techJs, techWebpack],
        2: [techJava],
    };

    const projectProgress = {
        0: { difficulty: 70, time: 60, result: 80 }, 
        1: { difficulty: 80, time: 70, result: 90 },
        2: { difficulty: 60, time: 50, result: 80 },
    };

    const scrollToSection = (section) => {
        const target = document.getElementById(section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(section);
        }
    };

    const openModal = (projectId) => {
        setSelectedProject(projectId);
        setCurrentImageIndex(0); 
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const nextImage = () => {
        if (currentImageIndex < projectImages[selectedProject].length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0); 
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(projectImages[selectedProject].length - 1); 
        }
    };

    const getProjectDescription = (projectId) => {
        switch (projectId) {
            case 0:
                return "Le projet consiste a développer un site web présentant ma formation actuelle à savoir l'IUT d'Arles, ce site devait comprendre un ensemble de détails et de normes imposées, pour exemple en ce qui concerne la partie graphique du site nous etions forcé de respecter la charte graphique imposé par l'IUT. Ce projet présente donc ma formation dans un aspect large et détaillé. ";
            case 1:
                return "Le projet consiste a développer un site web utilisant des technologies API et donc j'ai choisit de faire un calendrier intéractif qui vous propose pour chaque jour les films sortis, cette présentation contient des informations tels que le titre, l'affiche, le castings ainsi que le reaisateur, le synopsis ainsi que la date de sortie évidemment. ";
            case 2:
                return "Le projet initial était la création d'une application Java qui permettrait de supporter la lecture de fichiers .cbz, qui sont des fichiers compressés contenant des images disposées en séquences pour former des bandes dessinées ou mangas. Le but était de créer un outil simple et pratique pour les utilisateurs souhaitant lire leurs œuvres numériques, tout en offrant une interface utilisateur agréable et facile à naviguer.";
            default:
                return "Aucune description.";
        }
    };

    const renderProgressBar = (label, percentage) => (
        <div className="progress-container">
            <label>{label}: {percentage}%</label>
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );

    return (
        <div className="presentation-container">
        {/* Menu */}
        <nav className="menu">
            <img src={logo} alt="Logo" className="logo" />
            <div className="menu-buttons">
                <button onClick={() => scrollToSection('accueil')}>Accueil</button>
                <button onClick={() => scrollToSection('apropos')}>À Propos</button>
                <button onClick={() => scrollToSection('skills')}>Compétences</button>
                <button onClick={() => scrollToSection('projets')}>Projets</button>
                <button onClick={() => scrollToSection('contact')}>Contact</button>
            </div>
        </nav>

        {/* Conteneur de l'image et des boutons */}
        <div className="image-container">
            <img src={photoAccueil} alt="photoAccueil" className="photo-Accueil" />
            <h1 className="name-title">Maël Girardin</h1>
            <div className="buttons-container">
                <button className="learn-more" onClick={() => window.open('https://github.com', '_blank')}>GitHub</button>
                <button className="learn-more" onClick={() => window.open('mailto:mael.pierre.girardin@icloud.com')}>Email</button>
                <button className="learn-more" onClick={() => {
                    const link = document.createElement('a');
                    link.href = './../public/CV Maël_Girardin_2025.pdf';
                    link.download = 'CV_Maël_Girardin_2025.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}>
                    mon CV
                </button>

            </div>
        </div>

            <div id="accueil" className="section accueil">
                <h1><strong>Bienvenue sur mon portfolio</strong></h1>
                <p>
                    Hey, salutation voyageur, te voici échoué sur mon portfolio. C'est cette tortue que tu vois qui t'as trouvé et ramener jusqu'ici. 
                </p>
                <img src={logo} alt="Logo" className="logo-turtle"/>
                <p>
                    Comme je te l'ai expliqué tu te trouve ici sur mon portfolio, c'est une page centré sur son créateur, moi. En explorant le coin tu trouvera diverses informations a mon sujet, et tu pourra mieux me connaitre.
                </p>
            </div>

            <div id="apropos" className="section">
                <h2><b>À propos de moi</b></h2>
                <div className="profile-section">
                    <img src={profileImage} alt="Mon profil" className="profile-image" />
                    <div className="bio">
                        <p> salut ✌, je m'appelle Maël, je suis un jeune homme de 20 ans, passionné par l'escalade, le cinéma des années 40 à 90 et la littérature allemande et française. Mais je sis surtout passioné d'informatique en premier lieu. Je suis actuellement en deuxième année à L'IUT d'Arles en section informatique. Cette formation m'as permis d'étoffer grandement mes compétences dans un ensemble de domaine varié ce qui me confert de solide base dans une multitude de domaines informatique. Pour parler plus de moi je suis un garçon souriant, gentil et léger mais je suis aussi très impliqué, souvcieux de bien faire, motivé et attentif.</p>
                    </div>
                </div>
            </div>

            <div id="skills" className="section">
                <h2><b>Compétences</b></h2>
                <p> Veuillez soit cliquer sur une bulle de compétence, soit la déplacer sur la caméra.</p>
                <div className="skills-container">
                    <div className="info-area" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)}>
                        <SkillsSection />
                    </div>
                </div>
            </div>

            <section id="projets" className="section projects visible">
                <h2><b>Mes Différents Projets</b></h2>
                <div className="projects-grid">
                    {/* Projet 1 */}
                    <div className="project-card">
                        <img src={photoProjetSiteIUT} alt="SaÉ S1.05 - Recueil de Besoins" className="project-image" />
                        <div className="project-info">
                            <h3>SaÉ S1.05 - Recueil de Besoins</h3>
                            <p>Site Web présentant l'IUT à des lycéens/futurs bacheliers réalisé dans le cadre d'une SaÉ...</p>
                            <div className="project-technologies">
                                <h4>Technologies utilisées :</h4>
                                <div className="tech-logos-container">
                                    {projectTechnologies[0].map((tech, index) => (
                                        <div className="tech-logo" key={index}>
                                            <img src={tech} alt={`Tech Logo ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="view-details-btn" onClick={() => openModal(0)}>En voir plus ...</button>
                        </div>
                    </div>
                    {/* Projet 2 */}
                    <div className="project-card">
                        <img src={photoProjetCinema} alt="Projet Webpack (WitchMovieToday?) - Calendrier du Cinéaste" className="project-image" />
                        <div className="project-info">
                            <h3>Projet Webpack (WitchMovieToday?) - Calendrier du Cinéaste</h3>
                            <p>Application web réalisée en JavaScript, on utilise un API pour récupérer l'actualité du cinéma et bien plus, pour créer un calendrier chouettement amusant.</p>
                            <div className="project-technologies">
                                <h4>Technologies utilisées :</h4>
                                <div className="tech-logos-container">
                                    {projectTechnologies[1].map((tech, index) => (
                                        <div className="tech-logo" key={index}>
                                            <img src={tech} alt={`Tech Logo ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="view-details-btn" onClick={() => openModal(1)}>En voir plus ...</button>
                        </div>
                    </div>
                    {/* Projet 3 */}
                    <div className="project-card">
                        <img src={photoProjetLiseuse} alt="Projet Java - CBZ Reader" className="project-image" />
                        <div className="project-info">
                            <h3>Projet Java - CBZ Reader</h3>
                            <p>Application développée en Java permettant de lire des Bandes Dessinées ou Mangas, avec une méthode de gestion des fichiers cbz.</p>
                            <div className="project-technologies">
                                <h4>Technologies utilisées :</h4>
                                <div className="tech-logos-container">
                                    {projectTechnologies[2].map((tech, index) => (
                                        <div className="tech-logo" key={index}>
                                            <img src={tech} alt={`Tech Logo ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="view-details-btn" onClick={() => openModal(2)}>En voir plus ...</button>
                        </div>
                    </div>
                </div>
            </section>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedProject === 0 ? "SaÉ S1.05 - Recueil de Besoins" : selectedProject === 1 ? "Projet Webpack (WitchMovieToday?) - Calendrier du Cinéaste" : "Projet Java - CBZ Reader"}</h3>
                        <div className="carousel">
                            <button onClick={prevImage} className="carousel-button">❮</button>
                            <img src={projectImages[selectedProject][currentImageIndex]} alt={`Project ${selectedProject} - Image ${currentImageIndex + 1}`} className="carousel-image" />
                            <button onClick={nextImage} className="carousel-button">❯</button>
                        </div>
                        <h4><strong>Description :</strong></h4>
                        <p>{getProjectDescription(selectedProject)}</p>
                        <div className="project-technologies">
                            <h4>Technologies utilisées :</h4>
                            <div className="tech-logos-container">
                                {projectTechnologies[selectedProject].map((tech, index) => (
                                    <div className="tech-logo" key={index}>
                                        <img src={tech} alt={`Tech Logo ${index}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="progress-section">
                            <h4>feedBack du projet :</h4>
                            {renderProgressBar("Difficulté", projectProgress[selectedProject].difficulty)}
                            {renderProgressBar("Temps de travail", projectProgress[selectedProject].time)}
                            {renderProgressBar("Résultat final", projectProgress[selectedProject].result)}
                        </div>
                    </div>
                </div>
            )}
            <div id="contact" className="section">
                <h2><b>Contact</b></h2>
                <p>Email : mael.pierre.girardin@icloud.com</p>
                <p>Téléphone : +33 6 44 33 80 07</p>
                <p>Pigeon voyageur : huitième fenêtre en partant de la gauche</p>
            </div>
        </div>
    );
}

export default App;