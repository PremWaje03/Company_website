import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

export default function AdminTechnologies() {
  const [technologies, setTechnologies] = useState([]);
  const [form, setForm] = useState({ name: "", icon: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadTechnologies = async () => {
    try {
      const res = await api.get("/api/admin/technologies");
      setTechnologies(res.data.data || []);
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Load technologies error", err);
      setMessage({ type: "error", text: "Failed to load technologies." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTechnology = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Technology name is required." });
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/admin/technologies", {
        name: form.name.trim(),
        icon: form.icon.trim(),
      });
      setForm({ name: "", icon: "" });
      setMessage({ type: "success", text: "Technology added." });
      await loadTechnologies();
    } catch (err) {
      console.error("Add technology error", err);
      setMessage({ type: "error", text: "Unable to add technology." });
    } finally {
      setSaving(false);
    }
  };

  const deleteTechnology = async (id) => {
    if (!window.confirm("Delete this technology?")) return;

    try {
      await api.delete(`/api/admin/technologies/${id}`);
      setMessage({ type: "success", text: "Technology deleted." });
      await loadTechnologies();
    } catch (err) {
      console.error("Delete technology error", err);
      setMessage({ type: "error", text: "Unable to delete technology." });
    }
  };

  const toggleTechnology = async (id) => {
    try {
      await api.patch(`/api/admin/technologies/${id}/toggle`);
      await loadTechnologies();
    } catch (err) {
      console.error("Toggle technology error", err);
      setMessage({ type: "error", text: "Unable to update technology status." });
    }
  };

  return (
    <div className="admin-section">
      <div className="module-header">
        <h2>Manage Technologies</h2>
        <button className="secondary-btn" onClick={loadTechnologies}>
          Refresh
        </button>
      </div>

      {message.text && <p className={`ui-alert ${message.type}`}>{message.text}</p>}

      <div className="admin-form">
        <input
          name="name"
          placeholder="Technology Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="icon"
          placeholder="FontAwesome Icon (e.g., fa-react)"
          value={form.icon}
          onChange={handleChange}
        />

        <button className="add-btn" onClick={addTechnology} disabled={saving}>
          {saving ? "Saving..." : "+ Add Technology"}
        </button>
      </div>

      {loading && <p className="section-state">Loading technologies...</p>}
      {!loading && technologies.length === 0 && (
        <p className="empty-text">No technologies created yet.</p>
      )}

      <div className="admin-list card-grid">
        {technologies.map((tech) => (
          <div className="admin-card" key={tech.id}>
            <h3>{tech.name}</h3>
            <p>Icon: {tech.icon || "N/A"}</p>
            <p>
              Status:{" "}
              <span className={`status-pill ${tech.active ? "active" : "inactive"}`}>
                {tech.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="admin-actions">
              <button
                className="secondary-btn"
                onClick={() => toggleTechnology(tech.id)}
              >
                {tech.active ? "Disable" : "Enable"}
              </button>

              <button
                className="danger-btn"
                onClick={() => deleteTechnology(tech.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
