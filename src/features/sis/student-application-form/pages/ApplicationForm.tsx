import { FormProvider } from 'react-hook-form';
import { ToastService } from 'services';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage } from 'shared/new-components';
import AcademicInfoStep from '../components/AcademicInfoStep';
import AddressInfoStep from '../components/AddressInfoStep';
import BasicInfoStep from '../components/BasicInfoStep';
import ChoiceFillingStep from '../components/ChoiceFillingStep';
import FatherInfoStep from '../components/FatherInfoStep';
import { useApplicationForm } from '../components/form.hook';
import MotherInfoStep from '../components/MotherInfoStep';
import { useCreateApplicationMutation } from '../queries';
import type {
  ApplicationFormData,
  CreateApplicationCommand,
  PriorEducationApiEntry,
} from '../types';

// Import all required query hooks for dropdown mapping
import { useDesignationsQuery } from 'features/master/faculty/designation/queries';
import { useCastesQuery } from 'features/master/hr/caste/queries';
import { useBlocksQuery } from 'features/master/location/block/queries';
import { useDistrictsQuery } from 'features/master/location/district/queries';
import { useDivisionsQuery } from 'features/master/location/division/queries';
import { useStatesQuery } from 'features/master/location/state/queries';
import { useTehsilsQuery } from 'features/master/location/tehsil/queries';
import { useAcademicYearsQuery } from 'features/master/other/academic-year/queries';
import { useAddressTypeQuery } from 'features/master/other/address-type/queries';
import { useDegreeLevelsQuery } from 'features/master/other/degree-level/queries';
import { useGenderQuery } from 'features/master/other/gender/queries';
import { useNationalitiesQuery } from 'features/master/other/nationality/queries';
import { useOccupationTypeQuery } from 'features/master/other/occupation/queries';
import { useProgrammesQuery } from 'features/master/other/programme/queries';
import { useResidencyStatusesQuery } from 'features/master/other/residency-status/queries';
import { useSpecialisationsQuery } from 'features/master/other/specialisation/queries';
import { useProgrammeModeOfEducationsQuery } from 'features/master/subject/programme-mode-of-education/queries';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function lookupText(
  value: string | number | undefined | null,
  list: any[] | undefined,
  idField: string = 'id',
  textField: string = 'name'
): string {
  if (value === null || value === undefined) return '';
  const item = list?.find(i => String(i[idField]) === String(value));
  return item ? String(item[textField]) : String(value);
}

