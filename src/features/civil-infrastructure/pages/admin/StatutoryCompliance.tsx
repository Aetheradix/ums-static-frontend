import { useMemo, useState } from 'react';
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
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../civilStorage';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const CLEARANCE_TYPES = [
  'Municipal Building Permission & Sanction Plan',
  'State Fire Service NOC (Provisional / Final)',
  'State Pollution Control Board Environmental Clearance (CTE/CTO)',
  'Forest & Tree Protection Authority NOC',
  'Chief Electrical Inspector to Govt (CEIG) Approval',
  'Airport Authority of India (AAI) Height Clearance',
  'Ground Water Authority NOC',
  'RERA Registration Certificate',
];

export const INITIAL_CLEARANCES: CivilManagement.StatutoryClearance[] = [
  {
    id: 'NOC-01',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    clearanceType: 'State Fire Service NOC (Provisional / Final)',
    authority: 'State Directorate of Fire & Disaster Services',
    applicationDate: '2024-10-15',
    expectedDate: '2024-11-30',
    receivedDate: '2024-11-20',
    validUpto: '2027-11-19',
    referenceNo: 'FIRE/BPL/2024/NOC-4421',
    documentFileName: 'fire_noc_provisional_signed.pdf',
    isBlocking: true,
    status: 'Received',
    remarks: 'Approved with conditions for dry risers and twin hydrant points.',
  },
  {
    id: 'NOC-02',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    clearanceType: 'Municipal Building Permission & Sanction Plan',
    authority: 'Bhopal Municipal Corporation (Town Planning Cell)',
    applicationDate: '2024-09-01',
    expectedDate: '2024-10-15',
    receivedDate: '2024-10-10',
    validUpto: '2029-10-09',
    referenceNo: 'BMC/TP/BLDG-PERM/2024-88',
    documentFileName: 'bmc_sanctioned_building_plan.pdf',
    isBlocking: true,
    status: 'Received',
    remarks: 'Ground + 4 storeys sanctioned.',
  },
  {
    id: 'NOC-03',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    clearanceType:
      'State Pollution Control Board Environmental Clearance (CTE/CTO)',
    authority: 'MP State Pollution Control Board',
    applicationDate: '2025-01-10',
    expectedDate: '2025-04-15',
    referenceNo: 'MPPCB/CTE/APP-2025-091',
    documentFileName: 'mppcb_acknowledgement_receipt.pdf',
    isBlocking: true,
    status: 'Applied',
    remarks:
      'Under technical scrutiny by SEAC committee. Site inspection scheduled.',
  },
  {
    id: 'NOC-04',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    clearanceType: 'Airport Authority of India (AAI) Height Clearance',
    authority: 'Airports Authority of India (NOCAS)',
    applicationDate: '2025-01-15',
    expectedDate: '2025-02-15',
    receivedDate: '2025-02-05',
    validUpto: '2030-02-04',
    referenceNo: 'AAI/WEST/BHO/NOC/2025/112',
    documentFileName: 'aai_height_noc_permissible.pdf',
    isBlocking: false,
    status: 'Received',
    remarks: 'Permissible top elevation 542m AMSL granted.',
  },
];

