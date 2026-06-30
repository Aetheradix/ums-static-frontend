import { mockDepartments, mockFiles } from './data';

export function generateFileNumber(departmentId: number): string {
  const dept = mockDepartments.find(d => d.id === departmentId);
  const code = dept?.code || 'GEN';
  const year = new Date().getFullYear().toString();
  const seq = (
    mockFiles.filter(f => f.departmentId === departmentId).length + 1
  )
    .toString()
    .padStart(3, '0');
  return `UMS/${code}/${year}/${seq}`;
}
