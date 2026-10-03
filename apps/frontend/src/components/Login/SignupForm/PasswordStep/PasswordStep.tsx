import { useState, type FormEvent } from "react";
import TextField from "../../../TextField";
import { focusFirstInvalid } from "../../focusFirstInvalid";
import { useRequest } from "../../useRequest";
import { passwordStrength, validatePassword } from "../validation";
import { styles } from "./PasswordStep.style";

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"];

interface PasswordStepProps {
  email: string;
  onCreate: (password: string) => Promise<void>;
  onStartOver: () => void;
}

type Field = "password" | "confirmPassword";

export default function PasswordStep({
  email,
  onCreate,
  onStartOver,
}: PasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const { busy, error, run } = useRequest();

  const errors = validatePassword(password, confirmPassword);
  const visibleError = (field: Field) =>
    (submitted || touched[field]) && errors[field] ? errors[field] : undefined;
  const touch = (field: Field) => () =>
    setTouched((previous) => ({ ...previous, [field]: true }));
  const strength = passwordStrength(password);
  const passwordsMatch = confirmPassword !== "" && confirmPassword === password;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.password || errors.confirmPassword) {
      focusFirstInvalid(event.currentTarget);
      return;
    }
    void run(() => onCreate(password));
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <p className={styles.verified}>
        <span className={styles.verifiedIcon}>verified</span>
        <span className={styles.verifiedEmail}>{email} is verified</span>
      </p>

      {error && (
        <p className={styles.errorBanner} role="alert">
          <span>
            {error}
            {/verif/i.test(error) && (
              <button
                type="button"
                className={styles.switchButton}
                onClick={onStartOver}
              >
                Start over
              </button>
            )}
          </span>
        </p>
      )}

      <fieldset className={styles.fields} disabled={busy}>
        <TextField
          label="Password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          autoFocus
          value={password}
          onValueChange={setPassword}
          onBlur={touch("password")}
          error={visibleError("password")}
          hint={
            password && (
              <div className={styles.strength} aria-live="polite">
                <div className={styles.strengthBars} aria-hidden="true">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={styles.strengthBar(
                        strength >= level,
                        styles.strengthTone[strength] ?? "",
                      )}
                    />
                  ))}
                </div>
                <span className={styles.strengthLabel}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )
          }
        />
        <TextField
          label="Confirm password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          onBlur={touch("confirmPassword")}
          error={visibleError("confirmPassword")}
          hint={
            passwordsMatch && (
              <p className={styles.match}>
                <span className={styles.matchIcon}>check_circle</span>
                Passwords match
              </p>
            )
          }
        />
      </fieldset>

      <div className="flex flex-col gap-space-sm">
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy && (
            <span className={styles.spinner} aria-hidden="true">
              progress_activity
            </span>
          )}
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className={styles.terms}>
          By signing up, you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </form>
  );
}
