export const styles = {
  root: "lg:col-span-5 flex flex-col bg-surface-container-low/30 backdrop-blur-md p-space-sm",
  topBar: "flex items-center justify-between pb-space-xs",
  tabGroup:
    "flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-full text-on-surface-variant font-label-md text-label-md",
  activeTab:
    "px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-semibold shadow-sm flex items-center gap-1.5",
  iconButton:
    "w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline hover:text-on-surface shadow-sm",
  session: "flex items-center justify-between px-space-xs py-1",
  sessionTitle:
    "flex items-center gap-1.5 text-on-surface font-headline-sm text-headline-sm",
  timestamp: "font-label-sm text-label-sm text-outline",
  history: "flex-1 flex flex-col gap-space-xs overflow-y-auto pr-1 mt-1",
  userBubble:
    "self-end max-w-[92%] p-3 rounded-2xl rounded-tr-sm bg-primary text-on-primary font-body-sm text-body-sm shadow-sm",
  steps: "flex flex-col gap-2 mt-1",
  card: "p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2",
  rowCard:
    "px-3 py-2 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between",
  cardHeader: "flex items-center justify-between",
  cardTitle: "flex items-center gap-2",
  cardTitleText: "font-label-md text-label-md font-semibold text-on-surface",
  todoList:
    "flex flex-col gap-1 text-on-surface-variant font-body-sm text-[12px] pl-2",
  todo: "flex items-center gap-2",
  pendingTodo: "flex items-center gap-2 text-outline",
  dot: "w-1.5 h-1.5 rounded-full",
  composer:
    "mt-space-xs p-2 rounded-2xl bg-surface-container-lowest shadow-md flex flex-col gap-2",
  input:
    "w-full bg-transparent text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none",
  composerActions: "flex items-center justify-between pt-1",
  attachButton:
    "w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-surface transition-colors",
  modelPicker:
    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm font-medium",
  modeBadge:
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed font-label-sm text-label-sm font-medium",
  sendButton:
    "w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-all shadow-[0_2px_8px_rgba(0,97,148,0.25)]",
};
