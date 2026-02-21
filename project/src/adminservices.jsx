import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

const initialForm = {
  title: "",
  description: "",
  icon: "",
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const onSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setMessage({ type: "error", text: "Title and description are required." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
      };

      if (editingId) {
        await api.put(`/api/admin/services/${editingId}`, payload);
        setMessage({ type: "success", text: "Service updated." });
      } else {
        await api.post("/api/admin/services", payload);
        setMessage({ type: "success", text: "Service created." });
      }

      resetForm();
      await loadServices();
    } catch (err) {
      console.error("Save service error", err);
      setMessage({ type: "error", text: "Unable to save service." });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.delete(`/api/admin/services/${id}`);
      if (editingId === id) resetForm();
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
          name="title"
          placeholder="Service Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="icon"
          placeholder="FontAwesome Icon (e.g., fa-code)"
          value={form.icon}
          onChange={handleChange}
        />

        <div className="admin-actions">
          <button className="add-btn" onClick={onSubmit} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Service" : "+ Add Service"}
          </button>
          {editingId && (
            <button className="secondary-btn" onClick={resetForm} disabled={saving}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {loading && <p className="section-state">Loading services...</p>}
      {!loading && services.length === 0 && <p className="empty-text">No services created yet.</p>}

      <div className="admin-list card-grid">
        {services.map((service) => (
          <div className="admin-card" key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Icon: {service.icon || "N/A"}</p>
            <p>
              Status:{" "}
              <span className={`status-pill ${service.active ? "active" : "inactive"}`}>
                {service.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="admin-actions">
              <button className="secondary-btn" onClick={() => startEdit(service)}>
                Edit
              </button>
              <button className="secondary-btn" onClick={() => toggleService(service.id)}>
                {service.active ? "Disable" : "Enable"}
              </button>
              <button className="danger-btn" onClick={() => deleteService(service.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
