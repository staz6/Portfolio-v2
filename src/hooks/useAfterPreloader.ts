import { useEffect, useRef } from "react";

const FALLBACK_MS = 5000;

/**
 * Runs a callback once after the preloader finishes (or after a 5s fallback).
 * Handles event subscription, guard flag, and cleanup automatically.
 *
 * @param callback — fired once when "preloader-complete" dispatches
 * @param delay — optional ms to wait after the event before calling back
 */
export function useAfterPreloader(callback: () => void, delay = 0) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    let started = false;
    let delayId: ReturnType<typeof setTimeout>;

    const run = () => {
      if (started) return;
      started = true;
      window.removeEventListener("preloader-complete", onEvent);
      clearTimeout(fallback);

      if (delay > 0) {
        delayId = setTimeout(() => cbRef.current(), delay);
      } else {
        cbRef.current();
      }
    };

    const onEvent = () => run();
    const fallback = setTimeout(run, FALLBACK_MS + delay);

    window.addEventListener("preloader-complete", onEvent, { once: true });

    return () => {
      window.removeEventListener("preloader-complete", onEvent);
      clearTimeout(fallback);
      clearTimeout(delayId);
    };
  }, [delay]);
}
