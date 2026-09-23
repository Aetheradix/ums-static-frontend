import { useState } from 'react';
import { ToastService } from 'services';
import { FileUpload } from 'shared/components/forms';

/** Structured metadata captured for an uploaded document. */
export interface CivilDocument {
  name: string;
  sizeKB: number;
  type: string;
  /** ISO timestamp of upload. */
  uploadedAt: string;
}

interface DocumentUploaderProps {
  label: string;
  /** Existing document metadata or a plain filename string (legacy records). */
  value?: CivilDocument | string | null;
  onChange: (doc: CivilDocument | null) => void;
  required?: boolean;
  /** Accept attribute; also used to validate the extension. Default pdf/jpg/png. */
  accept?: string;
  /** Max size in MB. Default 10. */
  maxSizeMB?: number;
  uploadNote?: string;
}

/**
 * Document upload control for the civil module.
 *
 * Wraps the shared FileUpload (mode="file") and adds:
 *   - client-side extension validation against `accept`
 *   - client-side size validation (default 10MB, spec requirement)
 *   - structured metadata capture (name/size/type/uploadedAt) instead of the
 *     bare filename string most legacy civil pages store
 *   - inline error text below the field
 */
export default function DocumentUploader({
  label,
  value,
  onChange,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  uploadNote,
}: DocumentUploaderProps) {
  const [error, setError] = useState<string>('');

  const allowedExts = accept
    .split(',')
    .map(e => e.trim().replace(/^\./, '').toLowerCase())
    .filter(Boolean);

  const currentName = typeof value === 'string' ? value : (value?.name ?? null);

  const handleChange = (file: File | null) => {
    if (!file) {
      setError('');
      onChange(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (allowedExts.length > 0 && !allowedExts.includes(ext)) {
      const msg = `Only ${allowedExts.map(e => `.${e}`).join(', ')} files are allowed.`;
      setError(msg);
      ToastService.error(msg, 'Invalid File Type');
      onChange(null);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const msg = `File must be ${maxSizeMB} MB or smaller.`;
      setError(msg);
      ToastService.error(msg, 'Invalid File Size');
      onChange(null);
      return;
    }

    setError('');
    onChange({
      name: file.name,
      sizeKB: Math.round(file.size / 1024),
      type: file.type || ext,
      uploadedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <FileUpload
        label={label}
        required={required}
        accept={accept}
        mode="file"
        value={currentName}
        uploadNote={
          uploadNote || `Max ${maxSizeMB}MB (${accept.replace(/\./g, '')})`
        }
        onChange={handleChange}
      />
      {error && (
        <span className="text-xs font-medium text-red-600">{error}</span>
      )}
    </div>
  );
}
