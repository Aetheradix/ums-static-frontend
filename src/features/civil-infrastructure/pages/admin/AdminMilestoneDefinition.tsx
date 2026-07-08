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
  milestones as initialMilestones,
  civilWorks,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState = { mode: 'closed' } | { mode: 'create' };

const PRESET_OPTIONS = [
  {
    value: 'custom',
    label: 'Custom Milestone (Type below)',
    name: '',
    desc: '',
    weight: '',
    qa: 'No',
  },
  {
    value: 'b_found',
    label: '[Building] Excavation & Foundation',
    name: 'Excavation & Foundation',
    desc: 'Excavation, footings, and substructure foundation works',
    weight: '15',
    qa: 'Yes',
  },
  {
    value: 'b_plinth',
    label: '[Building] Plinth Level Construction',
    name: 'Plinth Level Construction',
    desc: 'Plinth beam laying, damp proof course and backfilling',
    weight: '20',
    qa: 'Yes',
  },
  {
    value: 'b_masonry',
    label: '[Building] Brickwork & Partition Walls',
    name: 'Brickwork & Partition Walls',
    desc: 'Superstructure brickwork masonry and partition wall layout',
    weight: '25',
    qa: 'Yes',
  },
  {
    value: 'b_slab',
    label: '[Building] Roof Slab casting (RCC)',
    name: 'Roof Slab casting (RCC)',
    desc: 'Slab reinforcement binding and RCC concrete pouring',
    weight: '25',
    qa: 'Yes',
  },
  {
    value: 'b_finishing',
    label: '[Building] Finishing & Handover',
    name: 'Finishing & Handover',
    desc: 'Plastering, painting, flooring, MEP fittings and final handover',
    weight: '15',
    qa: 'No',
  },
  {
    value: 'r_grade',
    label: '[Road] Surface Excavation & Prep',
    name: 'Surface Excavation & Prep',
    desc: 'Excavation of old asphalt road surface, sub-grade grading and compaction',
    weight: '20',
    qa: 'Yes',
  },
  {
    value: 'r_base',
    label: '[Road] Sub-base & Base Course',
    name: 'Sub-base & Base Course',
    desc: 'Granular sub-base (GSB) and Wet Mix Macadam (WMM) layers',
    weight: '35',
    qa: 'Yes',
  },
  {
    value: 'r_asphalt',
    label: '[Road] Bituminous Asphalt Concrete',
    name: 'Bituminous Asphalt Concrete',
    desc: 'Laying of Dense Bituminous Macadam (DBM) and bituminous concrete wearing course',
    weight: '30',
    qa: 'Yes',
  },
  {
    value: 'r_marking',
    label: '[Road] Shoulders & Road Markings',
    name: 'Shoulders & Road Markings',
    desc: 'Earthen shoulders, road painting, signs, and public safety markers',
    weight: '15',
    qa: 'No',
  },
];

