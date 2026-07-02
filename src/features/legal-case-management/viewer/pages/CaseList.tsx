import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { caseStatusVariant, type LegalCase } from '../../mocks';
import { useCasesQuery } from '../../queries';
import { legalUrls } from '../../urls';

export default function CaseList() {
  const { data, isLoading } = useCasesQuery();

  return (
    <FormPage
      title="Case Register"
      description="Read-only view of all university legal cases."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Viewer', to: legalUrls.viewer.portal },
        { label: 'Case Register' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by case no., title or court..."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'caseNumber', header: 'Case No.', sortable: true },
            { field: 'title', header: 'Title' },
            { field: 'courtName', header: 'Court' },
            { field: 'caseTypeName', header: 'Type' },
            { field: 'partyTypeName', header: 'Party' },
            { field: 'filingDate', header: 'Filed On' },
            {
              header: 'Status',
              cell: (item: LegalCase) => (
                <StatusBadge
                  label={item.status}
                  variant={caseStatusVariant(item.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
