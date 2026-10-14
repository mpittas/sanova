"use client";

import { useEffect, useMemo, useRef } from "react";
import { LuArrowLeft, LuCheck, LuCheckCheck, LuEllipsisVertical, LuFileText, LuPhone, LuUser } from "react-icons/lu";
import { formatTime } from "@/components/appointments/dates";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Composer } from "./composer";
import { dayLabel, type Attachment, type ChatMessage, type Conversation } from "./data";
import styles from "./messages.module.css";

type Row =
  | { kind: "day"; key: string; label: string }
  | { kind: "group"; key: string; from: ChatMessage["from"]; messages: ChatMessage[] };

const GROUP_WINDOW_MINUTES = 5;
const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

/** Day dividers, plus consecutive messages from the same person (within 5 min) merged into one group. */
function buildRows(messages: ChatMessage[]): Row[] {
  const rows: Row[] = [];
  let previous: ChatMessage | undefined;

  for (const message of messages) {
    if (!previous || previous.date !== message.date) {
      rows.push({ kind: "day", key: `day-${message.date}`, label: dayLabel(message.date) });
    }
    const last = rows[rows.length - 1];
    const joinsGroup =
      last.kind === "group" &&
      previous?.from === message.from &&
      previous.date === message.date &&
      minutes(message.time) - minutes(previous.time) <= GROUP_WINDOW_MINUTES;

    if (joinsGroup && last.kind === "group") last.messages.push(message);
    else rows.push({ kind: "group", key: `group-${message.id}`, from: message.from, messages: [message] });
    previous = message;
  }
  return rows;
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  return (
    <span className={styles.attachment}>
      <LuFileText aria-hidden />
      <span>
        <span className="text-label">{attachment.name}</span>
        <span className="text-caption text-muted">{attachment.size}</span>
      </span>
    </span>
  );
}

export function ChatPanel({
  conversation,
  doctorName,
  onSend,
  onBack,
}: {
  conversation: Conversation;
  doctorName: string;
  onSend: (text: string, attachment?: Attachment) => void;
  onBack: () => void;
}) {
  const { id, name, detail, kind, online, messages } = conversation;
  const scroller = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => buildRows(messages), [messages]);

  // Always show the newest message when switching conversation or when one arrives.
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [id, messages.length]);

  return (
    <Card padding="none" className={styles.chat}>
      <header className={styles.chatHeader}>
        <Button variant="ghost" size="sm" iconOnly className={styles.back} aria-label="Back to conversations" onClick={onBack}>
          <LuArrowLeft />
        </Button>
        <Avatar name={name} size={48} online={online} />
        <div className={styles.chatWho}>
          <h2 className="text-h4">{name}</h2>
          <p className={styles.chatSub}>
            <span className="text-small text-muted">{kind === "patient" ? `MRN: ${detail}` : detail}</span>
            <Chip variant="tag" size="sm" tone={kind === "patient" ? "success" : "violet"}>
              {kind === "patient" ? "Active Patient" : "Care Team"}
            </Chip>
          </p>
        </div>
        {kind === "patient" ? (
          <Button href="/patients" variant="secondary" iconLeft={<LuUser />} className={styles.headerAction}>
            View Patient
          </Button>
        ) : (
          <Button variant="secondary" iconLeft={<LuPhone />} className={styles.headerAction}>
            Call
          </Button>
        )}
        <Button variant="ghost" iconOnly aria-label="More options">
          <LuEllipsisVertical />
        </Button>
      </header>

      <div ref={scroller} className={styles.thread} role="log" aria-label={`Conversation with ${name}`} tabIndex={0}>
        {rows.map((row) =>
          row.kind === "day" ? (
            <div key={row.key} className={styles.day}>
              <span>{row.label}</span>
            </div>
          ) : (
            <div key={row.key} className={styles.group} data-from={row.from}>
              <span className={styles.groupAvatar}>
                <Avatar name={row.from === "me" ? doctorName : name} size={36} />
              </span>
              <div className={styles.stack}>
                {row.messages.map((message, index) => (
                  <div key={message.id} className={styles.bubble} data-last={index === row.messages.length - 1 || undefined}>
                    {message.attachment && <AttachmentCard attachment={message.attachment} />}
                    {message.text && <p>{message.text}</p>}
                  </div>
                ))}
                <p className={styles.meta}>
                  <span className="num">{formatTime(row.messages[row.messages.length - 1].time)}</span>
                  {row.from === "me" &&
                    (row.messages[row.messages.length - 1].status === "read" ? (
                      <LuCheckCheck className={styles.read} role="img" aria-label="Read" />
                    ) : (
                      <LuCheck role="img" aria-label="Sent" />
                    ))}
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      <Composer key={id} recipient={name} onSend={onSend} />
    </Card>
  );
}
