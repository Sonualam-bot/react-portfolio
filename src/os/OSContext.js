import { createContext, useContext, useEffect, useRef, useState } from "react";

export const OSContext = createContext(null);

// Phones in portrait or landscape. Keep in sync with the compact block in index.css.
export const COMPACT_QUERY = "(max-width: 640px), (max-height: 500px)";
export const useOS = () => useContext(OSContext);

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/**
 * Desktop-style activation: a mouse click selects and a double-click opens.
 * Touch taps and keyboard presses (Enter/Space) open right away, since
 * double-tapping isn't a thing people expect on a phone.
 */
export function useActivation(onSelect, onOpen) {
  const pointerType = useRef("mouse");
  return {
    onPointerDown: (e) => {
      pointerType.current = e.pointerType;
    },
    onClick: (e) => {
      if (pointerType.current === "touch" || e.detail === 0) onOpen();
      else onSelect();
      pointerType.current = "mouse";
    },
    onDoubleClick: onOpen,
  };
}
