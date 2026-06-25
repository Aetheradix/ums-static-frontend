import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<Master.Other.AcademicYearForm>(o => ({
  name: o.string().required(),

  session: o.string().required(),
}));

export function useAcademicYearForm(
  submitCallback: Forms.SubmitFunc<Master.Other.AcademicYearForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Other.AcademicYearForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Other.AcademicYearForm>({
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
