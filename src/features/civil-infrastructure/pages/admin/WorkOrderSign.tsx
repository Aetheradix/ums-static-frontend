import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  workOrders as initialWorkOrders,
  contractors as initialContractors,
  civilWorks as initialWorks,
  milestones as initialMilestones,
  initialWorkSuspensions,
} from '../../mocks';
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import { civilUrls } from '../../urls';
import '../civil.css';

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

  // Suspension & Foreclosure state (Task 3.10)
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

  // Modal states
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'sign' | 'agreement';
    item?: any;
  }>({ mode: 'closed' });
  const [remarks, setRemarks] = useState('');

  // Agreement edit form state (Task 4.2)
  const [agrForm, setAgrForm] =
    useState<CivilManagement.ContractAgreementDetails>({
      agreementNo: '',
      agreementDate: '',
      stampDutyAmount: 0,
      stampDutyReceiptNo: '',
      registrationStatus: 'Registered',
      scannedAgreementDoc: '',
      bgNo: '',
      bgBank: '',
      bgAmount: 0,
      bgExpiryDate: '',
      mobAdvanceBgNo: '',
      mobAdvanceBgBank: '',
      mobAdvanceBgAmount: 0,
      mobAdvanceBgExpiry: '',
    });

  // Suspension form modal state
  const [suspensionPopup, setSuspensionPopup] = useState<{
    mode: 'closed' | 'create' | 'view';
    item?: CivilManagement.WorkSuspensionForeclosure;
  }>({ mode: 'closed' });

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

  // Open agreement editor modal
  const openAgreementModal = (item: any) => {
    setAgrForm({
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
      bgNo:
        item.bgNo ||
        `BG-SBI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bgBank: item.bgBank || 'State Bank of India',
      bgAmount:
        item.bgAmount ||
        item.sdAmount ||
        Math.round((item.contractAmount || 0) * 0.05),
      bgExpiryDate: item.bgExpiryDate || item.completionDate || '',
      mobAdvanceBgNo: item.mobAdvanceBgNo || '',
      mobAdvanceBgBank: item.mobAdvanceBgBank || '',
      mobAdvanceBgAmount: item.mobAdvanceBgAmount || 0,
      mobAdvanceBgExpiry: item.mobAdvanceBgExpiry || '',
    });
    setPopup({ mode: 'agreement', item });
  };

  // Save agreement details
  const handleSaveAgreement = () => {
    if (!popup.item) return;
    if (!agrForm.agreementNo.trim()) {
      ToastService.error('Contract Agreement Number is required.');
      return;
    }
    const updated = workOrders.map((w: any) =>
      w.id === popup.item.id
        ? {
            ...w,
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
            mobAdvanceBgNo: agrForm.mobAdvanceBgNo,
            mobAdvanceBgBank: agrForm.mobAdvanceBgBank,
            mobAdvanceBgAmount: Number(agrForm.mobAdvanceBgAmount) || 0,
            mobAdvanceBgExpiry: agrForm.mobAdvanceBgExpiry,
          }
        : w
    );
    setWorkOrders(updated);
    ToastService.success(
      `Contract Agreement details updated for ${popup.item.workOrderNo}.`
    );
    setPopup({ mode: 'closed' });
  };

  // Sign Work Order handler
  const handleSign = () => {
    if (!popup.item) return;
    const updated = workOrders.map((w: any) =>
      w.id === popup.item.id
        ? {
            ...w,
            signedByContractor: true,
            signedByEE: true,
            signedByAdmin: true,
            status: 'Work Started' as any,
          }
        : w
    );
    setWorkOrders(updated);

    // Also update civil work status in localStorage to "In Progress"
    const updatedWorks = civilWorks.map((w: any) =>
      w.id === popup.item.workId || w.workId === popup.item.workId
        ? { ...w, status: 'In Progress' as any }
        : w
    );
    setCivilWorks(updatedWorks);
    civilStorage.set(CIVIL_STORAGE_KEYS.WORKS, updatedWorks);

    ToastService.success(
      'Work Order approved and signed by Admin. Notice to Proceed issued. Project start timestamp recorded.'
    );
    setPopup({ mode: 'closed' });
  };

  // Open Record Suspension / Foreclosure modal
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
    setSuspensionPopup({ mode: 'create' });
  };

  // Save new Suspension / Foreclosure order
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
    setSuspensionPopup({ mode: 'closed' });
  };

  // Revoke an active suspension
  const handleRevokeSuspension = (
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
      {/* 2-Tab Navigation Switcher */}
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
                background: activeTab === 'WORK_ORDERS' ? '#1d4ed8' : '#9ca3af',
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
                background: activeTab === 'SUSPENSION' ? '#b91c1c' : '#9ca3af',
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

      {/* TAB 1: WORK ORDERS & CONTRACT AGREEMENTS */}
      {activeTab === 'WORK_ORDERS' && (
        <FormCard>
          <GridPanel
            data={workOrders}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
              {
                field: 'workOrderNo',
                header: 'WO No',
                cell: (w: any) => (
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
                      {w.workOrderNo}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      Issued: {w.issuedDate}
                    </span>
                  </div>
                ),
              },
              { field: 'workName', header: 'Work Name' },
              {
                field: 'contractorName',
                header: 'Contractor',
                cell: (w: any) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{w.contractorName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      GSTIN: {contractor(w.contractorId)?.gstNo ?? '—'}
                    </div>
                  </div>
                ),
              },
              {
                field: 'agreementNo' as any,
                header: 'Contract Agreement',
                cell: (w: any) => (
                  <div>
                    {w.agreementNo ? (
                      <>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: '#0f766e',
                            fontSize: '0.75rem',
                            display: 'block',
                          }}
                        >
                          {w.agreementNo}
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.25rem',
                            marginTop: '2px',
                          }}
                        >
                          <span
                            className={`civil-pill ${w.registrationStatus === 'Registered' ? 'green' : 'amber'}`}
                            style={{ fontSize: '0.625rem' }}
                          >
                            {w.registrationStatus || 'Registered'}
                          </span>
                          {w.stampDutyAmount ? (
                            <span
                              style={{ fontSize: '0.68rem', color: '#4b5563' }}
                            >
                              Stamp: ₹{(w.stampDutyAmount / 1000).toFixed(0)}k
                            </span>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <span
                        className="civil-pill neutral"
                        style={{ fontSize: '0.65rem' }}
                      >
                        Agreement Pending
                      </span>
                    )}
                  </div>
                ),
              },
              {
                field: 'bgNo' as any,
                header: 'Performance BG',
                cell: (w: any) => (
                  <div>
                    {w.bgNo ? (
                      <>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            color: '#1e3a8a',
                          }}
                        >
                          ₹{(w.bgAmount / 100000).toFixed(1)}L
                        </span>
                        <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>
                          Exp: {w.bgExpiryDate || '—'}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                        SD: ₹{(w.sdAmount / 100000).toFixed(1)}L
                      </span>
                    )}
                  </div>
                ),
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
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <Button
                      size="small"
                      icon="eye"
                      variant="outlined"
                      title="View WO & Agreement Dossier"
                      onClick={() => setPopup({ mode: 'view', item })}
                    />
                    <Button
                      size="small"
                      icon="file-edit"
                      variant="secondary"
                      title="Manage Agreement & BG Details"
                      onClick={() => openAgreementModal(item)}
                    />
                    {!item.signedByAdmin && (
                      <Button
                        size="small"
                        label="Sign & Issue"
                        icon="check"
                        variant="primary"
                        onClick={() => {
                          setRemarks('');
                          setPopup({ mode: 'sign', item });
                        }}
                      />
                    )}
                  </div>
                ),
              },
            ]}
            searchBox
            searchPlaceholder="Search work orders, agreements, contractors..."
          />
        </FormCard>
      )}

      {/* TAB 2: SUSPENSION & FORECLOSURE */}
      {activeTab === 'SUSPENSION' && (
        <FormCard>
          <GridPanel
            data={suspensions}
            columns={[
              { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
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
                      <span style={{ fontSize: '0.78rem', color: '#b45309' }}>
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
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <Button
                      size="small"
                      icon="eye"
                      variant="outlined"
                      title="View Suspension Dossier"
                      onClick={() => setSuspensionPopup({ mode: 'view', item })}
                    />
                    {item.status === 'Active Suspension' && (
                      <Button
                        size="small"
                        label="Revoke"
                        icon="undo"
                        variant="success"
                        title="Revoke Suspension & Resume Work"
                        onClick={() => handleRevokeSuspension(item)}
                      />
                    )}
                  </div>
                ),
              },
            ]}
            searchBox
            searchPlaceholder="Search suspensions, foreclosure orders, works..."
          />
        </FormCard>
      )}

      {/* POPUP: VIEW WO & AGREEMENT DOSSIER */}
      <FormPopup
        visible={popup.mode === 'view' || popup.mode === 'sign'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'sign'
            ? `Sign & Issue Notice to Proceed — ${popup.item?.workOrderNo}`
            : `Work Order & Agreement Dossier — ${popup.item?.workOrderNo}`
        }
        subtitle="Formal statutory agreement, BG securities, QA covenants, and milestone release schedules."
        size="lg"
      >
        {popup.item && (
          <div>
            {/* Summary details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem 2rem',
                fontSize: '0.8125rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {[
                ['Work Order No', popup.item.workOrderNo],
                ['Work Name', popup.item.workName],
                ['Contractor', popup.item.contractorName],
                ['Contract Value', formatCurrency(popup.item.contractAmount)],
                ['Commencement Date', popup.item.commencementDate],
                ['Scheduled Completion', popup.item.completionDate],
                ['Advance Paid', formatCurrency(popup.item.advancePaid)],
                [
                  'Security Deposit',
                  `${formatCurrency(popup.item.sdAmount)} (${popup.item.sdPercentage}%)`,
                ],
                ['TPI Inspection Agency', popup.item.tpiAgencyName ?? '—'],
                ['Material Testing Lab', popup.item.qualityLabName ?? '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div
                    style={{
                      color: '#9ca3af',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* CONTRACT AGREEMENT & BANK GUARANTEE SECTION (Task 4.2) */}
            <div
              style={{
                border: '1px solid #e0e7ff',
                background: '#f8faff',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0,
                  }}
                >
                  <i className="pi pi-file-pdf" style={{ color: '#2563eb' }} />
                  <span>
                    Contract Agreement & Bank Guarantee Securities (CPWD Form
                    7/8)
                  </span>
                </h4>
                <Button
                  size="small"
                  label="Edit Agreement Details"
                  icon="file-edit"
                  variant="outlined"
                  onClick={() => openAgreementModal(popup.item)}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem 1.25rem',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    Agreement Number
                  </div>
                  <strong style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>
                    {popup.item.agreementNo || 'Pending Execution'}
                  </strong>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    Execution Date
                  </div>
                  <strong>{popup.item.agreementDate || '—'}</strong>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    Stamp Duty / Registration
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <strong>
                      {formatCurrency(popup.item.stampDutyAmount)}
                    </strong>
                    <span
                      className="civil-pill green"
                      style={{ fontSize: '0.625rem' }}
                    >
                      {popup.item.registrationStatus || 'Registered'}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    Stamp Duty Receipt No
                  </div>
                  <span style={{ fontFamily: 'monospace' }}>
                    {popup.item.stampDutyReceiptNo || '—'}
                  </span>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    Performance BG (PBG)
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {popup.item.bgNo
                      ? `${formatCurrency(popup.item.bgAmount)} (${popup.item.bgNo})`
                      : 'SD Deducted in Bills'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    PBG Bank & Validity
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    {popup.item.bgBank
                      ? `${popup.item.bgBank} (Upto ${popup.item.bgExpiryDate})`
                      : '—'}
                  </div>
                </div>
                {popup.item.mobAdvanceBgNo && (
                  <>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                        Mobilization Advance BG
                      </div>
                      <strong>
                        {formatCurrency(popup.item.mobAdvanceBgAmount)}
                      </strong>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                        Mob BG Bank & Ref
                      </div>
                      <span style={{ fontFamily: 'monospace' }}>
                        {popup.item.mobAdvanceBgBank} (
                        {popup.item.mobAdvanceBgNo})
                      </span>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                        Mob BG Expiry
                      </div>
                      <span>{popup.item.mobAdvanceBgExpiry}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Milestones Schedule */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="pi pi-flag" style={{ color: '#2563eb' }} />
                <span>Project Milestone & Payment Release Schedule</span>
              </h4>

              {(() => {
                const workMls = milestones.filter(
                  (m: any) => m.workId === popup.item.workId
                );

                if (workMls.length === 0) {
                  return (
                    <div
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        border: '1px dashed #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.8125rem',
                        color: '#6b7280',
                      }}
                    >
                      No milestones defined for this work order.
                    </div>
                  );
                }

                return (
                  <table
                    className="civil-table"
                    style={{ width: '100%', fontSize: '0.78rem' }}
                  >
                    <thead>
                      <tr style={{ background: '#f3f4f6' }}>
                        <th style={{ padding: '0.375rem 0.5rem' }}>Seq</th>
                        <th style={{ padding: '0.375rem 0.5rem' }}>
                          Milestone Stage
                        </th>
                        <th
                          style={{
                            padding: '0.375rem 0.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Release %
                        </th>
                        <th
                          style={{
                            padding: '0.375rem 0.5rem',
                            textAlign: 'right',
                          }}
                        >
                          Equivalent Payment
                        </th>
                        <th style={{ padding: '0.375rem 0.5rem' }}>QA Gate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workMls.map((m: any) => {
                        const releaseAmt =
                          (popup.item.contractAmount * m.weightage) / 100;
                        return (
                          <tr key={m.id}>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                fontWeight: 600,
                              }}
                            >
                              #{m.sequenceNo}
                            </td>
                            <td style={{ padding: '0.375rem 0.5rem' }}>
                              {m.milestoneName}
                            </td>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'center',
                                fontWeight: 700,
                                color: '#2563eb',
                              }}
                            >
                              {m.weightage}%
                            </td>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                textAlign: 'right',
                                fontWeight: 700,
                                color: '#16a34a',
                              }}
                            >
                              {formatCurrency(releaseAmt)}
                            </td>
                            <td style={{ padding: '0.375rem 0.5rem' }}>
                              {m.qualityTestRequired ? (
                                <span
                                  className="civil-pill red"
                                  style={{ fontSize: '0.625rem' }}
                                >
                                  TPI Required
                                </span>
                              ) : (
                                <span style={{ color: '#9ca3af' }}>N/A</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {popup.mode === 'sign' && (
              <>
                <div
                  style={{
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    marginTop: '1.25rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                  }}
                >
                  <strong>Admin Approval & Notice to Proceed:</strong> This
                  action records digital signatures, validates Contract
                  Agreement & Bank Guarantee compliances, and formally transmits
                  Notice to Proceed, establishing the legal Commencement Date.
                </div>
                <TextArea
                  label="Admin Approval Remarks"
                  placeholder="Admin approval notes, statutory compliance clearance..."
                  value={remarks}
                  onChange={setRemarks}
                  rows={2}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Approve, Sign & Issue Work Order"
                    variant="primary"
                    icon="check"
                    onClick={handleSign}
                  />
                </div>
              </>
            )}

            {popup.mode === 'view' && (
              <div className="flex justify-end mt-4">
                <Button
                  label="Close"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'closed' })}
                />
              </div>
            )}
          </div>
        )}
      </FormPopup>

      {/* POPUP: EDIT CONTRACT AGREEMENT & BG (Task 4.2) */}
      <FormPopup
        visible={popup.mode === 'agreement'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Contract Agreement & Bank Guarantee Securities — ${popup.item?.workOrderNo}`}
        subtitle="Record formal agreement deed execution, state stamp duties, and performance security instruments."
        size="lg"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              color: '#166534',
            }}
          >
            <strong>Work:</strong> {popup.item?.workName} &nbsp;|&nbsp;{' '}
            <strong>Contractor:</strong> {popup.item?.contractorName}{' '}
            &nbsp;|&nbsp; <strong>Contract Value:</strong>{' '}
            {formatCurrency(popup.item?.contractAmount)}
          </div>

          <h5
            style={{
              fontWeight: 700,
              color: '#1e3a8a',
              margin: '0.5rem 0 0 0',
            }}
          >
            Part A: Statutory Agreement & Stamp Duty Details
          </h5>

          <FormGrid columns={2}>
            <TextBox
              label="Agreement Number *"
              placeholder="AGR/CW/2025-26/001"
              value={agrForm.agreementNo}
              onChange={val => setAgrForm({ ...agrForm, agreementNo: val })}
              required
            />
            <TextBox
              label="Execution Date *"
              type="date"
              value={agrForm.agreementDate}
              onChange={val => setAgrForm({ ...agrForm, agreementDate: val })}
              required
            />
          </FormGrid>

          <FormGrid columns={3}>
            <TextBox
              label="Stamp Duty Paid (₹) *"
              type="number"
              placeholder="129250"
              value={String(agrForm.stampDutyAmount)}
              onChange={val =>
                setAgrForm({ ...agrForm, stampDutyAmount: Number(val) || 0 })
              }
              required
            />
            <TextBox
              label="Stamp Duty Receipt No *"
              placeholder="STAMP/MP/2025/11029"
              value={agrForm.stampDutyReceiptNo}
              onChange={val =>
                setAgrForm({ ...agrForm, stampDutyReceiptNo: val })
              }
              required
            />
            <DropDownList
              label="Registration Status *"
              data={[
                { label: 'Registered with Sub-Registrar', value: 'Registered' },
                {
                  label: 'Notarized Stamp Paper Deed',
                  value: 'Notary Stamped',
                },
                { label: 'Deed Under Execution', value: 'Pending' },
              ]}
              textField="label"
              optionValue="value"
              value={agrForm.registrationStatus}
              onChange={val =>
                setAgrForm({ ...agrForm, registrationStatus: val as any })
              }
              required
            />
          </FormGrid>

          <TextBox
            label="Scanned Agreement Document File Name"
            placeholder="Contract_Agreement_Signed.pdf"
            value={agrForm.scannedAgreementDoc || ''}
            onChange={val =>
              setAgrForm({ ...agrForm, scannedAgreementDoc: val })
            }
          />

          <h5
            style={{
              fontWeight: 700,
              color: '#1e3a8a',
              margin: '0.75rem 0 0 0',
            }}
          >
            Part B: Performance Bank Guarantee (PBG / Security Deposit)
          </h5>

          <FormGrid columns={2}>
            <TextBox
              label="Performance BG Number"
              placeholder="BG-SBI-2025-9921"
              value={agrForm.bgNo || ''}
              onChange={val => setAgrForm({ ...agrForm, bgNo: val })}
            />
            <TextBox
              label="Issuing Bank & Branch"
              placeholder="State Bank of India, TT Nagar Branch"
              value={agrForm.bgBank || ''}
              onChange={val => setAgrForm({ ...agrForm, bgBank: val })}
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="PBG Amount (₹)"
              type="number"
              placeholder="1292500"
              value={String(agrForm.bgAmount || 0)}
              onChange={val =>
                setAgrForm({ ...agrForm, bgAmount: Number(val) || 0 })
              }
            />
            <TextBox
              label="PBG Expiry Date"
              type="date"
              value={agrForm.bgExpiryDate || ''}
              onChange={val => setAgrForm({ ...agrForm, bgExpiryDate: val })}
            />
          </FormGrid>

          <h5
            style={{
              fontWeight: 700,
              color: '#1e3a8a',
              margin: '0.75rem 0 0 0',
            }}
          >
            Part C: Mobilization Advance BG (If Applicable)
          </h5>

          <FormGrid columns={2}>
            <TextBox
              label="Mob Advance BG Number"
              placeholder="BG-MOB-2025-001"
              value={agrForm.mobAdvanceBgNo || ''}
              onChange={val => setAgrForm({ ...agrForm, mobAdvanceBgNo: val })}
            />
            <TextBox
              label="Issuing Bank"
              placeholder="Punjab National Bank"
              value={agrForm.mobAdvanceBgBank || ''}
              onChange={val =>
                setAgrForm({ ...agrForm, mobAdvanceBgBank: val })
              }
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="Mob Advance BG Amount (₹)"
              type="number"
              placeholder="2585000"
              value={String(agrForm.mobAdvanceBgAmount || 0)}
              onChange={val =>
                setAgrForm({ ...agrForm, mobAdvanceBgAmount: Number(val) || 0 })
              }
            />
            <TextBox
              label="Mob Advance BG Expiry"
              type="date"
              value={agrForm.mobAdvanceBgExpiry || ''}
              onChange={val =>
                setAgrForm({ ...agrForm, mobAdvanceBgExpiry: val })
              }
            />
          </FormGrid>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Save Agreement Details"
              variant="primary"
              icon="save"
              onClick={handleSaveAgreement}
            />
          </div>
        </div>
      </FormPopup>

      {/* POPUP: RECORD SUSPENSION OR FORECLOSURE (Task 3.10) */}
      <FormPopup
        visible={suspensionPopup.mode === 'create'}
        onHide={() => setSuspensionPopup({ mode: 'closed' })}
        title="Record Work Suspension or Foreclosure Order"
        subtitle="Exercise statutory powers under CPWD GCC Clause 15 (Suspension) or Clause 13 (Foreclosure due to Abandonment/Fund Crunch)."
        size="lg"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <FormGrid columns={2}>
            <DropDownList
              label="Target Work Order *"
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
              label="Statutory Action Type *"
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
              label="Official Order Number *"
              placeholder="ORD/SUSP/2026/045"
              value={suspForm.orderNo}
              onChange={val => setSuspForm({ ...suspForm, orderNo: val })}
              required
            />
            <TextBox
              label="Order Date *"
              type="date"
              value={suspForm.orderDate}
              onChange={val => setSuspForm({ ...suspForm, orderDate: val })}
              required
            />
            <TextBox
              label="Effective Date *"
              type="date"
              value={suspForm.effectiveDate}
              onChange={val => setSuspForm({ ...suspForm, effectiveDate: val })}
              required
            />
          </FormGrid>

          <FormGrid columns={2}>
            <DropDownList
              label="Reason Classification *"
              data={[
                { label: 'Court Stay / Legal Injunction', value: 'Court Stay' },
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
              onChange={val => setSuspForm({ ...suspForm, reason: val as any })}
              required
            />
            <DropDownList
              label="Ordering Authority *"
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
            label="Reason Description & Background Justification *"
            placeholder="Detailed narrative describing the circumstances leading to suspension or foreclosure..."
            value={suspForm.reasonDescription}
            onChange={val =>
              setSuspForm({ ...suspForm, reasonDescription: val })
            }
            rows={2}
          />

          {suspForm.actionType === 'Suspension' ? (
            <FormGrid columns={2}>
              <TextBox
                label="Site Preservation & Securing Expenses (₹)"
                type="number"
                placeholder="50000"
                value={suspForm.sitePreservationExpenses}
                onChange={val =>
                  setSuspForm({ ...suspForm, sitePreservationExpenses: val })
                }
              />
              <TextBox
                label="Safety & Security Directives"
                placeholder="Secure excavated pits, barricade perimeter, dewater trenches..."
                value={suspForm.remarks}
                onChange={val => setSuspForm({ ...suspForm, remarks: val })}
              />
            </FormGrid>
          ) : (
            <FormGrid columns={2}>
              <TextBox
                label="Final Joint Measurement Date *"
                type="date"
                value={suspForm.finalMeasurementDate}
                onChange={val =>
                  setSuspForm({ ...suspForm, finalMeasurementDate: val })
                }
              />
              <TextBox
                label="Agreed Settlement / Compensation Amount (₹)"
                type="number"
                placeholder="1850000"
                value={suspForm.settlementAmount}
                onChange={val =>
                  setSuspForm({ ...suspForm, settlementAmount: val })
                }
              />
            </FormGrid>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setSuspensionPopup({ mode: 'closed' })}
            />
            <Button
              label={`Issue ${suspForm.actionType} Order`}
              variant="danger"
              icon="check"
              onClick={handleSaveSuspension}
            />
          </div>
        </div>
      </FormPopup>

      {/* POPUP: VIEW SUSPENSION / FORECLOSURE DOSSIER */}
      <FormPopup
        visible={suspensionPopup.mode === 'view'}
        onHide={() => setSuspensionPopup({ mode: 'closed' })}
        title={`Order Dossier — ${suspensionPopup.item?.orderNo}`}
        subtitle={`${suspensionPopup.item?.actionType} under ${suspensionPopup.item?.clauseReference}`}
        size="md"
      >
        {suspensionPopup.item && (
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
                ['Order Number', suspensionPopup.item.orderNo],
                ['Action Type', suspensionPopup.item.actionType],
                ['Work Name', suspensionPopup.item.workName],
                ['Contractor', suspensionPopup.item.contractorName],
                ['Statutory Clause', suspensionPopup.item.clauseReference],
                ['Order Date', suspensionPopup.item.orderDate],
                ['Effective Date', suspensionPopup.item.effectiveDate],
                ['Reason Category', suspensionPopup.item.reason],
                ['Ordered By', suspensionPopup.item.orderedBy],
                ['Current Status', suspensionPopup.item.status],
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
                {suspensionPopup.item.reasonDescription}
              </div>
            </div>

            {suspensionPopup.item.actionType === 'Suspension' && (
              <div style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}>
                <strong>Site Preservation Expenses Allowed:</strong>{' '}
                {formatCurrency(suspensionPopup.item.sitePreservationExpenses)}
              </div>
            )}

            {suspensionPopup.item.actionType === 'Foreclosure' && (
              <div style={{ marginBottom: '1rem', fontSize: '0.8125rem' }}>
                <div>
                  <strong>Final Measurement Date:</strong>{' '}
                  {suspensionPopup.item.finalMeasurementDate || '—'}
                </div>
                <div>
                  <strong>Contractor Settlement Amount:</strong>{' '}
                  {formatCurrency(suspensionPopup.item.settlementAmount)}
                </div>
              </div>
            )}

            {suspensionPopup.item.remarks && (
              <div
                style={{
                  marginBottom: '1rem',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                }}
              >
                <strong>Directives / Remarks:</strong>{' '}
                {suspensionPopup.item.remarks}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              {suspensionPopup.item.status === 'Active Suspension' && (
                <Button
                  label="Revoke Suspension"
                  icon="undo"
                  variant="success"
                  onClick={() => {
                    handleRevokeSuspension(suspensionPopup.item!);
                    setSuspensionPopup({ mode: 'closed' });
                  }}
                />
              )}
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setSuspensionPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
