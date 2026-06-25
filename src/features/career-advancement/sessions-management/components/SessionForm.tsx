import SelectSessionAppStatus from 'features/components/SelectSessionAppStatus';
import SelectSessionType from 'features/components/SelectSessionType';
import { DatePicker, TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useSessionForm } from './form.hook';

interface SessionFormProps {
  onSubmit: (data: CareerAdvancement.Session.SessionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<CareerAdvancement.Session.SessionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function SessionForm(props: SessionFormProps) {
  const { register, handleSubmit, reset, control } = useSessionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Session Name"
          placeholder="Enter session name"
          {...register('sessionName')}
          maxLength={100}
          required
        />

        <SelectSessionType {...register('sessionType')} control={control} />

        <DatePicker
          label="Start Date & Time"
          control={control}
          name="startDateTime"
          showTime
          hourFormat="12"
          required
        />

        <DatePicker
          label="End Date & Time"
          control={control}
          name="endDateTime"
          showTime
          hourFormat="12"
          required
        />

        <SelectSessionAppStatus {...register('appStatus')} control={control} />

        <DatePicker
          label="Session From"
          control={control}
          name="sessionFrom"
          required
        />

        <DatePicker
          label="Session To"
          control={control}
          name="sessionTo"
          required
        />
      </FormGrid>

      <FormActions
        isEditMode={props.isEditMode}
        isLoading={props.isSaving}
        onSave={handleSubmit}
        onReset={reset}
      />
    </form>
  );
}
