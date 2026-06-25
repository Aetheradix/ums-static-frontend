declare namespace Master {
  namespace Employee {
    interface EmploymentNatureForm {
      name: string;
      isActive: boolean;
    }

    type EmploymentNatureItem = Data.WithId<EmploymentNatureForm>;

    interface OrganizationUnitForm {
      name: string;
      isActive: boolean;
    }
    type OrganizationUnitItem = Data.WithId<OrganizationUnitForm>;
    interface ActionOptionForm {
      name: string;
      description: string;
      isActive: boolean;
    }

    type ActionOptionItem = Data.WithId<ActionOptionForm>;

    interface SeparationReasonTypeForm {
      name: string;
      type: string;
      isActive: boolean;
    }

    type SeparationReasonTypeItem = Data.WithId<SeparationReasonTypeForm>;
    interface ActionOptionReasonForm {
      actionOptionId: number;
      actionOptionName?: string;
      name: string;
      description: string;
      isActive: boolean;
    }

    type ActionOptionReasonItem = Data.WithId<ActionOptionReasonForm>;

    interface DocumentOptionsForm {
      name: string;
      isActive: boolean;
    }
    type DocumentOptionsItem = Data.WithId<DocumentOptionsForm>;

    interface TravelPurposeForm {
      name: string;
      isActive: boolean;
    }

    interface SubjectSpecializationForm {
      name: string;
      isActive: boolean;
    }

    type SubjectSpecializationItem = Data.WithId<SubjectSpecializationForm>;

    interface TravelPurposeForm {
      name: string;
      isActive: boolean;
    }

    type TravelPurposeItem = Data.WithId<TravelPurposeForm>;

    interface EmployeeGroupForm {
      name: string;
      description: string;
      isActive: boolean;
    }

    type EmployeeGroupItem = Data.WithId<EmployeeGroupForm>;
  }
}
