import type { Control, FormState, Path } from 'react-hook-form';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInfrastructureStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileInfrastructureStep({
  register,
  control,
  formState,
}: ProfileInfrastructureStepProps) {
  return (
    <>
      <FormCard
        title="Physical Infrastructure Details"
        subtitle="Details of college land, buildings, staff quarters, and hostel facilities."
        icon="map"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Total Land Area (Acres) & Ownership"
            placeholder="e.g. 5 Acres, Owned"
            {...register('totalLandArea')}
            errorMessage={formState.errors.totalLandArea?.message as string}
            required
          />
          <TextBox
            label="Total Number of Buildings"
            placeholder="0"
            {...register('totalNumberOfBuildings')}
            errorMessage={
              formState.errors.totalNumberOfBuildings?.message as string
            }
            required
          />
          <TextBox
            label="Physical Education Facility (Sports/Gym)"
            placeholder="e.g. Sports grounds, gym hall"
            {...register('physicalEducationFacility')}
            errorMessage={
              formState.errors.physicalEducationFacility?.message as string
            }
            required
          />
          <DropDownList
            label="Hostel Facility Available?"
            placeholder="Select..."
            name="hostelFacility"
            control={control}
            data={[
              { id: 'yes', name: 'Yes' },
              { id: 'no', name: 'No' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.hostelFacility?.message as string}
            required
          />
        </FormGrid>

        <div className="mt-6 border border-blue-100 rounded-lg p-4 bg-blue-50/30">
          <div className="flex items-center gap-2 text-blue-800 font-semibold mb-4">
            <i className="pi pi-home" />
            <span>Hostel Capacity Details</span>
          </div>
          <FormGrid columns={3}>
            <TextBox
              label="Boys Hostels Count"
              placeholder="e.g. 1"
              {...register('boysHostelsCount')}
              errorMessage={
                formState.errors.boysHostelsCount?.message as string
              }
            />
            <TextBox
              label="Girls Hostels Count"
              placeholder="e.g. 1"
              {...register('girlsHostelsCount')}
              errorMessage={
                formState.errors.girlsHostelsCount?.message as string
              }
            />
            <TextBox
              label="Total Capacity (Students)"
              placeholder="e.g. 150"
              {...register('totalCapacity')}
              errorMessage={formState.errors.totalCapacity?.message as string}
            />
          </FormGrid>
        </div>
      </FormCard>
    </>
  );
}
