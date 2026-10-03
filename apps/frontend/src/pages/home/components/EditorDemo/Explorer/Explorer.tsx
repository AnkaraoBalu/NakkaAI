import { styles } from "./Explorer.style";

export default function Explorer() {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>Explorer</span>
        <span className="material-symbols-outlined text-[16px]">
          more_horiz
        </span>
      </div>
      <div className={styles.project}>
        <span className="material-symbols-outlined text-[14px]">
          expand_more
        </span>
        <span>NAKKA-BACKEND</span>
      </div>
      <div className={styles.tree}>
        <div className={styles.row}>
          <span className={styles.folderIcon}>folder</span>
          <span>src</span>
        </div>
        <div className={styles.nested}>
          <div className={styles.row}>
            <span className={styles.folderIcon}>folder_open</span>
            <span>middleware</span>
          </div>
          <div className={styles.nested}>
            <div className={styles.activeRow}>
              <span className={styles.activeFileIcon}>code</span>
              <span className={styles.fileName}>auth.ts</span>
            </div>
            <div className={styles.row}>
              <span className={styles.fileIcon}>code</span>
              <span className={styles.fileName}>rate-limit.ts</span>
            </div>
          </div>
          <div className={styles.row}>
            <span className={styles.folderIcon}>folder</span>
            <span>services</span>
          </div>
          <div className={styles.row}>
            <span className={styles.fileIcon}>code</span>
            <span className={styles.fileName}>users.ts</span>
          </div>
        </div>
        <div className={styles.row}>
          <span className="material-symbols-outlined text-[15px] text-secondary">
            data_object
          </span>
          <span className={styles.fileName}>package.json</span>
        </div>
        <div className={styles.row}>
          <span className="material-symbols-outlined text-[15px] text-outline">
            description
          </span>
          <span className={styles.fileName}>tsconfig.json</span>
        </div>
      </div>
    </div>
  );
}
