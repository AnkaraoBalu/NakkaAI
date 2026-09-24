import { useEffect, useRef, useState } from "react";

export default function CardCarousel({ label, children, paused = false }) {
  const trackRef = useRef(null);
  const direction = useRef(1);
  const resumeAt = useRef(0);
  const touching = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const release = () => {
      if (!touching.current) return;
      touching.current = false;
      resumeAt.current = Date.now() + 4000;
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  function move(step, manual = false) {
    const track = trackRef.current;
    if (!track) return;
    if (manual) resumeAt.current = Date.now() + 8000;
    const card = track.firstElementChild;
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: step * distance, behavior: reducedMotion ? "instant" : "smooth" });
  }

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || touching.current || document.hidden || Date.now() < resumeAt.current) return;
      const bounds = track.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const end = track.scrollWidth - track.clientWidth;
      if (end <= 1) return;
      if (track.scrollLeft >= end - 2) direction.current = -1;
      if (track.scrollLeft <= 2) direction.current = 1;
      move(direction.current);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion]);

  return (
    <div
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
      onFocusCapture={(event) => setFocused(event.target.matches(":focus-visible"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        ref={trackRef}
        className="card-carousel"
        tabIndex={0}
        aria-label={`${label} cards`}
        onPointerDown={() => {
          touching.current = true;
          setFocused(false);
          const track = trackRef.current;
          track.scrollTo({ left: track.scrollLeft, behavior: "instant" });
        }}
        onWheel={() => { resumeAt.current = Date.now() + 8000; }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1, true);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
