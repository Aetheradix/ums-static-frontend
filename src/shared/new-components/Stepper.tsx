import React from 'react';
import './Stepper.css';

export interface Step {
  label: string;
  description?: string;
  icon?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  className = '',
  orientation = 'horizontal',
  onStepClick,
}) => {
  return (
    <div className={`stepper-container ${orientation} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isPending = index > activeStep;

        return (
          <div
            key={index}
            className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
            onClick={() => onStepClick?.(index)}
          >
            <div className="step-connector-wrapper">
              {index !== 0 && <div className="step-line prev"></div>}
              <div className="step-node">
                <div className="step-icon-container">
                  {isCompleted ? (
                    <i className="pi pi-check text-xs font-bold"></i>
                  ) : step.icon ? (
                    <i className={`${step.icon} text-sm`}></i>
                  ) : (
                    <span className="step-number text-xs font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>
                {isActive && <div className="step-pulse"></div>}
              </div>
              {index !== steps.length - 1 && (
                <div className="step-line next"></div>
              )}
            </div>

            <div className="step-content">
              <span className="step-label">{step.label}</span>
              {step.description && (
                <span className="step-description">{step.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
