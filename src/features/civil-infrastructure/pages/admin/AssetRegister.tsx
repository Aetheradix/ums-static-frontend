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
  Tabs,
} from 'shared/new-components';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

export interface CivilAsset {
  id: string;
  assetCode: string;
  workId: string;
  workName: string;
  assetCategory:
    | 'Academic Building'
    | 'Residential/Hostel'
    | 'Sports Complex'
    | 'Road/Infrastructure'
    | 'Lab Facility';
  custodianDepartment: string;
  totalCost: number;
  civilStructureCost: number;
  electricalCost: number;
  plumbingCost: number;
  fittingsCost: number;
  completionCertNo: string;
  handoverDate: string;
  handoverOfficer: string;
  depreciationRate: number;
  status: 'In Service' | 'Under DLP' | 'Maintenance Due';
  remarks: string;
}

const STORAGE_KEY = 'civil_asset_register';

const INITIAL_ASSETS: CivilAsset[] = [
  {
    id: 'AST-01',
    assetCode: 'UAU-EST-2026-001',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    assetCategory: 'Residential/Hostel',
    custodianDepartment: 'Chief Warden Office / Student Welfare',
    totalCost: 118000000,
    civilStructureCost: 82600000,
    electricalCost: 17700000,
    plumbingCost: 11800000,
    fittingsCost: 5900000,
    completionCertNo: 'COMP/CW/2026/024',
    handoverDate: '2026-05-12',
    handoverOfficer: 'Er. R. K. Sharma (Executive Engineer)',
    depreciationRate: 2,
    status: 'Under DLP',
    remarks:
      'Handover deed executed. 200-bed occupancy initialized for Academic Year 2026.',
  },
  {
    id: 'AST-02',
    assetCode: 'UAU-EST-2025-014',
    workId: '4',
    workName: 'Central Instrumentation Facility Extension',
    assetCategory: 'Lab Facility',
    custodianDepartment: 'Dean, Research & Development',
    totalCost: 45000000,
    civilStructureCost: 31500000,
    electricalCost: 9000000,
    plumbingCost: 3150000,
    fittingsCost: 1350000,
    completionCertNo: 'COMP/CW/2025/089',
    handoverDate: '2025-11-20',
    handoverOfficer: 'Dr. S. K. Verma (Estate Officer)',
    depreciationRate: 2.5,
    status: 'In Service',
    remarks:
      'Cleanroom facility operational with specialized HVAC and anti-vibration flooring.',
  },
];

const ASSET_CATEGORIES = [
  'Academic Building',
  'Residential/Hostel',
  'Sports Complex',
  'Road/Infrastructure',
  'Lab Facility',
];

const DEPARTMENTS = [
  'Faculty of Science & Technology',
  'Chief Warden Office / Student Welfare',
  'Dean, Research & Development',
  'Sports Board & Physical Education',
  'Estate Section / Central Administration',
  'Health Centre & Medical Services',
];

