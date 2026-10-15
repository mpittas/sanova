import { LuFileText, LuMessageSquare, LuUsers, LuVideo } from "react-icons/lu";
import { ActionGrid, ActionTile } from "@/components/ui/action-tile";
import { Card } from "@/components/ui/card";

export function QuickActions({ waiting, requests, onInstant, onRequests }: { waiting: number; requests: number; onInstant: () => void; onRequests: () => void }) {
  return (
    <Card rounded title="Quick Actions" description="Jump to a queue or a patient file">
      <ActionGrid>
        <ActionTile label="Instant Consult" icon={<LuVideo />} tone="success" badge={waiting} onClick={onInstant} />
        <ActionTile label="Patient Requests" icon={<LuUsers />} tone="violet" badge={requests} onClick={onRequests} />
        <ActionTile label="Messages" icon={<LuMessageSquare />} tone="blue" href="/messages" />
        <ActionTile label="Medical Records" icon={<LuFileText />} tone="amber" href="/medical-records" />
      </ActionGrid>
    </Card>
  );
}
