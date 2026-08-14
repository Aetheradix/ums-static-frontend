import type { Control, FormState, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInfraDetailsStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileInfraDetailsStep({
  register,
  control,
  formState,
}: ProfileInfraDetailsStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isBoardAvailable = useWatch({ control, name: 'boardAvailable' });
  const isInternetAvailable = useWatch({ control, name: 'internetAvailable' });

  return (
    <>
      <FormCard title="FURNITURE DETAILS" icon="table">
        <FormGrid columns={3}>
          <TextBox
            label="How many Tables are there?"
            placeholder="e.g. 60"
            {...register('tablesCount')}
            errorMessage={formState.errors.tablesCount?.message as string}
          />
          <TextBox
            label="How many Chairs are there?"
            placeholder="e.g. 250"
            {...register('chairsCount')}
            errorMessage={formState.errors.chairsCount?.message as string}
          />
          <TextBox
            label="Number of Student Desks?"
            placeholder="e.g. 120"
            {...register('studentDesksCount')}
            errorMessage={formState.errors.studentDesksCount?.message as string}
          />
          <TextBox
            label="Number of Student Benches?"
            placeholder="e.g. 120"
            {...register('studentBenchesCount')}
            errorMessage={
              formState.errors.studentBenchesCount?.message as string
            }
          />
          <TextBox
            label="Almirahs / Storage Cabinets?"
            placeholder="e.g. 20"
            {...register('almirahsCount')}
            errorMessage={formState.errors.almirahsCount?.message as string}
          />
        </FormGrid>
        <div className="mt-4">
          <FormGrid columns={isBoardAvailable === 'yes' ? 2 : 1}>
            <DropDownList
              label="Blackboard / Whiteboard Available?"
              name="boardAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.boardAvailable?.message as string}
            />
            {isBoardAvailable === 'yes' && (
              <TextBox
                label="Blackboard / Whiteboard Quantity"
                placeholder="e.g. 24"
                {...register('boardQty')}
                errorMessage={formState.errors.boardQty?.message as string}
              />
            )}
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="COMPUTERS" icon="desktop">
        <div className="flex flex-col gap-4">
          <FormGrid columns={4}>
            <TextBox
              label="Latest Computers"
              placeholder="Count/Details"
              {...register('latestComputers')}
              errorMessage={formState.errors.latestComputers?.message as string}
            />
            <TextBox
              label="Old Computers"
              placeholder="Count/Details"
              {...register('oldComputers')}
              errorMessage={formState.errors.oldComputers?.message as string}
            />
            <TextBox
              label="Printers"
              placeholder="Count/Details"
              {...register('printers')}
              errorMessage={formState.errors.printers?.message as string}
            />
            <TextBox
              label="Scanners"
              placeholder="Count/Details"
              {...register('scanners')}
              errorMessage={formState.errors.scanners?.message as string}
            />
          </FormGrid>
          <FormGrid columns={isInternetAvailable === 'yes' ? 2 : 1}>
            <DropDownList
              label="Internet Available?"
              name="internetAvailable"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.internetAvailable?.message as string
              }
            />
            {isInternetAvailable === 'yes' && (
              <TextBox
                label="Internet Connection Type"
                placeholder="Details"
                {...register('internetConnectionType')}
                errorMessage={
                  formState.errors.internetConnectionType?.message as string
                }
              />
            )}
          </FormGrid>
          <FormGrid columns={4}>
            <TextBox
              label="Computer Trained Staff"
              placeholder="Details"
              {...register('computerTrainedStaff')}
              errorMessage={
                formState.errors.computerTrainedStaff?.message as string
              }
            />
            <div className="col-span-2">
              <TextBox
                label="Computer : Student Ratio"
                placeholder="Ratio"
                {...register('computerStudentRatio')}
                errorMessage={
                  formState.errors.computerStudentRatio?.message as string
                }
              />
            </div>
            <TextBox
              label="Working Computers"
              placeholder="Count"
              {...register('workingComputers')}
              errorMessage={
                formState.errors.workingComputers?.message as string
              }
            />
          </FormGrid>
          <TextBox
            label="Down Time"
            placeholder="Details"
            {...register('downTime')}
            errorMessage={formState.errors.downTime?.message as string}
          />
          <TextBox
            label="Licensed Software Available"
            placeholder="Details"
            {...register('licensedSoftwareAvailable')}
            errorMessage={
              formState.errors.licensedSoftwareAvailable?.message as string
            }
          />
          <TextBox
            label="Packages in use"
            placeholder="Details"
            {...register('packagesInUse')}
            errorMessage={formState.errors.packagesInUse?.message as string}
          />
          <TextBox
            label="Future Plans (Computers)"
            placeholder="Details"
            {...register('futurePlansComputers')}
            errorMessage={
              formState.errors.futurePlansComputers?.message as string
            }
          />
        </div>
      </FormCard>
    </>
  );
}
