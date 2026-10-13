import { FormPage } from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import TeachingReport from '../../components/TeachingReport';

export default function Reports() {
  return (
    <FormPage
      title="Teaching Report"
      description="Faculty-wise lectures and practicals taught across all University Teaching Departments."
      breadcrumbs={crumbs('headOffice', 'Reports')}
    >
      <TeachingReport />
    </FormPage>
  );
}
