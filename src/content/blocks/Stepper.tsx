import { useState } from "react";
import { richText } from "../richText";
import type { StepperBlock } from "../schema";

// A step-through explainer: a big stage on the left, copy + dots + Next on the right
// (the fossil-formation walkthrough). Steps are 1-indexed for display.
export function Stepper({ block }: { block: StepperBlock }) {
  const [step, setStep] = useState(1);
  const total = block.steps.length;
  const current = block.steps[step - 1];

  return (
    <div className="fossil-stepper">
      <div className="fossil-stage" aria-hidden="true">
        <span className="fs-emoji">{current?.emoji}</span>
        <span className="fs-num">
          Step {step} of {total}
        </span>
      </div>
      <div className="fossil-copy" role="status" aria-live="polite">
        <h4>{current?.title}</h4>
        <p>{current && richText(current.body)}</p>
        <div className="fossil-dots">
          {block.steps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index + 1 === step ? "is-active" : ""}
              aria-label={`Step ${index + 1}`}
              onClick={() => setStep(index + 1)}
            />
          ))}
        </div>
        <button
          type="button"
          className="drill-next"
          onClick={() => setStep((current) => (current % total) + 1)}
        >
          Next step →
        </button>
      </div>
    </div>
  );
}
