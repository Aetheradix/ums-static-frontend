import { ApiService } from 'services';

const Employee_TYPE_URL = `master/employee-type
`;

export function getEmployeeType() {
  return ApiService.getList<Master.Other.EmployeeType>(Employee_TYPE_URL);
}
