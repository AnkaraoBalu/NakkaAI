import { useEffect, useRef, useState } from "react";

export const editorFiles = {
  auth: {
    title: "nakka-agent — src/middleware/auth.ts — VS Code",
    path: ["src", "middleware", "auth.ts", "verifyToken()"],
    type: "TypeScript",
  },
  users: {
    title: "nakka-agent — src/routes/users.ts — VS Code",
    path: ["src", "routes", "users.ts", "router.get()"],
    type: "TypeScript",
  },
  package: {
    title: "nakka-agent — package.json — VS Code",
    path: ["root", "package.json"],
    type: "JSON",
  },
};
export const TAB_ACTIVE =
  "flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 bg-surface-container-lowest text-on-surface border-t-2 border-primary-container focus:outline-none transition-colors";
export const TAB_IDLE =
  "flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 text-on-surface-variant border-t-2 border-transparent hover:bg-surface-container-high/40 focus:outline-none transition-colors";

export function useEditorDemo() {
  const [activeFile, setActiveFile] = useState("auth");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);
  const timers = useRef(new Set());
  const nextId = useRef(0);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );
  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  function submitPrompt(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const id = nextId.current++;
    input.value = "";
    setMessages((previous) => [...previous, { id, text, done: false }]);
    const timer = setTimeout(() => {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === id ? { ...message, done: true } : message,
        ),
      );
      timers.current.delete(timer);
    }, 1800);
    timers.current.add(timer);
  }

  return { activeFile, setActiveFile, messages, submitPrompt, scrollRef };
}
