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
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const STORAGE_KEY = 'civil_deviation_statements';

const DEVIATION_TYPES: CivilManagement.DeviationType[] = [
  'Extra Item',
  'Excess Quantity',
  'Substituted Item',
  'Reduced Quantity',
];

const INITIAL_DEVIATIONS: CivilManagement.DeviationStatement[] = [
  {
    id: 'DEV-01',
    dsNo: 'DS/CW-001/01',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    boqItemId: 'BOQ-001-04',
    boqItemDescription:
      'M25 Reinforced Cement Concrete in deep foundation raft',
    deviationType: 'Excess Quantity',
    originalQty: 250,
    deviationQty: 45,
    unit: 'Cum',
    govtRate: 7200,
    deviationAmount: 324000,
    deviationPercent: 18,
    reason:
      'Encountered unexpected fissured rock stratum requiring deeper raft foundation footing.',
    justification:
      'Geotechnical testing mandated additional footing depth to meet bearing capacity of 220 kN/sqm.',
    submittedBy: 'Er. Rajesh Verma (Executive Engineer)',
    submittedDate: '2025-01-18',
    requiredApprovalLevel: 'EE',
    status: 'Approved',
    approvedBy: 'Superintending Engineer, Technical Cell',
    approvedDate: '2025-01-22',
    approvalRemarks:
      'Sanctioned under CPWD Manual Clause 12.2 deviation limits.',
  },
  {
    id: 'DEV-02',
    dsNo: 'DS/CW-001/02',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    boqItemId: '',
    boqItemDescription:
      'Providing and installing anti-termite chemical barrier grid at plinth level',
    deviationType: 'Extra Item',
    originalQty: 0,
    deviationQty: 850,
    unit: 'Sqm',
    govtRate: 240,
    deviationAmount: 204000,
    deviationPercent: 100,
    reason:
      'Heavy termite infestation detected adjacent to botanical garden boundary.',
    justification:
      'Non-scheduled urgent preventive measure to safeguard wood furniture and library archives.',
    submittedBy: 'Er. Rajesh Verma (Executive Engineer)',
    submittedDate: '2025-02-14',
    requiredApprovalLevel: 'SE/Admin',
    status: 'Submitted',
  },
  {
    id: 'DEV-03',
    dsNo: 'DS/CW-002/01',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    boqItemId: 'BOQ-002-08',
    boqItemDescription:
      'Pre-cast concrete paver blocks around hostel perimeter',
    deviationType: 'Substituted Item',
    originalQty: 600,
    deviationQty: 600,
    unit: 'Sqm',
    govtRate: 850,
    deviationAmount: 510000,
    deviationPercent: 8,
    reason:
      'Substituted standard concrete tiles with 80mm heavy-duty interlocking blocks for fire tender movement.',
    justification:
      'Fire department NOC condition required heavy vehicle perimeter pathway.',
    submittedBy: 'Er. Sandeep Singh (Site Engineer)',
    submittedDate: '2025-02-20',
    requiredApprovalLevel: 'EE',
    status: 'Submitted',
  },
];

const formatCurrency = (val?: number) =>
  '₹' + (val || 0).toLocaleString('en-IN');

