import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

const initialForm = {
  title: "",
  description: "",
  imageUrl: "",
  projectUrl: "",
  technologies: "",
  featured: false,
};

const listToCsv = (items) => (Array.isArray(items) ? items.join(", ") : "");

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadProjects = async () => {
    try {
      const res = await api.get("/api/admin/projects");
      setProjects(res.data.data || []);
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Load projects error", err);
      setMessage({ type: "error", text: "Failed to load projects." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const parseTechnologies = (value) =>
    value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const onSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setMessage({ type: "error", text: "Title and description are required." });
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      projectUrl: form.projectUrl.trim(),
      featured: form.featured,
      technologies: parseTechnologies(form.technologies),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/admin/projects/${editingId}`, payload);
        setMessage({ type: "success", text: "Project updated." });
      } else {
        await api.post("/api/admin/projects", payload);
        setMessage({ type: "success", text: "Project added." });
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      console.error("Save project error", err);
      setMessage({ type: "error", text: "Unable to save project." });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      projectUrl: project.projectUrl || "",
      technologies: listToCsv(project.technologies),
      featured: Boolean(project.featured),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/api/admin/projects/${id}`);
      if (editingId === id) resetForm();
      setMessage({ type: "success", text: "Project deleted." });
      await loadProjects();
    } catch (err) {
      console.error("Delete project error", err);
      setMessage({ type: "error", text: "Unable to delete project." });
    }
  };

  const toggleProject = async (id) => {
    try {
      await api.patch(`/api/admin/projects/${id}/toggle`);
      await loadProjects();
    } catch (err) {
      console.error("Toggle project error", err);
      setMessage({ type: "error", text: "Unable to update project status." });
    }
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Manage Projects</h2>
        <button className="secondary-btn" onClick={loadProjects}>
          Refresh
        </button>
      </div>

      {message.text && <p className={`ui-alert ${message.type}`}>{message.text}</p>}

      <div className="admin-form">
        <input
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <input
          name="projectUrl"
          placeholder="Project URL"
          value={form.projectUrl}
          onChange={handleChange}
        />
        <input
          name="technologies"
          placeholder="Technologies (comma separated)"
          value={form.technologies}
          onChange={handleChange}
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured project
        </label>

        <div className="admin-actions">
          <button className="add-btn" onClick={onSubmit} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Project" : "+ Add Project"}
          </button>
          {editingId && (
            <button className="secondary-btn" onClick={resetForm} disabled={saving}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {loading && <p className="section-state">Loading projects...</p>}
      {!loading && projects.length === 0 && <p className="empty-text">No projects created yet.</p>}

      <div className="admin-list card-grid">
        {projects.map((project) => (
          <div className="admin-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>
              Status:{" "}
              <span className={`status-pill ${project.active ? "active" : "inactive"}`}>
                {project.active ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              Featured:{" "}
              <span className={`status-pill ${project.featured ? "active" : "inactive"}`}>
                {project.featured ? "Yes" : "No"}
              </span>
            </p>

            <div className="admin-actions">
              <button className="secondary-btn" onClick={() => startEdit(project)}>
                Edit
              </button>
              <button className="secondary-btn" onClick={() => toggleProject(project.id)}>
                {project.active ? "Disable" : "Enable"}
              </button>
              <button className="danger-btn" onClick={() => deleteProject(project.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
