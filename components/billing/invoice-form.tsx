"use client";

import { useState, type FormEvent } from "react";
import { TODAY } from "@/components/appointments/data";
import { addDays } from "@/components/appointments/dates";
import { Button } from "@/components/ui/button";
import { Field, FieldRow } from "@/components/ui/field";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "@/components/ui/modal";
import { patients, services, type Invoice } from "./data";
import styles from "./billing.module.css";

export function InvoiceForm({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (invoice: Omit<Invoice, "id">) => void }) {
  return <Modal open={open} onClose={onClose} labelledBy="new-invoice-title" width={540}><InvoiceFields onClose={onClose} onCreate={onCreate} /></Modal>;
}

function InvoiceFields({ onClose, onCreate }: { onClose: () => void; onCreate: (invoice: Omit<Invoice, "id">) => void }) {
  const [patient, setPatient] = useState<string>(patients[0]);
  const [service, setService] = useState<keyof typeof services>("General consultation");
  const [amount, setAmount] = useState("120.00");
  const [due, setDue] = useState(addDays(TODAY, 14));
  const [payer, setPayer] = useState<Invoice["payer"]>("Patient");
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents <= 0 || cents > 10000000) { setError("Enter an amount between $0.01 and $100,000."); return; }
    if (!due || due < TODAY) { setError("Choose a due date on or after the issue date."); return; }
    onCreate({ patient, service, amount: cents, issued: TODAY, due, state: "Unpaid", payer });
    onClose();
  };
  return <ModalPanel><form onSubmit={submit} className={styles.invoiceForm}>
    <ModalHeader title="New invoice" titleId="new-invoice-title" description="Keep patient billing clear from the start." onClose={onClose} />
    <ModalBody><div className={styles.formFields}>
      <Field label="Patient" required>{(control) => <select {...control} className={styles.input} value={patient} onChange={(event) => setPatient(event.target.value)}>{patients.map((name) => <option key={name}>{name}</option>)}</select>}</Field>
      <Field label="Service" required>{(control) => <select {...control} className={styles.input} value={service} onChange={(event) => { const next = event.target.value as keyof typeof services; setService(next); setAmount(services[next].toFixed(2)); }}>{Object.keys(services).map((name) => <option key={name}>{name}</option>)}</select>}</Field>
      <FieldRow><Field label="Amount (USD)" required>{(control) => <input {...control} className={styles.input} type="number" min="0.01" max="100000" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />}</Field><Field label="Due date" required>{(control) => <input {...control} className={styles.input} type="date" min={TODAY} value={due} onChange={(event) => setDue(event.target.value)} />}</Field></FieldRow>
      <Field label="Billed to">{(control) => <select {...control} className={styles.input} value={payer} onChange={(event) => setPayer(event.target.value as Invoice["payer"])}><option>Patient</option><option>Insurance</option></select>}</Field>
      {error && <p className={styles.formError} role="alert">{error}</p>}
    </div></ModalBody>
    <ModalFooter><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Create invoice</Button></ModalFooter>
  </form></ModalPanel>;
}
