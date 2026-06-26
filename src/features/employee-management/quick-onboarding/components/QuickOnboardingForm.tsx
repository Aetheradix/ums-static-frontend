import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import {
  mockCastes,
  mockDesignations,
  mockGenders,
  mockNatureOfEmployment,
  mockOrgUnits,
  mockPosts,
  mockSalutations,
  mockServiceCadres,
  mockSpecializations,
} from '../../mockData';
import { useQuickOnboardingForm } from './form.hook';

interface Props {
  onSubmit: Forms.SubmitFunc<EmployeeManagement.QuickOnboardingForm>;
  onCancel: VoidFunction;
  isSaving?: boolean;
  initialData?: EmployeeManagement.QuickOnboardingForm;
  isReadOnly?: boolean;
}

export default function QuickOnboardingForm(props: Props) {
  const { register, handleSubmit, reset } = useQuickOnboardingForm(
    props.onSubmit,
    props.initialData
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <fieldset
        disabled={props.isReadOnly}
        className="flex flex-col gap-6 border-none p-0 m-0 min-w-0"
      >
        <FormCard title="Employee Personal Information" icon="user">
          <FormGrid columns={3}>
            <DropDownList
              {...register('salutation')}
              label="Salutation"
              placeholder="Select Salutation"
              data={mockSalutations}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('firstName')}
              label="First Name"
              placeholder="Enter first name"
            />

            <TextBox
              {...register('middleName')}
              label="Middle Name"
              placeholder="Enter middle name"
            />

            <TextBox
              {...register('lastName')}
              label="Last Name"
              placeholder="Enter last name"
            />

            <DropDownList
              {...register('gender')}
              label="Gender"
              placeholder="Select Gender"
              data={mockGenders}
              textField="name"
              valueField="id"
            />

            <DropDownList
              {...register('casteId')}
              label="Category"
              placeholder="Select Category"
              data={mockCastes}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('mobileNumber')}
              label="Mobile Number"
              placeholder="Enter mobile number"
              maxLength={10}
            />

            <TextBox
              {...register('officialEmail')}
              label="Official Email"
              placeholder="Enter official email"
            />

            <DatePicker
              {...register('dateOfBirth')}
              label="Date of Birth"
              placeholder="Select date of birth"
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
            />

            <DropDownList
              {...register('employeeNatureId')}
              label="Nature of Employment"
              placeholder="Select Nature of Employment"
              data={mockNatureOfEmployment}
              textField="name"
              valueField="id"
            />

            <DropDownList
              {...register('organizationUnitId')}
              label="Organization Unit"
              placeholder="Select Organization Unit"
              data={mockOrgUnits}
              textField="name"
              valueField="id"
            />

            <DropDownList
              {...register('postId')}
              label="Post"
              placeholder="Select Post"
              data={mockPosts}
              textField="name"
              valueField="id"
            />

            <DropDownList
              {...register('designationId')}
              label="Designation"
              placeholder="Select Designation"
              data={mockDesignations}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('seniorityRank')}
              label="Seniority Rank"
              placeholder="Enter seniority rank"
            />

            <DropDownList
              {...register('subjectSpecializationId')}
              label="Subject Specialization"
              placeholder="Select Subject Specialization"
              data={mockSpecializations}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('employeeCode')}
              label="Employee Code"
              placeholder="Enter Employee code"
            />

            <DatePicker
              {...register('dateOfJoining')}
              label="Date of Joining"
              placeholder="Select date of joining"
            />
          </FormGrid>
        </FormCard>
      </fieldset>

      <div className="form-actions-container form-actions-right">
        <Button
          label={props.isReadOnly ? 'Back' : 'Cancel'}
          type="button"
          onClick={props.onCancel}
          icon={props.isReadOnly ? 'arrow-left' : 'times'}
          variant="outlined"
          disabled={props.isSaving}
        />

        {!props.isReadOnly && (
          <>
            <Button
              label="Reset"
              type="button"
              onClick={() => reset()}
              icon="refresh"
              variant="outlined"
              disabled={props.isSaving}
            />

            <Button
              label="Register Employee"
              type="submit"
              icon="check"
              variant="success"
              isLoading={props.isSaving}
            />
          </>
        )}
      </div>
    </form>
  );
}
