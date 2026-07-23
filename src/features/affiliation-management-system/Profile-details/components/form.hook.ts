import Joi from 'joi';
import { useFieldArray } from 'react-hook-form';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

export interface ProfileDetailsNoc {
  status: string;
  nocType: string;
  referenceNo: string;
  issueDate: Date | null;
  document: any;
}

export interface AcademicProgramme {
  mode: string;
  courseLevel: string;
  facultyDept: string;
  programmeName: string;
  duration: string;
  appliedYear: string;
}

export interface ProfileDetailsFormData {
  applicationNumber: string;
  nameOfCollege: string;
  nocs: ProfileDetailsNoc[];

  totalLandArea: string;
  totalNumberOfBuildings: string;
  physicalEducationFacility: string;
  hostelFacility: string;

  boysHostelsCount: string;
  girlsHostelsCount: string;
  totalCapacity: string;

  existingProgrammes: AcademicProgramme[];
  proposedProgrammes: AcademicProgramme[];

  teachingFacultyDetails: string;
  nonTeachingStaffDetails: string;
  coreFacilities: string;
}

const nocSchema = Joi.object({
  status: Joi.string()
    .required()
    .messages({ 'string.empty': 'Status required' }),
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

const programmeSchema = Joi.object({
  mode: Joi.string().required().messages({ 'string.empty': 'Mode required' }),
  courseLevel: Joi.string()
    .required()
    .messages({ 'string.empty': 'Course Level required' }),
  facultyDept: Joi.string()
    .required()
    .messages({ 'string.empty': 'Faculty/Dept required' }),
  programmeName: Joi.string()
    .required()
    .messages({ 'string.empty': 'Programme Name required' }),
  duration: Joi.string()
    .required()
    .messages({ 'string.empty': 'Duration required' }),
  appliedYear: Joi.string()
    .required()
    .messages({ 'string.empty': 'Applied Year required' }),
});

const schema = validation.create<ProfileDetailsFormData>(o => ({
  applicationNumber: o
    .string()
    .required()
    .messages({ 'string.empty': 'Application Number required' }),
  nameOfCollege: o
    .string()
    .required()
    .messages({ 'string.empty': 'Name of College required' }),
  nocs: Joi.array().items(nocSchema),

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

  boysHostelsCount: o.string().allow('', null),
  girlsHostelsCount: o.string().allow('', null),
  totalCapacity: o.string().allow('', null),

  existingProgrammes: Joi.array().items(programmeSchema),
  proposedProgrammes: Joi.array().items(programmeSchema),

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
      applicationNumber: 'APP-2026-9021',
      nameOfCollege: 'Global Institute of Technology',
      nocs: [
        {
          status: 'yes',
          nocType: '',
          referenceNo: '',
          issueDate: null,
          document: null,
        },
      ],
      totalLandArea: '',
      totalNumberOfBuildings: '',
      physicalEducationFacility: '',
      hostelFacility: '',
      boysHostelsCount: '',
      girlsHostelsCount: '',
      totalCapacity: '',
      existingProgrammes: [
        {
          mode: '',
          courseLevel: '',
          facultyDept: '',
          programmeName: '',
          duration: '',
          appliedYear: '',
        },
      ],
      proposedProgrammes: [],
      teachingFacultyDetails: '',
      nonTeachingStaffDetails: '',
      coreFacilities: '',
    },
  });

  const nocsArray = useFieldArray({ control, name: 'nocs' });
  const existingProgrammesArray = useFieldArray({
    control,
    name: 'existingProgrammes',
  });
  const proposedProgrammesArray = useFieldArray({
    control,
    name: 'proposedProgrammes',
  });

  return {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
    nocsArray,
    existingProgrammesArray,
    proposedProgrammesArray,
  };
}
