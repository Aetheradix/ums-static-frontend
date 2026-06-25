import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema =
  validation.create<Master.SubjectMaster.ProgrammeModeOfEducationForm>(o => ({
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

export function useProgrammeModeOfEducationForm(
  submitCallback: Forms.SubmitFunc<Master.SubjectMaster.ProgrammeModeOfEducationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.SubjectMaster.ProgrammeModeOfEducationForm>
) {
  const { register, control, handleSubmit, reset } =
    useAppForm<Master.SubjectMaster.ProgrammeModeOfEducationForm>({
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
