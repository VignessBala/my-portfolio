import React, { useEffect, useState } from "react";
import { profile } from "../../data/profile";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

const initialErrors = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldMessages = {
  name: {
    empty: "Hey, what should I call you?",
  },
  email: {
    empty: "Drop your email so I can write back.",
    invalid: "That email looks off. Add a real inbox with an @ and domain.",
  },
  subject: {
    empty: "Give this message a quick headline.",
  },
  message: {
    empty: "Don't leave me guessing. Say what's on your mind.",
  },
};

const getFieldError = (name, value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fieldMessages[name]?.empty || "";
  }

  if (name === "email" && !emailPattern.test(trimmedValue)) {
    return fieldMessages.email.invalid;
  }

  return "";
};

const Form = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [activeErrorField, setActiveErrorField] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const activeFieldError = activeErrorField ? errors[activeErrorField] : "";
  const feedbackMessage = status.type === "error" ? status.message : activeFieldError;

  useEffect(() => {
    if (status.type !== "success") {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setStatus({ type: "idle", message: "" });
    }, 2200);

    return () => clearTimeout(timeoutId);
  }, [status.type]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    const nextFieldError = getFieldError(name, value);

    if (status.type === "error" || status.type === "success") {
      setStatus({ type: "idle", message: "" });
    }

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: nextFieldError,
      }));

      if (!nextFieldError && activeErrorField === name) {
        setActiveErrorField("");
      } else if (nextFieldError) {
        setActiveErrorField(name);
      }
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleBlur = ({ target }) => {
    const { name, value } = target;

    if (!(name in initialErrors)) {
      return;
    }

     const nextFieldError = getFieldError(name, value);

    setErrors((current) => ({
      ...current,
      [name]: nextFieldError,
    }));

    setActiveErrorField(nextFieldError ? name : "");
  };

  const handleFocus = ({ target }) => {
    const { name } = target;

    if (errors[name]) {
      setActiveErrorField(name);
    }
  };

  const validateForm = () => {
    const nextErrors = {
      name: getFieldError("name", formData.name),
      email: getFieldError("email", formData.email),
      subject: getFieldError("subject", formData.subject),
      message: getFieldError("message", formData.message),
    };

    setErrors(nextErrors);

    const firstInvalidField = Object.entries(nextErrors).find(([, error]) => error)?.[0] || "";
    setActiveErrorField(firstInvalidField);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus({ type: "idle", message: "" });
      return;
    }

    setStatus({ type: "loading", message: "" });

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
      setErrors(initialErrors);
      setActiveErrorField("");
      setStatus({ type: "success", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || `The form is unavailable. Email ${profile.email} directly.`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="contact_form">
        <div className="contact_two">
          <div className={`contact_input${errors.name ? " contact_input--hasError" : ""}`}>
            <div className="contact_field">
            <input
              type="text"
              name="name"
              placeholder=" "
              className={`contact_box${errors.name ? " contact_box--invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name && activeErrorField === "name" ? "contact-feedback" : undefined}
            ></input>
            <label className="contact_label">Name</label>
            </div>
          </div>
          <div className={`contact_input${errors.email ? " contact_input--hasError" : ""}`}>
            <div className="contact_field">
            <input
              type="text"
              name="email"
              placeholder=" "
              className={`contact_box${errors.email ? " contact_box--invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              inputMode="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email && activeErrorField === "email" ? "contact-feedback" : undefined}
            ></input>
            <label className="contact_label">Email</label>
            </div>
          </div>
        </div>
        <div className="contat_single">
          <div className={`contact_input${errors.subject ? " contact_input--hasError" : ""}`}>
            <div className="contact_field">
            <input
              type="text"
              name="subject"
              placeholder=" "
              className={`contact_box${errors.subject ? " contact_box--invalid" : ""}`}
              value={formData.subject}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject && activeErrorField === "subject" ? "contact-feedback" : undefined}
            ></input>
            <label className="contact_label">Subject</label>
            </div>
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
          <div className={`contact_input${errors.message ? " contact_input--hasError" : ""}`}>
            <div className="contact_field contact_field--textarea">
            <textarea
              type="text"
              name="message"
              placeholder=" "
              className={`contact_box height_area${errors.message ? " contact_box--invalid" : ""}`}
              value={formData.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message && activeErrorField === "message" ? "contact-feedback" : undefined}
            ></textarea>
            <label className="contact_label">Your Message</label>
            </div>
          </div>
        </div>
        <div className="contat_single">
          <div className="contact_input">
            <button
              type="submit"
              className={`contact_submit contact_submit--${status.type}`}
              disabled={status.type === "loading"}
              aria-busy={status.type === "loading"}
            >
              <span className="contact_submitContent">
                {status.type === "loading" ? (
                  <>
                    <span className="contact_loader" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    <span className="contact_submitLabel">Sending</span>
                  </>
                ) : status.type === "success" ? (
                  <>
                    <span className="contact_successIcon" aria-hidden="true"></span>
                    <span className="contact_submitLabel">Sent</span>
                  </>
                ) : status.type === "error" ? (
                  <span className="contact_submitLabel">Try Again</span>
                ) : (
                  <span className="contact_submitLabel">Send A Message</span>
                )}
              </span>
            </button>
          </div>
        </div>
        {feedbackMessage ? (
          <div className="contat_single">
            <div className="contact_input">
              <p
                className={`contact_feedback${
                  status.type === "error" ? " contact_feedback--statusError" : " contact_feedback--validation"
                }`}
                id="contact-feedback"
              >
                <span className="contact_feedbackIcon" aria-hidden="true">
                  {status.type === "error" ? "!" : "i"}
                </span>
                <span>{feedbackMessage}</span>
              </p>
            </div>
          </div>
        ) : null}
        {status.type === "error" ? (
          null
        ) : null}
      </div>
    </form>
  );
};

export default Form;
