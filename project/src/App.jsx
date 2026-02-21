import { useEffect, useMemo, useState } from "react";
import "./App.css";

import About from "./about";
import Services from "./services";
import Projects from "./project";
import Technologies from "./technologies";
import TeamPage from "./team";
import ContactPage from "./contact";
import Testimonials from "./testimonials";
import AdminPage from "./adminpage";
import api, { clearAdminToken, hasAdminToken, saveAdminToken, toAbsoluteMediaUrl } from "./api";

const DEFAULT_COMPANY_INFO = {
  companyName: "Raj Comp Technologies",
  about:
    "Raj Comp is a full-service technology company delivering secure, scalable, and modern digital products for ambitious businesses.",
  email: "support@rajcomp.com",
  phone: "+91 98765 43210",
  address: "College Road, Near Canada Corner, Nashik",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
};

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "technologies", label: "Technologies" },
  { key: "team", label: "Team" },
  { key: "contact", label: "Contact" },
];

function Navbar({
  currentPage,
  setPage,
  brandName,
  isAdminLoggedIn,
  onOpenAdmin,
  showAdminLogin,
  setShowAdminLogin,
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <button className="brand-btn" onClick={() => setPage("home")}>
        <span className="brand-mark" />
        <span>{brandName}</span>
      </button>

      <button className="menu-toggle" onClick={() => setOpen((prev) => !prev)}>
        Menu
      </button>

      <nav className={`site-nav ${open ? "open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={currentPage === item.key ? "active" : ""}
            onClick={() => {
              setPage(item.key);
              setOpen(false);
            }}
          >
            {item.label}
          </button>
        ))}
        {!isAdminLoggedIn && (
          <button className="ghost-btn" onClick={() => setShowAdminLogin(!showAdminLogin)}>
            Admin Login
          </button>
        )}
        {isAdminLoggedIn && (
          <button className="ghost-btn" onClick={onOpenAdmin}>
            Admin
          </button>
        )}
      </nav>
    </header>
  );
}

function Hero({ companyInfo, onPrimaryClick, onSecondaryClick }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <p className="eyebrow">Trusted Engineering Partner</p>
        <h1>Build Better Digital Products With {companyInfo.companyName}</h1>
        <p>{companyInfo.about}</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={onPrimaryClick}>
            Start Your Project
          </button>
          <button className="secondary-btn-dark" onClick={onSecondaryClick}>
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}

function CapabilityBand() {
  const items = [
    {
      title: "Product Engineering",
      text: "From idea to launch, we build web platforms with performance and maintainability.",
    },
    {
      title: "Cloud Deployment",
      text: "Reliable deployments, CI/CD pipelines, monitoring, and scalable hosting architecture.",
    },
    {
      title: "Support and Growth",
      text: "Post-launch improvements, analytics-driven optimization, and proactive support.",
    },
  ];

  return (
    <section className="capability-band">
      {items.map((item) => (
        <article key={item.title} className="capability-card">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}

function HomeServicesPreview({ onViewAll }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api
      .get("/api/services")
      .then((res) => setServices((res.data.data || []).slice(0, 3)))
      .catch(() => setServices([]));
  }, []);

  return (
    <section className="home-section">
      <div className="section-head compact">
        <h2 className="section-title">Core Services</h2>
        <p>High-impact solutions tailored for real business outcomes.</p>
      </div>
      <div className="home-grid three">
        {services.map((service) => (
          <article key={service.id} className="home-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
      <div className="section-action">
        <button className="link-btn" onClick={onViewAll}>
          View All Services
        </button>
      </div>
    </section>
  );
}

function HomeProjectsPreview({ onViewAll }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api
      .get("/api/projects/featured")
      .then((res) => {
        const featured = res.data.data || [];
        if (featured.length > 0) {
          setProjects(featured.slice(0, 3));
          return;
        }

        return api.get("/api/projects").then((fallback) => {
          setProjects((fallback.data.data || []).slice(0, 3));
        });
      })
      .catch(() => setProjects([]));
  }, []);

  return (
    <section className="home-section tinted">
      <div className="section-head compact">
        <h2 className="section-title">Featured Work</h2>
        <p>Selected product delivery experience across different domains.</p>
      </div>
      <div className="home-grid three">
        {projects.map((project) => (
          <article key={project.id} className="home-card media">
            <img
              src={
                toAbsoluteMediaUrl(project.imageUrl) ||
                "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
              }
              alt={project.title}
            />
            <div className="content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="section-action">
        <button className="link-btn" onClick={onViewAll}>
          Explore Projects
        </button>
      </div>
    </section>
  );
}

function Footer({
  companyInfo,
  setPage,
  isAdminLoggedIn,
  showAdminLogin,
  setShowAdminLogin,
  adminUser,
  setAdminUser,
  adminPass,
  setAdminPass,
  loginError,
  handleAdminLogin,
  handleAdminLogout,
}) {
  const social = companyInfo?.socialLinks || {};
  const mapQuery = encodeURIComponent(companyInfo?.address || "India");
  const navLinks = useMemo(() => NAV_ITEMS.filter((item) => item.key !== "home"), []);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h3>About</h3>
          <p>{companyInfo?.about || DEFAULT_COMPANY_INFO.about}</p>
          <iframe
            title="company-location-map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
          />
        </section>

        <section>
          <h3>Contact</h3>
          <ul>
            <li>{companyInfo?.companyName || DEFAULT_COMPANY_INFO.companyName}</li>
            <li>{companyInfo?.email || DEFAULT_COMPANY_INFO.email}</li>
            <li>{companyInfo?.phone || DEFAULT_COMPANY_INFO.phone}</li>
            <li>{companyInfo?.address || DEFAULT_COMPANY_INFO.address}</li>
          </ul>
          {!isAdminLoggedIn && (
            <button className="footer-admin-btn" onClick={() => setShowAdminLogin(!showAdminLogin)}>
              {showAdminLogin ? "Close Login" : "Admin Login"}
            </button>
          )}
          {isAdminLoggedIn && (
            <div className="footer-admin-actions">
              <button className="footer-admin-btn" onClick={() => setPage("admin")}>
                Open Admin
              </button>
              <button className="footer-admin-btn muted" onClick={handleAdminLogout}>
                Logout
              </button>
            </div>
          )}
        </section>

        <section>
          <h3>Navigate</h3>
          <ul>
            {navLinks.map((item) => (
              <li key={item.key}>
                <button onClick={() => setPage(item.key)}>{item.label}</button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Connect</h3>
          <div className="social-links">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noreferrer">
                X
              </a>
            )}
          </div>
        </section>
      </div>

      {!isAdminLoggedIn && showAdminLogin && (
        <form className="admin-login-panel" onSubmit={handleAdminLogin}>
          <h4>Administrator Sign In</h4>
          <div className="admin-login-grid">
            <input
              type="email"
              placeholder="Admin email"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
            />
            <button type="submit" className="primary-btn">
              Login
            </button>
          </div>
          {loginError && <p className="login-error">{loginError}</p>}
        </form>
      )}

      <div className="copyright">
        <p>
          {new Date().getFullYear()} {companyInfo?.companyName || DEFAULT_COMPANY_INFO.companyName}. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}

function Home({ companyInfo, setPage }) {
  return (
    <>
      <Hero companyInfo={companyInfo} onPrimaryClick={() => setPage("contact")} onSecondaryClick={() => setPage("services")} />
      <CapabilityBand />
      <HomeServicesPreview onViewAll={() => setPage("services")} />
      <HomeProjectsPreview onViewAll={() => setPage("projects")} />
      <Testimonials compact />
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [companyInfo, setCompanyInfo] = useState(DEFAULT_COMPANY_INFO);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(hasAdminToken());
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const activePage = page === "admin" && !isAdminLoggedIn ? "home" : page;

  useEffect(() => {
    const onAuthExpired = () => {
      clearAdminToken();
      setIsAdminLoggedIn(false);
      setShowAdminLogin(false);
      setPage("home");
      setLoginError("Session expired. Please login again.");
    };

    window.addEventListener("admin-auth-expired", onAuthExpired);
    return () => window.removeEventListener("admin-auth-expired", onAuthExpired);
  }, []);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const response = await api.get("/api/company");
        const data = response?.data?.data;
        if (data) {
          setCompanyInfo({
            ...DEFAULT_COMPANY_INFO,
            ...data,
            socialLinks: {
              ...DEFAULT_COMPANY_INFO.socialLinks,
              ...(data.socialLinks || {}),
            },
          });
        }
      } catch (error) {
        console.error("Unable to fetch company info", error);
      }
    };

    loadCompanyInfo();
    window.addEventListener("company-info-updated", loadCompanyInfo);
    return () => window.removeEventListener("company-info-updated", loadCompanyInfo);
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await api.post("/api/auth/login", {
        email: adminUser.trim(),
        password: adminPass,
      });

      const token = response?.data?.token;
      if (!token) {
        setLoginError("Login failed. Token not received.");
        return;
      }

      saveAdminToken(token);
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setPage("admin");
      setAdminPass("");
    } catch (err) {
      clearAdminToken();
      setIsAdminLoggedIn(false);
      const errMsg = err?.response?.data?.message || "Invalid email or password.";
      setLoginError(errMsg);
    }
  };

  const handleAdminLogout = () => {
    clearAdminToken();
    setIsAdminLoggedIn(false);
    setShowAdminLogin(false);
    setAdminPass("");
    setPage("home");
  };

  return (
    <div className="app-shell">
      {activePage !== "admin" && (
        <Navbar
          currentPage={activePage}
          setPage={setPage}
          brandName={companyInfo.companyName || DEFAULT_COMPANY_INFO.companyName}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdmin={() => setPage("admin")}
          showAdminLogin={showAdminLogin}
          setShowAdminLogin={setShowAdminLogin}
        />
      )}

      <main>
        {activePage === "home" && <Home companyInfo={companyInfo} setPage={setPage} />}
        {activePage === "about" && <About />}
        {activePage === "services" && <Services />}
        {activePage === "projects" && <Projects />}
        {activePage === "technologies" && <Technologies />}
        {activePage === "team" && <TeamPage />}
        {activePage === "contact" && <ContactPage />}
        {activePage === "admin" && isAdminLoggedIn && <AdminPage onLogout={handleAdminLogout} />}
      </main>

      {activePage !== "admin" && (
        <Footer
          companyInfo={companyInfo}
          setPage={setPage}
          isAdminLoggedIn={isAdminLoggedIn}
          showAdminLogin={showAdminLogin}
          setShowAdminLogin={setShowAdminLogin}
          adminUser={adminUser}
          setAdminUser={setAdminUser}
          adminPass={adminPass}
          setAdminPass={setAdminPass}
          loginError={loginError}
          handleAdminLogin={handleAdminLogin}
          handleAdminLogout={handleAdminLogout}
        />
      )}
    </div>
  );
}
