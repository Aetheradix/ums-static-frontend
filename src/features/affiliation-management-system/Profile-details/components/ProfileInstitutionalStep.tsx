import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  RadioButtonList,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInstitutionalStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  nocsArray: any;
  governingBodyMembersArray: any;
}

const qualificationOptions = [
  { id: '10th', name: '10th' },
  { id: '12th', name: '12th' },
  { id: 'graduate', name: 'Graduate' },
  { id: 'post_graduate', name: 'Post Graduate' },
  { id: 'phd', name: 'Ph.D.' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'other', name: 'Other' },
];

export default function ProfileInstitutionalStep({
  register,
  control,
  formState,
  nocsArray,
  governingBodyMembersArray,
}: ProfileInstitutionalStepProps) {
  const {
    fields: nocsFields,
    append: appendNoc,
    remove: removeNoc,
  } = nocsArray;
  const {
    fields: govFields,
    append: appendGov,
    remove: removeGov,
  } = governingBodyMembersArray;

  return (
    <>
      <FormCard title="Section 1: Basic College Information" icon="building">
        <FormGrid columns={2}>
          <TextBox
            label="Application Number"
            placeholder="Enter Application Number"
            {...register('applicationNumber')}
            errorMessage={formState.errors.applicationNumber?.message as string}
            readOnly
            required
          />
          <TextBox
            label="College Name"
            placeholder="Enter College Name"
            {...register('collegeName')}
            errorMessage={formState.errors.collegeName?.message as string}
            readOnly
            required
          />
          <TextBox
            label="Society Name"
            placeholder="Enter Society Name"
            {...register('societyName')}
            errorMessage={formState.errors.societyName?.message as string}
            readOnly
          />
          <TextBox
            label="Year of Foundation — College"
            placeholder="YYYY"
            {...register('yearOfFoundationCollege')}
            errorMessage={
              formState.errors.yearOfFoundationCollege?.message as string
            }
            readOnly
          />
          <TextBox
            label="Year of Foundation — Society / Trust / Company"
            placeholder="YYYY"
            {...register('yearOfFoundationSociety')}
            errorMessage={
              formState.errors.yearOfFoundationSociety?.message as string
            }
            readOnly
          />
        </FormGrid>
        <div className="mt-4 flex flex-col gap-4">
          <TextBox
            label="Corporate / Society Office Address"
            placeholder="Enter Address"
            {...register('corporateOfficeAddress')}
            errorMessage={
              formState.errors.corporateOfficeAddress?.message as string
            }
            readOnly
            required
          />
          <TextBox
            label="College (Teaching Place) Address"
            placeholder="Enter Address"
            {...register('collegeAddress')}
            errorMessage={formState.errors.collegeAddress?.message as string}
            readOnly
          />
          <TextBox
            label="Any Other Address"
            placeholder="Enter Address"
            {...register('anyOtherAddress')}
            errorMessage={formState.errors.anyOtherAddress?.message as string}
            readOnly
          />
        </div>
      </FormCard>

      <FormCard title="Section 2: Ownership & Management" icon="users">
        <div className="mb-4">
          <TextBox
            label="Name of Ownership Entity (Society / Trust / Company / Individual)"
            placeholder="Enter Entity Name"
            {...register('ownershipEntityName')}
            errorMessage={
              formState.errors.ownershipEntityName?.message as string
            }
            required
          />
        </div>
        <div className="overflow-x-auto w-full mb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-3 font-semibold">STATUS</th>
                <th className="p-3 font-semibold">NOC TYPE</th>
                <th className="p-3 font-semibold">NOC REFERENCE NO.</th>
                <th className="p-3 font-semibold">ISSUE DATE</th>
                <th className="p-3 font-semibold">DOCUMENT</th>
                <th className="p-3 font-semibold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {nocsFields.map((field: any, index: number) => (
                <tr key={field.id} className="border-b">
                  <td className="p-3 align-top min-w-[120px]">
                    <RadioButtonList
                      name={`nocs.${index}.status`}
                      control={control}
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                      variant="horizontal"
                    />
                  </td>
                  <td className="p-3 align-top min-w-[200px]">
                    <DropDownList
                      name={`nocs.${index}.nocType`}
                      control={control}
                      placeholder="Select NOC Type"
                      appendTo={document.body}
                      data={[
                        { id: 'type1', name: 'Type 1' },
                        { id: 'type2', name: 'Type 2' },
                      ]}
                      textField="name"
                      valueField="id"
                      errorMessage={
                        formState.errors.nocs?.[index]?.nocType?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top min-w-[200px]">
                    <TextBox
                      {...register(`nocs.${index}.referenceNo`)}
                      placeholder="e.g. NOC-2026/88"
                      errorMessage={
                        formState.errors.nocs?.[index]?.referenceNo?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top min-w-[200px]">
                    <DatePicker
                      name={`nocs.${index}.issueDate`}
                      control={control}
                      placeholder="Select issue date"
                      appendTo={document.body}
                      errorMessage={
                        formState.errors.nocs?.[index]?.issueDate?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top min-w-[200px]">
                    <FileUpload
                      name={`nocs.${index}.document`}
                      control={control}
                      accept=".pdf"
                      mode="file"
                    />
                  </td>
                  <td className="p-3 align-top text-center">
                    <Button
                      icon="trash"
                      variant="outlined"
                      onClick={() => removeNoc(index)}
                      disabled={nocsFields.length === 1}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {formState.errors.nocs?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.nocs.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add NOC"
              icon="plus"
              variant="outlined"
              onClick={() =>
                appendNoc({
                  status: '',
                  nocType: '',
                  referenceNo: '',
                  issueDate: null,
                  document: null,
                })
              }
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            CHAIRMAN / SECRETARY DETAILS
          </h4>
          <FormGrid columns={3}>
            <TextBox
              label="Chairman / Secretary Name"
              placeholder="Enter Name"
              {...register('chairmanName')}
              errorMessage={formState.errors.chairmanName?.message as string}
              required
            />
            <TextBox
              label="Father's Name"
              placeholder="Enter Father's Name"
              {...register('chairmanFathersName')}
              errorMessage={
                formState.errors.chairmanFathersName?.message as string
              }
              required
            />
            <TextBox
              label="Age"
              placeholder="Enter Age"
              {...register('chairmanAge')}
              errorMessage={formState.errors.chairmanAge?.message as string}
              required
            />
            <DropDownList
              label="Educational Qualification"
              name="chairmanQualification"
              control={control}
              placeholder="Select Qualification"
              data={qualificationOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.chairmanQualification?.message as string
              }
              required
            />
            <TextBox
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              {...register('chairmanMobileNumber')}
              errorMessage={
                formState.errors.chairmanMobileNumber?.message as string
              }
              required
            />
            <TextBox
              label="Occupation Address"
              placeholder="Enter Address"
              {...register('chairmanOccupationAddress')}
              errorMessage={
                formState.errors.chairmanOccupationAddress?.message as string
              }
              required
            />
          </FormGrid>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            ADDITIONAL EXECUTIVE DETAILS
          </h4>
          <FormGrid columns={3}>
            <TextBox
              label="Name"
              placeholder="Enter Name"
              {...register('executiveName')}
              errorMessage={formState.errors.executiveName?.message as string}
              required
            />
            <TextBox
              label="Age"
              placeholder="Enter Age"
              {...register('executiveAge')}
              errorMessage={formState.errors.executiveAge?.message as string}
              required
            />
            <DropDownList
              label="Educational Qualification"
              name="executiveQualification"
              control={control}
              placeholder="Select Qualification"
              data={qualificationOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.executiveQualification?.message as string
              }
              required
            />
            <TextBox
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              {...register('executiveMobileNumber')}
              errorMessage={
                formState.errors.executiveMobileNumber?.message as string
              }
              required
            />
            <TextBox
              label="Occupation Address"
              placeholder="Enter Address"
              {...register('executiveOccupationAddress')}
              errorMessage={
                formState.errors.executiveOccupationAddress?.message as string
              }
              required
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="Section 3: Governing Body Members" icon="users">
        <p className="text-sm text-gray-500 mb-4">
          Fill one row per member, attach separate sheet if required.
        </p>
        <div className="flex flex-col gap-4">
          {govFields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Member {index + 1}
                </span>
                <Button
                  icon="trash"
                  variant="outlined"
                  onClick={() => removeGov(index)}
                  disabled={govFields.length === 1}
                />
              </div>
              <FormGrid columns={3}>
                <TextBox
                  label="Member Name"
                  placeholder="Enter Name"
                  {...register(`governingBodyMembers.${index}.memberName`)}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]?.memberName
                      ?.message as string
                  }
                  required
                />
                <TextBox
                  label="Father's Name"
                  placeholder="Enter Father's Name"
                  {...register(`governingBodyMembers.${index}.fathersName`)}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]?.fathersName
                      ?.message as string
                  }
                />
                <TextBox
                  label="Age"
                  placeholder="Enter Age"
                  {...register(`governingBodyMembers.${index}.age`)}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]?.age
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Qualification"
                  name={`governingBodyMembers.${index}.qualification`}
                  control={control}
                  placeholder="Select Qualification"
                  data={qualificationOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]
                      ?.qualification?.message as string
                  }
                />
                <TextBox
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  {...register(`governingBodyMembers.${index}.mobileNumber`)}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]?.mobileNumber
                      ?.message as string
                  }
                />
                <TextBox
                  label="Occupation Address"
                  placeholder="Enter Address"
                  {...register(
                    `governingBodyMembers.${index}.occupationAddress`
                  )}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[index]
                      ?.occupationAddress?.message as string
                  }
                />
              </FormGrid>
            </div>
          ))}
          <div>
            <Button
              label="Add Member"
              icon="plus"
              variant="outlined"
              onClick={() =>
                appendGov({
                  memberName: '',
                  fathersName: '',
                  age: '',
                  qualification: '',
                  mobileNumber: '',
                  occupationAddress: '',
                })
              }
            />
          </div>
        </div>
      </FormCard>
    </>
  );
}
