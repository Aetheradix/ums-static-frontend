declare namespace Master.HR {
  // Caste
  interface CasteForm {
    name: string;
    isActive: boolean;
  }
  type CasteItem = Data.WithId<CasteForm>;

  // Post
  interface PostForm {
    name: string;
    code: string;
    isActive: boolean;
  }
  type PostItem = Data.WithId<PostForm>;

  // Qualification
  interface QualificationForm {
    name: string;
    subject: string;
    code: string;
    isActive: boolean;
  }
  type QualificationItem = Data.WithId<QualificationForm>;

  // Religion
  interface ReligionForm {
    name: string;
    isActive: boolean;
  }
  type ReligionItem = Data.WithId<ReligionForm>;

  // DesignationType
  interface DesignationTypeForm {
    name: string;
    code: string;
    isActive: boolean;
  }
  type DesignationTypeItem = Data.WithId<DesignationTypeForm>;

  // Designation
  interface DesignationForm {
    classId: string | number;
    postId: string | number;
    designationTypeId: string | number;
    name: string;
    code: string;
    sequenceNumber: number;
    isActive: boolean;
  }
  type DesignationItem = Data.WithId<DesignationForm>;

  // Section
  interface SectionForm {
    name: string;
    code: string;
    isActive: boolean;
  }
  type SectionItem = Data.WithId<SectionForm>;

  // Class
  interface ClassForm {
    name: string;
    code: string;
    isActive: boolean;
  }
  type ClassItem = Data.WithId<ClassForm>;
}
