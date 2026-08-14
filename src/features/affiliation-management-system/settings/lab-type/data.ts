export interface LabTypeItem {
  labTypeId: number;
  labTypeName: string;
  isActive: boolean;
}

// Master list of laboratory types available in the College Affiliation Form.
export const LAB_TYPE_DATA: LabTypeItem[] = [
  { labTypeId: 1, labTypeName: 'Chemistry Lab', isActive: true },
  { labTypeId: 2, labTypeName: 'Biology Lab', isActive: true },
  { labTypeId: 3, labTypeName: 'Physics Lab', isActive: true },
  { labTypeId: 4, labTypeName: 'Computer Lab', isActive: true },
  { labTypeId: 5, labTypeName: 'Pharmacy Lab', isActive: true },
  { labTypeId: 6, labTypeName: 'Moot Court', isActive: true },
];
