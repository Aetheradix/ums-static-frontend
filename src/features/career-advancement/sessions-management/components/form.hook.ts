import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<CareerAdvancement.Session.SessionForm>(o => ({
  sessionName: o.string().required().max(100),
  sessionType: o.string().required(),
  startDateTime: o.date().required(),
  endDateTime: o.date().required(),
  appStatus: o.string().required(),
  sessionFrom: o.date().required(),
  sessionTo: o.date().required(),
}));

export function useSessionForm(
  submitCallback: Forms.SubmitFunc<CareerAdvancement.Session.SessionForm>,
  defaultValues?: Forms.FetchDataFunc<CareerAdvancement.Session.SessionForm>
) {
  const { register, handleSubmit, reset, control } =
    useAppForm<CareerAdvancement.Session.SessionForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
  };
}
