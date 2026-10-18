import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { toast } from "../game/bridge";

const FORM_ENDPOINT = "https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5";

// A radio message that really sends: posts to the form endpoint.
function ContactForm() {
  // idle | sending | sent | error
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus("sent");
      toast("Message received", "Thanks for writing! I'll reply soon.", "good");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-sent">
        <FiSend aria-hidden />
        <h3>Transmission received.</h3>
        <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button type="button" className="btn btn-ghost-ink" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact" onSubmit={handleSubmit}>
      <div className="contact-row">
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Reply to</span>
          <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input name="subject" required />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} required />
      </label>
      <div className="contact-foot">
        <span className={`contact-status ${status === "error" ? "is-error" : ""}`} aria-live="polite">
          {status === "sending" && "Transmitting…"}
          {status === "error" && "Couldn't send. Check your connection and try again."}
        </span>
        <button type="submit" className="btn btn-ink" disabled={status === "sending"}>
          <FiSend aria-hidden /> Transmit
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
