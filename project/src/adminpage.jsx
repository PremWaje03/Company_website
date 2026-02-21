import { useState } from "react";
import "./admin.css";

import AdminServices from "./adminservices";
import AdminProjects from "./adminproject";
import AdminTechnologies from "./admintechnologies";
import AdminTeam from "./adminteam";
import AdminContact from "./admincontact";
import AdminTestimonials from "./admintestimonials";
import AdminCompany from "./admincompany";

export default function AdminPage({ onLogout }) {
  const [section, setSection] = useState("services");

  const renderSection = () => {
    switch (section) {
      case "services":
        return <AdminServices />;
      case "projects":
        return <AdminProjects />;
      case "technologies":
        return <AdminTechnologies />;
      case "team":
        return <AdminTeam />;
      case "contact":
        return <AdminContact />;
      case "testimonials":
        return <AdminTestimonials />;
      case "company":
        return <AdminCompany />;
      default:
        return <AdminServices />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>

        <button
          className={section === "services" ? "active" : ""}
          onClick={() => setSection("services")}
        >
          Services
        </button>

        <button
          className={section === "projects" ? "active" : ""}
          onClick={() => setSection("projects")}
        >
          Projects
        </button>

        <button
          className={section === "technologies" ? "active" : ""}
          onClick={() => setSection("technologies")}
        >
          Technologies
        </button>

        <button
          className={section === "team" ? "active" : ""}
          onClick={() => setSection("team")}
        >
          Team
        </button>

        <button
          className={section === "contact" ? "active" : ""}
          onClick={() => setSection("contact")}
        >
          Contact
        </button>

        <button
          className={section === "testimonials" ? "active" : ""}
          onClick={() => setSection("testimonials")}
        >
          Testimonials
        </button>

        <button
          className={section === "company" ? "active" : ""}
          onClick={() => setSection("company")}
        >
          Company Info
        </button>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="admin-content">
        {renderSection()}
      </main>
    </div>
  );
}
