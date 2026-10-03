import { VSCODE_INSTALL_URL } from "../../../constants/extension";
import { styles } from "./Topbar.style";

interface TopbarProps {
  title: string;
  onOpenMenu: () => void;
}

export default function Topbar({ title, onOpenMenu }: TopbarProps) {
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
      <div className={styles.right}>
        <span className={styles.plan}>
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          Free plan
        </span>
        <a href={VSCODE_INSTALL_URL} className={styles.install}>
          <span className="material-symbols-outlined text-[16px]">
            download
          </span>
          <span className="hidden sm:inline">Install extension</span>
          <span className="sm:hidden">Install</span>
        </a>
      </div>
    </header>
  );
}
