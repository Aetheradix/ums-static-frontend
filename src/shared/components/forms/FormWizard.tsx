import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonPanel } from 'shared/components/buttons';
import './FormWizard.css';

export interface WizardStep {
  label: string;
  icon?: string;
  content: ReactNode;
}

interface FormWizardProps {
  steps: WizardStep[];
  onComplete: () => Promise<void> | void;
  isSaving?: boolean;
  formKey?: number;
  isEdit?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void;
  triggerValidation?: (fields: string[]) => Promise<boolean>;
  onReset?: () => void;
  customActions?: (activeIndex: number, isLastStep: boolean) => ReactNode;
}

export default function FormWizard({
  steps,
  onComplete,
  isSaving,
  formKey,
  isEdit,
  onKeyDown,
  triggerValidation,
  onReset,
  customActions,
}: FormWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxTabReached, setMaxTabReached] = useState(
    isEdit ? steps.length - 1 : 0
  );
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isEdit) {
      setMaxTabReached(steps.length - 1);
    }
  }, [isEdit, steps.length]);

  const getFieldsInStep = (index: number): string[] => {
    const el = tabRefs.current[index];
    if (!el) return [];

    const elements = el.querySelectorAll('[id], [name]');
    const names = Array.from(elements)
      .map(e => e.getAttribute('name') || e.getAttribute('id'))
      .filter(
        (n): n is string =>
          Boolean(n) && typeof n === 'string' && !n.startsWith('pr_')
      )
      .map(n => n.replace(/_focus$/, '').replace(/_input$/, ''));

    return Array.from(new Set(names));
  };

  const handleNext = async () => {
    let isValid = true;

    if (triggerValidation) {
      const fields = getFieldsInStep(activeIndex);
      if (fields.length > 0) {
        isValid = await triggerValidation(fields);
      }
    }

    if (isValid) {
      const nextIndex = activeIndex + 1;
      setMaxTabReached(prev => Math.max(prev, nextIndex));
      setActiveIndex(nextIndex);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex <= activeIndex) {
      setActiveIndex(stepIndex);
      return;
    }

    let allValid = true;
    for (let i = activeIndex; i < stepIndex; i++) {
      if (triggerValidation) {
        const fields = getFieldsInStep(i);
        if (fields.length > 0) {
          const isValid = await triggerValidation(fields);
          if (!isValid) {
            allValid = false;
            setActiveIndex(i);
            break;
          }
        }
      }
    }

    if (allValid) {
      setMaxTabReached(prev => Math.max(prev, stepIndex));
      setActiveIndex(stepIndex);
    }
  };

  const handleReset = () => {
    if (onReset) onReset();
    setActiveIndex(0);
    setMaxTabReached(isEdit ? steps.length - 1 : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    if (onKeyDown) onKeyDown(e);
  };

  const progressPct =
    steps.length > 1
      ? (Math.max(maxTabReached, activeIndex) / (steps.length - 1)) * 100
      : 100;

  return (
    <form onKeyDown={handleKeyDown} key={formKey} className="wizard-form">
      {/* ── Stepper header ── */}
      <div className="wizard-stepper">
        {/* Background progress track */}
        <div className="wizard-track">
          <div
            className="wizard-track-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          const isAccessible = idx <= maxTabReached;

          let stateClass = '';
          if (isActive) stateClass = 'wz-active';
          else if (isCompleted) stateClass = 'wz-completed';
          else if (!isAccessible) stateClass = 'wz-locked';

          const iconName = step.icon
            ? step.icon.startsWith('pi ')
              ? step.icon
              : `pi-${step.icon}`
            : 'pi-circle';

          return (
            <button
              key={idx}
              type="button"
              disabled={!isAccessible}
              onClick={() => handleStepClick(idx)}
              className={`wizard-step-btn ${stateClass}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="wz-badge">
                {isCompleted ? (
                  <i className="pi pi-check" />
                ) : (
                  <i className={`pi ${iconName}`} />
                )}
              </div>
              <span className="wz-label">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Step content — only the active panel is mounted ── */}
      <div className="wizard-body">
        {steps.map((step, idx) => (
          <div
            key={idx}
            ref={el => {
              tabRefs.current[idx] = el;
            }}
            className={`wizard-panel ${idx === activeIndex ? 'wz-panel-active' : 'wz-panel-hidden'}`}
            aria-hidden={idx !== activeIndex}
          >
            {step.content}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="wizard-footer">
        <ButtonPanel>
          <div className="wizard-footer-inner">
            <div className="wizard-footer-left">
              <span className="wizard-step-counter">
                Step {activeIndex + 1} of {steps.length}
              </span>
            </div>
            <div className="wizard-footer-right">
              {activeIndex > 0 && (
                <Button
                  type="button"
                  label="Back"
                  icon="arrow-left"
                  variant="outlined"
                  onClick={handleBack}
                  disabled={isSaving}
                />
              )}
              {customActions &&
                customActions(activeIndex, activeIndex === steps.length - 1)}
              <Button
                type="button"
                label="Reset"
                icon="refresh"
                variant="outlined"
                onClick={handleReset}
                disabled={isSaving}
              />
              {activeIndex < steps.length - 1 ? (
                <Button
                  type="button"
                  label="Next"
                  icon="arrow-right"
                  variant="primary"
                  onClick={handleNext}
                />
              ) : (
                <Button
                  type="button"
                  label="Save"
                  icon="save"
                  variant="primary"
                  onClick={onComplete}
                  isLoading={isSaving}
                />
              )}
            </div>
          </div>
        </ButtonPanel>
      </div>
    </form>
  );
}
