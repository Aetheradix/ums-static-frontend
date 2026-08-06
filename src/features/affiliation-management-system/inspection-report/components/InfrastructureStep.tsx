import { type Control, type Path } from 'react-hook-form';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { InspectionReportFormData } from './form.hook';

interface InfrastructureStepProps {
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

const yesNoNaOptions = [
  { id: 'N/A', name: 'N/A' },
  { id: 'Yes', name: 'Yes' },
  { id: 'No', name: 'No' },
];

export default function InfrastructureStep({
  register,
  control,
  errors,
}: InfrastructureStepProps) {
  return (
    <>
      <FormCard
        title="3A. Location & Building Suitability"
        subtitle="Details about the college building and surroundings"
        icon="building"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Built-up Area (sq. ft.)"
            {...register('built_up_area')}
            errorMessage={errors.built_up_area?.message}
          />
          <TextBox
            label="Number of Classrooms (with size in sq. ft.)"
            placeholder="e.g. 10 rooms (500 sq. ft. each)"
            {...register('classrooms_count_size')}
            errorMessage={errors.classrooms_count_size?.message}
          />
        </FormGrid>
        <FormGrid columns={2} className="mt-4">
          <div className="col-span-2">
            <TextArea
              label="Teaching Accommodation Details"
              {...register('teaching_accommodation')}
              errorMessage={errors.teaching_accommodation?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Non-Teaching Accommodation Details"
              {...register('non_teaching_accommodation')}
              errorMessage={errors.non_teaching_accommodation?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Number of Halls for Use Other Than Teaching (with size in sq. ft.)"
              {...register('other_halls_details')}
              errorMessage={errors.other_halls_details?.message}
              rows={2}
            />
          </div>
          <TextArea
            label="Quality of Construction"
            {...register('construction_quality')}
            errorMessage={errors.construction_quality?.message}
            rows={2}
          />
          <TextArea
            label="Approach to Building & Accessibility"
            {...register('building_approach')}
            errorMessage={errors.building_approach?.message}
            rows={2}
          />
          <div className="col-span-2">
            <TextArea
              label="Overall Ambiance (Surroundings, Open Space, Gardens, Light, Air)"
              {...register('overall_ambiance')}
              errorMessage={errors.overall_ambiance?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="3B. Ownership & Rented Building"
        subtitle="Details about the building ownership"
        icon="bank"
      >
        <FormGrid columns={3}>
          <DropDownList
            label="Self-owned or Rented?"
            placeholder="Select Self-owned or Rented"
            name="building_ownership"
            control={control}
            data={[
              { id: 'Self-owned', name: 'Self-owned' },
              { id: 'Rented', name: 'Rented' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={errors.building_ownership?.message}
          />
          <DropDownList
            label="Registered Rental Agreement Done? (if rented)"
            placeholder="Select Registered Rental Agreement Done"
            name="rental_agreement_done"
            control={control}
            data={yesNoNaOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.rental_agreement_done?.message}
          />
          <DropDownList
            label="Accounts Provision for Own Building? (if rented)"
            placeholder="Select Accounts Provision for Own Building"
            name="provision_own_building"
            control={control}
            data={yesNoNaOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.provision_own_building?.message}
          />
          <div className="col-span-3">
            <TextBox
              label="By What Time Will College Have Its Own Campus / Building?"
              {...register('timeframe_own_building')}
              errorMessage={errors.timeframe_own_building?.message}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="3C. Parking Space Details"
        subtitle="Parking availability for staff, students, and visitors"
        icon="car-front"
      >
        <FormGrid columns={3}>
          <DropDownList
            label="Parking Space for Staff?"
            placeholder="Select Parking Space for Staff"
            name="parking_staff"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.parking_staff?.message}
          />
          <DropDownList
            label="Parking Space for Students?"
            placeholder="Select Parking Space for Students"
            name="parking_students"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.parking_students?.message}
          />
          <DropDownList
            label="Parking Space for Visitors?"
            placeholder="Select Parking Space for Visitors"
            name="parking_visitors"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.parking_visitors?.message}
          />
          <div className="col-span-3">
            <TextArea
              label="Parking Details (Remarks)"
              {...register('parking_details_remarks')}
              errorMessage={errors.parking_details_remarks?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="3D, 3E & 3F. Other Infrastructure & Environment"
        subtitle="Sports, Shared Building, Security, and Surroundings"
        icon="tree"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Sports Facility Owned (Area in sq. ft.)"
            {...register('sports_facility_owned_area')}
            errorMessage={errors.sports_facility_owned_area?.message}
          />
          <DropDownList
            label="Ground as per Body Norms?"
            placeholder="Select Ground as per Body Norms"
            name="sports_statutory_req"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.sports_statutory_req?.message}
          />
          <DropDownList
            label="Physical Welfare Ground Available?"
            placeholder="Select Physical Welfare Ground Available"
            name="physical_welfare_avail"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.physical_welfare_avail?.message}
          />
          <div className="col-span-3">
            <TextArea
              label="Outdoor Sports via MOU (Details)"
              {...register('outdoor_sports_mou')}
              errorMessage={errors.outdoor_sports_mou?.message}
              rows={2}
            />
          </div>

          <DropDownList
            label="Building Shared with Other Course/College?"
            placeholder="Select Building Shared with Other Course/College"
            name="building_shared"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.building_shared?.message}
          />
          <DropDownList
            label="Exclusively Available Space (If shared)"
            placeholder="Select Exclusively Available Space"
            name="exclusive_space_shared"
            control={control}
            data={yesNoNaOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.exclusive_space_shared?.message}
          />
          <DropDownList
            label="Area Adequate as per Norms?"
            placeholder="Select Area Adequate as per Norms"
            name="area_adequate_norms"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.area_adequate_norms?.message}
          />
          <div className="col-span-3">
            <TextArea
              label="Security Measures Anticipated for Exams (If Away from District HQ)"
              {...register('exam_security_measures')}
              errorMessage={errors.exam_security_measures?.message}
              rows={2}
            />
          </div>

          <DropDownList
            label="Neighbour Complaints / Objections?"
            placeholder="Select Neighbour Complaints / Objections"
            name="neighbour_complaints"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.neighbour_complaints?.message}
          />
          <div className="col-span-2">
            <TextBox
              label="Neighbour Remarks (If any)"
              {...register('neighbour_remarks')}
              errorMessage={errors.neighbour_remarks?.message}
            />
          </div>
          <div className="col-span-3">
            <TextArea
              label="Committee Observations on Surroundings & Environment"
              {...register('environment_observations')}
              errorMessage={errors.environment_observations?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="9 & 10. Hostel Facility and Quarters"
        subtitle="Information on student hostels and staff quarters"
        icon="house"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Number of Rooms for Boys"
            type="number"
            {...register('boys_hostel_rooms')}
            errorMessage={errors.boys_hostel_rooms?.message}
          />
          <TextBox
            label="Number of Rooms for Girls"
            type="number"
            {...register('girls_hostel_rooms')}
            errorMessage={errors.girls_hostel_rooms?.message}
          />
          <DropDownList
            label="Reading Room Available in Hostel?"
            placeholder="Select Reading Room Available in Hostel"
            name="hostel_reading_room"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.hostel_reading_room?.message}
          />
          <DropDownList
            label="Recreation Facility Available?"
            placeholder="Select Recreation Facility Available"
            name="hostel_recreation"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.hostel_recreation?.message}
          />
          <div className="col-span-2">
            <TextArea
              label="Sanitation & Bathroom Condition (Committee Observation)"
              {...register('sanitation_condition')}
              errorMessage={errors.sanitation_condition?.message}
              rows={2}
            />
          </div>

          <DropDownList
            label="Details Provided by Management about Quarters Verified?"
            placeholder="Select Details Provided by Management about Quarters Verified"
            name="quarters_verified"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.quarters_verified?.message}
          />
          <DropDownList
            label="Reservation Norms Followed in Admissions? (Govt. Policy)"
            placeholder="Select Reservation Norms Followed in Admissions"
            name="reservation_norms_followed"
            control={control}
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.reservation_norms_followed?.message}
          />
          <div className="col-span-2">
            <TextArea
              label="Future Plans & Provisions for Quarters"
              {...register('quarters_future_plans')}
              errorMessage={errors.quarters_future_plans?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>
    </>
  );
}
