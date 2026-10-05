import { useState } from "react";
import { useAdminAuth } from "../../../api-hooks/admin";
import { styles } from "./AdminMenu.style";

// The signed-in admin and a sign-out button, at the bottom of the admin sidebar.
export default function AdminMenu({ collapsed }: { collapsed: boolean }) {
  const { admin, logout } = useAdminAuth();
  const [busy, setBusy] = useState(false);
  if (!admin) return null;

  return (
    <div className={styles.root(collapsed)}>
      <span className={styles.avatar} aria-hidden="true" title={collapsed ? admin.name : undefined}>
        {admin.name.charAt(0).toUpperCase()}
      </span>
      <span className={styles.identity(collapsed)}>
        <span className={styles.name}>{admin.name}</span>
        <span className={styles.email}>{admin.email}</span>
      </span>
      <button
        type="button"
        className={styles.signOut}
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void logout();
        }}
        aria-label="Sign out"
        title="Sign out"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
      </button>
    </div>
  );
}
