import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button, ButtonPanel } from 'shared/components/buttons';
import {
  DropDownList,
  FileUpload,
  NumberBox,
  TextArea,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { AlertPanel } from 'shared/components/panels';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { formatCurrency } from 'shared/utils/currency';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const FINANCIAL_YEARS = [
  { id: 1, text: '2024-25' },
  { id: 2, text: '2025-26' },
  { id: 3, text: '2026-27' },
];

const BUDGET_HEADS = [
  {
    id: 1,
    text: 'Capital Outlay — University Buildings & Civil Works (4202-01-203)',
    code: '4202-01-203',
    name: 'Capital Outlay — University Buildings & Civil Works',
  },
  {
    id: 2,
    text: 'Revenue Maintenance & Repairs of Hostels/Colleges (2202-03-102)',
    code: '2202-03-102',
    name: 'Revenue Maintenance & Repairs of Hostels/Colleges',
  },
  {
    id: 3,
    text: 'UGC Development Grant — Institutional Infrastructure (UGC-CAP-99)',
    code: 'UGC-CAP-99',
    name: 'UGC Development Grant — Institutional Infrastructure',
  },
  {
    id: 4,
    text: 'Institute Development Fund - Internal Corpus (IDF-GEN-12)',
    code: 'IDF-GEN-12',
    name: 'Institute Development Fund (Internal Corpus)',
  },
  {
    id: 5,
    text: 'RUSA Phase-II Modernization & Lab Complex (RUSA-INF-05)',
    code: 'RUSA-INF-05',
    name: 'RUSA Phase-II Modernization & Lab Complex',
  },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: any }
  | { mode: 'allocate'; item: any };

export default function BudgetAllocation() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    const list = saved ? JSON.parse(saved) : initialWorks;
    return list.map((w: any) => ({
      ...w,
      workRegistrationId: w.workRegistrationId || Number(w.id) || 0,
      workCode:
        w.code || w.workId || `CW-2025-${String(w.id).padStart(3, '0')}`,
      workName: w.name,
      technicalSanctionAmount: w.technicalSanctionAmount || w.tsAmount || 0,
      financialYearId: w.financialYearId || 2,
      financialYear:
        w.financialYear ||
        FINANCIAL_YEARS.find(f => f.id === (w.financialYearId || 2))?.text ||
        '2025-26',
      budgetHeadId: w.budgetHeadId ? Number(w.budgetHeadId) : 1,
      budgetHeadName:
        w.budgetHeadName ||
        BUDGET_HEADS.find(h => h.id === Number(w.budgetHeadId || 1))?.name ||
        'Capital Outlay — University Buildings & Civil Works',
      budgetHeadCode:
        w.budgetHeadCode ||
        BUDGET_HEADS.find(h => h.id === Number(w.budgetHeadId || 1))?.code ||
        '4202-01-203',
      budgetAmount:
        w.budgetAmount ||
        w.allocatedAmount ||
        (w.tsAmount > 0 ? w.tsAmount : 0),
      isLocked:
        w.isLocked === true ||
        w.status === 'BudgetLocked' ||
        w.status === 'Budget Locked',
      remarks: w.remarks || w.budgetRemarks || '',
    }));
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [financialYearId, setFinancialYearId] = useState<number>(2);
  const [budgetHeadId, setBudgetHeadId] = useState<number>(1);
  const [budgetAmount, setBudgetAmount] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isLockedCheckbox, setIsLockedCheckbox] = useState(false);
  const [allocationDoc, setAllocationDoc] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(data));
  }, [data]);

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setBudgetAmount(null);
    setRemarks('');
    setIsLockedCheckbox(false);
    setAllocationDoc(null);
  };

  const isEligibleForAllocation = (c: any) => {
    if (c.canAllocateBudget !== undefined) {
      return c.canAllocateBudget;
    }
    const hasActiveTs = Boolean(
      c.technicalSanctionId ||
      c.tsStatus === 'Approved' ||
      (c.technicalSanctionAmount != null && c.technicalSanctionAmount > 0)
    );
    return hasActiveTs && !c.isLocked;
  };

  const openAllocate = (item: any) => {
    setFinancialYearId(item.financialYearId || 2);
    setBudgetHeadId(item.budgetHeadId || 1);
    const defaultAmt =
      item.budgetAmount && item.budgetAmount > 0
        ? item.budgetAmount
        : item.technicalSanctionAmount && item.technicalSanctionAmount > 0
          ? item.technicalSanctionAmount
          : item.aaAmount && item.aaAmount > 0
            ? item.aaAmount
            : item.estimatedCost || 0;
    setBudgetAmount(defaultAmt);
    setRemarks(item.remarks || '');
    setIsLockedCheckbox(item.isLocked || false);
    setAllocationDoc(null);
    setPopup({ mode: 'allocate', item });
  };

  const openView = (item: any) => {
    setPopup({ mode: 'view', item });
  };

  const handleSaveAllocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (popup.mode !== 'allocate' || !popup.item) return;

    const amt = Number(budgetAmount);
    if (!amt || amt <= 0) {
      ToastService.error('A valid Budget Amount is required.');
      return;
    }

    const fy =
      FINANCIAL_YEARS.find(f => f.id === financialYearId)?.text || '2025-26';
    const head =
      BUDGET_HEADS.find(h => h.id === budgetHeadId) || BUDGET_HEADS[0];
    const targetItem = popup.item;

    setData(prev =>
      prev.map(d =>
        d.workRegistrationId === targetItem.workRegistrationId ||
        d.id === targetItem.id
          ? {
              ...d,
              budgetAllocationId: d.budgetAllocationId || Date.now(),
              financialYearId,
              financialYear: fy,
              budgetHeadId,
              budgetHeadName: head.name,
              budgetHeadCode: head.code,
              budgetAmount: amt,
              allocatedAmount: amt,
              remarks: remarks.trim() || undefined,
              isLocked: isLockedCheckbox,
              status: isLockedCheckbox ? 'BudgetLocked' : 'BudgetAllocated',
              documentName: allocationDoc
                ? allocationDoc.name
                : d.documentName || `Budget_Order_${d.workCode}.pdf`,
            }
          : d
      )
    );

    ToastService.success(
      `Budget allocated: ${formatCurrency(amt)} under [${head.code}]. ${
        isLockedCheckbox
          ? 'Budget Locked for tendering.'
          : 'Allocation recorded.'
      }`
    );
    closePopup();
  };

  return (
    <FormPage
      title="Budget Allocation"
      description="Allocate and lock fiscal expenditure budgets against technically sanctioned civil engineering works."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'Budget Allocation' },
      ]}
    >
      <div className="civil-chain" style={{ marginBottom: '1.25rem' }}>
        <span className="civil-chain-item done">Work Registration</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item done">BOQ Compilation</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item done">Technical Sanction (TS)</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">
          Budget Allocation ← Current
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Tender Oversight</span>
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              field: 'workRegistrationId',
              header: '#',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
              width: '50px',
            },
            {
              field: 'workCode',
              header: 'Work ID',
              cell: (c: any) => (
                <span className="font-mono text-blue-600 font-semibold">
                  {c.workCode || c.code || c.workId}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'workName',
              header: 'Work Name',
              cell: (c: any) => (
                <div>
                  <div className="font-semibold text-gray-900">
                    {c.workName || c.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {c.fundingSourceName || c.fundingSource}
                  </div>
                </div>
              ),
            },
            {
              field: 'technicalSanctionAmount',
              header: 'TS Amount (₹)',
              cell: (c: any) =>
                c.technicalSanctionAmount != null &&
                c.technicalSanctionAmount > 0 ? (
                  <span>{formatCurrency(c.technicalSanctionAmount)}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                ),
              width: '140px',
            },
            {
              field: 'financialYear',
              header: 'Financial Year',
              cell: (c: any) => <span>FY {c.financialYear || '2025-26'}</span>,
              width: '130px',
            },
            {
              field: 'budgetHeadName',
              header: 'Budget Head',
              cell: (c: any) => (
                <div>
                  <span className="font-medium text-purple-800 text-xs bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {c.budgetHeadCode || '4202-01-203'}
                  </span>
                  <div className="text-xs text-gray-600 mt-1 truncate max-w-[220px]">
                    {c.budgetHeadName}
                  </div>
                </div>
              ),
            },
            {
              field: 'budgetAmount',
              header: 'Budget Amount (₹)',
              cell: (c: any) =>
                c.budgetAmount != null && c.budgetAmount > 0 ? (
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(c.budgetAmount)}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                ),
              width: '150px',
            },
            {
              field: 'isLocked',
              header: 'Status',
              cell: (c: any) => {
                const isLocked = c.isLocked || c.status === 'BudgetLocked';
                const isAllocated = Boolean(
                  c.budgetAllocationId || c.budgetAmount > 0
                );
                return (
                  <StatusBadge
                    label={
                      isLocked
                        ? 'Budget Locked'
                        : isAllocated
                          ? 'Budget Allocated'
                          : 'Pending Allocation'
                    }
                    variant={
                      isLocked
                        ? 'approved'
                        : isAllocated
                          ? 'approved'
                          : 'pending'
                    }
                  />
                );
              },
              width: '150px',
            },
            {
              field: 'workRegistrationId',
              header: 'Actions',
              sortable: false,
              cell: (c: any) => {
                const canAllocate = isEligibleForAllocation(c);
                return (
                  <GridActionButtons
                    onView={() => openView(c)}
                    onApprove={canAllocate ? () => openAllocate(c) : undefined}
                    viewTooltip="View Work & Allocation Details"
                    approveTooltip="Allocate Fiscal Budget"
                  />
                );
              },
            },
          ]}
          searchBox
          searchPlaceholder="Search by Work ID, name, financial year, or budget head..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'view' && popup.item
            ? `Work & Budget Allocation Details — ${popup.item.workCode}`
            : popup.mode === 'allocate' && popup.item
              ? `Allocate Fiscal Budget — ${popup.item.workCode}`
              : ''
        }
        subtitle={
          popup.mode === 'view'
            ? 'Complete overview of work, technical sanction, and fiscal allocation record.'
            : 'Link civil work to accounting head, declare FY funds, and lock allocation for tendering.'
        }
        size="lg"
      >
        {popup.mode === 'view' && popup.item && (
          <div className="flex flex-col gap-4">
            <FormCard title="Work & Sanction Context">
              <PreviewGrid
                columns={3}
                fields={[
                  { label: 'Work ID', value: popup.item.workCode },
                  { label: 'Work Name', value: popup.item.workName },
                  {
                    label: 'Funding Source',
                    value:
                      popup.item.fundingSourceName ||
                      popup.item.fundingSource ||
                      '—',
                  },
                  {
                    label: 'Estimated Cost',
                    value: formatCurrency(popup.item.estimatedCost),
                  },
                  {
                    label: 'AA Amount',
                    value: popup.item.aaAmount
                      ? formatCurrency(popup.item.aaAmount)
                      : '—',
                  },
                  {
                    label: 'TS Amount',
                    value: popup.item.technicalSanctionAmount
                      ? formatCurrency(popup.item.technicalSanctionAmount)
                      : '—',
                  },
                ]}
              />
            </FormCard>

            <FormCard title="Budget Allocation Record">
              <PreviewGrid
                columns={2}
                fields={[
                  {
                    label: 'Financial Year',
                    value: `FY ${popup.item.financialYear}`,
                  },
                  {
                    label: 'Accounting Head Code',
                    value: popup.item.budgetHeadCode || '—',
                  },
                  {
                    label: 'Budget Head Name',
                    value: popup.item.budgetHeadName || '—',
                  },
                  {
                    label: 'Allocated Budget Amount',
                    value: formatCurrency(popup.item.budgetAmount),
                  },
                  {
                    label: 'Allocation Status',
                    value: popup.item.isLocked
                      ? 'Locked (Frozen for Tendering)'
                      : 'Allocated',
                  },
                  {
                    label: 'Remarks / Authority Ref',
                    value: popup.item.remarks || 'None recorded',
                  },
                ]}
              />
            </FormCard>

            <ButtonPanel>
              <Button label="Close" variant="outlined" onClick={closePopup} />
            </ButtonPanel>
          </div>
        )}

        {popup.mode === 'allocate' && popup.item && (
          <form onSubmit={handleSaveAllocation} className="flex flex-col gap-4">
            <FormCard title="Work & TS Context">
              <PreviewGrid
                columns={3}
                fields={[
                  { label: 'Work ID', value: popup.item.workCode },
                  { label: 'Work Name', value: popup.item.workName },
                  {
                    label: 'TS Amount',
                    value: formatCurrency(popup.item.technicalSanctionAmount),
                  },
                ]}
              />
            </FormCard>

            <FormGrid columns={2}>
              <DropDownList
                label="Financial Year *"
                data={FINANCIAL_YEARS}
                value={financialYearId}
                onChange={val => setFinancialYearId(Number(val))}
                required
              />
              <NumberBox
                value={budgetAmount ?? undefined}
                onChange={val => setBudgetAmount(val ? Number(val) : null)}
                label="Allocated Fund Amount (₹) *"
                placeholder="e.g. 25000000.00"
                mode="decimal"
                required
              />
            </FormGrid>

            <DropDownList
              label="Budget Head of Account *"
              data={BUDGET_HEADS}
              value={budgetHeadId}
              onChange={val => setBudgetHeadId(Number(val))}
              required
            />

            <TextArea
              value={remarks}
              onChange={val => setRemarks(val)}
              label="Allocation Authority Reference & Notes"
              placeholder="Record Finance Committee resolution or treasury allotment order number..."
              rows={3}
              autoResize
            />

            <FileUpload
              label="Budget Allocation Document / Allotment Order"
              accept=".pdf,.png,.jpg,.jpeg"
              mode="file"
              uploadNote="Upload allotment order (.pdf, .jpg, .png)"
              onChange={(file: File | null) => setAllocationDoc(file)}
            />

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="lockBudgetCheckbox"
                checked={isLockedCheckbox}
                onChange={e => setIsLockedCheckbox(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <label
                htmlFor="lockBudgetCheckbox"
                className="text-xs font-semibold text-blue-900 cursor-pointer"
              >
                🔒 Lock Fiscal Budget Baseline immediately (authorizes tender
                publication)
              </label>
            </div>

            <AlertPanel severity="warn" title="Fiscal Notice:">
              Budget allocation commits university treasury funds under the
              selected accounting head. Once locked, tenders can be published
              against this cost ceiling.
            </AlertPanel>

            <ButtonPanel>
              <Button
                label="Cancel"
                variant="outlined"
                onClick={closePopup}
                type="button"
              />
              <Button
                label="Confirm Allocation & Save"
                icon="check"
                variant="primary"
                type="submit"
              />
            </ButtonPanel>
          </form>
        )}
      </FormPopup>
    </FormPage>
  );
}
