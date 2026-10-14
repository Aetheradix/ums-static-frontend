import { FormPage } from 'shared/new-components';
import FacultyRegister from '../../components/FacultyRegister';
import { crumbs } from '../../components/hooks';
import { DeptSwitcher } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';

export default function Faculty() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  return (
    <FormPage
      title="Joined Faculty"
      description="Visiting faculty approved by Registrar & VC for your department. Only these faculty can be billed."
      breadcrumbs={crumbs('department', 'Joined Faculty')}
      headerAction={<DeptSwitcher />}
    >
      <FacultyRegister department={dept} />
    </FormPage>
  );
}
