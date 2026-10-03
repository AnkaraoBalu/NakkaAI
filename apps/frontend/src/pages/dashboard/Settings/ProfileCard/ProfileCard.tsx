import type { User } from "@nakka/types/users";
import { styles } from "./ProfileCard.style";

export default function ProfileCard({ user }: { user: User }) {
  return (
    <section className={styles.card} aria-labelledby="profile-title">
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {user.firstName.charAt(0).toUpperCase()}
        </span>
        <div>
          <h2 id="profile-title" className={styles.name}>
            {user.firstName} {user.lastName}
          </h2>
          <p className={styles.description}>
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className={styles.rows}>
        <div>
          <p className={styles.label}>Email</p>
          <p className={styles.value}>
            {user.email}
            {user.isVerified && (
              <span className={styles.verified}>
                <span className="material-symbols-outlined text-[12px]">
                  verified
                </span>
                Verified
              </span>
            )}
          </p>
        </div>
        <div>
          <p className={styles.label}>Username</p>
          <p className={styles.value}>@{user.username}</p>
        </div>
      </div>
    </section>
  );
}
