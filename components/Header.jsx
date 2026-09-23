import { useState, useEffect } from "react";
import logo from "../logo.png";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    const escape = (event) => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/75 backdrop-blur-xl transition-colors duration-200">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-xl">
          <a
            className="flex items-center gap-space-sm focus:outline-none"
            href="/"
          >
            <img
              alt="Nakka logo"
              className="h-8 w-auto object-contain"
              src={logo}
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-medium">
              Nakka
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-space-sm">
            <a
              className="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="/#features"
            >
              Features
            </a>
            <a
              className="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="/#how-it-works"
            >
              How it Works
            </a>
            <a
              className="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="/#providers"
            >
              Providers
            </a>
            <a
              className="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="/#faq"
            >
              FAQ
            </a>
            <a
              className="px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              href="/"
            >
              GitHub
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <a
            className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary transition-all duration-150"
            href="/#install"
          >
            <span className="material-symbols-outlined text-[18px]">
              terminal
            </span>
            <span className="hidden sm:inline">Install Extension</span>
            <span className="sm:hidden">Install</span>
          </a>
          <button
            className="md:hidden w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            id="mobile-menu-btn"
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              id="mobile-menu-icon"
            >
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-menu"
        className={
          "md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-xl" +
          (menuOpen ? "" : " hidden")
        }
      >
        <div className="px-4 py-space-sm flex flex-col">
          <a
            className="py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface"
            href="/#features"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
          <a
            className="py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface"
            href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
          >
            How it Works
          </a>
          <a
            className="py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface"
            href="/#providers"
            onClick={() => setMenuOpen(false)}
          >
            Providers
          </a>
          <a
            className="py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface"
            href="/#faq"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </a>
          <a
            className="py-3 font-body-md text-body-md text-on-surface-variant hover:text-on-surface"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
