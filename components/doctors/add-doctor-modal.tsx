"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuUserPlus, LuUserRound, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stepper } from "@/components/ui/stepper";
import { ToneTile } from "@/components/ui/tone-tile";
import {
  emptyDraft,
  firstInvalidStep,
  steps,
  toDoctor,
  validate,
  type Draft,
  type Errors,
} from "./add-doctor-form";
import { AdditionalStep, BasicStep, ReviewStep, ScheduleStep, SpecialtiesStep } from "./add-doctor-steps";
import type { Doctor } from "./data";
import styles from "./add-doctor.module.css";

const lastStep = steps.length - 1;

export function AddDoctorModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (doctor: Doctor) => void;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [attempts, setAttempts] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Each step starts at the top.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [step]);

  // After a failed attempt to continue, move focus to the first field with a problem.
  useEffect(() => {
    if (attempts === 0) return;
    bodyRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [attempts]);

  const dirty = JSON.stringify({ ...draft, photo: null }) !== JSON.stringify(emptyDraft) || draft.photo !== null;

  const reset = () => {
    setStep(0);
    setDraft(emptyDraft);
    setErrors({});
  };

  /** Cancel, the close button and Escape: ask before throwing away what has been typed. */
  const requestClose = () => {
    if (dirty && !window.confirm("Discard this new doctor? What you've entered will be lost.")) return;
    if (draft.photo) URL.revokeObjectURL(draft.photo.url);
    reset();
    onClose();
  };

  const update = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof Draft)[]) delete next[key];
      return next;
    });
  };

  const showErrors = (found: Errors) => {
    setErrors(found);
    setAttempts((count) => count + 1);
  };

  const next = () => {
    if (step < lastStep) {
      const found = validate(step, draft);
      if (Object.keys(found).length > 0) return showErrors(found);
      return setStep(step + 1);
    }

    // Last step: make sure nothing earlier is missing before adding.
    const broken = firstInvalidStep(draft);
    if (broken !== null) {
      setStep(broken);
      return showErrors(validate(broken, draft));
    }
    onAdd(toDoctor(draft, `d${Date.now()}`));
    reset();
    onClose();
  };

  const props = { draft, errors, update };

  return (
    <Modal open={open} onClose={requestClose} labelledBy="add-doctor-title" width={1140} dismissOnBackdrop={false}>
      <div className={styles.shell}>
        <aside className={styles.side}>
          <div className={styles.intro}>
            <h2 id="add-doctor-title" className="text-h2">
              Add New Doctor
            </h2>
            <p className="text-body text-muted">
              Add a new doctor to your clinic and set up their information, specialties, and availability.
            </p>
          </div>

          <div className={styles.stepper}>
            <Stepper aria-label="Add doctor steps" steps={steps} current={step} onSelect={setStep} />
          </div>

          <div className={styles.progress}>
            <p className="text-label">
              Step {step + 1} of {steps.length}
            </p>
            <ProgressBar size="sm" value={((step + 1) / steps.length) * 100} aria-label={`Step ${step + 1} of ${steps.length}`} />
          </div>

          <div className={styles.art} aria-hidden>
            <span className={styles.artBack} />
            <span className={styles.artCard}>
              <ToneTile tone="primary" size={52}>
                <LuUserRound />
              </ToneTile>
              <span className={styles.artLines}>
                <span />
                <span />
              </span>
            </span>
            <span className={styles.artPlus}>
              <LuUserPlus />
            </span>
          </div>
        </aside>

        <form
          className={styles.panel}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            next();
          }}
        >
          <header className={styles.panelHead}>
            <div>
              <h3 className="text-h2">{steps[step].title}</h3>
              <p className="text-body text-muted">{steps[step].intro}</p>
            </div>
            <Button variant="secondary" iconOnly onClick={requestClose} aria-label="Close">
              <LuX />
            </Button>
          </header>

          <div className={styles.body} ref={bodyRef}>
            {step === 0 && <BasicStep {...props} />}
            {step === 1 && <SpecialtiesStep {...props} />}
            {step === 2 && <ScheduleStep {...props} />}
            {step === 3 && <AdditionalStep {...props} />}
            {step === 4 && <ReviewStep draft={draft} onEdit={setStep} />}
          </div>

          <footer className={styles.footer}>
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <span className="spacer" />
            <Button variant="secondary" onClick={requestClose}>
              Cancel
            </Button>
            {step < lastStep ? (
              <Button type="submit" iconRight={<LuArrowRight />}>
                Next Step
              </Button>
            ) : (
              <Button type="submit" iconLeft={<LuUserPlus />}>
                Add Doctor
              </Button>
            )}
          </footer>
        </form>
      </div>
    </Modal>
  );
}
