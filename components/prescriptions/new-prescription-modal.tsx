"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LuPill, LuPlus } from "react-icons/lu";
import { TODAY } from "@/components/appointments/data";
import { Button } from "@/components/ui/button";
import { Field, FieldRow } from "@/components/ui/field";
import { Modal, ModalBody, ModalFooter, ModalForm, ModalHeader } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { TextArea, TextInput } from "@/components/ui/text-input";
import { newTones, prescribers, type Prescription } from "./data";

type Draft = {
  medication: string;
  dosage: string;
  instructions: string;
  indication: string;
  prescriber: string;
  quantity: string;
  refills: string;
  notes: string;
};
type Errors = Partial<Record<"medication" | "dosage" | "instructions" | "refills", string>>;

const emptyDraft: Draft = {
  medication: "",
  dosage: "",
  instructions: "",
  indication: "",
  prescriber: prescribers[0],
  quantity: "",
  refills: "0",
  notes: "",
};

type NewPrescriptionModalProps = {
  open: boolean;
  onClose: () => void;
  /** How many prescriptions exist, to pick the colour of the new one. */
  count: number;
  onAdd: (prescription: Prescription) => void;
};

export function NewPrescriptionModal({ open, onClose, count, onAdd }: NewPrescriptionModalProps) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [attempts, setAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed attempt to save, move focus to the first field with a problem.
  useEffect(() => {
    if (attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [attempts]);

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
    if (!draft.medication.trim()) found.medication = "Enter the name of the medication.";
    if (!draft.dosage.trim()) found.dosage = "Enter the strength, e.g. 500 mg.";
    if (!draft.instructions.trim()) found.instructions = "Say how and when to take it.";
    const refills = Number(draft.refills);
    if (!Number.isInteger(refills) || refills < 0) found.refills = "Use a whole number, 0 or more.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempts((value) => value + 1);
      return;
    }

    onAdd({
      id: `rx-${Date.now()}`,
      medication: draft.medication.trim(),
      description: draft.indication.trim() ? `Prescribed for ${draft.indication.trim().toLowerCase()}.` : "Prescribed by the care team.",
      dosage: draft.dosage.trim(),
      instructions: draft.instructions.trim(),
      indication: draft.indication.trim() || "General",
      prescriber: draft.prescriber,
      date: TODAY,
      status: "Active",
      quantity: draft.quantity.trim() || "As prescribed",
      refills,
      notes: draft.notes.trim() || "No additional notes.",
      icon: LuPill,
      tone: newTones[count % newTones.length],
    });
    close();
  };

  return (
    <Modal open={open} onClose={close} labelledBy="new-rx-title" width={600}>
      <ModalForm ref={formRef} onSubmit={submit}>
        <ModalHeader title="New Prescription" titleId="new-rx-title" description="Write a prescription for this patient." onClose={close} />

        <ModalBody>
          <FieldRow>
            <Field label="Medication" required error={errors.medication}>
              {(control) => (
                <TextInput {...control} size="lg" placeholder="e.g. Cetirizine" value={draft.medication} onChange={(event) => update({ medication: event.target.value })} invalid={Boolean(errors.medication)} />
              )}
            </Field>
            <Field label="Dosage" required error={errors.dosage}>
              {(control) => (
                <TextInput {...control} size="lg" placeholder="e.g. 10 mg" value={draft.dosage} onChange={(event) => update({ dosage: event.target.value })} invalid={Boolean(errors.dosage)} />
              )}
            </Field>
          </FieldRow>
          <Field label="Instructions" required error={errors.instructions}>
            {(control) => (
              <TextInput {...control} size="lg" placeholder="e.g. Take 1 tablet once daily" value={draft.instructions} onChange={(event) => update({ instructions: event.target.value })} invalid={Boolean(errors.instructions)} />
            )}
          </Field>
          <FieldRow>
            <Field label="Condition">
              {(control) => (
                <TextInput {...control} size="lg" placeholder="e.g. Allergies" value={draft.indication} onChange={(event) => update({ indication: event.target.value })} />
              )}
            </Field>
            <Field label="Prescribed by">
              {(control) => <Select {...control} size="lg" placeholder="Choose a doctor" value={draft.prescriber} options={prescribers} onChange={(prescriber) => update({ prescriber })} />}
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="Quantity">
              {(control) => (
                <TextInput {...control} size="lg" placeholder="e.g. 30 tablets" value={draft.quantity} onChange={(event) => update({ quantity: event.target.value })} />
              )}
            </Field>
            <Field label="Refills" error={errors.refills}>
              {(control) => (
                <TextInput {...control} size="lg" type="number" min={0} inputMode="numeric" value={draft.refills} onChange={(event) => update({ refills: event.target.value })} invalid={Boolean(errors.refills)} />
              )}
            </Field>
          </FieldRow>
          <Field label="Notes">
            {(control) => (
              <TextArea {...control} rows={3} placeholder="Anything the patient or pharmacist should know." value={draft.notes} onChange={(event) => update({ notes: event.target.value })} />
            )}
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" iconLeft={<LuPlus />}>
            Save Prescription
          </Button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
}
