import { cardStyles } from "../../../styles/card.style";

export const styles = {
  ...cardStyles,
  card: cardStyles.card.replace("gap-space-md", "gap-space-lg"),
  head: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-space-md",
  eyebrow:
    "font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold",
  titleRow: "flex items-center gap-space-sm flex-wrap",
  planName:
    "font-headline-md text-headline-md text-on-surface font-semibold tracking-tight",
  meters: "grid grid-cols-1 md:grid-cols-2 gap-space-lg",
  noLimits:
    "flex items-center gap-2 font-body-md text-body-md text-on-surface-variant",
};
