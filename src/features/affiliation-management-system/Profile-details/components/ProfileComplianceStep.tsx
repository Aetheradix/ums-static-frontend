import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileComplianceStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileComplianceStep({
  register,
  control,
  formState,
}: ProfileComplianceStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isStatutoryNormsAdhered = useWatch({
    control,
    name: 'statutoryNormsAdhered',
  });

  const isMpGovtPermission = useWatch({
    control,
    name: 'mpGovtPermission',
  });

  return (
    <>
      <FormCard title="BUDGET & BOOKS OF ACCOUNT" icon="money-bill">
        <div className="flex flex-col gap-4">
          <TextBox
            label="Source of funding of the society"
            placeholder="Enter Details"
            {...register('sourceOfFunding')}
            errorMessage={formState.errors.sourceOfFunding?.message as string}
          />
          <TextBox
            label="Annual projected income & expenditure for the course"
            placeholder="Enter Details"
            {...register('annualProjectedIncome')}
            errorMessage={
              formState.errors.annualProjectedIncome?.message as string
            }
          />
          <FormGrid columns={2}>
            <DropDownList
              label="Regular books of accounts maintained?"
              name="regularBooksMaintained"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.regularBooksMaintained?.message as string
              }
            />
            <DropDownList
              label="Accounts audited regularly by CA?"
              name="accountsAudited"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.accountsAudited?.message as string}
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="STATUTORY COMPLIANCE" icon="check-circle">
        <div className="flex flex-col gap-4">
          <TextBox
            label="Conditions laid down by statutory body & compliance status (AICTE/NCTE/BCI/MCI etc.)"
            placeholder="Enter Details"
            {...register('statutoryConditions')}
            errorMessage={
              formState.errors.statutoryConditions?.message as string
            }
          />
          <FormGrid columns={2}>
            <TextBox
              label="Session / year up to which permission granted"
              placeholder="Enter Year/Session"
              {...register('sessionPermissionGranted')}
              errorMessage={
                formState.errors.sessionPermissionGranted?.message as string
              }
            />
            <DropDownList
              label="MP Govt. Permission Issued? (Dept. Higher/Technical/Medical Education)"
              name="mpGovtPermission"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.mpGovtPermission?.message as string
              }
            />
          </FormGrid>
          {isMpGovtPermission === 'yes' && (
            <TextArea
              label="Conditions imposed by MP Govt. & compliance status"
              placeholder="Enter Details"
              rows={3}
              {...register('mpGovtConditions')}
              errorMessage={
                formState.errors.mpGovtConditions?.message as string
              }
            />
          )}
        </div>
      </FormCard>

      <FormCard title="UNIVERSITY REQUIREMENTS & COMPLIANCE" icon="building">
        <div className="flex flex-col gap-4">
          <FormGrid columns={1}>
            <DropDownList
              label="Statute 28 fulfilled?"
              name="statute28Fulfilled"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.statute28Fulfilled?.message as string
              }
            />
          </FormGrid>
          <TextBox
            label="Fee Deposits to University (Affiliation, Renewal, Sports, Cultural, Exam & Other Fees)"
            placeholder="Enter Details"
            {...register('endowmentFundDetails')}
            errorMessage={
              formState.errors.endowmentFundDetails?.message as string
            }
          />
          <TextBox
            label="Deposit in the Endowment Found?"
            placeholder="Enter Details"
            {...register('endowmentFundDeposit')}
            errorMessage={
              formState.errors.endowmentFundDeposit?.message as string
            }
          />
          <FormGrid columns={3}>
            <DropDownList
              label="Statutory norms adhered?"
              name="statutoryNormsAdhered"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.statutoryNormsAdhered?.message as string
              }
            />
            <DropDownList
              label="Whether College has Adhered to Fee Structure?"
              name="feeStructureAdhered"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.feeStructureAdhered?.message as string
              }
            />
            <DropDownList
              label="Reservation norms followed?"
              name="reservationNormsFollowed"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.reservationNormsFollowed?.message as string
              }
            />
          </FormGrid>
          {isStatutoryNormsAdhered === 'yes' && (
            <TextBox
              label="Statutory Norms Remarks"
              placeholder="Enter Details"
              {...register('statutoryNormsRemarks')}
              errorMessage={
                formState.errors.statutoryNormsRemarks?.message as string
              }
            />
          )}
        </div>
      </FormCard>
    </>
  );
}
