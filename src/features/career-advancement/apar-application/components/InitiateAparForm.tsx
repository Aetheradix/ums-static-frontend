import SelectCaste from 'features/components/SelectCaste';
import SelectEmployeeType from 'features/components/SelectEmployeeType';
import SelectGroup from 'features/components/SelectGroup';
import { Button } from 'shared/components/buttons';
import { DatePicker, RadioButtonList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import './InitiateAparForm.css';
import { useInitiateAparForm } from './form.hook';

type InitiateAparForm = CareerAdvancement.AparApplication.InitiateAparForm;

interface InitiateAparFormProps {
  onSubmit: (data: InitiateAparForm, isDraft: boolean) => Promise<void>;
  onCancel?: () => void;
  fetchData?: Forms.FetchDataFunc<InitiateAparForm>;
  isSaving?: boolean;
}

const SC_ST_OPTIONS = [
  { label: 'Yes', value: 'Yes' as const },
  { label: 'No', value: 'No' as const },
];

export default function InitiateAparForm(props: InitiateAparFormProps) {
  const { register, handleSubmit, control } = useInitiateAparForm(
    props.fetchData
  );

  const onSubmitForm = (data: InitiateAparForm) => {
    props.onSubmit(data, false);
  };

  const onSaveDraftForm = () => {
    handleSubmit(data => props.onSubmit(data, true))();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {/* Employee Information */}
      <FormCard title="Employee Information" icon="user">
        <FormGrid columns={2}>
          <TextBox
            label="Employee Name"
            placeholder="Employee Name"
            {...register('employeeName')}
            required
            disabled
          />

          <TextBox
            label="Designation"
            placeholder="Designation"
            {...register('designation')}
            required
            disabled
          />

          <DatePicker
            label="Date of Birth"
            control={control}
            name="dateOfBirth"
            required
          />

          <SelectCaste
            label="Category"
            defaultOptionText="— Select —"
            {...register('categoryId')}
            control={control}
            required
          />

          <SelectGroup
            label="Group"
            defaultOptionText="— Select —"
            {...register('groupId')}
            control={control}
            required
          />

          <RadioButtonList
            label="Whether Belong to SC/ST?"
            name="belongToScSt"
            control={control}
            options={SC_ST_OPTIONS}
            required
            variant="horizontal"
          />

          <SelectEmployeeType
            label="Whether Permanent / Temporary / Officiating"
            defaultOptionText="— Select —"
            {...register('employmentTypeId')}
            control={control}
            required
          />

          <TextBox
            label="Sections Served (Place of Posting)"
            placeholder="Department / Section name"
            {...register('sectionsServed')}
            required
          />
        </FormGrid>
      </FormCard>

      {/* Validity Dates */}
      <FormCard title="Validity Dates" icon="calendar">
        <FormGrid columns={3}>
          <TextBox
            label="Length of Service Under Reviewing Officer"
            placeholder="e.g. 2 years 4 months"
            {...register('lengthOfServiceUnderReviewingOfficer')}
            required
          />

          <DatePicker
            label="Date of continuous appointment"
            control={control}
            name="dateOfContinuousAppointment"
            required
          />

          <DatePicker
            label="Employee Validity Date"
            control={control}
            name="employeeValidityDate"
            required
          />

          <DatePicker
            label="Reporting Officer Validity Date"
            control={control}
            name="reportingOfficerValidityDate"
            required
          />

          <DatePicker
            label="Reviewing Officer Validity Date"
            control={control}
            name="reviewingOfficerValidityDate"
            required
          />
        </FormGrid>
      </FormCard>

      {/* Form Actions */}
      <div className="initiate-apar-actions">
        <Button
          label="Continue & Forward to Employee"
          type="submit"
          variant="primary"
          icon="arrow-right"
          isLoading={props.isSaving}
        />
        <Button
          label="Save as Draft"
          type="button"
          variant="outlined"
          icon="save"
          onClick={onSaveDraftForm}
        />
        <Button
          label="Cancel"
          type="button"
          variant="outlined"
          icon="times"
          onClick={props.onCancel}
        />
      </div>
    </form>
  );
}
