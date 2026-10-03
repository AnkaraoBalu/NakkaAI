import { useState } from "react";
import { useAuthModal } from "../../../../context/authModalContext";
import { styles } from "./PricingSection.style";

type Billing = "monthly" | "yearly";

const freeFeatures = [
  "A daily allowance",
  "Standard model",
  "Whole-codebase search and edits",
  "Terminal, tools, subagents",
  "No card to sign up",
];
const proFeatures = [
  "A much larger allowance",
  "Every model, including the deep one",
  "Whole-codebase search and edits",
  "Terminal, tools, subagents",
  "Faster queue at busy times",
  "Email support",
];
const proPrice: Record<Billing, { price: string; period: string }> = {
  monthly: { price: "$20", period: "/ month" },
  yearly: { price: "$16", period: "/ month (billed yearly)" },
};

export default function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const { openAuth } = useAuthModal();

  return (
    <section className={styles.root} id="pricing">
      <div className={styles.eyebrow}>
        <span className="material-symbols-outlined text-[14px]">sell</span>
        <span className="font-medium">Simple pricing</span>
      </div>
      <h2 className={styles.title}>Start free. Upgrade when you need more.</h2>

      <div className={styles.toggle} role="group" aria-label="Billing period">
        <button
          className={styles.toggleButton(billing === "monthly")}
          type="button"
          aria-pressed={billing === "monthly"}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </button>
        <button
          className={styles.toggleButton(billing === "yearly")}
          type="button"
          aria-pressed={billing === "yearly"}
          onClick={() => setBilling("yearly")}
        >
          <span>Yearly</span>
          <span className={styles.saveBadge}>Save 20%</span>
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.freeCard}>
          <div>
            <span className={styles.planName}>Free</span>
            <p className={styles.planTagline}>Enough to see what it can do.</p>
            <div className={styles.priceRow}>
              <span className={styles.price}>$0</span>
              <span className={styles.period}>forever</span>
            </div>
            <ul className={styles.features}>
              {freeFeatures.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <span className={styles.freeCheck}>check</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footer}>
            <button
              className={styles.freeButton}
              type="button"
              onClick={() => openAuth("signup")}
            >
              Upgrade to Pro
            </button>
            <span className={styles.note}>You are on Free.</span>
          </div>
        </div>

        <div className={styles.proCard}>
          <div className={styles.recommended}>Recommended</div>
          <div>
            <span className={styles.planName}>Pro</span>
            <p className={styles.planTagline}>
              For the days the work does not stop.
            </p>
            <div className={styles.priceRow}>
              <span className={styles.price}>{proPrice[billing].price}</span>
              <span className={styles.period}>{proPrice[billing].period}</span>
            </div>
            <ul className={styles.features}>
              {proFeatures.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <span className={styles.proCheck}>check_circle</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footer}>
            <button
              className={styles.proButton}
              type="button"
              onClick={() => openAuth("signup")}
            >
              Upgrade to Pro
            </button>
            <span className={styles.note}>Cancel anytime. Prorated.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
