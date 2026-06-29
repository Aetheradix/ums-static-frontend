import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  Tabs,
} from 'shared/new-components';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TESTS = [
  {
    label: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    value: 'TEST-DPI-2025',
    exam: 'MPPEB',
    dateRange: '2025-11-20 – 2025-11-30',
  },
  {
    label: 'Assistant Professor Recruitment 2025',
    value: 'TEST-AP-2025',
    exam: 'MPSC',
    dateRange: '2025-10-05 – 2025-10-15',
  },
];

interface VCRow {
  sno: number;
  testName: string;
  district: string;
  centerName: string;
  centerCode: string;
  totalRecords: number;
  inchargeName: string;
  inchargePhone: string;
  inchargeEmail: string;
}

const INITIAL_RECORDS: VCRow[] = [
  {
    sno: 1,
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    district: 'Indore',
    centerName: 'DISTRICT EDUCATION OFFICE AGAR MALWA (VCC-011)',
    centerCode: 'VCC-011',
    totalRecords: 5727,
    inchargeName: 'ASHISH',
    inchargePhone: '9407278954',
    inchargeEmail: 'iamashishnigam@gmail.com',
  },
  {
    sno: 2,
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    district: 'Bhopal',
    centerName: 'DIVISIONAL EDUCATION OFFICE BHOPAL (VCC-002)',
    centerCode: 'VCC-002',
    totalRecords: 4812,
    inchargeName: '',
    inchargePhone: '',
    inchargeEmail: '',
  },
  {
    sno: 3,
    testName: 'Assistant Professor Recruitment 2025',
    district: 'Gwalior',
    centerName: 'DISTRICT COLLECTORATE GWALIOR (VCC-031)',
    centerCode: 'VCC-031',
    totalRecords: 3200,
    inchargeName: 'RAMESH PATHAK',
    inchargePhone: '9876543210',
    inchargeEmail: 'ramesh.pathak@mp.gov.in',
  },
];

const MOCK_INVALID = [
  {
    row: 4,
    testName: 'लोक शिक्षण संचालनालय (DPI - माध्यमिक शिक्षक) 2025-2026',
    district: 'Unknown',
    centerName: '',
    error: 'Center name missing',
  },
  {
    row: 7,
    testName: 'Assistant Professor Recruitment 2025',
    district: 'Bhopal',
    centerName: 'INVALID CENTER CODE',
    error: 'Center Code format invalid',
  },
];

