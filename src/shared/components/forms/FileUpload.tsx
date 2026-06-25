import React, { useEffect, useState } from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { getPhotoUrl } from 'shared/utils/photoUrl';
import './FileUpload.css';
import InputBlock from './InputBlock';

interface FileUploadProps<TForm extends FieldValues>
  extends
    Controls.FormProps<TForm>,
    Controls.InputBlockProps,
    Controls.InputProps {
  value?: File | string | null;
  preview?: string | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  showPreview?: boolean;
  previewWidth?: number;
  previewHeight?: number;
  uploadNote?: string;
  maxSizeKB?: number;
  mode?: 'photo' | 'file' | 'avatar';
}

function InnerFileUpload({
  id,
  name,
  errorMessage,
  label,
  onChange,
  required,
  accept = 'image/*',
  showPreview = true,
  previewWidth = 100,
  previewHeight = 120,
  preview,
  uploadNote,
  maxSizeKB,
  value,
  mode = 'photo',
}: FileUploadProps<FieldValues>) {
  const inputId = id ?? name;

  const [localPreview, setLocalPreview] = useState<string | null>(
    preview ?? null
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalPreview(preview ?? null);

    if (!preview) {
      setSelectedFileName(null);
    }
  }, [preview]);

  // Sync with form value (important for Reset)
  useEffect(() => {
    if (!value) {
      setLocalPreview(preview ?? null);
      setSelectedFileName(null);
    }
  }, [value, preview]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (maxSizeKB && file.size > maxSizeKB * 1024) {
      setSelectedFileName(null);
      setLocalPreview(null);
      resetFileInput();
      onChange?.(null);

      ToastService.error(
        `File size should not be more than ${maxSizeKB} KB.`,
        'Invalid File Size'
      );

      return;
    }

    setSelectedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setLocalPreview(reader.result as string);
        onChange?.(file);
      };

      reader.readAsDataURL(file);
    } else {
      setLocalPreview(null);
      onChange?.(file);
    }

    event.target.value = '';
  };

  const handleClear = () => {
    setSelectedFileName(null);
    setLocalPreview(null);
    resetFileInput();
    onChange?.(null);
  };

  const displayUrl = getPhotoUrl(localPreview);

  const fileNameToShow = value
    ? typeof value === 'string'
      ? value.split('/').pop()
      : (value as File).name
    : selectedFileName;

  if (mode === 'file') {
    let fileIcon = 'pi pi-file';

    if (fileNameToShow) {
      const lowerName = fileNameToShow.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        fileIcon = 'pi pi-file-pdf file-upload-pdf-icon';
      } else if (
        lowerName.endsWith('.jpg') ||
        lowerName.endsWith('.jpeg') ||
        lowerName.endsWith('.png') ||
        lowerName.endsWith('.gif')
      ) {
        fileIcon = 'pi pi-image file-upload-image-icon';
      } else if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
        fileIcon = 'pi pi-file-word file-upload-word-icon';
      }
    }

    return (
      <InputBlock
        label={label}
        id={inputId}
        errorMessage={errorMessage}
        required={required}
      >
        <div className="file-upload-file-mode">
          <input
            type="file"
            ref={fileInputRef}
            className="file-upload-hidden-input"
            accept={accept}
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="file-upload-dropzone"
          >
            <div className="file-upload-file-info">
              <div className="file-upload-file-icon-box">
                <i className={fileIcon} />
              </div>

              <div className="file-upload-file-text">
                <span className="file-upload-file-name">
                  {fileNameToShow || 'No file selected'}
                </span>

                {uploadNote && (
                  <span className="file-upload-file-note">{uploadNote}</span>
                )}
              </div>
            </div>

            <div className="file-upload-actions">
              <Button
                label={fileNameToShow ? 'Change' : 'Choose'}
                icon={fileNameToShow ? 'refresh' : 'plus'}
                variant="outlined"
                type="button"
                className="file-upload-change-button pointer-events-none"
              />

              {fileNameToShow && (
                <button
                  type="button"
                  className="file-upload-delete-button"
                  onClick={event => {
                    event.stopPropagation();
                    handleClear();
                  }}
                  title="Remove file"
                >
                  <i className="pi pi-trash" />
                </button>
              )}
            </div>
          </div>
        </div>
      </InputBlock>
    );
  }

  if (mode === 'avatar') {
    return (
      <InputBlock
        label={label}
        id={inputId}
        errorMessage={errorMessage}
        required={required}
      >
        <div className="file-upload-avatar-wrap">
          <input
            type="file"
            ref={fileInputRef}
            className="file-upload-hidden-input"
            accept={accept}
            onChange={handleFileChange}
          />

          <div className="file-upload-avatar-preview">
            {displayUrl ? (
              <img
                src={displayUrl}
                alt="Profile preview"
                onError={() => setLocalPreview(null)}
              />
            ) : (
              <span className="file-upload-avatar-placeholder">
                <i className="pi pi-user" />
              </span>
            )}

            <button
              type="button"
              className="file-upload-avatar-action"
              onClick={event => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
              title={
                fileNameToShow ? 'Change profile image' : 'Upload profile image'
              }
            >
              <i className="pi pi-camera" />
            </button>
          </div>

          {uploadNote && (
            <small className="file-upload-note">{uploadNote}</small>
          )}
        </div>
      </InputBlock>
    );
  }

  return (
    <InputBlock
      label={label}
      id={inputId}
      errorMessage={errorMessage}
      required={required}
    >
      <div className="file-upload-photo-mode">
        {showPreview && (displayUrl || selectedFileName) && (
          <div
            className="file-upload-preview"
            style={
              {
                '--preview-width': `${previewWidth}px`,
                '--preview-height': `${previewHeight}px`,
              } as React.CSSProperties
            }
          >
            {displayUrl ? (
              <img
                src={displayUrl}
                alt="Preview"
                onError={() => setLocalPreview(null)}
              />
            ) : (
              <div className="file-upload-preview-empty">
                <i className="pi pi-file file-upload-icon" />
                <span className="file-upload-filename">{selectedFileName}</span>
              </div>
            )}
          </div>
        )}

        <div className="file-upload-photo-actions">
          <input
            type="file"
            ref={fileInputRef}
            className="file-upload-hidden-input"
            accept={accept}
            onChange={handleFileChange}
          />

          <Button
            label="Choose"
            icon="plus"
            variant="primary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          />

          {uploadNote && (
            <small className="file-upload-note">{uploadNote}</small>
          )}
        </div>
      </div>
    </InputBlock>
  );
}

export default function FileUpload<TForm extends FieldValues>(
  props: FileUploadProps<TForm>
) {
  const { name, control } = props;

  if (!control || !name) {
    return (
      <InnerFileUpload
        {...(props as unknown as FileUploadProps<FieldValues>)}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState }) => (
        <InnerFileUpload
          {...(props as unknown as FileUploadProps<FieldValues>)}
          {...field}
          errorMessage={formState.errors[name]?.message?.toString()}
        />
      )}
    />
  );
}
