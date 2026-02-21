import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadServices = async () => {
    try {
      const res = await api.get("/api/admin/services");
      setServices(res.data.data || []);
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Load services error", err);
      setMessage({ type: "error", text: "Failed to load services." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const addService = async () => {
    if (!title.trim() || !description.trim()) {
      setMessage({ type: "error", text: "Fill all required fields." });
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/admin/services", {
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      setMessage({ type: "success", text: "Service created." });
      await loadServices();
    } catch (err) {
      console.error("Add service error", err);
      setMessage({ type: "error", text: "Unable to create service." });
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.delete(`/api/admin/services/${id}`);
      setMessage({ type: "success", text: "Service deleted." });
      await loadServices();
    } catch (err) {
      console.error("Delete service error", err);
      setMessage({ type: "error", text: "Unable to delete service." });
    }
  };

  const toggleService = async (id) => {
    try {
      await api.patch(`/api/admin/services/${id}/toggle`);
      await loadServices();
    } catch (err) {
      console.error("Toggle service error", err);
      setMessage({ type: "error", text: "Unable to update service status." });
    }
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Manage Services</h2>
        <button className="secondary-btn" onClick={loadServices}>
          Refresh
        </button>
      </div>

      {message.text && <p className={`ui-alert ${message.type}`}>{message.text}</p>}

      <div className="admin-form">
        <input
          placeholder="Service Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Service Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="add-btn" onClick={addService} disabled={saving}>
          {saving ? "Saving..." : "+ Add Service"}
        </button>
      </div>

      {loading && <p className="section-state">Loading services...</p>}
      {!loading && services.length === 0 && (
        <p className="empty-text">No services created yet.</p>
      )}

      <div className="admin-list card-grid">
        {services.map((service) => (
          <div className="admin-card" key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>
              Status:{" "}
              <span className={`status-pill ${service.active ? "active" : "inactive"}`}>
                {service.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="admin-actions">
              <button className="secondary-btn" onClick={() => toggleService(service.id)}>
                {service.active ? "Disable" : "Enable"}
              </button>

              <button
                className="danger-btn"
                onClick={() => deleteService(service.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
