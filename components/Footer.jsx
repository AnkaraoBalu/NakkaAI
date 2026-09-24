import { MARKETPLACE_URL } from "./extension.js";
import logo from "../logo3.png";

const footerLinks = [
  { label: "VS Code Marketplace", href: MARKETPLACE_URL, external: true },
  { label: "GitHub Repository", href: "#" },
  { label: "Documentation", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Zero Telemetry", href: "#" },
  { label: "MIT License", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest/80 border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-margin-desktop pt-10 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex flex-col items-start gap-space-md max-w-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-contain"
                src={logo}
              />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-medium">
                Nakka
              </span>
              <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container text-outline">
                v0.9.4-beta
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Autonomous AI pair programmer and agentic workspace engine for VS
              Code.
            </p>
            <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded bg-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Systems Operational
              </span>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-10 gap-y-1 lg:pt-1"
          >
            {footerLinks.map(({ label, href, external }) => (
              <a
                key={label}
                className="min-w-0 min-h-11 flex items-center font-code-md text-code-md text-on-surface-variant hover:text-primary transition-colors"
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm text-on-surface-variant">
          <span className="font-label-sm text-label-sm">
            {"© "}
            <span id="footer-year">{new Date().getFullYear()}</span>
            {" Nakka Systems Inc. All rights reserved."}
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            Engineered for local-first intelligence and execution.
          </span>
        </div>
      </div>
    </footer>
  );
}
