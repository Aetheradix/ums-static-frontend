import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import { qualityTests as initialTests, civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const RESULT_COLORS: Record<string, string> = {
  Pass: 'green',
  Fail: 'red',
  Pending: 'amber',
  'Re-test Required': 'purple',
};

const QUALITY_FRAMEWORK_GUIDELINES = [
  {
    stage: 'Raw Materials',
    tests: ['Tensile Strength (IS 1786)', 'Elongation %', 'Yield Strength'],
    material: 'HYSD Steel Bars Fe415',
    standard: 'IS 1786:2008',
    timing: 'Before use — each consignment',
    mandatory: true,
  },
  {
    stage: 'Concrete — Fresh',
    tests: ['Slump Test', 'Compacting Factor Test', 'Temperature Check'],
    material: 'Ready Mix / Site Mix Concrete',
    standard: 'IS 1199:1959',
    timing: 'At casting point',
    mandatory: true,
  },
  {
    stage: 'Concrete — Hardened',
    tests: ['Cube Compressive Strength (7-day, 28-day)', 'Core Cutting Test'],
    material: 'Concrete in structure',
    standard: 'IS 456:2000',
    timing: '7 days and 28 days after casting',
    mandatory: true,
  },
  {
    stage: 'Brickwork',
    tests: ['Compression Test on Bricks', 'Water Absorption Test'],
    material: 'Burnt Clay Bricks IS 1077',
    standard: 'IS 3495:1992',
    timing: 'Before use',
    mandatory: true,
  },
  {
    stage: 'Sub-base / Road',
    tests: ['Proctor Compaction Test', 'CBR Test', 'Field Density Test'],
    material: 'Granular sub-base, WMM',
    standard: 'IRC SP 72',
    timing: 'Per 500m stretch',
    mandatory: true,
  },
  {
    stage: 'Waterproofing',
    tests: ['Flood Test (48hr ponding)', 'Bond Strength Test'],
    material: 'Waterproofing compound / membrane',
    standard: 'IS 3067:1988',
    timing: 'After application before finishing',
    mandatory: false,
  },
];

export default function QualityFramework() {
  // Works state from localStorage
  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  // Quality Tests state shared with QualityTesting.tsx
  const [tests, setTests] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_quality_tests');
    return saved ? JSON.parse(saved) : initialTests;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'update';
    item?: any;
  }>({ mode: 'closed' });
  const [certNo, setCertNo] = useState('');
  const [observedValue, setObservedValue] = useState('');
  const [result, setResult] = useState<'Pass' | 'Fail' | 'Re-test Required'>(
    'Pass'
  );
  const [remarks, setRemarks] = useState('');
  const [docName, setDocName] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_quality_tests', JSON.stringify(tests));
  }, [tests]);

  const handleUpdate = () => {
    if (!popup.item) return;
    if (!certNo) {
      ToastService.error('Lab certificate number is required.');
      return;
    }
    if (!docName) {
      ToastService.error('Document upload file name is required.');
      return;
    }

    const updatedTests = tests.map((t: any) =>
      t.id === popup.item!.id
        ? {
            ...t,
            result,
            observedValue,
            certNo,
            testDate: new Date().toISOString().split('T')[0],
            remarks,
            uploadedDoc: docName,
          }
        : t
    );

    setTests(updatedTests);

    if (result === 'Fail') {
      ToastService.error(
        'Test FAILED. Milestone sign-off blocked. Contractor must rectify and re-test.'
      );
    } else {
      ToastService.success(
        'Quality test result recorded. Lab certificate & documents uploaded.'
      );
    }
    setPopup({ mode: 'closed' });
  };

  const activeWorks = works.filter((w: any) =>
    [
      'Tender Awarded',
      'Work Order Issued',
      'In Progress',
      'Completed',
      'DLP Active',
    ].includes(w.status)
  );

  return (
    <FormPage
      title="Quality Assurance Framework"
      description="Systematic control structure establishing mandatory QA/QC test matrices, TPI agency assignments, and NABL lab validation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Quality Framework' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'QA/QC Inspection Clearance (Testing Logs)',
            content: (
              <FormCard
                title="Material Verification Registry"
                subtitle="Record, verify, and upload document certificates for NABL/TPI laboratory tests."
              >
                <GridPanel
                  data={tests}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '50px',
                    },
                    {
                      field: 'workName',
                      header: 'Work',
                      cell: (t: any) => {
                        const wk = works.find(
                          (w: any) => w.id === t.workId || w.workId === t.workId
                        );
                        return (
                          <span
                            style={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            {wk?.workId ?? t.workId}
                          </span>
                        );
                      },
                    },
                    {
                      field: 'testName',
                      header: 'Test Name',
                      cell: (t: any) => (
                        <span style={{ fontWeight: 600 }}>{t.testName}</span>
                      ),
                    },
                    {
                      field: 'labName',
                      header: 'Testing Lab',
                      cell: (t: any) => {
                        const wk = works.find(
                          (w: any) => w.id === t.workId || w.workId === t.workId
                        );
                        return <span>{wk?.qualityLabName ?? t.labName}</span>;
                      },
                    },
                    {
                      field: 'testDate',
                      header: 'Test Date',
                      cell: (t: any) =>
                        t.testDate ? (
                          <span>{t.testDate}</span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Pending</span>
                        ),
                    },
                    {
                      field: 'observedValue',
                      header: 'Observed Value',
                      cell: (t: any) =>
                        t.observedValue ? (
                          <span>{t.observedValue}</span>
                        ) : (
                          <span className="civil-pill amber">Awaited</span>
                        ),
                    },
                    {
                      field: 'result',
                      header: 'Result',
                      cell: (t: any) => (
                        <span
                          className={`civil-pill ${RESULT_COLORS[t.result] ?? 'gray'}`}
                        >
                          {t.result}
                        </span>
                      ),
                    },
                    {
                      field: 'certNo',
                      header: 'Cert. No',
                      cell: (t: any) =>
                        t.certNo ? (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.72rem',
                            }}
                          >
                            {t.certNo}
                          </span>
                        ) : (
                          <span className="civil-pill amber">Pending</span>
                        ),
                    },
                    {
                      field: 'uploadedDoc' as any,
                      header: 'Uploaded Document',
                      cell: (t: any) =>
                        t.uploadedDoc ? (
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>
                            📄 {t.uploadedDoc}
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>—</span>
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
                            label=""
                            icon="eye"
                            variant="outlined"
                            onClick={() => setPopup({ mode: 'view', item })}
                          />
                          {item.result === 'Pending' && (
                            <Button
                              size="small"
                              label="Update Result"
                              icon="upload"
                              variant="primary"
                              onClick={() => {
                                setCertNo('');
                                setObservedValue('');
                                setDocName('');
                                setResult('Pass');
                                setRemarks('');
                                setPopup({ mode: 'update', item });
                              }}
                            />
                          )}
                        </div>
                      ),
                    },
                  ]}
                  searchBox
                  searchPlaceholder="Search testing logs..."
                />
              </FormCard>
            ),
          },
          {
            title: `Project Quality Allocations (${activeWorks.length})`,
            content: (
              <FormCard
                title="Civil Works QA/QC Agency Assignments"
                subtitle="Lists the independent TPI agencies and testing laboratories mapped to active projects."
              >
                <table className="civil-table">
                  <thead>
                    <tr>
                      <th>Work ID</th>
                      <th>Project Name</th>
                      <th>Contractor / Agency</th>
                      <th>TPI Quality check Agency</th>
                      <th>Quality Lab Testing Agency</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeWorks.map((w: any) => (
                      <tr key={w.id}>
                        <td>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                            }}
                          >
                            {w.workId}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{w.name}</td>
                        <td>{w.externalAgency ?? '—'}</td>
                        <td>
                          <span
                            className="civil-pill blue"
                            style={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            🛡️ {w.tpiAgencyName ?? 'Not Mapped'}
                          </span>
                        </td>
                        <td>
                          <span
                            className="civil-pill purple"
                            style={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            🧪 {w.qualityLabName ?? 'Not Mapped'}
                          </span>
                        </td>
                        <td>
                          <span className="civil-pill green">{w.status}</span>
                        </td>
                      </tr>
                    ))}
                    {activeWorks.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            textAlign: 'center',
                            color: '#9ca3af',
                            padding: '2rem',
                          }}
                        >
                          No active works with mapped QA/QC allocations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </FormCard>
            ),
          },
          {
            title: 'Quality Guidelines & Matrix',
            content: (
              <div>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '0.875rem',
                    padding: '1rem 1.25rem',
                    fontSize: '0.8125rem',
                    color: '#15803d',
                    marginBottom: '1.25rem',
                  }}
                >
                  <strong>📜 NABL Laboratory & TPI Mandate:</strong> All listed
                  material testing checks must be conducted in
                  PWD-approved/NABL-accredited labs. Third-party quality
                  inspection (TPI) agency validation stamp is legally binding
                  for project milestone sign-off.
                </div>
                {QUALITY_FRAMEWORK_GUIDELINES.map(f => (
                  <div key={f.stage} style={{ marginBottom: '1rem' }}>
                    <FormCard
                      title={f.stage}
                      subtitle={`IS Standard: ${f.standard} | Frequency: ${f.timing}`}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 2fr 1fr',
                          gap: '1rem',
                          alignItems: 'start',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              marginBottom: '0.375rem',
                            }}
                          >
                            Tests Required
                          </div>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '1.25rem',
                              fontSize: '0.8125rem',
                              color: '#374151',
                              lineHeight: 1.8,
                            }}
                          >
                            {f.tests.map(t => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              marginBottom: '0.375rem',
                            }}
                          >
                            Material
                          </div>
                          <div
                            style={{ fontSize: '0.8125rem', fontWeight: 600 }}
                          >
                            {f.material}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              marginBottom: '0.375rem',
                            }}
                          >
                            Mandatory
                          </div>
                          <span
                            className={`civil-pill ${f.mandatory ? 'red' : 'gray'}`}
                          >
                            {f.mandatory ? 'MANDATORY' : 'Optional'}
                          </span>
                        </div>
                      </div>
                    </FormCard>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'update'
            ? `Upload Lab Result — ${popup.item?.testName}`
            : `Test Details — ${popup.item?.testName}`
        }
        subtitle="Lab certificate upload for quality gate clearance."
        size="lg"
      >
        {popup.item &&
          (() => {
            const wk = works.find(
              (w: any) =>
                w.id === popup.item.workId || w.workId === popup.item.workId
            );
            return (
              <>
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
                    ['Test Name', popup.item.testName],
                    ['Test Type / Standard', popup.item.testType],
                    ['Material Tested', popup.item.materialTested],
                    [
                      'Testing Laboratory',
                      wk?.qualityLabName ?? popup.item.labName,
                    ],
                    ['TPI Quality check Agency', wk?.tpiAgencyName ?? '—'],
                    ['No. of Samples', String(popup.item.sampleQty)],
                    ['Required Value', popup.item.requiredValue],
                    ['TPI Engineer', popup.item.tpiEngineer ?? '—'],
                    [
                      'Uploaded Document',
                      popup.item.uploadedDoc
                        ? `📄 ${popup.item.uploadedDoc}`
                        : 'Not Uploaded',
                    ],
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

                {popup.mode === 'update' && (
                  <>
                    <FormGrid columns={2}>
                      <TextBox
                        label="Observed Value *"
                        placeholder="e.g. 22.4 N/mm²"
                        value={observedValue}
                        onChange={setObservedValue}
                        required
                      />
                      <TextBox
                        label="Lab Certificate No. *"
                        placeholder="e.g. IIT/BPL/CC/2025/0142"
                        value={certNo}
                        onChange={setCertNo}
                        required
                      />
                    </FormGrid>
                    <FormGrid columns={2}>
                      <DropDownList
                        label="Test Result *"
                        data={['Pass', 'Fail', 'Re-test Required'].map(v => ({
                          name: v,
                          value: v,
                        }))}
                        textField={'name' as any}
                        optionValue="value"
                        value={result}
                        onChange={v => setResult(v as any)}
                      />
                      <TextBox
                        label="Test Date"
                        value={new Date().toISOString().split('T')[0]}
                        onChange={() => {}}
                        disabled
                      />
                    </FormGrid>
                    <div style={{ marginBottom: '1rem' }}>
                      <label
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#374151',
                          display: 'block',
                          marginBottom: '0.375rem',
                        }}
                      >
                        Upload Lab Document / Report *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDocName(file.name);
                            ToastService.success(
                              `Uploaded report document: ${file.name}`
                            );
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.375rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.8125rem',
                          background: '#ffffff',
                        }}
                      />
                      {docName && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#16a34a',
                            display: 'block',
                            marginTop: '0.25rem',
                            fontWeight: 600,
                          }}
                        >
                          ✓ Selected: {docName}
                        </span>
                      )}
                    </div>
                    <TextArea
                      label="Lab Remarks"
                      placeholder="Additional observations from lab..."
                      value={remarks}
                      onChange={setRemarks}
                      rows={2}
                    />
                    {result === 'Fail' && (
                      <div
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '0.75rem',
                          padding: '0.875rem 1rem',
                          fontSize: '0.8125rem',
                          color: '#991b1b',
                          marginTop: '0.75rem',
                        }}
                      >
                        ❌ Marking as FAIL will block the associated milestone
                        sign-off and prevent the next construction phase from
                        commencing.
                      </div>
                    )}
                    <div className="flex justify-end gap-3 mt-4">
                      <Button
                        label="Cancel"
                        variant="outlined"
                        onClick={() => setPopup({ mode: 'closed' })}
                      />
                      <Button
                        label="Upload Lab Result"
                        variant={result === 'Fail' ? 'danger' : 'primary'}
                        icon="upload"
                        onClick={handleUpdate}
                      />
                    </div>
                  </>
                )}
              </>
            );
          })()}
      </FormPopup>
    </FormPage>
  );
}
