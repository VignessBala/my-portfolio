import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

function ContactForm({ email }) {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong while sending your message.");
      }

      setFormData(initialForm);
      setStatus({
        type: "success",
        message: "Message sent. Bala will get back to you soon.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          `The form is unavailable right now. Email directly at ${email}.`,
      });
    }
  };

  return (
    <form className="contact-form-card" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <label className="field">
        <span>Subject</span>
        <input
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Project, role, or collaboration"
          required
        />
      </label>

      <label className="field field-hidden" aria-hidden="true">
        <span>Company</span>
        <input
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          tabIndex="-1"
          autoComplete="off"
        />
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          name="message"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me what you are building or hiring for."
          required
        />
      </label>

      <div className="form-footer">
        <button
          className="button"
          type="submit"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sending..." : "Send Message"}
        </button>

        <p className={`form-status status-${status.type}`} aria-live="polite">
          {status.message}
        </p>
      </div>
    </form>
  );
}

export default ContactForm;
