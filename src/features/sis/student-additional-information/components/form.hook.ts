import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<SIS.StudentAdditionalInformationForm>(o => ({
  studentId: o.number().required(),
  studentAcademicId: o.number().required(),
  emergencyContactName: o.string().required(),
  emergencyContact: o
    .string()
    .pattern(/^[0-9]+$/)
    .message('Must be digits only')
    .required(),
  emergencyRelation: o.string().required(),
  emailNotification: o.boolean().optional(),
  smsNotification: o.boolean().optional(),
  pushNotification: o.boolean().optional(),
  languagePreferance: o.string().allow('', null).optional(),
  profilePhoto: o
    .any()
    .allow(null)
    .custom((value, helpers) => {
      if (value instanceof File) {
        if (value.size > 100 * 1024) {
          return helpers.error('any.invalid');
        }
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    })
    .messages({
      'any.invalid': 'Invalid file (Max 100KB, .jpg/.png only)',
    })
    .when('profilePhotoUrl', {
      is: o.string().exist(),
      then: o.optional(),
      otherwise: o.required(),
    }),
  profilePhotoUrl: o.string().allow('', null).optional(),
  collegeTypeId: o.number().optional(),
  collegeRegistrationId: o.number().optional(),
  parentUniversity: o.string().allow('', null).optional(),
}));

export function useStudentAdditionalInformationForm(
  submitCallback: Forms.SubmitFunc<SIS.StudentAdditionalInformationForm>,
  fetchData?: Forms.FetchDataFunc<SIS.StudentAdditionalInformationForm>
) {
  const { register, control, handleSubmit, reset, setValue } =
    useAppForm<SIS.StudentAdditionalInformationForm>({
      defaultValues: fetchData || {
        emailNotification: false,
        smsNotification: false,
        pushNotification: false,
      },
      resolver: validation.resolver(schema),
    });

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitCallback),
    reset,
    setValue,
  };
}
