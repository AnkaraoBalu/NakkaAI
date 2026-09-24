import { providerPillClass } from "../data/providers.js";

export default function ProviderStrip({ selectedProvider, onSelectProvider }) {
  return (
    <section className="landing-section">
      <div className="flex flex-col items-center justify-center text-center gap-space-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
          {"\n        Your editor. Your code. Your model. Your agent.\n      "}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
          {
            "\n        Seamlessly route requests to state-of-the-art hosted intelligence or run private, zero-leakage models locally on your metal.\n      "
          }
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
          <button
            id="provider-pill-openai"
            onClick={() => onSelectProvider("openai")}
            className={providerPillClass("openai", selectedProvider)}
            aria-pressed={selectedProvider === "openai"}
          >
            <span className="font-code-md text-code-md font-semibold text-on-surface whitespace-nowrap">
              OpenAI
            </span>
            <span className="hidden sm:block w-1 h-1 shrink-0 rounded-full bg-outline"></span>
            <span className="font-code-md text-[12px] text-outline">
              GPT-5.4 · GPT-5 mini
            </span>
          </button>

          <button
            id="provider-pill-anthropic"
            onClick={() => onSelectProvider("anthropic")}
            className={providerPillClass("anthropic", selectedProvider)}
            aria-pressed={selectedProvider === "anthropic"}
          >
            <span className="font-code-md text-code-md font-semibold text-tertiary whitespace-nowrap">
              Anthropic
            </span>
            <span className="hidden sm:block w-1 h-1 shrink-0 rounded-full bg-tertiary"></span>
            <span className="font-code-md text-[12px] text-on-surface-variant">
              Claude Sonnet 5 · Opus 5.5
            </span>
          </button>

          <button
            id="provider-pill-ollama"
            onClick={() => onSelectProvider("ollama")}
            className={providerPillClass("ollama", selectedProvider)}
            aria-pressed={selectedProvider === "ollama"}
          >
            <span className="font-code-md text-code-md font-semibold text-secondary whitespace-nowrap">
              Ollama (100% Local)
            </span>
            <span className="hidden sm:block w-1 h-1 shrink-0 rounded-full bg-secondary"></span>
            <span className="font-code-md text-[12px] text-outline">
              DeepSeek-R1 · Llama 3.3
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
