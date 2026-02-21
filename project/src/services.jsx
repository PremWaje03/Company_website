import { useEffect, useState } from "react";
import api from "./api";
import "./services.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/services")
      .then((res) => {
        setServices(res.data.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching services", err);
        setError("Unable to load services right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 className="section-state">Loading services...</h2>;
  }

  if (error) {
    return <p className="section-error">{error}</p>;
  }

  return (
    <section className="services">
      <div className="section-head">
        <h2 className="section-title">Services That Drive Results</h2>
        <p>Delivery-focused engineering services designed for business scale and reliability.</p>
      </div>

      <div className="services-grid">
        {services.length === 0 && <p className="empty-text">No services available at the moment.</p>}

        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <div className="service-icon">{service.icon ? <i className={`fa ${service.icon}`} /> : "•"}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
