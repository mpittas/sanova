import { LuInbox, LuListFilter } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/ui/counter";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, tabId } from "@/components/ui/tabs";
import { lastMessage, listTimeLabel, type Conversation } from "./data";
import styles from "./messages.module.css";

export const tabs = ["All Messages", "Patients", "Care Team"] as const;
export type Tab = (typeof tabs)[number];

const PANEL_ID = "conversation-list";

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
    <Card padding="none" className={styles.listPanel}>
      <div className={styles.listTop}>
        <SearchInput
          label="Search messages"
          wrapperClassName={styles.search}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search messages..."
        />
        <Button
          variant="secondary"
          iconOnly
          pressed={unreadOnly}
          aria-label="Show unread only"
          title="Show unread only"
          onClick={() => onUnreadOnlyChange(!unreadOnly)}
        >
          <LuListFilter />
        </Button>
      </div>

      <Tabs aria-label="Message type" panelId={PANEL_ID} value={tab} options={tabs} onChange={onTabChange} />

      <div id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(PANEL_ID, tab)} className={styles.listScroll}>
        {conversations.length === 0 ? (
          <EmptyState
            icon={LuInbox}
            size="compact"
            title="No conversations"
            description={unreadOnly ? "You're all caught up." : "Try a different search."}
          />
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
                    <Avatar name={conversation.name} size={48} online={conversation.online} />
                    <span className={styles.itemBody}>
                      <span className={styles.itemTop}>
                        <span className={styles.itemName}>{conversation.name}</span>
                        <span className={`${styles.itemTime} num`}>{listTimeLabel(message)}</span>
                      </span>
                      <span className={styles.itemBottom}>
                        <span className={styles.preview}>{preview(conversation)}</span>
                        {conversation.unread > 0 && (
                          <Counter aria-label={`${conversation.unread} unread`}>{conversation.unread}</Counter>
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
