import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const STORAGE_KEY = 'civil_pvc_calculations';

const INITIAL_PVC: CivilManagement.PVCCalculation[] = [
  {
    id: 'PVC-01',
    pvcNo: 'PVC/2025/CW-001/01',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    workOrderId: 'WO-2024-001',
    billingPeriodFrom: '2025-01-01',
    billingPeriodTo: '2025-01-31',
    baseWPI: 151.2,
    currentWPI: 158.4,
    baseCPI: 382.0,
    currentCPI: 395.2,
    materialComponent: 60, // 60% of work value
    labourComponent: 25, // 25% of work value
    billAmount: 6500000,
    pvcAmountMaterial: 185714,
    pvcAmountLabour: 56178,
    totalPVCAmount: 241892,
    status: 'Approved',
    approvedBy: 'Executive Engineer & Finance Officer',
    approvedDate: '2025-02-05',
    linkedRABillId: 'RA-02',
  },
  {
    id: 'PVC-02',
    pvcNo: 'PVC/2025/CW-002/01',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    workOrderId: 'WO-2024-002',
    billingPeriodFrom: '2025-02-01',
    billingPeriodTo: '2025-02-28',
    baseWPI: 152.0,
    currentWPI: 160.1,
    baseCPI: 384.0,
    currentCPI: 398.5,
    materialComponent: 65,
    labourComponent: 20,
    billAmount: 4800000,
    pvcAmountMaterial: 166736,
    pvcAmountLabour: 36250,
    totalPVCAmount: 202986,
    status: 'Submitted',
  },
];

const formatCurrency = (val?: number) =>
  '₹' + (val || 0).toLocaleString('en-IN');

