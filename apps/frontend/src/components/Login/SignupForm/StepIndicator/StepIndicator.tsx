import { Fragment } from "react";
import { styles } from "./StepIndicator.style";

const STEPS = ["Details", "Verify email", "Password"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <ol className={styles.root} aria-label="Sign-up progress">
      {STEPS.map((label, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "upcoming";
        return (
          <Fragment key={label}>
            {index > 0 && (
              <li
                className={styles.line(index <= current)}
                aria-hidden="true"
              />
            )}
            <li
              className={styles.step}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className={styles.dot(state)}>
                {state === "done" ? (
                  <span className={styles.doneIcon}>check</span>
                ) : (
                  index + 1
                )}
              </span>
              <span className={styles.label(state)}>{label}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
