import type { Control, FormState, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { getCollegeRegistration } from '../../registrationStore';
import MultiPhotoUpload from './MultiPhotoUpload';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileLandBuildingStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

const landTypeOptions = [
  { id: 'self-owned', name: 'Self-Owned' },
  { id: 'society-owned', name: 'Society-Owned' },
  { id: 'rented', name: 'Rented' },
  { id: 'lease', name: 'Lease' },
];

export default function ProfileLandBuildingStep({
  register,
  control,
  formState,
}: ProfileLandBuildingStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  // Regulatory body selected during college registration (e.g. UGC, AICTE, BCI)
  const regulatoryBody = getCollegeRegistration()?.approvalAuthority;

  const landType = useWatch({ control, name: 'landType' });
  const isSharedCampus = useWatch({ control, name: 'sharedCampus' });

  return (
    <>
      <FormCard title="LAND DETAILS" icon="map">
        <FormGrid columns={2}>
          <DropDownList
            label={
              regulatoryBody
                ? `As per ${regulatoryBody} land requirement norms fulfilled?`
                : 'As per regulatory body land requirement norms fulfilled?'
            }
            subLabel={
              regulatoryBody ? `Regulatory body: ${regulatoryBody}` : undefined
            }
            name="landNormsFulfilled"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.landNormsFulfilled?.message as string
            }
          />
          <DropDownList
            label="Land Type"
            name="landType"
            control={control}
            placeholder="Select Land Type"
            data={landTypeOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.landType?.message as string}
          />
          <TextBox
            label="Total Land Area"
            placeholder="e.g. 5.2 Acres"
            {...register('landTotalArea')}
            errorMessage={formState.errors.landTotalArea?.message as string}
          />
        </FormGrid>

        {(landType === 'self-owned' || landType === 'society-owned') && (
          <div className="mt-4">
            <FileUpload
              label="Registry Document"
              name="landRegistryDocument"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              uploadNote="Upload the land registry document"
              errorMessage={
                formState.errors.landRegistryDocument?.message as string
              }
            />
          </div>
        )}
        {landType === 'rented' && (
          <div className="mt-4">
            <FileUpload
              label="Rent Agreement"
              name="landRentAgreement"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              uploadNote="Upload the registered rent agreement"
              errorMessage={
                formState.errors.landRentAgreement?.message as string
              }
            />
          </div>
        )}
        {landType === 'lease' && (
          <div className="mt-4">
            <FileUpload
              label="Lease Deed / Document"
              name="landLeaseDocument"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              uploadNote="Upload the lease deed or related documents"
              errorMessage={
                formState.errors.landLeaseDocument?.message as string
              }
            />
          </div>
        )}
      </FormCard>

      <FormCard title="BUILDING DETAILS" icon="building">
        <FormGrid columns={2}>
          <TextBox
            label="Total Area"
            placeholder="e.g. 80,000 Sq. Ft."
            {...register('totalArea')}
            errorMessage={formState.errors.totalArea?.message as string}
          />
          <TextBox
            label="Built-up Area"
            placeholder="e.g. 45,000 Sq. Ft."
            {...register('builtUpArea')}
            errorMessage={formState.errors.builtUpArea?.message as string}
          />
        </FormGrid>
        <div className="mt-4">
          <TextArea
            label="Quality of Building & Surroundings"
            placeholder="Describe construction quality, open space, gardens, light & air, overall ambiance"
            rows={3}
            {...register('qualityOfBuilding')}
            errorMessage={formState.errors.qualityOfBuilding?.message as string}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Built-up Accommodation Details (Rooms, Verandah, etc.)"
            placeholder="Describe rooms, verandahs, office space, laboratories, galleries etc."
            rows={3}
            {...register('accommodationDetails')}
            errorMessage={
              formState.errors.accommodationDetails?.message as string
            }
          />
        </div>
        <div className="mt-4">
          <MultiPhotoUpload
            control={control}
            name="buildingPhotos"
            label="Building Photos"
            subLabel="Upload one or more photos of the college building"
          />
        </div>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <FormGrid columns={isSharedCampus === 'yes' ? 2 : 1}>
            <DropDownList
              label="Is Campus shared with another college?"
              name="sharedCampus"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.sharedCampus?.message as string}
            />
            {isSharedCampus === 'yes' && (
              <TextBox
                label="Shared Area"
                placeholder="Enter approximate area shared with the other college"
                {...register('sharedCampusArea')}
                errorMessage={
                  formState.errors.sharedCampusArea?.message as string
                }
              />
            )}
          </FormGrid>
        </div>
      </FormCard>
    </>
  );
}
