import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<UserManagement.RolePermissionCreate>(o => ({
  roleName: o.string().required().label('Role'),
  domain: o.string().required().label('Domain'),
  feature: o.string().required().label('Feature'),
  action: o.string().required().label('Action (Right)'),
}));

export function useRolePermissionForm(
  submitCallback: Forms.SubmitFunc<UserManagement.RolePermissionCreate>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.RolePermissionCreate>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<UserManagement.RolePermissionCreate>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
