import { useEffect, useState, useCallback } from 'react';
import { useForm, type Path } from 'react-hook-form';
import validation from 'shared/utils/validation';
import { getStudentApplicationService } from 'shared/di';
import type { ApplicationFormData, MasterLookups } from '../types';
import type { StudentApplicationService } from '../services/StudentApplicationService';

const priorEducationEntrySchema = validation.create<any>(o => ({
  educationLevel: o.string().required(),
  institutionName: o.string().required().max(150),
  boardOrUniversity: o.string().required().max(150),
  passingYear: o
    .number()
    .required()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  percentage: o.number().allow(null).min(0).max(100).optional(),
  cgpa: o.number().allow(null).min(0).max(10).optional(),
  subjectsOrStream: o.string().required().max(100),
  documentType: o.string().required().max(50),
  documentFile: o.any().optional().allow(null),
  documentId: o.string().required().messages({
    'string.empty': 'Please upload a marksheet or certificate for this entry.',
    'any.required': 'Please upload a marksheet or certificate for this entry.',
  }),
}));

const schema = validation.create<ApplicationFormData>(o => ({
  academicSession: o.any().required(),
  programme: o.any().required(),

  firstName: o.string().required().max(45),
  middleName: o.string().allow('', null).optional().max(45),
  lastName: o.string().required().max(45),
  email: o.string().required().email({ tlds: false }).max(30),
  phone: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
  gender: o.any().required(),
  caste: o.any().required(),
  dateOfBirth: o.date().required(),
  age: o.number().required().min(1).max(120),
  fatherName: o.string().required().max(45),
  fatherOccupation: o.any().required(),
  fatherDesignation: o.any().required(),
  fatherAnnualIncome: o.number().required().min(0),
  fatherContactNumber: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Father contact number must be 10 digits',
    }),
  motherName: o.string().required().max(45),
  motherOccupation: o.any().required(),
  motherDesignation: o.any().required(),
  motherAnnualIncome: o.number().required().min(0),
  motherContactNumber: o
    .string()
    .required()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Mother contact number must be 10 digits',
    }),
  residencyStatus: o.any().required(),
  ethnicity: o.string().required().max(20),
  nationality: o.any().required(),

  degreeLevel: o.any().required(),
  programOfStudy: o.any().required(),
  specialisation: o.any().required(),

  priorEducations: o
    .array()
    .items(priorEducationEntrySchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one prior education record is required.',
      'any.required': 'At least one prior education record is required.',
    }),

  addressType: o.any().required(),
  country: o.string().required().max(20),
  state: o.any().required(),
  division: o.any().required(),
  district: o.any().required(),
  tehsil: o.any().required(),
  block: o.any().required(),
  addressLine1: o.string().required().max(150),
  addressLine2: o.string().required().max(150),
  landmark: o.string().required().max(40),
  zipcode: o.number().required().max(2147483647),
  choiceFilling: o.array().items(o.any()).min(1).required().messages({
    'array.min':
      'Please lock at least one choice before proceeding to the next step.',
    'any.required':
      'Please lock at least one choice before proceeding to the next step.',
  }),
}));

export function useApplicationForm() {
  const [service] = useState<StudentApplicationService>(() =>
    getStudentApplicationService()
  );
  const [lookups, setLookups] = useState<MasterLookups | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ApplicationFormData>({
    mode: 'onSubmit',
    resolver: validation.resolver(schema),
    defaultValues: {
      priorEducations: [],
    },
    shouldFocusError: false,
  });

  useEffect(() => {
    async function init() {
      const [lookupsData, draft] = await Promise.all([
        service.getLookups(),
        service.loadDraft(),
      ]);
      setLookups(lookupsData);
      if (draft) {
        methods.reset(draft);
      }
      setDraftLoaded(true);
    }
    init();
  }, [service, methods]);

  const saveDraft = useCallback(async () => {
    const data = methods.getValues();
    await service.saveDraft(data);
  }, [service, methods]);

  const onSubmit = useCallback(
    async (
      data: ApplicationFormData
    ): Promise<{ applicationId: number } | null> => {
      if (!lookups) return null;
      setIsSubmitting(true);
      try {
        return await service.submitApplication(data, lookups);
      } finally {
        setIsSubmitting(false);
      }
    },
    [service, lookups]
  );

  function register(key: Path<ApplicationFormData>) {
    return { control: methods.control, name: key };
  }

  return {
    methods,
    register,
    lookups,
    draftLoaded,
    isSubmitting,
    saveDraft,
    onSubmit,
  };
}