export default function PVCCalculation() {
  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [data, setData] = useState<CivilManagement.PVCCalculation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PVC;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'view';
    item?: CivilManagement.PVCCalculation;
  }>({ mode: 'closed' });

  const [formWorkId, setFormWorkId] = useState('');
  const [formFrom, setFormFrom] = useState('2025-02-01');
  const [formTo, setFormTo] = useState('2025-02-28');
  const [formBillAmt, setFormBillAmt] = useState('5000000');
  const [formBaseWpi, setFormBaseWpi] = useState('151.2');
  const [formCurrWpi, setFormCurrWpi] = useState('159.0');
  const [formBaseCpi, setFormBaseCpi] = useState('382.0');
  const [formCurrCpi, setFormCurrCpi] = useState('396.0');
  const [formMatComp, setFormMatComp] = useState('60');
  const [formLabComp, setFormLabComp] = useState('25');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Real-time PVC calculation
  const calculatedPVC = (() => {
    const bill = Number(formBillAmt) || 0;
    const bWpi = Number(formBaseWpi) || 1;
    const cWpi = Number(formCurrWpi) || 1;
    const bCpi = Number(formBaseCpi) || 1;
    const cCpi = Number(formCurrCpi) || 1;
    const matPct = (Number(formMatComp) || 0) / 100;
    const labPct = (Number(formLabComp) || 0) / 100;

    const wpiEscalation = (cWpi - bWpi) / bWpi;
    const cpiEscalation = (cCpi - bCpi) / bCpi;

    const matPvc = Math.max(0, Math.round(bill * matPct * wpiEscalation));
    const labPvc = Math.max(0, Math.round(bill * labPct * cpiEscalation));
    const total = matPvc + labPvc;

    return { matPvc, labPvc, total };
  })();

  const openAdd = () => {
    const w = works[0];
    setFormWorkId(w?.id || '1');
    setFormFrom('2025-02-01');
    setFormTo('2025-02-28');
    setFormBillAmt('5000000');
    setFormBaseWpi('151.2');
    setFormCurrWpi('159.0');
    setFormBaseCpi('382.0');
    setFormCurrCpi('396.0');
    setFormMatComp('60');
    setFormLabComp('25');
    setPopup({ mode: 'add' });
  };

  const openView = (item: CivilManagement.PVCCalculation) => {
    setPopup({ mode: 'view', item });
  };

  const handleSave = () => {
    const w = works.find(x => x.id === formWorkId);
    const newItem: CivilManagement.PVCCalculation = {
      id: `PVC-${Date.now().toString().slice(-4)}`,
      pvcNo: `PVC/${new Date().getFullYear()}/${w?.workId || 'CW'}/${String(data.length + 1).padStart(2, '0')}`,
      workId: formWorkId,
      workName: w?.name || 'Selected Civil Work',
      workOrderId: `WO-${w?.workId || '2026'}`,
      billingPeriodFrom: formFrom,
      billingPeriodTo: formTo,
      baseWPI: parseFloat(formBaseWpi) || 151.2,
      currentWPI: parseFloat(formCurrWpi) || 159.0,
      baseCPI: parseFloat(formBaseCpi) || 382.0,
      currentCPI: parseFloat(formCurrCpi) || 396.0,
      materialComponent: parseFloat(formMatComp) || 60,
      labourComponent: parseFloat(formLabComp) || 25,
      billAmount: parseFloat(formBillAmt) || 0,
      pvcAmountMaterial: calculatedPVC.matPvc,
      pvcAmountLabour: calculatedPVC.labPvc,
      totalPVCAmount: calculatedPVC.total,
      status: 'Submitted',
    };

    setData(prev => [newItem, ...prev]);
    ToastService.success(
      `Price Variation Clause claim #${newItem.pvcNo} calculated & submitted.`
    );
    setPopup({ mode: 'closed' });
  };

  const approvePvc = (id: string) => {
    setData(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'Approved',
              approvedBy: 'Superintending Engineer & Finance Officer',
              approvedDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
    ToastService.success('PVC escalation claim approved for payment.');
  };

  return (
    <FormPage
      title="Price Variation Clause (PVC) & Escalation"
      description="Standard escalation formula calculations for long-duration infrastructure contracts (> 12 months) based on Reserve Bank of India / Ministry published WPI & CPI indices."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.financePortal },
        { label: 'PVC Calculation' },
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <Button
          label="Compute PVC Escalation Claim"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'pvcNo',
              header: 'PVC Claim Ref',
              cell: (item: CivilManagement.PVCCalculation) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {item.pvcNo}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Period: {item.billingPeriodFrom} to {item.billingPeriodTo}
                  </div>
                </div>
              ),
              width: '180px',
            },
            {
              field: 'workName',
              header: 'Civil Work',
              cell: (item: CivilManagement.PVCCalculation) => (
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {item.workName}
                </span>
              ),
            },
            {
              field: 'billAmount',
              header: 'Gross Bill Value',
              cell: (item: CivilManagement.PVCCalculation) => (
                <span style={{ fontWeight: 600, color: '#374151' }}>
                  {formatCurrency(item.billAmount)}
                </span>
              ),
            },
            {
              field: 'totalPVCAmount',
              header: 'Escalation Amount (₹)',
              cell: (item: CivilManagement.PVCCalculation) => (
                <div>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    +{formatCurrency(item.totalPVCAmount)}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Mat: +{formatCurrency(item.pvcAmountMaterial)} • Lab: +
                    {formatCurrency(item.pvcAmountLabour)}
                  </div>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Approval Status',
              cell: (item: CivilManagement.PVCCalculation) => {
                const variant =
                  item.status === 'Approved' ? 'approved' : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.PVCCalculation) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                    title="View PVC Calculation Breakdown"
                  />
                  {item.status === 'Submitted' && (
                    <Button
                      size="small"
                      label="Approve"
                      icon="check"
                      variant="primary"
                      onClick={() => approvePvc(item.id)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search PVC claims by ref or work..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `PVC Escalation Statement — ${popup.item?.pvcNo}`
            : 'Compute Price Variation Clause (PVC) Claim'
        }
        subtitle="Standard Clause 10CC / CPWD price adjustment based on WPI & CPI indices."
        size="lg"
      >
        {popup.mode === 'view' ? (
          /* View Details Modal */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Claim Reference
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                  }}
                >
                  {popup.item?.pvcNo}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Billing Work Value
                </span>
                <div style={{ fontWeight: 600, color: '#111827' }}>
                  {formatCurrency(popup.item?.billAmount)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Total Net Escalation
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#16a34a',
                    fontSize: '1.1rem',
                  }}
                >
                  +{formatCurrency(popup.item?.totalPVCAmount)}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Civil Work Entitled
              </span>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginTop: '2px',
                }}
              >
                {popup.item?.workName}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.8125rem',
                lineHeight: 1.8,
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.25rem',
                  }}
                >
                  Materials Component (Vm: {popup.item?.materialComponent}%)
                </div>
                <div>
                  <strong>Base WPI (P0):</strong> {popup.item?.baseWPI}
                </div>
                <div>
                  <strong>Current WPI (Pm):</strong> {popup.item?.currentWPI}
                </div>
                <div>
                  <strong>Material Escalation (ΔM):</strong> +
                  {formatCurrency(popup.item?.pvcAmountMaterial)}
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.25rem',
                  }}
                >
                  Labour Component (VL: {popup.item?.labourComponent}%)
                </div>
                <div>
                  <strong>Base CPI (L0):</strong> {popup.item?.baseCPI}
                </div>
                <div>
                  <strong>Current CPI (Lm):</strong> {popup.item?.currentCPI}
                </div>
                <div>
                  <strong>Labour Escalation (ΔL):</strong> +
                  {formatCurrency(popup.item?.pvcAmountLabour)}
                </div>
              </div>
            </div>

            {popup.item?.approvedBy && (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  color: '#166534',
                }}
              >
                <strong>Sanctioned By:</strong> {popup.item.approvedBy} on{' '}
                {popup.item.approvedDate}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        ) : (
          /* Form Modal */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <DropDownList
              label="Civil Work (Contract Duration > 12 Months) *"
              data={works.map(w => ({
                label: `${w.workId} — ${w.name}`,
                value: w.id,
              }))}
              textField="label"
              optionValue="value"
              value={formWorkId}
              onChange={val => setFormWorkId(val as string)}
              required
            />

            <FormGrid columns={3}>
              <TextBox
                label="Billing Period From *"
                placeholder="YYYY-MM-DD"
                value={formFrom}
                onChange={setFormFrom}
                required
              />
              <TextBox
                label="Billing Period To *"
                placeholder="YYYY-MM-DD"
                value={formTo}
                onChange={setFormTo}
                required
              />
              <TextBox
                label="Bill Gross Value (₹) *"
                placeholder="5000000"
                value={formBillAmt}
                onChange={setFormBillAmt}
                required
              />
            </FormGrid>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.875rem',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  marginBottom: '0.5rem',
                  color: '#1e293b',
                }}
              >
                Wholesale Price Index (WPI - Materials) & Consumer Price Index
                (CPI - Labour)
              </div>
              <FormGrid columns={4}>
                <TextBox
                  label="Base WPI (P0) *"
                  placeholder="151.2"
                  value={formBaseWpi}
                  onChange={setFormBaseWpi}
                  required
                />
                <TextBox
                  label="Current WPI (Pm) *"
                  placeholder="159.0"
                  value={formCurrWpi}
                  onChange={setFormCurrWpi}
                  required
                />
                <TextBox
                  label="Base CPI (L0) *"
                  placeholder="382.0"
                  value={formBaseCpi}
                  onChange={setFormBaseCpi}
                  required
                />
                <TextBox
                  label="Current CPI (Lm) *"
                  placeholder="396.0"
                  value={formCurrCpi}
                  onChange={setFormCurrCpi}
                  required
                />
              </FormGrid>
            </div>

            <FormGrid columns={2}>
              <TextBox
                label="Material Component Percentage (Vm %)"
                placeholder="60"
                value={formMatComp}
                onChange={setFormMatComp}
              />
              <TextBox
                label="Labour Component Percentage (VL %)"
                placeholder="25"
                value={formLabComp}
                onChange={setFormLabComp}
              />
            </FormGrid>

            {/* Live calculation banner */}
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                color: '#1e3a8a',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong>Material Escalation:</strong> +
                {formatCurrency(calculatedPVC.matPvc)} |{' '}
                <strong>Labour Escalation:</strong> +
                {formatCurrency(calculatedPVC.labPvc)}
              </div>
              <div>
                <strong>Total Net Claim:</strong> +
                {formatCurrency(calculatedPVC.total)}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Save & Submit PVC Claim"
                variant="primary"
                icon="check"
                onClick={handleSave}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
