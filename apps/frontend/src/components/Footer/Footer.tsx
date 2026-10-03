import { Link } from "react-router-dom";
import { styles } from "./Footer.style";

const links = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img alt="" className={styles.logo} src="/logo3.png" />
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Nakka AI. All rights
            reserved.
          </span>
        </div>
        <div className={styles.links}>
          {links.map((link) => (
            <Link key={link.label} className={styles.link} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
