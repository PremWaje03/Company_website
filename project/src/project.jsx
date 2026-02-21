import { useEffect, useState } from "react";
import api, { toAbsoluteMediaUrl } from "./api";
import "./project.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/projects")
      .then((res) => {
        setProjects(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching projects", err);
        setError("Unable to load projects right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="section-state">Loading projects...</p>;
  }

  if (error) {
    return <p className="section-error">{error}</p>;
  }

  return (
    <section className="projects">
      <div className="section-head">
        <h2 className="section-title">Project Portfolio</h2>
        <p>A curated selection of products and platforms delivered by our team.</p>
      </div>

      <div className="projects-grid">
        {projects.length === 0 && <p className="empty-text">No projects available.</p>}

        {projects.map((project) => (
          <article key={project.id} className="project-card">
            <img
              src={toAbsoluteMediaUrl(project.imageUrl) || FALLBACK_IMAGE}
              alt={project.title}
              className="project-img"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            <div className="project-content">
              <div className="project-top">
                <h3>{project.title}</h3>
                {project.featured && <span className="featured-pill">Featured</span>}
              </div>
              <p>{project.description}</p>

              {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={`${project.id}-tech-${index}`}>{tech}</span>
                  ))}
                </div>
              )}

              {project.projectUrl && (
                <a href={project.projectUrl} target="_blank" rel="noreferrer" className="project-link">
                  Visit Project
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
