import PackageCode from "./editor/PackageCode.jsx";
import UsersCode from "./editor/UsersCode.jsx";
import AuthCode from "./editor/AuthCode.jsx";
import {
  useEditorDemo,
  editorFiles,
  TAB_ACTIVE,
  TAB_IDLE,
} from "../hooks/useEditorDemo.js";

export default function EditorDemo() {
  const { activeFile, setActiveFile, messages, submitPrompt, scrollRef } =
    useEditorDemo();
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-margin-desktop pb-6 sm:pb-8">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-container/20 via-tertiary/20 to-primary/20 blur-xl opacity-70 animate-pulse-glow -z-10 pointer-events-none mx-4 sm:mx-margin-desktop"></div>
      <div className="w-full rounded-xl bg-surface-container-lowest shadow-2xl ring-1 ring-white/10 overflow-hidden relative">
        <div className="h-10 bg-surface-container-low flex items-center justify-between px-4 select-none border-b border-outline-variant/30">
          <div className="flex items-center gap-2 shrink-0 sm:w-28">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex items-center gap-2 min-w-0 px-3 text-on-surface-variant font-code-md text-code-md">
            <span className="material-symbols-outlined text-[15px] shrink-0">
              terminal
            </span>
            <span id="window-title" className="truncate">
              {editorFiles[activeFile].title}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-outline text-[14px] shrink-0">
            <span className="material-symbols-outlined hover:text-on-surface cursor-pointer text-[17px]">
              splitscreen
            </span>
            <span className="material-symbols-outlined hover:text-on-surface cursor-pointer text-[17px]">
              dock_to_right
            </span>
            <span className="material-symbols-outlined hover:text-on-surface cursor-pointer text-[17px]">
              settings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 md:min-h-[560px]">
          <div className="hidden lg:flex lg:col-span-3 bg-surface-container-low flex-col p-space-sm font-code-md text-code-md select-none border-r border-outline-variant/20">
            <div className="flex items-center justify-between px-2 py-1.5 text-on-surface-variant uppercase text-[11px] font-semibold tracking-wider">
              <span className="">Explorer</span>
              <span className="material-symbols-outlined text-[15px]">
                more_horiz
              </span>
            </div>
            <div className="mt-2 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">
                  keyboard_arrow_down
                </span>
                <span className="font-medium text-on-surface">
                  NAKKA-BACKEND
                </span>
              </div>
              <div className="ml-4 space-y-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    keyboard_arrow_down
                  </span>
                  <span className="">src</span>
                </div>
                <div className="ml-4 space-y-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      keyboard_arrow_down
                    </span>
                    <span className="">middleware</span>
                  </div>
                  <div
                    id="tree-auth"
                    onClick={() => setActiveFile("auth")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveFile("auth");
                      }
                    }}
                    className={
                      "ml-4 flex items-center justify-between px-2 py-1  rounded  cursor-pointer transition-colors" +
                      (activeFile === "auth"
                        ? " bg-surface-container text-primary"
                        : " text-on-surface-variant")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">
                        code
                      </span>
                      <span className="truncate">auth.ts</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-1.5 rounded">
                      M
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      keyboard_arrow_down
                    </span>
                    <span className="">routes</span>
                  </div>
                  <div
                    id="tree-users"
                    onClick={() => setActiveFile("users")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveFile("users");
                      }
                    }}
                    className={
                      "ml-4 flex items-center justify-between px-2 py-1  hover:bg-surface-container/60 rounded cursor-pointer transition-colors" +
                      (activeFile === "users"
                        ? " bg-surface-container text-primary"
                        : " text-on-surface-variant")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        code
                      </span>
                      <span className="truncate">users.ts</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-1.5 rounded">
                      M
                    </span>
                  </div>
                  <div className="ml-4 flex items-center justify-between px-2 py-1 text-on-surface/70 hover:bg-surface-container/40 rounded cursor-default">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        code
                      </span>
                      <span className="truncate">session.ts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      keyboard_arrow_right
                    </span>
                    <span className="">services</span>
                  </div>
                </div>
              </div>
              <div
                id="tree-package"
                onClick={() => setActiveFile("package")}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveFile("package");
                  }
                }}
                className={
                  "flex items-center justify-between px-2 py-1  hover:bg-surface-container/60 rounded cursor-pointer transition-colors" +
                  (activeFile === "package"
                    ? " bg-surface-container text-primary"
                    : " text-on-surface-variant")
                }
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-error">
                    data_object
                  </span>
                  <span className="">package.json</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 text-on-surface-variant hover:bg-surface-container/40 rounded">
                <span className="material-symbols-outlined text-[15px] text-outline">
                  tune
                </span>
                <span className="">tsconfig.json</span>
              </div>
            </div>

            <div className="mt-auto p-2 bg-surface-container rounded flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm">
                  Vector Index Ready
                </span>
              </div>
              <span className="font-code-md text-[11px] text-outline">
                48 files
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-5 min-w-0 bg-surface-container-lowest flex flex-col font-code-md text-code-md md:border-r border-outline-variant/20">
            <div className="flex items-center bg-surface-container-low overflow-x-auto whitespace-nowrap text-[13px] border-b border-outline-variant/20">
              <button
                id="tab-btn-auth"
                onClick={() => setActiveFile("auth")}
                className={activeFile === "auth" ? TAB_ACTIVE : TAB_IDLE}
                aria-pressed={activeFile === "auth"}
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  code
                </span>
                <span className="">auth.ts</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              </button>
              <button
                id="tab-btn-users"
                onClick={() => setActiveFile("users")}
                className={activeFile === "users" ? TAB_ACTIVE : TAB_IDLE}
                aria-pressed={activeFile === "users"}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  code
                </span>
                <span className="">users.ts</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container/70 opacity-80"></span>
              </button>
              <button
                id="tab-btn-package"
                onClick={() => setActiveFile("package")}
                className={activeFile === "package" ? TAB_ACTIVE : TAB_IDLE}
                aria-pressed={activeFile === "package"}
              >
                <span className="material-symbols-outlined text-[16px] text-error">
                  data_object
                </span>
                <span className="">package.json</span>
              </button>
            </div>

            <div
              className="px-4 py-1.5 text-[11px] text-outline flex items-center gap-1.5 overflow-x-auto whitespace-nowrap bg-surface-container-lowest border-b border-outline-variant/10"
              id="editor-breadcrumbs"
            >
              {editorFiles[activeFile].path.map((part, index) => (
                <span key={part}>
                  {index > 0 && " > "}
                  {part}
                </span>
              ))}
            </div>

            <AuthCode activeFile={activeFile} />

            <UsersCode activeFile={activeFile} />

            <PackageCode activeFile={activeFile} />
          </div>

          <div className="col-span-12 md:col-span-5 lg:col-span-4 min-w-0 bg-[#121316] flex flex-col justify-between font-body-md text-on-surface select-none border-t md:border-t-0 md:border-l border-outline-variant/20 overflow-hidden relative">
            <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/20 bg-[#15161b] text-[13px]">
              <div className="flex items-center gap-1">
                <span className="px-3 py-0.5 rounded-lg bg-[#2a2c34] text-white font-medium text-[12px] shadow-sm">
                  Nakka
                </span>
              </div>
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[16px] hover:text-on-surface cursor-pointer transition-colors">
                  fullscreen
                </span>
                <span className="material-symbols-outlined text-[16px] hover:text-on-surface cursor-pointer transition-colors">
                  close
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2 text-on-surface border-b border-outline-variant/10 bg-[#121316]">
              <div className="flex items-center gap-2 text-[13px] font-medium min-w-0">
                <span className="truncate">Explain this workspace</span>
                <span className="material-symbols-outlined text-[13px] text-outline hover:text-on-surface cursor-pointer">
                  edit
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-outline">
                <span className="material-symbols-outlined text-[16px] hover:text-on-surface cursor-pointer">
                  add
                </span>
                <span className="material-symbols-outlined text-[15px] hover:text-on-surface cursor-pointer">
                  schedule
                </span>
              </div>
            </div>

            <div
              className="flex-1 min-w-0 overflow-y-auto [overflow-wrap:anywhere] px-3 sm:px-4 py-3 space-y-3 font-mono text-[12px] max-h-[360px] md:max-h-[460px] select-text"
              id="agent-scroll"
              ref={scrollRef}
            >
              <div className="rounded-lg border border-[#2a2b34] bg-[#17181f] p-3 text-[13px] font-body-md text-[#e3e1ea] space-y-0.5 shadow-sm leading-[20px]">
                <div className="">
                  Read this workspace and explain how it works in simple terms.
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-outline hover:text-on-surface cursor-pointer font-body-sm text-[12px] pt-1">
                <span className="">Thinking</span>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              </div>

              <div className="pt-1 space-y-1.5 font-body-sm text-[12px]">
                <div className="flex items-center justify-between text-on-surface font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      format_list_bulleted
                    </span>
                    <span className="">
                      <strong className="text-white font-semibold">
                        Todos
                      </strong>
                      {" Inspect the workspace structure"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-outline text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">
                      segment
                    </span>
                  </div>
                </div>
                <div className="text-outline text-[11px] pl-6 flex items-center gap-1 cursor-pointer hover:text-on-surface">
                  <span className="">0 of 3 done</span>
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_drop_down
                  </span>
                </div>

                <div className="pl-6 space-y-1.5 pt-1 text-[12px]">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="w-3.5 h-3.5 shrink-0 rounded bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold leading-none">
                      −
                    </span>
                    <span className="text-[#7bd0ff] font-semibold">
                      Inspecting the workspace structure
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-outline">
                    <span className="w-3.5 h-3.5 shrink-0 rounded border border-outline-variant flex items-center justify-center text-[10px]"></span>
                    <span className="text-on-surface-variant">
                      Identify the main components and flow
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-outline">
                    <span className="w-3.5 h-3.5 shrink-0 rounded border border-outline-variant flex items-center justify-center text-[10px]"></span>
                    <span className="text-on-surface-variant">
                      Explain the workspace in simple terms
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between text-on-surface font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      map
                    </span>
                    <span className="text-white font-semibold text-[13px]">
                      Map
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[13px] text-outline">
                    segment
                  </span>
                </div>
                <div className="text-outline text-[11px] pl-6 flex items-center gap-1 cursor-pointer hover:text-on-surface">
                  <span className="">Show details</span>
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_right
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between text-on-surface font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      folder
                    </span>
                    <span className="">
                      <strong className="text-white font-semibold text-[13px]">
                        Search
                      </strong>
                      {" * in ."}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[13px] text-outline">
                    segment
                  </span>
                </div>
                <div className="text-outline text-[11px] pl-6 flex items-center gap-1 cursor-pointer hover:text-on-surface">
                  <span className="">Found 101 files</span>
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_right
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-outline hover:text-on-surface cursor-pointer font-body-sm text-[12px] pt-1">
                <span className="">Thinking</span>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              </div>

              <div className="pt-1 space-y-1.5 font-body-sm text-[12px]">
                <div className="flex items-center justify-between text-on-surface font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      format_list_bulleted
                    </span>
                    <span className="">
                      <strong className="text-white font-semibold">
                        Todos
                      </strong>
                      {" Identify the main components and flow"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-outline text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">
                      segment
                    </span>
                  </div>
                </div>
                <div className="text-outline text-[11px] pl-6 flex items-center gap-1 cursor-pointer hover:text-on-surface">
                  <span className="">1 of 3 done</span>
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_drop_down
                  </span>
                </div>

                <div className="pl-6 space-y-1.5 pt-1 text-[12px]">
                  <div className="flex items-center gap-2 text-outline">
                    <span className="w-3.5 h-3.5 shrink-0 rounded bg-secondary flex items-center justify-center text-on-secondary text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="line-through opacity-70">
                      Inspect the workspace structure
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span className="w-3.5 h-3.5 shrink-0 rounded bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold leading-none">
                      −
                    </span>
                    <span className="text-[#7bd0ff] font-semibold">
                      Identifying the main components and flow
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-outline">
                    <span className="w-3.5 h-3.5 shrink-0 rounded border border-outline-variant flex items-center justify-center text-[10px]"></span>
                    <span className="text-on-surface-variant">
                      Explain the workspace in simple terms
                    </span>
                  </div>
                </div>
              </div>

              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <p className="rounded-lg border border-outline-variant p-3 break-words">
                    {message.text}
                  </p>
                  <p
                    className="text-on-surface-variant text-[12px]"
                    role="status"
                  >
                    {message.done
                      ? `✓ This is a demo. Install Nakka to ask about “${message.text}” in your own workspace.`
                      : "Thinking…"}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#121316] border-t border-outline-variant/20">
              <form
                className="bg-[#1c1d24] border border-[#2d2e38] focus-within:border-primary-container/60 rounded-xl p-3 flex flex-col gap-2.5 shadow-xl transition-colors"
                id="agent-form"
                onSubmit={submitPrompt}
              >
                <label className="sr-only" htmlFor="agent-input-field">
                  Ask a follow-up
                </label>
                <input
                  className="w-full min-w-0 bg-transparent border-0 p-0 text-base md:text-[13px] font-body-sm text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none select-text"
                  id="agent-input-field"
                  type="text"
                  placeholder="Ask a follow-up"
                  autoComplete="off"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Add context"
                      className="w-11 h-11 md:w-6 md:h-6 shrink-0 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add
                      </span>
                    </button>
                    <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#272832] text-[11px] font-mono text-[#bdc8d1] border border-outline-variant/30 cursor-pointer hover:border-outline-variant">
                      GPT-5.4
                    </span>
                    <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#272832] text-[11px] font-mono text-[#bdc8d1] border border-outline-variant/30 cursor-pointer hover:border-outline-variant">
                      Auto
                    </span>
                  </div>
                  <button
                    type="submit"
                    aria-label="Send"
                    className="w-11 h-11 md:w-7 md:h-7 shrink-0 rounded-full bg-[#38bdf8] text-[#00354a] flex items-center justify-center hover:brightness-110 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">
                      arrow_upward
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="min-h-6 bg-primary-container text-on-primary-container px-2 sm:px-3 py-1 sm:py-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-label-sm text-[11px] select-none whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[13px]">
                commit
              </span>
              <span className="">main*</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                check_circle
              </span>
              <span className="">0 errors</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                smart_toy
              </span>
              <span id="statusbar-nakka-status" className="">
                {messages.some((message) => !message.done)
                  ? "Nakka: Reasoning..."
                  : "Nakka: Idle"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Ln 14, Col 32</span>
            <span className="hidden md:inline">UTF-8</span>
            <span id="statusbar-file-type" className="">
              {editorFiles[activeFile].type}
            </span>
            <span className="hidden sm:inline">Prettier</span>
          </div>
        </div>
      </div>
    </section>
  );
}
