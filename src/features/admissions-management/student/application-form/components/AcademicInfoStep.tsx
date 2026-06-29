import { useCallback } from 'react';
import {
  useFieldArray,
  type Control,
  type UseFormSetValue,
} from 'react-hook-form';
import SelectAcademicYearSession from 'features/components/SelectAcademicYearSession';
import SelectDegreeLevel from 'features/components/SelectDegreeLevel';
import SelectProgramme from 'features/components/SelectProgramme';
import SelectSpecialisation from 'features/components/SelectSpecialisation';
import SelectCourseMode from 'features/components/SelectProgramModeOfEducation';
import { FormCard, FormGrid } from 'shared/new-components';
import PriorEducationCard, { EDUCATION_LEVELS } from './PriorEducationCard';
import type { ApplicationFormData, PriorEducationEntry } from '../types';

// ─── Props ───────────────────────────────────────────────────────────────────

interface AcademicInfoStepProps {
  register: (key: keyof ApplicationFormData) => any;
  control: Control<ApplicationFormData>;
  setValue: UseFormSetValue<ApplicationFormData>;
  errors?: any;
}

// ─── Default entry factory ───────────────────────────────────────────────────

function createEntry(level: string): PriorEducationEntry {
  const levelConf = EDUCATION_LEVELS.find(l => l.value === level);
  return {
    id: crypto.randomUUID(),
    educationLevel: level,
    institutionName: '',
    boardOrUniversity: '',
    passingYear: null,
    percentage: null,
    cgpa: null,
    subjectsOrStream: '',
    documentType: levelConf?.docType ?? '',
    documentFile: null,
    documentId: null,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AcademicInfoStep({
  register,
  control,
  errors,
}: AcademicInfoStepProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'priorEducations',
    keyName: 'fieldId',
  });

  const handleAdd = useCallback(
    (level: string = 'Other') => {
      append(createEntry(level));
    },
    [append]
  );

  const priorEdErrors = (errors as any)?.priorEducations;

  return (
    <>
      {/* ══════════════════════════════════════════════
          Section 1 — Applying For
          ══════════════════════════════════════════ */}
      <FormCard
        title="Applying For"
        icon="send"
        subtitle="Details of the programme you are applying to"
      >
        <FormGrid columns={3}>
          <SelectAcademicYearSession
            label="Academic Session"
            {...register('academicSession')}
            required
          />
          <SelectProgramme {...register('programme')} required />
          <SelectDegreeLevel {...register('degreeLevel')} required />
          <SelectCourseMode
            label="Program of Study"
            {...register('programOfStudy')}
            required
          />
          <SelectSpecialisation {...register('specialisation')} required />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Prior Education History"
        icon="book"
        subtitle="Add all your educational qualifications — 10th, 12th, degrees, etc."
        headerAction={
          <button
            type="button"
            onClick={() => handleAdd()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '0.5rem',
              border: '1.5px solid var(--color-primary, #6366f1)',
              background: 'transparent',
              color: 'var(--color-primary, #6366f1)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = 'var(--color-primary, #6366f1)';
              btn.style.color = '#fff';
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = 'transparent';
              btn.style.color = 'var(--color-primary, #6366f1)';
            }}
          >
            <i className="pi pi-plus" />
            Add Education
          </button>
        }
      >
        <div className="prior-edu-toolbar">
          {['10th', '12th', 'Diploma', 'Bachelor', 'Master', 'PhD'].map(
            level => (
              <button
                key={level}
                type="button"
                onClick={() => handleAdd(level)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '9999px',
                  border: `1px solid ${getLevelBorderColor(level)}`,
                  background: getLevelBgColor(level),
                  color: getLevelColor(level),
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity =
                    '0.75')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
                }
              >
                <i className="pi pi-plus" style={{ fontSize: '0.65rem' }} />
                {level}
              </button>
            )
          )}
        </div>

        {priorEdErrors?.message && (
          <p
            style={{
              color: '#ef4444',
              fontSize: '0.82rem',
              marginTop: '0.5rem',
            }}
          >
            {priorEdErrors.message}
          </p>
        )}
        {typeof priorEdErrors === 'string' && (
          <p
            style={{
              color: '#ef4444',
              fontSize: '0.82rem',
              marginTop: '0.5rem',
            }}
          >
            {priorEdErrors}
          </p>
        )}

        <div className="prior-edu-list" style={{ marginTop: '1rem' }}>
          {fields.length === 0 ? (
            <div className="prior-edu-empty">
              <i className="pi pi-graduation-cap" />
              <p>
                No education records added yet.
                <br />
                Use the buttons above to add your 10th, 12th, or degree details.
              </p>
            </div>
          ) : (
            fields.map((field, index) => (
              <PriorEducationCard
                key={field.fieldId}
                index={index}
                onRemove={() => remove(index)}
              />
            ))
          )}
        </div>
      </FormCard>
    </>
  );
}

function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    '10th': '#2563eb',
    '12th': '#059669',
    Diploma: '#d97706',
    Bachelor: '#7c3aed',
    Master: '#ea580c',
    PhD: '#dc2626',
  };
  return map[level] ?? '#6366f1';
}

function getLevelBgColor(level: string): string {
  const map: Record<string, string> = {
    '10th': '#eff6ff',
    '12th': '#f0fdf4',
    Diploma: '#fffbeb',
    Bachelor: '#f5f3ff',
    Master: '#fff7ed',
    PhD: '#fef2f2',
  };
  return map[level] ?? '#eef2ff';
}

function getLevelBorderColor(level: string): string {
  const map: Record<string, string> = {
    '10th': '#bfdbfe',
    '12th': '#a7f3d0',
    Diploma: '#fde68a',
    Bachelor: '#ddd6fe',
    Master: '#fed7aa',
    PhD: '#fecaca',
  };
  return map[level] ?? '#c7d2fe';
}
