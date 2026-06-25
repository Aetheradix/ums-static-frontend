declare namespace Master {
  // Academic Year
  interface AcademicYearForm {
    name: string;
    code: string;
    isActive: boolean;
  }
  type AcademicYearItem = Data.WithId<AcademicYearForm>;
}
