"use client";

import { useState, type FormEvent } from "react";
import { LuSend } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal, ModalBody, ModalFooter, ModalForm, ModalHeader } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { pharmacies } from "./data";

type PharmacyModalProps = {
  open: boolean;
  onClose: () => void;
  medication: string;
  onSend: (pharmacy: string) => void;
};

export function PharmacyModal({ open, onClose, medication, onSend }: PharmacyModalProps) {
  const [pharmacy, setPharmacy] = useState<string>(pharmacies[0]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(pharmacy);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="pharmacy-title" width={480}>
      <ModalForm onSubmit={submit}>
        <ModalHeader title="Send to Pharmacy" titleId="pharmacy-title" description={<>Send {medication} to a pharmacy for collection.</>} onClose={onClose} />

        <ModalBody>
          <Field label="Pharmacy">
            {(control) => <Select {...control} size="lg" placeholder="Choose a pharmacy" value={pharmacy} options={pharmacies} onChange={setPharmacy} />}
          </Field>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" iconLeft={<LuSend />}>
            Send
          </Button>
        </ModalFooter>
      </ModalForm>
    </Modal>
  );
}
