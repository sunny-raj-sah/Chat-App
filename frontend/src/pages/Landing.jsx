import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../chat-theme.css";
import "./landing.css";

import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/landing/AuthModal";

/* ------------------------------------------------------------------
   Content — edit the data below, the layout updates automatically.
------------------------------------------------------------------- */

const LINKS = {
  repo: "https://github.com/sunny-raj-sah/Chat-App",
//   live: "https://chat-app-real-time-chat-application-woad.vercel.app/login",
  portfolio: "https://portfolio-eight-vert-40.vercel.app/#projects",
  blog:"https://hashnode.com/@sunnyraj"
};

const STATS = [
  { value: "Real-time", label: "Socket.IO messaging" },
  { value: "JWT", label: "REST + socket auth" },
  { value: "7 days", label: "Token lifetime" },
  { value: "30 / page", label: "Paginated history" },
];

const FEATURES = [
  {
    icon: "bi-lightning-charge-fill",
    title: "Real-time messaging",
    text: "Messages are persisted to MongoDB first, then broadcast to the conversation room over Socket.IO.",
  },
  {
    icon: "bi-shield-lock-fill",
    title: "Secure authentication",
    text: "bcrypt-hashed passwords and JWTs shared across protected REST routes and authenticated sockets.",
  },
  {
    icon: "bi-broadcast",
    title: "Presence & typing",
    text: "Online/offline state with last seen, plus transient typing:start / typing:stop events.",
  },
  {
    icon: "bi-people-fill",
    title: "One-to-one conversations",
    text: "Search users by name or email, reuse existing conversations, and get live previews and reordering.",
  },
  {
    icon: "bi-trash3-fill",
    title: "Ownership-checked deletes",
    text: "The server verifies the sender before deleting, then syncs the change to the room in real time.",
  },
  {
    icon: "bi-emoji-smile-fill",
    title: "Responsive UI",
    text: "Bootstrap 5 interface with an emoji picker and a mobile-friendly list / chat layout.",
  },
];

const RECRUITER_HIGHLIGHTS = [
  {
    icon: "bi-diagram-3-fill",
    title: "REST + WebSockets, each where it fits",
    text: "REST for auth, search, conversations and history. Socket.IO for messages, typing, presence and deletes.",
  },
  {
    icon: "bi-door-open-fill",
    title: "Per-conversation rooms",
    text: "Events go only to participants of conversation:<id>, and joining is membership-checked on the server.",
  },
  {
    icon: "bi-patch-check-fill",
    title: "Authorization on the backend",
    text: "Conversation membership and message ownership are enforced server-side, never trusted from the client.",
  },
  {
    icon: "bi-cloud-check-fill",
    title: "Deployed end to end",
    text: "Frontend on Vercel, API and sockets on Render, data on MongoDB.",
  },
];

const TECH = [
  { group: "Frontend", items: ["React 19", "React Router", "Context API", "Axios", "Socket.IO Client", "Bootstrap 5"] },
  { group: "Backend", items: ["Node.js", "Express 5", "Socket.IO", "JWT", "bcryptjs"] },
  { group: "Data", items: ["MongoDB", "Mongoose"] },
  { group: "Deploy", items: ["Vercel", "Render"] },
];

/* TODO: replace with your real roles. Leave the array empty to hide the section. */
 
const EXPERIENCE = [
  {
  role: "Full Stack Developer Trainee",
  company: "neoG Camp",
  period: "Apr 2026 — Present",
  points: [
    "Building full-stack applications using React, JavaScript, Node.js, Express.js, and MongoDB.",
    "Implementing REST APIs, JWT authentication, database integration, and real-time features using Socket.IO.",
    "Improving application architecture, responsive UI, and code quality through hands-on development and mentor feedback.",
    "Strengthening problem-solving and engineering skills through coding practice, project development, and technical interview preparation."
  ],
},
  {
    role: "Software Development Intern",
    company: "Dumroo.ai",
    period: "Dec 2025 — Apr 2026",
    points: [
      "Contributed to AI-powered application development using React, TypeScript, and LLM APIs.",
      "Worked on Retrieval-Augmented Generation (RAG) workflows and integrating AI capabilities into application features.",
      "Focused on building responsive frontend components and connecting them with backend services."
    ],
  },
 
];

/* ------------------------------------------------------------------ */

