import { useEffect, useState } from "react";
import api, { toAbsoluteMediaUrl } from "./api";
import "./testimonials.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80";

export default function Testimonials({ compact = false }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/testimonials")
      .then((res) => {
        const items = res.data.data || [];
        setTestimonials(compact ? items.slice(0, 3) : items);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching testimonials", err);
        setError("Unable to load testimonials right now.");
      })
      .finally(() => setLoading(false));
  }, [compact]);

  if (loading) {
    return <p className="section-state">Loading testimonials...</p>;
  }

  if (error) {
    return <p className="section-error">{error}</p>;
  }

  return (
    <section className={`testimonials ${compact ? "compact" : ""}`}>
      <div className="section-head">
        <h2 className="section-title">What Clients Say</h2>
        <p>Feedback from teams and partners we have worked with.</p>
      </div>

      <div className="testimonial-grid">
        {testimonials.length === 0 && <p className="empty-text">No testimonials available yet.</p>}

        {testimonials.map((item) => (
          <article key={item.id} className="testimonial-card">
            <div className="testimonial-head">
              <img
                src={toAbsoluteMediaUrl(item.photoUrl) || FALLBACK_IMAGE}
                alt={item.clientName}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div>
                <h3>{item.clientName}</h3>
                <p>{item.clientRole || "Client"}</p>
              </div>
            </div>
            <p className="message">{item.message}</p>
            <p className="rating">Rating: {"★".repeat(Math.max(1, Math.min(5, item.rating || 5)))}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
