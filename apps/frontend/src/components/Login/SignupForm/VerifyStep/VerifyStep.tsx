import { useEffect, useState, type FormEvent } from "react";
import OtpInput from "../../OtpInput";
import { useRequest } from "../../useRequest";
import { styles } from "./VerifyStep.style";

interface VerifyStepProps {
  email: string;
  resendAvailableAt: number;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}

const formatWait = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function VerifyStep({
  email,
  resendAvailableAt,
  onVerify,
  onResend,
  onChangeEmail,
}: VerifyStepProps) {
  const [code, setCode] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [resent, setResent] = useState(false);
  const verifying = useRequest();
  const resending = useRequest();
  const waitSeconds = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));

  // Tick the resend countdown.
  useEffect(() => {
    if (waitSeconds === 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [waitSeconds]);

  function verify(value = code) {
    if (value.length !== 6 || verifying.busy) return;
    // On failure the boxes turn red; editing any digit clears the error.
    void verifying.run(() => onVerify(value));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verify();
  }

  async function resend() {
    setResent(false);
    verifying.setError("");
    const ok = await resending.run(async () => {
      await onResend();
      return true;
    });
    if (ok) {
      setCode("");
      setResent(true);
      setNow(Date.now());
    }
  }

  const error = verifying.error || resending.error;

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <p className={styles.intro}>
        Enter the 6-digit code we sent to{" "}
        <span className={styles.email}>{email}</span>
        <button
          type="button"
          className={styles.changeButton}
          onClick={onChangeEmail}
        >
          Change
        </button>
      </p>

      <div className="flex flex-col gap-space-sm">
        <OtpInput
          value={code}
          onChange={(value) => {
            setCode(value);
            if (verifying.error) verifying.setError("");
          }}
          onComplete={verify}
          disabled={verifying.busy}
          invalid={Boolean(verifying.error)}
          autoFocus
        />
        {error ? (
          <p className={styles.fieldError} role="alert">
            <span className={styles.noticeIcon}>error</span>
            {error}
          </p>
        ) : (
          resent && (
            <p className={styles.notice} role="status">
              <span className={styles.noticeIcon}>mark_email_read</span>
              We sent a new code.
            </p>
          )
        )}
      </div>

      <button
        className={styles.submit}
        type="submit"
        disabled={verifying.busy || code.length !== 6}
      >
        {verifying.busy && (
          <span className={styles.spinner} aria-hidden="true">
            progress_activity
          </span>
        )}
        {verifying.busy ? "Verifying..." : "Verify email"}
      </button>

      <div className="flex flex-col gap-1">
        <p className={styles.resendRow}>
          Didn't get it?
          <button
            type="button"
            className={styles.resendButton}
            onClick={resend}
            disabled={waitSeconds > 0 || resending.busy}
          >
            {resending.busy
              ? "Sending..."
              : waitSeconds > 0
                ? `Resend in ${formatWait(waitSeconds)}`
                : "Resend code"}
          </button>
        </p>
        <p className={styles.expiry}>
          The code expires in 10 minutes. Check your spam folder too.
        </p>
      </div>
    </form>
  );
}
