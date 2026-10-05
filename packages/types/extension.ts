// Shapes fixed by the VS Code extension ("Nakka backend — what to build").

// GET /account
export interface ExtensionAccount {
  email: string;
  plan: string;
  signedInWith?: "Google" | "GitHub" | "Nakka";
  workspace?: string;
  windows?: UsageWindow[];
  manageUrl?: string;
}

// Allowances measure cost, like Claude Code's, so users see a percentage:
// `used` is 0–100 and `limit` is always 100.
export interface UsageWindow {
  id: string;
  label: string;
  used: number;
  limit: number;
  resetsAt: string;
}

// GET /v1/models
export interface ModelList {
  data: { id: string }[];
}

// Website side of the /auth handoff.
export interface ExtensionAuthStartRequest {
  state: string;
  redirect: string;
}

export interface ExtensionAuthCompleteRequest {
  state: string;
}

export interface ExtensionAuthCompleteResponse {
  // vscode://Nakka.nakka/auth?state=…&token=…
  redirectUrl: string;
}
