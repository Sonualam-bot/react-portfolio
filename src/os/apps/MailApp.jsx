import { useState } from "react";
import { useOS } from "../OSContext";
import { SendIcon } from "../icons";

const FORM_ENDPOINT = "https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5";

// An email client that actually sends: posts to the same form endpoint.
function MailApp() {
  const { notify } = useOS();
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
      notify({ title: "Message sent", message: "Thanks for writing! I'll reply soon." });
    } catch {
      setStatus("error");
    }
  };

  const statusText = {
    idle: "Ready",
    sending: "Sending message...",
    sent: "Message sent.",
    error: "Couldn't send. Check your connection and try again.",
  }[status];

  if (status === "sent") {
    return (
      <div className="mail">
        <div className="mail-sent">
          <SendIcon size={48} />
          <h3>Your message has been sent.</h3>
          <p>Thanks for reaching out. I&apos;ll get back to you soon.</p>
          <button type="button" className="xp-btn" onClick={() => setStatus("idle")}>
            New Message
          </button>
        </div>
        <div className="statusbar">
          <span>{statusText}</span>
        </div>
      </div>
    );
  }

  return (
    <form className="mail" onSubmit={handleSubmit}>
      <div className="mail-toolbar">
        <button type="submit" className="toolbar-button" disabled={status === "sending"}>
          <SendIcon size={28} />
          <span>Send</span>
        </button>
      </div>

      <div className="mail-headers">
        <label className="mail-row">
          <span>To:</span>
          <input className="xp-field" value="Md Sonu Alam" readOnly tabIndex={-1} />
        </label>
        <label className="mail-row">
          <span>From:</span>
          <input className="xp-field" name="name" autoComplete="name" placeholder="Your name" required />
        </label>
        <label className="mail-row">
          <span>Reply to:</span>
          <input
            className="xp-field"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="mail-row">
          <span>Subject:</span>
          <input className="xp-field" name="subject" required />
        </label>
      </div>

      <textarea
        className="mail-body"
        name="message"
        aria-label="Message"
        placeholder="Write your message here..."
        required
      />

      <div className="statusbar" aria-live="polite">
        <span className={status === "error" ? "is-error" : undefined}>{statusText}</span>
      </div>
    </form>
  );
}

export default MailApp;
