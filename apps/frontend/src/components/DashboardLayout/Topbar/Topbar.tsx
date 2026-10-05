import type { ReactNode } from "react";
import { styles } from "./Topbar.style";

interface TopbarProps {
  title: string;
  onOpenMenu: () => void;
  // Right side: plan badge, buttons.
  children?: ReactNode;
}

export default function Topbar({ title, onOpenMenu, children }: TopbarProps) {
  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>{children}</div>
    </header>
  );
}
