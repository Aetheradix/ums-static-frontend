import { FormPage } from 'shared/new-components';
import FacultyRegister from '../../components/FacultyRegister';
import { crumbs } from '../../components/hooks';
import { useScope } from '../../components/scope';

export default function Faculty() {
  const scope = useScope();
  return (
    <FormPage
      title="Joined Faculty"
      description={
        scope.isHod
          ? `Visiting faculty of ${scope.branch} approved by Registrar & VC. Enter each joining date once — it is final.`
          : `Visiting faculty of ${scope.dept} across all branches. Joining dates are entered by the branch HODs.`
      }
      breadcrumbs={crumbs(scope.login, 'Joined Faculty')}
      headerAction={<scope.Switcher />}
    >
      <FacultyRegister
        department={scope.dept}
        branch={scope.branch}
        canEdit={scope.isHod}
      />
    </FormPage>
  );
}
