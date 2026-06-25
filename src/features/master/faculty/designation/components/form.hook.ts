import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.DesignationForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
}));

export function useDesignationForm(
  submitCallback: Forms.SubmitFunc<Master.DesignationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.DesignationForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.DesignationForm>({
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
