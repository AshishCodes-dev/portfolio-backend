import React, { useState, useEffect } from 'react';

const DEFAULT_PROJECTS = [
  {
    _id: '1',
    title: 'SONIQ — AI-Powered Music Streaming Platform',
    category: 'Full Stack',
    description: 'AI-powered music streaming platform that plays any song via YouTube IFrame Player API, with an AI DJ for mood-based playlists, smart recommendations, and an installable offline-capable PWA.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    liveLink: 'https://sonix-music-app.vercel.app',
    githubLink: 'https://github.com/AshishCodes-dev/sonix-music-app',
    image: '/images/soniq.png'
  },
  {
    _id: '2',
    title: 'Uber Clone — Ride Booking Application',
    category: 'Full Stack',
    description: 'MERN-based ride-booking platform with rider and captain flows, JWT authentication, live route mapping via OSRM, dynamic fare estimation, and a complete ride lifecycle.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Leaflet'],
    liveLink: 'https://frontend-alpha-snowy-34.vercel.app',
    githubLink: 'https://github.com/AshishCodes-dev/uber-clone-fullstack',
    image: '/images/uber-clone.png'
  }
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects/all');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setProjects(data.data);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      } catch (err) {
        console.warn('Backend /api/projects/all offline or empty, showing default projects:', err);
        setProjects(DEFAULT_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${(-y * 8).toFixed(1)}deg) rotateY(${(x * 8).toFixed(1)}deg)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    card.style.transition = 'transform 0.4s ease';
  };

  return (
    <>
      <div className="section-divider"><span>/* PROJECTS */</span></div>
      <section className="projects" id="projects">
        <div className="section-header reveal visible">
          <span className="section-tag">my work</span>
          <h2 className="section-title">Featured <span>Projects</span></h2>
        </div>

        <div className="projects-grid" id="projectsContainer">
          {loading ? (
            <div className="loading-message">Loading projects...</div>
          ) : projects.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--grey)', gridColumn: '1 / -1' }}>
              No projects yet. Coming soon...
            </p>
          ) : (
            projects.map((project) => (
              <div
                className="project-card reveal visible"
                key={project._id || project.title}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="project-image-wrap">
                  {project.image ? (
                    <img src={project.image} alt={project.title} loading="lazy" />
                  ) : (
                    <i className="fa-solid fa-code project-icon-fallback"></i>
                  )}
                  <div className="project-image-overlay"></div>
                </div>

                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  {project.category && <span className="project-badge">{project.category}</span>}
                </div>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech">
                  {project.technologies &&
                    (Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).map(
                      (tech, idx) => (
                        <span className="tech-tag" key={idx}>
                          {tech.trim()}
                        </span>
                      )
                    )}
                </div>

                <div className="project-links">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <i className="fa fa-external-link"></i> Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <i className="fa-brands fa-github"></i> GitHub
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}