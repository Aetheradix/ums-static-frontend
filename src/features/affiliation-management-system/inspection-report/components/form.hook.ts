import Joi from 'joi';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

export interface InspectionReportFormData {
  builtUpArea: string;
  numberOfClassrooms: string;
  classroomSizeStatus: string;
  numberOfLaboratories: string;
  libraryBooksAvailable: string;
  internetBandwidth: string;

  isPrincipalQualified: string;
  areSalariesPaidViaBank: string;
  totalTeachingFaculty: string;
  requiredFaculty: string;
  studentTeacherRatio: string;

  fireSafetyNocValidUpto: Date | null;
  structuralSafetyCertificate: string;
  barrierFreeEnvironment: string;

  evidenceMainBuilding: File | string | null;
  evidenceLaboratories: File | string | null;
  evidenceLibrary: File | string | null;
  evidenceClassrooms: File | string | null;

  finalDecision: string;
  majorDeficiencies: string;
  overallRemarks: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const imageFileValidator = (o: Joi.Root) =>
  o
    .any()
    .custom((value: unknown, helpers: Joi.CustomHelpers) => {
      if (value instanceof File) {
        if (!['image/jpeg', 'image/png'].includes(value.type)) {
          return helpers.error('any.invalid');
        }
        if (value.size > MAX_FILE_SIZE) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    })
    .messages({
      'any.invalid': 'Invalid file (JPG/PNG only, maximum size 2MB)',
    });

const schema = validation.create<InspectionReportFormData>(o => ({
  builtUpArea: o
    .string()
    .required()
    .messages({ 'string.empty': 'Total Built-up Area is required' }),
  numberOfClassrooms: o
    .string()
    .required()
    .messages({ 'string.empty': 'Number of Classrooms is required' }),
  classroomSizeStatus: o
    .string()
    .required()
    .messages({ 'string.empty': 'Classroom Size Status is required' }),
  numberOfLaboratories: o
    .string()
    .required()
    .messages({ 'string.empty': 'Number of Laboratories is required' }),
  libraryBooksAvailable: o
    .string()
    .required()
    .messages({ 'string.empty': 'Library Books Available is required' }),
  internetBandwidth: o
    .string()
    .required()
    .messages({ 'string.empty': 'Internet Facility is required' }),

  isPrincipalQualified: o
    .string()
    .required()
    .messages({ 'string.empty': 'Please select if Principal is qualified' }),
  areSalariesPaidViaBank: o.string().required().messages({
    'string.empty': 'Please select if salaries are paid via Bank',
  }),
  totalTeachingFaculty: o
    .string()
    .required()
    .messages({ 'string.empty': 'Total Teaching Faculty is required' }),
  requiredFaculty: o
    .string()
    .required()
    .messages({ 'string.empty': 'Required Faculty is required' }),
  studentTeacherRatio: o
    .string()
    .required()
    .messages({ 'string.empty': 'Student-Teacher Ratio is required' }),

  fireSafetyNocValidUpto: o.date().allow(null).optional(),
  structuralSafetyCertificate: o.string().allow('', null).optional(),
  barrierFreeEnvironment: o.string().allow('', null).optional(),

  evidenceMainBuilding: imageFileValidator(o).optional().allow(null),
  evidenceLaboratories: imageFileValidator(o).optional().allow(null),
  evidenceLibrary: imageFileValidator(o).optional().allow(null),
  evidenceClassrooms: imageFileValidator(o).optional().allow(null),

  finalDecision: o
    .string()
    .required()
    .messages({ 'string.empty': 'Committee Final Decision is required' }),
  majorDeficiencies: o.string().allow('', null).optional(),
  overallRemarks: o
    .string()
    .required()
    .messages({ 'string.empty': 'Overall Inspector Remarks are required' }),
}));

export function useInspectionReportForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
  } = useAppForm<InspectionReportFormData>({
    resolver: validation.resolver(schema),
    mode: 'onChange',
    defaultValues: {
      fireSafetyNocValidUpto: null,
    },
  });

  return {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
  };
}
