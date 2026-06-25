import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<UserManagement.UserRoleForm>(o => ({
  name: o.string().required().label('Role Name'),
  description: o.string().required().label('Description'),
  isActive: o.boolean().optional(),
}));

export function useRoleForm(
  submitCallback: Forms.SubmitFunc<UserManagement.UserRoleForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.UserRoleForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<UserManagement.UserRoleForm>({
      defaultValues: defaultValues ?? {
        isActive: true,
      },
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
