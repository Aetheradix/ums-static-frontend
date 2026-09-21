import { useState } from 'react';
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
import { type RABill, raBills as initialData, mbEntries } from '../../mocks';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../civilStorage';
import { civilUrls } from '../../urls';
import '../civil.css';

const statusVariant = (s: string) =>
  s === 'Paid'
    ? 'approved'
    : s === 'Rejected'
      ? 'rejected'
      : s === 'Finance Cleared' || s === 'EE Approved'
        ? 'pending'
        : 'neutral';

export default function RABillProcessing() {
  const [data, setData] = useCivilStorage<RABill[]>(
    CIVIL_STORAGE_KEYS.RA_BILLS,
    initialData
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'process';
    item?: RABill;
  }>({ mode: 'closed' });

  const [remarks, setRemarks] = useState('');

  // Statutory Tax & Deduction Form state for live processing
  const [calcForm, setCalcForm] = useState<{
    grossAmount: number;
    gstRate: number;
    isRCM: boolean;
    advanceRecovery: number;
    securityDepositRate: number;
    itTdsRate: number;
    gstTdsRate: number;
    labourCessRate: number;
    otherDeductions: number;
  }>({
    grossAmount: 0,
    gstRate: 18,
    isRCM: false,
    advanceRecovery: 0,
    securityDepositRate: 5,
    itTdsRate: 2,
    gstTdsRate: 2,
    labourCessRate: 1,
    otherDeductions: 0,
  });

  const [mbList] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.MB_ENTRIES,
    mbEntries
  );

  const linkedMBs = (ids: string[]) =>
    mbList.filter((m: any) => ids.includes(m.id));

  const formatCurrency = (n?: number) =>
    n !== undefined ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

  const openProcessModal = (item: RABill) => {
    setCalcForm({
      grossAmount: item.grossAmount,
      gstRate: item.gstRate ?? 18,
      isRCM: item.isRCM ?? false,
      advanceRecovery: item.advanceRecovery ?? 0,
      securityDepositRate: item.grossAmount
        ? Math.round(((item.securityDeposit || 0) / item.grossAmount) * 100) ||
          5
        : 5,
      itTdsRate: item.itTdsRate ?? 2,
      gstTdsRate: item.gstTdsRate ?? 2,
      labourCessRate: item.labourCessRate ?? 1,
      otherDeductions: item.otherDeductions ?? 0,
    });
    setRemarks('');
    setPopup({ mode: 'process', item });
  };

  // Compute live breakdown
  const computedGST = calcForm.isRCM
    ? 0
    : Math.round((calcForm.grossAmount * calcForm.gstRate) / 100);
  const computedSD = Math.round(
    (calcForm.grossAmount * calcForm.securityDepositRate) / 100
  );
  const computedItTds = Math.round(
    (calcForm.grossAmount * calcForm.itTdsRate) / 100
  );
  const computedGstTds = Math.round(
    (calcForm.grossAmount * calcForm.gstTdsRate) / 100
  );
  const computedLabourCess = Math.round(
    (calcForm.grossAmount * calcForm.labourCessRate) / 100
  );
  const totalDeductions =
    calcForm.advanceRecovery +
    computedSD +
    computedItTds +
    computedGstTds +
    computedLabourCess +
    calcForm.otherDeductions;
  const netPayable = calcForm.grossAmount + computedGST - totalDeductions;

  const handleProcess = () => {
    if (!popup.item) return;
    const mbsApproved = linkedMBs(popup.item.linkedMBs).every(
      (m: any) => m.status === 'Approved by EE' || m.status === 'Verified by AE'
    );
    if (!mbsApproved) {
      ToastService.error(
        'Rule 1 Violation: Not all linked MB entries are EE-approved. Finance cannot process this bill.'
      );
      return;
    }

    const updated = data.map((b: RABill) =>
      b.id === popup.item!.id
        ? {
            ...b,
            gstRate: calcForm.gstRate,
            isRCM: calcForm.isRCM,
            gstAmount: computedGST,
            advanceRecovery: calcForm.advanceRecovery,
            securityDeposit: computedSD,
            itTdsRate: calcForm.itTdsRate,
            itTdsAmount: computedItTds,
            gstTdsRate: calcForm.gstTdsRate,
            gstTdsAmount: computedGstTds,
            labourCessRate: calcForm.labourCessRate,
            labourCessAmount: computedLabourCess,
            otherDeductions: calcForm.otherDeductions,
            netPayable: netPayable,
            status: 'Finance Cleared' as const,
            remarks: remarks || b.remarks,
          }
        : b
    );
    setData(updated);
    ToastService.success(
      `Bill ${popup.item.billNo} verified with GST & statutory TDS deductions. Net Payable ₹${netPayable.toLocaleString('en-IN')} cleared for payment.`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="RA Bill Statutory Verification & Processing"
      description="Finance audit of Measurement Book linkages, Goods & Services Tax (GST), Income Tax TDS Sec 194C, GST-TDS Sec 51, and BOCW Labour Cess deductions. Rule 1 strictly enforced."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Finance & Accounts', to: civilUrls.financeMenu },
        { label: 'RA Bill Processing' },
      ]}
    >
      {/* Rule 1 Banner */}
      <div
        style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '0.875rem',
          padding: '0.875rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#991b1b',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <i
          className="pi pi-shield"
          style={{ fontSize: '1.25rem', color: '#b91c1c' }}
        />
        <div>
          <strong>
            🔴 CPWD Rule 1 — No MB = No Bill (Finance Statutory Enforcement):
          </strong>{' '}
          Finance Department independently verifies that every line item in the
          RA Bill is backed by an EE-approved Measurement Book entry before
          applying GST & statutory TDS deductions.
        </div>
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'billNo',
              header: 'Bill No',
              cell: (b: RABill) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                      display: 'block',
                    }}
                  >
                    {b.billNo}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      color: '#6b7280',
                    }}
                  >
                    {b.raNo}
                  </span>
                </div>
              ),
            },
            {
              field: 'workName',
              header: 'Work & Contractor',
              cell: (b: RABill) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{b.workName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#4b5563' }}>
                    {b.contractorName}
                  </div>
                </div>
              ),
            },
            {
              field: 'grossAmount',
              header: 'Gross (₹)',
              cell: (b: RABill) => (
                <span style={{ fontWeight: 600 }}>
                  {formatCurrency(b.grossAmount)}
                </span>
              ),
            },
            {
              field: 'gstAmount' as any,
              header: 'GST (18%/12%)',
              cell: (b: RABill) => (
                <div>
                  {b.gstAmount !== undefined ? (
                    <>
                      <span
                        style={{
                          color: '#047857',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        +{formatCurrency(b.gstAmount)}
                      </span>
                      <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>
                        {b.gstRate ?? 18}% {b.isRCM ? '(RCM)' : '(Forward)'}
                      </div>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Not Audited
                    </span>
                  )}
                </div>
              ),
            },
            {
              field: 'itTdsAmount' as any,
              header: 'IT-TDS / GST-TDS',
              cell: (b: RABill) => {
                const itTds = b.itTdsAmount ?? Math.round(b.grossAmount * 0.02);
                const gstTds =
                  b.gstTdsAmount ?? Math.round(b.grossAmount * 0.02);
                return (
                  <div style={{ fontSize: '0.72rem' }}>
                    <div style={{ color: '#b91c1c' }}>
                      IT: -{formatCurrency(itTds)}
                    </div>
                    <div style={{ color: '#b45309' }}>
                      GST: -{formatCurrency(gstTds)}
                    </div>
                  </div>
                );
              },
            },
            {
              field: 'securityDeposit',
              header: 'SD / Adv Rec.',
              cell: (b: RABill) => (
                <div style={{ fontSize: '0.72rem' }}>
                  <div style={{ color: '#7c3aed' }}>
                    SD: -{formatCurrency(b.securityDeposit)}
                  </div>
                  <div style={{ color: '#d97706' }}>
                    Adv: -{formatCurrency(b.advanceRecovery)}
                  </div>
                </div>
              ),
            },
            {
              field: 'labourCessAmount' as any,
              header: 'BOCW Cess',
              cell: (b: RABill) => {
                const cess =
                  b.labourCessAmount ?? Math.round(b.grossAmount * 0.01);
                return (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#0369a1',
                      fontWeight: 600,
                    }}
                  >
                    -{formatCurrency(cess)}
                  </span>
                );
              },
            },
            {
              field: 'netPayable',
              header: 'Net Payable',
              cell: (b: RABill) => (
                <span
                  style={{
                    fontWeight: 700,
                    color: '#16a34a',
                    fontSize: '0.85rem',
                  }}
                >
                  {formatCurrency(b.netPayable)}
                </span>
              ),
            },
            {
              field: 'linkedMBs',
              header: 'Linked MBs',
              cell: (b: RABill) => (
                <span
                  className="civil-pill blue"
                  style={{ fontSize: '0.7rem' }}
                >
                  {b.linkedMBs.length} MB(s)
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (b: RABill) => (
                <StatusBadge
                  label={b.status}
                  variant={statusVariant(b.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: RABill) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    title="View Tax & Deduction Dossier"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {item.status === 'EE Approved' && (
                    <Button
                      size="small"
                      label="Audit & Clear"
                      icon="check"
                      variant="primary"
                      onClick={() => openProcessModal(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search RA bills, contractors, works..."
        />
      </FormCard>

      {/* POPUP: VIEW OR AUDIT RA BILL WITH STATUTORY DEDUCTIONS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'process'
            ? `Audit & Process RA Bill — ${popup.item?.billNo}`
            : `Bill & Statutory Deduction Dossier — ${popup.item?.billNo}`
        }
        subtitle="Verification of Measurement Book items, GST, IT-TDS Sec 194C, GST-TDS Sec 51, and BOCW Cess."
        size="lg"
      >
        {popup.item && (
          <div>
            {/* Header info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1rem',
                fontSize: '0.8125rem',
                padding: '0.875rem 1rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Work
                </span>
                <div style={{ fontWeight: 600 }}>{popup.item.workName}</div>
              </div>
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Contractor
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.contractorName}
                </div>
              </div>
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  RA Ref & Date
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.raNo} ({popup.item.billDate})
                </div>
              </div>
            </div>

            {/* AUDIT / PROCESS FORM */}
            {popup.mode === 'process' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    color: '#166534',
                  }}
                >
                  <strong>Statutory Tax Auditor:</strong> Configure applicable
                  GST and statutory deductions. Net payable is computed in
                  real-time under Indian Public Works financial guidelines.
                </div>

                <FormGrid columns={3}>
                  <TextBox
                    label="Gross Bill Amount (₹)"
                    type="number"
                    value={String(calcForm.grossAmount)}
                    disabled
                  />
                  <DropDownList
                    label="GST Rate"
                    data={[
                      {
                        label: '18% (Standard Civil Construction Works)',
                        value: 18,
                      },
                      {
                        label: '12% (Affordable Housing / Specified Works)',
                        value: 12,
                      },
                      { label: '0% (Exempt Infrastructure)', value: 0 },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={calcForm.gstRate}
                    onChange={val =>
                      setCalcForm({ ...calcForm, gstRate: Number(val) })
                    }
                    required
                  />
                  <DropDownList
                    label="GST Charge Mechanism"
                    data={[
                      {
                        label: 'Forward Charge (Billed by Contractor)',
                        value: 'false',
                      },
                      {
                        label: 'Reverse Charge Mechanism (RCM - Dept Pays)',
                        value: 'true',
                      },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={String(calcForm.isRCM)}
                    onChange={val =>
                      setCalcForm({ ...calcForm, isRCM: val === 'true' })
                    }
                    required
                  />
                </FormGrid>

                <h5
                  style={{
                    margin: '0.5rem 0 0 0',
                    color: '#1e3a8a',
                    fontWeight: 700,
                  }}
                >
                  Statutory & Contractual Deductions
                </h5>

                <FormGrid columns={3}>
                  <TextBox
                    label="Mobilization Advance Recovery (₹)"
                    type="number"
                    value={String(calcForm.advanceRecovery)}
                    onChange={val =>
                      setCalcForm({
                        ...calcForm,
                        advanceRecovery: Number(val) || 0,
                      })
                    }
                  />
                  <DropDownList
                    label="Security Deposit (SD) %"
                    data={[
                      { label: '5% (Standard CPWD Clause 1)', value: 5 },
                      { label: '2.5% (Special Scheme)', value: 2.5 },
                      { label: '10% (High Risk Work)', value: 10 },
                      { label: '0% (PBG Lodged)', value: 0 },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={calcForm.securityDepositRate}
                    onChange={val =>
                      setCalcForm({
                        ...calcForm,
                        securityDepositRate: Number(val),
                      })
                    }
                  />
                  <DropDownList
                    label="IT-TDS Sec 194C Rate"
                    data={[
                      { label: '2% (Company / Partnership Firm)', value: 2 },
                      { label: '1% (Individual / Proprietorship)', value: 1 },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={calcForm.itTdsRate}
                    onChange={val =>
                      setCalcForm({ ...calcForm, itTdsRate: Number(val) })
                    }
                  />
                </FormGrid>

                <FormGrid columns={3}>
                  <DropDownList
                    label="GST-TDS Sec 51 Rate"
                    data={[
                      {
                        label: '2% (Contracts > ₹2.5 Lakhs: 1% CGST + 1% SGST)',
                        value: 2,
                      },
                      { label: '0% (Exempt / Contract < ₹2.5L)', value: 0 },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={calcForm.gstTdsRate}
                    onChange={val =>
                      setCalcForm({ ...calcForm, gstTdsRate: Number(val) })
                    }
                  />
                  <DropDownList
                    label="BOCW Labour Welfare Cess"
                    data={[
                      { label: '1% (Mandatory BOCW Act 1996)', value: 1 },
                      { label: '0% (Exempt Supply Only)', value: 0 },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={calcForm.labourCessRate}
                    onChange={val =>
                      setCalcForm({ ...calcForm, labourCessRate: Number(val) })
                    }
                  />
                  <TextBox
                    label="Other Recoveries / Penalties (₹)"
                    type="number"
                    value={String(calcForm.otherDeductions)}
                    onChange={val =>
                      setCalcForm({
                        ...calcForm,
                        otherDeductions: Number(val) || 0,
                      })
                    }
                  />
                </FormGrid>

                {/* LIVE NET PAYABLE SUMMARY BOX */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '2px solid #cbd5e1',
                    borderRadius: '0.75rem',
                    padding: '1rem 1.25rem',
                    marginTop: '0.5rem',
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
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: '#1e293b',
                      }}
                    >
                      Financial Deduction & Net Settlement Summary
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Formula: Gross + GST (Forward) - Deductions
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.75rem',
                      fontSize: '0.8rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ color: '#64748b' }}>Gross Work Value</div>
                      <strong style={{ fontSize: '0.9rem' }}>
                        {formatCurrency(calcForm.grossAmount)}
                      </strong>
                    </div>
                    <div>
                      <div style={{ color: '#059669' }}>
                        GST ({calcForm.gstRate}%)
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: '#059669' }}>
                        {calcForm.isRCM
                          ? '₹0 (RCM)'
                          : `+${formatCurrency(computedGST)}`}
                      </strong>
                    </div>
                    <div>
                      <div style={{ color: '#dc2626' }}>Total Deductions</div>
                      <strong style={{ fontSize: '0.9rem', color: '#dc2626' }}>
                        -{formatCurrency(totalDeductions)}
                      </strong>
                    </div>
                    <div
                      style={{
                        background: '#ecfdf5',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      <div
                        style={{
                          color: '#047857',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                        }}
                      >
                        NET PAYABLE TO VENDOR
                      </div>
                      <strong style={{ fontSize: '1.05rem', color: '#065f46' }}>
                        {formatCurrency(netPayable)}
                      </strong>
                    </div>
                  </div>

                  {/* Deduction breakdown chips */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span className="civil-pill amber">
                      Adv Rec: {formatCurrency(calcForm.advanceRecovery)}
                    </span>
                    <span className="civil-pill purple">
                      SD ({calcForm.securityDepositRate}%):{' '}
                      {formatCurrency(computedSD)}
                    </span>
                    <span className="civil-pill red">
                      IT-TDS ({calcForm.itTdsRate}%):{' '}
                      {formatCurrency(computedItTds)}
                    </span>
                    <span className="civil-pill amber">
                      GST-TDS ({calcForm.gstTdsRate}%):{' '}
                      {formatCurrency(computedGstTds)}
                    </span>
                    <span className="civil-pill blue">
                      BOCW Cess (1%): {formatCurrency(computedLabourCess)}
                    </span>
                    {calcForm.otherDeductions > 0 && (
                      <span className="civil-pill red">
                        Other: {formatCurrency(calcForm.otherDeductions)}
                      </span>
                    )}
                  </div>
                </div>

                <TextArea
                  label="Finance Verification & Statutory Audit Remarks"
                  placeholder="Measurement verified, tax rates audited, deductions matched with statutory ledger..."
                  value={remarks}
                  onChange={setRemarks}
                  rows={2}
                />

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Reject Bill"
                    variant="danger"
                    onClick={() => {
                      ToastService.error('Bill rejected.');
                      setPopup({ mode: 'closed' });
                    }}
                  />
                  <Button
                    label="Clear & Approve for Payment"
                    variant="primary"
                    icon="check"
                    onClick={handleProcess}
                  />
                </div>
              </div>
            ) : (
              /* VIEW DOSSIER MODE */
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                      Gross Work Done
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {formatCurrency(popup.item.grossAmount)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#059669', fontSize: '0.7rem' }}>
                      GST ({popup.item.gstRate ?? 18}%)
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#059669',
                      }}
                    >
                      +
                      {formatCurrency(
                        popup.item.gstAmount ??
                          Math.round(popup.item.grossAmount * 0.18)
                      )}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#dc2626', fontSize: '0.7rem' }}>
                      Statutory Deductions
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#dc2626',
                      }}
                    >
                      -
                      {formatCurrency(
                        (popup.item.advanceRecovery || 0) +
                          (popup.item.securityDeposit || 0) +
                          (popup.item.itTdsAmount ||
                            Math.round(popup.item.grossAmount * 0.02)) +
                          (popup.item.gstTdsAmount ||
                            Math.round(popup.item.grossAmount * 0.02)) +
                          (popup.item.labourCessAmount ||
                            Math.round(popup.item.grossAmount * 0.01)) +
                          (popup.item.otherDeductions || 0)
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#ecfdf5',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #86efac',
                    }}
                  >
                    <span
                      style={{
                        color: '#065f46',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      Net Passed for Payment
                    </span>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: '#065f46',
                      }}
                    >
                      {formatCurrency(popup.item.netPayable)}
                    </div>
                  </div>
                </div>

                {/* Deductions breakdown detail table */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h5
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#1e3a8a',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Statutory Deductions Schedule
                  </h5>
                  <table
                    className="civil-table"
                    style={{ width: '100%', fontSize: '0.78rem' }}
                  >
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th>Deduction Head</th>
                        <th>Legal Reference</th>
                        <th>Applicable Rate</th>
                        <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Income Tax TDS</strong>
                        </td>
                        <td>Sec 194C, Income Tax Act 1961</td>
                        <td>{popup.item.itTdsRate ?? 2}%</td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: '#b91c1c',
                            fontWeight: 600,
                          }}
                        >
                          -
                          {formatCurrency(
                            popup.item.itTdsAmount ??
                              Math.round(popup.item.grossAmount * 0.02)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>GST-TDS</strong>
                        </td>
                        <td>Sec 51, CGST/SGST Act 2017</td>
                        <td>{popup.item.gstTdsRate ?? 2}%</td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: '#b91c1c',
                            fontWeight: 600,
                          }}
                        >
                          -
                          {formatCurrency(
                            popup.item.gstTdsAmount ??
                              Math.round(popup.item.grossAmount * 0.02)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Labour Welfare Cess</strong>
                        </td>
                        <td>Building & Other Construction Workers Act 1996</td>
                        <td>{popup.item.labourCessRate ?? 1}%</td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: '#b91c1c',
                            fontWeight: 600,
                          }}
                        >
                          -
                          {formatCurrency(
                            popup.item.labourCessAmount ??
                              Math.round(popup.item.grossAmount * 0.01)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Security Deposit (SD)</strong>
                        </td>
                        <td>CPWD GCC Clause 1</td>
                        <td>5% of Gross</td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: '#7c3aed',
                            fontWeight: 600,
                          }}
                        >
                          -{formatCurrency(popup.item.securityDeposit)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Mobilization Advance Recovery</strong>
                        </td>
                        <td>CPWD GCC Clause 10B</td>
                        <td>Contractual Instalment</td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: '#d97706',
                            fontWeight: 600,
                          }}
                        >
                          -{formatCurrency(popup.item.advanceRecovery)}
                        </td>
                      </tr>
                      {popup.item.otherDeductions ? (
                        <tr>
                          <td>
                            <strong>Other Recoveries / Penalties</strong>
                          </td>
                          <td>Liquidated Damages / Testing Fee</td>
                          <td>Direct Recovery</td>
                          <td
                            style={{
                              textAlign: 'right',
                              color: '#dc2626',
                              fontWeight: 600,
                            }}
                          >
                            -{formatCurrency(popup.item.otherDeductions)}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    label="Close"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                </div>
              </div>
            )}

            {/* Linked MB Audit Section */}
            <div
              style={{
                marginTop: '1.25rem',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1rem',
              }}
            >
              <h5
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                Linked EE-Approved Measurement Book (MB) Entries
              </h5>
              <table
                className="civil-table"
                style={{ width: '100%', fontSize: '0.78rem' }}
              >
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th>MB No</th>
                    <th>SOR Code</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Bill Amt</th>
                    <th>MB Status</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedMBs(popup.item.linkedMBs).map((m: any) => (
                    <tr key={m.id}>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: '#1d4ed8',
                          }}
                        >
                          {m.mbNo}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                          }}
                        >
                          {m.sorCode}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', maxWidth: 180 }}>
                        {m.description}
                      </td>
                      <td>
                        {m.executedQty} {m.unit}
                      </td>
                      <td>{formatCurrency(m.billAmount)}</td>
                      <td>
                        <span
                          className={`civil-pill ${m.status === 'Approved by EE' ? 'green' : m.status === 'Rejected' ? 'red' : 'amber'}`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
