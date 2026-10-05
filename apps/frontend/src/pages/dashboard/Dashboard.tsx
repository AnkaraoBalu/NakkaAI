import { Link } from "react-router-dom";
import { useAuth } from "../../api-hooks/auth";
import { useUsage } from "../../api-hooks/usage";
import StatTile from "../../components/StatTile";
import { VSCODE_INSTALL_URL } from "../../constants/extension";
import { formatNumber } from "../../utils/format";
import PlanCard from "./PlanCard";
import { styles } from "./Dashboard.style";

const steps = [
  {
    icon: "download",
    title: "Install the extension",
    text: "Add Nakka to VS Code from the Marketplace.",
    action: { label: "Open in VS Code", href: VSCODE_INSTALL_URL },
  },
  {
    icon: "login",
    title: "Sign in from VS Code",
    text: "Open the Nakka panel and sign in with this account. No API key needed.",
    action: { label: "Open in VS Code", href: VSCODE_INSTALL_URL },
  },
  {
    icon: "monitoring",
    title: "Keep an eye on usage",
    text: "See how much of your allowance is left and when it resets.",
    action: { label: "View usage", to: "/dashboard/usage" },
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error } = useUsage();

  return (
    <div className={styles.root}>
      <div className={styles.greeting}>
        <h2 className={styles.title}>Welcome back, {user?.firstName}</h2>
        <p className={styles.subtitle}>
          Your plan, your allowance, and how to get coding with Nakka.
        </p>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!data && !error && (
        <p className={styles.loading}>
          <span className="material-symbols-outlined text-[18px] animate-spin">
            progress_activity
          </span>
          Loading your plan…
        </p>
      )}
      {data && (
        <>
          <PlanCard usage={data} />
          <div className={styles.stats}>
            <StatTile
              icon="bolt"
              label="Requests, last 30 days"
              value={formatNumber(data.totals.requests)}
            />
            <StatTile
              icon="input"
              label="Tokens sent"
              value={formatNumber(data.totals.inputTokens, { short: true })}
            />
            <StatTile
              icon="output"
              label="Tokens received"
              value={formatNumber(data.totals.outputTokens, { short: true })}
            />
          </div>
        </>
      )}

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
    </div>
  );
}
