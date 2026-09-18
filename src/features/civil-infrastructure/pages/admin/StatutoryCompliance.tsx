import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Button, ButtonPanel } from 'shared/components/buttons';
import {
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  PreviewGrid,
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

type PageMode = 'list' | 'create' | 'edit' | 'view';

export default function StatutoryCompliance() {
  const [searchParams] = useSearchParams();
  const paramWorkId = searchParams.get('workId');

  const [works] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.WORKS,
    initialWorks
  );
  const [data, setData] = useCivilStorage<CivilManagement.StatutoryClearance[]>(
    CIVIL_STORAGE_KEYS.STATUTORY_CLEARANCES,
    INITIAL_CLEARANCES
  );

  const [filterWorkId, setFilterWorkId] = useState(paramWorkId || 'ALL');

  useEffect(() => {
    if (paramWorkId) {
      setFilterWorkId(paramWorkId);
    }
  }, [paramWorkId]);

  const [mode, setMode] = useState<PageMode>('list');
  const [activeItem, setActiveItem] =
    useState<CivilManagement.StatutoryClearance | null>(null);

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

  const handleBackToList = useCallback(() => {
    setMode('list');
    setActiveItem(null);
  }, []);

  const openAdd = () => {
    const selectedWork =
      statutoryWorks.find(
        w => String(w.workRegistrationId || w.id) === String(filterWorkId)
      ) ||
      statutoryWorks[0] ||
      works[0];

    setFormWorkId(
      String(selectedWork?.workRegistrationId || selectedWork?.id || '1')
    );
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
    setActiveItem(null);
    setMode('create');
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
    setActiveItem(item);
    setMode('edit');
  };

  const openView = (item: CivilManagement.StatutoryClearance) => {
    setActiveItem(item);
    setMode('view');
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formAuthority.trim() || !formAppDate) {
      ToastService.error(
        'Sanctioning Authority and Application Date are required.'
      );
      return;
    }
    const w = works.find(
      x => String(x.workRegistrationId || x.id) === String(formWorkId)
    );

    if (mode === 'create') {
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
    } else if (mode === 'edit' && activeItem) {
      setData(prev =>
        prev.map(d =>
          d.id === activeItem.id
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
    handleBackToList();
  };

  if (mode === 'create' || mode === 'edit') {
    return (
      <FormPage
        title={
          mode === 'create'
            ? 'Track New Statutory Clearance'
            : `Update Statutory Clearance — ${activeItem?.referenceNo || activeItem?.id}`
        }
        description="Record application reference, approval certificate, and validity timeline."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Statutory Compliance', to: civilUrls.statutoryCompliance },
          {
            label:
              mode === 'create'
                ? 'Track New Clearance'
                : `Edit ${activeItem?.referenceNo || activeItem?.id}`,
          },
        ]}
        headerAction={
          <Button
            label="Back to Clearances List"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
          />
        }
      >
        <FormCard
          title={
            mode === 'create'
              ? 'Track New Statutory Clearance'
              : `Update Statutory Clearance (${activeItem?.referenceNo || activeItem?.id})`
          }
        >
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <DropDownList
              label="Civil Work Scheme"
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
                label="Clearance / NOC Category"
                data={CLEARANCE_TYPES.map(c => ({ label: c, value: c }))}
                textField="label"
                optionValue="value"
                value={formType}
                onChange={val => setFormType(val as string)}
                required
              />
              <TextBox
                label="Statutory Authority / Agency"
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
                label="Application Date"
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
              <FileUpload
                label="Upload Sanctioned Order / NOC PDF"
                accept=".pdf,.jpg,.png,.jpeg"
                mode="file"
                uploadNote="Max size 10MB (.pdf, .jpg, .png)"
                onChange={(file: File | null) => {
                  setFormFileName(file?.name || '');
                  if (file) ToastService.success(`Attached ${file.name}`);
                }}
              />
            </FormGrid>

            <TextArea
              label="Clearance Conditions & Compliance Remarks"
              placeholder="Record mandatory conditions imposed by the sanctioning authority..."
              value={formRemarks}
              onChange={setFormRemarks}
              rows={3}
            />

            <ButtonPanel>
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleBackToList}
                type="button"
              />
              <Button
                label={mode === 'create' ? 'Track Clearance' : 'Save Changes'}
                variant="primary"
                icon="check"
                type="submit"
              />
            </ButtonPanel>
          </form>
        </FormCard>
      </FormPage>
    );
  }

  if (mode === 'view' && activeItem) {
    return (
      <FormPage
        title={`Clearance Dossier — ${activeItem.clearanceType}`}
        description="Complete statutory record, authority details, and validity timeline."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Statutory Compliance', to: civilUrls.statutoryCompliance },
          { label: activeItem.referenceNo || activeItem.id },
        ]}
        headerAction={
          <Button
            label="Back to Clearances List"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <FormCard title="Clearance Details">
            <PreviewGrid
              columns={3}
              fields={[
                { label: 'Clearance ID', value: activeItem.id },
                { label: 'Permission Type', value: activeItem.clearanceType },
                { label: 'Applied Work', value: activeItem.workName },
                { label: 'Sanctioning Authority', value: activeItem.authority },
                {
                  label: 'Application / Cert Ref',
                  value: activeItem.referenceNo || 'Pending Submission',
                },
                {
                  label: 'Criticality',
                  value: activeItem.isBlocking
                    ? 'Strict Execution Blocking'
                    : 'Parallel Clearance',
                },
                {
                  label: 'Application Date',
                  value: activeItem.applicationDate,
                },
                {
                  label: 'Received Date',
                  value: activeItem.receivedDate || 'Awaiting Issuance',
                },
                {
                  label: 'Validity Expiry',
                  value: activeItem.validUpto || 'Indefinite / As per law',
                },
                { label: 'Clearance Status', value: activeItem.status },
                {
                  label: 'Attached Document',
                  value: activeItem.documentFileName || 'No document attached',
                },
              ]}
            />
          </FormCard>

          {activeItem.remarks && (
            <FormCard title="Authority Stipulations & Conditions">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-950">
                {activeItem.remarks}
              </div>
            </FormCard>
          )}

          <ButtonPanel>
            <Button
              label="Back to Clearances List"
              variant="outlined"
              icon="arrow-left"
              onClick={handleBackToList}
            />
            <Button
              label="Edit Clearance"
              variant="primary"
              icon="pencil"
              onClick={() => openEdit(activeItem)}
            />
          </ButtonPanel>
        </div>
      </FormPage>
    );
  }

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
                <GridActionButtons
                  onView={() => openView(item)}
                  onEdit={() => openEdit(item)}
                  viewTooltip="View Clearance Details"
                  editTooltip="Update Clearance / Certificate"
                />
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search statutory clearances..."
        />
      </FormCard>
    </FormPage>
  );
}
