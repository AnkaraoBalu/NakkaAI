import { useEffect, useRef, useState } from "react";
import {
  INSTALL_COMMAND,
  MARKETPLACE_URL,
  VSCODE_INSTALL_URL,
} from "../../../../constants/extension";
import { styles } from "./HeroSection.style";

const prompts = [
  { label: "Refactor legacy API", icon: "auto_fix_high", tone: "primary" },
  { label: "Fix auth race condition", icon: "bug_report", tone: "primary" },
  { label: "Generate schema migrations", icon: "database", tone: "secondary" },
  { label: "Debug endpoint test", icon: "bolt", tone: "primary" },
] as const;

interface HeroSectionProps {
  onPrompt: (text: string) => void;
}

export default function HeroSection({ onPrompt }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.root}>
      <div className={styles.glow} />
      <h1 className={styles.title}>
        Build with <span className={styles.titleAccent}>Nakka</span>
      </h1>
      <p className={styles.subtitle}>
        The autonomous AI coding agent built directly inside VS Code. Understand
        complex codebases, write tests, and debug regressions — seamlessly in
        your editor.
      </p>

      <div className={styles.actions}>
        <a className={styles.installButton} href={VSCODE_INSTALL_URL}>
          <span className="material-symbols-outlined text-[18px]">
            download
          </span>
          <span>Install for VS Code</span>
        </a>
        <a
          className={styles.marketplaceButton}
          href={MARKETPLACE_URL}
          rel="noopener"
          target="_blank"
        >
          <span>Explore on Marketplace</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_outward
          </span>
        </a>
        <button
          className={styles.copyButton}
          type="button"
          onClick={copyCommand}
          aria-label="Copy install command"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            terminal
          </span>
          <span className={styles.copyText} aria-live="polite">
            {copied ? "Copied!" : INSTALL_COMMAND}
          </span>
          <span className={styles.copyIcon}>content_copy</span>
        </button>
      </div>

      <div className={styles.prompts}>
        <span className={styles.promptsLabel}>Try prompting:</span>
        {prompts.map((prompt) => (
          <button
            key={prompt.label}
            className={styles.promptPill}
            type="button"
            onClick={() => onPrompt(prompt.label)}
          >
            <span className={styles.promptIcon[prompt.tone]}>
              {prompt.icon}
            </span>
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
