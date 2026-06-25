import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.SubjectMaster.SubjectForm>(o => ({
  subjectName: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  subjectCode: o
    .string()
    .required()
    .pattern(expressions.alphaNumericOnly)
    .messages({
      [keys.string.pattern]: errors.alphaNumericOnly,
    }),
  categoryId: o.number().required(),
}));

export function useSubjectForm(
  submitCallback: Forms.SubmitFunc<Master.SubjectMaster.SubjectForm>,
  defaultValues?: Forms.FetchDataFunc<Master.SubjectMaster.SubjectForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.SubjectMaster.SubjectForm>({
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
