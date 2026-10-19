import Image from "next/image";
import { ToneTile } from "@/components/ui/tone-tile";
import type { Prescription } from "./data";
import styles from "./prescriptions.module.css";

const images: Record<string, string> = {
  "Albuterol Inhaler": "inhaler",
  Amoxicillin: "capsule",
  Loratadine: "tablet",
  Ibuprofen: "ibuprofen",
  "Fluticasone Nasal Spray": "spray",
};

export function MedicationVisual({ prescription, large = false }: { prescription: Prescription; large?: boolean }) {
  const asset = images[prescription.medication];
  const Icon = prescription.icon;
  return (
    <span className={styles.medicationVisual} data-tone={prescription.tone} data-large={large || undefined} aria-hidden="true">
      {asset ? <Image src={`/images/medications/${asset}.png`} alt="" width={large ? 240 : 112} height={large ? 240 : 112} sizes={large ? "180px" : "76px"} /> : <ToneTile tone={prescription.tone} size={large ? 64 : 40}><Icon /></ToneTile>}
    </span>
  );
}
