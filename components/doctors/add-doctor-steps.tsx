"use client";

import {
  LuBadgeCheck,
  LuBriefcase,
  LuBuilding2,
  LuCalendarClock,
  LuClock,
  LuFileBadge,
  LuGraduationCap,
  LuLayers,
  LuMail,
  LuPhone,
  LuUser,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceChips } from "@/components/ui/filter-chips";
import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select } from "@/components/ui/select";
import { TextArea, TextInput } from "@/components/ui/text-input";
import {
  BIO_LIMIT,
  dayOptions,
  departmentOptions,
  employmentOptions,
  floorOptions,
  focusAreas,
  genderOptions,
  languageOptions,
  serviceOptions,
  siteOptions,
  slotOptions,
  steps,
  timeOptions,
  titleOptions,
  type Draft,
  type Errors,
} from "./add-doctor-form";
import styles from "./add-doctor.module.css";

type StepProps = {
  draft: Draft;
  errors: Errors;
  update: (patch: Partial<Draft>) => void;
};

const toggle = <T,>(list: readonly T[], item: T) => (list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

// ---------------------------------------------------------------------------------------------

export function BasicStep({ draft, errors, update }: StepProps) {
  return (
    <div className={styles.basic}>
      <div className={styles.grid}>
        <Field className={styles.wide} label="Full name" required error={errors.name}>
          {(control) => (
            <TextInput
              {...control}
              size="lg"
              icon={<LuUser />}
              autoComplete="off"
              placeholder="Enter full name (e.g. Dr. Olivia Bennett)"
              value={draft.name}
              invalid={!!errors.name}
              onChange={(event) => update({ name: event.target.value })}
            />
          )}
        </Field>

        <Field label="Professional title" required error={errors.title}>
          {(control) => (
            <Select
              {...control}
              size="lg"
              icon={<LuBadgeCheck />}
              placeholder="Select title"
              value={draft.title as (typeof titleOptions)[number] | ""}
              options={titleOptions}
              invalid={!!errors.title}
              onChange={(title) => update({ title })}
            />
          )}
        </Field>
        <Field label="Gender">
          {(control) => (
            <Select
              {...control}
              size="lg"
              icon={<LuUserRound />}
              placeholder="Select gender"
              value={draft.gender as (typeof genderOptions)[number] | ""}
              options={genderOptions}
              onChange={(gender) => update({ gender })}
            />
          )}
        </Field>

        <Field label="Email address" required error={errors.email}>
          {(control) => (
            <TextInput
              {...control}
              size="lg"
              type="email"
              icon={<LuMail />}
              autoComplete="off"
              placeholder="doctor@clinic.com"
              value={draft.email}
              invalid={!!errors.email}
              onChange={(event) => update({ email: event.target.value })}
            />
          )}
        </Field>
        <Field label="Phone number" required error={errors.phone}>
          {(control) => (
            <TextInput
              {...control}
              size="lg"
              type="tel"
              icon={<LuPhone />}
              autoComplete="off"
              placeholder="+1 (555) 000-0000"
              value={draft.phone}
              invalid={!!errors.phone}
              onChange={(event) => update({ phone: event.target.value })}
            />
          )}
        </Field>

        <Field label="License number" required error={errors.license}>
          {(control) => (
            <TextInput
              {...control}
              size="lg"
              icon={<LuFileBadge />}
              autoComplete="off"
              placeholder="License number"
              value={draft.license}
              invalid={!!errors.license}
              onChange={(event) => update({ license: event.target.value })}
            />
          )}
        </Field>
        <Field label="Years of experience" required error={errors.experience}>
          {(control) => (
            <TextInput
              {...control}
              size="lg"
              type="number"
              min={0}
              max={60}
              inputMode="numeric"
              icon={<LuBriefcase />}
              placeholder="e.g. 8"
              value={draft.experience}
              invalid={!!errors.experience}
              onChange={(event) => update({ experience: event.target.value })}
            />
          )}
        </Field>

        <Field label="Department" required error={errors.department}>
          {(control) => (
            <Select
              {...control}
              size="lg"
              icon={<LuBuilding2 />}
              placeholder="Select department"
              value={draft.department}
              options={departmentOptions}
              invalid={!!errors.department}
              onChange={(department) => update({ department, focus: [] })}
            />
          )}
        </Field>
        <Field label="Employment type">
          {(control) => (
            <Select
              {...control}
              size="lg"
              icon={<LuUsers />}
              placeholder="Select type"
              value={draft.employment as (typeof employmentOptions)[number] | ""}
              options={employmentOptions}
              onChange={(employment) => update({ employment })}
            />
          )}
        </Field>
      </div>

      <ImageUpload label="Profile photo" previewName={draft.name} value={draft.photo} onChange={(photo) => update({ photo })} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function SpecialtiesStep({ draft, update }: StepProps) {
  const areas = draft.department ? focusAreas[draft.department] : null;

  return (
    <div className={styles.stack}>
      <section className={styles.section} aria-labelledby="focus-heading">
        <div>
          <h3 id="focus-heading" className="text-h4">
            Focus areas{draft.department && <span className="text-muted"> in {draft.department}</span>}
          </h3>
          <p className="text-small text-muted">Patients can search for these. Pick as many as apply.</p>
        </div>
        {areas ? (
          <ChoiceChips
            aria-label="Focus areas"
            value={draft.focus}
            options={areas}
            onToggle={(area) => update({ focus: toggle(draft.focus, area) })}
          />
        ) : (
          <p className={styles.note}>Choose a department in Basic Information to see its focus areas.</p>
        )}
      </section>

      <section className={styles.section} aria-labelledby="services-heading">
        <div>
          <h3 id="services-heading" className="text-h4">
            Services offered
          </h3>
          <p className="text-small text-muted">What patients can book with this doctor.</p>
        </div>
        <div className={styles.options}>
          {serviceOptions.map((service) => (
            <label key={service} className={styles.option}>
              <Checkbox checked={draft.services.includes(service)} onChange={() => update({ services: toggle(draft.services, service) })} />
              <span className="text-label">{service}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function ScheduleStep({ draft, errors, update }: StepProps) {
  return (
    <div className={styles.stack}>
      <section className={styles.section} aria-labelledby="days-heading">
        <div>
          <h3 id="days-heading" className="text-h4">
            Working days
          </h3>
          <p className="text-small text-muted">Patients can only book on these days.</p>
        </div>
        <ChoiceChips
          aria-label="Working days"
          value={draft.days}
          options={dayOptions}
          onToggle={(day) => update({ days: toggle(draft.days, day) })}
        />
        {errors.days && <p className="field-error">{errors.days}</p>}
      </section>

      <div className={styles.grid}>
        <Field label="Start time">
          {(control) => (
            <Select {...control} size="lg" icon={<LuClock />} placeholder="Start" value={draft.start as (typeof timeOptions)[number]} options={timeOptions} onChange={(start) => update({ start })} />
          )}
        </Field>
        <Field label="End time" error={errors.end}>
          {(control) => (
            <Select {...control} size="lg" icon={<LuClock />} placeholder="End" value={draft.end as (typeof timeOptions)[number]} options={timeOptions} invalid={!!errors.end} onChange={(end) => update({ end })} />
          )}
        </Field>
        <Field label="Appointment length">
          {(control) => (
            <Select {...control} size="lg" icon={<LuCalendarClock />} placeholder="Length" value={draft.slot as (typeof slotOptions)[number]} options={slotOptions} onChange={(slot) => update({ slot })} />
          )}
        </Field>
        <span aria-hidden />
        <Field label="Site" required error={errors.site}>
          {(control) => (
            <Select {...control} size="lg" icon={<LuBuilding2 />} placeholder="Select site" value={draft.site as (typeof siteOptions)[number] | ""} options={siteOptions} invalid={!!errors.site} onChange={(site) => update({ site })} />
          )}
        </Field>
        <Field label="Floor" required error={errors.floor}>
          {(control) => (
            <Select {...control} size="lg" icon={<LuLayers />} placeholder="Select floor" value={draft.floor as (typeof floorOptions)[number] | ""} options={floorOptions} invalid={!!errors.floor} onChange={(floor) => update({ floor })} />
          )}
        </Field>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

export function AdditionalStep({ draft, update }: StepProps) {
  return (
    <div className={styles.stack}>
      <Field label="Education and training" hint="For example: MD, Johns Hopkins University; Cardiology fellowship, Mayo Clinic.">
        {(control) => (
          <TextInput
            {...control}
            size="lg"
            icon={<LuGraduationCap />}
            autoComplete="off"
            placeholder="Medical school, residency, fellowships"
            value={draft.education}
            onChange={(event) => update({ education: event.target.value })}
          />
        )}
      </Field>

      <Field label="Short bio" hint={`${draft.bio.length} / ${BIO_LIMIT}`}>
        {(control) => (
          <TextArea
            {...control}
            rows={5}
            maxLength={BIO_LIMIT}
            placeholder="A few sentences patients will see on the doctor's profile."
            value={draft.bio}
            onChange={(event) => update({ bio: event.target.value })}
          />
        )}
      </Field>

      <section className={styles.section} aria-labelledby="languages-heading">
        <div>
          <h3 id="languages-heading" className="text-h4">
            Languages spoken
          </h3>
          <p className="text-small text-muted">Helps patients find a doctor they can talk to.</p>
        </div>
        <ChoiceChips
          aria-label="Languages spoken"
          value={draft.languages}
          options={languageOptions}
          onToggle={(language) => update({ languages: toggle(draft.languages, language) })}
        />
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

function ReviewGroup({
  title,
  step,
  onEdit,
  rows,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  rows: [string, string][];
}) {
  return (
    <section className={styles.review}>
      <header>
        <h3 className="text-h4">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} aria-label={`Edit ${title}`}>
          Edit
        </Button>
      </header>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-small text-muted">{label}</dt>
            <dd className="text-label">{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewStep({ draft, onEdit }: { draft: Draft; onEdit: (step: number) => void }) {
  const list = (items: string[]) => items.join(", ");

  return (
    <div className={styles.stack}>
      <ReviewGroup
        title={steps[0].label}
        step={0}
        onEdit={onEdit}
        rows={[
          ["Name", draft.name],
          ["Title", draft.title],
          ["Department", draft.department],
          ["Email", draft.email],
          ["Phone", draft.phone],
          ["License", draft.license],
          ["Experience", draft.experience ? `${draft.experience} years` : ""],
          ["Employment", draft.employment],
        ]}
      />
      <ReviewGroup
        title={steps[1].label}
        step={1}
        onEdit={onEdit}
        rows={[
          ["Focus areas", list(draft.focus)],
          ["Services", list(draft.services)],
        ]}
      />
      <ReviewGroup
        title={steps[2].label}
        step={2}
        onEdit={onEdit}
        rows={[
          ["Days", list(draft.days)],
          ["Hours", `${draft.start} – ${draft.end}`],
          ["Appointments", draft.slot],
          ["Location", [draft.site, draft.floor].filter(Boolean).join(", ")],
        ]}
      />
      <ReviewGroup
        title={steps[3].label}
        step={3}
        onEdit={onEdit}
        rows={[
          ["Education", draft.education],
          ["Languages", list(draft.languages)],
          ["Bio", draft.bio],
        ]}
      />
    </div>
  );
}

