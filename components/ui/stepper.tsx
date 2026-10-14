import { LuCheck } from "react-icons/lu";

export type Step = { label: string; description: string };

type StepperProps = {
  steps: readonly Step[];
  /** Index of the current step. */
  current: number;
  /** Called when a finished step is clicked, to go back to it. Later steps are not reachable by clicking. */
  onSelect?: (index: number) => void;
  "aria-label": string;
};

/** Vertical list of steps: finished steps show a check, the current one is highlighted. */
export function Stepper({ steps, current, onSelect, ...rest }: StepperProps) {
  return (
    <ol className="stepper-list" {...rest}>
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "todo";
        const content = (
          <>
            <span className="stepper-marker" aria-hidden>
              {state === "done" ? <LuCheck /> : index + 1}
            </span>
            <span className="stepper-text">
              <span className="text-label stepper-label">{step.label}</span>
              <span className="text-small text-muted">{step.description}</span>
            </span>
          </>
        );

        return (
          <li key={step.label} className="stepper-item" data-state={state}>
            {state === "done" && onSelect ? (
              <button type="button" className="stepper-step" data-state={state} onClick={() => onSelect(index)}>
                {content}
                <span className="sr-only">(completed, go back)</span>
              </button>
            ) : (
              <div className="stepper-step" data-state={state} aria-current={state === "current" ? "step" : undefined}>
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