// ─── Edit Incharge Modal ──────────────────────────────────────────────────────
function EditInchargeModal({
  record,
  onSave,
  onClose,
}: {
  record: VCRow;
  onSave: (updated: VCRow) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(record.inchargeName);
  const [phone, setPhone] = useState(record.inchargePhone);
  const [email, setEmail] = useState(record.inchargeEmail);

  const handleSave = () => {
    if (!name.trim()) {
      ToastService.error('Incharge Name is required.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      ToastService.error('Valid 10-digit phone number is required.');
      return;
    }
    onSave({
      ...record,
      inchargeName: name,
      inchargePhone: phone,
      inchargeEmail: email,
    });
    ToastService.success('Incharge details updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1e2433] border border-slate-400/20 rounded-2xl p-8 w-[520px] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Assign Incharge</h2>
            <p className="text-xs text-slate-400 mt-0.5">{record.centerName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors material-symbols-rounded text-[20px] cursor-pointer bg-transparent border-none"
          >
            close
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <TextBox
            id="incharge-name"
            label="Incharge Name"
            required
            value={name}
            onChange={setName}
            placeholder="Enter full name"
          />
          <TextBox
            id="incharge-phone"
            label="Incharge Phone Number"
            required
            value={phone}
            onChange={setPhone}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          <TextBox
            id="incharge-email"
            label="Incharge Email Address"
            value={email}
            onChange={setEmail}
            placeholder="email@example.com"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            label="Save"
            icon="save"
            type="button"
            variant="primary"
            onClick={handleSave}
          />
          <Button
            label="Cancel"
            type="button"
            variant="outlined"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({
  record,
  onClose,
}: {
  record: VCRow;
  onClose: () => void;
}) {
  const rows = [
    ['Test Name', record.testName],
    ['District', record.district],
    ['Center Name', record.centerName],
    ['Center Code', record.centerCode],
    ['Total Records', record.totalRecords.toLocaleString()],
    ['Incharge Name', record.inchargeName || '—'],
    ['Incharge Phone', record.inchargePhone || '—'],
    ['Incharge Email', record.inchargeEmail || '—'],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#1e2433] border border-slate-400/20 rounded-2xl p-8 w-[560px] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-white">
            Verification Center Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors material-symbols-rounded text-[20px] cursor-pointer bg-transparent border-none"
          >
            close
          </button>
        </div>
        <div className="flex flex-col divide-y divide-slate-400/10">
          {rows.map(([label, value]) => (
            <div key={label} className="flex py-2.5 gap-4">
              <span className="text-[12px] text-slate-500 w-44 flex-shrink-0 font-medium">
                {label}
              </span>
              <span className="text-[13px] text-slate-200">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button
            label="Close"
            type="button"
            variant="outlined"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerificationCenterUploadPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [vcFile, setVcFile] = useState<File | null>(null);
  const [isParsed, setIsParsed] = useState(false);
  const [records, setRecords] = useState<VCRow[]>(INITIAL_RECORDS);
  const [editRecord, setEditRecord] = useState<VCRow | null>(null);
  const [viewRecord, setViewRecord] = useState<VCRow | null>(null);

  const testMeta = TESTS.find(t => t.value === selectedTest);

  const handleFileChange = (f: File | null) => {
    setVcFile(f);
    if (f) {
      setIsParsed(true);
      ToastService.success(`"${f.name}" parsed successfully.`);
    } else {
      setIsParsed(false);
    }
  };

  const handleSave = () => {
    if (!selectedTest) {
      ToastService.error('Please select a Test.');
      return;
    }
    ToastService.success('Verification Center file saved successfully.');
    handleReset();
  };

  const handleReset = () => {
    setSelectedTest(null);
    setVcFile(null);
    setIsParsed(false);
  };

  const handleInchargeSave = (updated: VCRow) => {
    setRecords(prev => prev.map(r => (r.sno === updated.sno ? updated : r)));
  };

  const columns: Controls.ColumnProps<VCRow>[] = [
    { field: 'sno', header: 'S.No', width: '60px' },
    { field: 'testName', header: 'Test Name' },
    { field: 'district', header: 'District Name', width: '130px' },
    { field: 'centerName', header: 'Verification Center Name' },
    {
      header: 'Total Records',
      width: '120px',
      cell: (row: VCRow) => (
        <span className="font-semibold text-slate-300">
          {row.totalRecords.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'InCharge Name',
      cell: (row: VCRow) =>
        row.inchargeName ? (
          <span className="text-slate-300">{row.inchargeName}</span>
        ) : (
          <span className="text-amber-500 text-[11px] font-semibold">
            Not Assigned
          </span>
        ),
    },
    {
      header: 'InCharge Phone',
      width: '140px',
      cell: (row: VCRow) => (
        <span className="text-slate-400 text-[12px]">
          {row.inchargePhone || '—'}
        </span>
      ),
    },
    {
      header: 'InCharge Email',
      cell: (row: VCRow) => (
        <span className="text-slate-400 text-[12px]">
          {row.inchargeEmail || '—'}
        </span>
      ),
    },
    {
      header: 'Action',
      width: '170px',
      cell: (row: VCRow) => (
        <div className="flex items-center gap-2">
          <Button
            label="View"
            icon="eye"
            type="button"
            variant="primary"
            size="small"
            onClick={() => setViewRecord(row)}
          />
          <Button
            label={row.inchargeName ? 'Edit' : 'Assign'}
            icon={row.inchargeName ? 'pencil' : 'person_add'}
            type="button"
            variant="outlined"
            size="small"
            onClick={() => setEditRecord(row)}
          />
        </div>
      ),
    },
  ];

  const invalidColumns: Controls.ColumnProps<any>[] = [
    { field: 'row', header: 'Row #' },
    { field: 'testName', header: 'Test Name' },
    { field: 'district', header: 'District' },
    { field: 'centerName', header: 'Verification Center Name' },
    {
      header: 'Validation Error',
      cell: (row: any) => (
        <span className="text-red-400 font-medium">{row.error}</span>
      ),
    },
  ];

  return (
    <FormPage
      title="Verification Center Upload"
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'HR Admin', to: '/recruitment-management/admin' },
        { label: 'Verification Center Upload' },
      ]}
    >
      {/* ── Upload Form ── */}
      <FormCard title="Upload Verification Center" icon="upload_file">
        <FormGrid columns={4}>
          <DropDownList
            id="vc-test"
            label="Test"
            required
            data={TESTS}
            textField="label"
            valueField="value"
            value={selectedTest}
            defaultOptionText="Select Test"
            onChange={v => setSelectedTest(v as string | null)}
          />
          <TextBox
            id="vc-exam"
            label="Exam"
            value={testMeta?.exam ?? ''}
            onChange={() => {}}
            disabled
            placeholder="Auto-filled"
          />
          <TextBox
            id="vc-date-range"
            label="Exam (From Date – To Date)"
            value={testMeta?.dateRange ?? ''}
            onChange={() => {}}
            disabled
            placeholder="Auto-filled"
          />
          <FileUpload
            id="vc-file"
            label="Upload Verification Center File"
            required
            mode="file"
            accept=".xlsx,.xls,.csv"
            value={vcFile}
            onChange={handleFileChange}
          />
        </FormGrid>

        <div className="flex gap-3 mt-2">
          <Button
            label="Save Verification Center"
            icon="save"
            type="button"
            variant="primary"
            onClick={handleSave}
          />
          <Button
            label="Reset"
            icon="refresh"
            type="button"
            variant="outlined"
            onClick={handleReset}
          />
        </div>
      </FormCard>

      {/* ── Table ── */}
      <FormCard
        title="Candidate Verification Center Details"
        icon="fact_check"
        headerAction={
          <div className="flex items-center gap-2">
            <Button
              label="Download Template"
              icon="download"
              type="button"
              variant="outlined"
              onClick={() => ToastService.success('Template downloading…')}
            />
            <Button
              label="Upload VC Details"
              icon="upload"
              type="button"
              variant="primary"
              onClick={() => ToastService.success('Upload dialog opening…')}
            />
          </div>
        }
      >
        <p className="text-[11px] text-slate-500 mb-4">
          * Download the template, fill in the candidate verification center
          details, and upload using the &apos;Upload VC Details&apos; button.
        </p>

        {isParsed ? (
          <Tabs
            tabs={[
              {
                title: `Valid Data (${records.length})`,
                content: (
                  <div className="pt-4">
                    <GridPanel
                      data={records}
                      columns={columns}
                      searchBox
                      searchPlaceholder="Search by test, district, center or incharge…"
                    />
                  </div>
                ),
              },
              {
                title: `Invalid Data (${MOCK_INVALID.length})`,
                content: (
                  <div className="pt-4">
                    <GridPanel data={MOCK_INVALID} columns={invalidColumns} />
                  </div>
                ),
              },
            ]}
          />
        ) : (
          <GridPanel
            data={records}
            columns={columns}
            searchBox
            searchPlaceholder="Search by test, district, center or incharge…"
          />
        )}
      </FormCard>

      {/* ── Modals ── */}
      {viewRecord && (
        <ViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      )}
      {editRecord && (
        <EditInchargeModal
          record={editRecord}
          onSave={handleInchargeSave}
          onClose={() => setEditRecord(null)}
        />
      )}
    </FormPage>
  );
}
