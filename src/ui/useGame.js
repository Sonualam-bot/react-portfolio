import { useSyncExternalStore } from "react";
import { getState, subscribe } from "../game/bridge";

export const useGame = () => useSyncExternalStore(subscribe, getState);
