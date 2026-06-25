import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.SubjectMaster.SubjectCategoryForm>(
  o => ({
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
  })
);

export function useSubjectCategoryForm(
  submitCallback: Forms.SubmitFunc<Master.SubjectMaster.SubjectCategoryForm>,
  defaultValues?: Forms.FetchDataFunc<Master.SubjectMaster.SubjectCategoryForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.SubjectMaster.SubjectCategoryForm>({
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
