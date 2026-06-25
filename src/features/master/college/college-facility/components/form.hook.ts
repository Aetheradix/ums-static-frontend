import { errors } from 'config/errors';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

const schema = validation.create<CollegeMaster.AvailableFacilityForm>(o => ({
  facilityName: o
    .string()
    .required()
    .pattern(expressions.englishOnly)
    .messages({
      [keys.string.pattern]: errors.englishOnly,
    }),
}));

export function useAvailableFacilityForm(
  submitCallback: Forms.SubmitFunc<CollegeMaster.AvailableFacilityForm>,
  defaultValues?: Forms.FetchDataFunc<CollegeMaster.AvailableFacilityForm>
) {
  const { register, handleSubmit, reset } =
    useAppForm<CollegeMaster.AvailableFacilityForm>({
      defaultValues: defaultValues,
      resolver: validation.resolver(schema),
    });

  return {
    register,
    handleSubmit: handleSubmit(submitCallback),
    reset,
  };
}
