import { useState, type FormEvent } from "react";
import type { SignupDetails } from "@nakka/types/users";
import type { OAuthProvider } from "../../../../api/auth";
import { useOAuth } from "../../../../api-hooks/auth";
import TextField from "../../../TextField";
import SocialButtons from "../../SocialButtons";
import { focusFirstInvalid } from "../../focusFirstInvalid";
import { useRequest } from "../../useRequest";
import { validateDetails, type DetailsField } from "../validation";
import { styles } from "./DetailsStep.style";

interface DetailsStepProps {
  values: SignupDetails;
  onChange: (values: SignupDetails) => void;
  // Sends the code; rejects with a message to show if that fails.
  onContinue: () => Promise<void>;
  onSwitch: () => void;
}

export default function DetailsStep({
  values,
  onChange,
  onContinue,
  onSwitch,
}: DetailsStepProps) {
  const [touched, setTouched] = useState<
    Partial<Record<DetailsField, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [provider, setProvider] = useState<OAuthProvider | null>(null);
  const { busy, error, run } = useRequest();
  const startOAuth = useOAuth();

  const errors = validateDetails(values);
  const fieldProps = (field: DetailsField) => ({
    value: values[field],
    onValueChange: (value: string) => onChange({ ...values, [field]: value }),
    onBlur: () => setTouched((previous) => ({ ...previous, [field]: true })),
    error:
      (submitted || touched[field]) && errors[field]
        ? errors[field]
        : undefined,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) {
      focusFirstInvalid(event.currentTarget);
      return;
    }
    void run(onContinue);
  }

  async function chooseProvider(selected: OAuthProvider) {
    setProvider(selected);
    await run(() => startOAuth(selected));
    setProvider(null);
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error && (
        <p className={styles.errorBanner} role="alert">
          {error}
        </p>
      )}
      <fieldset className={styles.fields} disabled={busy}>
        <legend className={styles.sectionLabel}>Personal information</legend>
        <div className={styles.nameRow}>
          <TextField
            label="First name"
            name="given-name"
            autoComplete="given-name"
            autoFocus
            {...fieldProps("firstName")}
          />
          <TextField
            label="Last name"
            name="family-name"
            autoComplete="family-name"
            {...fieldProps("lastName")}
          />
        </div>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          {...fieldProps("email")}
        />
        <TextField
          label="Username"
          name="username"
          autoComplete="username"
          {...fieldProps("username")}
        />
      </fieldset>

      <div className="flex flex-col gap-space-sm">
        <button className={styles.submit} type="submit" disabled={busy}>
          {busy && !provider && (
            <span className={styles.spinner} aria-hidden="true">
              progress_activity
            </span>
          )}
          {busy && !provider ? "Sending code..." : "Send verification code"}
        </button>
        <p className={styles.hint}>
          We'll email you a 6-digit code to confirm it's you.
        </p>
      </div>

      <SocialButtons
        onSelect={chooseProvider}
        pending={provider}
        disabled={busy}
      />

      {/* New tab, so the sign-up in progress isn't lost. */}
      <p className={styles.hint}>
        By signing up, you agree to the{" "}
        <a className={styles.legalLink} href="/terms" target="_blank">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className={styles.legalLink} href="/privacy" target="_blank">
          Privacy Policy
        </a>
        .
      </p>

      <p className={styles.switchText}>
        Already have an account?
        <button
          type="button"
          className={styles.switchButton}
          onClick={onSwitch}
        >
          Log in
        </button>
      </p>
    </form>
  );
}
