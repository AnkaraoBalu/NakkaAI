import type { AdminAccount } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useAdminAuth } from "../../../api-hooks/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import DataTable, { type Column } from "../../../components/DataTable";
import { formatDate, formatRelative } from "../../../utils/format";
import AddAdminCard from "./AddAdminCard";
import ChangePasswordCard from "./ChangePasswordCard";
import { styles } from "./Admins.style";

// Your admin password, and the admin team. Only admins can add admins.
export default function Admins() {
  const { admin } = useAdminAuth();
  const { data, setData, error } = useApiData(() => adminApi.admins(), []);

  const columns: Column<AdminAccount>[] = [
    {
      header: "Admin",
      cell: (row) => (
        <span className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">
            {row.name.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className={styles.name}>
              {row.name}
              {row.id === admin?.id && <span className={styles.you}>You</span>}
            </span>
            <span className={styles.email}>{row.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Added", cell: (row) => formatDate(row.createdAt), hideOnMobile: true },
    {
      header: "Last sign-in",
      cell: (row) => (row.lastLoginAt ? formatRelative(row.lastLoginAt) : "Never"),
      align: "right",
    },
  ];

  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        Admins sign in with email and password. Sign-up is closed once the first admin
        exists, so new admins are added here.
      </p>
      <div className={styles.split}>
        <ChangePasswordCard />
        <AddAdminCard onAdded={(added) => setData((current) => (current ? [...current, added] : [added]))} />
      </div>
      <section className={styles.card} aria-labelledby="team-title">
        <div className={styles.header}>
          <h2 id="team-title" className={styles.title}>Admins</h2>
          <p className={styles.description}>Everyone who can open this dashboard.</p>
        </div>
        {error && <p className={styles.pageError}>{error}</p>}
        {!data && !error ? (
          <p className={styles.loading}>
            <span className={styles.loadingIcon}>progress_activity</span>
            Loading admins…
          </p>
        ) : (
          data && <DataTable columns={columns} rows={data} rowKey={(row) => row.id} empty="No admins." />
        )}
      </section>
    </div>
  );
}
