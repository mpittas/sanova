import { hyperGradient, type HyperColor } from "./hyper";
import styles from "./hyper.module.css";

/**
 * Hyper "basic bar" (light theme) at widget size: a row of thin gradient pills, the latest one at full strength.
 * Heights are scaled between the lowest and highest value so small movements stay visible.
 */
export function HyperSparkBars({
  data,
  tone,
  soft,
  name,
  height = 72,
}: HyperColor & { data: readonly number[]; name: string; height?: number }) {
  const low = Math.min(...data);
  const range = Math.max(...data) - low || 1;
  const background = hyperGradient({ tone, soft });

  return (
    <div
      className={styles.spark}
      role="img"
      aria-label={`${name}: ${data.join(", ")}`}
      style={{ height }}
    >
      {data.map((value, index) => (
        <span
          key={index}
          className={index === data.length - 1 ? styles.sparkLast : styles.sparkBar}
          style={{ height: `${28 + ((value - low) / range) * 72}%`, background, animationDelay: `${index * 30}ms` }}
          title={String(value)}
        />
      ))}
    </div>
  );
}
