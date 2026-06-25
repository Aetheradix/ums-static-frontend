import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Other.EstablishmentYearForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.numericOnly)
    .messages({
      [keys.string.pattern]: errors.numericOnly,
    }),
}));

export function useEstablishmentYearForm(
  submitCallback: Forms.SubmitFunc<Master.Other.EstablishmentYearForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Other.EstablishmentYearForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<Master.Other.EstablishmentYearForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
