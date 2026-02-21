import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

const initialForm = {
  clientName: "",
  clientRole: "",
  message: "",
  rating: 5,
  photoUrl: "",
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const loadTestimonials = async () => {
    try {
      const res = await api.get("/api/admin/testimonials");
      setTestimonials(res.data.data || []);
      setStatus({ type: "", text: "" });
    } catch (err) {
      console.error("Load testimonials error", err);
      setStatus({ type: "error", text: "Failed to load testimonials." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTestimonial = async () => {
    if (!form.clientName.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Client name and message are required." });
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/admin/testimonials", {
        ...form,
        clientName: form.clientName.trim(),
        clientRole: form.clientRole.trim(),
        message: form.message.trim(),
        photoUrl: form.photoUrl.trim(),
        rating: Number(form.rating) || 5,
      });
      setForm(initialForm);
      setStatus({ type: "success", text: "Testimonial added." });
      await loadTestimonials();
    } catch (err) {
      console.error("Add testimonial error", err);
      setStatus({ type: "error", text: "Unable to add testimonial." });
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/api/admin/testimonials/${id}`);
      setStatus({ type: "success", text: "Testimonial deleted." });
      await loadTestimonials();
    } catch (err) {
      console.error("Delete testimonial error", err);
      setStatus({ type: "error", text: "Unable to delete testimonial." });
    }
  };

  const toggleTestimonial = async (id) => {
    try {
      await api.patch(`/api/admin/testimonials/${id}/toggle`);
      await loadTestimonials();
    } catch (err) {
      console.error("Toggle testimonial error", err);
      setStatus({ type: "error", text: "Unable to update testimonial status." });
    }
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Manage Testimonials</h2>
        <button className="secondary-btn" onClick={loadTestimonials}>
          Refresh
        </button>
      </div>

      {status.text && <p className={`ui-alert ${status.type}`}>{status.text}</p>}

      <div className="admin-form">
        <input
          name="clientName"
          placeholder="Client Name"
          value={form.clientName}
          onChange={handleChange}
        />
        <input
          name="clientRole"
          placeholder="Client Role"
          value={form.clientRole}
          onChange={handleChange}
        />
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={form.rating}
          onChange={handleChange}
        />
        <input
          name="photoUrl"
          placeholder="Photo URL"
          value={form.photoUrl}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Testimonial Message"
          value={form.message}
          onChange={handleChange}
        />

        <button className="add-btn" onClick={addTestimonial} disabled={saving}>
          {saving ? "Saving..." : "+ Add Testimonial"}
        </button>
      </div>

      {loading && <p className="section-state">Loading testimonials...</p>}
      {!loading && testimonials.length === 0 && (
        <p className="empty-text">No testimonials created yet.</p>
      )}

      <div className="admin-list card-grid">
        {testimonials.map((item) => (
          <div className="admin-card" key={item.id}>
            <h3>{item.clientName}</h3>
            <p>{item.clientRole}</p>
            <p>Rating: {item.rating}</p>
            <p>{item.message}</p>
            <p>
              Status:{" "}
              <span className={`status-pill ${item.active ? "active" : "inactive"}`}>
                {item.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="admin-actions">
              <button className="secondary-btn" onClick={() => toggleTestimonial(item.id)}>
                {item.active ? "Disable" : "Enable"}
              </button>

              <button className="danger-btn" onClick={() => deleteTestimonial(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
