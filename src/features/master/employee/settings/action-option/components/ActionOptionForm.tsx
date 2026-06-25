import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useActionOptionForm } from './form.hook';

interface ActionOptionFormProps {
  onSubmit: (data: Master.Employee.ActionOptionForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.Employee.ActionOptionForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function ActionOptionForm(props: ActionOptionFormProps) {
  const { register, handleSubmit, reset } = useActionOptionForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Action Option Name"
          subLabel="(In English)"
          placeholder="Enter Action Option Name"
          {...register('name')}
          maxLength={150}
          required
        />

        <TextBox
          label="Description"
          subLabel="(In English)"
          placeholder="Enter Description"
          {...register('description')}
          maxLength={500}
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
