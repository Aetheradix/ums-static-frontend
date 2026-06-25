import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.TravelPurposeForm>(o => ({
  name: o.string().required().max(255).label('Travel Purpose'),
}));

export function useTravelPurposeForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.TravelPurposeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.TravelPurposeForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.TravelPurposeForm>({
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
