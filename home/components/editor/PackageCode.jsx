export default function PackageCode({ activeFile }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="package.json code preview"
      id="file-content-package"
      className={
        " flex-1 min-h-0 max-h-[320px] md:max-h-none p-2 sm:p-3 leading-[22px] overflow-auto [&_span]:whitespace-pre text-[12px] bg-surface-container-lowest select-text font-mono transition-opacity duration-150" +
        (activeFile === "package" ? "" : " hidden")
      }
    >
      <div className="w-max min-w-full">
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">1</span>
          <span className="text-on-surface-variant">{"{"}</span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">2</span>
          <span className="text-on-surface-variant">
            {'  "name": "nakka-backend",'}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">3</span>
          <span className="text-on-surface-variant">
            {'  "version": "1.0.0",'}
          </span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 4
          </span>
          <span className="">{'  "dependencies": {'}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 5
          </span>
          <span className="">{'    "jsonwebtoken": "^9.0.2"'}</span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">6</span>
          <span className="text-on-surface-variant">{"  }"}</span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">7</span>
          <span className="text-on-surface-variant">{"}"}</span>
        </div>
      </div>
    </div>
  );
}
