import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<CollegeMaster.CollegeCategoryForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  collegeTypeId: o.number().required(),
}));

export function useCollegeCategoryForm(
  submitCallback: Forms.SubmitFunc<CollegeMaster.CollegeCategoryForm>,
  defaultValues?: Forms.FetchDataFunc<CollegeMaster.CollegeCategoryForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<CollegeMaster.CollegeCategoryForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
