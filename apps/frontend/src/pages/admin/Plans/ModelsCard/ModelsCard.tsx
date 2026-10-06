import { useState, type FormEvent } from "react";
import type { AdminPlan } from "@nakka/types/admin";
import type { PlanModel, Provider } from "@nakka/types/plans";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import { PROVIDER_INFO, PROVIDERS } from "../../../../constants/providers";
import { styles } from "./ModelsCard.style";

interface Row {
  modelId: string;
  provider: Provider;
  // Blank means "same as the model id".
  upstreamModel: string;
  // Dollars per million tokens, as typed. Blank cache prices = input price.
  inputPrice: string;
  outputPrice: string;
  cacheReadPrice: string;
  cacheWritePrice: string;
  premium: boolean;
}

const PRICE = /^\d+(\.\d{1,4})?$/;
const PRICE_FIELDS = [
  { key: "inputPrice", label: "Input", required: true },
  { key: "outputPrice", label: "Output", required: true },
  { key: "cacheReadPrice", label: "Cache read", required: false },
  { key: "cacheWritePrice", label: "Cache write", required: false },
] as const;
const priceText = (price: number | null) => (price === null ? "" : String(price));

const MODEL_NAME = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,99}$/;
const MAX_MODELS = 50;

const toRows = (models: PlanModel[]): Row[] =>
  models.map((model) => ({
    modelId: model.modelId,
    provider: model.provider,
    upstreamModel: model.upstreamModel === model.modelId ? "" : model.upstreamModel,
    // A model saved before prices existed shows blank, so it must be filled in.
    inputPrice: model.inputPrice ? String(model.inputPrice) : "",
    outputPrice: model.outputPrice ? String(model.outputPrice) : "",
    cacheReadPrice: priceText(model.cacheReadPrice),
    cacheWritePrice: priceText(model.cacheWritePrice),
    premium: model.premium,
  }));

const optionalPrice = (text: string) => (text.trim() ? Number(text) : null);

const toModels = (rows: Row[]): PlanModel[] =>
  rows.map((row) => ({
    modelId: row.modelId.trim(),
    provider: row.provider,
    upstreamModel: row.upstreamModel.trim() || row.modelId.trim(),
    inputPrice: Number(row.inputPrice),
    outputPrice: Number(row.outputPrice),
    cacheReadPrice: optionalPrice(row.cacheReadPrice),
    cacheWritePrice: optionalPrice(row.cacheWritePrice),
    premium: row.premium,
  }));

function validate(rows: Row[]): string {
  for (const row of rows) {
    const name = row.modelId.trim() || "each model";
    for (const field of PRICE_FIELDS) {
      const text = row[field.key].trim();
      if (!text && !field.required) continue;
      if (!PRICE.test(text) || (field.required && Number(text) <= 0))
        return `Set ${name}'s ${field.label.toLowerCase()} price in dollars per million tokens.`;
    }
  }
  for (const model of toModels(rows)) {
    if (!MODEL_NAME.test(model.modelId)) return "Model ids may use letters, digits and . _ : / @ - (no spaces).";
    if (!MODEL_NAME.test(model.upstreamModel)) return "Provider model names may use letters, digits and . _ : / @ -";
  }
  const ids = rows.map((row) => row.modelId.trim());
  if (new Set(ids).size !== ids.length) return "Each model can only be on the plan once.";
  return "";
}

