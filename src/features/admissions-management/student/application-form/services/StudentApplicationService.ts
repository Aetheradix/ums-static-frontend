import type {
  ApplicationFormData,
  CreateApplicationCommand,
  MasterLookups,
  PriorEducationApiEntry,
  ChoiceFillingItemDto,
} from '../types';
import type { IStudentApplicationRepository } from '../repositories/IStudentApplicationRepository';

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

export class StudentApplicationService {
  private repo: IStudentApplicationRepository;

  constructor(repo: IStudentApplicationRepository) {
    this.repo = repo;
  }

  async getLookups(): Promise<MasterLookups> {
    return this.repo.getLookups();
  }

  async loadDraft(): Promise<ApplicationFormData | null> {
    return this.repo.getDraft();
  }

  async saveDraft(data: ApplicationFormData): Promise<void> {
    await this.repo.saveDraft(data);
  }

  async submitApplication(
    data: ApplicationFormData,
    lookups: MasterLookups
  ): Promise<{ applicationId: number }> {
    const {
      genders,
      castes,
      academicYears,
      programmes,
      degreeLevels,
      specialisations,
      programmeModes,
      occupations,
      designations,
      residencyStatuses,
      nationalities,
      addressTypes,
      states,
      divisions,
      districts,
      tehsils,
      blocks,
    } = lookups;

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
        fatherOccupation: lookupText(fatherOccId, occupations, 'id', 'text'),
        fatherDesignation: lookupText(fatherDesId, designations, 'id', 'name'),
        fatherAnnualIncome: Number(data.fatherAnnualIncome),
        fatherContactNumber: data.fatherContactNumber,
        motherName: data.motherName,
        motherOccupation: lookupText(motherOccId, occupations, 'id', 'text'),
        motherDesignation: lookupText(motherDesId, designations, 'id', 'name'),
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
        nationalityName: lookupText(nationalityId, nationalities, 'id', 'name'),
      },
      academic: {
        degreeLevelId,
        degreeLevelName: lookupText(degreeLevelId, degreeLevels, 'id', 'name'),
        programmeId: programOfStudyId,
        programmeName: lookupText(
          programOfStudyId,
          programmeModes,
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
      choices: (data.choiceFilling as ChoiceFillingItemDto[]) || [],
    };

    return this.repo.submitApplication(payload);
  }

  async uploadDocument(file: File): Promise<string | null> {
    return this.repo.uploadDocument(file);
  }
}
