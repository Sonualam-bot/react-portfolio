import { workDetails } from "../../data/work";

const rule = (text, char) => char.repeat(Math.max(text.length, 24));

function toText() {
  const heading = "EXPERIENCE & EDUCATION";
  const entries = workDetails.map((item) => {
    const lines = [item.title];
    if (item.company) lines.push(item.company);
    lines.push(`${item.duration}  (${item.year})`);
    lines.push(rule(item.title, "-"));
    lines.push(item.details);
    return lines.join("\n");
  });
  return [heading, rule(heading, "="), "", entries.join("\n\n\n")].join("\n");
}

// A read-only Notepad document.
function ExperienceApp() {
  return (
    <div className="notepad">
      <pre className="notepad-text" tabIndex={0}>
        {toText()}
      </pre>
    </div>
  );
}

export default ExperienceApp;
