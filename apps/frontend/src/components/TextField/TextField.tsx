import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { styles } from "./TextField.style";

interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "id"
> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  // Rendered under the input, e.g. a password strength meter.
  hint?: ReactNode;
}

export default function TextField({
  label,
  value,
  onValueChange,
  error,
  hint,
  type = "text",
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          {...inputProps}
          id={id}
          type={isPassword && revealed ? "text" : type}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={styles.input(Boolean(error), isPassword)}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed(!revealed)}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
          >
            <span className={styles.toggleIcon}>
              {revealed ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
      </div>
      {hint}
      {error && (
        <p id={errorId} className={styles.error}>
          <span className={styles.errorIcon}>error</span>
          {error}
        </p>
      )}
    </div>
  );
}
