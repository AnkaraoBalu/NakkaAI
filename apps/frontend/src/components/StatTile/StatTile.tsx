import type { ReactNode } from "react";
import { styles } from "./StatTile.style";

interface StatTileProps {
  icon: string;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

// One headline number, e.g. "Requests today: 1,204".
export default function StatTile({ icon, label, value, hint }: StatTileProps) {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
