import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.HR.PostForm>(o => ({
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

export function usePostForm(
  submitCallback: Forms.SubmitFunc<Master.HR.PostForm>,
  defaultValues?: Forms.FetchDataFunc<Master.HR.PostForm>
) {
  const { register, handleSubmit, reset } = useAppForm<Master.HR.PostForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
