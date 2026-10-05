import type { ProviderKeyStatus } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import ProviderKeyCard from "./ProviderKeyCard";
import { styles } from "./ProviderKeys.style";

// Nakka's own API key for each AI company. Users never see or need these.
export default function ProviderKeys() {
  const { data, setData, error } = useApiData(() => adminApi.providerKeys(), []);

  const replace = (status: ProviderKeyStatus) =>
    setData((current) =>
      current?.map((item) => (item.provider === status.provider ? status : item)) ?? null,
    );

  return (
    <div className={styles.page}>
      <div className={styles.notice}>
        <span className="material-symbols-outlined text-[20px]">encrypted</span>
        <p>
          Keys are encrypted before they're saved and never shown again; you'll only see
          the last 4 characters. Every request from the extension is sent with the key for
          its model's provider. A provider without a key can't serve its models.
        </p>
      </div>

      {error && <p className={styles.pageError}>{error}</p>}
      {!data && !error && (
        <p className={styles.loading}>
          <span className={styles.loadingIcon}>progress_activity</span>
          Loading keys…
        </p>
      )}
      {data && (
        <div className={styles.grid}>
          {data.map((status) => (
            <ProviderKeyCard
              key={status.provider}
              status={status}
              onChange={replace}
              onRemoved={async () => replace(
                (await adminApi.providerKeys()).find((item) => item.provider === status.provider)!,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
