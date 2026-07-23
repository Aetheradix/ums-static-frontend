import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileEcosystemStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  existingProgrammesArray: any;
  proposedProgrammesArray: any;
}

export default function ProfileEcosystemStep({
  register,
  control,
  formState,
  existingProgrammesArray,
  proposedProgrammesArray,
}: ProfileEcosystemStepProps) {
  const {
    fields: existingFields,
    append: appendExisting,
    remove: removeExisting,
  } = existingProgrammesArray;
  const {
    fields: proposedFields,
    append: appendProposed,
    remove: removeProposed,
  } = proposedProgrammesArray;

  const renderProgrammeTable = (
    fields: any,
    append: any,
    remove: any,
    type: 'existingProgrammes' | 'proposedProgrammes',
    label: string
  ) => (
    <FormCard
      title={label}
      subtitle={
        type === 'existingProgrammes'
          ? 'Manage the details of currently active academic programmes at the college.'
          : 'Manage the details of proposed new academic programmes to be introduced.'
      }
      icon="book"
      headerAction={
        <Button
          label={`Add ${type === 'existingProgrammes' ? 'Existing' : 'New'} Course`}
          icon="plus"
          variant="outlined"
          onClick={() =>
            append({
              mode: '',
              courseLevel: '',
              facultyDept: '',
              programmeName: '',
              duration: '',
              appliedYear: '',
            })
          }
        />
      }
    >
      <div className="overflow-x-auto w-full">
        {fields.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg text-gray-500">
            No {type === 'existingProgrammes' ? 'existing' : 'proposed'}{' '}
            programmes added. Click "Add{' '}
            {type === 'existingProgrammes' ? 'Existing' : 'New'} Course" to list
            one.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-3 font-semibold w-[150px]">
                  MODE (REGULATORY)
                </th>
                <th className="p-3 font-semibold w-[150px]">COURSE LEVEL</th>
                <th className="p-3 font-semibold w-[150px]">FACULTY / DEPT</th>
                <th className="p-3 font-semibold min-w-[200px]">
                  PROGRAMME NAME
                </th>
                <th className="p-3 font-semibold w-[150px]">DURATION</th>
                <th className="p-3 font-semibold w-[150px]">APPLIED YEAR</th>
                <th className="p-3 font-semibold text-center w-[80px]">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field: any, index: number) => (
                <tr key={field.id} className="border-b">
                  <td className="p-3 align-top">
                    <DropDownList
                      name={`${type}.${index}.mode`}
                      control={control}
                      placeholder="Select Mode"
                      appendTo={document.body}
                      data={[
                        { id: 'regular', name: 'Regular' },
                        { id: 'distance', name: 'Distance' },
                      ]}
                      textField="name"
                      valueField="id"
                      errorMessage={
                        formState.errors[type]?.[index]?.mode?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top">
                    <DropDownList
                      name={`${type}.${index}.courseLevel`}
                      control={control}
                      placeholder="Select Level"
                      appendTo={document.body}
                      data={[
                        { id: 'ug', name: 'UG' },
                        { id: 'pg', name: 'PG' },
                      ]}
                      textField="name"
                      valueField="id"
                      errorMessage={
                        formState.errors[type]?.[index]?.courseLevel?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top">
                    <DropDownList
                      name={`${type}.${index}.facultyDept`}
                      control={control}
                      placeholder="Select Dept"
                      appendTo={document.body}
                      data={[
                        { id: 'cs', name: 'Computer Science' },
                        { id: 'it', name: 'Information Tech' },
                      ]}
                      textField="name"
                      valueField="id"
                      errorMessage={
                        formState.errors[type]?.[index]?.facultyDept?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top">
                    <TextBox
                      {...register(`${type}.${index}.programmeName`)}
                      placeholder="e.g. B.Tech CSE"
                      errorMessage={
                        formState.errors[type]?.[index]?.programmeName?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top">
                    <TextBox
                      {...register(`${type}.${index}.duration`)}
                      placeholder="3 Years"
                      errorMessage={
                        formState.errors[type]?.[index]?.duration?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top">
                    <DropDownList
                      name={`${type}.${index}.appliedYear`}
                      control={control}
                      placeholder="Select Year"
                      appendTo={document.body}
                      data={[
                        { id: '2026-27', name: '2026-27' },
                        { id: '2027-28', name: '2027-28' },
                      ]}
                      textField="name"
                      valueField="id"
                      errorMessage={
                        formState.errors[type]?.[index]?.appliedYear?.message
                      }
                    />
                  </td>
                  <td className="p-3 align-top text-center">
                    <Button
                      icon="trash"
                      variant="outlined"
                      onClick={() => remove(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {formState.errors[type]?.root?.message && (
          <div className="p-error text-sm mt-2">
            {formState.errors[type]?.root?.message}
          </div>
        )}
      </div>
    </FormCard>
  );

  return (
    <>
      {renderProgrammeTable(
        existingFields,
        appendExisting,
        removeExisting,
        'existingProgrammes',
        'Existing Academic Programmes'
      )}

      {renderProgrammeTable(
        proposedFields,
        appendProposed,
        removeProposed,
        'proposedProgrammes',
        'Proposed New Programmes'
      )}

      <FormCard
        title="Human Resources & Student Amenities"
        subtitle="Specify the faculty strength, net qualifications, support staff, and student facilities."
        icon="users"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Teaching Faculty Details (Strength & Qual.)"
            placeholder="e.g. 15 PhDs, 20 NET Qualified"
            {...register('teachingFacultyDetails')}
            errorMessage={
              formState.errors.teachingFacultyDetails?.message as string
            }
            required
          />
          <TextBox
            label="Non-Teaching & Admin Staff Details"
            placeholder="Total count (Admin, Tech, Support)"
            {...register('nonTeachingStaffDetails')}
            errorMessage={
              formState.errors.nonTeachingStaffDetails?.message as string
            }
            required
          />
        </FormGrid>
        <div className="mt-4">
          <TextBox
            label="Core Facilities for Students"
            placeholder="Details of Libraries, Labs, Computer Centers, etc."
            {...register('coreFacilities')}
            errorMessage={formState.errors.coreFacilities?.message as string}
            required
          />
        </div>
      </FormCard>
    </>
  );
}
