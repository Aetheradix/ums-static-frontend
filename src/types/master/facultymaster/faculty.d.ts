declare namespace Master {
  interface Faculty {
    code: string;
    name: string;
    officeTypeId: number;
    officeTypeName?: string;
    departmentId: number;
    departmentName?: string;
    designationId: number;
    designationName?: string;
    joiningDate: Date;
    mobile: string;
    email: string;
    isActive: boolean;
  }

  interface FacultyForm {
    code: string;
    name: string;
    officeTypeId: number;
    departmentId: number;
    designationId: number;
    joiningDate: Date;
    mobile: string;
    email: string;
    isActive: boolean;
  }
  type FacultyItem = Data.WithId<Faculty>;

  interface Department {
    code: string;
    name: string;
    officeTypeId: number;
    hodName: string;
    contactNumber: string;
    isActive: boolean;
    officeTypeName?: string;
  }

  interface DepartmentForm {
    code: string;
    name: string;
    officeTypeId: number;
    hodName: string;
    contactNumber: string;
  }

  type DepartmentItem = Data.WithId<Department>;

  interface OfficeType {
    code: string;
    name: string;
    isActive: boolean;
  }

  interface OfficeTypeForm {
    code: string;
    name: string;
  }

  type OfficeTypeItem = Data.WithId<OfficeType>;

  interface Designation {
    name: string;
    isActive: boolean;
  }

  interface DesignationForm {
    name: string;
  }

  type DesignationItem = Data.WithId<Designation>;
}
