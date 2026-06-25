import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Employee.SubjectSpecializationForm>(
  o => ({
    name: o.string().required().max(150).label('Subject Specialization'),
  })
);

export function useSubjectSpecializationForm(
  submitCallback: Forms.SubmitFunc<Master.Employee.SubjectSpecializationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Employee.SubjectSpecializationForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Employee.SubjectSpecializationForm>({
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
