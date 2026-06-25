import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.OfficeTypeForm>(o => ({
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
}));

export function useOfficeTypeForm(
  submitCallback: Forms.SubmitFunc<Master.OfficeTypeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.OfficeTypeForm>
) {
  const { register, handleSubmit, reset } = useAppForm<Master.OfficeTypeForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
