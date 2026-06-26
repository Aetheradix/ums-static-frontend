import { FormPage } from 'shared/new-components';
import StudentExamFormWizard from '../../components/StudentExamFormWizard';

export default function StudentExamForm() {
  return (
    <FormPage
      title="Examination Form"
      description="Fill and submit your examination form for the current session"
    >
      <StudentExamFormWizard />
    </FormPage>
  );
}
