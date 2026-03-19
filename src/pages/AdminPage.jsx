import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gradientBg from "../assets/bg_greidant.png";
import "./admin.css";

const loginFormState = {
  username: "",
  password: "",
};

const statusState = {
  type: "idle",
  message: "",
};

const PAGE_SIZE = 5;

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const getInitials = (value) =>
  String(value || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const truncate = (value, maxLength) => {
  const normalized = String(value || "").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
};

const getReplyHref = (submission) => {
  if (!submission?.email) {
    return null;
  }

  const subject = submission.subject
    ? `Re: ${submission.subject}`
    : "Re: Portfolio enquiry";

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    submission.email,
  )}&su=${encodeURIComponent(subject)}`;
};

function AdminPage() {
  const [authState, setAuthState] = useState("loading");
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState(loginFormState);
  const [loginStatus, setLoginStatus] = useState(statusState);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsStatus, setSubmissionsStatus] = useState({
    type: "idle",
    message: "",
  });

  const loadSession = async () => {
    setAuthState("loading");

    try {
      const response = await fetch("/api/admin/session");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not verify admin session.");
      }

      if (!result.authenticated) {
        setUsername("");
        setAuthState("unauthenticated");
        return false;
      }

      setUsername(result.username || "admin");
      setAuthState("authenticated");
      return true;
    } catch (error) {
      setLoginStatus({
        type: "error",
        message: error.message || "Could not verify admin session.",
      });
      setUsername("");
      setAuthState("unauthenticated");
      return false;
    }
  };

  const loadSubmissions = async () => {
    setSubmissionsStatus({
      type: "loading",
      message: "Loading submissions...",
    });

    try {
      const response = await fetch("/api/admin/submissions");
      const result = await response.json();

      if (response.status === 401) {
        setAuthState("unauthenticated");
        setSubmissions([]);
        setSelectedSubmissionId(null);
        setSubmissionsStatus(statusState);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Could not load submissions.");
      }

      const nextSubmissions = result.submissions || [];
      setSubmissions(nextSubmissions);
      setCurrentPage(1);
      setSelectedSubmissionId((current) => {
        if (
          current &&
          nextSubmissions.some((submission) => submission.id === current)
        ) {
          return current;
        }

        return nextSubmissions[0]?.id || null;
      });
      setSubmissionsStatus(statusState);
    } catch (error) {
      setSubmissions([]);
      setSelectedSubmissionId(null);
      setSubmissionsStatus({
        type: "error",
        message: error.message || "Could not load submissions.",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const isAuthenticated = await loadSession();

      if (mounted && isAuthenticated) {
        await loadSubmissions();
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginStatus({
      type: "loading",
      message: "Signing in...",
    });

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      setFormData(loginFormState);
      setLoginStatus(statusState);
      setUsername(result.username || formData.username);
      setAuthState("authenticated");
      await loadSubmissions();
    } catch (error) {
      setLoginStatus({
        type: "error",
        message: error.message || "Login failed.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      setUsername("");
      setSubmissions([]);
      setSelectedSubmissionId(null);
      setCurrentPage(1);
      setAuthState("unauthenticated");
      setLoginStatus(statusState);
      setSubmissionsStatus(statusState);
    }
  };

  const totalPages = Math.max(1, Math.ceil(submissions.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const latestSubmission = submissions[0];
  const selectedSubmission =
    submissions.find((submission) => submission.id === selectedSubmissionId) ||
    latestSubmission ||
    null;
  const replyHref = getReplyHref(selectedSubmission);
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleSubmissions = submissions.slice(
    pageStartIndex,
    pageStartIndex + PAGE_SIZE,
  );

  return (
    <div className="admin-shell">
      <div className="admin-shell__bg">
        <img
          className="admin-shell__bg-image"
          src={gradientBg}
          alt="Admin background gradient"
        />
      </div>
      <main className="admin-layout">
        <header className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-brand__mark">BV</div>
            <div>
              <p className="admin-brand__eyebrow">Bala Vigness</p>
              <p className="admin-brand__label">Portfolio Admin</p>
            </div>
          </div>
          <div className="admin-hero__actions">
            <Link to="/" className="admin-link">
              Back to portfolio
            </Link>
            {authState === "authenticated" ? (
              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : null}
          </div>
        </header>

        {authState !== "authenticated" ? (
          <section className="admin-card admin-login">
            <div>
              <p className="admin-card__eyebrow">Admin Login</p>
              <h2>Sign in to open the inbox</h2>
              <p className="admin-card__copy">
                Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values configured
                in your environment.
              </p>
            </div>

            <form className="admin-form" onSubmit={handleLogin}>
              <label className="admin-field">
                <span>Username</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="admin-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </label>
              <button
                type="submit"
                className="admin-button"
                disabled={
                  loginStatus.type === "loading" || authState === "loading"
                }
              >
                {loginStatus.type === "loading" || authState === "loading"
                  ? "Signing in..."
                  : "Enter admin"}
              </button>
              <p
                className={`admin-status ${
                  loginStatus.type === "error" ? "admin-status--error" : ""
                }`}
              >
                {loginStatus.message}
              </p>
            </form>
          </section>
        ) : (
          <section className="admin-dashboard">
            <div className="admin-overview">
              <article className="admin-card admin-overview__hero">
                <p className="admin-card__eyebrow">Inbox Overview</p>
                <h2>{submissions.length} active conversations</h2>
                <p className="admin-card__copy">
                  A focused review space for portfolio queries. Open a thread on
                  the left and keep the message detail isolated on the right.
                </p>
                <div className="admin-overview__meta">
                  <div className="admin-overview__item">
                    <span>Signed in</span>
                    <strong>{username}</strong>
                  </div>
                  <div className="admin-overview__item">
                    <span>Latest query</span>
                    <strong>
                      {latestSubmission
                        ? formatDate(
                            latestSubmission.createdAt ||
                              latestSubmission.receivedAt,
                          )
                        : "No submissions yet"}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="admin-card admin-overview__actions">
                <p className="admin-card__eyebrow">Control</p>
                <h2>Stay current</h2>
                <p className="admin-card__copy">
                  Pull the latest Firestore data whenever you need it.
                </p>
                <button
                  type="button"
                  className="admin-button"
                  onClick={loadSubmissions}
                  disabled={submissionsStatus.type === "loading"}
                >
                  {submissionsStatus.type === "loading"
                    ? "Refreshing..."
                    : "Refresh inbox"}
                </button>
              </article>
            </div>

            {submissionsStatus.message ? (
              <p
                className={`admin-status ${
                  submissionsStatus.type === "error"
                    ? "admin-status--error"
                    : ""
                }`}
              >
                {submissionsStatus.message}
              </p>
            ) : null}

            <section className="admin-inbox">
              <aside className="admin-card admin-inbox__list">
                <div className="admin-section__header">
                  <div>
                    <p className="admin-card__eyebrow">Queries</p>
                    <h2>Inbox</h2>
                  </div>
                  <span className="admin-section__count">{submissions.length}</span>
                </div>

                {submissions.length === 0 ? (
                  <div className="admin-empty-state">
                    <p>No contact submissions yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="admin-thread-list">
                      {visibleSubmissions.map((submission) => {
                        const isActive = submission.id === selectedSubmission?.id;

                        return (
                          <button
                            key={submission.id}
                            type="button"
                            className={`admin-thread ${isActive ? "admin-thread--active" : ""}`}
                            onClick={() => setSelectedSubmissionId(submission.id)}
                          >
                            <div className="admin-thread__avatar">
                              {getInitials(submission.name)}
                            </div>
                            <div className="admin-thread__content">
                              <div className="admin-thread__row">
                                <strong>{submission.name || "Unknown sender"}</strong>
                                <span>
                                  {formatDate(
                                    submission.createdAt || submission.receivedAt,
                                  )}
                                </span>
                              </div>
                              <p>{submission.subject || "No subject"}</p>
                              <small>
                                {truncate(submission.message, 68) || "No message body."}
                              </small>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="admin-pagination">
                      <button
                        type="button"
                        className="admin-pagination__button"
                        onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <span className="admin-pagination__label">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        className="admin-pagination__button"
                        onClick={() =>
                          setCurrentPage((current) => Math.min(totalPages, current + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </aside>

              <section className="admin-card admin-inbox__detail">
                <div className="admin-section__header">
                  <div>
                    <p className="admin-card__eyebrow">Selected Query</p>
                    <h2>{selectedSubmission?.subject || "Nothing selected"}</h2>
                  </div>
                  {replyHref ? (
                    <a
                      className="admin-link"
                      href={replyHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Reply in Gmail
                    </a>
                  ) : null}
                </div>

                {selectedSubmission ? (
                  <div className="admin-detail">
                    <div className="admin-detail__hero">
                      <div className="admin-detail__avatar">
                        {getInitials(selectedSubmission.name)}
                      </div>
                      <div className="admin-detail__meta">
                        <h3>{selectedSubmission.name || "Unknown sender"}</h3>
                        <p>
                          {selectedSubmission.email || "No email provided"}
                        </p>
                        <span>
                          {formatDate(
                            selectedSubmission.createdAt ||
                              selectedSubmission.receivedAt,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="admin-detail__grid">
                      <article className="admin-detail__panel">
                        <span>Subject</span>
                        <strong>{selectedSubmission.subject || "No subject"}</strong>
                      </article>
                      <article className="admin-detail__panel">
                        <span>IP Address</span>
                        <strong>{selectedSubmission.ipAddress || "Unknown"}</strong>
                      </article>
                    </div>

                    <article className="admin-detail__message">
                      <span>Message</span>
                      <p>{selectedSubmission.message || "No message body."}</p>
                    </article>
                  </div>
                ) : (
                  <div className="admin-empty-state admin-empty-state--detail">
                    <p>Select a query from the inbox to inspect it here.</p>
                  </div>
                )}
              </section>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
