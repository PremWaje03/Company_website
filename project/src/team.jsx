import { useEffect, useState } from "react";
import api, { toAbsoluteMediaUrl } from "./api";
import "./team.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80";

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/team")
      .then((res) => {
        setTeam(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching team members", err);
        setError("Unable to load team members right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 className="section-state">Loading team members...</h2>;
  }

  if (error) {
    return <p className="section-error">{error}</p>;
  }

  return (
    <section className="team">
      <div className="section-head">
        <h2 className="section-title">Meet Our Team</h2>
        <p>People driving engineering, delivery, and measurable business outcomes.</p>
      </div>

      <div className="team-grid">
        {team.length === 0 && <p className="empty-text">No team members available.</p>}

        {team.map((member) => (
          <article key={member.id} className="team-card">
            <div className="team-photo">
              <img
                src={toAbsoluteMediaUrl(member.photoUrl) || FALLBACK_IMAGE}
                alt={member.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>
            <div className="team-content">
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
              {member.bio && <p className="bio">{member.bio}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
