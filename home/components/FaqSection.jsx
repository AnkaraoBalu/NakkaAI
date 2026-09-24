export default function FaqSection() {
  return (
    <section className="landing-section" id="faq">
      <div className="section-heading">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          QUESTIONS &amp; ANSWERS
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <details className="group w-full min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <summary className="min-h-11 flex items-start justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary font-headline-sm text-headline-sm text-on-surface">
            <span>
            Is Nakka really free?
          </span>
            <span aria-hidden="true" className="material-symbols-outlined shrink-0 transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Yes. The Nakka extension is 100% free and open-source. You only pay for whatever model API usage you consume directly through your own OpenAI or Anthropic accounts, or $0 if you use local Ollama models.\n        "
            }
          </p>
        </details>
        <details className="group w-full min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <summary className="min-h-11 flex items-start justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary font-headline-sm text-headline-sm text-on-surface">
            <span>
            How does Nakka read my codebase?
          </span>
            <span aria-hidden="true" className="material-symbols-outlined shrink-0 transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Nakka constructs a high-speed local vector index directly on your machine. When you run an agent prompt, relevant definitions, imports, and AST context are dynamically injected into the model payload.\n        "
            }
          </p>
        </details>
        <details className="group w-full min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <summary className="min-h-11 flex items-start justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary font-headline-sm text-headline-sm text-on-surface">
            <span>
            Can I run it with zero internet connection?
          </span>
            <span aria-hidden="true" className="material-symbols-outlined shrink-0 transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Absolutely. Select Ollama as your provider, point Nakka to "
            }
            <code className="text-primary font-mono text-[12px]">
              localhost:11434
            </code>
            {
              ", and you can edit code on an airplane with zero telemetry or cloud connectivity.\n        "
            }
          </p>
        </details>
        <details className="group w-full min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <summary className="min-h-11 flex items-start justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary font-headline-sm text-headline-sm text-on-surface">
            <span>
            Does Nakka train on my code?
          </span>
            <span aria-hidden="true" className="material-symbols-outlined shrink-0 transition-transform duration-200 group-open:rotate-180">expand_more</span>
          </summary>
          <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Never. Nakka operates entirely client-side without any intermediary proxy servers. Requests travel directly from your VS Code instance to your configured provider endpoint under your own zero-data-retention agreements.\n        "
            }
          </p>
        </details>
      </div>
    </section>
  );
}
