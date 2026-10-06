import { useState, type FormEvent } from "react";
import type { ProviderKeyStatus } from "@nakka/types/admin";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import TextField from "../../../../components/TextField";
import { PROVIDER_INFO } from "../../../../constants/providers";
import { formatDateTime, formatRelative } from "../../../../utils/format";
import { styles } from "./ProviderKeyCard.style";

interface ProviderKeyCardProps {
  status: ProviderKeyStatus;
  onChange: (status: ProviderKeyStatus) => void;
  onRemoved: () => Promise<void>;
}

// One provider's key: status, set/replace, test and remove.
export default function ProviderKeyCard({ status, onChange, onRemoved }: ProviderKeyCardProps) {
  const info = PROVIDER_INFO[status.provider];
  const [editing, setEditing] = useState(false);
  const [key, setKey] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [notice, setNotice] = useState("");
  const { busy, error, setError, run } = useRequest();

  const state = !status.configured
    ? { label: "No key", tone: "off" as const }
    : status.lastCheckOk === false
      ? { label: "Failing", tone: "bad" as const }
      : status.lastCheckOk
        ? { label: "Working", tone: "good" as const }
        : { label: "Not tested", tone: "unknown" as const };

  function closeForm() {
    setEditing(false);
    setKey("");
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = key.trim();
    if (value.length < 10) return setError("Paste the full API key.");
    if (/\s/.test(value)) return setError("An API key can't contain spaces.");
    const saved = await run(() => adminApi.setProviderKey(status.provider, value));
    if (!saved) return;
    closeForm();
    onChange(saved);
    // Check it right away so a typo shows up now, not when users hit errors.
    const tested = await run(() => adminApi.testProviderKey(status.provider));
    if (tested) onChange(tested);
    setNotice(tested?.lastCheckOk ? "Saved and working." : "Saved. The test failed, see below.");
  }

  async function test() {
    setNotice("");
    const tested = await run(() => adminApi.testProviderKey(status.provider));
    if (tested) onChange(tested);
  }

  async function remove() {
    if (!confirmRemove) return setConfirmRemove(true);
    setNotice("");
    const done = await run(async () => {
      await adminApi.removeProviderKey(status.provider);
      return true;
    });
    setConfirmRemove(false);
    if (done) await onRemoved();
  }

  return (
    <section className={styles.card} aria-labelledby={`key-${status.provider}`}>
      <div className={styles.top}>
        <span className={styles.logo} style={{ background: info.color }} aria-hidden="true">
          {info.name.charAt(0)}
        </span>
        <div className="flex-1 min-w-0">
          <h2 id={`key-${status.provider}`} className={styles.title}>
            {info.name}
          </h2>
          <p className={styles.keyLine}>
            {status.configured ? (
              <>
                <span className={styles.masked}>•••• •••• {status.last4}</span>
                {status.source === "env" && <span className={styles.envTag}>from server .env</span>}
              </>
            ) : (
              "No key set"
            )}
          </p>
        </div>
        <span className={styles.status(state.tone)}>{state.label}</span>
      </div>

      {info.description && <p className={styles.muted}>{info.description}</p>}

      {(status.updatedAt || status.lastCheckedAt) && (
        <dl className={styles.meta}>
          {status.updatedAt && (
            <div>
              <dt className={styles.metaLabel}>Updated</dt>
              <dd title={formatDateTime(status.updatedAt)}>
                {formatRelative(status.updatedAt)}
                {status.updatedBy ? ` by ${status.updatedBy}` : ""}
              </dd>
            </div>
          )}
          {status.lastCheckedAt && (
            <div>
              <dt className={styles.metaLabel}>Last test</dt>
              <dd title={formatDateTime(status.lastCheckedAt)}>{formatRelative(status.lastCheckedAt)}</dd>
            </div>
          )}
        </dl>
      )}

      {status.lastCheckOk === false && status.lastCheckError && (
        <p className={styles.checkError}>
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="break-all">{status.lastCheckError}</span>
        </p>
      )}
      {status.source === "env" && (
        <p className={styles.muted}>
          This key comes from the server's settings. Save one here to replace it.
        </p>
      )}
      {notice && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {notice}
        </p>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {editing ? (
        <form className={styles.form} onSubmit={save} noValidate>
          <TextField
            label={`${info.name} API key`}
            type="password"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            placeholder={info.keyHint}
            value={key}
            onValueChange={setKey}
          />
          <p className={styles.muted}>
            Create one in the{" "}
            <a href={info.keysUrl} target="_blank" rel="noreferrer" className={styles.link}>
              {info.name} console
            </a>
            .
          </p>
          <div className={styles.buttons}>
            <button type="submit" className={styles.primaryButton} disabled={busy}>
              {busy && <span className={styles.spinner}>progress_activity</span>}
              Save key
            </button>
            <button type="button" className={styles.secondaryButton} onClick={closeForm} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setNotice("");
              setConfirmRemove(false);
              setEditing(true);
            }}
            disabled={busy}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            {status.source === "db" ? "Replace key" : "Add key"}
          </button>
          {status.configured && (
            <button type="button" className={styles.secondaryButton} onClick={() => void test()} disabled={busy}>
              <span className={busy ? styles.spinner : "material-symbols-outlined text-[18px]"}>
                {busy ? "progress_activity" : "network_check"}
              </span>
              Test
            </button>
          )}
          {status.source === "db" && (
            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => void remove()}
              onBlur={() => setConfirmRemove(false)}
              disabled={busy}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              {confirmRemove ? "Click again to remove" : "Remove"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
