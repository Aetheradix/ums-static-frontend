import { FormPage } from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { useScope } from '../../components/scope';
import TeachingReport from '../../components/TeachingReport';

export default function Reports() {
  const scope = useScope();
  return (
    <FormPage
      title="Teaching Report"
      description={
        scope.isHod
          ? `Faculty-wise days present, theory lectures and practicals taught in ${scope.branch}.`
          : `Faculty-wise days present, theory lectures and practicals taught in ${scope.dept}, across all branches.`
      }
      breadcrumbs={crumbs(scope.login, 'Reports')}
      headerAction={<scope.Switcher />}
    >
      <TeachingReport department={scope.dept} branch={scope.branch} />
    </FormPage>
  );
}