export default function ApplicationForm() {
  const { mutateAsync, isPending } = useCreateApplicationMutation();

  const { methods, register } = useApplicationForm();
  const { handleSubmit, reset, trigger, control, setValue, formState } =
    methods;

  const { data: academicYears } = useAcademicYearsQuery();
  const { data: programmes } = useProgrammesQuery();
  const { data: castes } = useCastesQuery();
  const { data: degreeLevels } = useDegreeLevelsQuery();
  const { data: specialisations } = useSpecialisationsQuery();
  const { data: genders } = useGenderQuery();
  const { data: residencyStatuses } = useResidencyStatusesQuery();
  const { data: nationalities } = useNationalitiesQuery();
  const { data: addressTypes } = useAddressTypeQuery();
  const { data: states } = useStatesQuery();
  const { data: divisions } = useDivisionsQuery();
  const { data: districts } = useDistrictsQuery();
  const { data: tehsils } = useTehsilsQuery();
  const { data: blocks } = useBlocksQuery();
  const { data: designations } = useDesignationsQuery();
  const { data: occupations } = useOccupationTypeQuery();
  const { data: programModes } = useProgrammeModeOfEducationsQuery();

  const onFormSubmit = handleSubmit(
    async (data: ApplicationFormData) => {
      try {
        const programmeId = Number(data.programme);
        const casteId = Number(data.caste);
        const degreeLevelId = Number(data.degreeLevel);
        const specialisationId = Number(data.specialisation);
        const addressTypeId = Number(data.addressType);
        const stateId = Number(data.state);
        const divisionId = Number(data.division);
        const districtId = Number(data.district);
        const tehsilId = Number(data.tehsil);
        const blockId = Number(data.block);
        const fatherOccId = Number(data.fatherOccupation);
        const fatherDesId = Number(data.fatherDesignation);
        const motherOccId = Number(data.motherOccupation);
        const motherDesId = Number(data.motherDesignation);
        const programOfStudyId = Number(data.programOfStudy);
        const nationalityId = Number(data.nationality);

        const priorEducations: PriorEducationApiEntry[] = (
          data.priorEducations ?? []
        ).map(e => ({
          educationLevel: e.educationLevel,
          institutionName: e.institutionName,
          boardOrUniversity: e.boardOrUniversity,
          passingYear: Number(e.passingYear),
          percentage: e.percentage != null ? Number(e.percentage) : null,
          cgpa: e.cgpa != null ? Number(e.cgpa) : null,
          subjectsOrStream: e.subjectsOrStream,
          documentType: e.documentType,
          documentId: e.documentId ?? null,
        }));

        const payload: CreateApplicationCommand = {
          academicSession: lookupText(
            data.academicSession,
            academicYears,
            'id',
            'session'
          ),
          programmeId,
          programmeName: lookupText(programmeId, programmes, 'id', 'name'),
          basicInfo: {
            firstName: data.firstName,
            middleName: data.middleName || '',
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            gender: lookupText(Number(data.gender), genders, 'id', 'text'),
            casteId,
            casteName: lookupText(casteId, castes, 'id', 'name'),
            dateOfBirth: data.dateOfBirth ? formatDate(data.dateOfBirth) : '',
            age: Number(data.age),
            fatherName: data.fatherName,
            fatherOccupation: lookupText(
              fatherOccId,
              occupations,
              'id',
              'text'
            ),
            fatherDesignation: lookupText(
              fatherDesId,
              designations,
              'id',
              'name'
            ),
            fatherAnnualIncome: Number(data.fatherAnnualIncome),
            fatherContactNumber: data.fatherContactNumber,
            motherName: data.motherName,
            motherOccupation: lookupText(
              motherOccId,
              occupations,
              'id',
              'text'
            ),
            motherDesignation: lookupText(
              motherDesId,
              designations,
              'id',
              'name'
            ),
            motherAnnualIncome: Number(data.motherAnnualIncome),
            motherContactNumber: data.motherContactNumber,
            residencyStatus: lookupText(
              Number(data.residencyStatus),
              residencyStatuses,
              'id',
              'text'
            ),
            ethnicity: data.ethnicity,
            nationalityId,
            nationalityName: lookupText(
              nationalityId,
              nationalities,
              'id',
              'name'
            ),
          },
          academic: {
            degreeLevelId,
            degreeLevelName: lookupText(
              degreeLevelId,
              degreeLevels,
              'id',
              'name'
            ),
            programmeId: programOfStudyId,
            programmeName: lookupText(
              programOfStudyId,
              programModes,
              'id',
              'name'
            ),
            specialisationId,
            specialisationName: lookupText(
              specialisationId,
              specialisations,
              'id',
              'name'
            ),
            priorEducations,
          },
          address: {
            addressType: lookupText(addressTypeId, addressTypes, 'id', 'text'),
            country: data.country,
            stateId,
            stateName: lookupText(stateId, states, 'id', 'name'),
            divisionId,
            divisionName: lookupText(divisionId, divisions, 'id', 'name'),
            districtId,
            districtName: lookupText(districtId, districts, 'id', 'name'),
            tehsilId,
            tehsilName: lookupText(tehsilId, tehsils, 'id', 'name'),
            blockId,
            blockName: lookupText(blockId, blocks, 'id', 'name'),
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            landmark: data.landmark,
            zipcode: Number(data.zipcode),
          },
          choices: data.choiceFilling || [],
        };

        const result = await mutateAsync(payload);
        if (result) {
          ToastService.success('Application submitted successfully.');
          reset();
        }
      } catch {
        ToastService.error('Failed to submit application.');
      }
    },
    errors => {
      console.log('Validation Errors on Save:', errors);
      ToastService.error('Please fix the validation errors in the form.');
    }
  );

  const wizardSteps: WizardStep[] = [
    {
      label: 'Basic Info',
      icon: 'user',
      content: <BasicInfoStep register={register} />,
    },
    {
      label: "Father's Details",
      icon: 'users',
      content: <FatherInfoStep register={register} />,
    },
    {
      label: "Mother's Details",
      icon: 'users',
      content: <MotherInfoStep register={register} />,
    },
    {
      label: 'Academic Info',
      icon: 'book',
      content: (
        <AcademicInfoStep
          register={register}
          control={control}
          setValue={setValue}
          errors={formState.errors}
        />
      ),
    },
    {
      label: 'Choice Filling',
      icon: 'list',
      content: <ChoiceFillingStep control={control} setValue={setValue} />,
    },
    {
      label: 'Address Info',
      icon: 'map-marker',
      content: (
        <AddressInfoStep
          register={register}
          control={control}
          setValue={setValue}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Student Application Form"
      description="Fill in all the required details to submit your application."
    >
      {/* FormProvider makes form context available to PriorEducationCard via useFormContext() */}
      <FormProvider {...methods}>
        <FormWizard
          steps={wizardSteps}
          onComplete={onFormSubmit as () => void}
          isSaving={isPending}
          triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
          onReset={reset}
        />
      </FormProvider>
    </FormPage>
  );
}
