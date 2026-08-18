import type { Control, FormState, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import MultiPhotoUpload from './MultiPhotoUpload';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileOthersStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileOthersStep({
  register,
  control,
  formState,
}: ProfileOthersStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isParkingAvailable = useWatch({ control, name: 'parkingSpace' });
  const isWaterPurifierAvailable = useWatch({
    control,
    name: 'waterPurifierAvailable',
  });
  const isResidentialQuartersAvailable = useWatch({
    control,
    name: 'residentialQuartersAvailable',
  });
  const isObjectionToInfoPublic = useWatch({
    control,
    name: 'objectionToInfoPublic',
  });
  const isTransportAvailable = useWatch({
    control,
    name: 'transportAvailable',
  });
  const isLiftAvailable = useWatch({ control, name: 'liftAvailable' });
  const isRampAvailable = useWatch({ control, name: 'rampAvailable' });

  return (
    <>
      <FormCard title="CAMPUS AMENITIES" icon="compass">
        <FormGrid columns={2}>
          <DropDownList
            label="Parking space available?"
            name="parkingSpace"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.parkingSpace?.message as string}
          />
          <DropDownList
            label="Drinking Water Available?"
            name="drinkingWaterAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.drinkingWaterAvailable?.message as string
            }
          />
        </FormGrid>
        {isParkingAvailable === 'yes' && (
          <div className="mt-4">
            <FileUpload
              label="Parking Space Photo"
              name="parkingPhoto"
              control={control}
              mode="photo"
              accept="image/*"
              errorMessage={formState.errors.parkingPhoto?.message as string}
            />
          </div>
        )}
        <div className="mt-4">
          <FormGrid columns={2}>
            <DropDownList
              label="Water Purifier Available?"
              name="waterPurifierAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.waterPurifierAvailable?.message as string
              }
            />
            <DropDownList
              label="CCTV Available?"
              name="cctvAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.cctvAvailable?.message as string}
            />
          </FormGrid>
        </div>
        {isWaterPurifierAvailable === 'yes' && (
          <div className="mt-4">
            <FileUpload
              label="Water Purifier Photo"
              name="waterPurifierPhoto"
              control={control}
              mode="photo"
              accept="image/*"
              errorMessage={
                formState.errors.waterPurifierPhoto?.message as string
              }
            />
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4">
          <FormGrid columns={isTransportAvailable === 'yes' ? 2 : 1}>
            <DropDownList
              label="Transport / Bus Services Available?"
              name="transportAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.transportAvailable?.message as string
              }
            />
            {isTransportAvailable === 'yes' && (
              <TextBox
                label="Number of Buses / Vehicles"
                placeholder="e.g. 6"
                {...register('transportCount')}
                errorMessage={
                  formState.errors.transportCount?.message as string
                }
              />
            )}
          </FormGrid>
          {isTransportAvailable === 'yes' && (
            <div className="mt-4">
              <MultiPhotoUpload
                control={control}
                name="transportPhotos"
                label="Transport / Bus Photos"
                subLabel="Upload one or more photos of the transport fleet"
              />
            </div>
          )}
        </div>
      </FormCard>

      <FormCard title="NEIGHBOURHOOD & RESIDENTIAL" icon="home">
        <FormGrid columns={2}>
          <DropDownList
            label="Neighbour complaints of recurring nuisance?"
            name="neighbourComplaints"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.neighbourComplaints?.message as string
            }
          />
          <TextBox
            label="Neighbourhood Opinion / Remark"
            placeholder="Enter Remarks"
            {...register('neighbourComplaintsRemarks')}
            errorMessage={
              formState.errors.neighbourComplaintsRemarks?.message as string
            }
          />
          <DropDownList
            label="Residential Quarters Available / Provisioned?"
            name="residentialQuartersAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.residentialQuartersAvailable?.message as string
            }
          />
          {isResidentialQuartersAvailable === 'yes' && (
            <TextBox
              label="Residential Quarters Details"
              placeholder="Details"
              {...register('residentialQuartersDetails')}
              errorMessage={
                formState.errors.residentialQuartersDetails?.message as string
              }
            />
          )}
          <DropDownList
            label="Does the society's office bearers or college management object to the submitted information being made public for transparency?"
            name="objectionToInfoPublic"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.objectionToInfoPublic?.message as string
            }
          />
          {isObjectionToInfoPublic === 'yes' && (
            <TextBox
              label="Transparency Remark"
              placeholder="Remarks"
              {...register('transparencyRemarks')}
              errorMessage={
                formState.errors.transparencyRemarks?.message as string
              }
            />
          )}
        </FormGrid>
      </FormCard>

      <FormCard title="SAFETY NORMS" icon="shield">
        <FormGrid columns={1}>
          <DropDownList
            label="Safety Guards Available?"
            name="safetyGuardsAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.safetyGuardsAvailable?.message as string
            }
          />
        </FormGrid>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Fire Safety
          </h3>
          <FormGrid columns={3}>
            <DropDownList
              label="Fire Fighting Facility?"
              name="fireFightingFacility"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.fireFightingFacility?.message as string
              }
            />
            <DropDownList
              label="Fire Extinguishers?"
              name="fireExtinguishers"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.fireExtinguishers?.message as string
              }
            />
            <DropDownList
              label="Fire Alarm System?"
              name="fireAlarmSystem"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.fireAlarmSystem?.message as string}
            />
          </FormGrid>
          <div className="mt-4">
            <FileUpload
              label="Fire NOC Document"
              name="fireNocDocument"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              uploadNote="Upload the Fire NOC issued by the fire department"
              errorMessage={formState.errors.fireNocDocument?.message as string}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Medical Safety
          </h3>
          <FormGrid columns={3}>
            <DropDownList
              label="Medical Attendant Available?"
              name="medicalAttendantAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.medicalAttendantAvailable?.message as string
              }
            />
            <DropDownList
              label="Emergency Medicine Stock?"
              name="emergencyMedicineStock"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.emergencyMedicineStock?.message as string
              }
            />
            <DropDownList
              label="First Aid Facility?"
              name="firstAidFacility"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.firstAidFacility?.message as string
              }
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="ACCESSIBILITY / DIVYANG FACILITIES" icon="users">
        <FormGrid columns={2}>
          <DropDownList
            label="Ramp Available?"
            name="rampAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.rampAvailable?.message as string}
          />
          <DropDownList
            label="Lift Available?"
            name="liftAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.liftAvailable?.message as string}
          />
          <DropDownList
            label="Accessible Toilet?"
            name="accessibleToilet"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.accessibleToilet?.message as string}
          />
          <DropDownList
            label="Accessible Classroom?"
            name="accessibleClassroom"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.accessibleClassroom?.message as string
            }
          />
        </FormGrid>
        {isRampAvailable === 'yes' && (
          <div className="mt-4">
            <FileUpload
              label="Ramp Photo"
              name="rampPhoto"
              control={control}
              mode="photo"
              accept="image/*"
              errorMessage={formState.errors.rampPhoto?.message as string}
            />
          </div>
        )}
        {isLiftAvailable === 'yes' && (
          <div className="mt-4">
            <FileUpload
              label="Lift Photo"
              name="liftPhoto"
              control={control}
              mode="photo"
              accept="image/*"
              errorMessage={formState.errors.liftPhoto?.message as string}
            />
          </div>
        )}
      </FormCard>
    </>
  );
}
