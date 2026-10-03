import { Link } from "react-router-dom";
import { useAuth } from "../../api-hooks/auth";
import { VSCODE_INSTALL_URL } from "../../constants/extension";
import { styles } from "./Dashboard.style";

const steps = [
  {
    icon: "download",
    title: "Install the extension",
    text: "Add Nakka to VS Code from the Marketplace.",
    action: { label: "Open in VS Code", href: VSCODE_INSTALL_URL },
  },
  {
    icon: "key",
    title: "Add your API key",
    text: "Bring your own key for the model you want Nakka to use.",
    action: { label: "Go to settings", to: "/dashboard/settings" },
  },
  {
    icon: "forum",
    title: "Start a session",
    text: "Open the Nakka panel in VS Code and ask about your codebase.",
    action: { label: "View sessions", to: "/dashboard/sessions" },
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.root}>
      <div className={styles.greeting}>
        <h2 className={styles.title}>Welcome back, {user?.firstName}</h2>
        <p className={styles.subtitle}>
          Here's where your Nakka sessions and projects will live.
        </p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Get started</h3>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepTop}>
                <span className={styles.stepIcon} aria-hidden="true">
                  <span className="material-symbols-outlined text-[22px]">
                    {step.icon}
                  </span>
                </span>
                <span className={styles.stepNumber}>Step {index + 1}</span>
              </div>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepText}>{step.text}</p>
              {"href" in step.action ? (
                <a href={step.action.href} className={styles.stepAction}>
                  {step.action.label}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </a>
              ) : (
                <Link to={step.action.to} className={styles.stepAction}>
                  {step.action.label}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent sessions</h3>
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <span className="material-symbols-outlined text-[24px]">forum</span>
          </span>
          <p className={styles.emptyTitle}>No sessions yet</p>
          <p className={styles.emptyText}>
            Sessions you start in VS Code will show up here.
          </p>
        </div>
      </section>
    </div>
  );
}
