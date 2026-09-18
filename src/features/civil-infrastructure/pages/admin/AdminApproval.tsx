import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button, ButtonPanel, StatusButton } from 'shared/components/buttons';
import { FileUpload, NumberBox, TextArea } from 'shared/components/forms';
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
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'grant'; item: any }
  | { mode: 'view'; item: any };

export default function AdminApproval() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    const worksList = saved ? JSON.parse(saved) : initialWorks;
    return worksList.map((w: any) => ({
      ...w,
      workRegistrationId: w.workRegistrationId || Number(w.id) || 0,
      code: w.code || w.workId || `CW-2025-${String(w.id).padStart(3, '0')}`,
      administrativeApprovalAmount:
        w.administrativeApprovalAmount ??
        (w.aaAmount > 0 ? w.aaAmount : undefined),
      aaStatus:
        w.aaStatus ||
        (w.administrativeApprovalAmount > 0 || (w.aaAmount && w.aaAmount > 0)
          ? 'AAApproved'
          : 'Pending'),
      remark: w.remark || w.aaRemarks || '',
      documentName:
        w.documentName ||
        (w.aaAmount > 0
          ? `Sanction_Order_${w.code || w.workId}.pdf`
          : undefined),
      isActive: w.isActive !== false,
    }));
  });

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [aaAmount, setAaAmount] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, data);
  }, [data]);

  const isSanctioned = (item?: any): boolean => {
    if (!item) return false;
    if (item.aaStatus === 'AAApproved') return true;
    const s = String(item.status || '')
      .toLowerCase()
      .replace(/\s+/g, '');
    if (s === 'aaapproved') return true;
    return Boolean(
      item.administrativeApprovalAmount != null &&
      Number(item.administrativeApprovalAmount) > 0
    );
  };

  const isEligibleForSanction = (item: any): boolean => {
    if (isSanctioned(item)) return false;
    const s = String(item.status || '')
      .toLowerCase()
      .replace(/\s+/g, '');
    return s === 'registered' || s === 'requirementgenerated';
  };

  const openGrant = (item: any) => {
    const defaultAmt =
      item.administrativeApprovalAmount && item.administrativeApprovalAmount > 0
        ? item.administrativeApprovalAmount
        : item.estimatedCost > 0
          ? item.estimatedCost
          : 0;
    setAaAmount(defaultAmt);
    setRemark(item.remark || '');
    setDocumentFile(null);
    setPopup({ mode: 'grant', item });
  };

  const openView = (item: any) => {
    setPopup({ mode: 'view', item });
  };

  const closePopup = () => {
    setPopup({ mode: 'closed' });
    setAaAmount(null);
    setRemark('');
    setDocumentFile(null);
  };

  const handleGrantSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (popup.mode !== 'grant' || !popup.item) return;

    const amount = Number(aaAmount);
    if (!amount || amount <= 0) {
      ToastService.error('A valid Administrative Approval Amount is required.');
      return;
    }

    const estCost = popup.item.estimatedCost || 0;
    if (estCost > 0 && amount > estCost) {
      ToastService.error(
        `Administrative Approval Amount cannot be greater than the Estimated Cost (${formatCurrency(estCost)}).`
      );
      return;
    }

    const targetItem = popup.item;
    const docName = documentFile
      ? documentFile.name
      : targetItem.documentName || `Sanction_Order_${targetItem.code}.pdf`;

    setData(prev =>
      prev.map(d =>
        d.workRegistrationId === targetItem.workRegistrationId ||
        d.id === targetItem.id
          ? {
              ...d,
              administrativeApprovalAmount: amount,
              aaAmount: amount,
              administrativeSanctionId:
                d.administrativeSanctionId || Date.now(),
              aaStatus: 'AAApproved',
              remark: remark.trim() || undefined,
              documentId: d.documentId || `doc-${Date.now()}`,
              documentName: docName,
              status:
                d.status === 'Registered' ||
                d.status === 'Requirement Generated'
                  ? 'AA Approved'
                  : d.status,
            }
          : d
      )
    );

    ToastService.success(
      `Administrative Approval of ${formatCurrency(amount)} granted successfully.`
    );
    closePopup();
  };

  const handleToggleStatus = (item: any) => {
    setData(prev =>
      prev.map(d => {
        if (
          d.workRegistrationId === item.workRegistrationId ||
          d.id === item.id
        ) {
          const next = d.isActive === false ? true : false;
          ToastService.info(
            `Administrative Sanction record ${next ? 'Activated' : 'Deactivated'}.`
          );
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  return (
    <FormPage
      title="Administrative Sanction Approvals"
      description="Review project scopes, establish legally binding expenditure limits, and grant official administrative sanctions."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Administrative Sanction' },
      ]}
    >
      <div className="civil-chain" style={{ marginBottom: '1.25rem' }}>
        <span className="civil-chain-item done">Work Registration</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item done">BOQ Compilation</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">
          Administrative Sanction (AA) ← Current
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Technical Sanction (TS)</span>
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
              field: 'estimatedCost',
              header: 'Estimated Cost (₹)',
              cell: (c: any) => <span>{formatCurrency(c.estimatedCost)}</span>,
            },
            {
              field: 'administrativeApprovalAmount',
              header: 'AA Amount (₹)',
              cell: (c: any) =>
                c.administrativeApprovalAmount != null &&
                Number(c.administrativeApprovalAmount) > 0 ? (
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(c.administrativeApprovalAmount)}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                ),
            },
            {
              field: 'aaStatus',
              header: 'Status',
              cell: (c: any) => {
                const approved = isSanctioned(c);
                return (
                  <StatusBadge
                    label={approved ? 'AA Approved' : 'Pending AA'}
                    variant={approved ? 'approved' : 'pending'}
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
                const hasSanction =
                  Boolean(c.administrativeSanctionId) || isSanctioned(c);
                if (!hasSanction) {
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
                    approveTooltip="Grant Administrative Sanction (AA)"
                  />
                );
              },
            },
          ]}
          searchBox
          searchPlaceholder="Search by Work ID, name, category, or status..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'grant' && popup.item
            ? `Grant AA — ${popup.item.code || popup.item.workId}`
            : popup.mode === 'view' && popup.item
              ? `Administrative Sanction Details — ${popup.item.code || popup.item.workId}`
              : ''
        }
        subtitle={
          popup.mode === 'grant'
            ? 'Administrative Approval fixes the project budget. This action is legally binding.'
            : 'Detailed civil engineering work and administrative sanction record.'
        }
        size="lg"
      >
        {popup.mode === 'grant' && popup.item && (
          <form onSubmit={handleGrantSave} className="flex flex-col gap-4">
            {/* Work Context Summary */}
            <FormCard title="Work Details">
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
                    label: 'Project Description',
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
                    label: 'Execution Route',
                    value: popup.item.executionRoute || '—',
                  },
                  { label: 'Work Basis', value: popup.item.workBasis || '—' },
                ]}
              />
            </FormCard>

            {/* Input Section */}
            <FormGrid columns={1}>
              <NumberBox
                value={aaAmount ?? undefined}
                onChange={val => setAaAmount(val ? Number(val) : null)}
                label="AA Amount (₹)"
                placeholder="e.g. 500000.00"
                mode="decimal"
                required
              />
              <TextArea
                value={remark}
                onChange={val => setRemark(val)}
                label="AA Justification / Remarks"
                placeholder="Economic justification for approval..."
                rows={3}
                autoResize
              />
              <FileUpload
                label="Sanction Order / Approval Document"
                accept=".pdf,.png,.jpg,.jpeg,image/*"
                mode="file"
                uploadNote="Upload official sanction order document (.pdf, .png, .jpg, .jpeg)"
                onChange={file => setDocumentFile(file)}
              />
            </FormGrid>

            {/* Warning Notice Banner */}
            <AlertPanel severity="warn" title="Important:">
              Granting Administrative Approval legally commits the project
              budget. The AA Amount becomes the cost ceiling for subsequent
              Technical Sanction, tendering, and execution.
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
                label="Grant Administrative Approval"
                icon="check"
                variant="primary"
                type="submit"
              />
            </ButtonPanel>
          </form>
        )}

        {popup.mode === 'view' && popup.item && (
          <div className="flex flex-col gap-4">
            <FormCard title="Work Specification">
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
                    label: 'Project Description',
                    value:
                      popup.item.projectDescription || popup.item.campus || '—',
                  },
                  { label: 'Location', value: popup.item.location || '—' },
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
                    label: 'Execution Route',
                    value: popup.item.executionRoute || '—',
                  },
                  { label: 'Work Basis', value: popup.item.workBasis || '—' },
                  { label: 'Work Status', value: popup.item.status || '—' },
                ]}
              />
            </FormCard>

            <FormCard title="Administrative Sanction Record">
              <PreviewGrid
                columns={2}
                fields={[
                  {
                    label: 'AA Status',
                    value: isSanctioned(popup.item)
                      ? 'AA Approved'
                      : 'Pending AA',
                  },
                  {
                    label: 'Sanctioned AA Amount',
                    value: popup.item.administrativeApprovalAmount
                      ? formatCurrency(popup.item.administrativeApprovalAmount)
                      : popup.item.aaAmount
                        ? formatCurrency(popup.item.aaAmount)
                        : 'Not Sanctioned',
                  },
                  {
                    label: 'Justification / Remarks',
                    value:
                      popup.item.remark ||
                      popup.item.aaRemarks ||
                      'None recorded',
                  },
                  {
                    label: 'Sanction Order Document',
                    value: popup.item.documentName || 'No document attached',
                  },
                ]}
              />
              {popup.item.documentName && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-700 font-semibold text-sm">
                    📄 {popup.item.documentName}
                  </span>
                  <Button
                    size="small"
                    label="Download Document"
                    icon="download"
                    variant="outlined"
                    onClick={() =>
                      ToastService.info(
                        `Downloading ${popup.item.documentName}...`
                      )
                    }
                  />
                </div>
              )}
            </FormCard>

            <ButtonPanel>
              <Button label="Close" variant="outlined" onClick={closePopup} />
            </ButtonPanel>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
