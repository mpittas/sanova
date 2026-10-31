"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { LuBuilding2, LuCalendar, LuCircleAlert, LuCircleCheck, LuClock, LuStethoscope, LuUserRound, LuVideo } from "react-icons/lu";
import { patientDirectory, visitTypes, type Appointment, type VisitMode } from "@/components/appointments/data";
import { addMinutes, formatDate, formatTime } from "@/components/appointments/dates";
import { doctors } from "@/components/doctors/data";
import { availability } from "@/components/doctors/profile-data";
import { slotLabel } from "@/components/doctors/slot-label";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DetailItem, DetailList } from "@/components/ui/detail-list";
import { Field, FieldRow } from "@/components/ui/field";
import { Listbox, type ListboxOption } from "@/components/ui/listbox";
import { Modal, ModalBody, ModalFooter, ModalForm, ModalHeader, ModalPanel } from "@/components/ui/modal";
import { TextArea } from "@/components/ui/text-input";
import { ToneTile } from "@/components/ui/tone-tile";
import styles from "./booking.module.css";

/** An appointment before the schedule gives it an id. */
export type NewAppointment = Omit<Appointment, "id">;

export type BookingPrefill = {
  doctorId?: string;
  patient?: string;
  /** Together with `time`, a slot that is already chosen (from a doctor's profile). */
  date?: string;
  time?: string;
};

const TITLE_ID = "book-appointment-title";
const bookable = doctors.filter((doctor) => doctor.status === "Active");

const patientOptions: ListboxOption<string>[] = patientDirectory.map(([name, mrn]) => ({
  value: name,
  label: name,
  description: `MRN ${mrn}`,
  leading: <Avatar name={name} size={32} />,
}));

const doctorOptions: ListboxOption<string>[] = bookable.map((doctor) => ({
  value: doctor.id,
  label: doctor.name,
  description: `${doctor.title} · ${doctor.location.site}`,
  leading: <Avatar name={doctor.name} src={doctor.photo} size={32} />,
  trailing: slotLabel(doctor.next),
}));

const visitOptions: ListboxOption<string>[] = visitTypes.map((type) => ({
  value: type.title,
  label: type.title,
  description: `${type.duration} min · ${type.summary}`,
  leading: (
    <ToneTile tone="primary" size={32}>
      <LuStethoscope />
    </ToneTile>
  ),
}));

const modes: { value: VisitMode; label: string; icon: typeof LuVideo }[] = [
  { value: "In Person", label: "In person", icon: LuBuilding2 },
  { value: "Telehealth", label: "Telehealth", icon: LuVideo },
];

type Errors = Partial<Record<"patient" | "title" | "time", string>>;