export default function AdminMilestoneDefinition() {
  const [data, setData] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });
  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });
  const [selectedWorkId, setSelectedWorkId] = useState('1'); // Default to Science Wing
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Add Form State
  const [selectedPresetId, setSelectedPresetId] = useState('custom');
  const [mName, setMName] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mWeight, setMWeight] = useState('');
  const [mStart, setMStart] = useState('');
  const [mEnd, setMEnd] = useState('');
  const [qaRequired, setQaRequired] = useState('No');

  useEffect(() => {
    localStorage.setItem('civil_milestones', JSON.stringify(data));
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

    const nextSeq = workMilestones.length + 1;
    const newM: Milestone = {
      id: String(Date.now()),
      workId: selectedWorkId,
      workName: currentWork?.name ?? '',
      sequenceNo: nextSeq,
      milestoneName: mName,
      description: mDesc,
      plannedStartDate: mStart || new Date().toISOString().split('T')[0],
      plannedEndDate:
        mEnd ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      weightage: Number(mWeight),
      status: 'Pending',
      qualityTestRequired: qaRequired === 'Yes',
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
    setSelectedPresetId('custom');
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

  const handleSelectPreset = (val: string) => {
    setSelectedPresetId(val);
    const preset = PRESET_OPTIONS.find(p => p.value === val);
    if (preset && val !== 'custom') {
      setMName(preset.name);
      setMDesc(preset.desc);
      setMWeight(preset.weight);
      setQaRequired(preset.qa);
    } else {
      setMName('');
      setMDesc('');
      setMWeight('');
      setQaRequired('No');
    }
  };

  const loadTemplate = (
    type: 'building' | 'road' | 'pipeline' | 'electrical'
  ) => {
    const baseDate = new Date();
    const ms: Milestone[] = [];

    if (type === 'building') {
      ms.push(
        {
          id: String(Date.now() + 1),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 1,
          milestoneName: 'Excavation & Foundation',
          description:
            'Excavation, footings, and substructure foundation works',
          plannedStartDate: baseDate.toISOString().split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 60 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 15,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 2),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 2,
          milestoneName: 'Plinth Level Construction',
          description: 'Plinth beam laying, damp proof course and backfilling',
          plannedStartDate: new Date(
            baseDate.getTime() + 61 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 100 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 20,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 3),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 3,
          milestoneName: 'Brickwork & Partition Walls',
          description:
            'Superstructure brickwork masonry and partition wall layout',
          plannedStartDate: new Date(
            baseDate.getTime() + 101 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 150 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 25,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 4),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 4,
          milestoneName: 'Roof Slab casting (RCC)',
          description: 'Slab reinforcement binding and RCC concrete pouring',
          plannedStartDate: new Date(
            baseDate.getTime() + 151 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 180 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 25,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 5),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 5,
          milestoneName: 'Finishing & Handover',
          description:
            'Plastering, painting, flooring, MEP fittings and final handover',
          plannedStartDate: new Date(
            baseDate.getTime() + 181 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 240 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 15,
          status: 'Pending',
          qualityTestRequired: false,
        }
      );
    } else if (type === 'road') {
      ms.push(
        {
          id: String(Date.now() + 1),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 1,
          milestoneName: 'Surface Excavation & Prep',
          description:
            'Excavation of old asphalt, sub-grade grading and compaction',
          plannedStartDate: baseDate.toISOString().split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 20 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 20,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 2),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 2,
          milestoneName: 'Sub-base & Base Course',
          description:
            'Granular sub-base (GSB) and Wet Mix Macadam (WMM) layers',
          plannedStartDate: new Date(
            baseDate.getTime() + 21 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 50 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 35,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 3),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 3,
          milestoneName: 'Bituminous Asphalt Concrete',
          description:
            'Laying of Dense Bituminous Macadam (DBM) and wearing course',
          plannedStartDate: new Date(
            baseDate.getTime() + 51 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 75 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 30,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 4),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 4,
          milestoneName: 'Shoulders & Road Markings',
          description:
            'Earthen shoulders, road painting, signs, and public safety markers',
          plannedStartDate: new Date(
            baseDate.getTime() + 76 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 90 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 15,
          status: 'Pending',
          qualityTestRequired: false,
        }
      );
    } else if (type === 'pipeline') {
      ms.push(
        {
          id: String(Date.now() + 1),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 1,
          milestoneName: 'Trench Excavation',
          description: 'Excavation of trench and preparing sand bedding',
          plannedStartDate: baseDate.toISOString().split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 30 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 25,
          status: 'Pending',
          qualityTestRequired: false,
        },
        {
          id: String(Date.now() + 2),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 2,
          milestoneName: 'Pipe Laying & Jointing',
          description:
            'Laying of DI/HDPE pipes and welding/jointing validation',
          plannedStartDate: new Date(
            baseDate.getTime() + 31 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 70 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 50,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 3),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 3,
          milestoneName: 'Testing & Backfilling',
          description:
            'Hydrostatic pressure testing of joints, backfilling and site restoration',
          plannedStartDate: new Date(
            baseDate.getTime() + 71 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 90 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 25,
          status: 'Pending',
          qualityTestRequired: true,
        }
      );
    } else if (type === 'electrical') {
      ms.push(
        {
          id: String(Date.now() + 1),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 1,
          milestoneName: 'Foundations & Structure',
          description:
            'RCC foundations for transformer yard and pole erections',
          plannedStartDate: baseDate.toISOString().split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 20 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 30,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 2),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 2,
          milestoneName: 'Equipment & Cabling',
          description:
            'Positioning transformers/HT panels, cabling and grounding joints',
          plannedStartDate: new Date(
            baseDate.getTime() + 21 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 50 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 50,
          status: 'Pending',
          qualityTestRequired: true,
        },
        {
          id: String(Date.now() + 3),
          workId: selectedWorkId,
          workName: currentWork?.name ?? '',
          sequenceNo: 3,
          milestoneName: 'Commissioning & Charge',
          description:
            'SLA inspection testing, electrical inspector clearance, charging yard',
          plannedStartDate: new Date(
            baseDate.getTime() + 51 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          plannedEndDate: new Date(
            baseDate.getTime() + 65 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          weightage: 20,
          status: 'Pending',
          qualityTestRequired: false,
        }
      );
    }

    setData(prev => [...prev.filter(m => m.workId !== selectedWorkId), ...ms]);
    ToastService.success(
      `${type.toUpperCase()} milestone template loaded successfully.`
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
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
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
              label="Awarded Civil Work *"
              data={works
                .filter((w: any) =>
                  [
                    'Tender Awarded',
                    'Work Order Issued',
                    'In Progress',
                    'Completed',
                  ].includes(w.status)
                )
                .map((w: any) => ({
                  name: `${w.workId} — ${w.name} (Valuation: ₹${((w.contractAmount || w.estimatedCost) / 100000).toFixed(1)}L)`,
                  value: w.id,
                }))}
              textField={'name' as any}
              optionValue="value"
              value={selectedWorkId}
              onChange={v => setSelectedWorkId(v as string)}
            />
          </div>

          <div
            style={{
              marginTop: '1rem',
              borderTop: '1px solid #f3f4f6',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#4b5563',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                🪄 Auto-populate Standard Milestone Templates
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  label="Building"
                  icon="building"
                  size="small"
                  variant="outlined"
                  onClick={() => loadTemplate('building')}
                />
                <Button
                  label="Road"
                  icon="map"
                  size="small"
                  variant="outlined"
                  onClick={() => loadTemplate('road')}
                />
                <Button
                  label="Pipeline"
                  icon="filter"
                  size="small"
                  variant="outlined"
                  onClick={() => loadTemplate('pipeline')}
                />
                <Button
                  label="Electrical"
                  icon="bolt"
                  size="small"
                  variant="outlined"
                  onClick={() => loadTemplate('electrical')}
                />
              </div>
            </div>
            <Button
              label="Reset Milestones"
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
        <div style={{ marginBottom: '1rem' }}>
          <DropDownList
            label="Load Standard Civil Stage (Quick Select Preset)"
            data={PRESET_OPTIONS}
            textField="label"
            optionValue="value"
            value={selectedPresetId}
            onChange={v => handleSelectPreset(v as string)}
          />
        </div>

        <FormGrid columns={2}>
          <TextBox
            label="Milestone Name / Stage *"
            placeholder="e.g. Milestone 1: Plinth level foundation work"
            value={mName}
            onChange={setMName}
            required
          />
          <TextBox
            label="Weightage / Payment Release % *"
            placeholder={`e.g. 15 (Max capacity remaining: ${100 - totalWeightage}%)`}
            value={mWeight}
            onChange={setMWeight}
            required
          />
        </FormGrid>

        <FormGrid columns={3}>
          <DatePicker
            label="Planned Start Date"
            value={mStart ? new Date(mStart) : undefined}
            onChange={v => setMStart(v ? v.toISOString().split('T')[0] : '')}
          />
          <DatePicker
            label="Planned End Date"
            value={mEnd ? new Date(mEnd) : undefined}
            onChange={v => setMEnd(v ? v.toISOString().split('T')[0] : '')}
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
