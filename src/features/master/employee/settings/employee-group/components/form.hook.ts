import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.EmployeeGroupForm>(o => ({
  name: o.string().required().max(100).label('Employee Group Name'),
  description: o.string().required().max(250).label('Description'),
}));

export function useEmployeeGroupForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.EmployeeGroupForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.EmployeeGroupForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.EmployeeGroupForm>({
      defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
