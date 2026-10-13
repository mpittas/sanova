"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LuFileText, LuLock, LuPaperclip, LuSend, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { formatBytes, type Attachment } from "./data";
import styles from "./messages.module.css";

const MAX_HEIGHT = 140;

export function Composer({
  recipient,
  onSend,
}: {
  recipient: string;
  onSend: (text: string, attachment?: Attachment) => void;
}) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const canSend = text.trim().length > 0 || attachment !== null;

  const resize = () => {
    const element = textarea.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`;
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;
    onSend(text.trim(), attachment ?? undefined);
    setText("");
    setAttachment(null);
    if (textarea.current) textarea.current.style.height = "auto";
    textarea.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter inserts a line break (and never submit mid-IME composition).
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      {attachment && (
        <div className={styles.pending}>
          <LuFileText aria-hidden />
          <span className="text-small">
            {attachment.name} <span className="text-muted">· {attachment.size}</span>
          </span>
          <button type="button" aria-label="Remove attachment" onClick={() => setAttachment(null)}>
            <LuX aria-hidden />
          </button>
        </div>
      )}

      <div className={styles.composerRow}>
        <input
          ref={fileInput}
          type="file"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setAttachment({ name: file.name, size: formatBytes(file.size) });
            event.target.value = "";
          }}
        />
        <Button variant="secondary" shape="rounded" iconOnly aria-label="Attach a file" onClick={() => fileInput.current?.click()}>
          <LuPaperclip />
        </Button>

        <textarea
          ref={textarea}
          rows={1}
          value={text}
          placeholder="Type a message..."
          aria-label={`Message ${recipient}`}
          onChange={(event) => {
            setText(event.target.value);
            resize();
          }}
          onKeyDown={onKeyDown}
        />

        <Button shape="rounded" iconOnly aria-label="Send message" disabled={!canSend} type="submit">
          <LuSend />
        </Button>
      </div>

      <p className={styles.privacy}>
        <LuLock aria-hidden />
        Messages are encrypted. Enter to send, Shift + Enter for a new line.
      </p>
    </form>
  );
}
