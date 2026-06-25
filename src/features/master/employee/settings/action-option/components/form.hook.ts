import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.ActionOptionForm>(o => ({
  name: o.string().required().max(150).label('Action Option Name'),

  description: o.string().required().max(500).label('Description'),
}));

export function useActionOptionForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.ActionOptionForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.ActionOptionForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.ActionOptionForm>({
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
