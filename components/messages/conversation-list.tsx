import { LuInbox, LuListFilter, LuSearch } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { lastMessage, listTimeLabel, type Conversation } from "./data";
import { PersonAvatar } from "./person-avatar";
import styles from "./messages.module.css";

export const tabs = ["All Messages", "Patients", "Care Team"] as const;
export type Tab = (typeof tabs)[number];

function preview(conversation: Conversation) {
  const message = lastMessage(conversation);
  const body = message.attachment ? `Attachment: ${message.attachment.name}` : message.text;
  return message.from === "me" ? `You: ${body}` : body;
}

export function ConversationList({
  conversations,
  activeId,
  tab,
  query,
  unreadOnly,
  onTabChange,
  onQueryChange,
  onUnreadOnlyChange,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string;
  tab: Tab;
  query: string;
  unreadOnly: boolean;
  onTabChange: (tab: Tab) => void;
  onQueryChange: (query: string) => void;
  onUnreadOnlyChange: (value: boolean) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className={styles.listPanel}>
      <div className={styles.listTop}>
        <label className={styles.search}>
          <span className="sr-only">Search messages</span>
          <LuSearch aria-hidden />
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search messages..." />
        </label>
        <button
          type="button"
          className={styles.filterButton}
          aria-pressed={unreadOnly}
          aria-label="Show unread only"
          title="Show unread only"
          onClick={() => onUnreadOnlyChange(!unreadOnly)}
        >
          <LuListFilter aria-hidden />
        </button>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Message type">
        {tabs.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`tab-${name}`}
            aria-selected={tab === name}
            aria-controls="conversation-list"
            onClick={() => onTabChange(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div id="conversation-list" role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.listScroll}>
        {conversations.length === 0 ? (
          <div className={styles.listEmpty}>
            <LuInbox aria-hidden />
            <p className="text-label">No conversations</p>
            <p className="text-small text-muted">{unreadOnly ? "You're all caught up." : "Try a different search."}</p>
          </div>
        ) : (
          <ul className={styles.items}>
            {conversations.map((conversation) => {
              const message = lastMessage(conversation);
              const active = conversation.id === activeId;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    className={styles.item}
                    data-active={active || undefined}
                    data-unread={conversation.unread > 0 || undefined}
                    aria-current={active || undefined}
                    onClick={() => onSelect(conversation.id)}
                  >
                    <PersonAvatar name={conversation.name} size={48} online={conversation.online} />
                    <span className={styles.itemBody}>
                      <span className={styles.itemTop}>
                        <span className={styles.itemName}>{conversation.name}</span>
                        <span className={`${styles.itemTime} num`}>{listTimeLabel(message)}</span>
                      </span>
                      <span className={styles.itemBottom}>
                        <span className={styles.preview}>{preview(conversation)}</span>
                        {conversation.unread > 0 && (
                          <span className={styles.unread} aria-label={`${conversation.unread} unread`}>
                            {conversation.unread}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
