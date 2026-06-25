import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.DivisionForm>(o => ({
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
    .pattern(expressions.alphaNumericOnly)
    .messages({
      [keys.string.pattern]: errors.alphaNumericOnly,
    }),
  stateId: o.number().required(),
}));

export function useDivisionForm(
  submitCallback: Forms.SubmitFunc<Master.DivisionForm>,
  defaultValues?: Forms.FetchDataFunc<Master.DivisionForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.DivisionForm>({
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
