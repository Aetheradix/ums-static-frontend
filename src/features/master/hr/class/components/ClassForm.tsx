import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useClassForm } from './form.hook';

interface ClassFormProps {
  onSubmit: (data: Master.HR.ClassForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.HR.ClassForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ClassForm(props: ClassFormProps) {
  const { register, handleSubmit, reset } = useClassForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Class Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Code"
          subLabel="(Class Code)"
          placeholder="Enter Class Code"
          {...register('code')}
          maxLength={50}
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
