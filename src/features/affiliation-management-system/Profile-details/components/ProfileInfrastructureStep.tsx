import { useState } from 'react';
import type { Control, FormState, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { Grid } from 'shared/components/grid';
import { Modal } from 'shared/components/popups';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileInfrastructureStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  labsArray: any;
  trigger?: any;
}

const labTypeOptions = [
  { id: 'chemistry', name: 'Chemistry Lab' },
  { id: 'biology', name: 'Biology Lab' },
  { id: 'physics', name: 'Physics Lab' },
  { id: 'computer', name: 'Computer Lab' },
];

export default function ProfileInfrastructureStep({
  register,
  control,
  formState,
  labsArray,
  trigger,
}: ProfileInfrastructureStepProps) {
  const { fields: labFields, append: appendLab, remove: removeLab } = labsArray;

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [editingLabIndex, setEditingLabIndex] = useState<number | null>(null);

  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const labsWatch = useWatch({
    control,
    name: 'labs',
  });

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

  const isSharedCampus = useWatch({
    control,
    name: 'sharedCampus',
  });

  const isJournalsSubscribed = useWatch({
    control,
    name: 'journalsSubscribed',
  });

  const isPlaygroundAvailable = useWatch({
    control,
    name: 'playgroundAvailable',
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
            {/* <TextBox
              label="Provision to construct own building"
              placeholder="Enter Details"
              {...register('provisionToConstruct')}
              errorMessage={
                formState.errors.provisionToConstruct?.message as string
              }
            /> */}
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
          <div className="mt-4">
            <FileUpload
              label="College Building Photo"
              name="accommodationPhoto"
              control={control}
              mode="photo"
              accept="image/*"
              errorMessage={
                formState.errors.accommodationPhoto?.message as string
              }
            />
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
              <DropDownList
                label="Security concerns for exams if away from District HQ?"
                subLabel="Exam halls, safe custody of papers, invigilators & center superintendent"
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
            </div>
            <div className="mt-4">
              <TextArea
                label="Classroom Details"
                subLabel="Total rooms, room-wise floor space, natural light/air & equipment fitted in each room"
                placeholder="Describe classrooms: count, floor space, light & air, fitted equipment"
                rows={3}
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
            <FormGrid columns={2}>
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
            {isSharedCampus === 'yes' && (
              <div className="mt-4">
                <TextBox
                  label="Shared Area"
                  placeholder="Enter approximate area shared with the other college"
                  {...register('sharedCampusArea')}
                  errorMessage={
                    formState.errors.sharedCampusArea?.message as string
                  }
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              Neighbourhood Relations
            </h3>
            <FormGrid columns={2}>
              <DropDownList
                label="Neighbour complaints of recurring nuisance?"
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
                label="Neighbourhood Opinion / Remark"
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
        Section 7: Library and Reading Room
      </div>

      <FormCard title="7A — LIBRARY AND READING ROOM" icon="book">
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
          {isLibraryBuildingAvailable === 'yes' && (
            <div className="mt-4">
              <FileUpload
                label="Library Building Photo"
                name="libraryBuildingPhoto"
                control={control}
                mode="photo"
                accept="image/*"
                errorMessage={
                  formState.errors.libraryBuildingPhoto?.message as string
                }
              />
            </div>
          )}
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
                  label="Books Issued Regularly to Students?"
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
          <FormGrid columns={isJournalsSubscribed === 'yes' ? 3 : 1}>
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
            {isJournalsSubscribed === 'yes' && (
              <>
                <TextBox
                  label="Journals Count"
                  placeholder="Count"
                  {...register('journalsCount')}
                  errorMessage={
                    formState.errors.journalsCount?.message as string
                  }
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
              </>
            )}
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
            {isReadingRoomAvailable === 'yes' && (
              <div className="mt-4">
                <FileUpload
                  label="Reading Room Photo"
                  name="readingRoomPhoto"
                  control={control}
                  mode="photo"
                  accept="image/*"
                  errorMessage={
                    formState.errors.readingRoomPhoto?.message as string
                  }
                />
              </div>
            )}
          </div>
        )}
      </FormCard>

      <FormCard title="7B — LABORATORY (IF APPLICABLE)" icon="box">
        <FormGrid columns={1}>
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
        </FormGrid>

        {isLaboratoryRequired === 'yes' && (
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Lab-wise Details
              </h4>
              <Grid
                data={labFields.map((field: any, index: number) => {
                  const lab = labsWatch?.[index] || field;
                  return { ...lab, originalIndex: index };
                })}
                columns={[
                  {
                    header: 'LAB TYPE',
                    cell: (item: any) =>
                      labTypeOptions.find(o => o.id === item.labType)?.name ||
                      item.labType ||
                      '',
                  },
                  {
                    header: 'FLOOR SPACE',
                    cell: (item: any) => item.labFloorSpace || '',
                  },
                  {
                    header: 'EXCLUSIVE FOR COURSE',
                    cell: (item: any) =>
                      yesNoOptions.find(o => o.id === item.labExclusive)
                        ?.name ||
                      item.labExclusive ||
                      '',
                  },
                  {
                    header: 'LIGHT & AIR',
                    cell: (item: any) => item.lightAirConditions || '',
                  },
                  {
                    header: 'EQUIPMENT',
                    cell: (item: any) => item.labEquipmentDetails || '',
                  },
                  {
                    header: 'PHOTO',
                    cell: (item: any) =>
                      item.labPhoto ? item.labPhoto.name || 'Uploaded' : '—',
                  },
                ]}
                pagination={false}
                onEdit={(item: any) => {
                  setEditingLabIndex(item.originalIndex);
                  setIsLabModalOpen(true);
                }}
                onRemove={(item: any) => removeLab(item.originalIndex)}
              />
              {formState.errors.labs?.root?.message && (
                <div className="p-error text-sm mt-2">
                  {formState.errors.labs.root.message}
                </div>
              )}
              <div className="mt-4">
                <Button
                  label="Add Lab"
                  icon="plus"
                  variant="outlined"
                  onClick={() => {
                    appendLab({
                      labType: '',
                      labFloorSpace: '',
                      labExclusive: '',
                      lightAirConditions: '',
                      labEquipmentDetails: '',
                      labPhoto: null,
                    });
                    setEditingLabIndex(labFields.length);
                    setIsLabModalOpen(true);
                  }}
                />
              </div>
            </div>

            <TextBox
              label="Hospital Availability (In case of Paramedical / Medical)"
              placeholder="Details"
              {...register('hospitalAvailability')}
              errorMessage={
                formState.errors.hospitalAvailability?.message as string
              }
            />
          </div>
        )}

        <Modal
          header="Laboratory Details"
          visible={isLabModalOpen}
          onHide={() => {
            if (editingLabIndex !== null) {
              const currentLab = labsWatch?.[editingLabIndex];
              if (!currentLab?.labType) {
                removeLab(editingLabIndex);
              }
            }
            setIsLabModalOpen(false);
            setEditingLabIndex(null);
          }}
          size="large"
        >
          {editingLabIndex !== null && (
            <div className="p-4">
              <FormGrid columns={2}>
                <DropDownList
                  label="Lab Type"
                  name={`labs.${editingLabIndex}.labType`}
                  control={control}
                  placeholder="Select Lab Type"
                  data={labTypeOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]?.labType
                      ?.message as string
                  }
                  required
                />
                <TextBox
                  label="Lab Floor Space"
                  placeholder="Space Details"
                  {...register(`labs.${editingLabIndex}.labFloorSpace`)}
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]?.labFloorSpace
                      ?.message as string
                  }
                />
                <DropDownList
                  label="Lab Exclusive For Course?"
                  name={`labs.${editingLabIndex}.labExclusive`}
                  control={control}
                  placeholder="Select"
                  data={yesNoOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]?.labExclusive
                      ?.message as string
                  }
                />
                <TextBox
                  label="Light & Air"
                  placeholder="Details"
                  {...register(`labs.${editingLabIndex}.lightAirConditions`)}
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]?.lightAirConditions
                      ?.message as string
                  }
                />
                <TextBox
                  label="Number & Description of Lab Equipment"
                  placeholder="Details"
                  {...register(`labs.${editingLabIndex}.labEquipmentDetails`)}
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]
                      ?.labEquipmentDetails?.message as string
                  }
                />
                <FileUpload
                  label="Lab Photo"
                  name={`labs.${editingLabIndex}.labPhoto`}
                  control={control}
                  mode="photo"
                  accept="image/*"
                  errorMessage={
                    formState.errors.labs?.[editingLabIndex]?.labPhoto
                      ?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentLab = labsWatch?.[editingLabIndex];
                    if (!currentLab?.labType) {
                      if (trigger)
                        await trigger(`labs.${editingLabIndex}.labType`);
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(`labs.${editingLabIndex}`);
                      if (!isValid) return;
                    }
                    setIsLabModalOpen(false);
                    setEditingLabIndex(null);
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </FormCard>

      {['2', '3', '4'].includes(String(affiliationType)) && (
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
                  subLabel="Based on current & proposed number of students"
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
                  label="Playground Available?"
                  name="playgroundAvailable"
                  control={control}
                  placeholder="Select"
                  data={yesNoOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.playgroundAvailable?.message as string
                  }
                />
                <DropDownList
                  label="Outdoor Game Facility Available?"
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
                  label="Sports Consumables Provided to Students?"
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
              {isPlaygroundAvailable === 'yes' && (
                <div className="mt-4">
                  <FileUpload
                    label="Playground Photo"
                    name="playgroundPhoto"
                    control={control}
                    mode="photo"
                    accept="image/*"
                    errorMessage={
                      formState.errors.playgroundPhoto?.message as string
                    }
                  />
                </div>
              )}
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
                  ]}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.typeOfHostel?.message as string
                  }
                />
                {typeOfHostel === 'boys' && (
                  <TextBox
                    label="Boys Hostels Count"
                    placeholder="e.g. 1"
                    {...register('boysHostelsCount')}
                    errorMessage={
                      formState.errors.boysHostelsCount?.message as string
                    }
                  />
                )}
                {typeOfHostel === 'girls' && (
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
              </>
            )}
          </FormGrid>
        </div>
      </FormCard>
    </>
  );
}
