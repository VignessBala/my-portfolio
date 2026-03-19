import React, { useState } from "react";
import { profile } from "../../data/profile";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

const Form = () => {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = ({ target }) => {
    const { name, value } = target;
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
        throw new Error(result.error || "Message sending failed.");
      }

      setFormData(initialForm);
      setStatus({ type: "success", message: "Message sent successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || `The form is unavailable. Email ${profile.email} directly.`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="contact_form">
        <div className="contact_two">
          <div className="contact_input">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="contact_box"
              value={formData.name}
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className="contact_input">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="contact_box"
              value={formData.email}
              onChange={handleChange}
              required
            ></input>
          </div>
        </div>
        <div className="contat_single">
          <div className="contact_input">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="contact_box"
              value={formData.subject}
              onChange={handleChange}
              required
            ></input>
          </div>
        </div>
        <div className="contat_single" style={{ display: "none" }}>
          <div className="contact_input">
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="contact_box"
              value={formData.company}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            ></input>
          </div>
        </div>
        <div className="contat_single">
          <div className="contact_input">
            <textarea
              type="text"
              name="message"
              placeholder="Your Message"
              className="contact_box height_area"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="contat_single">
          <div className="contact_input">
            <button type="submit" className="contact_submit" disabled={status.type === "loading"}>
              <span className="contact_span">
                {status.type === "loading" ? "Sending..." : "Send A Message"}
              </span>
            </button>
          </div>
        </div>
        <div className="contat_single">
          <div className="contact_input">
            <p className="contact_span">{status.message}</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