const ChatPreview = () => (
  <div className="lp-preview" aria-hidden="true">
    <div className="lp-preview-head">
      <span className="cw-avatar cw-avatar-ring is-online" style={{ width: 36, height: 36, fontSize: 14 }}>
        A
      </span>
      <div className="lh-sm">
        <div className="fw-semibold small">Aarav</div>
        <div className="small text-secondary d-flex align-items-center gap-1">
          <span className="cw-status-dot is-online" /> Online
        </div>
      </div>
    </div>

    <div className="lp-preview-body cw-message-pane">
      <div className="lp-msg other cw-bubble is-other">Hey! Is the build deployed?</div>
      <div className="lp-msg own cw-bubble is-own">Yes, live on Vercel 🚀</div>
      <div className="lp-msg other cw-bubble is-other">Nice. Sending the link to the team.</div>
      <div className="small cw-typing-label mt-1">
        Aarav is typing
        <span className="cw-typing-dots">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>

    <div className="lp-preview-input">
      <div className="cw-text-input rounded-pill px-3 py-2 small text-secondary flex-grow-1">
        Type a message
      </div>
      <span className="cw-send-btn">
        <i className="bi bi-send-fill" />
      </span>
    </div>
  </div>
);

const Landing = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState(null); // "login" | "register" | null

  const closeAuth = useCallback(() => setAuthMode(null), []);

  const renderAuthButtons = (size = "") =>
    user ? (
      <Link to="/chat" className={`btn btn-primary ${size}`}>
        Open chat <i className="bi bi-arrow-right ms-1" />
      </Link>
    ) : (
      <>
        <button
          type="button"
          className={`btn btn-primary ${size}`}
          onClick={() => setAuthMode("register")}
        >
          Get started
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${size}`}
          onClick={() => setAuthMode("login")}
        >
          Login
        </button>
      </>
    );

  return (
    <div className="lp">
      {/* ---------- Navbar ---------- */}
      <nav className="navbar navbar-expand-md sticky-top lp-nav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 m-0" href="#top">
            <span className="cw-brand-mark">
              <i className="bi bi-chat-dots-fill" />
            </span>
            <span className="cw-brand-word">Chat App</span>
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#lpNav"
            aria-controls="lpNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={(e) => {
              // Works without Bootstrap's JS: toggle the collapse manually
              const el = document.getElementById("lpNav");
              el?.classList.toggle("show");
              e.currentTarget.setAttribute(
                "aria-expanded",
                String(el?.classList.contains("show"))
              );
            }}
          >
            <i className="bi bi-list fs-3" />
          </button>

          <div className="collapse navbar-collapse" id="lpNav">
            <ul className="navbar-nav mx-auto gap-md-2">
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="#engineering">Engineering</a></li>
              <li className="nav-item"><a className="nav-link" href="#stack">Tech stack</a></li>
              {EXPERIENCE.length > 0 && (
                <li className="nav-item"><a className="nav-link" href="#experience">Experience</a></li>
              )}
            </ul>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              {renderAuthButtons("btn-sm")}
            </div>
          </div>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <header id="top" className="lp-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="lp-pill mb-3">
                <i className="bi bi-stars" /> Full-stack project
              </span>
              <h1 className="cw-display lp-title">
                Conversations that arrive{" "}
                <span className="lp-title-accent">the moment you send them.</span>
              </h1>
              <p className="lead text-secondary mt-3 mb-4">
                It is a one-to-one real-time chat app built with React, Node.js, Express, MongoDB and
                Socket.IO — with JWT auth, presence, typing indicators and server-enforced authorization.
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {renderAuthButtons("btn-lg")}
              </div>

              <div className="d-flex flex-wrap gap-3 small">
                <a className="lp-link" href={LINKS.repo} target="_blank" rel="noreferrer">
                  <i className="bi bi-github" /> Source code
                </a>
                {/* <a className="lp-link" href={LINKS.live} target="_blank" rel="noreferrer">
                  <i className="bi bi-box-arrow-up-right" /> Live demo
                </a> */}
                <a
  className="lp-link"
  href={LINKS.blog}
  target="_blank"
  rel="noreferrer"
>
  <i className="bi bi-journal-text" /> Read blog
</a>
                <a className="lp-link" href={LINKS.portfolio} target="_blank" rel="noreferrer">
                  <i className="bi bi-person-badge" /> Portfolio
                </a>
              </div>
            </div>

            <div className="col-lg-6 d-flex justify-content-center">
              <ChatPreview />
            </div>
          </div>

          {/* Stats */}
          <div className="row g-3 mt-4 lp-stats">
            {STATS.map((s) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="lp-stat">
                  <div className="cw-display lp-stat-value">{s.value}</div>
                  <div className="small text-secondary">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ---------- Features ---------- */}
      <section id="features" className="lp-section">
        <div className="container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Features</span>
            <h2 className="cw-display">Everything a modern chat needs</h2>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="lp-card h-100">
                  <span className="lp-icon"><i className={`bi ${f.icon}`} /></span>
                  <h3 className="h6 cw-display fw-bold mt-3">{f.title}</h3>
                  <p className="text-secondary mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- For recruiters ---------- */}
      <section id="engineering" className="lp-section lp-section-alt">
        <div className="container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">For recruiters</span>
            <h2 className="cw-display">What this project demonstrates</h2>
            <p className="text-secondary">
              The decisions behind the app, not just the screens.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {RECRUITER_HIGHLIGHTS.map((h) => (
              <div className="col-md-6" key={h.title}>
                <div className="lp-card lp-card-row h-100">
                  <span className="lp-icon lp-icon-accent"><i className={`bi ${h.icon}`} /></span>
                  <div>
                    <h3 className="h6 cw-display fw-bold">{h.title}</h3>
                    <p className="text-secondary mb-0">{h.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <pre className="lp-arch" aria-label="Architecture diagram">{`React Frontend
   ├─ Axios ───────────► Express REST API ─┐
   └─ Socket.IO Client ► Socket.IO Server ─┤
                                           ▼
                                        MongoDB
                          Users · Conversations · Messages`}</pre>
        </div>
      </section>

      {/* ---------- Tech stack ---------- */}
      <section id="stack" className="lp-section">
        <div className="container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Tech stack</span>
            <h2 className="cw-display">Built with</h2>
          </div>
          <div className="row g-4">
            {TECH.map((t) => (
              <div className="col-sm-6 col-lg-3" key={t.group}>
                <div className="lp-card h-100">
                  <h3 className="h6 cw-display fw-bold mb-3">{t.group}</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {t.items.map((i) => (
                      <span className="lp-chip" key={i}>{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Experience ---------- */}
      {EXPERIENCE.length > 0 && (
        <section id="experience" className="lp-section lp-section-alt">
          <div className="container">
            <div className="lp-section-head">
              <span className="lp-eyebrow">Professional experience</span>
              <h2 className="cw-display">Where I've worked</h2>
            </div>

            <ol className="lp-timeline">
              {EXPERIENCE.map((x) => (
                <li key={`${x.company}-${x.period}`}>
                  <div className="lp-card">
                    <div className="d-flex flex-wrap justify-content-between gap-2">
                      <div>
                        <h3 className="h5 cw-display fw-bold mb-0">{x.role}</h3>
                        <div className="text-primary fw-semibold">{x.company}</div>
                      </div>
                      <span className="lp-chip align-self-start">{x.period}</span>
                    </div>
                    <ul className="text-secondary mt-3 mb-0 ps-3">
                      {x.points.map((p) => (
                        <li key={p} className="mb-1">{p}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="lp-section">
        <div className="container">
          <div className="lp-cta">
            <h2 className="cw-display text-white mb-2">Try it yourself</h2>
            <p className="mb-4 text-white-50">
              Create an account, open a second window, and watch messages, typing and presence sync live.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {user ? (
                <Link to="/chat" className="btn btn-light btn-lg">Open chat</Link>
              ) : (
                <>
                  <button className="btn btn-light btn-lg" onClick={() => setAuthMode("register")}>
                    Create account
                  </button>
                  <button className="btn btn-outline-light btn-lg" onClick={() => setAuthMode("login")}>
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="lp-footer">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2 small">
          <span className="text-secondary">© {new Date().getFullYear()} Chat App — built by Sunny Raj</span>
          <div className="d-flex gap-3">
            <a className="lp-link" href={LINKS.repo} target="_blank" rel="noreferrer">
              <i className="bi bi-github" /> GitHub
            </a>
            <a className="lp-link" href={LINKS.portfolio} target="_blank" rel="noreferrer">
              <i className="bi bi-person-badge" /> Portfolio
            </a>
          </div>
        </div>
      </footer>

      <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={closeAuth} />
    </div>
  );
};

export default Landing;