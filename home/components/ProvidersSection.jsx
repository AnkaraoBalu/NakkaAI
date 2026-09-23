import { providerCardClass } from "../data/providers.js";

export default function ProvidersSection({ selectedProvider }) {
  return (
    <section className="landing-section" id="providers">
      <div className="section-heading">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          YOUR MODEL. YOUR CHOICE.
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          Use the models you want
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div
          id="card-openai"
          className={providerCardClass("openai", selectedProvider)}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                OpenAI
              </h3>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                Cloud API
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Industry standard models with strong reasoning and broad language support for production code generation.\n          "
              }
            </p>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">GPT-5.4</span>
              <span className="text-outline text-[11px]">Recommended</span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">GPT-5 mini</span>
              <span className="text-outline text-[11px]">
                Fast &amp; low cost
              </span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">GPT-4.1</span>
              <span className="text-outline text-[11px]">Long context</span>
            </div>
          </div>
        </div>

        <div
          id="card-anthropic"
          className={providerCardClass("anthropic", selectedProvider)}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Anthropic
              </h3>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                Cloud API
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Exceptional code comprehension, nuanced reasoning, and long context windows for massive codebases.\n          "
              }
            </p>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">Claude Sonnet 5</span>
              <span className="text-primary text-[11px] font-semibold">
                Flagship agent
              </span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">Claude Haiku 4.5</span>
              <span className="text-outline text-[11px]">
                Ultra-low latency
              </span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">Claude Opus 5.5</span>
              <span className="text-outline text-[11px]">Deep analysis</span>
            </div>
          </div>
        </div>

        <div
          id="card-ollama"
          className={providerCardClass("ollama", selectedProvider)}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Ollama
              </h3>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-semibold">
                100% Local
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Zero data leaves your machine. Full agent capabilities running offline on your local GPU or Apple Silicon hardware.\n          "
              }
            </p>
          </div>
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">DeepSeek-R1</span>
              <span className="text-secondary text-[11px]">
                Local reasoning
              </span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">Llama 3.3 (70B/8B)</span>
              <span className="text-outline text-[11px]">General coding</span>
            </div>
            <div className="flex items-center justify-between font-code-md text-code-md py-1 text-on-surface">
              <span className="">Qwen 2.5 Coder</span>
              <span className="text-outline text-[11px]">Fast execution</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
