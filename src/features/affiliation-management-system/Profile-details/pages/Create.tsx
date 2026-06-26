import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { useProfileDetailsForm } from '../components/form.hook';

export default function Create() {
  const { register, control, handleSubmit, formState, fieldArray, reset } =
    useProfileDetailsForm();
  const { fields, append, remove } = fieldArray;

  const onFormSubmit = handleSubmit(
    data => {
      console.log('Form Submitted', data);
      ToastService.success('College Profile details saved successfully!');
      reset();
    },
    errors => {
      console.log('Validation Errors:', errors);

      const getFirstError = (obj: any): string | null => {
        if (!obj || typeof obj !== 'object') return null;
        for (const key in obj) {
          if (obj[key]?.message && typeof obj[key].message === 'string') {
            return obj[key].message;
          }
          const nested = getFirstError(obj[key]);
          if (nested) return nested;
        }
        return null;
      };

      const errorMsg = getFirstError(errors);
      ToastService.error(
        errorMsg
          ? `Validation Error: ${errorMsg}`
          : 'Please fix the validation errors in the form.'
      );
    }
  );

  return (
    <FormPage
      title="College Profile Form"
      description="Configure and save college profile details, infrastructure, and courses."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'College Profile Details' },
      ]}
    >
      {/* 1. Regulatory NOC Details */}
      <FormCard
        title="Regulatory NOC Details"
        headerAction={
          <Button
            label="Add New NOC"
            icon="plus"
            variant="outlined"
            onClick={() =>
              append({ nocType: '', referenceNo: '', issueDate: null })
            }
          />
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-3 font-semibold">NOC Type</th>
                <th className="p-3 font-semibold">NOC Reference No.</th>
                <th className="p-3 font-semibold">Issue Date</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b">
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
                  <td className="p-3 align-top text-center">
                    <Button
                      icon="trash"
                      variant="outlined"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
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
        </div>
      </FormCard>

      {/* 2. INFRASTRUCTURE & PHYSICAL ASSETS */}
      <FormCard title="1. INFRASTRUCTURE & PHYSICAL ASSETS">
        <FormGrid columns={3}>
          <TextBox
            label="Total Built-up Area (Sq.M)"
            placeholder="e.g. 5000"
            {...register('builtUpArea')}
            errorMessage={formState.errors.builtUpArea?.message as string}
            required
          />
          <TextBox
            label="Number of Classrooms"
            placeholder="Total rooms"
            {...register('numberOfClassrooms')}
            errorMessage={
              formState.errors.numberOfClassrooms?.message as string
            }
            required
          />
          <TextBox
            label="Classroom Size (Sq.M)"
            placeholder="e.g. 66"
            {...register('classroomSize')}
            errorMessage={formState.errors.classroomSize?.message as string}
            required
          />
          <TextBox
            label="Number of Laboratories"
            placeholder="Active labs"
            {...register('numberOfLaboratories')}
            errorMessage={
              formState.errors.numberOfLaboratories?.message as string
            }
            required
          />
          <TextBox
            label="Library Books Available"
            placeholder="Total book count"
            {...register('libraryBooksAvailable')}
            errorMessage={
              formState.errors.libraryBooksAvailable?.message as string
            }
            required
          />
        </FormGrid>
        <div className="mt-6 mb-4 font-semibold text-gray-700">
          Additional Infrastructure
        </div>
        <FormGrid columns={2}>
          <TextBox
            label="Total Land Area (Acres) & Ownership"
            placeholder="e.g. 5 Acres, Owned"
            {...register('totalLandArea')}
            errorMessage={formState.errors.totalLandArea?.message as string}
            required
          />
          <TextBox
            label="Total Number of Buildings"
            placeholder="e.g. 3"
            {...register('totalNumberOfBuildings')}
            errorMessage={
              formState.errors.totalNumberOfBuildings?.message as string
            }
            required
          />
          <TextBox
            label="Physical Education Facility (Sports/Gym)"
            placeholder="e.g. Sports grounds, gym hall"
            {...register('physicalEducationFacility')}
            errorMessage={
              formState.errors.physicalEducationFacility?.message as string
            }
            required
          />
          <DropDownList
            label="Hostel Facility Available?"
            placeholder="Select..."
            name="hostelFacility"
            control={control}
            data={[
              { id: 'yes', name: 'Yes' },
              { id: 'no', name: 'No' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.hostelFacility?.message as string}
            required
          />
          <TextBox
            label="Staff Quarter Details"
            placeholder="e.g. 10 Quarters, Fully Occupied"
            {...register('staffQuarterDetails')}
            errorMessage={
              formState.errors.staffQuarterDetails?.message as string
            }
            required
          />
        </FormGrid>
      </FormCard>

      {/* 4. Human Resources & Student Amenities */}
      <FormCard title="Human Resources & Student Amenities">
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
          <TextArea
            label="Core Facilities for Students"
            placeholder="Details of Libraries, Labs, Computer Centers, etc."
            {...register('coreFacilities')}
            errorMessage={formState.errors.coreFacilities?.message as string}
            rows={4}
            required
          />
        </div>
      </FormCard>

      <FormActions align="right" saveLabel="Next" onSave={onFormSubmit} />
    </FormPage>
  );
}
