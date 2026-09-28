import { useEffect, useState } from 'react';
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
} from 'shared/new-components';
import {
  type Milestone,
  civilWorks,
  milestones as initialMilestones,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState = { mode: 'closed' } | { mode: 'create' };

const formatLocalDate = (d?: Date | null): string => {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (str?: string): Date | undefined => {
  if (!str) return undefined;
  const [year, month, day] = str.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

export default function AdminMilestoneDefinition() {
  const [data, setData] = useState<Milestone[]>(() => {
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
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  // Watch storage updates to keep works sync'd
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWorks = localStorage.getItem('civil_works');
      if (savedWorks) {
        setWorks(JSON.parse(savedWorks));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [selectedWorkId, setSelectedWorkId] = useState('1'); // Default to Science Wing
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Add Form State
  const [mName, setMName] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mWeight, setMWeight] = useState('');
  const [mStart, setMStart] = useState('');
  const [mEnd, setMEnd] = useState('');
  const [qaRequired, setQaRequired] = useState('No');
  const [testName, setTestName] = useState('');

  useEffect(() => {
    localStorage.setItem('civil_milestones', JSON.stringify(data));

    // Sync to civil_quality_tests in localStorage for engineer portal & dashboard
    const savedTests = localStorage.getItem('civil_quality_tests');
    const existingTests = savedTests ? JSON.parse(savedTests) : [];

    const updatedTests = data
      .filter((m: any) => m.qualityTestRequired)
      .map((m: any) => {
        const existing = existingTests.find(
          (t: any) => t.milestoneId === m.id || t.id === `qt_${m.id}`
        );
        return {
          id: existing?.id || `qt_${m.id}`,
          workId: m.workId,
          workName: m.workName,
          milestoneId: m.id,
          testName: m.testName || existing?.testName || 'Quality Test',
          testType: m.testType || existing?.testType || 'Standard Test',
          materialTested:
            m.materialTested || existing?.materialTested || 'Sample Material',
          labName: m.labName || existing?.labName || 'Standard Lab',
          testDate: m.testDate || existing?.testDate,
          sampleQty: existing?.sampleQty || 6,
          requiredValue:
            m.requiredValue || existing?.requiredValue || 'As per standard',
          observedValue: m.observedValue || existing?.observedValue,
          result: m.qualityTestStatus || existing?.result || 'Pending',
          certNo: m.certNo || existing?.certNo,
          uploadedDoc: m.uploadedDoc || existing?.uploadedDoc,
          remarks: m.testRemarks || existing?.remarks,
        };
      });
    localStorage.setItem('civil_quality_tests', JSON.stringify(updatedTests));
  }, [data]);

  const currentWork = works.find((w: any) => w.id === selectedWorkId);
  const workMilestones = data
    .filter(m => m.workId === selectedWorkId)
    .sort((a, b) => a.sequenceNo - b.sequenceNo);

  const totalWeightage = workMilestones.reduce((s, m) => s + m.weightage, 0);

  const handleAddMilestone = () => {
    if (totalWeightage >= 100) {
      ToastService.error(
        '100% weightage already allocated. Reset milestones or delete some to add more.'
      );
      return;
    }
    if (!mName) {
      ToastService.error('Milestone Name is required.');
      return;
    }
    if (!mWeight || Number(mWeight) <= 0) {
      ToastService.error('Weightage % must be greater than 0.');
      return;
    }
    if (totalWeightage + Number(mWeight) > 100) {
      ToastService.error(
        `Total weightage cannot exceed 100%. Remaining capacity is ${100 - totalWeightage}%.`
      );
      return;
    }

    if (qaRequired === 'Yes' && !testName.trim()) {
      ToastService.error('Quality Test Name is required.');
      return;
    }

    const nextSeq = workMilestones.length + 1;
    const newM: Milestone = {
      id: String(Date.now()),
      workId: selectedWorkId,
      workName: currentWork?.name ?? '',
      sequenceNo: nextSeq,
      milestoneName: mName,
      description: mDesc,
      plannedStartDate: mStart || formatLocalDate(new Date()),
      plannedEndDate:
        mEnd ||
        formatLocalDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      weightage: Number(mWeight),
      status: 'Pending',
      qualityTestRequired: qaRequired === 'Yes',
      qualityTestStatus: qaRequired === 'Yes' ? 'Pending' : undefined,
      testName: qaRequired === 'Yes' ? testName.trim() : undefined,
      testType: qaRequired === 'Yes' ? 'NABL Standard Test' : undefined,
      materialTested: qaRequired === 'Yes' ? 'Sample Material' : undefined,
      labName:
        qaRequired === 'Yes'
          ? currentWork?.qualityLabName || 'Approved Testing Lab'
          : undefined,
      requiredValue:
        qaRequired === 'Yes' ? 'As per standard specification' : undefined,
    };

    setData(prev => [...prev, newM]);
    ToastService.success(`Milestone #${nextSeq} defined successfully.`);

    // Close & Reset
    setPopup({ mode: 'closed' });
    setMName('');
    setMDesc('');
    setMWeight('');
    setMStart('');
    setMEnd('');
    setQaRequired('No');
    setTestName('');
  };

  const handleDeleteMilestone = (id: string) => {
    setData(prev =>
      prev
        .filter(m => m.id !== id)
        .map((m, idx) =>
          m.workId === selectedWorkId ? { ...m, sequenceNo: idx + 1 } : m
        )
    );
    ToastService.success('Milestone removed. Sequence re-ordered.');
  };

  const handleResetMilestones = () => {
    setData(prev => prev.filter(m => m.workId !== selectedWorkId));
    ToastService.success(
      'All milestones cleared for the selected work. You can now define them from scratch.'
    );
  };

  const calculatedValue =
    currentWork && mWeight
      ? (currentWork.contractAmount * Number(mWeight)) / 100
      : 0;

  return (
    <FormPage
      title="Admin Milestone & Payment Release Setup"
      description="Configure project execution milestones and link them directly to financial progress releases (e.g. Plinth, Walls, Slab, Finishing)."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Milestone Definition' },
      ]}
    >
      <div
        style={{
          background: '#f0f9ff',
          border: '1px solid #7dd3fc',
          borderRadius: '0.875rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#0c4a6e',
          marginBottom: '1.25rem',
        }}
      >
        <strong>🔗 Milestone-linked Payments:</strong> Milestone weightages
        translate directly to the financial allocation of the contract value
        (e.g. a milestone with 15% weightage releases 15% of the total contract
        amount upon sign-off). The sum of all milestones must equal exactly 100%
        before work order execution commences.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <FormCard
          title="Select Awarded Project"
          subtitle="Configure milestones for awarded contract"
        >
          <div style={{ marginTop: '0.5rem' }}>
            <DropDownList
              label="Awarded Civil Work"
              data={works.map((w: any) => ({
                name: `${w.workId} — ${w.name}${w.category ? ` [${w.category}]` : ''}`,
                value: w.id,
              }))}
              textField={'name' as any}
              optionValue="value"
              value={selectedWorkId}
              onChange={v => setSelectedWorkId(v as string)}
              required
            />
          </div>

          <div
            style={{
              marginTop: '1rem',
              borderTop: '1px solid #f3f4f6',
              paddingTop: '0.75rem',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              label="Clear All Milestones"
              icon="trash"
              size="small"
              variant="danger"
              onClick={handleResetMilestones}
            />
          </div>
        </FormCard>

        {/* Milestone Rules */}
        <FormCard
          title="Configuration Guard"
          subtitle="Real-time validation of milestone layout"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f3f4f6',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Total Weightage:
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: totalWeightage === 100 ? '#16a34a' : '#d97706',
                }}
              >
                {totalWeightage}%
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f3f4f6',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Contract Amount:
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                ₹{currentWork?.contractAmount?.toLocaleString('en-IN') ?? '0'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '0.25rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                Guard Status:
              </span>
              {totalWeightage === 100 ? (
                <span className="civil-pill green">✓ Ready for Signing</span>
              ) : (
                <span className="civil-pill amber">
                  ⏳ Pending {100 - totalWeightage}% allocation
                </span>
              )}
            </div>
          </div>
        </FormCard>
      </div>

      {/* Configured Milestones Table - Full Width */}
      <FormCard title="Configured Milestones & Payment Release Schedule">
        <GridPanel
          data={workMilestones}
          columns={[
            {
              field: 'sequenceNo',
              header: 'Seq',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 700 }}>
                  Milestone {m.sequenceNo}
                </span>
              ),
              width: '100px',
            },
            {
              field: 'milestoneName',
              header: 'Milestone Stage',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 600 }}>{m.milestoneName}</span>
              ),
            },
            {
              field: 'description',
              header: 'Technical Scope',
              cell: (m: Milestone) => (
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                  {m.description}
                </span>
              ),
            },
            {
              field: 'weightage',
              header: 'Weightage (Payment Release %)',
              cell: (m: Milestone) => (
                <span style={{ fontWeight: 700, color: '#2563eb' }}>
                  {m.weightage}%
                </span>
              ),
            },
            {
              field: 'weightage',
              header: 'Equivalent Payment Released',
              cell: (m: Milestone) => {
                const amt =
                  ((currentWork?.contractAmount ?? 0) * m.weightage) / 100;
                return (
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{amt.toLocaleString('en-IN')}
                  </span>
                );
              },
            },
            { field: 'plannedEndDate', header: 'Target End Date' },
            {
              field: 'qualityTestRequired',
              header: 'QA Test Gate',
              cell: (m: Milestone) =>
                m.qualityTestRequired ? (
                  <span className="civil-pill red">TPI lab test required</span>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    N/A
                  </span>
                ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (item: Milestone) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {item.status !== 'Completed' && (
                    <Button
                      size="small"
                      label=""
                      icon="trash"
                      variant="danger"
                      onClick={() => handleDeleteMilestone(item.id)}
                    />
                  )}
                  {item.status === 'Completed' && (
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      signed off
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            totalWeightage < 100 ? (
              <Button
                label="Add Project Milestone"
                icon="plus"
                variant="primary"
                onClick={() => setPopup({ mode: 'create' })}
              />
            ) : (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  borderRadius: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: '#15803d',
                  fontWeight: 600,
                }}
              >
                ✓ 100% milestone weightage allocated. Payments scheduled.
              </div>
            )
          }
        />
      </FormCard>

      {/* Form popup for Adding Milestone */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Add Project Milestone & Payment Node"
        subtitle="Specify milestone linked to physical construction and payment release."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Milestone Name / Stage"
            placeholder="e.g. Milestone 1: Plinth level foundation work"
            value={mName}
            onChange={setMName}
            required
          />
          <TextBox
            label="Weightage / Payment Release %"
            placeholder={`e.g. 15 (Max capacity remaining: ${100 - totalWeightage}%)`}
            value={mWeight}
            onChange={setMWeight}
            required
          />
        </FormGrid>

        <FormGrid columns={2}>
          <DatePicker
            label="Planned Start Date"
            value={parseLocalDate(mStart)}
            onChange={v => setMStart(formatLocalDate(v))}
          />
          <DatePicker
            label="Planned End Date"
            value={parseLocalDate(mEnd)}
            onChange={v => setMEnd(formatLocalDate(v))}
          />
          <DropDownList
            label="Quality Test Gate (TPI) Required?"
            data={['Yes', 'No'].map(v => ({ name: v, value: v }))}
            textField="name"
            optionValue="value"
            value={qaRequired}
            onChange={v => setQaRequired(v as string)}
          />
        </FormGrid>

        {qaRequired === 'Yes' && (
          <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            <TextBox
              label="Quality Test Name"
              placeholder="e.g. Compressive Strength of Concrete"
              value={testName}
              onChange={setTestName}
              required
            />
          </div>
        )}

        <TextBox
          label="Payment Released Equivalent Value"
          value={
            calculatedValue > 0
              ? `₹${calculatedValue.toLocaleString('en-IN')}`
              : '—'
          }
          onChange={() => {}}
          disabled
        />

        <TextArea
          label="Milestone Scope Description"
          placeholder="Describe completed works required to claim this milestone release..."
          value={mDesc}
          onChange={setMDesc}
          rows={3}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setPopup({ mode: 'closed' })}
          />
          <Button
            label="Define Milestone Node"
            variant="primary"
            icon="plus"
            onClick={handleAddMilestone}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
