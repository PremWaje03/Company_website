import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

const initialForm = {
  companyName: "",
  about: "",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
};

export default function AdminCompany() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const loadCompanyInfo = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/company");
      const data = res.data.data;
      if (!data) {
        setForm(initialForm);
        return;
      }
      setForm({
        companyName: data.companyName || "",
        about: data.about || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        facebook: data.socialLinks?.facebook || "",
        instagram: data.socialLinks?.instagram || "",
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
      });
      setStatus({ type: "", text: "" });
    } catch (err) {
      console.error("Load company info error", err);
      setStatus({ type: "error", text: "Failed to load company information." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveCompanyInfo = async () => {
    if (!form.companyName.trim() || !form.about.trim()) {
      setStatus({ type: "error", text: "Company name and about section are required." });
      return;
    }

    setSaving(true);
    const payload = {
      companyName: form.companyName.trim(),
      about: form.about.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      socialLinks: {
        facebook: form.facebook.trim(),
        instagram: form.instagram.trim(),
        linkedin: form.linkedin.trim(),
        twitter: form.twitter.trim(),
      },
    };

    try {
      await api.post("/api/admin/company", payload);
      setStatus({ type: "success", text: "Company information saved." });
      window.dispatchEvent(new CustomEvent("company-info-updated"));
      await loadCompanyInfo();
    } catch (err) {
      console.error("Save company info error", err);
      const errMsg = err?.response?.data?.message || "Unable to save company information.";
      setStatus({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Company Information</h2>
        <button className="secondary-btn" onClick={loadCompanyInfo}>
          Refresh
        </button>
      </div>

      {status.text && <p className={`ui-alert ${status.type}`}>{status.text}</p>}
      {loading && <p className="section-state">Loading company info...</p>}

      <div className="admin-form">
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
        />
        <textarea name="about" placeholder="About" value={form.about} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input
          name="facebook"
          placeholder="Facebook URL"
          value={form.facebook}
          onChange={handleChange}
        />
        <input
          name="instagram"
          placeholder="Instagram URL"
          value={form.instagram}
          onChange={handleChange}
        />
        <input
          name="linkedin"
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={handleChange}
        />
        <input name="twitter" placeholder="X/Twitter URL" value={form.twitter} onChange={handleChange} />

        <button className="add-btn" onClick={saveCompanyInfo} disabled={saving}>
          {saving ? "Saving..." : "Save Company Info"}
        </button>
      </div>
    </section>
  );
}
