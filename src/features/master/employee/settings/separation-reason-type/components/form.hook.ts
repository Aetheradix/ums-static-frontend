import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.SeparationReasonTypeForm>(
  o => ({
    name: o.string().required().max(150).label('Separation Reason Name'),

    type: o.string().required().max(20).label('type'),
  })
);

export function useSeparationReasonTypeForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.SeparationReasonTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.SeparationReasonTypeForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.SeparationReasonTypeForm>({
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
