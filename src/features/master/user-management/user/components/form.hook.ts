import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<UserManagement.UserForm>(o => ({
  userName: o.string().required().label('User Name'),
  firstName: o.string().required().label('First Name'),
  lastName: o.string().required().label('Last Name'),
  email: o.string().required().email().label('Email'),
  isActive: o.boolean().optional(),
}));

export function useUserForm(
  submitCallback: Forms.SubmitFunc<UserManagement.UserForm>,
  defaultValues?: Forms.FetchDataFunc<UserManagement.UserForm>
) {
  const { register, control, handleSubmit, reset, setValue } =
    useAppForm<UserManagement.UserForm>({
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
    setValue,
  };
}
