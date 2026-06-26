import Joi from 'joi';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

export interface ProfileDetailsNoc {
  nocType: string;
  referenceNo: string;
  issueDate: Date | null;
}

export interface ProfileDetailsFormData {
  nocs: ProfileDetailsNoc[];

  builtUpArea: string;
  numberOfClassrooms: string;
  classroomSize: string;
  numberOfLaboratories: string;
  libraryBooksAvailable: string;

  totalLandArea: string;
  totalNumberOfBuildings: string;
  physicalEducationFacility: string;
  hostelFacility: string;
  staffQuarterDetails: string;

  teachingFacultyDetails: string;
  nonTeachingStaffDetails: string;
  coreFacilities: string;
}

const nocSchema = Joi.object({
  nocType: Joi.string()
    .required()
    .messages({ 'string.empty': 'Type required' }),
  referenceNo: Joi.string()
    .required()
    .messages({ 'string.empty': 'Reference No required' }),
  issueDate: Joi.date()
    .required()
    .messages({ 'any.required': 'Date required' }),
});

const schema = validation.create<ProfileDetailsFormData>(o => ({
  nocs: Joi.array()
    .items(nocSchema)
    .min(1)
    .messages({ 'array.min': 'At least one NOC is required' }),

  builtUpArea: o
    .string()
    .required()
    .messages({ 'string.empty': 'Built-up area is required' }),
  numberOfClassrooms: o
    .string()
    .required()
    .messages({ 'string.empty': 'Number of classrooms is required' }),
  classroomSize: o
    .string()
    .required()
    .messages({ 'string.empty': 'Classroom size is required' }),
  numberOfLaboratories: o
    .string()
    .required()
    .messages({ 'string.empty': 'Number of laboratories is required' }),
  libraryBooksAvailable: o
    .string()
    .required()
    .messages({ 'string.empty': 'Library books count is required' }),

  totalLandArea: o
    .string()
    .required()
    .messages({ 'string.empty': 'Total land area is required' }),
  totalNumberOfBuildings: o
    .string()
    .required()
    .messages({ 'string.empty': 'Total number of buildings is required' }),
  physicalEducationFacility: o
    .string()
    .required()
    .messages({ 'string.empty': 'Physical education facility is required' }),
  hostelFacility: o
    .string()
    .required()
    .messages({ 'string.empty': 'Hostel facility is required' }),
  staffQuarterDetails: o
    .string()
    .required()
    .messages({ 'string.empty': 'Staff quarter details is required' }),

  teachingFacultyDetails: o
    .string()
    .required()
    .messages({ 'string.empty': 'Teaching faculty details required' }),
  nonTeachingStaffDetails: o
    .string()
    .required()
    .messages({ 'string.empty': 'Non-teaching staff details required' }),
  coreFacilities: o
    .string()
    .required()
    .messages({ 'string.empty': 'Core facilities details required' }),
}));

export function useProfileDetailsForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
  } = useAppForm<ProfileDetailsFormData>({
    resolver: validation.resolver(schema),
    mode: 'onChange',
    defaultValues: {
      nocs: [{ nocType: '', referenceNo: '', issueDate: null }],
      builtUpArea: '',
      numberOfClassrooms: '',
      classroomSize: '',
      numberOfLaboratories: '',
      libraryBooksAvailable: '',
      totalLandArea: '',
      totalNumberOfBuildings: '',
      physicalEducationFacility: '',
      hostelFacility: '',
      staffQuarterDetails: '',
      teachingFacultyDetails: '',
      nonTeachingStaffDetails: '',
      coreFacilities: '',
    },
  });

  const fieldArray = useFieldArray({
    control,
    name: 'nocs',
  });

  return {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
    fieldArray,
  };
}
