import { useEffect } from "react";

import { useAppActions } from "../state";

/**
 * Fires a day tick on mount, every minute, and when the tab becomes visible
 * so `rollDayKey` stays aligned with the local calendar and task progress can reset at day change.
 */
export function DayBoundaryWatcher() {
  const { tickDay } = useAppActions();

  useEffect(() => {
    tickDay();
    const interval = window.setInterval(() => tickDay(), 60_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") tickDay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [tickDay]);

  return null;
}
