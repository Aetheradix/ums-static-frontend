import { FormPage } from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import TeachingReport from '../../components/TeachingReport';
import { DeptSwitcher } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';

export default function Reports() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  return (
    <FormPage
      title="Teaching Report"
      description="Faculty-wise days present, theory lectures and practicals taught in your department."
      breadcrumbs={crumbs('department', 'Reports')}
      headerAction={<DeptSwitcher />}
    >
      <TeachingReport department={dept} />
    </FormPage>
  );
}
