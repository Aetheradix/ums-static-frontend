import { useWatch } from 'react-hook-form';
import type { Control, FormState, Path } from 'react-hook-form';
import { DropDownList, TextBox, FileUpload } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInfrastructureStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileInfrastructureStep({
  register,
  control,
  formState,
}: ProfileInfrastructureStepProps) {
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isRentedBuilding = useWatch({
    control,
    name: 'isRentedBuilding',
  });

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 6: Infrastructure & Building
      </div>
      <FormCard title="INFRASTRUCTURE DETAILS" icon="building">
        <FormGrid columns={2}>
          <TextBox
            label="Total Area & Built-up Area"
            placeholder="Enter Area Details"
            {...register('totalArea')}
            errorMessage={formState.errors.totalArea?.message as string}
          />
          <DropDownList
            label="Is College running in Rented Building?"
            name="isRentedBuilding"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.isRentedBuilding?.message as string}
          />
        </FormGrid>
        {isRentedBuilding === 'yes' && (
          <div className="mt-4">
            <FileUpload
              label="Rent Agreement Document"
              name="rentAgreementDocument"
              control={control}
              mode="file"
              accept=".pdf,image/*"
              errorMessage={
                formState.errors.rentAgreementDocument?.message as string
              }
            />
          </div>
        )}
        <div className="flex flex-col gap-4 mt-4">
          <TextBox
            label="Provision to construct own building (Books of Account None)"
            placeholder="Enter Details"
            {...register('provisionToConstruct')}
            errorMessage={
              formState.errors.provisionToConstruct?.message as string
            }
          />
          <TextBox
            label="Built - up Accommodation Details (Rooms, Verandah, etc.)"
            placeholder="Enter Accommodation Details"
            {...register('accommodationDetails')}
            errorMessage={
              formState.errors.accommodationDetails?.message as string
            }
          />
          <TextBox
            label="Quality of Building & Surroundings"
            placeholder="Enter Quality Details"
            {...register('qualityOfBuilding')}
            errorMessage={formState.errors.qualityOfBuilding?.message as string}
          />
        </div>
      </FormCard>

      <FormCard title="BUILDING DOCUMENTS" icon="file">
        <FormGrid columns={2}>
          <FileUpload
            label="Photo of College Building"
            name="photoOfCollegeBuilding"
            control={control}
            mode="file"
            accept="image/*"
            errorMessage={
              formState.errors.photoOfCollegeBuilding?.message as string
            }
          />
          <FileUpload
            label="Building Map"
            name="buildingMap"
            control={control}
            mode="file"
            accept=".pdf,image/*"
            errorMessage={formState.errors.buildingMap?.message as string}
          />
        </FormGrid>
      </FormCard>

      <div className="mt-6">
        <FormCard title="FACILITIES & ENVIRONMENT" icon="compass">
          <FormGrid columns={2}>
            <DropDownList
              label="Required number of classrooms as per norms?"
              name="requiredClassrooms"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.requiredClassrooms?.message as string
              }
            />
            <DropDownList
              label="Is easily accessible to public?"
              name="accessibleToPublic"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={
                formState.errors.accessibleToPublic?.message as string
              }
            />
          </FormGrid>
          <div className="mt-4">
            <TextBox
              label="Classroom Details"
              placeholder="Enter Details"
              {...register('classroomDetails')}
              errorMessage={
                formState.errors.classroomDetails?.message as string
              }
            />
          </div>
          <div className="mt-4">
            <FormGrid columns={3}>
              <DropDownList
                label="Security problems anticipated?"
                name="securityProblems"
                control={control}
                placeholder="Select"
                data={yesNoOptions}
                textField="name"
                valueField="id"
                errorMessage={
                  formState.errors.securityProblems?.message as string
                }
              />
              <DropDownList
                label="Parking space available?"
                name="parkingSpace"
                control={control}
                placeholder="Select"
                data={yesNoOptions}
                textField="name"
                valueField="id"
                errorMessage={formState.errors.parkingSpace?.message as string}
              />
              <DropDownList
                label="Neighbour Complaints?"
                name="neighbourComplaints"
                control={control}
                placeholder="Select"
                data={yesNoOptions}
                textField="name"
                valueField="id"
                errorMessage={
                  formState.errors.neighbourComplaints?.message as string
                }
              />
            </FormGrid>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <TextBox
              label="Neighbour Complaints / Reputation Remarks"
              placeholder="Enter Remarks"
              {...register('neighbourComplaintsRemarks')}
              errorMessage={
                formState.errors.neighbourComplaintsRemarks?.message as string
              }
            />
            <DropDownList
              label="Is building / campus shared with another college?"
              name="sharedCampus"
              control={control}
              placeholder="Select"
              data={yesNoOptions}
              textField="name"
              valueField="id"
              errorMessage={formState.errors.sharedCampus?.message as string}
            />
          </div>
        </FormCard>
      </div>

      <div className="mb-4 mt-6 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 7: Staff, Library & Facilities (Proposed Course)
      </div>

      <FormCard title="7A — TEACHING & NON-TEACHING STAFF" icon="users">
        <div className="flex flex-col gap-4">
          <TextBox
            label="Teaching staff recruited or identified for recruitment"
            placeholder="Enter Details"
            {...register('teachingStaffRecruited')}
            errorMessage={
              formState.errors.teachingStaffRecruited?.message as string
            }
          />
          <TextBox
            label="Non-teaching & facilitation staff recruited / proposed"
            placeholder="Enter Details"
            {...register('nonTeachingStaffRecruited')}
            errorMessage={
              formState.errors.nonTeachingStaffRecruited?.message as string
            }
          />
          <TextBox
            label="Teaching aids, computer hardware, software & other facilities"
            placeholder="Enter Details"
            {...register('teachingAids')}
            errorMessage={formState.errors.teachingAids?.message as string}
          />
        </div>
      </FormCard>

      <FormCard title="7B — LIBRARY & READING ROOM" icon="book">
        <FormGrid columns={3}>
          <TextBox
            label="Library Books Count"
            placeholder="Count"
            {...register('libraryBooksCount')}
            errorMessage={formState.errors.libraryBooksCount?.message as string}
          />
          <TextBox
            label="Book / Student Ratio"
            placeholder="Ratio"
            {...register('bookStudentRatio')}
            errorMessage={formState.errors.bookStudentRatio?.message as string}
          />
          <DropDownList
            label="Library Building Available?"
            name="libraryBuildingAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.libraryBuildingAvailable?.message as string
            }
          />
          <DropDownList
            label="Reading Room Available?"
            name="readingRoomAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.readingRoomAvailable?.message as string
            }
          />
          <TextBox
            label="Reading Room Dimensions (if yes)"
            placeholder="Dimensions"
            {...register('readingRoomDimensions')}
            errorMessage={
              formState.errors.readingRoomDimensions?.message as string
            }
          />
          <DropDownList
            label="Library Staff Available?"
            name="libraryStaffAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.libraryStaffAvailable?.message as string
            }
          />
          <DropDownList
            label="Books Issued Regularly?"
            name="booksIssuedRegularly"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.booksIssuedRegularly?.message as string
            }
          />
          <DropDownList
            label="Books Relevant & Latest?"
            name="booksRelevant"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.booksRelevant?.message as string}
          />
          <DropDownList
            label="Journals Subscribed?"
            name="journalsSubscribed"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.journalsSubscribed?.message as string
            }
          />
          <TextBox
            label="Journals Count"
            placeholder="Count"
            {...register('journalsCount')}
            errorMessage={formState.errors.journalsCount?.message as string}
          />
          <DropDownList
            label="Latest Journal Issues Available?"
            name="latestJournalIssues"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.latestJournalIssues?.message as string
            }
          />
        </FormGrid>
      </FormCard>

      <FormCard title="7C — STUDENT PASS / FAIL RECORD" icon="chart-bar">
        <TextBox
          label="Student count and pass/fail ratio (course-wise, year-wise)"
          placeholder="Enter Record"
          {...register('studentPassFailRecord')}
          errorMessage={
            formState.errors.studentPassFailRecord?.message as string
          }
        />
      </FormCard>

      <FormCard title="7D — LABORATORY (IF APPLICABLE)" icon="box">
        <FormGrid columns={3}>
          <DropDownList
            label="Laboratory Required?"
            name="laboratoryRequired"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.laboratoryRequired?.message as string
            }
          />
          <TextBox
            label="Lab Floor Space"
            placeholder="Space Details"
            {...register('labFloorSpace')}
            errorMessage={formState.errors.labFloorSpace?.message as string}
          />
          <DropDownList
            label="Lab Exclusive For Course?"
            name="labExclusive"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.labExclusive?.message as string}
          />
        </FormGrid>
        <div className="flex flex-col gap-4 mt-4">
          <TextBox
            label="Light & Air Conditions"
            placeholder="Details"
            {...register('lightAirConditions')}
            errorMessage={
              formState.errors.lightAirConditions?.message as string
            }
          />
          <TextBox
            label="Number & Description of Lab Equipment"
            placeholder="Details"
            {...register('labEquipmentDetails')}
            errorMessage={
              formState.errors.labEquipmentDetails?.message as string
            }
          />
          <TextBox
            label="Workshop Details"
            placeholder="Details"
            {...register('workshopDetails')}
            errorMessage={formState.errors.workshopDetails?.message as string}
          />
          <TextBox
            label="Hospital Availability (Paramedical / Medical)"
            placeholder="Details"
            {...register('hospitalAvailability')}
            errorMessage={
              formState.errors.hospitalAvailability?.message as string
            }
          />
        </div>
      </FormCard>

      <FormCard title="7E — SPORTS & PHYSICAL WELFARE" icon="heart">
        <FormGrid columns={3}>
          <DropDownList
            label="Sports Facility Available?"
            name="sportsFacilityAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.sportsFacilityAvailable?.message as string
            }
          />
          <DropDownList
            label="Adequate for Students?"
            name="adequateForStudents"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.adequateForStudents?.message as string
            }
          />
          <DropDownList
            label="Outdoor Games Facility?"
            name="outdoorGamesFacility"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.outdoorGamesFacility?.message as string
            }
          />
          <DropDownList
            label="Outdoor Facilities in Use?"
            name="outdoorFacilitiesInUse"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.outdoorFacilitiesInUse?.message as string
            }
          />
          <DropDownList
            label="Sports Consumables Provided?"
            name="sportsConsumablesProvided"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.sportsConsumablesProvided?.message as string
            }
          />
          <DropDownList
            label="Medical Attendant Available?"
            name="medicalAttendantAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.medicalAttendantAvailable?.message as string
            }
          />
          <DropDownList
            label="Emergency Medicine Stock?"
            name="emergencyMedicineStock"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.emergencyMedicineStock?.message as string
            }
          />
          <DropDownList
            label="First Aid Facility?"
            name="firstAidFacility"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.firstAidFacility?.message as string}
          />
          <DropDownList
            label="Hostel Available?"
            name="hostelAvailable"
            control={control}
            placeholder="Select"
            data={yesNoOptions}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.hostelAvailable?.message as string}
          />
        </FormGrid>
        <div className="mt-4">
          <TextBox
            label="Accommodation Availability (if hostel)"
            placeholder="Details"
            {...register('accommodationAvailability')}
            errorMessage={
              formState.errors.accommodationAvailability?.message as string
            }
          />
        </div>
      </FormCard>
    </>
  );
}
