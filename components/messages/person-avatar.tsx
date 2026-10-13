import { Avatar } from "@/components/ui/avatar";
import styles from "./messages.module.css";

/** Avatar with an optional green "online" presence dot. */
export function PersonAvatar({ name, size, online = false }: { name: string; size: number; online?: boolean }) {
  return (
    <span className={styles.person}>
      <Avatar name={name} size={size} />
      {online && <span className={styles.presence} role="img" aria-label="Online" />}
    </span>
  );
}