function BookingForm({ prefill, onClose, onBook }: { prefill: BookingPrefill | null; onClose: () => void; onBook: (appointment: NewAppointment) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [booked, setBooked] = useState<{ appointment: NewAppointment; doctor: string } | null>(null);

  const [patient, setPatient] = useState(prefill?.patient ?? "");
  const [doctorId, setDoctorId] = useState(() => (bookable.some((doctor) => doctor.id === prefill?.doctorId) ? prefill!.doctorId! : bookable[0].id));
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<VisitMode>("In Person");
  const [notes, setNotes] = useState("");

  const doctor = bookable.find((entry) => entry.id === doctorId) ?? bookable[0];
  const days = useMemo(() => availability(doctor), [doctor]);
  const [day, setDay] = useState(() => (prefill?.date && days.some((entry) => entry.date === prefill.date) ? prefill.date : (days.find((entry) => entry.times.length > 0)?.date ?? days[0].date)));
  const [time, setTime] = useState(() => (prefill?.time && days.find((entry) => entry.date === prefill.date)?.times.includes(prefill.time) ? prefill.time : ""));

  const selectedDay = days.find((entry) => entry.date === day) ?? days[0];
  const type = visitTypes.find((entry) => entry.title === title);
  const periods = [
    ["Morning", selectedDay.times.filter((slot) => slot < "12:00")],
    ["Afternoon", selectedDay.times.filter((slot) => slot >= "12:00")],
  ] as const;

  // After a failed attempt, move focus to the first field with a problem.
  useEffect(() => {
    if (attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true], [data-invalid]")?.focus();
  }, [attempts]);

  const clear = (key: keyof Errors) => setErrors((current) => ({ ...current, [key]: undefined }));

  const chooseDoctor = (id: string) => {
    const next = bookable.find((entry) => entry.id === id);
    if (!next || next.id === doctorId) return;
    const nextDays = availability(next);
    setDoctorId(next.id);
    setDay(nextDays.find((entry) => entry.times.length > 0)?.date ?? nextDays[0].date);
    setTime("");
    clear("time");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {};
    if (!patient) found.patient = "Choose the patient.";
    if (!type) found.title = "Choose the type of visit.";
    if (!time) found.time = "Choose a time for the visit.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempts((value) => value + 1);
      return;
    }

    const [, mrn] = patientDirectory.find(([name]) => name === patient)!;
    const appointment: NewAppointment = {
      date: selectedDay.date,
      start: time,
      duration: type!.duration,
      patient,
      mrn,
      title: type!.title,
      summary: `With ${doctor.name}`,
      mode,
      status: "confirmed",
      notes: notes.trim() || `Booked with ${doctor.name}. ${type!.notes}`,
    };
    onBook(appointment);
    setBooked({ appointment, doctor: doctor.name });
  };

  if (booked) {
    const { appointment } = booked;
    return (
      <ModalPanel>
        <ModalHeader
          title="Appointment booked"
          titleId={TITLE_ID}
          description={`${appointment.patient} is confirmed with ${booked.doctor}.`}
          leading={
            <ToneTile tone="success" size={48}>
              <LuCircleCheck />
            </ToneTile>
          }
          onClose={onClose}
        />
        <ModalBody>
          <DetailList>
            <DetailItem icon={LuCalendar} title={formatDate(appointment.date, { weekday: "long", month: "long", day: "numeric" })}>
              {formatTime(appointment.start)} – {formatTime(addMinutes(appointment.start, appointment.duration))} ({appointment.duration} minutes)
            </DetailItem>
            <DetailItem icon={LuStethoscope} title={appointment.title}>
              {appointment.mode}
            </DetailItem>
            <DetailItem icon={LuUserRound} title={booked.doctor}>
              {doctor.title}, {doctor.location.site}, {doctor.location.floor}
            </DetailItem>
          </DetailList>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button href="/appointments" onClick={onClose}>
            View schedule
          </Button>
        </ModalFooter>
      </ModalPanel>
    );
  }

  const end = time && type ? formatTime(addMinutes(time, type.duration)) : null;

  return (
    <ModalForm ref={formRef} onSubmit={submit}>
      <ModalHeader title="Book appointment" titleId={TITLE_ID} description="Choose who is being seen, by whom, and when." onClose={onClose} />

      <ModalBody>
        <FieldRow>
          <Field label="Patient" required error={errors.patient}>
            {(control) => (
              <Listbox
                {...control}
                searchable
                searchLabel="Search patients"
                placeholder="Choose a patient"
                icon={<LuUserRound />}
                value={patient}
                options={patientOptions}
                onChange={(value) => {
                  setPatient(value);
                  clear("patient");
                }}
                invalid={Boolean(errors.patient)}
              />
            )}
          </Field>
          <Field label="Doctor" required>
            {(control) => <Listbox {...control} searchable searchLabel="Search doctors" panelWidth={400} placeholder="Choose a doctor" icon={<LuStethoscope />} value={doctorId} options={doctorOptions} onChange={chooseDoctor} />}
          </Field>
        </FieldRow>

        <FieldRow>
          <Field label="Visit type" required error={errors.title}>
            {(control) => (
              <Listbox
                {...control}
                placeholder="Choose a visit type"
                icon={<LuStethoscope />}
                value={title}
                options={visitOptions}
                onChange={(value) => {
                  setTitle(value);
                  clear("title");
                }}
                invalid={Boolean(errors.title)}
              />
            )}
          </Field>
          <div className="field">
            <span className="field-label" id="book-mode-label">
              Visit mode
            </span>
            <div className={styles.modes} role="radiogroup" aria-labelledby="book-mode-label">
              {modes.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" role="radio" aria-checked={mode === value} onClick={() => setMode(value)}>
                  <Icon aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </FieldRow>

        <section className={styles.schedule} aria-label="Date and time">
          <header className={styles.scheduleHead}>
            <h3>Date &amp; time</h3>
            <span className="text-small text-muted">{formatDate(selectedDay.date, { month: "long", year: "numeric" })}</span>
          </header>

          <div className={styles.days} role="group" aria-label="Date">
            {days.map((entry) => (
              <button
                key={entry.date}
                type="button"
                className={styles.day}
                aria-pressed={entry.date === selectedDay.date}
                aria-label={formatDate(entry.date, { weekday: "long", month: "long", day: "numeric" })}
                disabled={entry.times.length === 0}
                onClick={() => {
                  setDay(entry.date);
                  setTime("");
                  clear("time");
                }}
              >
                <span>{formatDate(entry.date, { weekday: "short" })}</span>
                <strong>{formatDate(entry.date, { day: "numeric" })}</strong>
              </button>
            ))}
          </div>

          {selectedDay.times.length > 0 ? (
            <div className={styles.periods} role="group" aria-label="Time" data-invalid={errors.time ? "" : undefined} tabIndex={-1}>
              {periods.map(
                ([label, slots]) =>
                  slots.length > 0 && (
                    <div key={label} className={styles.period}>
                      <p className="text-small text-muted">{label}</p>
                      <div className={styles.slots}>
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            aria-pressed={slot === time}
                            onClick={() => {
                              setTime(slot);
                              clear("time");
                            }}
                          >
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          ) : (
            <p className="text-small text-muted">No openings on this day. Choose another date.</p>
          )}

          {errors.time && (
            <p className="field-error">
              <LuCircleAlert aria-hidden />
              {errors.time}
            </p>
          )}
        </section>

        <Field label="Notes" hint="Optional. Shared with the doctor before the visit.">
          {(control) => <TextArea {...control} rows={2} placeholder="Reason for the visit or anything to prepare." value={notes} onChange={(event) => setNotes(event.target.value)} />}
        </Field>
      </ModalBody>

      <ModalFooter className={styles.footer}>
        <div className={styles.summary} aria-live="polite">
          <Avatar name={doctor.name} src={doctor.photo} size={36} />
          <p className="text-small">
            {time ? (
              <>
                <strong>
                  {formatDate(selectedDay.date, { weekday: "short", month: "short", day: "numeric" })} · {formatTime(time)}
                  {end ? ` – ${end}` : ""}
                </strong>
                <span className="text-muted">{doctor.name}</span>
              </>
            ) : (
              <>
                <strong>{doctor.name}</strong>
                <span className="text-muted">
                  <LuClock aria-hidden /> Choose a time to continue
                </span>
              </>
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Book appointment</Button>
      </ModalFooter>
    </ModalForm>
  );
}

export function BookAppointmentModal({ open, prefill, onClose, onBook }: { open: boolean; prefill: BookingPrefill | null; onClose: () => void; onBook: (appointment: NewAppointment) => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE_ID} width={700}>
      <BookingForm prefill={prefill} onClose={onClose} onBook={onBook} />
    </Modal>
  );
}
