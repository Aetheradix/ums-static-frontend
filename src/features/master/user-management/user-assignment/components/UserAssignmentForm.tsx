import { FormActions, FormGrid } from 'shared/new-components';
import SelectDomain from '../../components/SelectDomain';
import SelectRoles from '../../components/SelectRoles';
import SelectUsers from '../../components/SelectUsers';
import { useUserAssignmentForm } from './form.hook';

interface UserAssignmentFormProps {
  onSubmit: (data: UserManagement.UserAssignmentForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<UserManagement.UserAssignmentForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

export default function UserAssignmentForm(props: UserAssignmentFormProps) {
  const { register, handleSubmit, reset } = useUserAssignmentForm(
    props.onSubmit,
    props.fetchData
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={props.columns ?? 4}>
        <SelectUsers
          required
          disabled={props.isEditMode}
          {...register('userId')}
        />
        <SelectRoles required {...register('roleName')} />
        <SelectDomain required {...register('domain')} />
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
