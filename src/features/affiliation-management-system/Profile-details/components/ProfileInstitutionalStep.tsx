import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import { Modal } from 'shared/components/popups';
import { Grid } from 'shared/components/grid';
import { FormCard, FormGrid } from 'shared/new-components';
import { courseOptions } from './courseFees';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInstitutionalStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  governingBodyMembersArray: any;
  additionalInstitutionsArray: any;
  trigger?: any;
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
  governingBodyMembersArray,
  additionalInstitutionsArray,
  trigger,
}: ProfileInstitutionalStepProps) {
  const {
    fields: govFields,
    append: appendGov,
    remove: removeGov,
  } = governingBodyMembersArray;
  const {
    fields: instFields,
    append: appendInst,
    remove: removeInst,
  } = additionalInstitutionsArray;

  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [editingGovIndex, setEditingGovIndex] = useState<number | null>(null);

  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [editingInstIndex, setEditingInstIndex] = useState<number | null>(null);

  const governingBodyMembersWatch = useWatch({
    control,
    name: 'governingBodyMembers',
  });

  const additionalInstitutionsWatch = useWatch({
    control,
    name: 'additionalInstitutions',
  });

  const collegeTypeWatch = useWatch({
    control,
    name: 'collegeType',
  });

  return (
    <>
      <FormCard title="Basic College Information" icon="building">
        <FormGrid columns={3}>
          <DropDownList
            label="Affiliation Type"
            name="affiliationType"
            control={control}
            data={[
              { id: '1', name: 'New Affiliation' },
              { id: '2', name: 'Renewal' },
              { id: '3', name: 'Subject Increment' },
              { id: '4', name: 'College Name Change' },
            ]}
            textField="name"
            valueField="id"
            placeholder="Select Affiliation Type"
            required
          />
          <TextBox
            label="College Name"
            {...register('collegeName')}
            readOnly
            required
          />
          <DropDownList
            label="College Type"
            name="collegeType"
            control={control}
            data={[
              { id: 'Government', name: 'Government' },
              { id: 'Private', name: 'Private' },
              { id: 'Aided', name: 'Aided' },
              { id: 'Unaided', name: 'Unaided' },
              { id: 'Other', name: 'Other' },
            ]}
            textField="name"
            valueField="id"
            placeholder="Select College Type"
          />
          <TextBox
            label="College Official Email"
            {...register('collegeEmail')}
            readOnly
          />
          <TextBox
            label="Name of Society"
            {...register('societyName')}
            readOnly
          />

          <TextBox
            label="Principal Name"
            {...register('principalDirectorName')}
            readOnly
          />
          <TextBox
            label="Principal Mobile Number"
            {...register('principalMobileNo')}
            readOnly
          />
          <TextBox
            label="Principal Email ID"
            {...register('principalEmail')}
            readOnly
          />

          <TextBox label="State" {...register('stateName')} readOnly />
          <TextBox label="District" {...register('districtName')} readOnly />
          <TextBox
            label="Block / Tehsil"
            {...register('blockTehsil')}
            readOnly
          />

          <TextBox label="PIN Code" {...register('pinCode')} readOnly />

          <div className="affiliation-grid-full">
            <TextBox
              label="College Address"
              {...register('collegeAddress')}
              readOnly
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="Management Details" icon="users">
        <div className="mb-4">
          <FormGrid columns={2}>
            <TextBox
              label="Name of Ownership Entity (Society / Trust / Company / Individual)"
              placeholder="Enter Entity Name"
              {...register('ownershipEntityName')}
              errorMessage={
                formState.errors.ownershipEntityName?.message as string
              }
              required
            />
            <FileUpload
              label="Society/Trust/Company Registration Document Upload"
              name="societyRegistrationDocument"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              uploadNote="Upload the registration certificate of the society / trust / company"
              errorMessage={
                formState.errors.societyRegistrationDocument?.message as string
              }
            />
          </FormGrid>
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

        {collegeTypeWatch?.toLowerCase() === 'government' && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              CHAIRMAN JANBHAGIDARI SAMITI DETAILS
            </h4>
            <FormGrid columns={3}>
              <TextBox
                label="Name"
                placeholder="Enter Name"
                {...register('executiveName')}
                errorMessage={formState.errors.executiveName?.message as string}
              />
              <TextBox
                label="Age"
                placeholder="Enter Age"
                {...register('executiveAge')}
                errorMessage={formState.errors.executiveAge?.message as string}
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
              />
              <TextBox
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                {...register('executiveMobileNumber')}
                errorMessage={
                  formState.errors.executiveMobileNumber?.message as string
                }
              />
              <TextBox
                label="Occupation Address"
                placeholder="Enter Address"
                {...register('executiveOccupationAddress')}
                errorMessage={
                  formState.errors.executiveOccupationAddress?.message as string
                }
              />
            </FormGrid>
          </div>
        )}
      </FormCard>

      <FormCard title="Additional Institutions Run by Society" icon="building">
        <p className="text-sm text-gray-500 mb-4">
          Other colleges / institutions run by the society or its members — add
          one record per institution.
        </p>
        <div className="mb-4">
          <Grid
            data={instFields.map((field: any, index: number) => {
              const inst = additionalInstitutionsWatch?.[index] || field;
              return { ...inst, originalIndex: index };
            })}
            columns={[
              {
                header: 'INSTITUTION NAME',
                cell: (item: any) => item.institutionName || '',
              },
              { header: 'ADDRESS', cell: (item: any) => item.address || '' },
              {
                header: 'COURSE',
                cell: (item: any) =>
                  courseOptions.find(o => o.id === item.course)?.name ||
                  item.course ||
                  '',
              },
              { header: 'SEATS', cell: (item: any) => item.seats || '' },
              { header: 'YEAR', cell: (item: any) => item.year || '' },
              {
                header: 'PHOTO',
                cell: (item: any) =>
                  item.institutionPhoto
                    ? item.institutionPhoto.name || 'Uploaded'
                    : '—',
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingInstIndex(item.originalIndex);
              setIsInstModalOpen(true);
            }}
            onRemove={(item: any) => removeInst(item.originalIndex)}
          />
          {formState.errors.additionalInstitutions?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.additionalInstitutions.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Institution"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendInst({
                  institutionName: '',
                  address: '',
                  course: '',
                  seats: '',
                  class: '',
                  year: '',
                  type: '',
                  conditions: '',
                  statusOfCompliance: '',
                  institutionPhoto: null,
                });
                setEditingInstIndex(instFields.length);
                setIsInstModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Additional Institution Details"
          visible={isInstModalOpen}
          onHide={() => {
            if (editingInstIndex !== null) {
              const currentInst =
                additionalInstitutionsWatch?.[editingInstIndex];
              if (!currentInst?.institutionName) {
                removeInst(editingInstIndex);
              }
            }
            setIsInstModalOpen(false);
            setEditingInstIndex(null);
          }}
          size="large"
        >
          {editingInstIndex !== null && (
            <div className="p-4">
              <FormGrid columns={3}>
                <TextBox
                  label="Institution Name"
                  placeholder="Institution Name"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.institutionName`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.institutionName?.message as string
                  }
                  required
                />
                <TextBox
                  label="Address"
                  placeholder="Address"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.address`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.address?.message as string
                  }
                />
                <DropDownList
                  label="Course"
                  name={`additionalInstitutions.${editingInstIndex}.course`}
                  control={control}
                  placeholder="Select Course"
                  data={courseOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.course?.message as string
                  }
                />
                <TextBox
                  label="Seats"
                  placeholder="Seats"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.seats`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.seats?.message as string
                  }
                />
                <TextBox
                  label="Class"
                  placeholder="Class"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.class`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.class?.message as string
                  }
                />
                <TextBox
                  label="Year"
                  placeholder="YYYY"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.year`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.year?.message as string
                  }
                />
                <DropDownList
                  label="Type"
                  name={`additionalInstitutions.${editingInstIndex}.type`}
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 1, name: 'Permanent' },
                    { id: 2, name: 'Temporary' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.type?.message as string
                  }
                />
                <TextBox
                  label="Conditions (If Temporary)"
                  placeholder="Conditions"
                  {...register(
                    `additionalInstitutions.${editingInstIndex}.conditions`
                  )}
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.conditions?.message as string
                  }
                />
                <DropDownList
                  label="Status of Compliance"
                  name={`additionalInstitutions.${editingInstIndex}.statusOfCompliance`}
                  control={control}
                  placeholder="Select Status"
                  data={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.statusOfCompliance?.message as string
                  }
                />
                <FileUpload
                  label="Institution Photograph"
                  name={`additionalInstitutions.${editingInstIndex}.institutionPhoto`}
                  control={control}
                  mode="photo"
                  accept="image/*"
                  errorMessage={
                    formState.errors.additionalInstitutions?.[editingInstIndex]
                      ?.institutionPhoto?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentInst =
                      additionalInstitutionsWatch?.[editingInstIndex];
                    if (!currentInst?.institutionName) {
                      if (trigger)
                        await trigger(
                          `additionalInstitutions.${editingInstIndex}.institutionName`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `additionalInstitutions.${editingInstIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsInstModalOpen(false);
                    setEditingInstIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </FormCard>

      <FormCard title="Governing Body Members" icon="users">
        <p className="text-sm text-gray-500 mb-4">
          Fill one row per member, attach separate sheet if required.
        </p>
        <div className="mb-4">
          <Grid
            data={govFields.map((field: any, index: number) => {
              const member = governingBodyMembersWatch?.[index] || field;
              return { ...member, originalIndex: index };
            })}
            columns={[
              {
                header: 'MEMBER NAME',
                cell: (item: any) => item.memberName || '',
              },
              {
                header: "FATHER'S NAME",
                cell: (item: any) => item.fathersName || '',
              },
              { header: 'AGE', cell: (item: any) => item.age || '' },
              {
                header: 'QUALIFICATION',
                cell: (item: any) =>
                  qualificationOptions.find(q => q.id === item.qualification)
                    ?.name ||
                  item.qualification ||
                  '',
              },
              {
                header: 'MOBILE NO.',
                cell: (item: any) => item.mobileNumber || '',
              },
              {
                header: 'OCCUPATION ADDRESS',
                cell: (item: any) => item.occupationAddress || '',
              },
            ]}
            pagination={false}
            onEdit={(item: any) => {
              setEditingGovIndex(item.originalIndex);
              setIsGovModalOpen(true);
            }}
            onRemove={(item: any) => removeGov(item.originalIndex)}
          />
          {formState.errors.governingBodyMembers?.root?.message && (
            <div className="p-error text-sm mt-2">
              {formState.errors.governingBodyMembers.root.message}
            </div>
          )}
          <div className="mt-4">
            <Button
              label="Add Member"
              icon="plus"
              variant="outlined"
              onClick={() => {
                appendGov({
                  memberName: '',
                  fathersName: '',
                  age: '',
                  qualification: '',
                  mobileNumber: '',
                  occupationAddress: '',
                });
                setEditingGovIndex(govFields.length);
                setIsGovModalOpen(true);
              }}
            />
          </div>
        </div>

        <Modal
          header="Governing Body Member Details"
          visible={isGovModalOpen}
          onHide={() => {
            if (editingGovIndex !== null) {
              const currentMember =
                governingBodyMembersWatch?.[editingGovIndex];
              if (!currentMember?.memberName) {
                removeGov(editingGovIndex);
              }
            }
            setIsGovModalOpen(false);
            setEditingGovIndex(null);
          }}
          size="large"
        >
          {editingGovIndex !== null && (
            <div className="p-4">
              <FormGrid columns={2}>
                <TextBox
                  label="Member Name"
                  placeholder="Enter Name"
                  {...register(
                    `governingBodyMembers.${editingGovIndex}.memberName`
                  )}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.memberName?.message as string
                  }
                  required
                />
                <TextBox
                  label="Father's Name"
                  placeholder="Enter Father's Name"
                  {...register(
                    `governingBodyMembers.${editingGovIndex}.fathersName`
                  )}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.fathersName?.message as string
                  }
                />
                <TextBox
                  label="Age"
                  placeholder="Enter Age"
                  {...register(`governingBodyMembers.${editingGovIndex}.age`)}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.age?.message as string
                  }
                />
                <DropDownList
                  label="Qualification"
                  name={`governingBodyMembers.${editingGovIndex}.qualification`}
                  control={control}
                  placeholder="Select Qualification"
                  data={qualificationOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.qualification?.message as string
                  }
                />
                <TextBox
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  {...register(
                    `governingBodyMembers.${editingGovIndex}.mobileNumber`
                  )}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.mobileNumber?.message as string
                  }
                />
                <TextBox
                  label="Occupation Address"
                  placeholder="Enter Address"
                  {...register(
                    `governingBodyMembers.${editingGovIndex}.occupationAddress`
                  )}
                  errorMessage={
                    formState.errors.governingBodyMembers?.[editingGovIndex]
                      ?.occupationAddress?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    if (trigger) {
                      const isValid = await trigger(
                        `governingBodyMembers.${editingGovIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsGovModalOpen(false);
                    setEditingGovIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </FormCard>
    </>
  );
}
