import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../api-hooks/auth";
import { styles } from "./UserMenu.style";

export default function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Close whenever the page changes, however the navigation happened.
  useEffect(() => setOpen(false), [pathname]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className={styles.root} ref={rootRef}>
      {open && (
        <div className={styles.menu(collapsed)} role="menu">
          <div className={styles.menuHeader}>
            <span className={styles.name}>{fullName}</span>
            <span className={styles.email}>{user.email}</span>
            <span className={styles.plan}>Free plan</span>
          </div>
          <div className={styles.divider} />
          <Link
            to="/dashboard/settings"
            className={styles.item}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span className={styles.itemIcon}>settings</span>
            Settings
          </Link>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.item}
            role="menuitem"
            onClick={() => void logout()}
          >
            <span className={styles.itemIcon}>logout</span>
            Log out
          </button>
        </div>
      )}
      <button
        type="button"
        className={styles.trigger(collapsed)}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={collapsed ? fullName : undefined}
      >
        <span className={styles.avatar} aria-hidden="true">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <span className={styles.identity(collapsed)}>
          <span className={styles.name}>{fullName}</span>
          <span className={styles.email}>{user.email}</span>
        </span>
        <span className={styles.chevron(collapsed)}>unfold_more</span>
      </button>
    </div>
  );
}
