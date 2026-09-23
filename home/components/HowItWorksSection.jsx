import { INSTALL_COMMAND } from "../../components/extension.js";
import CopyInstallButton from "../../components/CopyInstallButton.jsx";

export default function HowItWorksSection() {
  return (
    <section className="landing-section" id="how-it-works">
      <div className="section-heading">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          SIMPLE BY DESIGN
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          Install. Connect. Build.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm">
          <div>
            <div className="font-headline-lg text-headline-lg text-outline mb-3">
              01
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Install Nakka
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              {
                "\n            Search for “Nakka” in the VS Code Marketplace or install directly via your terminal with one command.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[12px] flex items-center justify-between gap-2 text-on-surface">
            <code className="text-primary truncate min-w-0">
              {INSTALL_COMMAND}
            </code>
            <CopyInstallButton />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm">
          <div>
            <div className="font-headline-lg text-headline-lg text-outline mb-3">
              02
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Choose your model
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              {
                "\n            Enter your OpenAI or Anthropic API key, or point Nakka to a local Ollama instance for 100% offline, private coding.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[12px] flex items-center justify-between text-outline">
            <span className="">ollama: http://localhost:11434</span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm">
          <div>
            <div className="font-headline-lg text-headline-lg text-outline mb-3">
              03
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Start building
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              {
                "\n            Open the Nakka panel, type your task in natural language, and let the agent navigate, edit, and verify your code.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[12px] flex items-center justify-between text-secondary">
            <span className="">{"> Ready for instructions"}</span>
            <span className="material-symbols-outlined text-[16px]">bolt</span>
          </div>
        </div>
      </div>
    </section>
  );
}
