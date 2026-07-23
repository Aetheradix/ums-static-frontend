import type { Control, FormState, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextBox,
  RadioButtonList,
  FileUpload,
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
}

export default function ProfileInstitutionalStep({
  register,
  control,
  formState,
  nocsArray,
}: ProfileInstitutionalStepProps) {
  const { fields, append, remove } = nocsArray;

  return (
    <>
      <FormCard
        title="Affiliation & College Mode Details"
        subtitle="Specify the college affiliation application mode, status, and fees."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Application Number"
            placeholder="Enter Application Number"
            {...register('applicationNumber')}
            errorMessage={formState.errors.applicationNumber?.message as string}
            readOnly
            required
          />
          <TextBox
            label="Name of College/Society"
            placeholder="Enter Name of College/Society"
            {...register('nameOfCollege')}
            errorMessage={formState.errors.nameOfCollege?.message as string}
            readOnly
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Regulatory NOC Details"
        subtitle="Manage the regulatory body NOC reference details."
        icon="shield"
        headerAction={
          <Button
            label="Add New NOC"
            icon="plus"
            variant="outlined"
            onClick={() =>
              append({
                status: 'yes',
                nocType: '',
                referenceNo: '',
                issueDate: null,
                document: null,
              })
            }
          />
        }
      >
        <div className="overflow-x-auto w-full">
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
              {fields.map((field: any, index: number) => (
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
    </>
  );
}
