"use client";

import { useId, useState, type DragEvent } from "react";
import { LuCamera, LuCircleAlert, LuTrash2, LuUserRound } from "react-icons/lu";
import { Avatar } from "./avatar";
import { Button } from "./button";

export type UploadedImage = { url: string; name: string; size: number };

type ImageUploadProps = {
  label: string;
  value: UploadedImage | null;
  onChange: (value: UploadedImage | null) => void;
  /** Name shown in the "how it appears" preview. */
  previewName: string;
  /** Largest file accepted, in megabytes. */
  maxSizeMB?: number;
};

const accepted = ["image/jpeg", "image/png"];

const formatSize = (bytes: number) => (bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`);

/**
 * Portrait upload. The frame has the same proportions as the portraits shown on doctor cards, so what you pick is what you
 * get. Drag a file onto it or click to browse; once a photo is chosen it can be replaced or removed, and a small preview
 * shows how it will look in lists.
 */
export function ImageUpload({ label, value, onChange, previewName, maxSizeMB = 5 }: ImageUploadProps) {
  const inputId = useId();
  const messageId = useId();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (!accepted.includes(file.type)) {
      setError("Use a JPG or PNG photo.");
      return;
    }
    if (file.size > maxSizeMB * 1_000_000) {
      setError(`That photo is ${formatSize(file.size)}. Choose one under ${maxSizeMB} MB.`);
      return;
    }
    setError(null);
    if (value) URL.revokeObjectURL(value.url);
    onChange({ url: URL.createObjectURL(file), name: file.name, size: file.size });
  };

  const remove = () => {
    if (value) URL.revokeObjectURL(value.url);
    setError(null);
    onChange(null);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  };

  return (
    <div className="upload" data-filled={value ? "" : undefined} data-dragging={dragging ? "" : undefined}>
      <span className="text-label">{label}</span>

      <label
        htmlFor={inputId}
        className="upload-drop"
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          id={inputId}
          className="sr-only"
          type="file"
          accept={accepted.join(",")}
          aria-describedby={error ? messageId : undefined}
          onChange={(event) => {
            accept(event.target.files?.[0]);
            // Allow choosing the same file again after removing it.
            event.target.value = "";
          }}
        />
        <span className="upload-frame">
          {value ? (
            // Local preview of the chosen file: a plain <img> is all that is needed.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt={`Preview of ${previewName || "the new doctor"}`} />
          ) : (
            <LuUserRound aria-hidden />
          )}
          <span className="upload-badge" aria-hidden>
            <LuCamera />
          </span>
        </span>

        {value ? (
          <span className="text-small text-muted">
            {value.name} · {formatSize(value.size)}
          </span>
        ) : (
          <span className="text-small">
            <strong>Drag a photo here</strong>
            <br />
            <span className="text-muted">or click to browse. JPG or PNG, up to {maxSizeMB} MB.</span>
          </span>
        )}
      </label>

      {value && (
        <div className="upload-actions">
          <Button variant="secondary" size="sm" iconLeft={<LuCamera />} onClick={() => document.getElementById(inputId)?.click()}>
            Replace
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<LuTrash2 />} onClick={remove}>
            Remove
          </Button>
        </div>
      )}

      {error && (
        <p id={messageId} className="field-error" role="alert">
          <LuCircleAlert aria-hidden />
          {error}
        </p>
      )}

      {value && (
        <div className="upload-preview">
          <Avatar name={previewName || "New Doctor"} src={value.url} size={36} />
          <Avatar name={previewName || "New Doctor"} src={value.url} size={36} shape="rounded" radius={14} />
          <span className="text-caption text-muted">How it looks in lists</span>
        </div>
      )}
    </div>
  );
}
