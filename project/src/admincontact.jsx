import { useEffect, useState } from "react";
import api from "./api";
import "./admin.css";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadContacts = async () => {
    try {
      const res = await api.get("/api/admin/contacts");
      setContacts(res.data.data || []);
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Load contact error", err);
      setMessage({ type: "error", text: "Failed to load contact messages." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      setMessage({ type: "success", text: "Message deleted." });
      await loadContacts();
    } catch (err) {
      console.error("Delete contact error", err);
      setMessage({ type: "error", text: "Unable to delete message." });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/contacts/${id}/status`, null, {
        params: { status },
      });
      await loadContacts();
    } catch (err) {
      console.error("Update contact status error", err);
      const errMsg = err?.response?.data?.message || "Unable to update message status.";
      setMessage({ type: "error", text: errMsg });
    }
  };

  const normalizeStatusValue = (value) => {
    if (!value) return "NEW";
    return value.replace(/-/g, "_").replace(/\s+/g, "_").toUpperCase();
  };

  return (
    <section className="admin-section">
      <div className="module-header">
        <h2>Contact Messages</h2>
        <button className="secondary-btn" onClick={loadContacts}>
          Refresh
        </button>
      </div>

      {message.text && <p className={`ui-alert ${message.type}`}>{message.text}</p>}

      {loading && <p className="section-state">Loading messages...</p>}
      {!loading && contacts.length === 0 && <p className="empty-text">No messages yet.</p>}

      {!loading && contacts.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.message}</td>
                  <td>
                    <select
                      value={normalizeStatusValue(c.status)}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="danger-btn" onClick={() => deleteContact(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
