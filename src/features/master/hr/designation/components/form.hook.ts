import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.HR.DesignationForm>(o => ({
  classId: o.number().required(),
  postId: o.number().required(),
  designationTypeId: o.number().required(),
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
  sequenceNumber: o.number().required(),
}));

export function useDesignationForm(
  submitCallback: Forms.SubmitFunc<Master.HR.DesignationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.HR.DesignationForm>
) {
  const { register, handleSubmit, reset, control } =
    useAppForm<Master.HR.DesignationForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    control,
  };
}
