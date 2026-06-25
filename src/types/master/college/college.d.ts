declare namespace CollegeMaster {
  interface CollegeTypeForm {
    name: string;
  }

  type CollegeTypeItem = Data.WithId<
    CollegeTypeForm & {
      isActive: boolean;
      createdBy?: string;
      createdOn?: string;
      ipAddress?: string;
    }
  >;

  interface CollegeCategoryForm {
    name: string;
    collegeTypeId: number;
  }

  type CollegeCategoryItem = Data.WithId<
    CollegeCategoryForm & {
      isActive: boolean;
      createdBy?: string;
      createdOn?: string;
      ipAddress?: string;
    }
  >;

  interface AvailableFacilityForm {
    facilityName: string;
  }

  type AvailableFacilityItem = Data.WithId<
    AvailableFacilityForm & {
      isActive: boolean;
    }
  >;
}
