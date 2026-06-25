import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.DocumentOptionsForm>(o => ({
  name: o.string().required().max(50).label('Document Option'),
}));

export function useDocumentOptionForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.DocumentOptionsForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.DocumentOptionsForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.DocumentOptionsForm>({
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
