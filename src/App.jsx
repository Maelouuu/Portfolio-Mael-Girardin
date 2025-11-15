// src/App.jsx
import { useState } from 'react'
import './style/App.css'
import profileImage from './assets/final.JPG'
import photoAccueil3 from './assets/ban2.jpg'

/* logos techno (projets) */
import techHtml from './assets/tech/html.png'
import techCss from './assets/tech/css.png'
import techJs from './assets/tech/js.png'
import techJava from './assets/tech/java.png'
import techBootstrap from './assets/tech/bootstrap.png'
import techWebpack from './assets/tech/webpack.png'

/* images projets */
import photoProjetLiseuse from './assets/image de projet/liseuse1.png'
import photoProjetCinema from './assets/image de projet/cinecalendar.png'
import photoProjetSiteIUT from './assets/image de projet/siteIUT3.png'

/* Lottie – tortue du hero */
import { Player } from '@lottiefiles/react-lottie-player'
import turtleAnim from './assets/turtle.json'

import logo from './assets/tortue-de-mer.png'

/* Sections */
import SkillsSection from './SkillsSection'
import SplitText from './SplitText'

const PROJECT_IMAGES = {
  0: [photoProjetSiteIUT, photoProjetCinema],
  1: [photoProjetCinema, photoProjetSiteIUT],
  2: [photoProjetLiseuse],
}

const PROJECT_TECH = {
  0: [techHtml, techCss, techBootstrap],
  1: [techHtml, techCss, techJs, techWebpack],
  2: [techJava],
}

const PROJECT_PROGRESS = {
  0: { difficulty: 70, time: 60, result: 80 },
  1: { difficulty: 80, time: 70, result: 90 },
  2: { difficulty: 60, time: 50, result: 80 },
}

const PROJECT_DESCRIPTIONS = {
  0: "Site vitrine présentant l’IUT d’Arles, réalisé dans le cadre d’une SaÉ de première année avec une charte graphique imposée.",
  1: "Application web permettant de découvrir des films via une API cinéma, avec un bundling Webpack et une organisation du code modulaire.",
  2: "Projet de liseuse Java : application bureau pour gérer une bibliothèque de livres numériques et améliorer le confort de lecture.",
}