export default function AssetRegister() {
  const [works] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [assets, setAssets] = useState<CivilAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  // Modal state
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'create';
    item?: CivilAsset;
  }>({ mode: 'closed' });

  // Form states
  const [selectedWorkId, setSelectedWorkId] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetCategory, setAssetCategory] =
    useState<CivilAsset['assetCategory']>('Academic Building');
  const [custodianDept, setCustodianDept] = useState(DEPARTMENTS[0]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [civilCost, setCivilCost] = useState<number>(0);
  const [elecCost, setElecCost] = useState<number>(0);
  const [plumbCost, setPlumbCost] = useState<number>(0);
  const [fitCost, setFitCost] = useState<number>(0);
  const [ccNo, setCcNo] = useState('');
  const [handoverDate, setHandoverDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [handoverOfficer, setHandoverOfficer] = useState(
    'Er. R. K. Sharma (Executive Engineer)'
  );
  const [deprRate, setDeprRate] = useState('2.0');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  // Format Indian Currency
  const formatCurrency = (val: number) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Eligible works for Capitalization: Completed or DLP Active
  const eligibleWorks = works.filter((w: any) => {
    const isCompleted = w.status === 'Completed' || w.status === 'DLP Active';
    const alreadyCapitalized = assets.some(
      a => a.workId === String(w.id) || a.workId === String(w.workId)
    );
    return isCompleted && !alreadyCapitalized;
  });

  const totalCapitalized = assets.reduce((s, a) => s + (a.totalCost || 0), 0);
  const dlpActiveCount = assets.filter(a => a.status === 'Under DLP').length;
  const inServiceCount = assets.filter(a => a.status === 'In Service').length;

  const openCreateModal = (work?: any) => {
    const targetWork = work || eligibleWorks[0] || works[0];
    const cost =
      targetWork?.contractAmount || targetWork?.estimatedCost || 10000000;

    setSelectedWorkId(String(targetWork?.id || ''));
    setAssetCode(
      `UAU-EST-${new Date().getFullYear()}-${String(assets.length + 1).padStart(3, '0')}`
    );
    setAssetCategory('Academic Building');
    setCustodianDept(targetWork?.department || DEPARTMENTS[0]);
    setTotalCost(cost);
    setCivilCost(Math.round(cost * 0.7));
    setElecCost(Math.round(cost * 0.15));
    setPlumbCost(Math.round(cost * 0.1));
    setFitCost(Math.round(cost * 0.05));
    setCcNo(
      `COMP/CW/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
    );
    setHandoverDate(new Date().toISOString().split('T')[0]);
    setHandoverOfficer('Er. R. K. Sharma (Executive Engineer)');
    setDeprRate('2.0');
    setRemarks(
      `Capitalized upon joint handover inspection. Handed over to ${targetWork?.department || DEPARTMENTS[0]}.`
    );
    setPopup({ mode: 'create' });
  };

  const handleSaveAsset = () => {
    if (!assetCode.trim()) {
      ToastService.error('Asset Code is mandatory.');
      return;
    }
    if (!selectedWorkId) {
      ToastService.error('Please select a civil work to capitalize.');
      return;
    }
    if (!ccNo.trim()) {
      ToastService.error(
        'Completion Certificate reference number is required.'
      );
      return;
    }

    const targetWork = works.find(
      (w: any) =>
        String(w.id) === String(selectedWorkId) ||
        String(w.workId) === String(selectedWorkId)
    );

    const newAsset: CivilAsset = {
      id: `AST-${Date.now().toString().slice(-4)}`,
      assetCode,
      workId: selectedWorkId,
      workName: targetWork?.name || 'Capitalized Infrastructure Work',
      assetCategory,
      custodianDepartment: custodianDept,
      totalCost,
      civilStructureCost: civilCost,
      electricalCost: elecCost,
      plumbingCost: plumbCost,
      fittingsCost: fitCost,
      completionCertNo: ccNo,
      handoverDate,
      handoverOfficer,
      depreciationRate: Number(deprRate) || 2,
      status: 'Under DLP',
      remarks,
    };

    setAssets(prev => [newAsset, ...prev]);
    ToastService.success(
      `Asset ${newAsset.assetCode} capitalized and recorded in University Asset Register.`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="University Civil Asset Register & Capitalization"
      description="Official institutional registry of capitalized civil infrastructure assets, structural component breakdowns, custodian department handover deeds, and depreciation tracking."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Asset Register' },
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
          label="+ Capitalize New Work"
          icon="add"
          variant="primary"
          onClick={() => openCreateModal()}
        />
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="civil-dash-grid">
        <div className="civil-dash-card">
          <div className="civil-dash-label">Total Capitalized Value</div>
          <div className="civil-dash-val" style={{ color: '#16a34a' }}>
            {formatCurrency(totalCapitalized)}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginTop: '0.25rem',
            }}
          >
            Permanent Institutional Assets
          </div>
        </div>

        <div className="civil-dash-card">
          <div className="civil-dash-label">In-Service Assets</div>
          <div className="civil-dash-val" style={{ color: '#1d4ed8' }}>
            {inServiceCount} Buildings
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginTop: '0.25rem',
            }}
          >
            Post-DLP active operational facilities
          </div>
        </div>

        <div className="civil-dash-card">
          <div className="civil-dash-label">Under DLP Warranty</div>
          <div className="civil-dash-val" style={{ color: '#d97706' }}>
            {dlpActiveCount} Assets
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginTop: '0.25rem',
            }}
          >
            Covered by Defect Liability Period
          </div>
        </div>

        <div className="civil-dash-card">
          <div className="civil-dash-label">Works Ready for Handover</div>
          <div className="civil-dash-val" style={{ color: '#7c3aed' }}>
            {eligibleWorks.length} Pending
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              marginTop: '0.25rem',
            }}
          >
            Completed projects awaiting asset code
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            title: `Capitalized Assets Ledger (${assets.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={assets}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '45px',
                    },
                    {
                      field: 'assetCode',
                      header: 'Asset Code',
                      cell: (a: CivilAsset) => (
                        <div>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#1d4ed8',
                            }}
                          >
                            {a.assetCode}
                          </span>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: '#64748b',
                            }}
                          >
                            CC: {a.completionCertNo}
                          </span>
                        </div>
                      ),
                      width: '170px',
                    },
                    {
                      field: 'workName',
                      header: 'Facility / Work Name',
                      cell: (a: CivilAsset) => (
                        <div>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {a.workName}
                          </span>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: '#0f766e',
                            }}
                          >
                            🏷️ {a.assetCategory}
                          </span>
                        </div>
                      ),
                    },
                    {
                      field: 'custodianDepartment',
                      header: 'Custodian Department',
                      cell: (a: CivilAsset) => (
                        <div>
                          <span style={{ fontWeight: 500 }}>
                            {a.custodianDepartment}
                          </span>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: '#64748b',
                            }}
                          >
                            📅 Handover: {a.handoverDate}
                          </span>
                        </div>
                      ),
                    },
                    {
                      field: 'totalCost',
                      header: 'Capitalized Cost',
                      cell: (a: CivilAsset) => (
                        <div>
                          <span style={{ fontWeight: 700, color: '#16a34a' }}>
                            {formatCurrency(a.totalCost)}
                          </span>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.7rem',
                              color: '#64748b',
                            }}
                          >
                            Civil{' '}
                            {Math.round(
                              (a.civilStructureCost / a.totalCost) * 100
                            )}
                            % | E&M{' '}
                            {Math.round(
                              ((a.electricalCost + a.plumbingCost) /
                                a.totalCost) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ),
                      width: '160px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      cell: (a: CivilAsset) => (
                        <StatusBadge
                          label={a.status}
                          variant={
                            a.status === 'In Service'
                              ? 'approved'
                              : a.status === 'Under DLP'
                                ? 'pending'
                                : 'neutral'
                          }
                        />
                      ),
                      width: '130px',
                    },
                    {
                      field: 'id',
                      header: 'Actions',
                      sortable: false,
                      cell: (a: CivilAsset) => (
                        <Button
                          label="View Breakdown"
                          size="small"
                          icon="eye"
                          variant="outlined"
                          onClick={() => setPopup({ mode: 'view', item: a })}
                        />
                      ),
                      width: '140px',
                    },
                  ]}
                  searchBox
                  searchPlaceholder="Search by asset code, facility name, department..."
                />
              </FormCard>
            ),
          },
          {
            title: `Eligible Completed Works (${eligibleWorks.length})`,
            content: (
              <FormCard>
                <div
                  style={{
                    marginBottom: '1rem',
                    color: '#64748b',
                    fontSize: '0.875rem',
                  }}
                >
                  These civil works have been physically completed and issued
                  Completion Certificates. They are ready to be capitalized into
                  institutional assets.
                </div>
                <GridPanel
                  data={eligibleWorks}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '45px',
                    },
                    {
                      field: 'code',
                      header: 'Work Code',
                      cell: (w: any) => (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: '#1d4ed8',
                          }}
                        >
                          {w.code || w.workId || `CW-${w.id}`}
                        </span>
                      ),
                      width: '130px',
                    },
                    { field: 'name', header: 'Work Description' },
                    { field: 'department', header: 'Department' },
                    {
                      field: 'estimatedCost',
                      header: 'Final Value',
                      cell: (w: any) => (
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>
                          {formatCurrency(
                            w.contractAmount || w.estimatedCost || 0
                          )}
                        </span>
                      ),
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      cell: (w: any) => (
                        <StatusBadge label={w.status} variant="approved" />
                      ),
                      width: '120px',
                    },
                    {
                      field: 'id',
                      header: 'Action',
                      sortable: false,
                      cell: (w: any) => (
                        <Button
                          label="Capitalize Asset"
                          size="small"
                          icon="add"
                          variant="primary"
                          onClick={() => openCreateModal(w)}
                        />
                      ),
                      width: '150px',
                    },
                  ]}
                />
              </FormCard>
            ),
          },
        ]}
      />

      {/* ── CAPITALIZE NEW WORK MODAL ────────────────────────────────────── */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Capitalize Work into University Asset Register"
        subtitle="Formal entry into university asset book, cost block allocation, and custodian handover."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Select Completed Work"
            value={selectedWorkId}
            data={works
              .filter(
                (w: any) =>
                  w.status === 'Completed' ||
                  w.status === 'DLP Active' ||
                  w.status === 'In Progress'
              )
              .map((w: any) => ({
                name: `${w.code || w.workId || `CW-${w.id}`} — ${w.name}`,
                value: String(w.id),
              }))}
            textField={'name' as any}
            optionValue="value"
            onChange={v => {
              const wid = String(v ?? '');
              setSelectedWorkId(wid);
              const found = works.find(
                (w: any) => String(w.id) === String(wid)
              );
              if (found) {
                const cost =
                  found.contractAmount || found.estimatedCost || 10000000;
                setTotalCost(cost);
                setCivilCost(Math.round(cost * 0.7));
                setElecCost(Math.round(cost * 0.15));
                setPlumbCost(Math.round(cost * 0.1));
                setFitCost(Math.round(cost * 0.05));
                setCustodianDept(found.department || DEPARTMENTS[0]);
              }
            }}
          />

          <TextBox
            label="Institutional Asset Code (Auto-generated)"
            value={assetCode}
            onChange={setAssetCode}
          />

          <DropDownList
            label="Asset Block Category"
            value={assetCategory}
            data={ASSET_CATEGORIES.map(c => ({ name: c, value: c }))}
            textField={'name' as any}
            optionValue="value"
            onChange={v => setAssetCategory(v as CivilAsset['assetCategory'])}
          />

          <DropDownList
            label="Custodian University Department"
            value={custodianDept}
            data={DEPARTMENTS.map(d => ({ name: d, value: d }))}
            textField={'name' as any}
            optionValue="value"
            onChange={v => setCustodianDept(String(v ?? ''))}
          />

          <TextBox
            label="Total Capitalized Value (₹)"
            value={String(totalCost)}
            onChange={v => {
              const val = Number(v) || 0;
              setTotalCost(val);
              setCivilCost(Math.round(val * 0.7));
              setElecCost(Math.round(val * 0.15));
              setPlumbCost(Math.round(val * 0.1));
              setFitCost(Math.round(val * 0.05));
            }}
          />

          <TextBox
            label="Completion Certificate (CC) Reference"
            value={ccNo}
            onChange={setCcNo}
          />
        </FormGrid>

        {/* Component Cost Breakdown Header */}
        <div
          style={{
            marginTop: '1.25rem',
            marginBottom: '0.5rem',
            fontWeight: 600,
            color: '#1e293b',
            fontSize: '0.875rem',
          }}
        >
          Asset Cost Allocation Breakdown (GFR 2017 Format)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            background: '#f8fafc',
            padding: '0.875rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Civil Structure (70%)
            </span>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>
              {formatCurrency(civilCost)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Electrical & HVAC (15%)
            </span>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>
              {formatCurrency(elecCost)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Plumbing & Sanitary (10%)
            </span>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>
              {formatCurrency(plumbCost)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Fixtures & Fittings (5%)
            </span>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>
              {formatCurrency(fitCost)}
            </div>
          </div>
        </div>

        <FormGrid columns={3}>
          <TextBox
            label="Handover Date (YYYY-MM-DD)"
            value={handoverDate}
            onChange={setHandoverDate}
          />
          <TextBox
            label="Handover Estate Officer"
            value={handoverOfficer}
            onChange={setHandoverOfficer}
          />
          <TextBox
            label="Annual Depreciation Rate (%)"
            value={deprRate}
            onChange={setDeprRate}
          />
        </FormGrid>

        <div style={{ marginTop: '0.75rem' }}>
          <TextArea
            label="Handover & Capitalization Remarks"
            value={remarks}
            onChange={setRemarks}
            rows={2}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.25rem',
          }}
        >
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setPopup({ mode: 'closed' })}
          />
          <Button
            label="Capitalize & Record Asset"
            variant="primary"
            icon="check"
            onClick={handleSaveAsset}
          />
        </div>
      </FormPopup>

      {/* ── VIEW ASSET DETAILS MODAL ────────────────────────────────────── */}
      <FormPopup
        visible={popup.mode === 'view' && !!popup.item}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Asset Details — ${popup.item?.assetCode}`}
        subtitle={popup.item?.workName}
        size="md"
      >
        {popup.item && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Asset Category:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.assetCategory}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Custodian:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.custodianDepartment}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Total Capital Cost:
                </span>
                <div style={{ fontWeight: 700, color: '#16a34a' }}>
                  {formatCurrency(popup.item.totalCost)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Depreciation:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.depreciationRate}% per annum
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  CC Reference:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.completionCertNo}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Handover Date:
                </span>
                <div style={{ fontWeight: 600 }}>{popup.item.handoverDate}</div>
              </div>
            </div>

            <div
              style={{
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
                Asset Head Component Ledger
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                    borderBottom: '1px dashed #e2e8f0',
                  }}
                >
                  <span>Civil Building Structure</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(popup.item.civilStructureCost)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                    borderBottom: '1px dashed #e2e8f0',
                  }}
                >
                  <span>Electrical & Power Substation</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(popup.item.electricalCost)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                    borderBottom: '1px dashed #e2e8f0',
                  }}
                >
                  <span>Plumbing & Water Supply</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(popup.item.plumbingCost)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                  }}
                >
                  <span>Fixed Fittings & Furniture</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(popup.item.fittingsCost)}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.8125rem',
                color: '#475569',
                background: '#f1f5f9',
                padding: '0.75rem',
                borderRadius: '0.375rem',
              }}
            >
              <strong>Remarks:</strong> {popup.item.remarks || 'No remarks.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
