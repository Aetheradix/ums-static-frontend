import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button, ButtonPanel, StatusButton } from 'shared/components/buttons';
import { FileUpload, NumberBox, TextArea } from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { AlertPanel } from 'shared/components/panels';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewGrid,
  StatusBadge,
} from 'shared/new-components';
import { formatCurrency } from 'shared/utils/currency';
import {
  CIVIL_STORAGE_KEYS,
  civilStorage,
  useCivilStorage,
} from '../../civilStorage';
import { appendAudit, makeAuditEntry } from '../../utils/audit';
import {
  type MockTechnicalPlan,
  civilWorks as initialWorks,
  initialTechnicalPlans,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const TS_APPROVER = 'Superintending Engineer (SE)';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: any }
  | { mode: 'grant'; item: any };

export default function TechnicalSanction() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    const worksList = saved ? JSON.parse(saved) : initialWorks;
    return worksList.map((w: any) => ({
      ...w,
      workRegistrationId: w.workRegistrationId || Number(w.id) || 0,
      code: w.code || w.workId || `CW-2025-${String(w.id).padStart(3, '0')}`,
      administrativeApprovalAmount:
        w.administrativeApprovalAmount || w.aaAmount || 0,
      aaAmount: w.administrativeApprovalAmount || w.aaAmount || 0,
      technicalSanctionAmount:
        w.technicalSanctionAmount ?? (w.tsAmount > 0 ? w.tsAmount : undefined),
      tsStatus:
        w.tsStatus ||
        (w.technicalSanctionAmount > 0 || (w.tsAmount && w.tsAmount > 0)
          ? 'Approved'
          : 'Pending'),
      remark: w.remark || w.tsRemarks || '',
      documentName:
        w.documentName ||
        (w.tsAmount > 0 ? `TS_Order_${w.code || w.workId}.pdf` : undefined),
      canGrantTs:
        w.canGrantTs !== undefined
          ? w.canGrantTs
          : (w.aaStatus === 'AaApproved' ||
              w.aaStatus === 'AAApproved' ||
              w.aaAmount > 0) &&
            (!w.technicalSanctionAmount || w.technicalSanctionAmount <= 0) &&
            w.tsStatus !== 'Approved',
      isActive: w.isActive !== false,
    }));
  });

  // Read-only: the engineer's technical plan (soil, bearing capacity, concrete
  // grade, material estimates) authored on the Technical Planning page. It is
  // surfaced here so the sanctioning authority reviews the actual engineering
  // basis before issuing TS, instead of the plan being a dead-end write.
  const [technicalPlans] = useCivilStorage<MockTechnicalPlan[]>(
    CIVIL_STORAGE_KEYS.TECHNICAL_PLANS,
    initialTechnicalPlans
  );

  const planForWork = (item: any): MockTechnicalPlan | undefined =>
    technicalPlans.find(
      p =>
        String(p.workRegistrationId) === String(item.workRegistrationId) ||
        String(p.workRegistrationId) === String(item.id) ||
        (item.code && String(p.workRegistrationCode) === String(item.code)) ||
        (item.workId && String(p.workRegistrationCode) === String(item.workId))
    );

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [tsAmount, setTsAmount] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [confirmGrant, setConfirmGrant] = useState<{
    open: boolean;
    amount: number;
    docName: string;
  }>({ open: false, amount: 0, docName: '' });

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, data);
  }, [data]);

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setTsAmount(null);
    setRemark('');
    setDocumentFile(null);
  };

  const isEligibleForSanction = (c: any) => {
    if (c.canGrantTs !== undefined) {
      return c.canGrantTs;
    }
    const hasActiveTs = Boolean(
      c.technicalSanctionId ||
      c.tsStatus === 'Approved' ||
      (c.technicalSanctionAmount != null && c.technicalSanctionAmount > 0)
    );
    const hasAa = Boolean(
      c.aaStatus === 'AaApproved' ||
      c.aaStatus === 'AAApproved' ||
      (c.aaAmount && c.aaAmount > 0) ||
      (c.administrativeApprovalAmount && c.administrativeApprovalAmount > 0)
    );
    return hasAa && !hasActiveTs;
  };

  const openGrant = (item: any) => {
    const defaultAmount =
      item.technicalSanctionAmount && item.technicalSanctionAmount > 0
        ? item.technicalSanctionAmount
        : item.administrativeApprovalAmount &&
            item.administrativeApprovalAmount > 0
          ? item.administrativeApprovalAmount
          : item.aaAmount && item.aaAmount > 0
            ? item.aaAmount
            : item.estimatedCost > 0
              ? item.estimatedCost
              : 0;
    setTsAmount(defaultAmount);
    setRemark(item.remark || '');
    setDocumentFile(null);
    setPopup({ mode: 'grant', item });
  };

  const openView = (item: any) => {
    setPopup({ mode: 'view', item });
  };

  const handleGrantSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (popup.mode !== 'grant' || !popup.item) return;

    const enteredAmount = Number(tsAmount);
    if (!enteredAmount || enteredAmount <= 0) {
      ToastService.error('A valid Technical Sanction Amount is required.');
      return;
    }

    const maxAllowedAmount =
      popup.item.administrativeApprovalAmount ??
      popup.item.aaAmount ??
      popup.item.estimatedCost;
    if (maxAllowedAmount > 0 && enteredAmount > maxAllowedAmount) {
      ToastService.error(
        `Technical Sanction Amount (${formatCurrency(enteredAmount)}) cannot exceed the Approved AA Amount (${formatCurrency(maxAllowedAmount)}).`
      );
      return;
    }

    const docName = documentFile
      ? documentFile.name
      : popup.item.documentName ||
        `TS_Order_${popup.item.code || popup.item.workId}.pdf`;

    // Technical Sanction sets the technical expenditure limit → confirm first.
    setConfirmGrant({ open: true, amount: enteredAmount, docName });
  };

  const doGrant = () => {
    if (popup.mode !== 'grant' || !popup.item) return;
    const targetItem = popup.item;
    const enteredAmount = confirmGrant.amount;
    const docName = confirmGrant.docName;

    setData(prev =>
      prev.map(d =>
        d.workRegistrationId === targetItem.workRegistrationId ||
        d.id === targetItem.id
          ? {
              ...d,
              technicalSanctionAmount: enteredAmount,
              tsAmount: enteredAmount,
              technicalSanctionId: d.technicalSanctionId || Date.now(),
              tsStatus: 'Approved',
              canGrantTs: false,
              remark: remark.trim() || undefined,
              documentId: d.documentId || `doc-ts-${Date.now()}`,
              documentName: docName,
              status:
                d.status === 'AaApproved' || d.status === 'AA Approved'
                  ? 'TsGranted'
                  : d.status,
              statusHistory: appendAudit(
                d.statusHistory,
                makeAuditEntry({
                  status: 'TsGranted',
                  actor: TS_APPROVER,
                  remarks: remark.trim() || undefined,
                  action: `Issued Technical Sanction of ${formatCurrency(enteredAmount)}`,
                })
              ),
            }
          : d
      )
    );

    ToastService.success(
      `Technical Sanction of ${formatCurrency(enteredAmount)} granted successfully.`
    );
    setConfirmGrant({ open: false, amount: 0, docName: '' });
    closePopup();
  };

  const [confirmToggle, setConfirmToggle] = useState<{
    open: boolean;
    item?: any;
  }>({ open: false });

  const doToggleStatus = (item: any) => {
    setData(prev =>
      prev.map(d => {
        if (
          d.workRegistrationId === item.workRegistrationId ||
          d.id === item.id
        ) {
          const next = d.isActive === false ? true : false;
          ToastService.info(
            `Technical Sanction record ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  const handleToggleStatus = (item: any) => {
    if (item.isActive !== false) {
      setConfirmToggle({ open: true, item });
      return;
    }
    doToggleStatus(item);
  };

  const renderTechnicalPlanCard = (item: any) => {
    const plan = planForWork(item);
    if (!plan) {
      return (
        <FormCard title="Engineering Technical Plan">
          <AlertPanel severity="info" title="No technical plan on record">
            The Engineer has not submitted a Technical Plan for this work yet.
            Sanction can still be issued, but the structural design basis is not
            available for review.
          </AlertPanel>
        </FormCard>
      );
    }
    return (
      <FormCard title="Engineering Technical Plan (from Technical Planning)">
        <PreviewGrid
          columns={3}
          fields={[
            { label: 'Plan Status', value: plan.status },
            {
              label: 'Plot Area (Sq. Ft.)',
              value: plan.plotArea?.toLocaleString('en-IN') ?? '—',
            },
            {
              label: 'Built-up Area (Sq. Ft.)',
              value: plan.builtUpArea
                ? plan.builtUpArea.toLocaleString('en-IN')
                : '—',
            },
            { label: 'Number of Floors', value: plan.numberOfFloors || '—' },
            { label: 'Soil Type', value: plan.soilType || '—' },
            {
              label: 'Bearing Capacity (KN/m²)',
              value: plan.bearingCapacity ? `${plan.bearingCapacity}` : '—',
            },
            { label: 'Concrete Grade', value: plan.concreteGrade || '—' },
            {
              label: 'Steel Quantity (MT)',
              value:
                plan.steelQuantity != null ? `${plan.steelQuantity} MT` : '—',
            },
            {
              label: 'Brickwork Quantity (Cum)',
              value:
                plan.brickworkQuantity != null
                  ? `${plan.brickworkQuantity} Cum`
                  : '—',
            },
          ]}
        />
      </FormCard>
    );
  };

  return (
    <FormPage
      title="Technical Sanction Approvals"
      description="Review structural design, verify engineering specifications, and issue official Technical Sanctions (TS Amount ≤ AA Amount)."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Technical Sanction' },
      ]}
    >
      <div className="civil-chain" style={{ marginBottom: '1.25rem' }}>
        <span className="civil-chain-item done">Work Registration</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item done">BOQ Compilation</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item done">
          Administrative Sanction (AA)
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">
          Technical Sanction (TS) ← Current
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Budget Lock & Tender</span>
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
              field: 'code',
              header: 'Work ID',
              cell: (c: any) => (
                <span className="font-mono text-blue-600 font-semibold">
                  {c.code || c.workId}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'name',
              header: 'Work Name',
              cell: (c: any) => (
                <div>
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {c.projectDescription || c.campus}{' '}
                    {c.location ? `• ${c.location}` : ''}
                  </div>
                </div>
              ),
            },
            {
              field: 'workCategoryName',
              header: 'Work Type',
              cell: (c: any) => (
                <span>{c.workCategoryName || c.category || '—'}</span>
              ),
            },
            {
              field: 'subCategoryName',
              header: 'Category',
              cell: (c: any) => (
                <span>{c.subCategoryName || c.department || '—'}</span>
              ),
            },
            {
              field: 'workBasis',
              header: 'Work Basis',
              cell: (c: any) => (
                <StatusBadge label={c.workBasis || 'SOR'} variant="neutral" />
              ),
            },
            {
              field: 'aaAmount',
              header: 'AA Amount (₹)',
              cell: (c: any) =>
                c.aaAmount != null && c.aaAmount > 0 ? (
                  <span>{formatCurrency(c.aaAmount)}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                ),
            },
            {
              field: 'technicalSanctionAmount',
              header: 'TS Amount (₹)',
              cell: (c: any) =>
                c.technicalSanctionAmount != null &&
                c.technicalSanctionAmount > 0 ? (
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(c.technicalSanctionAmount)}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                ),
            },
            {
              field: 'tsStatus',
              header: 'Status',
              cell: (c: any) => {
                const isTsApproved =
                  c.tsStatus === 'Approved' ||
                  String(c.status || '')
                    .toLowerCase()
                    .replace(/\s+/g, '') === 'tsgranted' ||
                  (c.technicalSanctionAmount != null &&
                    c.technicalSanctionAmount > 0);

                return (
                  <StatusBadge
                    label={isTsApproved ? 'TS Granted' : 'Pending TS'}
                    variant={isTsApproved ? 'approved' : 'pending'}
                  />
                );
              },
              width: '140px',
            },
            {
              field: 'isActive',
              header: 'Active',
              sortable: false,
              cell: (c: any) => {
                const isSanctioned =
                  Boolean(c.technicalSanctionId) ||
                  c.tsStatus === 'Approved' ||
                  (c.technicalSanctionAmount != null &&
                    c.technicalSanctionAmount > 0);

                if (!isSanctioned) {
                  return <span> — </span>;
                }

                return (
                  <StatusButton
                    value={c.isActive !== false}
                    onClick={() => handleToggleStatus(c)}
                  />
                );
              },
              width: '90px',
            },
            {
              field: 'workRegistrationId',
              header: 'Actions',
              sortable: false,
              cell: (c: any) => {
                const canGrant = isEligibleForSanction(c);

                return (
                  <GridActionButtons
                    onView={() => openView(c)}
                    onApprove={canGrant ? () => openGrant(c) : undefined}
                    viewTooltip="View Work & Sanction Details"
                    approveTooltip="Issue Technical Sanction (TS)"
                  />
                );
              },
            },
          ]}
          searchBox
          searchPlaceholder="Search by Work ID, name, category, or status..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'view' && popup.item
            ? `Work & Sanction Details — ${popup.item.code || popup.item.workId}`
            : popup.mode === 'grant' && popup.item
              ? `Issue Technical Sanction — ${popup.item.code || popup.item.workId}`
              : ''
        }
        subtitle={
          popup.mode === 'view'
            ? 'Detailed civil engineering work, administrative approval, and technical sanction record.'
            : popup.mode === 'grant'
              ? 'Technical Sanction certifies structural design soundness and cost reasonableness (must be ≤ AA Amount).'
              : ''
        }
        size="lg"
      >
        {popup.mode === 'view' && popup.item && (
          <div className="flex flex-col gap-4">
            <FormCard title="Work & AA Summary">
              <PreviewGrid
                columns={3}
                fields={[
                  {
                    label: 'Work ID',
                    value: popup.item.code || popup.item.workId,
                  },
                  { label: 'Work Name', value: popup.item.name },
                  {
                    label: 'Category',
                    value:
                      popup.item.workCategoryName || popup.item.category || '—',
                  },
                  {
                    label: 'Department',
                    value:
                      popup.item.subCategoryName ||
                      popup.item.department ||
                      '—',
                  },
                  {
                    label: 'Campus / Area',
                    value:
                      popup.item.projectDescription || popup.item.campus || '—',
                  },
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
                    label: 'Approved AA Amount',
                    value: popup.item.aaAmount
                      ? formatCurrency(popup.item.aaAmount)
                      : '—',
                  },
                  {
                    label: 'Execution Route',
                    value: popup.item.executionRoute || '—',
                  },
                  { label: 'Work Basis', value: popup.item.workBasis || '—' },
                  { label: 'Work Status', value: popup.item.status || '—' },
                ]}
              />
            </FormCard>

            <FormCard title="Technical Sanction Record">
              <PreviewGrid
                columns={2}
                fields={[
                  {
                    label: 'TS Status',
                    value:
                      popup.item.tsStatus === 'Approved'
                        ? 'TS Granted'
                        : 'Pending TS',
                  },
                  {
                    label: 'Sanctioned TS Amount',
                    value: popup.item.technicalSanctionAmount
                      ? formatCurrency(popup.item.technicalSanctionAmount)
                      : popup.item.tsAmount
                        ? formatCurrency(popup.item.tsAmount)
                        : 'Not Issued',
                  },
                  {
                    label: 'Variance (AA − TS)',
                    value: formatCurrency(
                      (popup.item.aaAmount || 0) -
                        (popup.item.technicalSanctionAmount ||
                          popup.item.tsAmount ||
                          0)
                    ),
                  },
                  {
                    label: 'TS Remarks / Engineering Notes',
                    value:
                      popup.item.remark ||
                      popup.item.tsRemarks ||
                      'None recorded',
                  },
                ]}
              />
            </FormCard>

            {renderTechnicalPlanCard(popup.item)}

            <ButtonPanel>
              <Button label="Close" variant="outlined" onClick={closePopup} />
            </ButtonPanel>
          </div>
        )}

        {popup.mode === 'grant' && popup.item && (
          <form onSubmit={handleGrantSave} className="flex flex-col gap-4">
            {/* Work & AA Summary */}
            <FormCard title="Work & AA Context">
              <PreviewGrid
                columns={3}
                fields={[
                  {
                    label: 'Work ID',
                    value: popup.item.code || popup.item.workId,
                  },
                  { label: 'Work Name', value: popup.item.name },
                  {
                    label: 'Category',
                    value:
                      popup.item.workCategoryName || popup.item.category || '—',
                  },
                  {
                    label: 'Department',
                    value:
                      popup.item.subCategoryName ||
                      popup.item.department ||
                      '—',
                  },
                  {
                    label: 'Campus / Area',
                    value:
                      popup.item.projectDescription || popup.item.campus || '—',
                  },
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
                    label: 'Approved AA Amount',
                    value: popup.item.aaAmount
                      ? formatCurrency(popup.item.aaAmount)
                      : '—',
                  },
                  {
                    label: 'Execution Route',
                    value: popup.item.executionRoute || '—',
                  },
                ]}
              />
            </FormCard>

            {renderTechnicalPlanCard(popup.item)}

            {/* Input Section */}
            <FormGrid columns={1}>
              <NumberBox
                value={tsAmount ?? undefined}
                onChange={val => setTsAmount(val ? Number(val) : null)}
                label="TS Amount (₹) — Must be ≤ AA Amount"
                placeholder="e.g. 450000.00"
                mode="decimal"
                required
              />
              <FileUpload
                label="Technical Sanction Order Document (PDF/DOC)"
                accept=".pdf,.doc,.docx"
                value={documentFile}
                onChange={file => setDocumentFile(file)}
              />
              <TextArea
                value={remark}
                onChange={val => setRemark(val)}
                label="TS Verification Remarks / Structural Notes"
                placeholder="Structural certification remarks, drawing references, engineering scope details..."
                rows={3}
                autoResize
              />
            </FormGrid>

            {/* Warning Notice Banner */}
            <AlertPanel severity="warn" title="Important:">
              Technical Sanction certifies engineering feasibility and
              establishes the technical expenditure limit. The TS Amount cannot
              exceed the approved AA Amount (
              {popup.item.administrativeApprovalAmount || popup.item.aaAmount
                ? formatCurrency(
                    popup.item.administrativeApprovalAmount ||
                      popup.item.aaAmount
                  )
                : '—'}
              ). Any cost overrun requires a Revised Estimate.
            </AlertPanel>

            {/* Actions */}
            <ButtonPanel>
              <Button
                label="Cancel"
                variant="outlined"
                onClick={closePopup}
                type="button"
              />
              <Button
                label="Issue Technical Sanction"
                icon="check"
                variant="primary"
                type="submit"
              />
            </ButtonPanel>
          </form>
        )}
      </FormPopup>

      <ConfirmDialog
        visible={confirmGrant.open}
        onHide={() => setConfirmGrant({ open: false, amount: 0, docName: '' })}
        onConfirm={doGrant}
        variant="warning"
        title="Confirm Technical Sanction"
        message={`This issues a Technical Sanction of ${formatCurrency(confirmGrant.amount)}, setting the technical expenditure limit for tendering and execution. Proceed?`}
        confirmLabel="Issue TS"
      />

      <ConfirmDialog
        visible={confirmToggle.open}
        onHide={() => setConfirmToggle({ open: false })}
        onConfirm={() => {
          if (confirmToggle.item) doToggleStatus(confirmToggle.item);
          setConfirmToggle({ open: false });
        }}
        variant="danger"
        title="Deactivate Sanction Record"
        message="Deactivating this technical sanction record removes it from active workflows. You can re-activate it later. Proceed?"
        confirmLabel="Deactivate"
      />
    </FormPage>
  );
}