function renderProgressBar(label, value) {
  return (
    <div className="progress-row" key={label}>
      <span className="progress-label">{label}</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="progress-value">{value}%</span>
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('accueil')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const scrollToSection = (section) => {
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(section)
    }
  }

  const openModal = (id) => {
    setSelectedProject(id)
    setCurrentImageIndex(0)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProject(null)
  }

  const nextImage = () => {
    if (selectedProject == null) return
    const arr = PROJECT_IMAGES[selectedProject] || []
    if (!arr.length) return
    setCurrentImageIndex((i) => (i + 1) % arr.length)
  }

  const prevImage = () => {
    if (selectedProject == null) return
    const arr = PROJECT_IMAGES[selectedProject] || []
    if (!arr.length) return
    setCurrentImageIndex((i) => (i - 1 + arr.length) % arr.length)
  }

  return (
    <div className="presentation-container">
      <div className="page-wrapper">
        {/* ===== Header ===== */}
        <header className="header">
          <div className="glass-nav-wrap">
            <nav className="glass-nav" aria-label="Navigation principale">
              <button
                className="logo-bubble"
                onClick={() => scrollToSection('accueil')}
                aria-label="Accueil"
                title="Accueil"
              >
                <img src={logo} alt="Logo tortue" />
              </button>
              <div className="nav-pill" role="tablist" aria-label="Sections du site">
                <button
                  role="tab"
                  className={`nav-link ${activeSection === 'accueil' ? 'active' : ''}`}
                  onClick={() => scrollToSection('accueil')}
                >
                  Accueil
                </button>
                <button
                  role="tab"
                  className={`nav-link ${activeSection === 'apropos' ? 'active' : ''}`}
                  onClick={() => scrollToSection('apropos')}
                >
                  À Propos
                </button>
                <button
                  role="tab"
                  className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                  onClick={() => scrollToSection('skills')}
                >
                  Compétences
                </button>
                <button
                  role="tab"
                  className={`nav-link ${activeSection === 'projets' ? 'active' : ''}`}
                  onClick={() => scrollToSection('projets')}
                >
                  Projets
                </button>
                <button
                  role="tab"
                  className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={() => scrollToSection('contact')}
                >
                  Contact
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* ===== Hero ===== */}
        <div className="image-container">
          <img src={photoAccueil3} alt="Bannière" className="photo-Accueil" />
          <Player
            autoplay
            loop
            src={turtleAnim}
            className="lottie-overlay"
            keepLastFrame={false}
          />
          <h1 className="name-title">Maël Girardin</h1>
          <div className="buttons-container">
            <button
              className="learn-more"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              GitHub
            </button>
            <button
              className="learn-more"
              onClick={() => window.open('mailto:mael.pierre.girardin@icloud.com')}
            >
              Email
            </button>
            <button
              className="learn-more"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '././public/CV Maël_Girardin_2025.pdf'
                link.download = 'CV_Maël_Girardin_2025.pdf'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              mon CV
            </button>
          </div>
        </div>

        {/* ===== Accueil ===== */}
        <div id="accueil" className="section accueil">
          <SplitText
            text="Bienvenue sur mon portfolio"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h2"
          />
        </div>

        {/* ===== À propos ===== */}
        <section id="apropos" className="section about-section">
          <div className="about-card">
            <div className="about-photo">
              <img src={profileImage} alt="Mon profil" className="profile-image" />
            </div>
            <div className="about-content">
              <h2>À propos de moi</h2>
              <p>
                Salut ✌, moi c’est Maël. Je suis en 3ᵉ année de BUT Informatique à l’IUT
                d&apos;Arles. Au quotidien, je navigue entre développement web, data,
                architecture logicielle et un peu de DevOps, avec l’envie de construire des
                projets utiles, bien pensés et agréables à utiliser.
              </p>
              <p>
                Quand je ne suis pas derrière un clavier, tu me trouveras souvent sur un mur
                d’escalade, devant un bon film ou le nez dans un livre. Ce portfolio rassemble
                quelques projets marquants qui racontent ma façon de travailler&nbsp;:
                comprendre un besoin, expérimenter, itérer et soigner les détails.
              </p>
              <div className="about-tags">
                <span>Dév. web & apps</span>
                <span>Projets orientés usage</span>
                <span>Escalade & outdoor</span>
                <span>Cinéma & littérature</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Compétences ===== */}
        <div id="skills" className="section">
          <SplitText
            text="Compétences"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            tag="h2"
          />
          <p>Clique un logo dans le dôme pour voir le détail.</p>
          <div className="skills-container">
            <div className="info-area">
              <SkillsSection />
            </div>
          </div>
        </div>

        {/* ===== Projets ===== */}
        <section id="projets" className="section projects visible">
          <h2>
            <b>Mes différents projets</b>
          </h2>

          <div className="projects-grid">
            {/* Projet 1 */}
            <div className="project-card">
              <img
                src={photoProjetSiteIUT}
                alt="SaÉ S1.05 - Recueil de Besoins"
                className="project-image"
              />
              <div className="project-info">
                <h3>SaÉ S1.05 - Recueil de Besoins</h3>
                <p>Site présentant l’IUT (charte graphique imposée).</p>
                <div className="project-technologies">
                  <h4>Technologies utilisées :</h4>
                  <div className="tech-logos-container">
                    {[techHtml, techCss, techBootstrap].map((t, i) => (
                      <div className="tech-logo" key={i}>
                        <img src={t} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => openModal(0)}>
                  En voir plus ...
                </button>
              </div>
            </div>

            {/* Projet 2 */}
            <div className="project-card">
              <img
                src={photoProjetCinema}
                alt="Projet Webpack - Calendrier du Cinéaste"
                className="project-image"
              />
              <div className="project-info">
                <h3>WitchMovieToday? – Calendrier Ciné</h3>
                <p>Application JS (API cinéma) avec Webpack.</p>
                <div className="project-technologies">
                  <h4>Technologies utilisées :</h4>
                  <div className="tech-logos-container">
                    {[techHtml, techCss, techJs, techWebpack].map((t, i) => (
                      <div className="tech-logo" key={i}>
                        <img src={t} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => openModal(1)}>
                  En voir plus ...
                </button>
              </div>
            </div>

            {/* Projet 3 */}
            <div className="project-card">
              <img
                src={photoProjetLiseuse}
                alt="Projet Java - Liseuse"
                className="project-image"
              />
              <div className="project-info">
                <h3>Projet Java – Liseuse</h3>
                <p>Application de gestion et lecture de livres numériques.</p>
                <div className="project-technologies">
                  <h4>Technologies utilisées :</h4>
                  <div className="tech-logos-container">
                    {[techJava].map((t, i) => (
                      <div className="tech-logo" key={i}>
                        <img src={t} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => openModal(2)}>
                  En voir plus ...
                </button>
              </div>
            </div>
          </div>
        </section>

        {modalOpen && selectedProject !== null && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
              
              {/* Bouton fermeture */}
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>

              <div className="modal-content">

                {/* --- Cadre image --- */}
                <div className="image-frame">
                  <button className="frame-arrow left" onClick={prevImage}>‹</button>

                  <img
                    src={PROJECT_IMAGES[selectedProject][currentImageIndex]}
                    className="frame-img"
                  />

                  <button className="frame-arrow right" onClick={nextImage}>›</button>
                </div>

                {/* Index */}
                <div className="frame-index">
                  {currentImageIndex + 1}/{PROJECT_IMAGES[selectedProject].length}
                </div>

                {/* Titre */}
                <h2 className="modal-title">
                  {selectedProject === 0 && "SaÉ S1.05 - Recueil de Besoins"}
                  {selectedProject === 1 && "WitchMovieToday? – Calendrier Ciné"}
                  {selectedProject === 2 && "Projet Java – Liseuse"}
                </h2>

                {/* Description */}
                <p className="modal-desc">{PROJECT_DESCRIPTIONS[selectedProject]}</p>

                {/* Technos */}
                <h3 className="modal-subtitle">Technologies utilisées</h3>
                <div className="modal-tech-list">
                  {PROJECT_TECH[selectedProject].map((t, i) => (
                    <div className="tech-icon" key={i}>
                      <img src={t} />
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <h3 className="modal-subtitle">Feedback du projet</h3>
                <div className="modal-feedback">
                  {renderProgressBar("Difficulté", PROJECT_PROGRESS[selectedProject].difficulty)}
                  {renderProgressBar("Temps de travail", PROJECT_PROGRESS[selectedProject].time)}
                  {renderProgressBar("Résultat final", PROJECT_PROGRESS[selectedProject].result)}
                </div>

              </div>
            </div>
          </div>
        )}
      </div>


      <footer className="footer-fw">
      {/* TOP BAR */}
      <div className="footer-bar">
        <p className="footer-quote">
          « Comme les racines nourrissent l’arbre, la curiosité nourrit la création. »
        </p>

        <button className="footer-action" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Télécharger mon CV
        </button>
      </div>

      {/* MAIN SECTION */}
      <div className="footer-content">

        <div className="footer-col">
          <img src="/src/assets/logo.png" className="footer-logo" />
          <p className="footer-brand">Portfolio • Maël Girardin © 2025</p>
          <p className="footer-sub">Créativité, passion & développement.</p>
        </div>

        <div className="footer-col">
          <h3>Navigation</h3>
          <ul>
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#apropos">À propos</a></li>
            <li><a href="#competences">Compétences</a></li>
            <li><a href="#projets">Projets</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><i class="fa-solid fa-envelope"></i> 
                <a href="mailto:mael.pierre.girardin@icloud.com">
                  mael.pierre.girardin@icloud.com
                </a>
            </li>

            <li><i class="fa-solid fa-phone"></i> 
                <a href="tel:+33644338007">
                  +33 6 44 33 80 07
                </a>
            </li>

            <li><i class="fa-solid fa-dove"></i> 
                Pigeon voyageur : huitième fenêtre en partant de la gauche
            </li>
          </ul>
        </div>

      </div>
    </footer>




      
    </div>
  )
}

export default App
