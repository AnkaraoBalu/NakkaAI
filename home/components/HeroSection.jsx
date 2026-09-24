import { MARKETPLACE_URL } from "../../components/extension.js";

export default function HeroSection() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-margin-desktop pt-8 sm:pt-12 pb-6 sm:pb-8 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(720px,100%)] h-[360px] bg-primary-container/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-1/3 w-[340px] h-[220px] bg-tertiary-container/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="inline-flex max-w-full items-center gap-space-sm px-space-md py-1 rounded bg-surface-container-low text-on-surface shadow-sm mb-space-lg">
        <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary-container shadow-[0_0_8px_#38bdf8] animate-pulse"></span>
        <span className="font-label-sm text-label-sm tracking-wider uppercase text-primary">
          AI Coding Agent for VS Code
        </span>
      </div>

      <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl lg:text-[48px] lg:leading-[56px] text-on-surface max-w-4xl [text-wrap:balance] tracking-tight mb-space-lg">
        {"\n      Build with an agent that lives in your editor.\n    "}
      </h1>

      <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl mb-space-xl">
        {
          "\n      Nakka is an AI coding agent built directly into VS Code. Understand your codebase, write and modify code, debug problems, and ship faster — without leaving your editor.\n    "
        }
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-space-md mb-space-lg w-full max-w-sm sm:max-w-none sm:w-auto">
        <a
          className="inline-flex items-center justify-center gap-space-sm min-h-12 px-space-md sm:px-space-xl py-3 rounded bg-primary-container text-on-primary-container font-body-md text-body-md font-semibold hover:brightness-110 shadow-[0_0_24px_rgba(56,189,248,0.25)] transition-all"
          href="#install"
        >
          <span className="material-symbols-outlined text-[20px]">
            terminal
          </span>
          <span className="">Install for VS Code</span>
        </a>
        <a
          className="inline-flex items-center justify-center gap-space-sm min-h-12 px-space-md sm:px-space-xl py-3 rounded bg-surface-container-high text-on-surface font-body-md text-body-md hover:bg-surface-bright transition-colors"
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

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-space-md gap-y-2 sm:gap-y-space-xs font-code-md text-code-md text-outline">
        <span className="">Free to use</span>
        <span aria-hidden="true" className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span>
        <span className="">Bring your own API key</span>
        <span aria-hidden="true" className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span>
        <span className="">No Nakka account required</span>
      </div>
    </section>
  );
}
