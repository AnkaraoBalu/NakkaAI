import type { ReactNode } from "react";
import type { UsageWindow } from "@nakka/types/extension";
import { formatDuration } from "../../utils/format";
import { styles } from "./UsageMeter.style";

interface UsageMeterProps {
  // `used` is the percent used (0–100), like Claude Code shows it.
  usage: UsageWindow;
  // Extra line for admins, e.g. "$1.02 of $3.00".
  detail?: ReactNode;
}

// One allowance window: how much is used and when it resets.
export default function UsageMeter({ usage, detail }: UsageMeterProps) {
  const percent = Math.min(Math.max(usage.used, 0), 100);
  const resetsIn = formatDuration(Math.max(new Date(usage.resetsAt).getTime() - Date.now(), 0));
  const usedUp = percent >= 100;

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <span className={styles.label}>{usage.label}</span>
        <span className={styles.count(usedUp)}>{percent}% used</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={`${usage.label} allowance used`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% used`}
      >
        <div className={styles.fill(percent)} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.bottom}>
        <span className={styles.left(usedUp)}>
          {usedUp ? `Used up · back in ${resetsIn}` : detail ?? `${100 - percent}% left`}
        </span>
        <span>
          {percent === 0 && !usedUp ? "Starts with your next request" : `Resets in ${resetsIn}`}
        </span>
      </div>
    </div>
  );
}
