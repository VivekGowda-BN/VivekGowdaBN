import { useState } from 'react';
import './Projects.css';

/* ─────────────────────────────────────────────────────────────
   SELECTED WORK / PROJECTS — Compact Pamidor Style
   Sits cleanly on solid Alejandro Blue (#2A4093)
   ───────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'quantum',
    index: '01',
    title: 'Quantum',
    subtitle: 'RV University Physics & Quantum Computing Club',
    description:
      'Digital platform centralizing academic resources, club updates, and faculty CMS portal.',
    stack: [
      { name: 'React', icon: 'react' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Python', icon: 'python' },
    ],
    image: '/assets/Quantum.png',
    link: 'https://github.com/VivekGowda-BN/Quantum',
  },
  {
    id: 'git-music',
    index: '02',
    title: 'Git Music',
    subtitle: 'Version Control for Musical Ideas',
    description:
      'Audio idea-management platform to record, analyze with AI, and version sketches with Git branching.',
    stack: [
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'node' },
      { name: 'Llama 3', icon: 'ai' },
      { name: 'WaveSurfer', icon: 'audio' },
      { name: 'Python', icon: 'python' },
    ],
    image: '/assets/gitmusic.webp',
    link: 'https://github.com/VivekGowda-BN/Git-Music',
  },
  {
    id: 'shaadi-math',
    index: '03',
    title: 'SHAADI.MATH',
    subtitle: '3D Satirical Dowry & Alimony Calculator',
    description:
      'Satirical calculator critiquing outdated matrimonial customs using interactive 3D physics.',
    stack: [
      { name: 'Three.js', icon: 'threejs' },
      { name: 'React', icon: 'react' },
      { name: 'WebGL', icon: 'webgl' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Framer Motion', icon: 'motion' },
    ],
    image: '/assets/shaadimath.png',
    link: 'https://github.com/VivekGowda-BN/Shaadi.Math',
  },
  {
    id: 'portfolio',
    index: '04',
    title: 'Portfolio Website',
    subtitle: 'Interactive Creative Engineering Portfolio',
    description:
      'High-performance personal portfolio featuring custom GSAP scrubbed scroll systems, 3D interactive physics cards, and reactive motion design.',
    stack: [
      { name: 'React', icon: 'react' },
      { name: 'GSAP', icon: 'gsap' },
      { name: 'Framer Motion', icon: 'motion' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Vite', icon: 'vite' },
    ],
    image: '/assets/portfolio.png',
    link: 'https://github.com/VivekGowda-BN/VivekGowdaBN',
  },
];

function renderTechIcon(icon) {
  switch (icon) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M12 6c-3 0-4.5 1.5-4.5 4.5 1.5-1.5 3-1.875 4.5-1.125C13.125 10 14 11 15.5 11c3 0 4.5-1.5 4.5-4.5-1.5 1.5-3 1.875-4.5 1.125C14.375 7 13.5 6 12 6zm-7.5 7c-3 0-4.5 1.5-4.5 4.5 1.5-1.5 3-1.875 4.5-1.125C5.625 17 6.5 18 8 18c3 0 4.5-1.5 4.5-4.5-1.5 1.5-3 1.875-4.5 1.125C6.875 14 6 13 4.5 13z" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M12 2C11.5 4 8 8 8 13c0 3.5 2 6.5 4 8 2-1.5 4-4.5 4-8 0-5-3.5-9-4-11z" fillRule="evenodd" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M11.9 2c-3.1 0-5 .6-5 2.5v1.9h5v.6H4.4C2.5 7 2 8.9 2 12c0 3 1.2 5 3.8 5h1.6v-2.2c0-2.2 1.9-4 4.1-4h3.8V8.9c0-2.3-2.1-6.9-3.4-6.9zm-2.2 1.6c.4 0 .8.3.8.8s-.4.8-.8.8-.8-.3-.8-.8.4-.8.8-.8zm7.3 5.5v2.2c0 2.2-1.9 4-4.1 4H9.1v1.9c0 2.3 2.1 6.9 3.4 6.9 3.1 0 5-.6 5-2.5v-1.9h-5v-.6h7.5c1.9 0 2.4-1.9 2.4-5 0-3-1.2-5-3.8-5h-1.6zm-2.2 11.7c-.4 0-.8-.3-.8-.8s.4-.8.8-.8.8.3.8.8-.4.8-.8.8z" />
        </svg>
      );
    case 'node':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M12 2l9 5.2v10.4L12 23l-9-5.4V7.2L12 2zm0 2.3L5 8.3v7.3l7 4.1 7-4.1V8.3l-7-4z" />
        </svg>
      );
    case 'ai':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2zm6 14l1.2 2.8L22 20l-2.8 1.2L18 24l-1.2-2.8L14 20l2.8-1.2L18 16z" />
        </svg>
      );
    case 'audio':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="4" y1="9" x2="4" y2="15" />
          <line x1="8" y1="5" x2="8" y2="19" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="16" y1="7" x2="16" y2="17" />
          <line x1="20" y1="10" x2="20" y2="14" />
        </svg>
      );
    case 'threejs':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'webgl':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 22 20 2 20" />
          <line x1="12" y1="2" x2="12" y2="20" />
        </svg>
      );
    case 'motion':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="4 14 10 8 16 14 20 10" />
          <polyline points="4 20 10 14 16 20 20 16" />
        </svg>
      );
    case 'gsap':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case 'vite':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
          <path d="M21.5 3.5l-9.8 17.8a.7.7 0 0 1-1.2 0L2.5 7.5a.7.7 0 0 1 .8-1l7.8 2.3 2.6-5a.7.7 0 0 1 1.2 0l2 3.8 3.8-3.1a.7.7 0 0 1 .8-1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Projects() {
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  return (
    <section
      id="work"
      className="pamidor-projects"
      data-theme-section="dark"
      aria-label="Selected Projects"
    >
      <div className="pamidor-projects__container">
        {/* ── Section Header ── */}
        <div className="pamidor-projects__header">
          <div className="pamidor-projects__topbar">
            <div className="pamidor-tag">
              <span className="pamidor-tag__bullet" />
              <span>[ SELECTED WORK ]</span>
            </div>
          </div>

          <div className="pamidor-projects__title-row">
            <h2 className="pamidor-projects__title">Selected Projects</h2>
            <p className="pamidor-projects__lead">
              Projects where code, design, and curiosity meet — digital products, platforms, and interactive experiences.
            </p>
          </div>

          <div className="pamidor-divider" aria-hidden="true" />
        </div>

        {/* ── Compact Pamidor Projects List ── */}
        <div className="pamidor-showcase" role="region" aria-label="Projects List">
          <ul className="pamidor-showcase__list">
            {PROJECTS.map((project) => {
              const isHovered = hoveredProjectId === project.id;

              return (
                <li key={project.id}>
                  <div
                    className={`pamidor-project-item ${isHovered ? 'is--expanded' : 'is--collapsed'}`}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() =>
                      setHoveredProjectId(isHovered ? null : project.id)
                    }
                  >
                    {/* Project Header Row */}
                    <div className="pamidor-project-item__header">
                      <div className="pamidor-project-item__title-wrap">
                        <span className="pamidor-project-item__number">
                          [{project.index}]
                        </span>
                        <h3 className="pamidor-project-item__name">
                          {project.title}
                        </h3>
                        <span className="pamidor-project-item__subtitle-tag">
                          {project.subtitle}
                        </span>
                      </div>

                      {/* Jump To Project Button */}
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pamidor-jump-btn"
                        aria-label={`Jump To Project ${project.title}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="pamidor-jump-btn__text">Jump To Project</span>
                        <svg
                          className="pamidor-jump-btn__icon"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <g transform="rotate(0 8 8) translate(1.9 3.05) scale(0.41)">
                            <path d="M23.1099 10.9188C19.5082 8.73064 14.2988 4.0372 13.5814 0.0155222L15.9065 3.2973e-06C17.9701 4.66018 24.0697 10.0675 29.7806 10.9898L29.759 13.0893C24.3025 14.0138 17.8165 19.4278 15.9857 24.1101L13.6701 24.1367C13.9005 20.39 19.7218 15.2819 23.0571 13.1913L0.00959874 13.1691L5.90407e-07 10.9388L23.1099 10.9188Z" />
                          </g>
                        </svg>
                      </a>
                    </div>

                    {/* ── Compact Expandable Body ── */}
                    <div className="pamidor-project-item__body">
                      <div className="pamidor-project-item__grid">
                        {/* Left: Info */}
                        <div className="pamidor-project-item__info">
                          <p className="pamidor-project-item__desc">
                            {project.description}
                          </p>

                          {/* Tech Stack Icons + Name Tags */}
                          <div className="pamidor-stack-row" aria-label="Tech Stack">
                            {project.stack.map((item) => (
                              <span key={item.name} className="pamidor-stack-chip">
                                {renderTechIcon(item.icon)}
                                <span>{item.name}</span>
                              </span>
                            ))}
                          </div>

                          {/* “Live” Button (Replaced GitHub button) */}
                          <div className="pamidor-action-wrap">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pamidor-live-btn"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open Live project for ${project.title}`}
                            >
                              <span>Live</span>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 14 14"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M2 12L12 2M12 2H4.5M12 2V9.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>

                        {/* Right: Small, tight screenshot with no dead vertical space */}
                        <div className="pamidor-project-item__visual">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pamidor-cover-card"
                            aria-label={`Open ${project.title} preview`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={project.image}
                              alt={`Preview of ${project.title}`}
                              className="pamidor-cover-card__img"
                              loading="lazy"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hairline item divider */}
                  <div className="pamidor-item-divider" aria-hidden="true" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
