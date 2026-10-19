import Link from "next/link";
import { LuArrowUpRight, LuFileText, LuMessageSquare, LuUsers, LuVideo } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import styles from "./telemedicine.module.css";

export function QuickActions({ waiting, requests, onInstant, onRequests }: { waiting: number; requests: number; onInstant: () => void; onRequests: () => void }) {
  return (
    <Card rounded title="Quick actions" description="Your next step, one click away." className={styles.widget}>
      <div className={styles.shortcuts}>
        <button type="button" onClick={onInstant}><span data-tone="primary"><LuVideo /></span><span><strong>Waiting room</strong><small>{waiting ? `${waiting} waiting for a consultation` : "No patients waiting"}</small></span><b>{waiting}</b></button>
        <button type="button" onClick={onRequests}><span data-tone="violet"><LuUsers /></span><span><strong>Session requests</strong><small>Review and book a visit</small></span><b>{requests}</b></button>
        <Link href="/messages"><span data-tone="blue"><LuMessageSquare /></span><strong>Messages</strong><LuArrowUpRight /></Link>
        <Link href="/medical-records"><span data-tone="amber"><LuFileText /></span><strong>Medical records</strong><LuArrowUpRight /></Link>
      </div>
    </Card>
  );
}