// The models users on this plan can pick, in the order the extension lists them.
export default function ModelsCard({ plan, onSaved }: { plan: AdminPlan; onSaved: (plan: AdminPlan) => void }) {
  const [rows, setRows] = useState<Row[]>(() => toRows(plan.models));
  const [saved, setSaved] = useState(false);
  const { busy, error, setError, run } = useRequest();
  const dirty = JSON.stringify(rows) !== JSON.stringify(toRows(plan.models));

  const change = (next: (current: Row[]) => Row[]) => {
    setSaved(false);
    setRows(next);
  };
  const update = (index: number, patch: Partial<Row>) =>
    change((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const move = (index: number, by: -1 | 1) =>
    change((current) => {
      const next = [...current];
      const [row] = next.splice(index, 1);
      next.splice(index + by, 0, row!);
      return next;
    });

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validate(rows);
    if (problem) return setError(problem);
    const result = await run(() => adminApi.setPlanModels(plan.id, toModels(rows)));
    if (!result) return;
    onSaved(result);
    setRows(toRows(result.models));
    setSaved(true);
  }

  return (
    <form className={styles.card} onSubmit={save} noValidate aria-labelledby="models-title">
      <div className={styles.header}>
        <h2 id="models-title" className={styles.title}>Models</h2>
        <p className={styles.description}>
          The model id is what users see and pick in VS Code. The provider model is the
          name sent to the provider, if it's different (for example a dated version).
          Prices are what the provider charges you, in dollars per million tokens, from
          their pricing page; they decide how fast each request uses up the allowance.
          Cache prices left blank are charged at the input price. Mark expensive models
          (Opus-class) as premium: they also count against the plan's premium-only window.
        </p>
      </div>

      {rows.length ? (
        <ol className={styles.rows}>
          <li className={styles.rowHead} aria-hidden="true">
            <span>Model id</span>
            <span>Provider</span>
            <span>Provider model (optional)</span>
            <span />
          </li>
          {rows.map((row, index) => (
            <li key={index} className={styles.row}>
              <input
                className={styles.input}
                aria-label="Model id"
                placeholder="e.g. gpt-5.5"
                spellCheck={false}
                value={row.modelId}
                onChange={(event) => update(index, { modelId: event.target.value })}
              />
              <select
                className={styles.input}
                aria-label="Provider"
                value={row.provider}
                onChange={(event) => update(index, { provider: event.target.value as Provider })}
              >
                {PROVIDERS.map((provider) => (
                  <option key={provider} value={provider}>
                    {PROVIDER_INFO[provider].name}
                  </option>
                ))}
              </select>
              <input
                className={styles.input}
                aria-label="Provider model name"
                placeholder={row.modelId.trim() || "Same as model id"}
                spellCheck={false}
                value={row.upstreamModel}
                onChange={(event) => update(index, { upstreamModel: event.target.value })}
              />
              <div className={styles.prices}>
                {PRICE_FIELDS.map((field) => (
                  <label key={field.key} className={styles.priceField}>
                    <span className={styles.priceLabel}>
                      {field.label}
                      {field.required ? "" : " (optional)"}
                    </span>
                    <span className={styles.money}>
                      <span className={styles.currency} aria-hidden="true">$</span>
                      <input
                        className={styles.moneyInput}
                        inputMode="decimal"
                        placeholder={field.required ? "0.00" : row.inputPrice || "= input"}
                        value={row[field.key]}
                        onChange={(event) =>
                          update(index, { [field.key]: event.target.value.replace(/[^\d.]/g, "") })
                        }
                      />
                    </span>
                  </label>
                ))}
                <span className={styles.perMillion}>per 1M tokens</span>
                <label className={styles.premium} title="Also counts against the plan's premium-only weekly window">
                  <input
                    type="checkbox"
                    checked={row.premium}
                    onChange={(event) => update(index, { premium: event.target.checked })}
                  />
                  Premium model
                </label>
              </div>
              <div className={styles.rowActions}>
                <button type="button" className={styles.iconButton} disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
                <button type="button" className={styles.iconButton} disabled={index === rows.length - 1} onClick={() => move(index, 1)} aria-label="Move down">
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => change((current) => current.filter((_, i) => i !== index))}
                  aria-label={`Remove ${row.modelId || "model"}`}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>
          <span className="material-symbols-outlined text-[18px]">block</span>
          No models yet: users on this plan can't make any requests.
        </p>
      )}

      {rows.length < MAX_MODELS && (
        <div className="flex flex-wrap gap-space-sm">
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() =>
              change((current) => [
                ...current,
                {
                  modelId: "",
                  provider: "openai",
                  upstreamModel: "",
                  inputPrice: "",
                  outputPrice: "",
                  cacheReadPrice: "",
                  cacheWritePrice: "",
                  premium: false,
                },
              ])
            }
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add model
          </button>
          {!rows.some((row) => row.modelId.trim() === "gpt-5.4") && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => change((current) => [
                ...current,
                {
                  modelId: "gpt-5.4",
                  provider: "fuelix",
                  upstreamModel: "gpt-5.4",
                  inputPrice: "",
                  outputPrice: "",
                  cacheReadPrice: "",
                  cacheWritePrice: "",
                  premium: false,
                },
              ])}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add GPT-5.4 via Fuelix
            </button>
          )}
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
      {saved && !dirty && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved. Users see the new list next time the extension loads models.
        </p>
      )}
      <div className={styles.footer}>
        <button type="submit" className={styles.primaryButton} disabled={busy || !dirty}>
          {busy && <span className={styles.spinner}>progress_activity</span>}
          Save models
        </button>
        {dirty && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setRows(toRows(plan.models));
              setError("");
            }}
          >
            Discard changes
          </button>
        )}
      </div>
    </form>
  );
}
