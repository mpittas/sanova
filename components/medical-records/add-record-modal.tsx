"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LuPlus } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { Button } from "@/components/ui/button";
import { Field, FieldRow } from "@/components/ui/field";
import { Modal, ModalBody, ModalFooter, ModalForm, ModalHeader } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { TextArea, TextInput } from "@/components/ui/text-input";
import { recordMeta, recordTypes, type MedicalRecord, type RecordType } from "./data";

type Draft = { type: RecordType | ""; title: string; source: string; date: string; summary: string };
type Errors = Partial<Record<"type" | "title" | "date", string>>;

const emptyDraft: Draft = { type: "", title: "", source: "", date: TODAY, summary: "" };

export function AddRecordModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (record: MedicalRecord) => void }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [attempts, setAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed attempt to add, move focus to the first field with a problem.
  useEffect(() => {
    if (attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [attempts]);

  const TypeIcon = draft.type ? recordMeta[draft.type].icon : null;

  const update = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key as keyof Errors];
      return next;
    });
  };

  const close = () => {
    setDraft(emptyDraft);
    setErrors({});
    setAttempts(0);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {};
    if (!draft.type) found.type = "Choose what kind of record this is.";
    if (!draft.title.trim()) found.title = "Give the record a title.";
    if (!draft.date) found.date = "Pick the date of the record.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempts((count) => count + 1);
      return;
    }

    onAdd({
      id: `mr-${Date.now()}`,
      type: draft.type as RecordType,
      title: draft.title.trim(),
      source: draft.source.trim() || "Sanova Clinic",
      summary: draft.summary.trim() || "No additional notes.",
      date: draft.date,
      details: [{ label: "Added by", value: "Dr. James Carter" }],
    });
    close();
  };

  return (
    <Modal open={open} onClose={close} labelledBy="add-record-title" width={560}>
      <ModalForm ref={formRef} onSubmit={submit}>
        <ModalHeader title="Add Record" titleId="add-record-title" description={<>Add a new entry to this patient&apos;s medical record.</>} onClose={close} />

        <ModalBody>
          <Field label="Record type" required error={errors.type}>
            {(control) => (
              <Select
                {...control}
                size="lg"
                placeholder="Select a type"
                value={draft.type}
                options={recordTypes}
                onChange={(type) => update({ type })}
                icon={TypeIcon && <TypeIcon />}
                invalid={Boolean(errors.type)}
              />
            )}
          </Field>
          <Field label="Title" required error={errors.title}>
            {(control) => (
              <TextInput
                {...control}
                size="lg"
                placeholder="e.g. Follow-up consultation"
                value={draft.title}
                onChange={(event) => update({ title: event.target.value })}
                invalid={Boolean(errors.title)}
              />
            )}
          </Field>
          <FieldRow>
            <Field label="Provider or department">
              {(control) => (
                <TextInput
                  {...control}
                  size="lg"
                  placeholder="e.g. Dr. James Carter"
                  value={draft.source}
                  onChange={(event) => update({ source: event.target.value })}
                />
              )}
            </Field>
            <Field label="Date" required error={errors.date}>
              {(control) => (
                <TextInput
                  {...control}
                  size="lg"
                  type="date"
                  value={draft.date}
                  onChange={(event) => update({ date: event.target.value })}
                  invalid={Boolean(errors.date)}
                />
              )}
            </Field>
          </FieldRow>
          <Field label="Notes">
            {(control) => (
              <TextArea
                {...control}
                rows={4}
                placeholder="What happened, and anything the care team should know."
                value={draft.summary}
                onChange={(event) => update({ summary: event.target.value })}
              />
            )}
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" iconLeft={<LuPlus />}>
            Add Record
          </Button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
}
