import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Scheme.SchemeTypeForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
}));

export function useSchemeTypeForm(
  submitCallback: Forms.SubmitFunc<Master.Scheme.SchemeTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Scheme.SchemeTypeForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<Master.Scheme.SchemeTypeForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
