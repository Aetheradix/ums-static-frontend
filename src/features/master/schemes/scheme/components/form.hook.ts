import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Scheme.SchemeForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  code: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  schemeTypeId: o.number().required(),
  schemeCategoryId: o.number().required(),
}));

export function useSchemeForm(
  submitCallback: Forms.SubmitFunc<Master.Scheme.SchemeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Scheme.SchemeForm>
) {
  const { register, handleSubmit, reset, control, watch } =
    useAppForm<Master.Scheme.SchemeForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
    watch,
  };
}
