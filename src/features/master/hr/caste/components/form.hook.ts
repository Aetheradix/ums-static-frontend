import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.HR.CasteForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
}));

export function useCasteForm(
  submitCallback: Forms.SubmitFunc<Master.HR.CasteForm>,
  defaultValues?: Master.HR.CasteForm
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.HR.CasteForm>({
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
