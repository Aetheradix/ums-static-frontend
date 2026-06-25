declare namespace Master {
  namespace Scheme {
    interface SchemeForm {
      name: string;
      code: string;
      schemeTypeId: number;
      schemeCategoryId: number;
      isActive: boolean;
    }
    interface SchemeTypeForm {
      name: string;
      isActive: boolean;
    }
    interface SchemeCategoryForm {
      name: string;
      schemeTypeId: number;
      isActive: boolean;
    }

    type SchemeItem = Data.WithId<Master.Scheme.SchemeForm>;
    type SchemeTypeItem = Data.WithId<Master.Scheme.SchemeTypeForm>;
    type SchemeCategoryItem = Data.WithId<Master.Scheme.SchemeCategoryForm>;
  }
}
