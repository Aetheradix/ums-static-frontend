import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import { civilWorks, milestones as initialMilestones } from '../../mocks';
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
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = parsed.map((w: any) => {
        const mockW = civilWorks.find((mw: any) => mw.id === w.id);
        if (mockW) {
          return {
            ...w,
            status:
              w.status === 'Budget Locked' && mockW.status === 'Tender Awarded'
                ? 'Tender Awarded'
                : w.status,
            contractAmount:
              w.contractAmount === 0 && mockW.contractAmount > 0
                ? mockW.contractAmount
                : w.contractAmount,
            tpiAgencyId: w.tpiAgencyId || mockW.tpiAgencyId,
            tpiAgencyName: w.tpiAgencyName || mockW.tpiAgencyName,
            qualityLabId: w.qualityLabId || mockW.qualityLabId,
            qualityLabName: w.qualityLabName || mockW.qualityLabName,
          };
        }
        return w;
      });
      localStorage.setItem('civil_works', JSON.stringify(merged));
      return merged;
    }
    return civilWorks;
  });

  const [milestones, setMilestones] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = parsed.map((m: any) => {
        const mockM = initialMilestones.find((mw: any) => mw.id === m.id);
        if (mockM && mockM.qualityTestRequired) {
          return {
            ...m,
            testName: m.testName || mockM.testName,
            testType: m.testType || mockM.testType,
            materialTested: m.materialTested || mockM.materialTested,
            labName: m.labName || mockM.labName,
            requiredValue: m.requiredValue || mockM.requiredValue,
          };
        }
        return m;
      });
      const parsedIds = new Set(merged.map((m: any) => m.id));
      const missing = initialMilestones.filter(
        (m: any) => !parsedIds.has(m.id)
      );
      const finalMerged = [...merged, ...missing];
      localStorage.setItem('civil_milestones', JSON.stringify(finalMerged));
      return finalMerged;
    }
    return initialMilestones;
  });

  const [selectedWorkId, setSelectedWorkId] = useState<string>(() => {
    return works[0]?.id || '';
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
  const [testDate, setTestDate] = useState('');

  const handleUpdate = () => {
    if (!popup.item) return;
    if (!certNo) {
      ToastService.error('Lab certificate number is required.');
      return;
    }
    if (!testDate) {
      ToastService.error('Test date is required.');
      return;
    }
    if (!docName) {
      ToastService.error('Document upload file name is required.');
      return;
    }

    const updatedMilestones = milestones.map((m: any) =>
      m.id === popup.item.id
        ? {
            ...m,
            qualityTestStatus: result,
            observedValue,
            certNo,
            testDate,
            uploadedDoc: docName,
            testRemarks: remarks,
            status:
              result === 'Fail'
                ? ('Quality Fail' as any)
                : m.status === 'Quality Fail'
                  ? ('In Progress' as any)
                  : m.status,
          }
        : m
    );

    setMilestones(updatedMilestones);
    localStorage.setItem('civil_milestones', JSON.stringify(updatedMilestones));

    // Sync to civil_quality_tests for other parts of the app (like Dashboard)
    const updatedTests = updatedMilestones
      .filter((m: any) => m.qualityTestRequired)
      .map((m: any) => ({
        id: `qt_${m.id}`,
        workId: m.workId,
        workName: m.workName,
        milestoneId: m.id,
        testName: m.testName || 'Quality Test',
        testType: m.testType || 'Standard Test',
        materialTested: m.materialTested || 'Sample Material',
        labName: m.labName || 'Standard Lab',
        testDate: m.testDate,
        sampleQty: 6,
        requiredValue: m.requiredValue || 'As per standard',
        observedValue: m.observedValue,
        result: m.qualityTestStatus || 'Pending',
        certNo: m.certNo,
        uploadedDoc: m.uploadedDoc,
        remarks: m.testRemarks,
      }));
    localStorage.setItem('civil_quality_tests', JSON.stringify(updatedTests));

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

  const filteredMilestones = milestones
    .filter((m: any) => m.workId === selectedWorkId && m.qualityTestRequired)
    .sort((a: any, b: any) => a.sequenceNo - b.sequenceNo);

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
                <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
                  <DropDownList
                    label="Select Project / Work"
                    data={works.map((w: any) => ({
                      label: `${w.workId} - ${w.name}`,
                      value: w.id,
                    }))}
                    textField="label"
                    optionValue="value"
                    value={selectedWorkId}
                    onChange={(val: any) => setSelectedWorkId(val as string)}
                  />
                </div>

                <GridPanel
                  data={filteredMilestones}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '50px',
                    },
                    {
                      field: 'workName',
                      header: 'Work ID',
                      cell: (m: any) => {
                        const wk = works.find(
                          (w: any) => w.id === m.workId || w.workId === m.workId
                        );
                        return (
                          <span
                            style={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            {wk?.workId ?? m.workId}
                          </span>
                        );
                      },
                    },
                    {
                      field: 'milestoneName',
                      header: 'Milestone Stage',
                      cell: (m: any) => (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {m.milestoneName} (Milestone {m.sequenceNo})
                        </span>
                      ),
                    },
                    {
                      field: 'testName',
                      header: 'Test Name',
                      cell: (m: any) => (
                        <span style={{ fontWeight: 600 }}>
                          {m.testName || '—'}
                        </span>
                      ),
                    },
                    {
                      field: 'labName',
                      header: 'Testing Lab',
                      cell: (m: any) => {
                        const wk = works.find(
                          (w: any) => w.id === m.workId || w.workId === m.workId
                        );
                        return (
                          <span>{wk?.qualityLabName ?? m.labName ?? '—'}</span>
                        );
                      },
                    },
                    {
                      field: 'testDate',
                      header: 'Test Date',
                      cell: (m: any) =>
                        m.testDate ? (
                          <span>{m.testDate}</span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Pending</span>
                        ),
                    },
                    {
                      field: 'observedValue',
                      header: 'Observed Value',
                      cell: (m: any) =>
                        m.observedValue ? (
                          <span>{m.observedValue}</span>
                        ) : (
                          <span className="civil-pill amber">Awaited</span>
                        ),
                    },
                    {
                      field: 'qualityTestStatus',
                      header: 'Result',
                      cell: (m: any) => (
                        <span
                          className={`civil-pill ${RESULT_COLORS[m.qualityTestStatus || 'Pending'] ?? 'gray'}`}
                        >
                          {m.qualityTestStatus || 'Pending'}
                        </span>
                      ),
                    },
                    {
                      field: 'certNo',
                      header: 'Cert. No',
                      cell: (m: any) =>
                        m.certNo ? (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.72rem',
                            }}
                          >
                            {m.certNo}
                          </span>
                        ) : (
                          <span className="civil-pill amber">Pending</span>
                        ),
                    },
                    {
                      field: 'uploadedDoc',
                      header: 'Uploaded Document',
                      cell: (m: any) =>
                        m.uploadedDoc ? (
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>
                            📄 {m.uploadedDoc}
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
                          {(item.qualityTestStatus || 'Pending') !== 'Pass' && (
                            <Button
                              size="small"
                              label="Update Result"
                              icon="upload"
                              variant="primary"
                              onClick={() => {
                                setCertNo(item.certNo || '');
                                setObservedValue(item.observedValue || '');
                                setDocName(item.uploadedDoc || '');
                                setResult(
                                  item.qualityTestStatus === 'Fail'
                                    ? 'Fail'
                                    : 'Pass'
                                );
                                setRemarks(item.testRemarks || '');
                                setTestDate(
                                  item.testDate ||
                                    new Date().toISOString().split('T')[0]
                                );
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
            ? `Upload Lab Result — ${popup.item?.milestoneName}`
            : `Test Details — ${popup.item?.milestoneName}`
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
                    [
                      'Milestone Stage',
                      `${popup.item.milestoneName} (Milestone ${popup.item.sequenceNo})`,
                    ],
                    ['Milestone Description', popup.item.description],
                    ['Test Name', popup.item.testName || '—'],
                    ['Test Type / Standard', popup.item.testType || '—'],
                    ['Material Tested', popup.item.materialTested || '—'],
                    [
                      'Testing Laboratory',
                      wk?.qualityLabName ?? popup.item.labName ?? '—',
                    ],
                    ['TPI Quality check Agency', wk?.tpiAgencyName ?? '—'],
                    ['Required Value', popup.item.requiredValue || '—'],
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
                      <DatePicker
                        label="Test Date *"
                        value={testDate ? new Date(testDate) : undefined}
                        onChange={v =>
                          setTestDate(v ? v.toISOString().split('T')[0] : '')
                        }
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
