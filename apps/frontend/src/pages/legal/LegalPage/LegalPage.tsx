import { useEffect, type ReactNode } from "react";
import { LEGAL_EFFECTIVE_DATE } from "../../../constants/legal";
import { legalStyles, styles } from "./LegalPage.style";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

// Shared frame for the Privacy Policy and Terms of Service.
export default function LegalPage({ title, children }: LegalPageProps) {
  useEffect(() => {
    document.title = `${title} | Nakka`;
    window.scrollTo({ top: 0 });
  }, [title]);

  return (
    <article className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.date}>Effective {LEGAL_EFFECTIVE_DATE}</p>
      <div className={styles.body}>{children}</div>
    </article>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className={legalStyles.section}>
      <h2 className={legalStyles.heading}>{title}</h2>
      {children}
    </section>
  );
}
