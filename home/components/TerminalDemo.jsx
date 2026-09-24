import { useTerminalDemo, command } from "../hooks/useTerminalDemo.js";

export default function TerminalDemo() {
  const { typed, step, testCount, setRun } = useTerminalDemo();
  return (
    <section className="landing-section">
      <div className="section-heading text-center max-w-3xl mx-auto">
        <div className="font-label-sm text-label-sm tracking-wider uppercase text-primary mb-2">
          AUTONOMOUS EXECUTION
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface mb-3">
          Built for the way developers actually work
        </h2>
        <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant">
          {
            "\n        Execute full development loops right from your command line or editor palette. Watch Nakka discover test regressions and heal them in real-time.\n      "
          }
        </p>
      </div>

      <div className="max-w-4xl mx-auto rounded-xl bg-surface-container-lowest shadow-2xl overflow-hidden font-code-md text-code-md border border-outline-variant/30">
        <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between gap-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-outline-variant"></div>
            <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-outline-variant"></div>
            <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-outline-variant"></div>
            <span className="text-outline text-[12px] ml-2 font-mono truncate">
              zsh — nakka-runner — 80×24
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="flex min-h-11 sm:min-h-0 items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-surface-container hover:bg-surface-bright text-primary hover:text-white transition-colors"
              onClick={() => setRun((run) => run + 1)}
            >
              <span className="material-symbols-outlined text-[13px]">
                refresh
              </span>
              <span className="">Re-run</span>
            </button>
            <span className="hidden sm:inline font-label-sm text-label-sm text-outline">
              node v22.11.0
            </span>
          </div>
        </div>

        <div
          className="p-4 sm:p-6 space-y-3 font-mono text-[12px] sm:text-[13px] leading-[20px] sm:leading-[22px] select-text min-h-[300px] [overflow-wrap:anywhere]"
          id="terminal-content"
        >
          <div className="flex items-center gap-2 text-on-surface flex-wrap">
            <span className="text-primary font-bold">λ</span>
            <span className="text-secondary font-semibold">repo-core</span>
            <span className="text-outline">git:(main)</span>
            <span className="text-on-surface font-semibold">{">"}</span>
            <span className="text-on-surface break-all" id="term-command-text">
              {command.slice(0, typed)}
            </span>
            <span className="cursor-blink text-primary" id="term-cursor">
              ▍
            </span>
          </div>
          <div
            id="term-step-1"
            className={
              "text-outline flex items-start gap-2 pt-1 transition-opacity duration-300 opacity-100" +
              (step >= 1 ? "" : " hidden")
            }
          >
            <span className="text-primary">→</span>
            <span className="">
              {"Analyzing test suite output from "}
              <code className="text-on-surface">npm test</code>...
            </span>
          </div>
          <div
            id="term-step-2"
            className={
              "text-error bg-error-container/10 p-3 rounded space-y-1 transition-opacity duration-300 opacity-100" +
              (step >= 2 ? "" : " hidden")
            }
          >
            <div className="">FAIL  tests/unit/auth.test.ts</div>
            <div className="text-error/80 text-[12px]">
              {"• verifyToken() > should reject expired timestamp tokens"}
            </div>
            <div className="text-error/60 text-[11px] break-words">
              Expected: 401 Unauthorized, Received: 200 OK (drift: 1200ms)
            </div>
          </div>
          <div
            id="term-step-3"
            className={
              "text-on-surface-variant flex items-start gap-2 transition-opacity duration-300 opacity-100" +
              (step >= 3 ? "" : " hidden")
            }
          >
            <span className="text-tertiary">→</span>
            <span className="">
              {"Root cause identified: "}
              <code className="text-on-surface">src/services/crypto.ts:42</code>
              {" compares milliseconds to seconds without dividing Unix epoch."}
            </span>
          </div>
          <div
            id="term-step-4"
            className={
              "text-on-surface-variant flex items-start gap-2 transition-opacity duration-300 opacity-100" +
              (step >= 4 ? "" : " hidden")
            }
          >
            <span className="text-secondary">→</span>
            <span className="">
              {"Applying atomic patch to "}
              <code className="text-on-surface">src/services/crypto.ts</code>
              {" (Lines 42-45)..."}
            </span>
          </div>
          <div
            id="term-step-5"
            className={
              "text-on-surface-variant flex items-start gap-2 transition-opacity duration-300 opacity-100" +
              (step >= 5 ? "" : " hidden")
            }
          >
            <span className="text-primary animate-pulse">→</span>
            <span className="">Re-running test runner...</span>
          </div>

          <div
            id="term-step-6"
            className={
              "mt-4 p-3 rounded bg-secondary-container/20 text-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-label-md transition-opacity duration-300 opacity-100" +
              (step >= 6 ? "" : " hidden")
            }
          >
            <div className="flex items-start sm:items-center gap-2">
              <span className="material-symbols-outlined text-[20px] shrink-0">
                check_circle
              </span>
              <span className="font-bold">
                PASS  tests/unit/auth.test.ts (
                <span id="test-counter" className="">
                  {testCount}
                </span>
                {" tests passed, 1.42s)"}
              </span>
            </div>
            <span className="font-code-md text-[12px] opacity-80">
              All checks green
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
