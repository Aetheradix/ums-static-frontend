declare namespace Data {
  interface DataItem<T = number> {
    id: T;
    text: string;
  }

  /**
   * Use this type to define a new type with `id` property with union of other properties of `T`.
   * You can also name the property to anything else.
   * @param T A type to create union.
   * @param TKey Name of the property. Default is `id`.
   * @param TId Type of id property. Default is number.
   * @example
   * // This example creates `AcademicYearItem` type merging `{ id: number }`
   * // with `AcademicYear`.
   * interface AcademicYear {
   *  name: string;
   * }
   * // Example 1: AcademicYearItem now will have id property of number type.
   * type AcademicYearItem = Data.WithId<AcademicYear>;
   *
   * // Example 2: AcademicYearItem now will have `academicYearId` property of number type.
   * type AcademicYearItem = Data.WithId<AcademicYear, 'academicYearId'>;
   *
   * // Example 3: AcademicYearItem now will have `academicYearId` property of string type.
   * type AcademicYearItem = Data.WithId<AcademicYear, 'academicYearId', string>;
   */
  type WithId<T, TKey = 'id', TId = number> = {
    [key in TKey]: TId;
  } & T;
}
