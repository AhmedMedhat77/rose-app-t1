interface StepperProps {
  step: number;
  totalSteps: number;
  fullWidth?: boolean;
}

export default function Stepper({
  step,
  totalSteps,
  fullWidth = false,
}: StepperProps) {
  const items = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`flex items-center ${fullWidth ? "w-full" : ""}`}>
      {items.map((s, i) => {
        const isDone = s < step;
        const isActive = s === step;
        const filled = isDone || isActive;

        return (
          <div
            key={s}
            className={`flex items-center ${
              fullWidth && i < items.length - 1 ? "flex-1" : ""
            }`}
          >
            <span
              className={`flex size-6.25 shrink-0 items-center justify-center rounded-full ${
                filled
                  ? "bg-bg-primary text-white"
                  : "bg-bg-primary-fade text-text-primary"
              } ${isActive ? "ring-ring-default ring-3" : ""} `}
            >
              {s}
            </span>

            {i < items.length - 1 && (
              <span
                className={`mx-1 h-px ${fullWidth ? "flex-1" : "w-14"} ${
                  isDone ? "bg-bg-primary" : "bg-bg-primary-fade"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
