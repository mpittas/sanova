"use client";

import { useMemo, useState } from "react";
import { TODAY } from "@/components/appointments/data";
import { doctor } from "@/components/dashboard/data";
import type { Attachment, ChatMessage } from "./data";
import { byLatest, lastMessage, seedConversations } from "./data";
import { ChatPanel } from "./chat-panel";
import { ConversationList, type Tab } from "./conversation-list";
import styles from "./messages.module.css";

const pad = (value: number) => String(value).padStart(2, "0");

export function MessagesView() {
  const [conversations, setConversations] = useState(seedConversations);
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [tab, setTab] = useState<Tab>("All Messages");
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  // On narrow screens only one pane is visible at a time.
  const [pane, setPane] = useState<"list" | "chat">("list");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return conversations
      .filter((conversation) => {
        if (tab === "Patients" && conversation.kind !== "patient") return false;
        if (tab === "Care Team" && conversation.kind !== "care-team") return false;
        if (unreadOnly && conversation.unread === 0) return false;
        if (!needle) return true;
        const last = lastMessage(conversation);
        return conversation.name.toLowerCase().includes(needle) || last.text.toLowerCase().includes(needle);
      })
      .sort(byLatest);
  }, [conversations, tab, query, unreadOnly]);

  const active = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];

  const select = (id: string) => {
    setActiveId(id);
    setPane("chat");
    setConversations((current) => current.map((item) => (item.id === id ? { ...item, unread: 0 } : item)));
  };

  const send = (text: string, attachment?: Attachment) => {
    const now = new Date();
    const message: ChatMessage = {
      id: `${active.id}-${Date.now()}`,
      from: "me",
      text,
      attachment,
      date: TODAY,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      status: "sent",
    };
    const targetId = active.id;

    setConversations((current) =>
      current.map((item) => (item.id === targetId ? { ...item, unread: 0, messages: [...item.messages, message] } : item)),
    );

    // Simulated delivery: the single tick turns into a double "read" tick shortly after.
    setTimeout(() => {
      setConversations((current) =>
        current.map((item) =>
          item.id === targetId
            ? { ...item, messages: item.messages.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)) }
            : item,
        ),
      );
    }, 1200);
  };

  return (
    <div className={styles.layout} data-pane={pane}>
      <ConversationList
        conversations={visible}
        activeId={active.id}
        tab={tab}
        query={query}
        unreadOnly={unreadOnly}
        onTabChange={setTab}
        onQueryChange={setQuery}
        onUnreadOnlyChange={setUnreadOnly}
        onSelect={select}
      />
      <ChatPanel conversation={active} doctorName={doctor.name} onSend={send} onBack={() => setPane("list")} />
    </div>
  );
}
