import { useState } from "react";
import { useActivation, useOS } from "../OSContext";
import { iconFor } from "../icons";

// The previous portfolio themes, "deleted" but never really gone.
const items = [
  { id: "ben10", name: "Ben 10 theme", location: "C:\\Portfolio\\Themes" },
  { id: "teal", name: "Dark teal & amber theme", location: "C:\\Portfolio\\Themes" },
  { id: "apple", name: "Apple-style theme", location: "C:\\Portfolio\\Themes" },
];

function Row({ item, selected, onSelect, onOpen }) {
  const handlers = useActivation(onSelect, onOpen);
  const Icon = iconFor.resume;
  return (
    <tr className={selected ? "is-selected" : undefined}>
      <td>
        <button type="button" className="row-button" {...handlers}>
          <Icon size={16} />
          {item.name}
        </button>
      </td>
      <td>{item.location}</td>
      <td>Portfolio theme</td>
    </tr>
  );
}

function RecycleBinApp() {
  const { open } = useOS();
  const [selected, setSelected] = useState(null);

  const restore = (item) =>
    open(
      "message",
      {
        title: "Recycle Bin",
        icon: "info",
        message: `"${item.name}" can't be restored from here, but it lives on in this portfolio's git history.`,
      },
      "message-recycle"
    );

  return (
    <div className="details-view">
      <div className="details-scroll">
        <table className="details-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Original Location</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <Row
                key={item.id}
                item={item}
                selected={selected === item.id}
                onSelect={() => setSelected(item.id)}
                onOpen={() => restore(item)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="statusbar">
        <span>{items.length} objects</span>
      </div>
    </div>
  );
}

export default RecycleBinApp;
