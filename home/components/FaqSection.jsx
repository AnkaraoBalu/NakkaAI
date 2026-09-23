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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="p-5 rounded-xl bg-surface-container-low shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Is Nakka really free?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Yes. The Nakka extension is 100% free and open-source. You only pay for whatever model API usage you consume directly through your own OpenAI or Anthropic accounts, or $0 if you use local Ollama models.\n        "
            }
          </p>
        </div>
        <div className="p-5 rounded-xl bg-surface-container-low shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            How does Nakka read my codebase?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Nakka constructs a high-speed local vector index directly on your machine. When you run an agent prompt, relevant definitions, imports, and AST context are dynamically injected into the model payload.\n        "
            }
          </p>
        </div>
        <div className="p-5 rounded-xl bg-surface-container-low shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Can I run it with zero internet connection?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
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
        </div>
        <div className="p-5 rounded-xl bg-surface-container-low shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Does Nakka train on my code?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Never. Nakka operates entirely client-side without any intermediary proxy servers. Requests travel directly from your VS Code instance to your configured provider endpoint under your own zero-data-retention agreements.\n        "
            }
          </p>
        </div>
      </div>
    </section>
  );
}
