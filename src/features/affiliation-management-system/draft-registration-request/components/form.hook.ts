import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

export interface DraftSearchFormData {
  applicationNumber: string;
  establishmentYear: number;
}

const schema = validation.create<DraftSearchFormData>(o => ({
  applicationNumber: o.string().required().max(50).messages({
    'string.empty': 'Application Number is required',
  }),
  establishmentYear: o
    .number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.base': 'Establishment Year is required',
    }),
}));

export function useDraftSearchForm() {
  const { register, control, handleSubmit, formState, watch } =
    useAppForm<DraftSearchFormData>({
      resolver: validation.resolver(schema),
      mode: 'onChange',
      defaultValues: {
        applicationNumber: '',
      },
    });

  return {
    register,
    control,
    handleSubmit,
    watch,
    errors: formState.errors,
    isValid: formState.isValid,
  };
}
