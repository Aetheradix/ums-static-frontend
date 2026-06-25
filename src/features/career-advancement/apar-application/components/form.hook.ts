import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

type InitiateAparForm = CareerAdvancement.AparApplication.InitiateAparForm;

const schema = validation.create<InitiateAparForm>(o => ({
  employeeName: o.string().required().max(200),
  designation: o.string().required().max(200),
  dateOfBirth: o.date().required(),
  categoryId: o.number().required(),
  groupId: o.string().required(),
  belongToScSt: o.string().required(),
  employmentTypeId: o.string().required(),
  sectionsServed: o.string().required().max(300),
  lengthOfServiceUnderReviewingOfficer: o.string().required().max(100),
  dateOfContinuousAppointment: o.date().required(),
  employeeValidityDate: o.date().required(),
  reportingOfficerValidityDate: o.date().required(),
  reviewingOfficerValidityDate: o.date().required(),
}));

export function useInitiateAparForm(
  defaultValues?: Forms.FetchDataFunc<InitiateAparForm>
) {
  const { register, handleSubmit, control } = useAppForm<InitiateAparForm>({
    defaultValues: defaultValues,
    resolver: validation.resolver(schema),
  });

  return {
    register,
    handleSubmit,
    control,
  };
}
