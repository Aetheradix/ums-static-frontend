import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
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
  const navigate = useNavigate();
  const { data, isLoading } = useCasesQuery();

  return (
    <FormPage
      title="Case Register"
      description="All university legal cases — filter, register and drill into case details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Administrator', to: legalUrls.admin.portal },
        { label: 'Case Register' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search by case no., title or court..."
          toolbar={
            <Button
              label="Register Case"
              icon="plus"
              variant="outlined"
              onClick={() => navigate(legalUrls.admin.caseNew)}
            />
          }
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
            {
              header: 'Status',
              cell: (item: LegalCase) => (
                <StatusBadge
                  label={item.status}
                  variant={caseStatusVariant(item.status)}
                />
              ),
            },
            { field: 'filingDate', header: 'Filed On' },
            {
              header: 'Actions',
              width: '150px',
              cell: (item: LegalCase) => (
                <div className="flex items-center gap-2">
                  <Button
                    icon="eye"
                    variant="text"
                    size="small"
                    tooltip="View"
                    ariaLabel="View case"
                    onClick={() =>
                      navigate(legalUrls.admin.caseDetail(item.id))
                    }
                  />
                  <Button
                    icon="pencil"
                    variant="text"
                    size="small"
                    tooltip="Edit"
                    ariaLabel="Edit case"
                    onClick={() => navigate(legalUrls.admin.caseEdit(item.id))}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
