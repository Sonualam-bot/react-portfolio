import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import SocialLinks from "./SocialLinks";

const FORM_ENDPOINT = "https://getform.io/f/c2cca6fe-6b25-423a-8360-3f2400dc1ff5";

function Contact() {
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
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="container-page py-24 sm:py-32">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <SectionHeader eyebrow="Contact" title="Let's build something.">
            Have a role, a project, or a question? Send a note and I&apos;ll get
            back to you.
          </SectionHeader>
          <Reveal delay={180}>
            <SocialLinks className="-ml-3 -mt-6" />
          </Reveal>
        </div>

        <Reveal delay={120} className="rounded-[1.75rem] bg-surface p-6 shadow-card sm:p-8">
          <div aria-live="polite">
            {status === "sent" ? (
              <div className="flex min-h-[22rem] flex-col items-start justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <FiCheck size={24} aria-hidden />
                </span>
                <p className="title-2 mt-5">Message sent.</p>
                <p className="mt-2 text-secondary">
                  Thanks for reaching out. I&apos;ll reply soon.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn btn-secondary mt-8"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="caption font-medium">Name</span>
                  <input className="field" type="text" name="name" autoComplete="name" required />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="caption font-medium">Email</span>
                  <input
                    className="field peer"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                  />
                  <span className="caption hidden text-danger peer-[:user-invalid]:block">
                    Enter an email address like name@example.com.
                  </span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="caption font-medium">Message</span>
                  <textarea className="field resize-y" name="message" rows="6" required />
                </label>

                {status === "error" && (
                  <p className="caption text-danger">
                    Your message couldn&apos;t be sent. Check your connection and
                    try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-primary mt-1 w-full disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
