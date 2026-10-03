import { styles } from "./StatusBar.style";

export default function StatusBar() {
  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <div className={styles.indexStatus}>
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Vector Index Ready • 48 files</span>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>fork_right</span>
          <span className="whitespace-nowrap">main*</span>
        </div>
        <div className={styles.syncItem}>
          <span className={styles.icon}>sync</span>
          <span>0 ↓ 2 ↑</span>
        </div>
      </div>
      <div className={styles.group}>
        <span className={styles.desktopOnly}>Ln 10, Col 4</span>
        <span className={styles.desktopOnly}>Spaces: 2</span>
        <span className={styles.desktopOnly}>UTF-8</span>
        <span className="text-on-surface font-medium">TypeScript</span>
        <span className={`${styles.icon} text-primary`}>notifications</span>
      </div>
    </div>
  );
}
