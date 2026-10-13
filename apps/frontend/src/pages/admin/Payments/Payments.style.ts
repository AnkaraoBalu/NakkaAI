import { styles as usersStyles } from "../Users/Users.style";

export const styles = {
  ...usersStyles,
  filters: "flex flex-col sm:flex-row sm:items-center gap-space-sm",
  reference: "block truncate font-label-sm text-label-sm text-outline",
  status: (status: string) =>
    "rounded-full px-2.5 py-1 text-xs font-semibold " +
    (status === "paid"
      ? "bg-emerald-100 text-emerald-800"
      : status === "failed"
        ? "bg-red-100 text-red-800"
        : "bg-amber-100 text-amber-800"),
};
