import { useEffect, useRef, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import { appendAudit, makeAuditEntry } from '../../utils/audit';
import {
  contractors as initialContractors,
  milestones as initialMilestones,
  workOrders as initialWorkOrders,
  civilWorks as initialWorks,
  initialWorkSuspensions,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

// Interactive File Upload Widget with file browsing and drag & drop support
function FileUploadCell({
  docName,
  onFileSelect,
  onClear,
}: {
  docName: string;
  onFileSelect: (fileName: string) => void;
  onClear: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file.name);
      ToastService.success(`Attached "${file.name}"`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file.name);
      ToastService.success(`Attached "${file.name}"`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      {docName ? (
        <div className="flex items-center justify-between gap-2 p-2 px-3 bg-blue-50/70 border border-blue-200 rounded-lg w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            <i className="pi pi-file-pdf text-red-600 text-base flex-shrink-0" />
            <div className="truncate">
              <span
                className="font-mono text-xs text-blue-900 font-bold block truncate"
                title={docName}
              >
                {docName}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <i className="pi pi-check text-[9px]" /> Ready to submit
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-white hover:bg-blue-100 rounded border border-blue-300 transition-colors shadow-xs cursor-pointer"
              title="Replace this document"
            >
              Change File
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1 px-1.5 text-red-600 hover:bg-red-100 rounded border border-red-200 transition-colors cursor-pointer"
              title="Remove attached file"
            >
              <i className="pi pi-trash text-xs" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center justify-between p-2 px-3.5 border border-dashed rounded-lg text-xs w-full transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-600 hover:text-blue-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <i className="pi pi-cloud-upload text-base text-blue-600" />
            <div>
              <span className="font-semibold block">
                Click to Browse or Drag & Drop File
              </span>
              <span className="text-[10px] text-slate-400">
                PDF, DOC, DOCX, JPG (Max 25MB)
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 shadow-2xs">
            Browse
          </span>
        </div>
      )}
    </div>
  );
}

export default function WorkOrderSign() {
  const [activeTab, setActiveTab] = useState<'WORK_ORDERS' | 'SUSPENSION'>(
    'WORK_ORDERS'
  );

  // Work Orders state
  const [workOrders, setWorkOrders] = useState(() => {
    const saved = localStorage.getItem('civil_work_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const parsedIds = new Set(parsed.map((w: any) => w.id));
        const missing = initialWorkOrders.filter(
          (w: any) => !parsedIds.has(w.id)
        );
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('civil_work_orders', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialWorkOrders;
  });

  const [contractors] = useState(() => {
    const saved = localStorage.getItem('civil_contractors');
    return saved ? JSON.parse(saved) : initialContractors;
  });

  const [civilWorks, setCivilWorks] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [milestones] = useState(() => {
    const saved = localStorage.getItem('civil_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [suspensions, setSuspensions] = useState<
    CivilManagement.WorkSuspensionForeclosure[]
  >(() => {
    const saved = localStorage.getItem('civil_work_suspensions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialWorkSuspensions;
  });

  const [woViewMode, setWoViewMode] = useState<
    'list' | 'agreement' | 'view' | 'sign'
  >('list');
  const [selectedWO, setSelectedWO] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [confirmState, setConfirmState] = useState<
    | { mode: 'closed' }
    | { mode: 'sign' }
    | { mode: 'suspend' }
    | { mode: 'revoke'; item: CivilManagement.WorkSuspensionForeclosure }
  >({ mode: 'closed' });

  const [agrForm, setAgrForm] = useState<{
    // Part A: Work Registration & Order Details
    workOrderNo: string;
    orderDate: string;
    workOrderDoc: string;

    // Part B: Performance Bank Guarantee / Security Deposit (If Applicable)
    bgNo: string;
    bgBank: string;
    bgAmount: number;
    bgExpiryDate: string;
    bgDoc: string;

    // Part C: Mobilization Advance Bank Guarantee (If Applicable)
    mobAdvanceBgNo: string;
    mobAdvanceBgBank: string;
    mobAdvanceBgAmount: number;
    mobAdvanceBgExpiry: string;
    mobAdvanceDoc: string;

    // Part D: Statutory Agreement & Stamp Duty Details (If Applicable)
    agreementNo: string;
    agreementDate: string;
    stampDutyAmount: number;
    stampDutyReceiptNo: string;
    registrationStatus: 'Registered' | 'Notary Stamped' | 'Pending';
    scannedAgreementDoc: string;
  }>({
    workOrderNo: '',
    orderDate: '',
    workOrderDoc: '',
    bgNo: '',
    bgBank: '',
    bgAmount: 0,
    bgExpiryDate: '',
    bgDoc: '',
    mobAdvanceBgNo: '',
    mobAdvanceBgBank: '',
    mobAdvanceBgAmount: 0,
    mobAdvanceBgExpiry: '',
    mobAdvanceDoc: '',
    agreementNo: '',
    agreementDate: '',
    stampDutyAmount: 0,
    stampDutyReceiptNo: '',
    registrationStatus: 'Registered',
    scannedAgreementDoc: '',
  });

  // Suspension view mode state
  const [suspViewMode, setSuspViewMode] = useState<'list' | 'create' | 'view'>(
    'list'
  );
  const [selectedSusp, setSelectedSusp] =
    useState<CivilManagement.WorkSuspensionForeclosure | null>(null);

  const [suspForm, setSuspForm] = useState<{
    workOrderId: string;
    actionType: 'Suspension' | 'Foreclosure';
    clauseReference: string;
    orderNo: string;
    orderDate: string;
    effectiveDate: string;
    reason:
      | 'Court Stay'
      | 'Fund Crunch'
      | 'Site Dispute'
      | 'Design Revision'
      | 'Contractor Default'
      | 'Department Decision'
      | 'Other';
    reasonDescription: string;
    sitePreservationExpenses: string;
    finalMeasurementDate: string;
    settlementAmount: string;
    orderedBy: string;
    remarks: string;
  }>({
    workOrderId: '',
    actionType: 'Suspension',
    clauseReference: 'Clause 15 (Suspension of Work)',
    orderNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: 'Design Revision',
    reasonDescription: '',
    sitePreservationExpenses: '0',
    finalMeasurementDate: '',
    settlementAmount: '0',
    orderedBy: 'Executive Engineer (Civil)',
    remarks: '',
  });

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORK_ORDERS, workOrders);
  }, [workOrders]);

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.WORK_SUSPENSIONS, suspensions);
  }, [suspensions]);

  const contractor = (id: string) => contractors.find((c: any) => c.id === id);

  const formatCurrency = (n?: number) =>
    n !== undefined ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

  // Open agreement editor page
  const openAgreementPage = (item: any) => {
    setSelectedWO(item);
    setAgrForm({
      // Part A
      workOrderNo:
        item.workOrderNo ||
        `WO/CW/${new Date().getFullYear()}/${String(item.id || '001').padStart(3, '0')}`,
      orderDate:
        item.orderDate ||
        item.issuedDate ||
        new Date().toISOString().split('T')[0],
      workOrderDoc:
        item.workOrderDoc ||
        (item.workOrderNo
          ? `${item.workOrderNo.replace(/[\/\\]/g, '_')}_Signed.pdf`
          : 'Work_Order_Signed_Document.pdf'),

      // Part B
      bgNo:
        item.bgNo ||
        `BG-SBI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bgBank: item.bgBank || 'State Bank of India',
      bgAmount:
        item.bgAmount ||
        item.sdAmount ||
        Math.round((item.contractAmount || 0) * 0.05),
      bgExpiryDate: item.bgExpiryDate || item.completionDate || '',
      bgDoc:
        item.bgDoc ||
        (item.bgNo
          ? `${item.bgNo.replace(/[\/\\]/g, '_')}_Guarantee_Bond.pdf`
          : 'Performance_Bank_Guarantee_Bond.pdf'),

      // Part C
      mobAdvanceBgNo: item.mobAdvanceBgNo || '',
      mobAdvanceBgBank: item.mobAdvanceBgBank || '',
      mobAdvanceBgAmount: item.mobAdvanceBgAmount || 0,
      mobAdvanceBgExpiry: item.mobAdvanceBgExpiry || '',
      mobAdvanceDoc:
        item.mobAdvanceDoc ||
        (item.mobAdvanceBgNo
          ? `${item.mobAdvanceBgNo.replace(/[\/\\]/g, '_')}_Receipt.pdf`
          : ''),

      // Part D
      agreementNo:
        item.agreementNo || `AGR/CW/${item.workOrderNo?.slice(-10) || '001'}`,
      agreementDate:
        item.agreementDate ||
        item.issuedDate ||
        new Date().toISOString().split('T')[0],
      stampDutyAmount:
        item.stampDutyAmount || Math.round((item.contractAmount || 0) * 0.005),
      stampDutyReceiptNo:
        item.stampDutyReceiptNo ||
        `STAMP/MP/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      registrationStatus: item.registrationStatus || 'Registered',
      scannedAgreementDoc:
        item.scannedAgreementDoc || 'Scanned_Agreement_Stamped.pdf',
    });
    setWoViewMode('agreement');
  };

  // Save agreement details
  const handleSaveAgreement = () => {
    if (!selectedWO) return;
    if (!agrForm.agreementNo.trim()) {
      ToastService.error('Contract Agreement Number is required.');
      return;
    }
    const updated = workOrders.map((w: any) =>
      w.id === selectedWO.id
        ? {
            ...w,
            workOrderNo: agrForm.workOrderNo,
            issuedDate: agrForm.orderDate,
            orderDate: agrForm.orderDate,
            workOrderDoc: agrForm.workOrderDoc,
            agreementNo: agrForm.agreementNo,
            agreementDate: agrForm.agreementDate,
            stampDutyAmount: Number(agrForm.stampDutyAmount) || 0,
            stampDutyReceiptNo: agrForm.stampDutyReceiptNo,
            registrationStatus: agrForm.registrationStatus,
            scannedAgreementDoc: agrForm.scannedAgreementDoc,
            bgNo: agrForm.bgNo,
            bgBank: agrForm.bgBank,
            bgAmount: Number(agrForm.bgAmount) || 0,
            bgExpiryDate: agrForm.bgExpiryDate,
            bgDoc: agrForm.bgDoc,
            mobAdvanceBgNo: agrForm.mobAdvanceBgNo,
            mobAdvanceBgBank: agrForm.mobAdvanceBgBank,
            mobAdvanceBgAmount: Number(agrForm.mobAdvanceBgAmount) || 0,
            mobAdvanceBgExpiry: agrForm.mobAdvanceBgExpiry,
            mobAdvanceDoc: agrForm.mobAdvanceDoc,
          }
        : w
    );
    setWorkOrders(updated);
    ToastService.success(
      `Work Order & Contract Agreement details and attachments updated for ${agrForm.workOrderNo}.`
    );
    setWoViewMode('list');
  };

  // Sign Work Order handler — legally-binding Notice to Proceed → confirm first.
  const handleSign = () => {
    if (!selectedWO) return;
    setConfirmState({ mode: 'sign' });
  };

  const doSign = () => {
    if (!selectedWO) return;
    const updated = workOrders.map((w: any) =>
      w.id === selectedWO.id
        ? {
            ...w,
            signedByContractor: true,
            signedByEE: true,
            signedByAdmin: true,
            status: 'Work Started' as any,
            statusHistory: appendAudit(
              w.statusHistory,
              makeAuditEntry({
                status: 'Work Started',
                actor: 'Administrative Officer',
                remarks: remarks.trim() || undefined,
                action: 'Signed & issued Notice to Proceed',
              })
            ),
          }
        : w
    );
    setWorkOrders(updated);

    // Also update civil work status in localStorage to "In Progress"
    const updatedWorks = civilWorks.map((w: any) =>
      w.id === selectedWO.workId || w.workId === selectedWO.workId
        ? { ...w, status: 'In Progress' as any }
        : w
    );
    setCivilWorks(updatedWorks);
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, updatedWorks);

    ToastService.success(
      'Work Order approved and signed by Admin. Notice to Proceed issued. Project start timestamp recorded.'
    );
    setConfirmState({ mode: 'closed' });
    setWoViewMode('list');
  };

  // Open Record Suspension / Foreclosure page
  const openCreateSuspension = () => {
    const firstActive = workOrders.find(
      (w: any) => w.status === 'Work Started' || w.status === 'Issued'
    );
    setSuspForm({
      workOrderId: firstActive?.id || workOrders[0]?.id || '',
      actionType: 'Suspension',
      clauseReference: 'Clause 15 (Suspension of Work)',
      orderNo: `ORD/SUSP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: 'Design Revision',
      reasonDescription: '',
      sitePreservationExpenses: '50000',
      finalMeasurementDate: '',
      settlementAmount: '0',
      orderedBy: 'Executive Engineer (Civil)',
      remarks: '',
    });
    setSuspViewMode('create');
  };

  // Validate Suspension / Foreclosure order, then confirm (destructive).
  const handleSaveSuspension = () => {
    if (!suspForm.orderNo.trim() || !suspForm.workOrderId) {
      ToastService.error('Order Number and Target Work Order are required.');
      return;
    }
    const targetWO = workOrders.find((w: any) => w.id === suspForm.workOrderId);
    if (!targetWO) {
      ToastService.error('Selected Work Order not found.');
      return;
    }
    if (!suspForm.reasonDescription.trim()) {
      ToastService.error('A detailed reason is required.');
      return;
    }
    if (
      suspForm.actionType === 'Foreclosure' &&
      !suspForm.finalMeasurementDate
    ) {
      ToastService.error(
        'Final Joint Measurement Date is required for a Foreclosure.'
      );
      return;
    }
    setConfirmState({ mode: 'suspend' });
  };

  const doSaveSuspension = () => {
    const targetWO = workOrders.find((w: any) => w.id === suspForm.workOrderId);
    if (!targetWO) return;

    const newEntry: CivilManagement.WorkSuspensionForeclosure = {
      id: `WS-${Date.now().toString().slice(-4)}`,
      workId: targetWO.workId,
      workName: targetWO.workName,
      workOrderId: targetWO.id,
      workOrderNo: targetWO.workOrderNo,
      contractorName: targetWO.contractorName,
      actionType: suspForm.actionType,
      clauseReference:
        suspForm.actionType === 'Suspension'
          ? 'Clause 15 (Suspension of Work)'
          : 'Clause 13 (Foreclosure of Contract)',
      orderNo: suspForm.orderNo,
      orderDate: suspForm.orderDate,
      effectiveDate: suspForm.effectiveDate,
      reason: suspForm.reason,
      reasonDescription:
        suspForm.reasonDescription ||
        `Order issued under ${suspForm.actionType === 'Suspension' ? 'Clause 15' : 'Clause 13'} due to ${suspForm.reason}.`,
      sitePreservationExpenses:
        suspForm.actionType === 'Suspension'
          ? Number(suspForm.sitePreservationExpenses) || 0
          : undefined,
      finalMeasurementDate:
        suspForm.actionType === 'Foreclosure'
          ? suspForm.finalMeasurementDate
          : undefined,
      settlementAmount:
        suspForm.actionType === 'Foreclosure'
          ? Number(suspForm.settlementAmount) || 0
          : undefined,
      compensationPaid:
        suspForm.actionType === 'Foreclosure'
          ? Number(suspForm.settlementAmount) || 0
          : undefined,
      orderedBy: suspForm.orderedBy,
      status:
        suspForm.actionType === 'Suspension'
          ? 'Active Suspension'
          : 'Foreclosed',
      remarks: suspForm.remarks,
    };

    setSuspensions(prev => [newEntry, ...prev]);

    // Update target Work Order status
    const nextWOStatus =
      suspForm.actionType === 'Suspension' ? 'Suspended' : 'Terminated';
    const updatedWOs = workOrders.map((w: any) =>
      w.id === targetWO.id ? { ...w, status: nextWOStatus } : w
    );
    setWorkOrders(updatedWOs);

    // Update civil works status
    const updatedWorks = civilWorks.map((w: any) =>
      w.id === targetWO.workId || w.workId === targetWO.workId
        ? { ...w, status: nextWOStatus as any }
        : w
    );
    setCivilWorks(updatedWorks);
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

    ToastService.success(
      `${suspForm.actionType} order ${suspForm.orderNo} recorded. Work status changed to "${nextWOStatus}".`
    );
    setConfirmState({ mode: 'closed' });
    setSuspViewMode('list');
  };

  // Revoke an active suspension → confirm first.
  const handleRevokeSuspension = (
    item: CivilManagement.WorkSuspensionForeclosure
  ) => {
    setConfirmState({ mode: 'revoke', item });
  };

  const doRevokeSuspension = (
    item: CivilManagement.WorkSuspensionForeclosure
  ) => {
    const updatedSusp = suspensions.map(s =>
      s.id === item.id
        ? {
            ...s,
            status: 'Revoked' as const,
            remarks: `${s.remarks || ''} [Revoked on ${new Date().toISOString().split('T')[0]}]`,
          }
        : s
    );
    setSuspensions(updatedSusp);

    // Restore Work Order status back to 'Work Started'
    const updatedWOs = workOrders.map((w: any) =>
      w.id === item.workOrderId ? { ...w, status: 'Work Started' as const } : w
    );
    setWorkOrders(updatedWOs);

    // Restore Civil Work status back to 'In Progress'
    const updatedWorks = civilWorks.map((w: any) =>
      w.id === item.workId || w.workId === item.workId
        ? { ...w, status: 'In Progress' as any }
        : w
    );
    setCivilWorks(updatedWorks);
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

    ToastService.success(
      `Suspension ${item.orderNo} revoked. Work has been resumed to "In Progress".`
    );
    setConfirmState({ mode: 'closed' });
  };

  const statusVariant = (s: string) =>
    s === 'Completed' || s === 'Revoked'
      ? 'approved'
      : s === 'Terminated' || s === 'Foreclosed'
        ? 'rejected'
        : s === 'Work Started' || s === 'Active Suspension'
          ? 'pending'
          : 'neutral';

  return (
    <FormPage
      title="Work Order & Contract Agreement Management"
      description="Generate digitized contracts, track statutory stamp duties, register Performance Bank Guarantees, issue Notice to Proceed, and manage CPWD Clause 13 & 15 Suspensions/Foreclosures."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Work Orders & Agreements' },
      ]}
    >
      {/* 2-Tab Navigation Switcher (only displayed in list view) */}
      {woViewMode === 'list' && suspViewMode === 'list' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('WORK_ORDERS')}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                border:
                  activeTab === 'WORK_ORDERS'
                    ? '2px solid #1d4ed8'
                    : '1px solid #d1d5db',
                background: activeTab === 'WORK_ORDERS' ? '#eff6ff' : '#ffffff',
                color: activeTab === 'WORK_ORDERS' ? '#1d4ed8' : '#4b5563',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="pi pi-file-edit" />
              <span>Work Orders & Contract Agreements</span>
              <span
                style={{
                  background:
                    activeTab === 'WORK_ORDERS' ? '#1d4ed8' : '#9ca3af',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.5rem',
                  marginLeft: '0.25rem',
                }}
              >
                {workOrders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SUSPENSION')}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                border:
                  activeTab === 'SUSPENSION'
                    ? '2px solid #b91c1c'
                    : '1px solid #d1d5db',
                background: activeTab === 'SUSPENSION' ? '#fef2f2' : '#ffffff',
                color: activeTab === 'SUSPENSION' ? '#b91c1c' : '#4b5563',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="pi pi-pause-circle" />
              <span>Work Suspension & Foreclosure (Clauses 13 & 15)</span>
              <span
                style={{
                  background:
                    activeTab === 'SUSPENSION' ? '#b91c1c' : '#9ca3af',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.5rem',
                  marginLeft: '0.25rem',
                }}
              >
                {suspensions.length}
              </span>
            </button>
          </div>

          {activeTab === 'SUSPENSION' && (
            <Button
              label="Record Suspension / Foreclosure"
              icon="plus"
              variant="danger"
              onClick={openCreateSuspension}
            />
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: WORK ORDERS & CONTRACT AGREEMENTS */}
      {/* ======================================================== */}
      {activeTab === 'WORK_ORDERS' && (
        <>
          {/* 1.1 List View */}
          {woViewMode === 'list' && (
            <FormCard>
              <GridPanel
                data={workOrders}
                columns={[
                  {
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                    width: '45px',
                  },
                  {
                    field: 'workId',
                    header: 'Work Registration No',
                    cell: (w: any) => {
                      const matchedWork = civilWorks.find(
                        (cw: any) =>
                          cw.id === w.workId ||
                          cw.workId === w.workId ||
                          cw.code === w.workId
                      );
                      const regCode =
                        matchedWork?.code ||
                        matchedWork?.workId ||
                        (typeof w.workId === 'string' &&
                        w.workId.startsWith('CW-')
                          ? w.workId
                          : `CW-2025-00${w.workId || 1}`);
                      const regDate =
                        matchedWork?.registrationDate ||
                        matchedWork?.startDate ||
                        w.issuedDate;
                      return (
                        <div>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#1d4ed8',
                              fontSize: '0.75rem',
                              display: 'block',
                            }}
                          >
                            {regCode}
                          </span>
                          <span
                            style={{ fontSize: '0.7rem', color: '#6b7280' }}
                          >
                            Date: {regDate}
                          </span>
                        </div>
                      );
                    },
                  },
                  { field: 'workName', header: 'Work Name' },
                  {
                    field: 'contractorName',
                    header: 'Contractor',
                    cell: (w: any) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {w.contractorName}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          GSTIN: {contractor(w.contractorId)?.gstNo ?? '—'}
                        </div>
                      </div>
                    ),
                  },
                  {
                    field: 'bgAmount' as any,
                    header: 'Bank Guarantee',
                    cell: (w: any) => {
                      const amount =
                        w.bgAmount ||
                        w.sdAmount ||
                        (w.contractAmount
                          ? Math.round(w.contractAmount * 0.05)
                          : 0);
                      const formattedAmount = `₹${(amount / 100000).toFixed(1)}L`;

                      return (
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: '#1e3a8a',
                            }}
                          >
                            {w.bgNo
                              ? `Guarantee: ${formattedAmount}`
                              : `SD: ${formattedAmount}`}
                          </div>
                          <div
                            style={{
                              fontSize: '0.68rem',
                              color: '#4b5563',
                              marginTop: '1px',
                            }}
                          >
                            {w.bgNo
                              ? `Exp: ${w.bgExpiryDate || '—'}`
                              : 'Deducted in Bills'}
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    field: 'contractAmount',
                    header: 'Contract Value',
                    cell: (w: any) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{(w.contractAmount / 100000).toFixed(2)}L
                      </span>
                    ),
                  },
                  {
                    field: 'commencementDate',
                    header: 'Dates',
                    cell: (w: any) => (
                      <div style={{ fontSize: '0.72rem' }}>
                        <div>Start: {w.commencementDate}</div>
                        <div style={{ color: '#dc2626' }}>
                          Comp: {w.completionDate}
                        </div>
                      </div>
                    ),
                    width: '150px',
                  },
                  {
                    field: 'signedByAdmin',
                    header: 'Digital Sign',
                    cell: (w: any) =>
                      w.signedByAdmin ? (
                        <span className="civil-pill green">✓ Issued</span>
                      ) : (
                        <span className="civil-pill red">Admin Pending</span>
                      ),
                  },
                  {
                    field: 'status',
                    header: 'Status',
                    cell: (w: any) => (
                      <StatusBadge
                        label={w.status}
                        variant={statusVariant(w.status)}
                      />
                    ),
                  },
                  {
                    field: 'id',
                    header: 'Actions',
                    sortable: false,
                    cell: (item: any) => (
                      <GridActionButtons
                        onView={() => {
                          setSelectedWO(item);
                          setWoViewMode('view');
                        }}
                        onEdit={() => openAgreementPage(item)}
                        onApprove={
                          !item.signedByAdmin
                            ? () => {
                                setSelectedWO(item);
                                setRemarks('');
                                setWoViewMode('sign');
                              }
                            : undefined
                        }
                        viewTooltip="View Work Order & Agreement Dossier"
                        editTooltip="Manage Contract Agreement & Guarantee Details"
                        approveTooltip="Sign & Issue Notice to Proceed"
                      />
                    ),
                  },
                ]}
                searchBox
                searchPlaceholder="Search work orders, agreements, contractors..."
              />
            </FormCard>
          )}

          {/* 1.2 EDIT WORK ORDER & CONTRACT AGREEMENT (Full Page View) */}
          {woViewMode === 'agreement' &&
            selectedWO &&
            (() => {
              const selectedWork = civilWorks.find(
                (w: any) =>
                  w.id === selectedWO.workId ||
                  w.workId === selectedWO.workId ||
                  w.code === selectedWO.workId
              );
              const selectedContractor = contractor(selectedWO.contractorId);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <Button
                      label="Back to Work Orders List"
                      icon="arrow-left"
                      variant="secondary"
                      size="small"
                      onClick={() => setWoViewMode('list')}
                    />
                    <span className="text-xs font-semibold text-gray-500">
                      Editing Contract Agreement: {selectedWO.workOrderNo}
                    </span>
                  </div>

                  <FormCard
                    title={`Work Order & Contract Agreement Management — ${selectedWO.workOrderNo || agrForm.workOrderNo}`}
                    subtitle="Record statutory contract deed execution, state stamp duty certifications, Bank Guarantee securities, and Mobilization Advances."
                  >
                    <div className="flex flex-col gap-5">
                      {/* Summary Banner */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong>Work:</strong> {selectedWO.workName}{' '}
                          &nbsp;|&nbsp; <strong>Contractor / Agency:</strong>{' '}
                          {selectedWO.contractorName}
                        </div>
                        <div>
                          <strong>Contract Value:</strong>{' '}
                          <span className="font-bold text-green-700">
                            {formatCurrency(selectedWO.contractAmount)}
                          </span>
                        </div>
                      </div>

                      {/* ======================================================== */}
                      {/* PART A: WORK REGISTRATION DETAILS */}
                      {/* ======================================================== */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              A
                            </span>
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Part A: Work Registration Details
                            </h5>
                          </div>
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                            <i className="pi pi-check-circle text-xs" />{' '}
                            Auto-Populated Work & Agency Details
                          </span>
                        </div>

                        {/* Auto Populate Details Box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-white border border-blue-100 rounded-lg shadow-sm text-xs">
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Registration No
                            </div>
                            <div className="font-mono font-bold text-blue-900 text-xs">
                              {selectedWork?.code ||
                                selectedWork?.workId ||
                                selectedWO.workId ||
                                'CW-2025-001'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Registration Date
                            </div>
                            <div className="font-semibold text-gray-800 text-xs">
                              {selectedWork?.registrationDate ||
                                selectedWork?.startDate ||
                                selectedWO.issuedDate ||
                                '2024-10-15'}
                            </div>
                          </div>
                          <div className="md:col-span-1 lg:col-span-1">
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Name
                            </div>
                            <div
                              className="font-bold text-gray-900 text-xs truncate"
                              title={selectedWO.workName}
                            >
                              {selectedWO.workName}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Agency Name
                            </div>
                            <div
                              className="font-bold text-emerald-800 text-xs truncate"
                              title={selectedWO.contractorName}
                            >
                              {selectedWO.contractorName}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Agency Office Details
                            </div>
                            <div
                              className="text-gray-700 text-[11px] leading-tight"
                              title={selectedContractor?.address}
                            >
                              {selectedContractor?.address ||
                                '42, Industrial Area Phase II, Bhopal'}
                              {selectedContractor?.gstNo && (
                                <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                                  GSTIN: {selectedContractor.gstNo}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Clean Text Boxes for Part A */}
                        <FormGrid columns={2}>
                          <TextBox
                            label="Work Order No"
                            placeholder="WO/CW/2025-26/001"
                            value={agrForm.workOrderNo}
                            onChange={val =>
                              setAgrForm({ ...agrForm, workOrderNo: val })
                            }
                          />
                          <TextBox
                            label="Order Date"
                            type="date"
                            value={agrForm.orderDate}
                            onChange={val =>
                              setAgrForm({ ...agrForm, orderDate: val })
                            }
                            required
                          />
                        </FormGrid>
                      </div>

                      {/* ======================================================== */}
                      {/* PART B: PERFORMANCE BANK GUARANTEE (IF APPLICABLE) */}
                      {/* ======================================================== */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              B
                            </span>
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Part B: Performance Bank Guarantee / Security
                              Deposit (If Applicable)
                            </h5>
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium">
                            Optional Security Deposit & Guarantee
                          </span>
                        </div>

                        <FormGrid columns={2}>
                          <TextBox
                            label="Security Deposit / Bank Guarantee Number"
                            placeholder="BG-SBI-2025-9921"
                            value={agrForm.bgNo || ''}
                            onChange={val =>
                              setAgrForm({ ...agrForm, bgNo: val })
                            }
                          />
                          <TextBox
                            label="Bank Name"
                            placeholder="State Bank of India, TT Nagar Branch"
                            value={agrForm.bgBank || ''}
                            onChange={val =>
                              setAgrForm({ ...agrForm, bgBank: val })
                            }
                          />
                        </FormGrid>

                        <FormGrid columns={2}>
                          <TextBox
                            label="Amount (₹)"
                            type="number"
                            placeholder="1292500"
                            value={String(agrForm.bgAmount || 0)}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                bgAmount: Number(val) || 0,
                              })
                            }
                          />
                          <TextBox
                            label="Expiry Date"
                            type="date"
                            value={agrForm.bgExpiryDate || ''}
                            onChange={val =>
                              setAgrForm({ ...agrForm, bgExpiryDate: val })
                            }
                          />
                        </FormGrid>
                      </div>

                      {/* ======================================================== */}
                      {/* PART C: MOBILIZATION ADVANCE BANK GUARANTEE (IF APPLICABLE) */}
                      {/* ======================================================== */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              C
                            </span>
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Part C: Mobilization Advance Bank Guarantee (If
                              Applicable)
                            </h5>
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium">
                            Optional Advance Covenant
                          </span>
                        </div>

                        <FormGrid columns={2}>
                          <TextBox
                            label="Advance Transaction Number"
                            placeholder="BG-MOB-2025-001"
                            value={agrForm.mobAdvanceBgNo || ''}
                            onChange={val =>
                              setAgrForm({ ...agrForm, mobAdvanceBgNo: val })
                            }
                          />
                          <TextBox
                            label="Bank Name"
                            placeholder="Punjab National Bank / State Bank of India"
                            value={agrForm.mobAdvanceBgBank || ''}
                            onChange={val =>
                              setAgrForm({ ...agrForm, mobAdvanceBgBank: val })
                            }
                          />
                        </FormGrid>

                        <FormGrid columns={2}>
                          <TextBox
                            label="Advance Amount (₹)"
                            type="number"
                            placeholder="2585000"
                            value={String(agrForm.mobAdvanceBgAmount || 0)}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                mobAdvanceBgAmount: Number(val) || 0,
                              })
                            }
                          />
                          <TextBox
                            label="Advance Payment Date"
                            type="date"
                            value={agrForm.mobAdvanceBgExpiry || ''}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                mobAdvanceBgExpiry: val,
                              })
                            }
                          />
                        </FormGrid>
                      </div>

                      {/* ======================================================== */}
                      {/* PART D: STATUTORY AGREEMENT & STAMP DUTY DETAILS */}
                      {/* ======================================================== */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              D
                            </span>
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Part D : Statutory Agreement & Stamp Duty Details
                              (If Applicable)
                            </h5>
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium">
                            CPWD Form 7/8 Agreement Deed
                          </span>
                        </div>

                        <FormGrid columns={2}>
                          <TextBox
                            label="Agreement Number"
                            placeholder="AGR/CW/2025-26/001"
                            value={agrForm.agreementNo}
                            onChange={val =>
                              setAgrForm({ ...agrForm, agreementNo: val })
                            }
                            required
                          />
                          <TextBox
                            label="Agreement Date"
                            type="date"
                            value={agrForm.agreementDate}
                            onChange={val =>
                              setAgrForm({ ...agrForm, agreementDate: val })
                            }
                            required
                          />
                        </FormGrid>

                        <FormGrid columns={3}>
                          <TextBox
                            label="Stamp Duty Paid (₹)"
                            type="number"
                            placeholder="129250"
                            value={String(agrForm.stampDutyAmount)}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                stampDutyAmount: Number(val) || 0,
                              })
                            }
                            required
                          />
                          <TextBox
                            label="Stamp Duty Receipt No"
                            placeholder="STAMP/MP/2025/11029"
                            value={agrForm.stampDutyReceiptNo}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                stampDutyReceiptNo: val,
                              })
                            }
                            required
                          />
                          <DropDownList
                            label="Registration Status"
                            data={[
                              {
                                label: 'Registered with Sub-Registrar',
                                value: 'Registered',
                              },
                              {
                                label: 'Notarized Stamp Paper Deed',
                                value: 'Notary Stamped',
                              },
                              {
                                label: 'Deed Under Execution',
                                value: 'Pending',
                              },
                            ]}
                            textField="label"
                            optionValue="value"
                            value={agrForm.registrationStatus}
                            onChange={val =>
                              setAgrForm({
                                ...agrForm,
                                registrationStatus: val as any,
                              })
                            }
                            required
                          />
                        </FormGrid>
                      </div>

                      {/* ======================================================== */}
                      {/* UNIFIED MANDATE DOCUMENTS CHECKLIST (4 DOCUMENTS IN 1 REQUEST) */}
                      {/* ======================================================== */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                              <i className="pi pi-paperclip text-xs" />
                            </span>
                            <div>
                              <h5 className="font-bold text-slate-800 text-sm m-0">
                                Mandate Contract Documents & Attachments
                                Checklist
                              </h5>
                              <span className="text-[11px] text-gray-500">
                                Upload and verify all 4 contract attachments in
                                a single submission (No repeated dropdown
                                selection needed)
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                            <i className="pi pi-check-circle text-xs" /> 4-in-1
                            Unified Attachment Suite
                          </span>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                          <table className="civil-table w-full text-xs">
                            <thead>
                              <tr className="bg-gray-100">
                                <th
                                  style={{ width: '45px', textAlign: 'center' }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  #
                                </th>
                                <th
                                  style={{ width: '250px', textAlign: 'left' }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  Document Category
                                </th>
                                <th
                                  style={{
                                    width: '110px',
                                    textAlign: 'center',
                                  }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  Contract Part
                                </th>
                                <th
                                  style={{
                                    width: '110px',
                                    textAlign: 'center',
                                  }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  Requirement
                                </th>
                                <th
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  File Attachment / Reference
                                </th>
                                <th
                                  style={{
                                    width: '110px',
                                    textAlign: 'center',
                                  }}
                                  className="p-2.5 font-semibold text-slate-600"
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Row 1: Part A Work Order Copy */}
                              <tr className="border-t border-gray-100 hover:bg-slate-50/50">
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-bold text-slate-600"
                                >
                                  1
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <div className="font-bold text-slate-900">
                                    Work Order Document
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Signed administrative work order copy
                                  </div>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-medium text-slate-700"
                                >
                                  <span className="civil-pill blue text-[10px]">
                                    Part A
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  <span className="civil-pill red text-[10px]">
                                    Mandatory
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <FileUploadCell
                                    docName={agrForm.workOrderDoc}
                                    onFileSelect={fileName =>
                                      setAgrForm({
                                        ...agrForm,
                                        workOrderDoc: fileName,
                                      })
                                    }
                                    onClear={() =>
                                      setAgrForm({
                                        ...agrForm,
                                        workOrderDoc: '',
                                      })
                                    }
                                  />
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.workOrderDoc ? (
                                    <span className="civil-pill green text-[10px]">
                                      Attached ✓
                                    </span>
                                  ) : (
                                    <span className="civil-pill amber text-[10px]">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>

                              {/* Row 2: Part B Performance Bank Guarantee / SD */}
                              <tr className="border-t border-gray-100 hover:bg-slate-50/50">
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-bold text-slate-600"
                                >
                                  2
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <div className="font-bold text-slate-900">
                                    Performance Bank Guarantee / SD Bond
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Bank guarantee bond or SD deduction receipt
                                  </div>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-medium text-slate-700"
                                >
                                  <span className="civil-pill blue text-[10px]">
                                    Part B
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.bgNo || agrForm.bgAmount ? (
                                    <span className="civil-pill red text-[10px]">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="civil-pill neutral text-[10px]">
                                      As Applicable
                                    </span>
                                  )}
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <FileUploadCell
                                    docName={agrForm.bgDoc}
                                    onFileSelect={fileName =>
                                      setAgrForm({
                                        ...agrForm,
                                        bgDoc: fileName,
                                      })
                                    }
                                    onClear={() =>
                                      setAgrForm({
                                        ...agrForm,
                                        bgDoc: '',
                                      })
                                    }
                                  />
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.bgDoc ? (
                                    <span className="civil-pill green text-[10px]">
                                      Attached ✓
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-[11px]">
                                      Optional
                                    </span>
                                  )}
                                </td>
                              </tr>

                              {/* Row 3: Part C Mobilization Advance Bank Guarantee */}
                              <tr className="border-t border-gray-100 hover:bg-slate-50/50">
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-bold text-slate-600"
                                >
                                  3
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <div className="font-bold text-slate-900">
                                    Mobilization Advance Bank Guarantee
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Bank guarantee against advance mobilization
                                    payment
                                  </div>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-medium text-slate-700"
                                >
                                  <span className="civil-pill blue text-[10px]">
                                    Part C
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.mobAdvanceBgNo ||
                                  agrForm.mobAdvanceBgAmount ? (
                                    <span className="civil-pill red text-[10px]">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="civil-pill neutral text-[10px]">
                                      As Applicable
                                    </span>
                                  )}
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <FileUploadCell
                                    docName={agrForm.mobAdvanceDoc}
                                    onFileSelect={fileName =>
                                      setAgrForm({
                                        ...agrForm,
                                        mobAdvanceDoc: fileName,
                                      })
                                    }
                                    onClear={() =>
                                      setAgrForm({
                                        ...agrForm,
                                        mobAdvanceDoc: '',
                                      })
                                    }
                                  />
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.mobAdvanceDoc ? (
                                    <span className="civil-pill green text-[10px]">
                                      Attached ✓
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-[11px]">
                                      Optional
                                    </span>
                                  )}
                                </td>
                              </tr>

                              {/* Row 4: Part D Contract Agreement Deed */}
                              <tr className="border-t border-gray-100 hover:bg-slate-50/50">
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-bold text-slate-600"
                                >
                                  4
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <div className="font-bold text-slate-900">
                                    Contract Agreement Deed & Stamp Duty
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Stamped and signed legal agreement deed
                                  </div>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5 font-medium text-slate-700"
                                >
                                  <span className="civil-pill blue text-[10px]">
                                    Part D
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  <span className="civil-pill red text-[10px]">
                                    Mandatory
                                  </span>
                                </td>
                                <td
                                  style={{ textAlign: 'left' }}
                                  className="p-2.5"
                                >
                                  <FileUploadCell
                                    docName={agrForm.scannedAgreementDoc}
                                    onFileSelect={fileName =>
                                      setAgrForm({
                                        ...agrForm,
                                        scannedAgreementDoc: fileName,
                                      })
                                    }
                                    onClear={() =>
                                      setAgrForm({
                                        ...agrForm,
                                        scannedAgreementDoc: '',
                                      })
                                    }
                                  />
                                </td>
                                <td
                                  style={{ textAlign: 'center' }}
                                  className="p-2.5"
                                >
                                  {agrForm.scannedAgreementDoc ? (
                                    <span className="civil-pill green text-[10px]">
                                      Attached ✓
                                    </span>
                                  ) : (
                                    <span className="civil-pill amber text-[10px]">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Button
                          label="Cancel"
                          variant="outlined"
                          onClick={() => setWoViewMode('list')}
                        />
                        <Button
                          label="Save Agreement Details"
                          variant="primary"
                          icon="save"
                          onClick={handleSaveAgreement}
                        />
                      </div>
                    </div>
                  </FormCard>
                </div>
              );
            })()}

          {/* 1.3 VIEW / SIGN WORK ORDER DOSSIER (Full Page View) */}
          {(woViewMode === 'view' || woViewMode === 'sign') &&
            selectedWO &&
            (() => {
              const popupWork = civilWorks.find(
                (w: any) =>
                  w.id === selectedWO.workId ||
                  w.workId === selectedWO.workId ||
                  w.code === selectedWO.workId
              );
              const popupContractor = contractor(selectedWO.contractorId);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <Button
                      label="Back to Work Orders List"
                      icon="arrow-left"
                      variant="secondary"
                      size="small"
                      onClick={() => setWoViewMode('list')}
                    />
                    <span className="text-xs font-semibold text-gray-500">
                      {woViewMode === 'sign'
                        ? 'Sign & Issue Notice to Proceed'
                        : 'Work Order & Agreement Dossier'}
                      : {selectedWO.workOrderNo || 'Work Order'}
                    </span>
                  </div>

                  <FormCard
                    title={
                      woViewMode === 'sign'
                        ? `Sign & Issue Notice to Proceed — ${selectedWO.workOrderNo || 'Work Order'}`
                        : `Work Order & Agreement Dossier — ${selectedWO.workOrderNo || 'Work Order'}`
                    }
                    subtitle="Formal statutory agreement, Bank Guarantee securities, QA covenants, and milestone release schedules."
                  >
                    <div className="space-y-5">
                      {/* Summary Banner */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong>Work:</strong> {selectedWO.workName}{' '}
                          &nbsp;|&nbsp; <strong>Contractor / Agency:</strong>{' '}
                          {selectedWO.contractorName}
                        </div>
                        <div>
                          <strong>Contract Value:</strong>{' '}
                          <span className="font-bold text-green-700">
                            {formatCurrency(selectedWO.contractAmount)}
                          </span>
                        </div>
                      </div>

                      {/* PART A: WORK REGISTRATION & WORK ORDER DETAILS */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Part A: Work Registration & Order Details
                            </h5>
                          </div>
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                            <i className="pi pi-check-circle text-xs" />{' '}
                            Auto-Populated Profile
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-white border border-blue-100 rounded-lg shadow-sm text-xs">
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Registration No
                            </div>
                            <div className="font-mono font-bold text-blue-900 text-xs">
                              {popupWork?.code ||
                                popupWork?.workId ||
                                selectedWO.workId ||
                                'CW-2025-001'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Registration Date
                            </div>
                            <div className="font-semibold text-gray-800 text-xs">
                              {popupWork?.registrationDate ||
                                popupWork?.startDate ||
                                selectedWO.issuedDate ||
                                '2024-10-15'}
                            </div>
                          </div>
                          <div className="md:col-span-1 lg:col-span-1">
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Name
                            </div>
                            <div
                              className="font-bold text-gray-900 text-xs truncate"
                              title={selectedWO.workName}
                            >
                              {selectedWO.workName}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Agency Name
                            </div>
                            <div
                              className="font-bold text-emerald-800 text-xs truncate"
                              title={selectedWO.contractorName}
                            >
                              {selectedWO.contractorName ||
                                popupContractor?.companyName ||
                                '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Agency Office Details
                            </div>
                            <div
                              className="text-gray-700 text-[11px] leading-tight"
                              title={popupContractor?.address}
                            >
                              {popupContractor?.address ||
                                '42, Industrial Area Phase II, Bhopal'}
                              {popupContractor?.gstNo && (
                                <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                                  GSTIN: {popupContractor.gstNo}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Work Order No
                            </div>
                            <div className="font-mono font-bold text-gray-800 text-xs">
                              {selectedWO.workOrderNo || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Order Date
                            </div>
                            <div className="font-semibold text-gray-800 text-xs">
                              {selectedWO.orderDate ||
                                selectedWO.issuedDate ||
                                '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Contract Value
                            </div>
                            <div className="font-bold text-green-700 text-xs">
                              {formatCurrency(selectedWO.contractAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider mb-1">
                              Commencement / Completion
                            </div>
                            <div className="text-gray-800 text-xs">
                              {selectedWO.commencementDate || '—'} to{' '}
                              {selectedWO.completionDate || '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PART B, C & D DETAILS */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <i className="pi pi-file-pdf text-blue-600 text-base" />
                            <h5 className="font-bold text-slate-800 text-sm m-0">
                              Contract Agreement, Guarantees & Securities (Parts
                              B, C & D)
                            </h5>
                          </div>
                          <Button
                            size="small"
                            label="Edit Agreement Details"
                            icon="file-edit"
                            variant="outlined"
                            onClick={() => openAgreementPage(selectedWO)}
                          />
                        </div>

                        {/* Part B Details */}
                        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
                          <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <span>
                              Part B: Performance Bank Guarantee / Security
                              Deposit (If Applicable)
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Security Deposit / Bank Guarantee Number
                              </div>
                              <strong className="font-mono text-blue-900">
                                {selectedWO.bgNo || 'SD Deducted in Bills'}
                              </strong>
                            </div>
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Bank Name
                              </div>
                              <div>{selectedWO.bgBank || '—'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Amount (₹) / Expiry Date
                              </div>
                              <strong>
                                {formatCurrency(
                                  selectedWO.bgAmount || selectedWO.sdAmount
                                )}{' '}
                                {selectedWO.bgExpiryDate
                                  ? `(Exp: ${selectedWO.bgExpiryDate})`
                                  : ''}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Part C Details */}
                        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
                          <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <span>
                              Part C: Mobilization Advance Bank Guarantee (If
                              Applicable)
                            </span>
                          </div>
                          {selectedWO.mobAdvanceBgNo ||
                          selectedWO.mobAdvanceBgAmount ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div>
                                <div className="text-gray-500 font-medium text-[11px]">
                                  Advance Transaction Number
                                </div>
                                <strong className="font-mono">
                                  {selectedWO.mobAdvanceBgNo || '—'}
                                </strong>
                              </div>
                              <div>
                                <div className="text-gray-500 font-medium text-[11px]">
                                  Bank Name
                                </div>
                                <div>{selectedWO.mobAdvanceBgBank || '—'}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 font-medium text-[11px]">
                                  Advance Amount (₹) / Advance Payment Date
                                </div>
                                <strong>
                                  {formatCurrency(
                                    selectedWO.mobAdvanceBgAmount
                                  )}{' '}
                                  {selectedWO.mobAdvanceBgExpiry
                                    ? `(${selectedWO.mobAdvanceBgExpiry})`
                                    : ''}
                                </strong>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 italic">
                              No mobilization advance bank guarantee recorded
                              for this contract.
                            </div>
                          )}
                        </div>

                        {/* Part D Details */}
                        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2">
                          <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <span>
                              Part D : Statutory Agreement & Stamp Duty Details
                              (If Applicable)
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Agreement Number
                              </div>
                              <strong className="font-mono text-blue-900">
                                {selectedWO.agreementNo || 'Pending Execution'}
                              </strong>
                            </div>
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Agreement Date
                              </div>
                              <strong>{selectedWO.agreementDate || '—'}</strong>
                            </div>
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Stamp Duty Paid / Status
                              </div>
                              <div className="flex items-center gap-1">
                                <strong>
                                  {formatCurrency(selectedWO.stampDutyAmount)}
                                </strong>
                                <span className="civil-pill green text-[10px]">
                                  {selectedWO.registrationStatus ||
                                    'Registered'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 font-medium text-[11px]">
                                Stamp Duty Receipt No
                              </div>
                              <span className="font-mono">
                                {selectedWO.stampDutyReceiptNo || '—'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unified Attached Documents Dossier */}
                        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
                          <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <i className="pi pi-paperclip text-blue-600" />
                              <span>
                                Mandate Contract Document Attachments Dossier
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-normal">
                              All statutory contract documents
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Doc 1: Part A */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">
                                  1. Work Order Document (Part A)
                                </div>
                                <div className="text-blue-700 font-mono text-[11px] truncate max-w-[220px]">
                                  {selectedWO.workOrderDoc ||
                                    'Work_Order_Signed_Document.pdf'}
                                </div>
                              </div>
                              <span className="civil-pill green text-[10px]">
                                Verified ✓
                              </span>
                            </div>

                            {/* Doc 2: Part B */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">
                                  2. Performance Bank Guarantee / SD Bond (Part
                                  B)
                                </div>
                                <div className="text-blue-700 font-mono text-[11px] truncate max-w-[220px]">
                                  {selectedWO.bgDoc ||
                                    (selectedWO.bgNo
                                      ? `${selectedWO.bgNo}_Bond.pdf`
                                      : 'SD_Deducted_In_Bills.pdf')}
                                </div>
                              </div>
                              <span className="civil-pill green text-[10px]">
                                Verified ✓
                              </span>
                            </div>

                            {/* Doc 3: Part C */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">
                                  3. Mobilization Advance BG (Part C)
                                </div>
                                <div className="text-blue-700 font-mono text-[11px] truncate max-w-[220px]">
                                  {selectedWO.mobAdvanceDoc ||
                                    (selectedWO.mobAdvanceBgNo
                                      ? `${selectedWO.mobAdvanceBgNo}_Receipt.pdf`
                                      : 'Not Applicable')}
                                </div>
                              </div>
                              <span
                                className={
                                  selectedWO.mobAdvanceBgNo
                                    ? 'civil-pill green text-[10px]'
                                    : 'civil-pill neutral text-[10px]'
                                }
                              >
                                {selectedWO.mobAdvanceBgNo
                                  ? 'Verified ✓'
                                  : 'N/A'}
                              </span>
                            </div>

                            {/* Doc 4: Part D */}
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">
                                  4. Stamped Agreement Deed (Part D)
                                </div>
                                <div className="text-blue-700 font-mono text-[11px] truncate max-w-[220px]">
                                  {selectedWO.scannedAgreementDoc ||
                                    'Contract_Agreement_Signed.pdf'}
                                </div>
                              </div>
                              <span className="civil-pill green text-[10px]">
                                Verified ✓
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Milestones Schedule */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <h5 className="font-bold text-slate-800 text-sm m-0 flex items-center gap-2">
                          <i className="pi pi-flag text-blue-600" />
                          <span>
                            Project Milestone & Payment Release Schedule
                          </span>
                        </h5>

                        {(() => {
                          const workMls = milestones.filter(
                            (m: any) => m.workId === selectedWO.workId
                          );

                          if (workMls.length === 0) {
                            return (
                              <div className="p-4 text-center border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 bg-white">
                                No milestones defined for this work order.
                              </div>
                            );
                          }

                          return (
                            <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                              <table className="civil-table w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th
                                      style={{
                                        width: '80px',
                                        textAlign: 'center',
                                      }}
                                      className="p-2.5 font-semibold text-slate-600"
                                    >
                                      Seq
                                    </th>
                                    <th
                                      style={{ textAlign: 'left' }}
                                      className="p-2.5 font-semibold text-slate-600"
                                    >
                                      Milestone Stage
                                    </th>
                                    <th
                                      style={{
                                        width: '130px',
                                        textAlign: 'center',
                                      }}
                                      className="p-2.5 font-semibold text-slate-600"
                                    >
                                      Release %
                                    </th>
                                    <th
                                      style={{
                                        width: '200px',
                                        textAlign: 'right',
                                      }}
                                      className="p-2.5 font-semibold text-slate-600"
                                    >
                                      Equivalent Payment
                                    </th>
                                    <th
                                      style={{
                                        width: '150px',
                                        textAlign: 'center',
                                      }}
                                      className="p-2.5 font-semibold text-slate-600"
                                    >
                                      QA Gate
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {workMls.map((m: any) => {
                                    const releaseAmt =
                                      (selectedWO.contractAmount *
                                        m.weightage) /
                                      100;
                                    return (
                                      <tr
                                        key={m.id}
                                        className="border-t border-gray-100 hover:bg-slate-50/50"
                                      >
                                        <td
                                          style={{ textAlign: 'center' }}
                                          className="p-2.5 font-semibold text-slate-700"
                                        >
                                          #{m.sequenceNo}
                                        </td>
                                        <td
                                          style={{ textAlign: 'left' }}
                                          className="p-2.5 font-medium text-slate-800"
                                        >
                                          {m.milestoneName}
                                        </td>
                                        <td
                                          style={{ textAlign: 'center' }}
                                          className="p-2.5 font-bold text-blue-600"
                                        >
                                          {m.weightage}%
                                        </td>
                                        <td
                                          style={{ textAlign: 'right' }}
                                          className="p-2.5 font-bold text-emerald-600 font-mono"
                                        >
                                          {formatCurrency(releaseAmt)}
                                        </td>
                                        <td
                                          style={{ textAlign: 'center' }}
                                          className="p-2.5"
                                        >
                                          {m.qualityTestRequired ? (
                                            <span className="civil-pill red text-[10px]">
                                              TPI Required
                                            </span>
                                          ) : (
                                            <span className="text-gray-400 font-medium">
                                              N/A
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>

                      {/* SIGN MODE ACTIONS & REMARKS */}
                      {woViewMode === 'sign' && (
                        <div className="space-y-4 pt-2">
                          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 leading-relaxed">
                            <strong>Admin Approval & Notice to Proceed:</strong>{' '}
                            This action records digital signatures, validates
                            Contract Agreement & Bank Guarantee compliances, and
                            formally transmits Notice to Proceed, establishing
                            the legal Commencement Date.
                          </div>
                          <TextArea
                            label="Admin Approval Remarks"
                            placeholder="Admin approval notes, statutory compliance clearance..."
                            value={remarks}
                            onChange={setRemarks}
                            rows={2}
                          />
                          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                            <Button
                              label="Cancel & Back to List"
                              variant="outlined"
                              onClick={() => setWoViewMode('list')}
                            />
                            <Button
                              label="Approve, Sign & Issue Work Order"
                              variant="primary"
                              icon="check"
                              onClick={handleSign}
                            />
                          </div>
                        </div>
                      )}

                      {/* VIEW MODE ACTIONS */}
                      {woViewMode === 'view' && (
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <Button
                            label="Back to Work Orders List"
                            variant="secondary"
                            icon="arrow-left"
                            onClick={() => setWoViewMode('list')}
                          />
                          <div className="flex gap-2">
                            <Button
                              label="Edit Agreement Details"
                              variant="outlined"
                              icon="file-edit"
                              onClick={() => openAgreementPage(selectedWO)}
                            />
                            {!selectedWO.signedByAdmin && (
                              <Button
                                label="Proceed to Sign & Issue"
                                variant="primary"
                                icon="check"
                                onClick={() => {
                                  setRemarks('');
                                  setWoViewMode('sign');
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormCard>
                </div>
              );
            })()}
        </>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SUSPENSION & FORECLOSURE */}
      {/* ======================================================== */}
      {activeTab === 'SUSPENSION' && (
        <>
          {/* 2.1 List View */}
          {suspViewMode === 'list' && (
            <FormCard>
              <GridPanel
                data={suspensions}
                columns={[
                  {
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                    width: '45px',
                  },
                  {
                    field: 'orderNo',
                    header: 'Order Reference',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <div>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color:
                              item.actionType === 'Suspension'
                                ? '#b91c1c'
                                : '#6b21a8',
                            fontSize: '0.75rem',
                          }}
                        >
                          {item.orderNo}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          Date: {item.orderDate}
                        </div>
                      </div>
                    ),
                  },
                  {
                    field: 'actionType',
                    header: 'Action Type',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <span
                        className={`civil-pill ${item.actionType === 'Suspension' ? 'red' : item.actionType === 'Foreclosure' ? 'purple' : 'green'}`}
                        style={{ fontWeight: 700 }}
                      >
                        {item.actionType}
                      </span>
                    ),
                  },
                  {
                    field: 'workName',
                    header: 'Work / Project',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.workName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#4b5563' }}>
                          WO:{' '}
                          <span style={{ fontFamily: 'monospace' }}>
                            {item.workOrderNo}
                          </span>{' '}
                          • Contractor: {item.contractorName}
                        </div>
                      </div>
                    ),
                  },
                  {
                    field: 'clauseReference',
                    header: 'CPWD Clause',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#374151',
                          background: '#f3f4f6',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                        }}
                      >
                        {item.clauseReference}
                      </span>
                    ),
                  },
                  {
                    field: 'reason',
                    header: 'Reason Category',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>
                          {item.reason}
                        </span>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#6b7280',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.reasonDescription}
                        </div>
                      </div>
                    ),
                  },
                  {
                    field: 'effectiveDate',
                    header: 'Effective Date',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <span style={{ fontSize: '0.8rem' }}>
                        {item.effectiveDate}
                      </span>
                    ),
                  },
                  {
                    field: 'sitePreservationExpenses' as any,
                    header: 'Financial Impact',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <div>
                        {item.actionType === 'Suspension' ? (
                          <span
                            style={{ fontSize: '0.78rem', color: '#b45309' }}
                          >
                            Preservation:{' '}
                            {formatCurrency(item.sitePreservationExpenses)}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: '#15803d',
                              fontWeight: 600,
                            }}
                          >
                            Settlement: {formatCurrency(item.settlementAmount)}
                          </span>
                        )}
                      </div>
                    ),
                  },
                  {
                    field: 'status',
                    header: 'Status',
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <StatusBadge
                        label={item.status}
                        variant={statusVariant(item.status)}
                      />
                    ),
                  },
                  {
                    field: 'id',
                    header: 'Actions',
                    sortable: false,
                    cell: (item: CivilManagement.WorkSuspensionForeclosure) => (
                      <GridActionButtons
                        onView={() => {
                          setSelectedSusp(item);
                          setSuspViewMode('view');
                        }}
                        onApprove={
                          item.status === 'Active Suspension'
                            ? () => handleRevokeSuspension(item)
                            : undefined
                        }
                        viewTooltip="View Suspension Dossier"
                        approveTooltip="Revoke Suspension & Resume Work"
                      />
                    ),
                  },
                ]}
                searchBox
                searchPlaceholder="Search suspensions, foreclosure orders, works..."
              />
            </FormCard>
          )}

          {/* 2.2 RECORD SUSPENSION OR FORECLOSURE (Full Page View) */}
          {suspViewMode === 'create' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <Button
                  label="Back to Suspensions List"
                  icon="arrow-left"
                  variant="secondary"
                  size="small"
                  onClick={() => setSuspViewMode('list')}
                />
                <span className="text-xs font-semibold text-gray-500">
                  Record Suspension or Foreclosure Order
                </span>
              </div>

              <FormCard
                title="Record Work Suspension or Foreclosure Order"
                subtitle="Exercise statutory powers under CPWD GCC Clause 15 (Suspension) or Clause 13 (Foreclosure due to Abandonment/Fund Crunch)."
              >
                <div className="flex flex-col gap-4">
                  <FormGrid columns={2}>
                    <DropDownList
                      label="Target Work Order"
                      data={
                        workOrders.map((w: any) => ({
                          label: `${w.workOrderNo} — ${w.workName} (${w.contractorName})`,
                          value: w.id as string,
                        })) as { label: string; value: string }[]
                      }
                      textField="label"
                      optionValue="value"
                      value={suspForm.workOrderId}
                      onChange={val =>
                        setSuspForm({ ...suspForm, workOrderId: val as string })
                      }
                      required
                    />
                    <DropDownList
                      label="Statutory Action Type"
                      data={[
                        {
                          label: 'Suspension of Work (CPWD Clause 15)',
                          value: 'Suspension',
                        },
                        {
                          label: 'Foreclosure of Contract (CPWD Clause 13)',
                          value: 'Foreclosure',
                        },
                      ]}
                      textField="label"
                      optionValue="value"
                      value={suspForm.actionType}
                      onChange={val =>
                        setSuspForm({
                          ...suspForm,
                          actionType: val as any,
                          clauseReference:
                            val === 'Suspension'
                              ? 'Clause 15 (Suspension of Work)'
                              : 'Clause 13 (Foreclosure of Contract)',
                        })
                      }
                      required
                    />
                  </FormGrid>

                  <FormGrid columns={3}>
                    <TextBox
                      label="Official Order Number"
                      placeholder="ORD/SUSP/2026/045"
                      value={suspForm.orderNo}
                      onChange={val =>
                        setSuspForm({ ...suspForm, orderNo: val })
                      }
                      required
                    />
                    <TextBox
                      label="Order Date"
                      type="date"
                      value={suspForm.orderDate}
                      onChange={val =>
                        setSuspForm({ ...suspForm, orderDate: val })
                      }
                      required
                    />
                    <TextBox
                      label="Effective Date"
                      type="date"
                      value={suspForm.effectiveDate}
                      onChange={val =>
                        setSuspForm({ ...suspForm, effectiveDate: val })
                      }
                      required
                    />
                  </FormGrid>

                  <FormGrid columns={2}>
                    <DropDownList
                      label="Reason Classification"
                      data={[
                        {
                          label: 'Court Stay / Legal Injunction',
                          value: 'Court Stay',
                        },
                        {
                          label: 'Fund Crunch / Grant Withdrawal',
                          value: 'Fund Crunch',
                        },
                        {
                          label: 'Site Dispute / Right-of-Way Issue',
                          value: 'Site Dispute',
                        },
                        {
                          label: 'Design Revision / Engineering Redesign',
                          value: 'Design Revision',
                        },
                        {
                          label: 'Contractor Prolonged Default',
                          value: 'Contractor Default',
                        },
                        {
                          label: 'Department Policy Decision',
                          value: 'Department Decision',
                        },
                        { label: 'Force Majeure / Other', value: 'Other' },
                      ]}
                      textField="label"
                      optionValue="value"
                      value={suspForm.reason}
                      onChange={val =>
                        setSuspForm({ ...suspForm, reason: val as any })
                      }
                      required
                    />
                    <DropDownList
                      label="Ordering Authority"
                      data={[
                        {
                          label: 'Executive Engineer (Civil)',
                          value: 'Executive Engineer (Civil)',
                        },
                        {
                          label: 'Superintending Engineer',
                          value: 'Superintending Engineer',
                        },
                        { label: 'Chief Engineer', value: 'Chief Engineer' },
                        {
                          label: 'Competent University Authority',
                          value: 'Competent University Authority',
                        },
                      ]}
                      textField="label"
                      optionValue="value"
                      value={suspForm.orderedBy}
                      onChange={val =>
                        setSuspForm({ ...suspForm, orderedBy: val as string })
                      }
                      required
                    />
                  </FormGrid>

                  <TextArea
                    label="Remarks"
                    placeholder="Detailed narrative describing the circumstances leading to suspension or foreclosure..."
                    value={suspForm.reasonDescription}
                    onChange={val =>
                      setSuspForm({ ...suspForm, reasonDescription: val })
                    }
                    rows={2}
                    required
                  />

                  {suspForm.actionType === 'Suspension' ? (
                    <FormGrid columns={2}>
                      <TextBox
                        label="Site Preservation & Securing Expenses (₹)"
                        type="number"
                        placeholder="50000"
                        value={suspForm.sitePreservationExpenses}
                        onChange={val =>
                          setSuspForm({
                            ...suspForm,
                            sitePreservationExpenses: val,
                          })
                        }
                      />
                      <TextBox
                        label="Safety & Security Directives"
                        placeholder="Secure excavated pits, barricade perimeter, dewater trenches..."
                        value={suspForm.remarks}
                        onChange={val =>
                          setSuspForm({ ...suspForm, remarks: val })
                        }
                      />
                    </FormGrid>
                  ) : (
                    <FormGrid columns={2}>
                      <TextBox
                        label="Final Joint Measurement Date"
                        type="date"
                        value={suspForm.finalMeasurementDate}
                        onChange={val =>
                          setSuspForm({
                            ...suspForm,
                            finalMeasurementDate: val,
                          })
                        }
                        required
                      />
                      <TextBox
                        label="Agreed Settlement / Compensation Amount (₹)"
                        type="number"
                        placeholder="1850000"
                        value={suspForm.settlementAmount}
                        onChange={val =>
                          setSuspForm({
                            ...suspForm,
                            settlementAmount: val,
                          })
                        }
                      />
                    </FormGrid>
                  )}

                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => setSuspViewMode('list')}
                    />
                    <Button
                      label={`Issue ${suspForm.actionType} Order`}
                      variant="danger"
                      icon="check"
                      onClick={handleSaveSuspension}
                    />
                  </div>
                </div>
              </FormCard>
            </div>
          )}

          {/* 2.3 VIEW SUSPENSION / FORECLOSURE DOSSIER (Full Page View) */}
          {suspViewMode === 'view' && selectedSusp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <Button
                  label="Back to Suspensions List"
                  icon="arrow-left"
                  variant="secondary"
                  size="small"
                  onClick={() => setSuspViewMode('list')}
                />
                <span className="text-xs font-semibold text-gray-500">
                  Suspension Dossier: {selectedSusp.orderNo}
                </span>
              </div>

              <FormCard
                title={`Order Dossier — ${selectedSusp.orderNo}`}
                subtitle={`${selectedSusp.actionType} under ${selectedSusp.clauseReference}`}
              >
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem 1.5rem',
                      fontSize: '0.8125rem',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {[
                      ['Order Number', selectedSusp.orderNo],
                      ['Action Type', selectedSusp.actionType],
                      ['Work Name', selectedSusp.workName],
                      ['Contractor', selectedSusp.contractorName],
                      ['Statutory Clause', selectedSusp.clauseReference],
                      ['Order Date', selectedSusp.orderDate],
                      ['Effective Date', selectedSusp.effectiveDate],
                      ['Reason Category', selectedSusp.reason],
                      ['Ordered By', selectedSusp.orderedBy],
                      ['Current Status', selectedSusp.status],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div
                          style={{
                            color: '#9ca3af',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {k}
                        </div>
                        <div style={{ fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '0.25rem',
                      }}
                    >
                      Detailed Reason & Background:
                    </div>
                    <div
                      style={{
                        padding: '0.75rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.5rem',
                        fontSize: '0.8125rem',
                        color: '#991b1b',
                      }}
                    >
                      {selectedSusp.reasonDescription}
                    </div>
                  </div>

                  {selectedSusp.actionType === 'Suspension' && (
                    <div
                      style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}
                    >
                      <strong>Site Preservation Expenses Allowed:</strong>{' '}
                      {formatCurrency(selectedSusp.sitePreservationExpenses)}
                    </div>
                  )}

                  {selectedSusp.actionType === 'Foreclosure' && (
                    <div
                      style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}
                    >
                      <div>
                        <strong>Final Measurement Date:</strong>{' '}
                        {selectedSusp.finalMeasurementDate || '—'}
                      </div>
                      <div>
                        <strong>Contractor Settlement Amount:</strong>{' '}
                        {formatCurrency(selectedSusp.settlementAmount)}
                      </div>
                    </div>
                  )}

                  {selectedSusp.remarks && (
                    <div
                      style={{
                        marginBottom: '1rem',
                        fontSize: '0.8125rem',
                        color: '#4b5563',
                      }}
                    >
                      <strong>Directives / Remarks:</strong>{' '}
                      {selectedSusp.remarks}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                    {selectedSusp.status === 'Active Suspension' && (
                      <Button
                        label="Revoke Suspension"
                        icon="undo"
                        variant="success"
                        onClick={() => handleRevokeSuspension(selectedSusp!)}
                      />
                    )}
                    <Button
                      label="Back to List"
                      variant="outlined"
                      onClick={() => setSuspViewMode('list')}
                    />
                  </div>
                </div>
              </FormCard>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        visible={confirmState.mode === 'sign'}
        onHide={() => setConfirmState({ mode: 'closed' })}
        onConfirm={doSign}
        variant="warning"
        title="Sign & Issue Work Order"
        message={`This records digital signatures and formally issues the Notice to Proceed for ${selectedWO?.workOrderNo ?? 'this work order'}, establishing the legal commencement date. Proceed?`}
        confirmLabel="Sign & Issue"
      />

      <ConfirmDialog
        visible={confirmState.mode === 'suspend'}
        onHide={() => setConfirmState({ mode: 'closed' })}
        onConfirm={doSaveSuspension}
        variant="danger"
        title={`Issue ${suspForm.actionType} Order`}
        message={
          suspForm.actionType === 'Suspension'
            ? 'This suspends the selected work order under CPWD Clause 15 and changes its status to Suspended. Proceed?'
            : 'This forecloses the selected work order under CPWD Clause 13 and terminates the contract. This is a serious statutory action. Proceed?'
        }
        confirmLabel={`Issue ${suspForm.actionType}`}
      />

      <ConfirmDialog
        visible={confirmState.mode === 'revoke'}
        onHide={() => setConfirmState({ mode: 'closed' })}
        onConfirm={() => {
          if (confirmState.mode === 'revoke') {
            doRevokeSuspension(confirmState.item);
            setSuspViewMode('list');
          }
        }}
        variant="warning"
        title="Revoke Suspension"
        message="This revokes the active suspension and resumes the work order to In Progress. Proceed?"
        confirmLabel="Revoke & Resume"
      />
    </FormPage>
  );
}
