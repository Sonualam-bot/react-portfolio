// Picture-viewer style window for a single project.
function ProjectViewer({ project }) {
  const { img, title, liveLink, github, techStack, tag } = project;
  const isApi = tag === "api";

  return (
    <div className="viewer">
      <div className="viewer-stage">
        <img src={img} alt={`Preview of ${title.trim()}`} />
      </div>
      <div className="viewer-info">
        <h3>{title.trim()}</h3>
        <p>{techStack}</p>
      </div>
      <div className="viewer-toolbar">
        <a href={liveLink} target="_blank" rel="noreferrer" className="xp-btn">
          {isApi ? "Open API docs" : "Visit live site"}
        </a>
        {github && (
          <a href={github} target="_blank" rel="noreferrer" className="xp-btn">
            View source code
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectViewer;
