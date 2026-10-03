import { Link } from "react-router-dom";
import { styles } from "./NotFound.style";

export default function NotFound() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Page not found</h1>
      <Link to="/" className={styles.homeLink}>
        Back to home
      </Link>
    </section>
  );
}
