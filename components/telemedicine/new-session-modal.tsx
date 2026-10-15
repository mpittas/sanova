"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LuCalendar, LuClock, LuStethoscope, LuUserRound, LuVideo } from "react-icons/lu";
import { NOW, TODAY } from "@/components/appointments/data";
import { addMinutes, dayOfWeek, formatTime } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Field, FieldRow } from "@/components/ui/field";
import { Modal, ModalBody, ModalFooter, ModalForm, ModalHeader } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { TextArea, TextInput } from "@/components/ui/text-input";
import { bookableTitles, durationOf, firstFreeSlot, mrnFor, patientNames, type CallType, type Session } from "./data";

/** Every quarter hour the clinic books, outside the lunch hour. */
const slots = Array.from({ length: 36 }, (_, index) => addMinutes("08:30", index * 15)).filter((time) => time < "12:00" || (time >= "13:00" && time <= "16:45"));
const slotLabels = slots.map(formatTime);
const callTypes: readonly CallType[] = ["Video Call", "Audio Call"];

type Draft = { patient: string; title: string; callType: CallType; date: string; time: string; notes: string };
type Errors = Partial<Record<"patient" | "title" | "date" | "time", string>>;

const emptyDraft: Draft = { patient: "", title: "", callType: "Video Call", date: TODAY, time: "", notes: "" };

export function NewSessionModal({
  open,
  onClose,
  onBook,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onBook: (session: Session) => void;
  /** Everything already in the diary, so a new session can't be double-booked. */
  busy: readonly { date: string; start: string; duration: number }[];
}) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [attempts, setAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed attempt to book, move focus to the first field with a problem.
  useEffect(() => {
    if (attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [attempts]);

  const update = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key as keyof Errors];
      // The slot and the day are checked together, so changing one clears the other's message.
      if ("date" in patch) delete next.time;
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
    const duration = draft.title ? durationOf(draft.title) : 20;
    const start = slots[slotLabels.indexOf(draft.time)];

    if (!draft.patient) found.patient = "Choose the patient.";
    if (!draft.title) found.title = "Choose the type of visit.";
    if (!draft.date) found.date = "Pick a date.";
    else if (draft.date < TODAY) found.date = "That date has passed. Pick today or later.";
    else if (dayOfWeek(draft.date) === 0 || dayOfWeek(draft.date) === 6) found.date = "The clinic is closed at weekends. Pick a weekday.";
    if (!start) found.time = "Choose a start time.";
    else if (!found.date) {
      if (draft.date === TODAY && start <= NOW) found.time = `That time has passed. It is ${formatTime(NOW)} now.`;
      else {
        const next = firstFreeSlot(draft.date, start, duration, busy);
        if (next === undefined) found.time = "That time is booked and nothing is free later that day. Try another day.";
        else if (next !== start) found.time = `That time is already booked. The next free slot is ${formatTime(next)}.`;
      }
    }

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempts((value) => value + 1);
      return;
    }

    onBook({
      id: `n${Date.now()}`,
      tab: "Upcoming",
      status: "scheduled",
      patient: draft.patient,
      mrn: mrnFor(draft.patient),
      title: draft.title,
      summary: draft.notes.trim() ? draft.notes.trim().split("\n")[0].slice(0, 80) : "Booked from Telemedicine",
      callType: draft.callType,
      date: draft.date,
      start,
      duration,
      notes: draft.notes.trim() || "No additional notes.",
    });
    close();
  };

  return (
    <Modal open={open} onClose={close} labelledBy="new-session-title" width={600}>
      <ModalForm ref={formRef} onSubmit={submit}>
        <ModalHeader title="New Teleconsultation" titleId="new-session-title" description="Schedule a virtual consultation with a patient." onClose={close} />

        <ModalBody>
          <Field label="Patient" required error={errors.patient}>
            {(control) => (
              <Select {...control} size="lg" placeholder="Choose a patient" icon={<LuUserRound />} value={draft.patient} options={patientNames} onChange={(patient) => update({ patient })} invalid={Boolean(errors.patient)} />
            )}
          </Field>
          <FieldRow>
            <Field label="Visit type" required error={errors.title}>
              {(control) => (
                <Select {...control} size="lg" placeholder="Choose a visit type" icon={<LuStethoscope />} value={draft.title} options={bookableTitles} onChange={(title) => update({ title })} invalid={Boolean(errors.title)} />
              )}
            </Field>
            <Field label="Call type">
              {(control) => <Select {...control} size="lg" placeholder="Call type" icon={<LuVideo />} value={draft.callType} options={callTypes} onChange={(callType) => update({ callType })} />}
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Date" required error={errors.date}>
              {(control) => (
                <TextInput {...control} size="lg" type="date" icon={<LuCalendar />} min={TODAY} value={draft.date} onChange={(event) => update({ date: event.target.value })} invalid={Boolean(errors.date)} />
              )}
            </Field>
            <Field label="Start time" required error={errors.time} hint={draft.title ? `${durationOf(draft.title)}-minute visit` : undefined}>
              {(control) => (
                <Select {...control} size="lg" placeholder="Choose a time" icon={<LuClock />} value={draft.time} options={slotLabels} onChange={(time) => update({ time })} invalid={Boolean(errors.time)} />
              )}
            </Field>
          </FieldRow>
          <Field label="Notes">
            {(control) => <TextArea {...control} rows={3} placeholder="Reason for the visit or anything to prepare." value={draft.notes} onChange={(event) => update({ notes: event.target.value })} />}
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" iconLeft={<LuVideo />}>
            Schedule Session
          </Button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
}
