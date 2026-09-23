import { useEffect, useRef } from "react";

// Deterministic positions keep the starfield stable across mounts and resizes.
const stars = Array.from({ length: 150 }, (_, index) => {
  const random = (seed) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  return {
    x: random(index + 1),
    y: random(index + 201),
    depth: 0.25 + random(index + 401) * 0.75,
    radius: 0.4 + random(index + 601) * 1.1,
  };
});

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let position = window.scrollY;
    let target = position;
    const wrap = (value, range) => ((value % range) + range) % range;

    function paint(velocity = 0) {
      context.clearRect(0, 0, width, height);
      const travel = motion.matches ? 0 : position;
      const count = width < 640 ? 75 : stars.length;
      for (const [index, star] of stars.slice(0, count).entries()) {
        const angle = travel * 0.000035 * star.depth;
        const originalX = (star.x - 0.5) * width * 1.4;
        const originalY = (star.y - 0.5) * height * 1.4;
        const x = wrap(
          originalX * Math.cos(angle) - originalY * Math.sin(angle) + width / 2,
          width,
        );
        const y = wrap(
          originalX * Math.sin(angle) +
            originalY * Math.cos(angle) +
            height / 2 -
            travel * star.depth * 0.12,
          height,
        );
        const alpha = 0.18 + star.depth * 0.38;
        const trail = index % 9 === 0;
        const length = trail
          ? 18 + star.depth * 55 + Math.min(Math.abs(velocity) * 2, 45)
          : Math.min(Math.abs(velocity) * star.depth, 14);
        if (length > 1) {
          const direction = velocity < -0.1 ? -1 : 1;
          const endX = x - length * 0.45;
          const endY = y + length * direction;
          const gradient = context.createLinearGradient(x, y, endX, endY);
          gradient.addColorStop(0, `rgba(195,218,242,${alpha * 0.65})`);
          gradient.addColorStop(1, "rgba(150,185,230,0)");
          context.strokeStyle = gradient;
          context.lineWidth = star.radius * (trail ? 1.4 : 0.6);
          context.beginPath();
          context.moveTo(x, y);
          context.quadraticCurveTo(
            x - length * 0.08,
            y + length * direction * 0.7,
            endX,
            endY,
          );
          context.stroke();
        }
        if (trail) {
          const halo = context.createRadialGradient(x, y, 0, x, y, 8);
          halo.addColorStop(0, `rgba(210,226,250,${alpha * 0.4})`);
          halo.addColorStop(1, "rgba(180,210,250,0)");
          context.fillStyle = halo;
          context.fillRect(x - 8, y - 8, 16, 16);
        }
        context.fillStyle = `rgba(210,226,250,${alpha})`;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fill();
      }
    }

    function animate(time) {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16.7;
      previousTime = time;
      const delta = (target - position) * (1 - Math.exp(-elapsed / 110));
      position += delta;
      paint(delta);
      if (Math.abs(target - position) > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        position = target;
        previousTime = 0;
        paint();
      }
    }

    function onScroll() {
      target = window.scrollY;
      if (!motion.matches && !document.hidden && !frame) {
        frame = requestAnimationFrame(animate);
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint();
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      target = position = window.scrollY;
      if (!document.hidden) resize();
    }

    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="universe-nebula" />
      <canvas ref={canvasRef} className="universe-stars" />
      <div className="universe-vignette" />
    </div>
  );
}
