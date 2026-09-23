export default function FeaturesSection() {
  return (
    <section className="landing-section" id="features">
      <div className="section-heading">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          BUILT TO WORK WITH YOU
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface">
          More than autocomplete. A collaborative engineering partner.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[22px]">
                account_tree
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Understand your codebase
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Nakka maps symbols, abstract syntax trees, and dependency relationships so every suggested change matches your architectural invariants.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] text-outline space-y-1">
            <div className="text-secondary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Indexed 14,204 AST nodes
            </div>
            <div className="">src/models · src/controllers · lib/db</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mb-4">
              <span className="material-symbols-outlined text-[22px]">
                difference
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Write and edit code
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Perform surgical multi-line edits. Accept or reject exact hunk diffs directly in your open editor buffers with instant keystrokes.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] space-y-1">
            <div className="text-secondary bg-secondary-container/10 px-1 py-0.5 rounded break-all">
              {"+ export type SessionClaims = { uid: string };"}
            </div>
            <div className="text-error bg-error-container/10 px-1 py-0.5 rounded break-all">
              - export type SessionClaims = any;
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[22px]">
                bug_report
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Debug with context
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Paste terminal stack traces or compiler panics directly. Nakka pinpoints the origin, reads upstream calls, and presents the solution.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] text-error flex flex-wrap items-center justify-between gap-2">
            <span className="">Uncaught TypeError: req.user is undefined</span>
            <span className="text-secondary font-label-sm">Auto-fix ready</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary mb-4">
              <span className="material-symbols-outlined text-[22px]">
                published_with_changes
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Refactor without the busywork
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Execute repo-wide transformations, API migrations, and dependency upgrades while preserving typing and linting rules.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] flex flex-wrap items-center justify-between gap-2 text-on-surface">
            <span className="text-outline">Migration: Axios → Fetch API</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm">
              8 files staged
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[22px]">
                help_center
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Ask your codebase
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            Query your project in plain English. Get answers grounded in your real repository logic with precise file and line references.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] text-on-surface-variant space-y-0.5">
            <div className="text-primary font-medium">
              “Where is user authorization handled?”
            </div>
            <div className="text-outline text-[10px]">
              Verified in src/middleware/auth.ts:24
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-low flex flex-col justify-between shadow-sm hover:bg-surface-container transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface mb-4">
              <span className="material-symbols-outlined text-[22px]">
                tab_unselected
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Stay inside VS Code
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              {
                "\n            No browser windows, no copying code into web chats, no lost context. A seamless extension running within your existing development setup.\n          "
              }
            </p>
          </div>
          <div className="p-3 rounded bg-surface-container-lowest font-code-md text-[11px] flex flex-wrap items-center justify-between gap-2 text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px]">
                Cmd
              </kbd>
              <span className="">+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px]">
                K
              </kbd>
              <span className="text-outline ml-1">Inline Agent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px]">
                Cmd
              </kbd>
              <span className="">+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px]">
                I
              </kbd>
              <span className="text-outline ml-1">Workbench</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
