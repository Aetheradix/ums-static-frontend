import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.EmploymentNatureForm>(o => ({
  name: o.string().required().max(50).label('Nature of Employment'),
}));

export function useEmploymentNatureForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.EmploymentNatureForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.EmploymentNatureForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.EmploymentNatureForm>({
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