export default function StatutoryCompliance() {
  const [works] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.WORKS,
    initialWorks
  );
  const [data, setData] = useCivilStorage<CivilManagement.StatutoryClearance[]>(
    CIVIL_STORAGE_KEYS.STATUTORY_CLEARANCES,
    INITIAL_CLEARANCES
  );

  const [filterWorkId, setFilterWorkId] = useState('ALL');

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit' | 'view';
    item?: CivilManagement.StatutoryClearance;
  }>({ mode: 'closed' });

  const [formWorkId, setFormWorkId] = useState('');
  const [formType, setFormType] = useState(CLEARANCE_TYPES[0]);
  const [formAuthority, setFormAuthority] = useState('');
  const [formAppDate, setFormAppDate] = useState('');
  const [formExpDate, setFormExpDate] = useState('');
  const [formRecDate, setFormRecDate] = useState('');
  const [formValidity, setFormValidity] = useState('');
  const [formRefNo, setFormRefNo] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formBlocking, setFormBlocking] = useState(true);
  const [formStatus, setFormStatus] =
    useState<CivilManagement.StatutoryClearance['status']>('Applied');
  const [formRemarks, setFormRemarks] = useState('');

  const statutoryWorks = useMemo(() => {
    return works.filter(
      w =>
        Boolean(w.isStatuaryCheck) ||
        (w.isStatuaryCheck === undefined &&
          (w.id === '1' ||
            w.id === '2' ||
            w.workRegistrationId === 1 ||
            w.workRegistrationId === 2))
    );
  }, [works]);

  const filteredData = useMemo(() => {
    if (filterWorkId === 'ALL') return data;
    return data.filter(d => String(d.workId) === String(filterWorkId));
  }, [data, filterWorkId]);

  // Check how many critical clearances are pending
  const blockingPending = useMemo(() => {
    return data.filter(d => d.isBlocking && d.status === 'Applied').length;
  }, [data]);

  const openAdd = () => {
    const w = statutoryWorks[0] || works[0];
    setFormWorkId(String(w?.workRegistrationId || w?.id || '1'));
    setFormType(CLEARANCE_TYPES[0]);
    setFormAuthority('');
    setFormAppDate(new Date().toISOString().split('T')[0]);
    setFormExpDate('');
    setFormRecDate('');
    setFormValidity('');
    setFormRefNo('');
    setFormFileName('');
    setFormBlocking(true);
    setFormStatus('Applied');
    setFormRemarks('');
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.StatutoryClearance) => {
    setFormWorkId(item.workId);
    setFormType(item.clearanceType);
    setFormAuthority(item.authority);
    setFormAppDate(item.applicationDate);
    setFormExpDate(item.expectedDate || '');
    setFormRecDate(item.receivedDate || '');
    setFormValidity(item.validUpto || '');
    setFormRefNo(item.referenceNo || '');
    setFormFileName(item.documentFileName || '');
    setFormBlocking(item.isBlocking);
    setFormStatus(item.status);
    setFormRemarks(item.remarks || '');
    setPopup({ mode: 'edit', item });
  };

  const openView = (item: CivilManagement.StatutoryClearance) => {
    setPopup({ mode: 'view', item });
  };

  const handleSave = () => {
    if (!formAuthority.trim() || !formAppDate) {
      ToastService.error(
        'Sanctioning Authority and Application Date are required.'
      );
      return;
    }
    const w = works.find(
      x => String(x.workRegistrationId || x.id) === String(formWorkId)
    );

    if (popup.mode === 'add') {
      const newItem: CivilManagement.StatutoryClearance = {
        id: `NOC-${Date.now().toString().slice(-4)}`,
        workId: formWorkId,
        workName: w?.name || 'Selected Civil Work',
        clearanceType: formType,
        authority: formAuthority.trim(),
        applicationDate: formAppDate,
        expectedDate: formExpDate,
        receivedDate: formRecDate,
        validUpto: formValidity,
        referenceNo: formRefNo.trim(),
        documentFileName: formFileName,
        isBlocking: formBlocking,
        status: formStatus,
        remarks: formRemarks,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(`Clearance requirement "${formType}" tracked.`);
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                workId: formWorkId,
                workName: w?.name || d.workName,
                clearanceType: formType,
                authority: formAuthority.trim(),
                applicationDate: formAppDate,
                expectedDate: formExpDate,
                receivedDate: formRecDate,
                validUpto: formValidity,
                referenceNo: formRefNo.trim(),
                documentFileName: formFileName,
                isBlocking: formBlocking,
                status: formStatus,
                remarks: formRemarks,
              }
            : d
        )
      );
      ToastService.success('Clearance record updated.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Statutory Clearance & NOC Tracker"
      description="Monitor mandatory government permissions (Municipal, Fire, Pollution Control, CEIG, Airport, Forest) required before breaking ground or issuing tenders."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Statutory Compliance' },
      ]}
    >
      {blockingPending > 0 && (
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
            justifyContent: 'space-between',
          }}
        >
          <div>
            <strong>⚠️ Mandatory Clearance Alert:</strong> {blockingPending}{' '}
            work(s) have pending clearances flagged as{' '}
            <strong>Execution Blocking</strong>. Construction or tender
            finalization must not proceed until certificates are issued.
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '1rem',
        }}
      >
        <div style={{ width: '380px' }}>
          <DropDownList
            label="Filter by Work Project"
            data={[
              { label: 'All Statutory Works', value: 'ALL' },
              ...statutoryWorks.map(w => ({
                label: `${w.code || w.workId || `CW-${w.id}`} — ${w.name}`,
                value: String(w.workRegistrationId || w.id),
              })),
            ]}
            textField="label"
            optionValue="value"
            value={filterWorkId}
            onChange={val => setFilterWorkId(val as string)}
          />
        </div>

        <Button
          label="Track New Clearance"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={filteredData}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'clearanceType',
              header: 'Statutory Permission Type',
              cell: (item: CivilManagement.StatutoryClearance) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.clearanceType}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Authority: {item.authority}
                  </div>
                </div>
              ),
            },
            {
              field: 'workName',
              header: 'Applied Civil Work',
              cell: (item: CivilManagement.StatutoryClearance) => (
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {item.workName}
                </span>
              ),
            },
            {
              field: 'referenceNo',
              header: 'Application / Cert Ref',
              cell: (item: CivilManagement.StatutoryClearance) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {item.referenceNo || 'Pending Submission'}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Applied: {item.applicationDate}
                  </div>
                </div>
              ),
            },
            {
              field: 'isBlocking',
              header: 'Criticality',
              cell: (item: CivilManagement.StatutoryClearance) => (
                <span
                  className={`civil-pill ${item.isBlocking ? 'red' : 'gray'}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {item.isBlocking
                    ? 'Execution Blocking'
                    : 'Parallel Clearance'}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Clearance Status',
              cell: (item: CivilManagement.StatutoryClearance) => {
                const variant =
                  item.status === 'Received'
                    ? 'approved'
                    : item.status === 'Applied'
                      ? 'pending'
                      : item.status === 'Expired' || item.status === 'Rejected'
                        ? 'rejected'
                        : 'neutral';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.StatutoryClearance) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                    title="View Clearance Details"
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                    title="Update Status / Certificate"
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search statutory clearances..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `Clearance Dossier — ${popup.item?.clearanceType}`
            : popup.mode === 'add'
              ? 'Track New Statutory Clearance'
              : `Update Statutory Clearance — ${popup.item?.referenceNo || popup.item?.id}`
        }
        subtitle="Record application reference, approval certificate, and validity timeline."
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
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                {popup.item?.clearanceType}
              </div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  marginTop: '4px',
                }}
              >
                Applied For: <strong>{popup.item?.workName}</strong>
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
                  Authority & Reference
                </div>
                <div>
                  <strong>Issuing Authority:</strong> {popup.item?.authority}
                </div>
                <div>
                  <strong>Application / Order Ref:</strong>{' '}
                  {popup.item?.referenceNo || '—'}
                </div>
                <div>
                  <strong>Criticality:</strong>{' '}
                  {popup.item?.isBlocking
                    ? 'Strict Execution Blocking'
                    : 'Parallel Clearance'}
                </div>
                <div>
                  <strong>Current Status:</strong>{' '}
                  <StatusBadge
                    label={popup.item?.status || 'Applied'}
                    variant="approved"
                  />
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
                  Timeline & Certificate
                </div>
                <div>
                  <strong>Application Date:</strong>{' '}
                  {popup.item?.applicationDate}
                </div>
                <div>
                  <strong>Received Date:</strong>{' '}
                  {popup.item?.receivedDate || 'Awaiting Issuance'}
                </div>
                <div>
                  <strong>Validity Thru:</strong>{' '}
                  {popup.item?.validUpto || 'Indefinite / As per law'}
                </div>
                <div>
                  <strong>Attached File:</strong>{' '}
                  {popup.item?.documentFileName || 'No file attached'}
                </div>
              </div>
            </div>

            {popup.item?.remarks && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                }}
              >
                <strong>Authority Stipulations & Conditions:</strong>{' '}
                {popup.item.remarks}
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
              label="Civil Work Scheme *"
              data={statutoryWorks.map(w => ({
                label: `${w.code || w.workId || `CW-${w.id}`} — ${w.name}`,
                value: String(w.workRegistrationId || w.id),
              }))}
              textField="label"
              optionValue="value"
              value={formWorkId}
              onChange={val => setFormWorkId(val as string)}
              required
            />

            <FormGrid columns={2}>
              <DropDownList
                label="Clearance / NOC Category *"
                data={CLEARANCE_TYPES.map(c => ({ label: c, value: c }))}
                textField="label"
                optionValue="value"
                value={formType}
                onChange={val => setFormType(val as string)}
                required
              />
              <TextBox
                label="Statutory Authority / Agency *"
                placeholder="e.g. State Pollution Control Board"
                value={formAuthority}
                onChange={setFormAuthority}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Application Reference / File No."
                placeholder="MPPCB/CTE/2026/912"
                value={formRefNo}
                onChange={setFormRefNo}
              />
              <DropDownList
                label="Current Clearance Status"
                data={[
                  { label: 'Applied (Under Scrutiny)', value: 'Applied' },
                  { label: 'Received (NOC Issued)', value: 'Received' },
                  { label: 'Not Required (Exempted)', value: 'Not Required' },
                  { label: 'Expired (Renewal Required)', value: 'Expired' },
                  { label: 'Rejected (Compliance Needed)', value: 'Rejected' },
                ]}
                textField="label"
                optionValue="value"
                value={formStatus}
                onChange={val => setFormStatus(val as any)}
              />
            </FormGrid>

            <FormGrid columns={3}>
              <TextBox
                label="Application Date *"
                placeholder="YYYY-MM-DD"
                value={formAppDate}
                onChange={setFormAppDate}
                required
              />
              <TextBox
                label="Received Date"
                placeholder="YYYY-MM-DD"
                value={formRecDate}
                onChange={setFormRecDate}
              />
              <TextBox
                label="Validity Expiry Date"
                placeholder="YYYY-MM-DD"
                value={formValidity}
                onChange={setFormValidity}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <DropDownList
                label="Execution Blocking Dependency"
                data={[
                  {
                    label: 'Yes — Site Work Cannot Start Without This NOC',
                    value: 'true',
                  },
                  {
                    label: 'No — Parallel Non-Blocking Clearance',
                    value: 'false',
                  },
                ]}
                textField="label"
                optionValue="value"
                value={formBlocking ? 'true' : 'false'}
                onChange={val => setFormBlocking(val === 'true')}
              />
              <div>
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#374151',
                    display: 'block',
                    marginBottom: '0.375rem',
                  }}
                >
                  Upload Sanctioned Order / NOC PDF
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFormFileName(f.name);
                      ToastService.success(`Attached ${f.name}`);
                    }
                  }}
                  style={{ fontSize: '0.8125rem' }}
                />
                {formFileName && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#16a34a',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    ✓ Selected: {formFileName}
                  </div>
                )}
              </div>
            </FormGrid>

            <TextArea
              label="Clearance Conditions & Compliance Remarks"
              placeholder="Record mandatory conditions imposed by the sanctioning authority..."
              value={formRemarks}
              onChange={setFormRemarks}
              rows={2}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={
                  popup.mode === 'add' ? 'Track Clearance' : 'Save Changes'
                }
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
