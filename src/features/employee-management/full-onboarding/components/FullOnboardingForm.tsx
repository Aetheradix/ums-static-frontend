import {
  DatePicker,
  DropDownList,
  FormWizard,
  NumberBox,
  Switch,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormCard, FormGrid } from 'shared/new-components';
import {
  mockBlocks,
  mockBloodGroups,
  mockCastes,
  mockDegreeLevels,
  mockDesignations,
  mockDistricts,
  mockDivisions,
  mockGenders,
  mockMaritalStatus,
  mockNationalities,
  mockNatureOfEmployment,
  mockOrgUnits,
  mockPosts,
  mockRelationships,
  mockReligions,
  mockSalutations,
  mockServiceCadres,
  mockSpecializations,
  mockStates,
  mockTehsils,
  mockYesNo,
} from '../../mockData';
import { emptyQualification, useFullOnboardingForm } from './form.hook';

interface Props {
  onSubmit: Forms.SubmitFunc<EmployeeManagement.FullOnboardingForm>;
  isSaving: boolean;
}

export default function FullOnboardingForm(props: Props) {
  const { handleSubmit, reset, register, watch, trigger, setValue } =
    useFullOnboardingForm(props.onSubmit);

  const isSameAsCurrentAddress = watch('isSameAsCurrentAddress');
  const qualifications = watch('qualifications') || [];

  const handleSameAddressToggle = (checked: boolean) => {
    setValue('isSameAsCurrentAddress', checked);

    if (checked) {
      const snapshot = watch('currentAddress');
      setValue('permanentAddress', {
        ...snapshot,
        addressType: 'Permanent',
      });
    }
  };

  const addQualification = () => {
    setValue('qualifications', [...qualifications, { ...emptyQualification }]);
  };

  const removeQualification = (index: number) => {
    if (qualifications.length <= 1) return;
    const updated = qualifications.filter((_, i) => i !== index);
    setValue('qualifications', updated);
  };

  const steps: WizardStep[] = [
    // ═══════════════════════════════
    //  STEP 1 – Employee (Quick Core)
    // ═══════════════════════════════
    {
      label: 'Employee (Core)',
      icon: 'user',
      content: (
        <div className="flex flex-col gap-6">
          <FormCard title="Employee Personal Information" icon="user">
            <FormGrid columns={3}>
              <DropDownList
                {...register('salutation')}
                label="Salutation"
                placeholder="Select Salutation"
                data={mockSalutations}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('firstName')}
                label="First Name"
                placeholder="Enter first name"
                maxLength={50}
                required
              />

              <TextBox
                {...register('middleName')}
                label="Middle Name"
                placeholder="Enter middle name"
                maxLength={50}
              />

              <TextBox
                {...register('lastName')}
                label="Last Name"
                placeholder="Enter last name"
                maxLength={50}
                required
              />

              <DropDownList
                {...register('gender')}
                label="Gender"
                placeholder="Select Gender"
                data={mockGenders}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('casteId')}
                label="Caste"
                placeholder="Select Caste"
                data={mockCastes}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('mobileNumber')}
                label="Mobile Number"
                placeholder="Enter mobile number"
                maxLength={10}
                required
              />

              <TextBox
                {...register('officialEmail')}
                label="Official Email"
                placeholder="Enter official email"
                maxLength={100}
                required
              />

              <DatePicker
                {...register('dateOfBirth')}
                label="Date of Birth"
                placeholder="Select date of birth"
                required
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Employee Information" icon="briefcase">
            <FormGrid columns={3}>
              <DropDownList
                {...register('employeeType')}
                label="Employee Type"
                placeholder="Select Employee Type"
                data={mockServiceCadres}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('employeeNatureId')}
                label="Nature of Employment"
                placeholder="Select Nature of Employment"
                data={mockNatureOfEmployment}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('organizationUnitId')}
                label="Organization Unit"
                placeholder="Select Organization Unit"
                data={mockOrgUnits}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('postId')}
                label="Post"
                placeholder="Select Post"
                data={mockPosts}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('designationId')}
                label="Designation"
                placeholder="Select Designation"
                data={mockDesignations}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('subjectSpecializationId')}
                label="Subject Specialization"
                placeholder="Select Subject Specialization"
                data={mockSpecializations}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('seniorityRank')}
                label="Seniority Rank"
                placeholder="Enter seniority rank"
                maxLength={20}
              />

              <TextBox
                {...register('employeeCode')}
                label="Employee Code"
                placeholder="Enter employee code"
                maxLength={50}
                required
              />

              <DatePicker
                {...register('dateOfJoining')}
                label="Date of Joining"
                placeholder="Select date of joining"
                required
              />
            </FormGrid>
          </FormCard>
        </div>
      ),
    },

    // ═══════════════════════════════
    //  STEP 2 – Extended Details
    // ═══════════════════════════════
    {
      label: 'Extended Details',
      icon: 'id-card',
      content: (
        <div className="flex flex-col gap-6">
          <FormCard title="Personal & Family" icon="users">
            <FormGrid columns={3}>
              <DropDownList
                {...register('bloodGroup')}
                label="Blood Group"
                placeholder="Select Blood Group"
                data={mockBloodGroups}
                textField="name"
                valueField="id"
              />

              <DropDownList
                {...register('maritalStatus')}
                label="Marital Status"
                placeholder="Select Marital Status"
                data={mockMaritalStatus}
                textField="name"
                valueField="id"
              />

              <DropDownList
                {...register('nationalityId')}
                label="Nationality"
                placeholder="Select Nationality"
                data={mockNationalities}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('religionId')}
                label="Religion"
                placeholder="Select Religion"
                data={mockReligions}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('isPersonWithDisability')}
                label="Person with Disability (PwBD)"
                placeholder="Select Person with Disability (PwBD)"
                data={mockYesNo}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('fatherName')}
                label="Father's Name"
                placeholder="Enter father's name"
                maxLength={150}
              />

              <TextBox
                {...register('motherName')}
                label="Mother's Name"
                placeholder="Enter mother's name"
                maxLength={150}
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Contact Details" icon="phone">
            <FormGrid columns={3}>
              <TextBox
                {...register('personalEmail')}
                label="Personal Email"
                placeholder="Enter personal email"
                maxLength={50}
              />

              <TextBox
                {...register('alternateMobileNumber')}
                label="Alternate Mobile"
                placeholder="Enter alternate mobile"
                maxLength={10}
              />

              <TextBox
                {...register('officePhoneNumber')}
                label="Office Phone"
                placeholder="Enter office phone"
                maxLength={10}
              />

              <TextBox
                {...register('personalWebsite')}
                label="Personal Website"
                placeholder="Enter website URL"
                maxLength={255}
              />

              <div className="col-span-full">
                <TextArea
                  {...register('bioNote')}
                  label="Bio Note"
                  placeholder="Enter bio note"
                  rows={3}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="Emergency Contact" icon="exclamation-triangle">
            <FormGrid columns={3}>
              <TextBox
                {...register('emergencyContactName')}
                label="Emergency Contact Name"
                placeholder="Enter emergency contact name"
                maxLength={100}
                required
              />

              <DropDownList
                {...register('emergencyRelation')}
                label="Emergency Relation"
                placeholder="Select Emergency Relation"
                data={mockRelationships}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('emergencyPhoneNumber')}
                label="Emergency Mobile"
                placeholder="Enter emergency phone"
                maxLength={10}
                required
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Statutory Documents" icon="file">
            <FormGrid columns={3}>
              <TextBox
                {...register('aadharNumber')}
                label="Aadhaar Number"
                placeholder="Enter 12-digit Aadhaar"
                maxLength={12}
                required
              />

              <TextBox
                {...register('panNumber')}
                label="PAN Number"
                placeholder="Enter PAN"
                maxLength={10}
              />

              <TextBox
                {...register('uanNumber')}
                label="UAN / PF Number"
                placeholder="Enter UAN"
                maxLength={100}
              />

              <TextBox
                {...register('drivingLicense')}
                label="Driving License"
                placeholder="Enter driving license"
                maxLength={100}
              />

              <TextBox
                {...register('passportNumber')}
                label="Passport Number"
                placeholder="Enter passport number"
                maxLength={100}
              />

              <DatePicker
                {...register('passportValidity')}
                label="Passport Validity"
                placeholder="Select passport validity"
              />
            </FormGrid>
          </FormCard>
        </div>
      ),
    },

    // ═══════════════════════════════
    //  STEP 3 – Address Details
    // ═══════════════════════════════
    {
      label: 'Address Details',
      icon: 'map-marker',
      content: (
        <div className="flex flex-col gap-6">
          <FormCard title="Current Address" icon="home">
            <FormGrid columns={3}>
              <TextBox
                {...register('currentAddress.addressLine1')}
                label="Address Line 1"
                placeholder="Enter address line 1"
                maxLength={255}
                required
              />

              <TextBox
                {...register('currentAddress.addressLine2')}
                label="Address Line 2"
                placeholder="Enter address line 2"
                maxLength={255}
              />

              <TextBox
                {...register('currentAddress.city')}
                label="City"
                placeholder="Enter city"
                maxLength={100}
                required
              />

              <DropDownList
                {...register('currentAddress.stateId')}
                label="State"
                placeholder="Select State"
                data={mockStates}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('currentAddress.divisionId')}
                label="Division"
                placeholder="Select Division"
                data={mockDivisions}
                textField="name"
                valueField="id"
              />

              <DropDownList
                {...register('currentAddress.districtId')}
                label="District"
                placeholder="Select District"
                data={mockDistricts}
                textField="name"
                valueField="id"
                required
              />

              <DropDownList
                {...register('currentAddress.tehsilId')}
                label="Tehsil"
                placeholder="Select Tehsil"
                data={mockTehsils}
                textField="name"
                valueField="id"
              />

              <DropDownList
                {...register('currentAddress.blockId')}
                label="Block"
                placeholder="Select Block"
                data={mockBlocks}
                textField="name"
                valueField="id"
              />

              <TextBox
                {...register('currentAddress.pinCode')}
                label="PIN Code"
                placeholder="Enter PIN code"
                maxLength={10}
                required
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Permanent Address" icon="map">
            <FormGrid columns={3}>
              <div className="col-span-full">
                <Switch
                  {...register('isSameAsCurrentAddress')}
                  label="Same as Current Address"
                  onChange={handleSameAddressToggle}
                />
              </div>

              {!isSameAsCurrentAddress && (
                <>
                  <TextBox
                    {...register('permanentAddress.addressLine1')}
                    label="Address Line 1"
                    placeholder="Enter address line 1"
                    maxLength={255}
                    required
                  />

                  <TextBox
                    {...register('permanentAddress.addressLine2')}
                    label="Address Line 2"
                    placeholder="Enter address line 2"
                    maxLength={255}
                  />

                  <TextBox
                    {...register('permanentAddress.city')}
                    label="City"
                    placeholder="Enter city"
                    maxLength={100}
                    required
                  />

                  <DropDownList
                    {...register('permanentAddress.stateId')}
                    label="State"
                    placeholder="Select State"
                    data={mockStates}
                    textField="name"
                    valueField="id"
                    required
                  />

                  <DropDownList
                    {...register('permanentAddress.divisionId')}
                    label="Division"
                    placeholder="Select Division"
                    data={mockDivisions}
                    textField="name"
                    valueField="id"
                  />

                  <DropDownList
                    {...register('permanentAddress.districtId')}
                    label="District"
                    placeholder="Select District"
                    data={mockDistricts}
                    textField="name"
                    valueField="id"
                    required
                  />

                  <DropDownList
                    {...register('permanentAddress.tehsilId')}
                    label="Tehsil"
                    placeholder="Select Tehsil"
                    data={mockTehsils}
                    textField="name"
                    valueField="id"
                  />

                  <DropDownList
                    {...register('permanentAddress.blockId')}
                    label="Block"
                    placeholder="Select Block"
                    data={mockBlocks}
                    textField="name"
                    valueField="id"
                  />

                  <TextBox
                    {...register('permanentAddress.pinCode')}
                    label="PIN Code"
                    placeholder="Enter PIN code"
                    maxLength={10}
                    required
                  />
                </>
              )}
            </FormGrid>
          </FormCard>
        </div>
      ),
    },

    // ═══════════════════════════════
    //  STEP 4 – Qualifications
    // ═══════════════════════════════
    {
      label: 'Qualifications',
      icon: 'book',
      content: (
        <div className="flex flex-col gap-6">
          <FormCard title="Highest Qualification" icon="star">
            <FormGrid columns={3}>
              <DropDownList
                {...register('qualificationLevelId')}
                label="Highest Qualification"
                placeholder="Select Highest Qualification"
                data={mockDegreeLevels}
                textField="name"
                valueField="id"
                required
              />
            </FormGrid>
          </FormCard>

          {qualifications.map((_, index) => (
            <FormCard
              key={index}
              title={`Qualification ${index + 1}`}
              icon="graduation-cap"
            >
              <FormGrid columns={3}>
                <DropDownList
                  {...register(`qualifications.${index}.qualificationId`)}
                  label="Qualification Name"
                  placeholder="Select Qualification Name"
                  data={mockDegreeLevels}
                  textField="name"
                  valueField="id"
                  required
                />

                <TextBox
                  {...register(`qualifications.${index}.university`)}
                  label="University"
                  placeholder="Enter university"
                  maxLength={200}
                  required
                />

                <TextBox
                  {...register(`qualifications.${index}.board`)}
                  label="Board"
                  placeholder="Enter board"
                  maxLength={200}
                />

                <NumberBox
                  {...register(`qualifications.${index}.yearOfPassing`)}
                  label="Year of Passing"
                  min={1950}
                  max={new Date().getFullYear()}
                  required
                />

                <NumberBox
                  {...register(`qualifications.${index}.percentage`)}
                  label="Percentage"
                  min={0}
                  max={100}
                />

                <TextBox
                  {...register(`qualifications.${index}.grade`)}
                  label="Grade"
                  placeholder="Enter grade (e.g. A+)"
                  maxLength={10}
                />

                {qualifications.length > 1 && (
                  <div className="col-span-full flex justify-end">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      onClick={() => removeQualification(index)}
                    >
                      <i className="pi pi-trash text-xs" />
                      Remove
                    </button>
                  </div>
                )}
              </FormGrid>
            </FormCard>
          ))}

          <div className="w-full flex justify-start mt-2 mb-4">
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1"
              onClick={addQualification}
            >
              <i className="pi pi-plus text-xs" />
              Add Another Qualification
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormWizard
      steps={steps}
      onComplete={handleSubmit as () => void}
      isSaving={props.isSaving}
      triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
      onReset={reset}
    />
  );
}
