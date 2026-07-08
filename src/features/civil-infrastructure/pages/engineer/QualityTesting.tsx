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
} from 'shared/new-components';
import { qualityTests as initialData, civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const RESULT_COLORS: Record<string, string> = {
  Pass: 'green',
  Fail: 'red',
  Pending: 'amber',
  'Re-test Required': 'purple',
};

export default function QualityTesting() {
  const [data, setData] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_quality_tests');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
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

    const updatedData = data.map((t: any) =>
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

    setData(updatedData);
    localStorage.setItem('civil_quality_tests', JSON.stringify(updatedData));

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

  return (
    <FormPage
      title="Quality Testing & Lab Certificates"
      description="Material verification certificates from lab are logged. Dependency: milestone cannot close if test is failed or un-uploaded."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Quality Testing' },
      ]}
    >
      <div
        style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#92400e',
          marginBottom: '1.25rem',
        }}
      >
        <strong>⚡ Strict Dependency:</strong> A milestone cannot be signed off,
        and subsequent construction phases cannot begin, if any mandatory
        material test fails OR remains un-uploaded. This is a system-enforced
        hard stop.
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            {
              field: 'workName',
              header: 'Work',
              cell: (t: any) => {
                const wk = works.find(
                  (w: any) => w.id === t.workId || w.workId === t.workId
                );
                return (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
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
              field: 'testType',
              header: 'Test Type',
              cell: (t: any) => (
                <span style={{ fontSize: '0.72rem' }}>{t.testType}</span>
              ),
            },
            {
              field: 'materialTested',
              header: 'Material',
              cell: (t: any) => (
                <span style={{ fontSize: '0.72rem' }}>{t.materialTested}</span>
              ),
            },
            {
              field: 'labName',
              header: 'Quality Testing Lab',
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
                    style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}
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
          searchPlaceholder="Search tests..."
        />
      </FormCard>

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
                    ['TPI Inspection Agency', wk?.tpiAgencyName ?? '—'],
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
