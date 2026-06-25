declare namespace Master {
  namespace Other {
    interface DegreeLevelForm {
      name: string;
    }

    interface DegreeLevel {
      name: string;
      isActive: boolean;
    }
    type DegreeLevelItem = Data.WithId<DegreeLevel>;

    // Academic-Year
    interface AcademicYearForm {
      name: string;
      session: string;
      isActive: boolean;
    }

    type AcademicYearItem = Data.WithId<AcademicYearForm>;
    interface ProgrammeForm {
      name: string;
      programmeDuration: string;
      degreeLevelId: number;
    }

    // Nationality
    interface NationalityForm {
      name: string;
      isActive: boolean;
    }
    type NationalityItem = Data.WithId<NationalityForm>;

    interface Programme {
      name: string;
      programmeDuration: string;
      degreeLevelId: number;
      degreeLevelName?: string;
      isActive: boolean;
    }
    type ProgrammeItem = Data.WithId<Programme>;

    interface SpecialisationForm {
      name: string;
      programmeId: number;
    }
    interface Specialisation {
      name: string;
      programmeId: number;
      programmeName?: string;
      isActive: boolean;
    }
    type SpecialisationItem = Data.WithId<Specialisation>;

    interface ResidencyStatusItem {
      id: String;
      text: string;
    }
    interface AddressTypeItem {
      id: string;
      text: string;
    }
    interface SemesterItem {
      id: String;
      text: string;
    }
    interface OccupationItem {
      id: string;
      text: string;
    }
    interface GenderItem {
      id: string;
      text: string;
    }
    interface RelationshipItem {
      id: string;
      text: string;
    }
    interface BloodGroupItem {
      id: string;
      text: string;
    }

    // Language-Preferences
    interface LanguagePreferenceItem {
      id: string;
      text: string;
    }
    interface DocumentTypeItem {
      id: string;
      text: string;
    }
    interface ServiceCadreItem {
      id: string;
      text: string;
    }
    interface AppraisalTypeItem {
      id: string;
      text: string;
    }
    interface ExperienceTypeItem {
      id: string;
      text: string;
    }
    interface PatentRecordTypeItem {
      id: string;
      text: string;
    }
    interface PatentStatusItem {
      id: string;
      text: string;
    }
    interface PublicationTypeItem {
      id: string;
      text: string;
    }
    interface PhDStatusItem {
      id: string;
      text: string;
    }
    interface AppraisalApplicationStatusItem {
      id: string;
      text: string;
    }
    interface DayOfWeekItem {
      id: string;
      text: string;
    }
    interface UgcStatusItem {
      id: string;
      text: string;
    }
    interface GroupGrade {
      id: string;
      text: string;
    }
    interface EmployeeType {
      id: string;
      text: string;
    }
    interface MembershipActivityTypeItem {
      id: string;
      text: string;
    }
    interface FinancialSupportTypeItem {
      id: string;
      text: string;
    }
    interface AppraisalApplicationForwardedToTypeItem {
      id: string;
      text: string;
    }
    interface ResearchProjectStatusItem {
      id: string;
      text: string;
    }
    interface SalutationsItem {
      id: string;
      text: string;
    }
    interface MaritalStatusItem {
      id: string;
      text: string;
    }
    interface TravelReasonItem {
      id: string;
      text: string;
    }
    interface StageApplyingItem {
      id: string;
      text: string;
    }
    interface PerformanceRatingItem {
      id: string;
      text: string;
    }
    interface GradingSystemItem {
      id: string;
      text: string;
    }
    interface EstablishmentYearForm {
      name: string;
      isActive: boolean;
    }
    // type EstablishmentYearItem = Data.WithId<EstablishmentYearForm>;
    type EstablishmentYearItem = Data.WithId<
      EstablishmentYearForm & {
        isActive: boolean;
      }
    >;
    interface AccommodationTypeItem {
      id: string;
      text: string;
    }
    interface CollegeAreaItem {
      id: string;
      text: string;
    }
    interface DeficiencyStatusItem {
      id: string;
      text: string;
    }

    type AppointedCategoryItems = Data.DataItem<string>;
  }
}
