import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { NumberBox, TextBox, DropDownList } from 'shared/components/forms';
import { FormGrid } from 'shared/new-components';
import { uploadPriorEducationDocument } from '../api';
import './PriorEducationCard.css';

export const EDUCATION_LEVELS = [
  {
    label: '10th (Secondary)',
    value: '10th',
    icon: 'pi-book',
    docType: '10th Marksheet',
  },
  {
    label: '12th (Sr. Secondary)',
    value: '12th',
    icon: 'pi-book',
    docType: '12th Marksheet',
  },
  {
    label: 'Diploma',
    value: 'Diploma',
    icon: 'pi-file-edit',
    docType: 'Diploma Certificate',
  },
  {
    label: "Bachelor's Degree (UG)",
    value: 'Bachelor',
    icon: 'pi-graduation-cap',
    docType: 'Degree Certificate',
  },
  {
    label: "Master's Degree (PG)",
    value: 'Master',
    icon: 'pi-graduation-cap',
    docType: 'Degree Certificate',
  },
  {
    label: 'PhD / Doctorate',
    value: 'PhD',
    icon: 'pi-star',
    docType: 'Doctorate Certificate',
  },
  {
    label: 'Other',
    value: 'Other',
    icon: 'pi-file',
    docType: 'Educational Certificate',
  },
];

const LEVEL_DROPDOWN_ITEMS = EDUCATION_LEVELS.map(l => ({
  text: l.label,
  value: l.value,
}));

interface PriorEducationCardProps {
  index: number;
  onRemove: () => void;
}

export default function PriorEducationCard({
  index,
  onRemove,
}: PriorEducationCardProps) {
  const { watch, setValue, control } = useFormContext<any>();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const educationLevel = watch(`priorEducations.${index}.educationLevel`) as
    | string
    | undefined;
  const documentId = watch(`priorEducations.${index}.documentId`) as
    | string
    | null;
  const documentFile = watch(
    `priorEducations.${index}.documentFile`
  ) as File | null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const id = await uploadPriorEducationDocument(file);
      if (id) {
        setValue(`priorEducations.${index}.documentFile`, file);
        setValue(`priorEducations.${index}.documentId`, id, {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleClearDocument() {
    setValue(`priorEducations.${index}.documentFile`, null);
    setValue(`priorEducations.${index}.documentId`, null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setUploadError(null);
  }

  const levelLabel =
    EDUCATION_LEVELS.find(l => l.value === educationLevel)?.label ??
    educationLevel ??
    'Education';
  const hasDocument = !!documentId;

  return (
    <div className="prior-edu-card" data-level={educationLevel || undefined}>
      <div className="prior-edu-card-header">
        <div className="prior-edu-card-header-left">
          <span
            className="prior-edu-level-badge"
            style={
              {
                '--edu-accent': getLevelColor(educationLevel),
              } as React.CSSProperties
            }
          >
            <i className="pi pi-graduation-cap" />
            {levelLabel}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>
            Record #{index + 1}
          </span>
        </div>
        <button
          type="button"
          className="prior-edu-remove-btn"
          onClick={onRemove}
          title="Remove this entry"
          aria-label="Remove education entry"
        >
          <i className="pi pi-times" />
        </button>
      </div>

      <div className="prior-edu-card-body">
        <FormGrid columns={3}>
          <DropDownList
            label="Education Level"
            name={`priorEducations.${index}.educationLevel`}
            control={control}
            data={LEVEL_DROPDOWN_ITEMS}
            textField="text"
            valueField="value"
            required
          />

          <TextBox
            label="Institution Name"
            name={`priorEducations.${index}.institutionName`}
            control={control}
            placeholder="e.g. Govt. Higher Secondary School"
            maxLength={150}
            required
          />

          <TextBox
            label="Board / University"
            name={`priorEducations.${index}.boardOrUniversity`}
            control={control}
            placeholder="e.g. CBSE, RBSE, Rajasthan University"
            maxLength={150}
            required
          />

          <NumberBox
            label="Passing Year"
            name={`priorEducations.${index}.passingYear`}
            control={control}
            placeholder="e.g. 2020"
            min={1900}
            max={new Date().getFullYear() + 1}
            useGrouping={false}
            required
          />

          <NumberBox
            label="Percentage (%)"
            name={`priorEducations.${index}.percentage`}
            control={control}
            placeholder="e.g. 85.50"
            min={0}
            max={100}
            useGrouping={false}
          />

          <NumberBox
            label="CGPA"
            name={`priorEducations.${index}.cgpa`}
            control={control}
            placeholder="e.g. 8.75"
            min={0}
            max={10}
            useGrouping={false}
          />

          <TextBox
            label="Subjects / Stream"
            name={`priorEducations.${index}.subjectsOrStream`}
            control={control}
            placeholder="e.g. Science (PCM), Commerce, Arts"
            maxLength={100}
            required
          />

          <TextBox
            label="Document Type"
            name={`priorEducations.${index}.documentType`}
            control={control}
            placeholder="e.g. 10th Marksheet, Degree Certificate"
            maxLength={50}
            required
          />
        </FormGrid>

        <div className="prior-edu-doc-row">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {hasDocument ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <div className="prior-edu-upload-done">
                <i className="pi pi-check-circle" />
                <span>
                  {documentFile instanceof File
                    ? documentFile.name
                    : 'Document uploaded'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={linkBtnStyle}
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClearDocument}
                style={{ ...linkBtnStyle, color: '#ef4444' }}
              >
                Remove
              </button>
            </div>
          ) : uploading ? (
            <div className="prior-edu-upload-uploading">
              <i className="pi pi-spin pi-spinner" />
              <span>Uploading document…</span>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={uploadBtnStyle}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = 'var(--color-primary)';
                  b.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = 'var(--color-gray-300)';
                  b.style.color = 'var(--color-gray-600)';
                }}
              >
                <i className="pi pi-upload" />
                Upload Marksheet / Certificate
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                  (.pdf, .jpg, .png)
                </span>
              </button>

              {uploadError && <p style={errorStyle}>{uploadError}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const linkBtnStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  border: 'none',
  background: 'none',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const uploadBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.45rem 0.9rem',
  border: '1px dashed var(--color-gray-300)',
  borderRadius: '0.5rem',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: 'var(--color-gray-600)',
  transition: 'all 0.15s',
};

const errorStyle: React.CSSProperties = {
  color: '#ef4444',
  fontSize: '0.78rem',
  margin: '0.3rem 0 0',
};

function getLevelColor(level: string | undefined): string {
  const map: Record<string, string> = {
    '10th': '#3b82f6',
    '12th': '#10b981',
    Diploma: '#f59e0b',
    Bachelor: '#8b5cf6',
    Master: '#f97316',
    PhD: '#ef4444',
    Other: '#6366f1',
  };
  return map[level ?? ''] ?? '#6366f1';
}
