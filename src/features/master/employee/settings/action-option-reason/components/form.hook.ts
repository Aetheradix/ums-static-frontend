import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.ActionOptionReasonForm>(o => ({
  actionOptionId: o.number().required(),
  name: o.string().required().max(100).label('Reason'),
  description: o.string().required().max(200),
  isActive: o.boolean(),
}));

export function useActionOptionReasonForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.ActionOptionReasonForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.ActionOptionReasonForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.ActionOptionReasonForm>({
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
