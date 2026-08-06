import { errors } from 'config/errors';
import Joi from 'joi';
import { useAppForm } from 'shared/hooks/form';
import validation, { expressions, keys } from 'shared/utils/validation';

export const STEP_FIELDS: Record<
  number,
  (keyof AffiliationManagementSystem.CollegeApplicationFormData)[]
> = {
  0: [
    'affiliationTypeId',
    'collegeCode',
    'establishmentYear',
    'collegeName',
    'collegeAddress',
    'stateId',
    'districtId',
    'telephoneNo',
    'collegeEmail',
    'collegeCategoryId',
    'collegeTypeId',
    'accommodationType',
    'collegeArea',
  ],
  1: [
    'principalDirectorName',
    'principalMobileNo',
    'principalEmail',
    'societyName',
    'secretaryName',
    'societyRegistrationNo',
    'societyRegistrationDate',
    'isOtherInstitutionRunning',
  ],
  2: [
    'affidavitFile',
    'regularAuthorityFile',
    'applicationNumber',
    'isSubmitted',
  ],
};

const MAX_FILE_SIZE = 250 * 1024;

const pdfFileValidator = (o: Joi.Root) =>
  o
    .any()
    .custom((value: unknown, helpers: Joi.CustomHelpers) => {
      if (value instanceof File) {
        if (value.type !== 'application/pdf') {
          return helpers.error('any.invalid');
        }
        if (value.size > MAX_FILE_SIZE) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    })
    .messages({
      'any.invalid': 'Invalid file (PDF only, maximum size 250KB)',
    });

const schema =
  validation.create<AffiliationManagementSystem.CollegeApplicationFormData>(
    o => ({
      // Step 1 — College Registration
      affiliationTypeId: o
        .number()
        .required()
        .messages({ 'number.base': 'Required' }),
      collegeCode: o.string().required().max(15),
      establishmentYear: o
        .number()
        .integer()
        .min(1800)
        .max(new Date().getFullYear())
        .required(),
      collegeName: o
        .string()
        .required()
        .max(200)
        .pattern(expressions.englishOnly)
        .messages({
          [keys.string.pattern]: errors.englishOnly,
        }),
      collegeAddress: o.string().required().max(500),
      stateId: o.number().required().messages({ 'number.base': 'Required' }),
      districtId: o.number().required().messages({ 'number.base': 'Required' }),
      telephoneNo: o
        .string()
        .required()
        .max(20)
        .pattern(/^[0-9]{10,15}$/)
        .messages({
          [keys.string.pattern]: 'Telephone number must be 10 to 15 digits',
        }),
      collegeEmail: o
        .string()
        .required()
        .max(255)
        .email({ tlds: { allow: false } })
        .messages({
          'string.email': 'Please enter a valid email address',
        }),
      collegeCategoryId: o
        .number()
        .required()
        .messages({ 'number.base': 'Required' }),
      collegeTypeId: o
        .number()
        .required()
        .messages({ 'number.base': 'Required' }),
      accommodationType: o
        .string()
        .required()
        .max(50)
        .messages({ 'string.base': 'Required' }),
      collegeArea: o
        .string()
        .required()
        .max(500)
        .messages({ 'string.base': 'Required' }),
      applicationNumber: o.string().optional(),
      isSubmitted: o.boolean().optional(),

      // Step 2 — College Affiliation
      affiliationId: o.number().optional(),
      registrationId: o.number().optional(),
      principalDirectorName: o.string().required().max(100),
      principalMobileNo: o
        .string()
        .required()
        .max(10)
        .pattern(/^[0-9]{10}$/)
        .messages({
          [keys.string.pattern]: 'Principal mobile number must be 10 digits',
        }),
      principalEmail: o
        .string()
        .required()
        .max(255)
        .email({ tlds: { allow: false } })
        .messages({
          'string.email': 'Please enter a valid email address',
        }),
      societyName: o.string().required().max(200),
      societyRegistrationNo: o.string().required().max(100),
      secretaryName: o.string().required().max(100),
      societyRegistrationDate: o.date().required(),
      isOtherInstitutionRunning: o
        .boolean()
        .required()
        .messages({ 'boolean.base': 'Required' }),

      // Step 4 — Enclosures
      affidavitFile: pdfFileValidator(o).required(),
      regularAuthorityFile: pdfFileValidator(o).optional().allow(null),
    })
  );

export function useCollegeApplicationForm() {
  const methods =
    useAppForm<AffiliationManagementSystem.CollegeApplicationFormData>({
      resolver: validation.resolver(schema),
      mode: 'onChange',
      defaultValues: {},
    });

  return {
    methods,
    register: methods.register,
    control: methods.control,
    handleSubmit: methods.handleSubmit,
    reset: methods.reset,
    trigger: methods.trigger,
    setValue: methods.setValue,
    resetField: methods.resetField,
  };
}
