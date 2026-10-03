import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { styles } from "./AgentPanel.style";

const DEFAULT_PLACEHOLDER = "Ask a follow-up or add next task...";

interface AgentPanelProps {
  draft: string;
  onDraftChange: (text: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function AgentPanel({
  draft,
  onDraftChange,
  inputRef,
}: AgentPanelProps) {
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onDraftChange("");
    setPlaceholder(`Analyzing: ${text}...`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPlaceholder(DEFAULT_PLACEHOLDER), 2500);
  }

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.tabGroup}>
          <button className={styles.activeTab} type="button">
            <span className={`${styles.dot} bg-primary animate-pulse`} />
            <span>Nakka</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={styles.iconButton}
            type="button"
            aria-label="History"
          >
            <span className="material-symbols-outlined text-[15px]">
              history
            </span>
          </button>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      </div>

      <div className={styles.session}>
        <div className={styles.sessionTitle}>
          <span className="material-symbols-outlined text-[16px] text-primary">
            chat_bubble
          </span>
          <span className="font-medium text-[15px]">hey hi</span>
          <button
            className="text-outline hover:text-on-surface"
            type="button"
            aria-label="Rename"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </div>
        <span className={styles.timestamp}>Just now</span>
      </div>

      <div className={styles.history}>
        <div className={styles.userBubble}>
          <p>hey hi, please read this workspace and explain simple way</p>
        </div>

        <div className={styles.steps}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className="material-symbols-outlined text-[16px] text-primary">
                  checklist
                </span>
                <span className={styles.cardTitleText}>
                  Todos (0 of 3 done)
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline">
                expand_less
              </span>
            </div>
            <div className={styles.todoList}>
              <div className={styles.todo}>
                <span className={`${styles.dot} bg-primary animate-ping`} />
                <span>Inspecting the workspace structure</span>
              </div>
              <div className={styles.pendingTodo}>
                <span className={`${styles.dot} bg-outline-variant`} />
                <span>Identify main components and flow</span>
              </div>
              <div className={styles.pendingTodo}>
                <span className={`${styles.dot} bg-outline-variant`} />
                <span>Explain in simple terms</span>
              </div>
            </div>
          </div>

          <div className={styles.rowCard}>
            <div className={styles.cardTitle}>
              <span className="material-symbols-outlined text-[16px] text-secondary">
                account_tree
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                Map workspace AST graph
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer">
              Show details
            </span>
          </div>

          <div className={styles.rowCard}>
            <div className="flex items-center gap-2 font-code-inline text-[12px] text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">
                search
              </span>
              <span>Search * in .</span>
            </div>
            <span className={styles.timestamp}>Found 101 files</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                  task_alt
                </span>
                <span className={styles.cardTitleText}>
                  Todos (1 of 3 done)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-[#10b981] font-medium">
                Running...
              </span>
            </div>
            <div className={styles.todoList}>
              <div className="flex items-center gap-2 text-[#10b981] font-medium">
                <span className="material-symbols-outlined text-[14px]">
                  check
                </span>
                <span>Inspect the workspace structure</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-medium">
                <span className={`${styles.dot} bg-primary animate-pulse`} />
                <span>Identifying main components and flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className={styles.composer} onSubmit={submit}>
        <div className="flex items-center gap-2 px-1">
          <label className="sr-only" htmlFor="agent-input-field">
            Ask a follow-up
          </label>
          <input
            ref={inputRef}
            className={styles.input}
            id="agent-input-field"
            placeholder={placeholder}
            type="text"
            autoComplete="off"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
          />
        </div>
        <div className={styles.composerActions}>
          <div className="flex items-center gap-1.5">
            <button
              className={styles.attachButton}
              title="Attach file or context"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
            <div className={styles.modelPicker}>
              <span className={`${styles.dot} bg-secondary`} />
              <span>GPT-5.4</span>
              <span className="material-symbols-outlined text-[14px] text-outline">
                expand_more
              </span>
            </div>
            <div className={styles.modeBadge}>
              <span className="material-symbols-outlined text-[12px] text-primary">
                bolt
              </span>
              <span>Auto</span>
            </div>
          </div>
          <button className={styles.sendButton} type="submit" aria-label="Send">
            <span className="material-symbols-outlined text-[18px]">
              arrow_upward
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
