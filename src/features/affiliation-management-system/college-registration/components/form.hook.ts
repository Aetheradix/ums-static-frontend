import { errors } from 'config/errors';
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

const schema =
  validation.create<AffiliationManagementSystem.CollegeApplicationFormData>(
    o => ({
      collegeName: o
        .string()
        .required()
        .max(200)
        .pattern(expressions.englishOnly)
        .messages({
          [keys.string.pattern]: errors.englishOnly,
        }),
      collegeTypeId: o
        .number()
        .required()
        .messages({ 'number.base': 'Required' }),
      societyName: o
        .string()
        .required()
        .max(200)
        .messages({ 'string.empty': 'Society Name is required' }),
      secretaryName: o
        .string()
        .required()
        .max(100)
        .messages({ 'string.empty': 'Secretary Name is required' }),
      secretaryMobileNo: o
        .string()
        .required()
        .max(10)
        .pattern(/^[0-9]{10}$/)
        .messages({
          'string.empty': 'Secretary Mobile Number is required',
          [keys.string.pattern]: 'Secretary mobile number must be 10 digits',
        }),
      secretaryEmail: o
        .string()
        .required()
        .max(255)
        .email({ tlds: { allow: false } })
        .messages({
          'string.empty': 'Secretary Email ID is required',
          'string.email': 'Please enter a valid email address',
        }),

      principalDirectorName: o.string().optional().allow('', null).max(100),
      principalMobileNo: o
        .string()
        .optional()
        .allow('', null)
        .max(10)
        .pattern(/^[0-9]{10}$/)
        .messages({
          [keys.string.pattern]: 'Principal mobile number must be 10 digits',
        }),
      principalEmail: o
        .string()
        .optional()
        .allow('', null)
        .max(255)
        .email({ tlds: { allow: false } })
        .messages({
          'string.email': 'Please enter a valid email address',
        }),
      collegeEmail: o
        .string()
        .required()
        .max(255)
        .email({ tlds: { allow: false } })
        .messages({
          'string.email': 'Please enter a valid email address',
        }),
      collegeAddress: o.string().required().max(500),
      districtId: o.number().required().messages({ 'number.base': 'Required' }),
      blockTehsil: o.string().required().max(100),
      pinCode: o
        .string()
        .required()
        .pattern(/^[0-9]{6}$/)
        .messages({
          [keys.string.pattern]: 'PIN code must be 6 digits',
        }),
      captcha: o.string().required(),
      declaration: o.boolean().required().invalid(false).messages({
        'any.invalid': 'Please accept the declaration to proceed',
      }),

      stateId: o.number().required().messages({ 'number.base': 'Required' }),

      // Optional/fallback fields to prevent compile errors in other areas
      affiliationTypeId: o.number().optional().allow(null),
      collegeCode: o.string().optional().allow('', null),
      establishmentYear: o.number().optional().allow(null),
      telephoneNo: o.string().optional().allow('', null),
      collegeCategoryId: o.number().optional().allow(null),
      accommodationType: o.string().optional().allow('', null),
      collegeArea: o.string().optional().allow('', null),
      applicationNumber: o.string().optional().allow('', null),
      isSubmitted: o.boolean().optional(),
      affidavitFile: o.any().optional().allow(null),
      regularAuthorityFile: o.any().optional().allow(null),

      educationTypeId: o.number().optional().allow(null),
      authorityNocFile: o.any().optional().allow(null),
      authorityNocDocs: o.array().min(1).required().messages({
        'array.min': 'Please add at least one approval authority NOC document',
        'any.required':
          'Please add at least one approval authority NOC document',
      }),
      applicationFeePaid: o.boolean().optional(),
      feeTransactionRef: o.string().optional().allow('', null),
      feePaidDate: o.string().optional().allow('', null),
    })
  );

export function useCollegeApplicationForm() {
  const methods =
    useAppForm<AffiliationManagementSystem.CollegeApplicationFormData>({
      resolver: validation.resolver(schema),
      mode: 'onChange',
      defaultValues: {
        stateId: 1,
        authorityNocDocs: [],
      },
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
