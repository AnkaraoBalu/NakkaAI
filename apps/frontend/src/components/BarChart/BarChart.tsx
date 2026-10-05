import { formatNumber } from "../../utils/format";
import { styles } from "./BarChart.style";

export interface BarDatum {
  label: string;
  value: number;
  // Shown on hover, e.g. "Oct 5 · 12 requests · 4.2k tokens".
  detail?: string;
}

interface BarChartProps {
  data: BarDatum[];
  // What the values count, for the screen-reader summary ("requests").
  unit: string;
  height?: number;
}

// Vertical bars with a few date labels underneath. Plain HTML, no chart library.
export default function BarChart({ data, unit, height = 160 }: BarChartProps) {
  const max = Math.max(...data.map((datum) => datum.value), 0);
  const total = data.reduce((sum, datum) => sum + datum.value, 0);
  // Label every bar when there are few, otherwise about six evenly spaced.
  const every = Math.max(1, Math.ceil(data.length / 6));

  return (
    <figure className={styles.root}>
      <figcaption className="sr-only">
        {formatNumber(total)} {unit} over {data.length} days
      </figcaption>
      <div className={styles.plot} style={{ height }}>
        <span className={styles.max}>{max ? formatNumber(max, { short: true }) : ""}</span>
        <div className={styles.bars}>
          {data.map((datum) => (
            <div
              key={datum.label}
              className={styles.column}
              title={datum.detail ?? `${datum.label}: ${formatNumber(datum.value)} ${unit}`}
            >
              <div
                className={styles.bar(datum.value > 0)}
                style={{ height: max ? `${Math.max((datum.value / max) * 100, datum.value ? 3 : 0)}%` : 0 }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.labels} aria-hidden="true">
        {data.map((datum, index) => (
          <span key={datum.label} className={styles.label}>
            {index % every === 0 || index === data.length - 1 ? datum.label : ""}
          </span>
        ))}
      </div>
      {total === 0 && <p className={styles.empty}>No requests in this period yet.</p>}
    </figure>
  );
}
