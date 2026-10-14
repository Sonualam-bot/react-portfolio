import { useState } from "react";
import { BackendApi, FrontEndProjects } from "../../data/projects";
import { useActivation, useOS } from "../OSContext";
import { FolderIcon, GlobeIcon, MailIcon, NotepadIcon, ProfileIcon } from "../icons";

const allItems = [...FrontEndProjects, ...BackendApi];

function TaskPanel({ title, children }) {
  return (
    <section className="taskpanel">
      <h3 className="taskpanel-title">{title}</h3>
      <div className="taskpanel-body">{children}</div>
    </section>
  );
}

function FileItem({ item, selected, onSelect, onOpen }) {
  const handlers = useActivation(onSelect, onOpen);
  const isApi = item.tag === "api";
  return (
    <button
      type="button"
      className={`file-item ${isApi ? "is-api" : ""} ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      {...handlers}
    >
      <span className="file-thumb">
        {isApi ? (
          <GlobeIcon size={40} />
        ) : (
          <img src={item.img} alt="" loading="lazy" draggable="false" />
        )}
      </span>
      <span className="file-name">{item.title.trim()}</span>
    </button>
  );
}

// A file explorer with a task pane, like early-2000s folder windows.
function ProjectsApp() {
  const { open } = useOS();
  const [selectedId, setSelectedId] = useState(null);
  const selected = allItems.find((p) => p.id === selectedId);

  const openItem = (item) => open("viewer", { project: item }, `viewer-${item.id}`);

  const renderGroup = (label, items) => (
    <>
      <h3 className="explorer-group">{label}</h3>
      <ul className="file-grid">
        {items.map((item) => (
          <li key={item.id}>
            <FileItem
              item={item}
              selected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
              onOpen={() => openItem(item)}
            />
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="explorer">
      <div className="explorer-address">
        <span className="explorer-address-label">Address</span>
        <div className="xp-field explorer-address-field">
          <FolderIcon size={16} />
          C:\Documents and Settings\Sonu\My Projects
        </div>
      </div>

      <div className="explorer-main">
        <aside className="taskpane">
          <TaskPanel title="Project Tasks">
            {selected ? (
              <ul className="task-links">
                <li>
                  <button type="button" className="task-link" onClick={() => openItem(selected)}>
                    Show project details
                  </button>
                </li>
                <li>
                  <a className="task-link" href={selected.liveLink} target="_blank" rel="noreferrer">
                    {selected.tag === "api" ? "Open the API docs" : "Open the live site"}
                  </a>
                </li>
                {selected.github && (
                  <li>
                    <a className="task-link" href={selected.github} target="_blank" rel="noreferrer">
                      View the source code
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="taskpanel-hint">Select a project to see what you can do with it.</p>
            )}
          </TaskPanel>

          <TaskPanel title="Other Places">
            <ul className="task-links">
              <li>
                <button type="button" className="task-link" onClick={() => open("about")}>
                  <ProfileIcon size={16} /> My Profile
                </button>
              </li>
              <li>
                <button type="button" className="task-link" onClick={() => open("experience")}>
                  <NotepadIcon size={16} /> experience.txt
                </button>
              </li>
              <li>
                <button type="button" className="task-link" onClick={() => open("contact")}>
                  <MailIcon size={16} /> Contact Me
                </button>
              </li>
            </ul>
          </TaskPanel>

          <TaskPanel title="Details">
            {selected ? (
              <>
                <p className="taskpanel-strong">{selected.title.trim()}</p>
                <p className="taskpanel-hint">{selected.techStack}</p>
              </>
            ) : (
              <>
                <p className="taskpanel-strong">My Projects</p>
                <p className="taskpanel-hint">File Folder</p>
              </>
            )}
          </TaskPanel>
        </aside>

        <div
          className="explorer-content"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          {renderGroup("Web Applications", FrontEndProjects)}
          {renderGroup("APIs", BackendApi)}
        </div>
      </div>

      <div className="statusbar">
        <span>{selected ? "1 object selected" : `${allItems.length} objects`}</span>
        <span className="statusbar-hint">Double-click a project to open it</span>
      </div>
    </div>
  );
}

export default ProjectsApp;
