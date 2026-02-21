import { useEffect, useState } from "react";
import api, { toAbsoluteMediaUrl } from "./api";
import "./admin.css";

const initialForm = {
  name: "",
  role: "",
  photoUrl: "",
  bio: "",
};

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadTeam = async () => {
    try {
      const res = await api.get("/api/admin/team");
      setTeam(res.data.data || []);
      setMessage((prev) => (prev.type === "error" ? prev : { type: "", text: "" }));
    } catch (err) {
      console.error("Load team error", err);
      setMessage({ type: "error", text: "Failed to load team members." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Only image files are allowed." });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setMessage({ type: "error", text: "Image must be 5MB or smaller." });
      return;
    }

    clearSelectedImage();
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage({ type: "", text: "" });
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) {
      return form.photoUrl.trim();
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await api.post("/api/admin/uploads/team-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return uploadResponse?.data?.data?.path || form.photoUrl.trim();
    } finally {
      setUploadingImage(false);
    }
  };

  const addMember = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      setMessage({ type: "error", text: "Name and role are required." });
      return;
    }

    setSaving(true);
    try {
      const uploadedPhotoUrl = await uploadImageIfNeeded();

      await api.post("/api/admin/team", {
        ...form,
        name: form.name.trim(),
        role: form.role.trim(),
        photoUrl: uploadedPhotoUrl,
        bio: form.bio.trim(),
        active: true,
      });

      setForm(initialForm);
      clearSelectedImage();
      setMessage({ type: "success", text: "Team member added." });
      await loadTeam();
    } catch (err) {
      console.error("Add team error", err);
      const errMsg = err?.response?.data?.message || "Unable to add team member.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;

    try {
      await api.delete(`/api/admin/team/${id}`);
      setMessage({ type: "success", text: "Team member deleted." });
      await loadTeam();
    } catch (err) {
      console.error("Delete team error", err);
      setMessage({ type: "error", text: "Unable to delete team member." });
    }
  };

  const toggleMember = async (id) => {
    try {
      await api.patch(`/api/admin/team/${id}/toggle`);
      await loadTeam();
    } catch (err) {
      console.error("Toggle team error", err);
      setMessage({ type: "error", text: "Unable to update team status." });
    }
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Manage Team</h2>
        <button className="secondary-btn" onClick={loadTeam}>
          Refresh
        </button>
      </div>

      {message.text && <p className={`ui-alert ${message.type}`}>{message.text}</p>}

      <div className="admin-form">
        <input name="name" placeholder="Member Name" value={form.name} onChange={handleChange} />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
        <input
          name="photoUrl"
          placeholder="Photo URL (optional if uploading)"
          value={form.photoUrl}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleImageFileChange} />
        {imagePreview && (
          <div className="upload-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" className="secondary-btn" onClick={clearSelectedImage}>
              Remove selected image
            </button>
          </div>
        )}
        <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} />

        <button className="add-btn" onClick={addMember} disabled={saving || uploadingImage}>
          {saving || uploadingImage ? "Saving..." : "+ Add Member"}
        </button>
      </div>

      {loading && <p className="section-state">Loading team members...</p>}
      {!loading && team.length === 0 && <p className="empty-text">No team members created yet.</p>}

      <div className="admin-list card-grid">
        {team.map((member) => (
          <div className="admin-card" key={member.id}>
            {member.photoUrl && (
              <div className="member-thumb-wrap">
                <img
                  className="member-thumb"
                  src={toAbsoluteMediaUrl(member.photoUrl)}
                  alt={member.name}
                />
              </div>
            )}
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            {member.bio && <p>{member.bio}</p>}
            <p>
              Status:{" "}
              <span className={`status-pill ${member.active ? "active" : "inactive"}`}>
                {member.active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="admin-actions">
              <button className="secondary-btn" onClick={() => toggleMember(member.id)}>
                {member.active ? "Disable" : "Enable"}
              </button>
              <button className="danger-btn" onClick={() => deleteMember(member.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
