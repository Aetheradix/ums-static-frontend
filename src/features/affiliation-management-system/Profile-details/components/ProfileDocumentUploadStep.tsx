import React, { useRef } from 'react';
import {
  Controller,
  type Control,
  type FormState,
  type Path,
} from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { InputBlock, FileUpload } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileDocumentUploadStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileDocumentUploadStep({
  control,
  formState,
}: ProfileDocumentUploadStepProps) {
  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 13B: Document Uploads
      </div>
      <FormCard title="UPLOAD SUPPORTING DOCUMENTS" icon="upload">
        <FormGrid columns={2}>
          <FileUpload
            label="NOC Document"
            name="nocDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={formState.errors.nocDocument?.message as string}
          />
          <FileUpload
            label="Council Approval Document"
            name="councilApprovalsDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.councilApprovalsDocument?.message as string
            }
          />
          <FileUpload
            label="Society / Trust Registration"
            name="societyRegistrationDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.societyRegistrationDocument?.message as string
            }
          />
          <FileUpload
            label="Land Documents"
            name="landDocumentsDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.landDocumentsDocument?.message as string
            }
          />
          <FileUpload
            label="Building Plan and Safety Certificates"
            name="buildingPlanAndSafetyDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.buildingPlanAndSafetyDocument?.message as string
            }
          />
          <FileUpload
            label="Amenities Proof"
            name="amenitiesProofDocument"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.amenitiesProofDocument?.message as string
            }
          />

          <Controller
            name="photoOfCollegeBuilding"
            control={control}
            render={({ field }) => {
              const fileInputRef = useRef<HTMLInputElement>(null);
              const selectedFiles = (field.value as File[]) || [];
              const fileCount = selectedFiles.length;

              const handleFileChange = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  field.onChange([...selectedFiles, ...newFiles]);
                }
                e.target.value = '';
              };

              const handleClear = () => {
                field.onChange([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              };

              const label =
                'Upload photo of college building (user can upload multiple photos)';
              const errorMessage = formState.errors.photoOfCollegeBuilding
                ?.message as string;

              return (
                <InputBlock
                  label={label}
                  id="photoOfCollegeBuilding"
                  errorMessage={errorMessage}
                >
                  <div className="file-upload-file-mode">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="file-upload-hidden-input"
                      accept=".pdf,image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="file-upload-dropzone"
                    >
                      <div className="file-upload-file-info">
                        <div className="file-upload-file-icon-box">
                          <i className="pi pi-images file-upload-image-icon" />
                        </div>
                        <div className="file-upload-file-text">
                          <span className="file-upload-file-name">
                            {fileCount > 0
                              ? `${fileCount} file(s) selected`
                              : 'No files selected'}
                          </span>
                        </div>
                      </div>
                      <div className="file-upload-actions">
                        <Button
                          label={fileCount > 0 ? 'Add More' : 'Choose'}
                          icon={fileCount > 0 ? 'plus' : 'plus'}
                          variant="outlined"
                          type="button"
                          className="file-upload-change-button pointer-events-none"
                        />
                        {fileCount > 0 && (
                          <button
                            type="button"
                            className="file-upload-delete-button"
                            onClick={e => {
                              e.stopPropagation();
                              handleClear();
                            }}
                            title="Remove all files"
                          >
                            <i className="pi pi-trash" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </InputBlock>
              );
            }}
          />
          <FileUpload
            label="Building Map"
            name="buildingMap"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={formState.errors.buildingMap?.message as string}
          />
        </FormGrid>
      </FormCard>
    </>
  );
}