export default function DeviationStatement() {
  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [data, setData] = useState<CivilManagement.DeviationStatement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DEVIATIONS;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'view';
    item?: CivilManagement.DeviationStatement;
  }>({ mode: 'closed' });

  const [formWorkId, setFormWorkId] = useState('');
  const [formType, setFormType] =
    useState<CivilManagement.DeviationType>('Extra Item');
  const [formDesc, setFormDesc] = useState('');
  const [formOrigQty, setFormOrigQty] = useState('0');
  const [formDevQty, setFormDevQty] = useState('50');
  const [formUnit, setFormUnit] = useState('Cum');
  const [formRate, setFormRate] = useState('5000');
  const [formReason, setFormReason] = useState('');
  const [formJustification, setFormJustification] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const calculatedAmount = (Number(formDevQty) || 0) * (Number(formRate) || 0);

  const determineApprovalLevel = (
    pct: number
  ): CivilManagement.DeviationApprovalLevel => {
    if (pct <= 5) return 'AE';
    if (pct <= 25) return 'EE';
    return 'SE/Admin';
  };

  const openAdd = () => {
    const w = works[0];
    setFormWorkId(w?.id || '1');
    setFormType('Extra Item');
    setFormDesc('');
    setFormOrigQty('0');
    setFormDevQty('50');
    setFormUnit('Cum');
    setFormRate('5000');
    setFormReason('');
    setFormJustification('');
    setPopup({ mode: 'add' });
  };

  const openView = (item: CivilManagement.DeviationStatement) => {
    setPopup({ mode: 'view', item });
  };

  const handleSubmit = () => {
    if (!formDesc.trim() || !formReason.trim() || !formJustification.trim()) {
      ToastService.error(
        'Item Description, Reason, and Technical Justification are mandatory.'
      );
      return;
    }
    const devQ = Number(formDevQty) || 0;
    const origQ = Number(formOrigQty) || 0;
    const rate = Number(formRate) || 0;
    const amt = devQ * rate;
    const pct = origQ > 0 ? Math.round((devQ / origQ) * 100) : 100;
    const reqLevel = determineApprovalLevel(pct);
    const w = works.find(x => x.id === formWorkId);

    const newItem: CivilManagement.DeviationStatement = {
      id: `DEV-${Date.now().toString().slice(-4)}`,
      dsNo: `DS/${w?.workId || 'CW'}/${String(data.length + 1).padStart(2, '0')}`,
      workId: formWorkId,
      workName: w?.name || 'Selected Work',
      boqItemDescription: formDesc.trim(),
      deviationType: formType,
      originalQty: origQ,
      deviationQty: devQ,
      unit: formUnit.trim(),
      govtRate: rate,
      deviationAmount: amt,
      deviationPercent: pct,
      reason: formReason.trim(),
      justification: formJustification.trim(),
      submittedBy: 'Er. Rajesh Verma (Executive Engineer)',
      submittedDate: new Date().toISOString().split('T')[0],
      requiredApprovalLevel: reqLevel,
      status: 'Submitted',
    };

    setData(prev => [newItem, ...prev]);
    ToastService.success(
      `Deviation Statement #${newItem.dsNo} submitted for ${reqLevel} sanction.`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Deviation Statement (Extra / Substituted Items)"
      description="Record quantity variations, substituted specifications, or new non-BOQ items with CPWD Clause 12 rate analysis and structural justifications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Deviation Statement' },
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
          label="Submit Deviation Statement"
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
              field: 'dsNo',
              header: 'Statement No.',
              cell: (item: CivilManagement.DeviationStatement) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {item.dsNo}
                </span>
              ),
              width: '130px',
            },
            {
              field: 'boqItemDescription',
              header: 'Scope / Item Variation',
              cell: (item: CivilManagement.DeviationStatement) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.boqItemDescription}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Work: {item.workName}
                  </div>
                </div>
              ),
            },
            {
              field: 'deviationType',
              header: 'Variation Category',
              cell: (item: CivilManagement.DeviationStatement) => {
                const color =
                  item.deviationType === 'Extra Item'
                    ? 'purple'
                    : item.deviationType === 'Substituted Item'
                      ? 'blue'
                      : 'amber';
                return (
                  <span
                    className={`civil-pill ${color}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {item.deviationType}
                  </span>
                );
              },
            },
            {
              field: 'deviationAmount',
              header: 'Deviation Value (₹)',
              cell: (item: CivilManagement.DeviationStatement) => (
                <div>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {formatCurrency(item.deviationAmount)}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.deviationQty} {item.unit} @ ₹{item.govtRate}
                  </div>
                </div>
              ),
            },
            {
              field: 'requiredApprovalLevel',
              header: 'Sanction Tier',
              cell: (item: CivilManagement.DeviationStatement) => (
                <span
                  className="civil-pill gray"
                  style={{ fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Tier: {item.requiredApprovalLevel}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: CivilManagement.DeviationStatement) => {
                const variant =
                  item.status === 'Approved'
                    ? 'approved'
                    : item.status === 'Submitted'
                      ? 'pending'
                      : 'rejected';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.DeviationStatement) => (
                <Button
                  size="small"
                  label=""
                  icon="eye"
                  variant="outlined"
                  onClick={() => openView(item)}
                  title="View Deviation Justification"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search deviation statements..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `Deviation Dossier — ${popup.item?.dsNo}`
            : 'Formulate Deviation Statement'
        }
        subtitle="Mandatory rate analysis and engineering justification under CPWD Clause 12."
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
                  Statement Reference
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                  }}
                >
                  {popup.item?.dsNo}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Deviation Amount
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#16a34a',
                    fontSize: '1.1rem',
                  }}
                >
                  {formatCurrency(popup.item?.deviationAmount)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Competent Approval Tier
                </span>
                <div style={{ fontWeight: 700, color: '#4338ca' }}>
                  {popup.item?.requiredApprovalLevel} Authority
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Variation Item Description
              </span>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginTop: '2px',
                }}
              >
                {popup.item?.boqItemDescription}
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
                <div>
                  <strong>Variation Type:</strong> {popup.item?.deviationType}
                </div>
                <div>
                  <strong>Original Quantity:</strong> {popup.item?.originalQty}{' '}
                  {popup.item?.unit}
                </div>
                <div>
                  <strong>Deviation Quantity:</strong>{' '}
                  {popup.item?.deviationQty} {popup.item?.unit}
                </div>
                <div>
                  <strong>Approved Rate:</strong> ₹{popup.item?.govtRate} per{' '}
                  {popup.item?.unit}
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
                <div>
                  <strong>Submitted By:</strong> {popup.item?.submittedBy}
                </div>
                <div>
                  <strong>Date of Submission:</strong>{' '}
                  {popup.item?.submittedDate}
                </div>
                <div>
                  <strong>Sanction Status:</strong>{' '}
                  <StatusBadge
                    label={popup.item?.status || 'Submitted'}
                    variant="pending"
                  />
                </div>
                {popup.item?.approvedBy && (
                  <div>
                    <strong>Approved By:</strong> {popup.item.approvedBy}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
              }}
            >
              <strong>Site Circumstances & Necessity:</strong>
              <p style={{ margin: '0.25rem 0 0.5rem 0', color: '#334155' }}>
                {popup.item?.reason}
              </p>
              <strong>Technical Justification:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155' }}>
                {popup.item?.justification}
              </p>
            </div>

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
            <FormGrid columns={2}>
              <DropDownList
                label="Civil Work Scheme *"
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
              <DropDownList
                label="Variation Type *"
                data={DEVIATION_TYPES.map(t => ({ label: t, value: t }))}
                textField="label"
                optionValue="value"
                value={formType}
                onChange={val => setFormType(val as any)}
                required
              />
            </FormGrid>

            <TextBox
              label="Item Name & Specification *"
              placeholder="e.g. M25 Grade Reinforced Cement Concrete in deep foundation raft"
              value={formDesc}
              onChange={setFormDesc}
              required
            />

            <FormGrid columns={4}>
              <TextBox
                label="Original BOQ Qty"
                placeholder="0"
                value={formOrigQty}
                onChange={setFormOrigQty}
              />
              <TextBox
                label="Deviation Quantity *"
                placeholder="45"
                value={formDevQty}
                onChange={setFormDevQty}
                required
              />
              <TextBox
                label="Unit *"
                placeholder="Cum"
                value={formUnit}
                onChange={setFormUnit}
                required
              />
              <TextBox
                label="Govt Standard Rate (₹) *"
                placeholder="7200"
                value={formRate}
                onChange={setFormRate}
                required
              />
            </FormGrid>

            <div
              style={{
                padding: '0.5rem 0.875rem',
                background: '#eff6ff',
                borderRadius: '0.5rem',
                border: '1px solid #bfdbfe',
                fontSize: '0.8125rem',
                color: '#1d4ed8',
              }}
            >
              <strong>Calculated Financial Variation:</strong>{' '}
              {formatCurrency(calculatedAmount)}
            </div>

            <TextArea
              label="Circumstances Demanding Deviation *"
              placeholder="Explain physical site conditions or architectural modifications necessitating variation..."
              value={formReason}
              onChange={setFormReason}
              rows={2}
              required
            />

            <TextArea
              label="Technical & Structural Justification *"
              placeholder="Cite design calculations, soil investigation findings, or building code mandates..."
              value={formJustification}
              onChange={setFormJustification}
              rows={2}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Submit for Sanction"
                variant="primary"
                icon="check"
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
