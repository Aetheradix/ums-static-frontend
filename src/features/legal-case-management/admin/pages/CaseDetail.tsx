import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import {
  caseStatusVariant,
  hearingStatusVariant,
  paymentStatusVariant,
  type Hearing,
  type Payment,
} from '../../mocks';
import {
  useCasesQuery,
  useHearingsQuery,
  usePaymentsQuery,
} from '../../queries';
import { legalUrls } from '../../urls';
import '../../LegalCase.css';

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="lcm-detail-item">
      <span className="lcm-detail-label">{label}</span>
      <span className="lcm-detail-value">{value || '—'}</span>
    </div>
  );
}

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cases, isLoading } = useCasesQuery();
  const { data: allHearings } = useHearingsQuery();
  const { data: allPayments } = usePaymentsQuery();

  const legalCase = cases.find(c => String(c.id) === id);

  if (!legalCase) {
    return (
      <FormPage
        title="Case Details"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Legal Case Management', to: legalUrls.portal },
          { label: 'Case Register', to: legalUrls.admin.cases },
          { label: 'Details' },
        ]}
      >
        <FormCard>
          <p className="p-4 text-sm text-gray-500">
            {isLoading ? 'Loading case…' : 'Case not found.'}
          </p>
        </FormCard>
      </FormPage>
    );
  }

  const caseHearings = allHearings.filter(h => h.caseId === legalCase.id);
  const casePayments = allPayments.filter(p => p.caseId === legalCase.id);

  const overview = (
    <FormCard>
      <div className="lcm-detail-grid">
        <Field label="Case Number" value={legalCase.caseNumber} />
        <Field label="Title" value={legalCase.title} />
        <Field label="Court" value={legalCase.courtName} />
        <Field label="Case Type" value={legalCase.caseTypeName} />
        <Field label="Party Type" value={legalCase.partyTypeName} />
        <Field label="Assigned Advocate" value={legalCase.advocateName} />
        <Field label="Subject" value={legalCase.subject} />
        <Field label="Filing Date" value={legalCase.filingDate} />
        <Field
          label="Counter-affidavit Date"
          value={legalCase.counterAffidavitDate}
        />
        <Field label="Disposal Date" value={legalCase.disposalDate} />
        <div className="lcm-detail-item">
          <span className="lcm-detail-label">Status</span>
          <span>
            <StatusBadge
              label={legalCase.status}
              variant={caseStatusVariant(legalCase.status)}
            />
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-1">
        <span className="lcm-detail-label">Case Brief</span>
        <p className="text-sm leading-relaxed text-gray-600">
          {legalCase.brief}
        </p>
      </div>
      {legalCase.remarks && (
        <div className="mt-4 flex flex-col gap-1">
          <span className="lcm-detail-label">Remarks</span>
          <p className="text-sm leading-relaxed text-gray-600">
            {legalCase.remarks}
          </p>
        </div>
      )}
    </FormCard>
  );

  const hearingsTab = (
    <FormCard>
      <GridPanel
        data={caseHearings}
        emptyMessage="No hearings recorded for this case."
        columns={[
          { field: 'hearingDate', header: 'Hearing Date' },
          { field: 'attendance', header: 'Attendance' },
          { field: 'notes', header: 'Notes' },
          { field: 'nextHearingDate', header: 'Next Hearing' },
          {
            header: 'Status',
            cell: (h: Hearing) => (
              <StatusBadge
                label={h.status}
                variant={hearingStatusVariant(h.status)}
              />
            ),
          },
        ]}
      />
    </FormCard>
  );

  const paymentsTab = (
    <FormCard>
      <GridPanel
        data={casePayments}
        emptyMessage="No advocate payments logged for this case."
        columns={[
          { field: 'advocateName', header: 'Advocate' },
          { field: 'description', header: 'Description' },
          { field: 'mode', header: 'Mode' },
          {
            header: 'Amount',
            cell: (p: Payment) => (
              <span>₹{p.amount.toLocaleString('en-IN')}</span>
            ),
          },
          { field: 'txnDate', header: 'Txn Date' },
          {
            header: 'Status',
            cell: (p: Payment) => (
              <StatusBadge
                label={p.status}
                variant={paymentStatusVariant(p.status)}
              />
            ),
          },
        ]}
      />
    </FormCard>
  );

  const documentsTab = (
    <FormCard>
      {legalCase.judgmentDoc ? (
        <div className="flex items-center gap-3 p-2">
          <i className="pi pi-file-pdf text-2xl text-rose-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {legalCase.judgmentDoc}
            </span>
            <span className="text-xs text-gray-400">Judgment copy</span>
          </div>
        </div>
      ) : (
        <p className="p-4 text-sm text-gray-500">
          No judgment document uploaded yet.
        </p>
      )}
    </FormCard>
  );

  return (
    <FormPage
      title={legalCase.caseNumber}
      description={legalCase.title}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Register', to: legalUrls.admin.cases },
        { label: legalCase.caseNumber },
      ]}
      headerAction={
        <Button
          label="Edit Case"
          icon="pencil"
          variant="outlined"
          onClick={() => navigate(legalUrls.admin.caseEdit(legalCase.id))}
        />
      }
    >
      <Tabs
        tabs={[
          { title: 'Overview', content: overview },
          {
            title: `Hearings (${caseHearings.length})`,
            content: hearingsTab,
          },
          {
            title: `Payments (${casePayments.length})`,
            content: paymentsTab,
          },
          { title: 'Documents', content: documentsTab },
        ]}
      />
    </FormPage>
  );
}
