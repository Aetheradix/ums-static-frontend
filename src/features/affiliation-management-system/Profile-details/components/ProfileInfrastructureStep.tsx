import { useWatch } from 'react-hook-form';
import type {
  Control,
  FormState,
  Path,
  UseFormSetValue,
} from 'react-hook-form';
import { Button } from 'shared/components/buttons';
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
  setValue: UseFormSetValue<ProfileDetailsFormData>;
}

export default function ProfileInfrastructureStep({
  register,
  control,
  formState,
  setValue,
}: ProfileInfrastructureStepProps) {
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setValue('latitude', lat.toString(), { shouldValidate: true });
          setValue('longitude', lng.toString(), { shouldValidate: true });
        },
        error => {
          console.error(error);
          alert('Location access denied or an error occurred!');
        }
      );
    } else {
      alert('Your browser does not support Geolocation!');
    }
  };
  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const isRentedBuilding = useWatch({
    control,
    name: 'isRentedBuilding',
  });

  const affiliationType = useWatch({
    control,
    name: 'affiliationType',
  });

  const isLaboratoryRequired = useWatch({
    control,
    name: 'laboratoryRequired',
  });

  const isSportsFacilityAvailable = useWatch({
    control,
    name: 'sportsFacilityAvailable',
  });

  const isHostelAvailable = useWatch({
    control,
    name: 'hostelAvailable',
  });

  const typeOfHostel = useWatch({
    control,
    name: 'typeOfHostel',
  });

  const isReadingRoomAvailable = useWatch({
    control,
    name: 'readingRoomAvailable',
  });

  const isLibraryBuildingAvailable = useWatch({
    control,
    name: 'libraryBuildingAvailable',
  });

  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 6: Infrastructure & Building
      </div>
      <FormCard title="INFRASTRUCTURE & BUILDING DETAILS" icon="building">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Basic Information
          </h3>
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
              errorMessage={
                formState.errors.isRentedBuilding?.message as string
              }
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
          {isRentedBuilding === 'no' && (
            <div className="mt-4">
              <FileUpload
                label="Registry Document"
                name="registryDocument"
                control={control}
                mode="file"
                accept=".pdf,image/*"
                errorMessage={
                  formState.errors.registryDocument?.message as string
                }
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Construction & Accommodation
          </h3>
          <FormGrid columns={2}>
            <TextBox
              label="Quality of Building & Surroundings"
              placeholder="Enter Quality Details"
              {...register('qualityOfBuilding')}
              errorMessage={
                formState.errors.qualityOfBuilding?.message as string
              }
            />
            <TextBox
              label="Provision to construct own building"
              placeholder="Enter Details"
              {...register('provisionToConstruct')}
              errorMessage={
                formState.errors.provisionToConstruct?.message as string
              }
            />
          </FormGrid>
          <div className="mt-4">
            <TextBox
              label="Built - up Accommodation Details (Rooms, Verandah, etc.)"
              placeholder="Enter Accommodation Details"
              {...register('accommodationDetails')}
              errorMessage={
                formState.errors.accommodationDetails?.message as string
              }
            />
          </div>
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                College Location Coordinates
              </h3>
              <Button
                type="button"
                variant="outlined"
                icon="map-marker"
                label="Get Current Location"
                onClick={handleGetLocation}
              />
            </div>
            <FormGrid columns={2}>
              <TextBox
                label="Latitude"
                placeholder="e.g., 22.7196"
                {...register('latitude')}
                errorMessage={formState.errors.latitude?.message as string}
              />
              <TextBox
                label="Longitude"
                placeholder="e.g., 75.8577"
                {...register('longitude')}
                errorMessage={formState.errors.longitude?.message as string}
              />
            </FormGrid>
          </div>
        </div>
      </FormCard>

      <div className="mt-6">
        <FormCard title="FACILITIES & ENVIRONMENT" icon="compass">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              Classrooms & Accessibility
            </h3>
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
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              Campus Environment
            </h3>
            <FormGrid columns={3}>
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
                label="Is campus shared with another college?"
                name="sharedCampus"
                control={control}
                placeholder="Select"
                data={yesNoOptions}
                textField="name"
                valueField="id"
                errorMessage={formState.errors.sharedCampus?.message as string}
              />
            </FormGrid>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              Neighbourhood Relations
            </h3>
            <FormGrid columns={2}>
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
              <TextBox
                label="Neighbour Complaints / Reputation Remarks"
                placeholder="Enter Remarks"
                {...register('neighbourComplaintsRemarks')}
                errorMessage={
                  formState.errors.neighbourComplaintsRemarks?.message as string
                }
              />
            </FormGrid>
          </div>
        </FormCard>
      </div>

      <div className="mb-4 mt-6 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 7: Library & Facilities (Proposed Course)
      </div>

      <FormCard title="7A — LIBRARY & READING ROOM" icon="book">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Library Details
          </h3>
          <FormGrid columns={isLibraryBuildingAvailable === 'yes' ? 2 : 1}>
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
            {isLibraryBuildingAvailable === 'yes' && (
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
            )}
          </FormGrid>
        </div>

        {isLibraryBuildingAvailable === 'yes' && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
                Books Information
              </h3>
              <FormGrid columns={2}>
                <TextBox
                  label="Library Books Count"
                  placeholder="Count"
                  {...register('libraryBooksCount')}
                  errorMessage={
                    formState.errors.libraryBooksCount?.message as string
                  }
                />
                <TextBox
                  label="Book / Student Ratio"
                  placeholder="Ratio"
                  {...register('bookStudentRatio')}
                  errorMessage={
                    formState.errors.bookStudentRatio?.message as string
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
                  errorMessage={
                    formState.errors.booksRelevant?.message as string
                  }
                />
              </FormGrid>
            </div>
          </>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Journals
          </h3>
          <FormGrid columns={3}>
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
        </div>

        {isLibraryBuildingAvailable === 'yes' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              Reading Room
            </h3>
            <FormGrid columns={isReadingRoomAvailable === 'yes' ? 2 : 1}>
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
              {isReadingRoomAvailable === 'yes' && (
                <TextBox
                  label="Reading Room Dimensions (if yes)"
                  placeholder="Dimensions"
                  {...register('readingRoomDimensions')}
                  errorMessage={
                    formState.errors.readingRoomDimensions?.message as string
                  }
                />
              )}
            </FormGrid>
          </div>
        )}
      </FormCard>

      <FormCard title="7B — LABORATORY (IF APPLICABLE)" icon="box">
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
          {isLaboratoryRequired === 'yes' && (
            <>
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
            </>
          )}
        </FormGrid>

        {isLaboratoryRequired === 'yes' && (
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
        )}
      </FormCard>

      {String(affiliationType) !== '1' && (
        <FormCard title="7C — STUDENT PASS / FAIL RECORD" icon="chart-bar">
          <div className="mb-6">
            <TextBox
              label="Student count and pass/fail ratio (course-wise, year-wise)"
              placeholder="Enter Record"
              {...register('studentPassFailRecord')}
              errorMessage={
                formState.errors.studentPassFailRecord?.message as string
              }
            />
          </div>
        </FormCard>
      )}

      <FormCard title="7D — SPORTS & PHYSICAL WELFARE" icon="bolt">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Sports & Games
          </h3>
          <FormGrid columns={2}>
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
          </FormGrid>

          {isSportsFacilityAvailable === 'yes' && (
            <div className="mt-4">
              <FormGrid columns={2}>
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
                    formState.errors.sportsConsumablesProvided
                      ?.message as string
                  }
                />
              </FormGrid>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
            Medical & Emergency
          </h3>
          <FormGrid columns={3}>
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
              errorMessage={
                formState.errors.firstAidFacility?.message as string
              }
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard title="7E — HOSTEL & ACCOMMODATION" icon="home">
        <div>
          <FormGrid columns={2}>
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
            {isHostelAvailable === 'yes' && (
              <>
                <DropDownList
                  label="Type of Hostel"
                  name="typeOfHostel"
                  control={control}
                  placeholder="Select Type"
                  data={[
                    { id: 'boys', name: 'Boys' },
                    { id: 'girls', name: 'Girls' },
                    { id: 'coed', name: 'Co-ed' },
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.typeOfHostel?.message as string
                  }
                />
                {(typeOfHostel === 'boys' || typeOfHostel === 'coed') && (
                  <TextBox
                    label="Boys Hostels Count"
                    placeholder="e.g. 1"
                    {...register('boysHostelsCount')}
                    errorMessage={
                      formState.errors.boysHostelsCount?.message as string
                    }
                  />
                )}
                {(typeOfHostel === 'girls' || typeOfHostel === 'coed') && (
                  <TextBox
                    label="Girls Hostels Count"
                    placeholder="e.g. 1"
                    {...register('girlsHostelsCount')}
                    errorMessage={
                      formState.errors.girlsHostelsCount?.message as string
                    }
                  />
                )}
                <TextBox
                  label="Total Capacity (Students)"
                  placeholder="e.g. 150"
                  {...register('totalHostelCapacity')}
                  errorMessage={
                    formState.errors.totalHostelCapacity?.message as string
                  }
                />
                <DropDownList
                  label="Accommodation Availability (if hostel)"
                  name="accommodationAvailability"
                  control={control}
                  placeholder="Select"
                  data={yesNoOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.accommodationAvailability
                      ?.message as string
                  }
                />
              </>
            )}
          </FormGrid>
        </div>
      </FormCard>
    </>
  );
}
