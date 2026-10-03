import { styles } from "./AmbientBackground.style";

export default function AmbientBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.glowTopLeft} />
      <div className={styles.glowBottomRight} />
      <div className={styles.glowCenter} />
    </div>
  );
}
