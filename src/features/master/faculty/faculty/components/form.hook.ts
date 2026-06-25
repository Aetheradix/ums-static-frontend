import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.FacultyForm>(o => ({
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
  officeTypeId: o.number().required(),
  departmentId: o.number().required(),
  designationId: o.number().required(),
  joiningDate: o.date().required(),
  mobile: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      [keys.string.pattern]: 'Invalid mobile number',
    }),
  email: o
    .string()
    .required()
    .email({ tlds: { allow: false } }),
  isActive: o.boolean(),
}));

export function useFacultyForm(
  submitCallback: Forms.SubmitFunc<Master.FacultyForm>,
  defaultValues?: Forms.FetchDataFunc<Master.FacultyForm>
) {
  const { register, handleSubmit, reset, control } =
    useAppForm<Master.FacultyForm>({
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
