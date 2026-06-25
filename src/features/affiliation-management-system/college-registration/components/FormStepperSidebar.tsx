export interface StepInfo {
  label: string;
  description: string;
  icon: string;
}

export const REGISTRATION_STEPS: StepInfo[] = [
  {
    label: 'College Details',
    description: 'Basic college information',
    icon: 'building',
  },
  {
    label: 'Management Details',
    description: 'Principal and society details',
    icon: 'user',
  },
  {
    label: 'Course Details',
    description: 'Programme and subject details',
    icon: 'book',
  },
  {
    label: 'Enclosures',
    description: 'Upload required documents',
    icon: 'folder-open',
  },
];

interface FormStepperSidebarProps {
  steps?: StepInfo[];
  activeStep: number;
  onStepClick: (index: number) => void;
}

export default function FormStepperSidebar({
  steps = REGISTRATION_STEPS,
  activeStep,
  onStepClick,
}: FormStepperSidebarProps) {
  return (
    <aside className="affiliation-step-panel">
      <div className="affiliation-step-panel-header">
        <span className="affiliation-step-panel-icon">
          <i className="pi pi-check-square" />
        </span>

        <div>
          <h3>Application Progress</h3>
          <p>Complete all the steps to submit your application.</p>
        </div>
      </div>

      <div className="affiliation-step-list">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const canClick = index < activeStep;

          return (
            <button
              key={step.label}
              type="button"
              className={`affiliation-step-item ${isActive ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              onClick={() => canClick && onStepClick(index)}
              disabled={!canClick && !isActive}
            >
              <span className="affiliation-step-number">
                {isCompleted ? <i className="pi pi-check" /> : index + 1}
              </span>

              <span className="affiliation-step-content">
                <strong>{step.label}</strong>
                <small>{step.description}</small>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
