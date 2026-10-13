import { FormPage } from 'shared/new-components';
import FacultyRegister from '../../components/FacultyRegister';
import { crumbs } from '../../components/hooks';

export default function Register() {
  return (
    <FormPage
      title="Visiting Faculty Register"
      description="Every joined visiting faculty in the university with the departments linked to their Unique ID."
      breadcrumbs={crumbs('headOffice', 'Faculty Register')}
    >
      <FacultyRegister />
    </FormPage>
  );
}
