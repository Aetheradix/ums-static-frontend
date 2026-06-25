import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { usePostForm } from './form.hook';

interface PostFormProps {
  onSubmit: (data: Master.HR.PostForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<Master.HR.PostForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
}

export default function PostForm(props: PostFormProps) {
  const { register, handleSubmit, reset } = usePostForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <TextBox
          label="Name"
          subLabel="(In English)"
          placeholder="Enter Post Name"
          {...register('name')}
          maxLength={100}
          required
        />
        <TextBox
          label="Code"
          subLabel="(Post Code)"
          placeholder="Enter Post Code"
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
