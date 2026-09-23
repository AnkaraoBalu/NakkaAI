const providerStyles = {
  openai: {
    hover: "hover:border-primary/40",
    ring: "ring-primary/60",
    glow: "shadow-[0_0_15px_rgba(56,189,248,0.2)]",
  },
  anthropic: {
    hover: "hover:border-tertiary/40",
    ring: "ring-tertiary/60",
    glow: "shadow-[0_0_15px_rgba(0,226,237,0.2)]",
  },
  ollama: {
    hover: "hover:border-secondary/40",
    ring: "ring-secondary/60",
    glow: "shadow-[0_0_15px_rgba(78,222,163,0.2)]",
  },
};

export function providerPillClass(provider, selected) {
  const style = providerStyles[provider];
  const base =
    "flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2 rounded-lg border border-transparent cursor-pointer transition-all ";
  return (
    base +
    (provider === selected
      ? `bg-surface-container-high ring-1 ${style.ring} ${style.glow}`
      : `bg-surface-container-low shadow-sm hover:bg-surface-container ${style.hover}`)
  );
}

export function providerCardClass(provider, selected) {
  const base =
    "p-5 rounded-xl flex flex-col justify-between border border-transparent transition-all duration-300 ";
  return (
    base +
    (provider === selected
      ? `bg-surface-container shadow-xl ring-1 ${providerStyles[provider].ring} md:scale-[1.02]`
      : "bg-surface-container-low shadow-sm")
  );
}
