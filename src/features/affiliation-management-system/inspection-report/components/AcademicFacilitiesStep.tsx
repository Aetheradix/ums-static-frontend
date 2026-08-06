import { type Control, type Path } from 'react-hook-form';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { InspectionReportFormData } from './form.hook';

interface AcademicFacilitiesStepProps {
  register: (key: Path<InspectionReportFormData>) => {
    control: Control<InspectionReportFormData>;
    name: Path<InspectionReportFormData>;
  };
  control: Control<InspectionReportFormData>;
  errors: any;
}

const yesNoOptions = [
  { id: 'Yes', name: 'Yes' },
  { id: 'No', name: 'No' },
];

export default function AcademicFacilitiesStep({
  register,
  control,
  errors,
}: AcademicFacilitiesStepProps) {
  return (
    <>
      <FormCard
        title="Section 6: Observations — Library"
        subtitle="Details about the library, books, and journals"
        icon="book"
      >
        <FormGrid columns={4}>
          <div className="col-span-2">
            <TextBox
              label="Separate Library Building/Room Available? (Area)"
              placeholder="Yes / No (Specify Area in sq. ft.)"
              {...register('library_room_area')}
              errorMessage={errors.library_room_area?.message}
            />
          </div>
          <TextBox
            label="Number of Books (Owned)"
            type="number"
            {...register('books_owned_count')}
            errorMessage={errors.books_owned_count?.message}
          />
          <TextBox
            label="Number of Books (Hired)"
            type="number"
            {...register('books_hired_count')}
            errorMessage={errors.books_hired_count?.message}
          />
          <TextBox
            label="Number of Journals Subscribed"
            type="number"
            {...register('journals_subscribed_count')}
            errorMessage={errors.journals_subscribed_count?.message}
          />
          <DropDownList
            label="Journals Relevant with Course?"
            placeholder="Select Journals Relevant with Course"
            name="journals_relevant"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.journals_relevant?.message}
          />
          <TextBox
            label="Number of Library Staff"
            type="number"
            {...register('library_staff_count')}
            errorMessage={errors.library_staff_count?.message}
          />
          <TextBox
            label="Frequency of Library per Week"
            {...register('library_frequency')}
            errorMessage={errors.library_frequency?.message}
          />
          <DropDownList
            label="Books Relevant with Course?"
            placeholder="Select Books Relevant with Course"
            name="books_relevant"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.books_relevant?.message}
          />
          <DropDownList
            label="Accounts Properly Maintained?"
            placeholder="Select Accounts Properly Maintained"
            name="book_accounts_maintained"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.book_accounts_maintained?.message}
          />
          <DropDownList
            label="Book Accounts Audited by CA?"
            placeholder="Select Book Accounts Audited by CA"
            name="book_accounts_audited"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.book_accounts_audited?.message}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 7: Observations — Computers"
        subtitle="Instruction: Committee should physically verify all computers in working condition with demonstration."
        icon="display"
      >
        <FormGrid columns={4}>
          <TextBox
            label="Latest Computers"
            type="number"
            {...register('latest_computers')}
            errorMessage={errors.latest_computers?.message}
          />
          <TextBox
            label="Old Technology Computers"
            type="number"
            {...register('old_computers')}
            errorMessage={errors.old_computers?.message}
          />
          <TextBox
            label="Printers"
            type="number"
            {...register('printers_count')}
            errorMessage={errors.printers_count?.message}
          />
          <TextBox
            label="Scanners"
            type="number"
            {...register('scanners_count')}
            errorMessage={errors.scanners_count?.message}
          />
          <TextBox
            label="Internet Facility (Type)"
            placeholder="Yes/No - Broadband/Fiber"
            {...register('internet_facility_type')}
            errorMessage={errors.internet_facility_type?.message}
          />
          <TextBox
            label="Computer-Trained Staff"
            type="number"
            {...register('computer_trained_staff')}
            errorMessage={errors.computer_trained_staff?.message}
          />
          <TextBox
            label="Computer : Student Ratio"
            placeholder="e.g. 1:2"
            {...register('computer_student_ratio')}
            errorMessage={errors.computer_student_ratio?.message}
          />
          <div className="col-span-2">
            <TextBox
              label="Computers in Working Condition"
              type="number"
              {...register('computers_working_count')}
              errorMessage={errors.computers_working_count?.message}
            />
          </div>
          <div className="col-span-2">
            <TextBox
              label="Down Time"
              {...register('down_time')}
              errorMessage={errors.down_time?.message}
            />
          </div>
          <div className="col-span-4">
            <TextArea
              label="Licensed Software Available (Names)"
              {...register('licensed_software_names')}
              errorMessage={errors.licensed_software_names?.message}
              rows={2}
            />
          </div>
          <div className="col-span-4">
            <TextArea
              label="Packages in Use (Names)"
              {...register('packages_in_use')}
              errorMessage={errors.packages_in_use?.message}
              rows={2}
            />
          </div>
          <div className="col-span-4">
            <TextArea
              label="Future Plans (Computers)"
              {...register('computers_future_plans')}
              errorMessage={errors.computers_future_plans?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 8: Observations — Equipment & Laboratory"
        subtitle="Instruction: Committee should physically verify all equipment with performance demonstration."
        icon="flask"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Lab Available as per Norms?"
            placeholder="Select Lab Available as per Norms"
            name="lab_avail_norms"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.lab_avail_norms?.message}
          />
          <TextBox
            label="Lab Floor Space (sq. ft.)"
            {...register('lab_floor_space')}
            errorMessage={errors.lab_floor_space?.message}
          />
          <div className="col-span-2">
            <TextArea
              label="Number & Description of Equipment"
              {...register('lab_equipment_desc')}
              errorMessage={errors.lab_equipment_desc?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Workshops Details"
              {...register('workshop_details')}
              errorMessage={errors.workshop_details?.message}
              rows={2}
            />
          </div>
          <TextBox
            label="Hospital Availability (Paramedical / Medical)"
            {...register('hospital_availability')}
            errorMessage={errors.hospital_availability?.message}
          />
        </FormGrid>
        <FormGrid columns={2} className="mt-4">
          <DropDownList
            label="First Aid Facility?"
            placeholder="Select First Aid Facility"
            name="first_aid_avail"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.first_aid_avail?.message}
          />
          <DropDownList
            label="Fire Fighting Facility?"
            placeholder="Select Fire Fighting Facility"
            name="fire_fighting_avail"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.fire_fighting_avail?.message}
          />
          <div className="col-span-2">
            <TextArea
              label="Other Major Instruments as per Course Requirements? (Details)"
              placeholder="Yes/No + Details"
              {...register('major_instruments_details')}
              errorMessage={errors.major_instruments_details?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>
    </>
  );
}
