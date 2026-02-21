import { useState } from "react";
import api from "./api";
import "./contact.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await api.post("/api/contact", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setForm(initialForm);
      setFeedback({ type: "success", message: "Message sent successfully. Our team will contact you soon." });
    } catch (error) {
      console.error("Failed to send message", error);
      const errMsg = error?.response?.data?.message || "Failed to send message. Please try again.";
      setFeedback({ type: "error", message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact">
      <div className="contact-wrap">
        <div className="contact-intro">
          <p className="eyebrow">Talk To Our Team</p>
          <h2>Let Us Discuss Your Next Digital Build</h2>
          <p>Share your requirements and we will provide a practical plan for delivery and timeline.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-grid">
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={form.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Phone number must be 10 digits"
          />

          <textarea
            name="message"
            placeholder="Tell us about your project goals"
            value={form.message}
            onChange={handleChange}
            required
            minLength={10}
            rows={5}
          />

          {feedback.message && <p className={`form-feedback ${feedback.type}`}>{feedback.message}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
