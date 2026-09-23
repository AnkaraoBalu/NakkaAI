import { INSTALL_COMMAND } from "./extension.js";
import { useEffect, useRef, useState } from "react";

export default function CopyInstallButton() {
  const [status, setStatus] = useState("idle");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  }

  const label =
    status === "copied"
      ? "Command copied"
      : status === "error"
        ? "Copy failed. Select and copy the command manually."
        : "Copy install command";
  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={copyCommand}
        className="material-symbols-outlined text-[18px] text-outline hover:text-on-surface shrink-0"
      >
        {status === "copied"
          ? "done"
          : status === "error"
            ? "error"
            : "content_copy"}
      </button>
      <span className="sr-only" role="status">
        {status !== "idle" ? label : ""}
      </span>
    </>
  );
}
