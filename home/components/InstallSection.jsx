import {
  EXTENSION_ID,
  INSTALL_COMMAND,
  MARKETPLACE_URL,
} from "../../components/extension.js";
import CopyInstallButton from "../../components/CopyInstallButton.jsx";

export default function InstallSection() {
  return (
    <section className="landing-section" id="install">
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low ring-1 ring-white/5 px-5 py-8 sm:px-8 sm:py-10 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(640px,100%)] h-[260px] bg-primary-container/10 blur-[110px] rounded-full pointer-events-none"></div>
        <div className="relative flex flex-col items-center">
          <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
            GET STARTED IN SECONDS
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface max-w-2xl mb-space-md">
            Bring an agent into your editor today.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-xl">
            Free, open-source, and ready to use with your own API key or a local
            model. No Nakka account required.
          </p>
          <div className="w-full max-w-lg p-3 mb-space-xl rounded bg-surface-container-lowest font-code-md text-[12px] sm:text-code-lg flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-outline shrink-0">$</span>
              <code className="text-primary truncate">
                {INSTALL_COMMAND}
              </code>
            </div>
            <CopyInstallButton />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-space-md w-full sm:w-auto">
            <a
              className="inline-flex items-center justify-center gap-space-sm px-space-xl py-3 rounded bg-primary-container text-on-primary-container font-body-md text-body-md font-semibold hover:brightness-110 shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-all"
              href={`vscode:extension/${EXTENSION_ID}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                terminal
              </span>
              <span className="">Install for VS Code</span>
            </a>
            <a
              className="inline-flex items-center justify-center gap-space-sm px-space-xl py-3 rounded bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-bright transition-colors"
              href={MARKETPLACE_URL}
              target="_blank"
              rel="noopener"
            >
              <span className="">View on Marketplace</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
