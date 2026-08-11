import type { Control, FormState, Path } from 'react-hook-form';
import { FileUpload } from 'shared/components/forms';
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
          <FileUpload
            label="Photo of College Building"
            name="photoOfCollegeBuilding"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={
              formState.errors.photoOfCollegeBuilding?.message as string
            }
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
