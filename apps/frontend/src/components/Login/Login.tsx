import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { AuthMode } from "../../context/authModalContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { styles } from "./Login.style";

const EXIT_MS = 200;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const copy: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to pick up where your agent left off.",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start free. No card needed.",
  },
};

interface LoginProps {
  mode: AuthMode | null;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  // Called once the user has logged in or finished signing up.
  onAuthenticated: () => void;
}

export default function Login({
  mode,
  onModeChange,
  onClose,
  onAuthenticated,
}: LoginProps) {
  // Keep the last mode rendered while the closing animation plays.
  const [shownMode, setShownMode] = useState<AuthMode | null>(mode);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const isOpen = mode !== null;

  useEffect(() => {
    if (mode) {
      setShownMode(mode);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = setTimeout(() => setShownMode(null), EXIT_MS);
    return () => clearTimeout(timer);
  }, [mode]);

  // Lock page scroll while open, and return focus to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [isOpen]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    // Keep keyboard focus inside the dialog.
    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!shownMode) return null;

  return createPortal(
    <div
      className={styles.overlay(visible)}
      onKeyDown={onKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog(visible)}
      >
        <div className={styles.glow} aria-hidden="true" />
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <span className={styles.closeIcon}>close</span>
        </button>

        {/* Re-keyed per mode so switching views replays the entrance animation. */}
        <div key={shownMode} className={styles.panel}>
          <div className={styles.header}>
            <img alt="" className={styles.logo} src="/logo3.png" />
            <h2 id={titleId} className={styles.title}>
              {copy[shownMode].title}
            </h2>
            <p className={styles.subtitle}>{copy[shownMode].subtitle}</p>
          </div>
          {shownMode === "login" ? (
            <LoginForm
              onSwitch={() => onModeChange("signup")}
              onDone={onAuthenticated}
            />
          ) : (
            <SignupForm
              onSwitch={() => onModeChange("login")}
              onDone={onAuthenticated}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
