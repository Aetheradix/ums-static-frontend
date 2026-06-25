import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Scheme.SchemeCategoryForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  schemeTypeId: o.number().required(),
}));

export function useSchemeCategoryForm(
  submitCallback: Forms.SubmitFunc<Master.Scheme.SchemeCategoryForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Scheme.SchemeCategoryForm>
) {
  const { register, handleSubmit, reset, control } =
    useAppForm<Master.Scheme.SchemeCategoryForm>({
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
