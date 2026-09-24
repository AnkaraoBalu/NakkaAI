import CardCarousel from "./CardCarousel.jsx";

export default function WhyNakkaSection() {
  return (
    <section className="landing-section">
      <div className="section-heading">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          ENGINEERED FOR BUILDERS
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          Less switching. More building.
        </h2>
      </div>
      <CardCarousel label="Engineered for builders">
        <div className="min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined">dock</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Inside your editor
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          No copy-pasting code into separate web tools. Nakka interacts directly with your files and workspace state.\n        "
            }
          </p>
        </div>
        <div className="min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-4">
            <span className="material-symbols-outlined">key</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Bring your own model
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Plug in your existing API keys or run fully local models with Ollama. Zero vendor lock-in or subscription markups.\n        "
            }
          </p>
        </div>
        <div className="min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-4">
            <span className="material-symbols-outlined">lock_open</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            No Nakka account
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Install and start immediately. Nakka never collects your data, stores your code, or requires sign-up.\n        "
            }
          </p>
        </div>
        <div className="min-w-0 [overflow-wrap:anywhere] p-4 sm:p-5 rounded-xl bg-surface-container-low shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined">laptop_mac</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            Cross-platform
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {
              "\n          Works everywhere VS Code runs — macOS, Windows, Linux, and remote SSH/Docker devcontainers seamlessly.\n        "
            }
          </p>
        </div>
      </CardCarousel>
    </section>
  );
}
