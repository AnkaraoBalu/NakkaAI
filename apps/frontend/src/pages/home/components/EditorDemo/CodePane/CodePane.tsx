import type { ReactNode } from "react";
import { styles, type LineKind } from "./CodePane.style";

const Kw = ({ children }: { children: ReactNode }) => (
  <span className={styles.keyword}>{children}</span>
);
const Str = ({ children }: { children: ReactNode }) => (
  <span className={styles.string}>{children}</span>
);

interface Line {
  kind: LineKind;
  number: string;
  indent?: 0 | 1 | 2;
  content: ReactNode;
}

const lines: Line[] = [
  {
    kind: "context",
    number: "1",
    content: (
      <>
        <Kw>import</Kw> {"{ Request, Response, NextFunction }"} <Kw>from</Kw>{" "}
        <Str>'express'</Str>;
      </>
    ),
  },
  {
    kind: "context",
    number: "2",
    content: (
      <>
        <Kw>import</Kw> {"{ decodeJwt, verifySigner }"} <Kw>from</Kw>{" "}
        <Str>'@nakka/crypto'</Str>;
      </>
    ),
  },
  { kind: "context", number: "3", content: null },
  {
    kind: "normal",
    number: "4",
    content: (
      <>
        <Kw>export async function</Kw>{" "}
        <span className={styles.functionName}>verifySessionToken</span>(req:
        Request, res: Response, next: NextFunction) {"{"}
      </>
    ),
  },
  {
    kind: "normal",
    number: "5",
    indent: 1,
    content: (
      <>
        const header = req.headers[<Str>'authorization'</Str>];
      </>
    ),
  },
  {
    kind: "normal",
    number: "6",
    indent: 1,
    content: (
      <>
        <Kw>if</Kw> (!header?.startsWith(<Str>'Bearer '</Str>)) {"{"}
      </>
    ),
  },
  {
    kind: "normal",
    number: "7",
    indent: 2,
    content: (
      <>
        <Kw>return</Kw> res.status(401).json({"{"} error:{" "}
        <Str>'Missing Bearer token'</Str> {"}"});
      </>
    ),
  },
  { kind: "normal", number: "8", indent: 1, content: "}" },
  {
    kind: "removed",
    number: "- 9",
    indent: 1,
    content: "const rawToken = header.split(' ')[1]; // Unchecked token parse",
  },
  {
    kind: "removed",
    number: "- 10",
    indent: 1,
    content:
      "const claims = decodeJwt(rawToken); // vulnerable to unverified signature",
  },
  {
    kind: "added",
    number: "+ 9",
    indent: 1,
    content: "const rawToken = header.slice(7).trim();",
  },
  {
    kind: "added",
    number: "+ 10",
    indent: 1,
    content:
      "const verified = await verifySigner(rawToken, process.env.APP_SECRET!);",
  },
  {
    kind: "added",
    number: "+ 11",
    indent: 1,
    content:
      "if (!verified.valid) return res.status(403).json({ error: 'Expired signature' });",
  },
  {
    kind: "normal",
    number: "12",
    indent: 1,
    content: "req.user = verified.payload;",
  },
  { kind: "normal", number: "13", indent: 1, content: "return next();" },
  { kind: "normal", number: "14", content: "}" },
];

const breadcrumbs = ["nakka-backend", "src", "middleware"];

export default function CodePane() {
  return (
    <div className={styles.root}>
      <div className={styles.tabs}>
        <div className={styles.activeTab}>
          <span className="material-symbols-outlined text-[14px] text-primary">
            javascript
          </span>
          <span>auth.ts</span>
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="material-symbols-outlined text-[14px] text-outline hover:text-on-surface cursor-pointer">
            close
          </span>
        </div>
        <div className={styles.tab}>
          <span className="material-symbols-outlined text-[14px] text-outline">
            javascript
          </span>
          <span>users.ts</span>
        </div>
      </div>

      <div className={styles.breadcrumbs}>
        {breadcrumbs.map((part) => (
          <span key={part} className="contents">
            <span>{part}</span>
            <span>&gt;</span>
          </span>
        ))}
        <span className="text-on-surface font-medium">auth.ts</span>
        <span>&gt;</span>
        <span className="text-primary font-medium">verifySessionToken</span>
      </div>

      <div className={styles.code}>
        {lines.map((line) => (
          <div key={line.number} className={styles.line[line.kind]}>
            <span className={styles.lineNumber[line.kind]}>{line.number}</span>
            <span
              className={
                line.kind === "removed"
                  ? `${styles.indent[line.indent ?? 0]} ${styles.removedText}`
                  : styles.indent[line.indent ?? 0]
              }
            >
              {line.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
