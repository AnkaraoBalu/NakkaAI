import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthModal } from "../../context/authModalContext";
import { styles } from "./Header.style";

const navLinks = [
  { label: "Product", to: "/product" },
  { label: "Pricing", to: "/pricing" },
];

// Marketing header. Only signed-out visitors see it; signed-in users live in the dashboard.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openAuth } = useAuthModal();

  function openModal(mode: "login" | "signup") {
    setMenuOpen(false);
    openAuth(mode);
  }

  useEffect(() => {
    const close = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("resize", close);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", escape);
    };
  }, []);

  return (
    <header className={styles.root}>
      <div className={styles.bar}>
        <Link className={styles.brand} to="/product">
          <img alt="" className={styles.logo} src="/logo3.png" />
          <span className={styles.brandName}>Nakka</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              className={({ isActive }) => styles.navLink(isActive)}
              to={link.to}
              end
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className={styles.navLink(false)}
            onClick={() => openModal("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={styles.cta}
            onClick={() => openModal("signup")}
          >
            Get Started
          </button>
        </nav>
        <div className={styles.mobileActions}>
          <button
            type="button"
            className={styles.cta}
            onClick={() => openModal("signup")}
          >
            Get Started
          </button>
          <button
            type="button"
            className={styles.menuButton}
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined text-[22px]">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className={styles.mobileMenu(menuOpen)}
        aria-label="Main"
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            className={({ isActive }) => styles.mobileNavLink(isActive)}
            to={link.to}
            end
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          className={`${styles.mobileNavLink(false)} text-left`}
          onClick={() => openModal("login")}
        >
          Sign In
        </button>
      </nav>
    </header>
  );
}
