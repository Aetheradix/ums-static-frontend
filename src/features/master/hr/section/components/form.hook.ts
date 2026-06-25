import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.HR.SectionForm>(o => ({
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

export function useSectionForm(
  submitCallback: Forms.SubmitFunc<Master.HR.SectionForm>,
  defaultValues?: Forms.FetchDataFunc<Master.HR.SectionForm>
) {
  const { register, handleSubmit, reset } = useAppForm<Master.HR.SectionForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
