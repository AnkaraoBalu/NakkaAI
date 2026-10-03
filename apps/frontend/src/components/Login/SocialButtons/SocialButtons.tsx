import type { OAuthProvider } from "../../../api/auth";
import ProviderLogo from "../../ProviderLogo";
import { styles } from "./SocialButtons.style";

const providers = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
] as const;

interface SocialButtonsProps {
  onSelect: (provider: OAuthProvider) => void;
  pending: OAuthProvider | null;
  disabled: boolean;
}

export default function SocialButtons({
  onSelect,
  pending,
  disabled,
}: SocialButtonsProps) {
  return (
    <div className={styles.root}>
      <div className={styles.divider}>or continue with</div>
      <div className={styles.buttons}>
        {providers.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={styles.button}
            disabled={disabled}
            onClick={() => onSelect(id)}
          >
            {pending === id ? (
              <span className={styles.spinner} aria-hidden="true">
                progress_activity
              </span>
            ) : (
              <ProviderLogo provider={id} className={styles.logo} />
            )}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
