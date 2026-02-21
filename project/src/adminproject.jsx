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

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
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

  const addProject = async () => {
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
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      await api.post("/api/admin/projects", payload);
      setForm(initialForm);
      setMessage({ type: "success", text: "Project added." });
      await loadProjects();
    } catch (err) {
      console.error("Add project error", err);
      setMessage({ type: "error", text: "Unable to add project." });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/api/admin/projects/${id}`);
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

        <button className="add-btn" onClick={addProject} disabled={saving}>
          {saving ? "Saving..." : "+ Add Project"}
        </button>
      </div>

      {loading && <p className="section-state">Loading projects...</p>}
      {!loading && projects.length === 0 && (
        <p className="empty-text">No projects created yet.</p>
      )}

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
