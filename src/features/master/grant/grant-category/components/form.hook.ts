import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Grant.GrantCategoryForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  grantTypeId: o.number().required(),
}));

export function useGrantCategoryForm(
  submitCallback: Forms.SubmitFunc<Master.Grant.GrantCategoryForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Grant.GrantCategoryForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<Master.Grant.GrantCategoryForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
