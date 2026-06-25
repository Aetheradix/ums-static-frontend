declare namespace Master {
  namespace Grant {
    interface GrantTypeForm {
      name: string;
      isActive: boolean;
    }

    type GrantTypeItem = Data.WithId<GrantTypeForm>;

    interface GrantCategoryForm {
      name: string;
      grantTypeId: number;
      isActive: boolean;
    }

    type GrantCategoryItem = Data.WithId<GrantCategoryForm>;

    interface EligibilityApplicationProcessForm {
      grantTypeId: number;
      grantCategoryId: number;
      eligibilityText: string;
      applicationProcessText: string;
      approvalProcessText: string;
      isActive: boolean;
    }

    type EligibilityApplicationProcessItem =
      Data.WithId<EligibilityApplicationProcessForm>;
  }
}
