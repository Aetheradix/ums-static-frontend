import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

const schema = validation.create<CareerAdvancement.EmployeeSelfAssessmentForm>(
  o => ({
    employeeId: o.number().required(),
    reviewingHeadId: o.number().required().messages({
      'any.required': 'Reporting Officer is required',
      'number.base': 'Reporting Officer is required',
    }),
    sessionId: o.number().required().messages({
      'any.required': 'Session is required',
      'number.base': 'Session is required',
    }),
    tasksProject: o.string().required(),
    workOutputScore: o.number().min(0).max(40).required(),
    workOutputRemark: o.string().allow('', null).optional(),
    leadershipQuality: o.string().required(),
    communicationSkill: o.string().required(),
    integrity: o.string().required(),
    adaptability: o.string().required(),
    teamWork: o.string().required(),
    domainKnowledge: o.string().required(),
    problemSolvingAbility: o.string().required(),
    decisionMaking: o.string().required(),
    analyticalSkill: o.string().required(),
    functionalRemark: o.string().allow('', null).optional(),
    additionalRemarks: o.string().allow('', null).optional(),
    supportingDocument: o
      .object()
      .allow(null, '')
      .custom((value, helpers) => {
        if (value instanceof File) {
          if (value.size > 5 * 1024 * 1024) {
            return helpers.error('any.invalid');
          }
        }
        return value;
      })
      .messages({
        'any.invalid': 'Invalid file (Max 5MB)',
      })
      .optional(),
    status: o.string().required(),
    isActive: o.boolean().optional(),
    selfAssessmentId: o.number().optional(),
  })
);

export function useEmployeeSelfAssessmentForm(
  submitCallback: Forms.SubmitFunc<CareerAdvancement.EmployeeSelfAssessmentForm>,
  fetchData?: Forms.FetchDataFunc<CareerAdvancement.EmployeeSelfAssessmentForm>
) {
  const { register, control, handleSubmit, reset, setValue } =
    useAppForm<CareerAdvancement.EmployeeSelfAssessmentForm>({
      defaultValues: fetchData || {
        employeeId: 1, // Default fallback
        reviewingHeadId: null,
        sessionId: null,
        tasksProject: '',
        workOutputScore: null,
        workOutputRemark: '',
        leadershipQuality: '',
        communicationSkill: '',
        integrity: '',
        adaptability: '',
        teamWork: '',
        domainKnowledge: '',
        problemSolvingAbility: '',
        decisionMaking: '',
        analyticalSkill: '',
        functionalRemark: '',
        additionalRemarks: '',
        supportingDocument: null,
        status: 'Draft',
        isActive: true,
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
