import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<Master.Other.ProgrammeForm>(o => ({
  name: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
  programmeDuration: o.string().required(),
  degreeLevelId: o.number().required(),
}));

export function useProgrammeForm(
  submitCallback: Forms.SubmitFunc<Master.Other.ProgrammeForm>,
  defaultValues?: Forms.FetchDataFunc<Master.Other.ProgrammeForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<Master.Other.ProgrammeForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
