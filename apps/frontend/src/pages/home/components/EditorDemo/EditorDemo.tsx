import type { RefObject } from "react";
import Explorer from "./Explorer";
import CodePane from "./CodePane";
import AgentPanel from "./AgentPanel";
import StatusBar from "./StatusBar";
import { styles } from "./EditorDemo.style";

interface EditorDemoProps {
  draft: string;
  onDraftChange: (text: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function EditorDemo({
  draft,
  onDraftChange,
  inputRef,
}: EditorDemoProps) {
  return (
    <div className={styles.root}>
      <div className={styles.window}>
        <div className={styles.titleBar}>
          <div className={styles.trafficLights} aria-hidden="true">
            <div className={styles.trafficLight.close} />
            <div className={styles.trafficLight.minimize} />
            <div className={styles.trafficLight.zoom} />
          </div>
          <div className={styles.title}>
            <span className="material-symbols-outlined text-[15px] text-primary">
              folder_open
            </span>
            <span className={styles.titleProject}>nakka-agent</span>
            <span className={styles.titleSeparator}>—</span>
            <span className={styles.titlePath}>src/middleware/auth.ts</span>
            <span className={styles.titleSeparator}>—</span>
            <span className={styles.titleApp}>VS Code</span>
          </div>
          <div className={styles.windowActions} aria-hidden="true">
            <span className={styles.windowActionIcon}>split_scene</span>
            <span className={styles.windowActionIcon}>dock_to_right</span>
            <span className={styles.windowActionIcon}>more_horiz</span>
          </div>
        </div>

        <div className={styles.body}>
          <Explorer />
          <CodePane />
          <AgentPanel
            draft={draft}
            onDraftChange={onDraftChange}
            inputRef={inputRef}
          />
        </div>

        <StatusBar />
      </div>
    </div>
  );
}
