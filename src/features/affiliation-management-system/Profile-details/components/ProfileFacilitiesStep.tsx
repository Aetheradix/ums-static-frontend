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
import { LAB_TYPE_DATA } from '../../settings/lab-type/data';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileFacilitiesStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
  labsArray: any;
  hostelsArray: any;
  trigger?: any;
}

// Lab types come from the Lab Type master (Affiliation Settings → Lab Types).
const labTypeOptions = LAB_TYPE_DATA.filter(item => item.isActive).map(
  item => ({ id: item.labTypeName, name: item.labTypeName })
);

const hostelTypeOptions = [
  { id: 'boys', name: 'Boys Hostel' },
  { id: 'girls', name: 'Girls Hostel' },
];

export default function ProfileFacilitiesStep({
  register,
  control,
  formState,
  labsArray,
  hostelsArray,
  trigger,
}: ProfileFacilitiesStepProps) {
  const { fields: labFields, append: appendLab, remove: removeLab } = labsArray;
  const {
    fields: hostelFields,
    append: appendHostel,
    remove: removeHostel,
  } = hostelsArray;

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [editingLabIndex, setEditingLabIndex] = useState<number | null>(null);

  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostelIndex, setEditingHostelIndex] = useState<number | null>(
    null
  );

  const yesNoOptions = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  const labsWatch = useWatch({ control, name: 'labs' });
  const hostelsWatch = useWatch({ control, name: 'hostels' });
  const affiliationType = useWatch({ control, name: 'affiliationType' });
  const isLaboratoryRequired = useWatch({
    control,
    name: 'laboratoryRequired',
  });
  const isSportsFacilityAvailable = useWatch({
    control,
    name: 'sportsFacilityAvailable',
  });
  const isHostelAvailable = useWatch({ control, name: 'hostelAvailable' });
  const isReadingRoomAvailable = useWatch({
    control,
    name: 'readingRoomAvailable',
  });
  const isLibraryBuildingAvailable = useWatch({
    control,
    name: 'libraryBuildingAvailable',
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
      <FormCard title="CLASSROOM DETAILS" icon="building">
        <FormGrid columns={3}>
          <TextBox
            label="Count of Classrooms"
            placeholder="e.g. 24"
            {...register('classroomCount')}
            errorMessage={formState.errors.classroomCount?.message as string}
          />
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
            errorMessage={formState.errors.securityProblems?.message as string}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Classroom Details"
            subLabel="Total rooms, room-wise floor space, natural light/air & equipment fitted in each room"
            placeholder="Describe classrooms: count, floor space, light & air, fitted equipment"
            rows={3}
            {...register('classroomDetails')}
            errorMessage={formState.errors.classroomDetails?.message as string}
          />
        </div>
      </FormCard>

      <FormCard title="LABORATORY DETAILS" icon="box">
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
                    cell: (item: any) => item.labType || '',
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

            {/* <TextBox
              label="Hospital Availability (In case of Paramedical / Medical)"
              placeholder="Details"
              {...register('hospitalAvailability')}
              errorMessage={
                formState.errors.hospitalAvailability?.message as string
              }
            /> */}
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

      <FormCard title="LIBRARY AND READING ROOM" icon="book">
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
                errorMessage={formState.errors.booksRelevant?.message as string}
              />
            </FormGrid>
          </div>
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

      {['2', '3', '4'].includes(String(affiliationType)) && (
        <FormCard title="STUDENT PASS / FAIL RECORD" icon="chart-bar">
          <TextBox
            label="Student count and pass/fail ratio (course-wise, year-wise)"
            placeholder="Enter Record"
            {...register('studentPassFailRecord')}
            errorMessage={
              formState.errors.studentPassFailRecord?.message as string
            }
          />
        </FormCard>
      )}

      <FormCard title="SPORTS & PHYSICAL WELFARE" icon="bolt">
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
                  formState.errors.sportsConsumablesProvided?.message as string
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
      </FormCard>

      <FormCard title="HOSTEL DETAILS" icon="home">
        <FormGrid columns={1}>
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

        {isHostelAvailable === 'yes' && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-3">
              Add one record per hostel — e.g. separate records for the boys
              hostel and the girls hostel.
            </p>
            <Grid
              data={hostelFields.map((field: any, index: number) => {
                const hostel = hostelsWatch?.[index] || field;
                return { ...hostel, originalIndex: index };
              })}
              columns={[
                {
                  header: 'HOSTEL TYPE',
                  cell: (item: any) =>
                    hostelTypeOptions.find(o => o.id === item.hostelType)
                      ?.name ||
                    item.hostelType ||
                    '',
                },
                {
                  header: 'HOSTEL NAME',
                  cell: (item: any) => item.hostelName || '',
                },
                {
                  header: 'CAPACITY (STUDENTS)',
                  cell: (item: any) => item.capacity || '',
                },
                {
                  header: 'ROOMS',
                  cell: (item: any) => item.roomsCount || '',
                },
                {
                  header: 'WARDEN',
                  cell: (item: any) => item.wardenName || '',
                },
              ]}
              pagination={false}
              onEdit={(item: any) => {
                setEditingHostelIndex(item.originalIndex);
                setIsHostelModalOpen(true);
              }}
              onRemove={(item: any) => removeHostel(item.originalIndex)}
            />
            {formState.errors.hostels?.root?.message && (
              <div className="p-error text-sm mt-2">
                {formState.errors.hostels.root.message}
              </div>
            )}
            <div className="mt-4">
              <Button
                label="Add Hostel"
                icon="plus"
                variant="outlined"
                onClick={() => {
                  appendHostel({
                    hostelType: '',
                    hostelName: '',
                    capacity: '',
                    roomsCount: '',
                    wardenName: '',
                  });
                  setEditingHostelIndex(hostelFields.length);
                  setIsHostelModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        <Modal
          header="Hostel Details"
          visible={isHostelModalOpen}
          onHide={() => {
            if (editingHostelIndex !== null) {
              const currentHostel = hostelsWatch?.[editingHostelIndex];
              if (!currentHostel?.hostelType) {
                removeHostel(editingHostelIndex);
              }
            }
            setIsHostelModalOpen(false);
            setEditingHostelIndex(null);
          }}
          size="large"
        >
          {editingHostelIndex !== null && (
            <div className="p-4">
              <FormGrid columns={2}>
                <DropDownList
                  label="Hostel Type"
                  name={`hostels.${editingHostelIndex}.hostelType`}
                  control={control}
                  placeholder="Select Type"
                  data={hostelTypeOptions}
                  textField="name"
                  valueField="id"
                  errorMessage={
                    formState.errors.hostels?.[editingHostelIndex]?.hostelType
                      ?.message as string
                  }
                  required
                />
                <TextBox
                  label="Hostel Name"
                  placeholder="e.g. Tagore Boys Hostel"
                  {...register(`hostels.${editingHostelIndex}.hostelName`)}
                  errorMessage={
                    formState.errors.hostels?.[editingHostelIndex]?.hostelName
                      ?.message as string
                  }
                />
                <TextBox
                  label="Capacity (Students)"
                  placeholder="e.g. 150"
                  {...register(`hostels.${editingHostelIndex}.capacity`)}
                  errorMessage={
                    formState.errors.hostels?.[editingHostelIndex]?.capacity
                      ?.message as string
                  }
                />
                <TextBox
                  label="Number of Rooms"
                  placeholder="e.g. 50"
                  {...register(`hostels.${editingHostelIndex}.roomsCount`)}
                  errorMessage={
                    formState.errors.hostels?.[editingHostelIndex]?.roomsCount
                      ?.message as string
                  }
                />
                <TextBox
                  label="Warden Name"
                  placeholder="Enter Warden Name"
                  {...register(`hostels.${editingHostelIndex}.wardenName`)}
                  errorMessage={
                    formState.errors.hostels?.[editingHostelIndex]?.wardenName
                      ?.message as string
                  }
                />
              </FormGrid>
              <div className="mt-6 flex justify-end">
                <Button
                  label="Save"
                  onClick={async () => {
                    const currentHostel = hostelsWatch?.[editingHostelIndex];
                    if (!currentHostel?.hostelType) {
                      if (trigger)
                        await trigger(
                          `hostels.${editingHostelIndex}.hostelType`
                        );
                      return;
                    }
                    if (trigger) {
                      const isValid = await trigger(
                        `hostels.${editingHostelIndex}`
                      );
                      if (!isValid) return;
                    }
                    setIsHostelModalOpen(false);
                    setEditingHostelIndex(null);
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
