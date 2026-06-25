import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Other.SpecialisationForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  programmeId: o.number().required(),
}));

export function useSpecialisationForm(
  submitCallback: Forms.SubmitFunc<Master.Other.SpecialisationForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Other.SpecialisationForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<Master.Other.SpecialisationForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
