import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Other.NationalityForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
}));

export function useNationalityForm(
  submitCallback: Forms.SubmitFunc<Master.Other.NationalityForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Other.NationalityForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.Other.NationalityForm>({
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
