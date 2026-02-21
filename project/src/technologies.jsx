import { useEffect, useState } from "react";
import api from "./api";
import "./technologies.css";

export default function Technologies() {
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/technologies")
      .then((res) => {
        setTechs(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching technologies", err);
        setError("Unable to load technologies right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 className="section-state">Loading technologies...</h2>;
  }

  if (error) {
    return <p className="section-error">{error}</p>;
  }

  return (
    <section className="technologies">
      <div className="section-head">
        <h2 className="section-title">Technology Stack</h2>
        <p>Tools and platforms we use to build reliable, scalable software products.</p>
      </div>

      <div className="tech-grid">
        {techs.length === 0 && <p className="empty-text">No technologies configured yet.</p>}

        {techs.map((tech) => (
          <article key={tech.id} className="tech-card">
            <div className="icon-wrap">
              <i className={`fa ${tech.icon || "fa-code"}`} />
            </div>
            <p>{tech.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
