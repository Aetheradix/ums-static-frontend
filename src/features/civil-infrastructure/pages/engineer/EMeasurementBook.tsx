import { useCallback, useEffect, useState } from 'react';
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
import { CIVIL_STORAGE_KEYS, civilStorage } from '../../civilStorage';
import {
  type CivilWork,
  type MBEntry,
  type RABill,
  boqItems,
  civilWorks,
  mbEntries as initialData,
  milestones as initialMilestones,
  raBills,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const MB_STATUS_VARIANT: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  'Approved by EE': 'approved',
  'Verified by AE': 'pending',
  Submitted: 'neutral',
  Rejected: 'rejected',
  Draft: 'neutral',
};

const WORK_STATUS_VARIANT: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral' | 'info'
> = {
  'In Progress': 'pending',
  'Work Order Issued': 'info',
  'DLP Active': 'approved',
  Completed: 'approved',
  Closed: 'neutral',
  Registered: 'neutral',
};

let mbCounter = initialData.length + 1;
const nextMBNo = () =>
  `MB-${new Date().getFullYear()}-${String(mbCounter++).padStart(3, '0')}`;

export default function EMeasurementBook() {
  const [civilWorksList] = useState<CivilWork[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const WORK_OPTIONS = civilWorksList
    .filter(
      (w: any) => w.status === 'In Progress' || w.status === 'Work Order Issued'
    )
    .map((w: any) => ({
      name: `${w.workId || w.code} — ${w.name}`,
      value: w.id,
    }));

  const [milestones] = useState<any[]>(() => {
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

  const [data, setData] = useState<MBEntry[]>(() => {
    const saved = localStorage.getItem('civil_mb_entries');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    civilStorage.set(CIVIL_STORAGE_KEYS.MB_ENTRIES, data);
  }, [data]);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('civil_mb_entries');
      if (saved) {
        setData(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Popup & View States
  const [selectedWork, setSelectedWork] = useState<CivilWork | null>(null);
  const [isProjectMBOpen, setIsProjectMBOpen] = useState(false);
  const [isCreateMBOpen, setIsCreateMBOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<MBEntry | null>(null);
  const [approvingEntry, setApprovingEntry] = useState<MBEntry | null>(null);
  const [isGenerateRABillOpen, setIsGenerateRABillOpen] = useState(false);
  const [raBillWork, setRaBillWork] = useState<CivilWork | null>(null);
  const [selectedApprovedMBIds, setSelectedApprovedMBIds] = useState<string[]>(
    []
  );
  const [raBillRemarks, setRaBillRemarks] = useState('');

  // Form state for new MB
  const [selectedWorkId, setSelectedWorkId] = useState('');
  const [selectedBOQItemId, setSelectedBOQItemId] = useState('');
  const [executedQty, setExecutedQty] = useState('');
  const [geoLat, setGeoLat] = useState('23.1815');
  const [geoLon, setGeoLon] = useState('77.4200');
  const [mbRemarks, setMbRemarks] = useState('');
  const [advAdjust, setAdvAdjust] = useState('');
  const [sdDeduct, setSdDeduct] = useState('');

  const getWorkMBEntries = useCallback(
    (work: CivilWork | null) => {
      if (!work) return [];
      return data.filter(
        m =>
          String(m.workId) === String(work.id) ||
          String(m.workId) === String(work.workId) ||
          (m.workName && m.workName.toLowerCase() === work.name.toLowerCase())
      );
    },
    [data]
  );

  const openProjectMBModal = (work: CivilWork) => {
    setSelectedWork(work);
    setIsProjectMBOpen(true);
  };

  const openCreateForWork = (work?: CivilWork | null) => {
    const targetWork = work || selectedWork || civilWorksList[0];
    if (targetWork) {
      setSelectedWork(targetWork);
      setSelectedWorkId(String(targetWork.id));
    } else {
      setSelectedWorkId('');
    }
    setSelectedBOQItemId('');
    setExecutedQty('');
    setMbRemarks('');
    setAdvAdjust('');
    setSdDeduct('');
    setGeoLat('23.1815');
    setGeoLon('77.4200');
    setIsCreateMBOpen(true);
  };

  const closeCreate = () => {
    setIsCreateMBOpen(false);
    setSelectedBOQItemId('');
    setExecutedQty('');
    setMbRemarks('');
  };

  // ── RULE ENGINE ───────────────────────────────────────────────────────────
  const getAvailableBOQItems = (workId: string) => {
    const storedBOQ = civilStorage.get<typeof boqItems>(
      CIVIL_STORAGE_KEYS.BOQ_ITEMS,
      boqItems
    );
    const workObj = civilWorksList.find(
      w =>
        String(w.id) === String(workId) || String(w.workId) === String(workId)
    );
    return storedBOQ.filter(
      b =>
        String(b.workId) === String(workId) ||
        (workObj && String(b.workId) === String(workObj.id))
    );
  };

  const getSelectedBOQ = () => {
    const storedBOQ = civilStorage.get<typeof boqItems>(
      CIVIL_STORAGE_KEYS.BOQ_ITEMS,
      boqItems
    );
    return storedBOQ.find(b => b.id === selectedBOQItemId);
  };

  const getPrevCumulative = (boqItemId: string) =>
    data
      .filter(m => m.boqItemId === boqItemId && m.status !== 'Rejected')
      .reduce((s, m) => s + m.executedQty, 0);

  const boqItem = getSelectedBOQ();
  const prevCum = selectedBOQItemId ? getPrevCumulative(selectedBOQItemId) : 0;
  const enteredQty = Number(executedQty) || 0;
  const newCumulative = prevCum + enteredQty;
  const boqMaxQty = boqItem?.approvedQty ?? 0;

  // Rule 1: No BOQ item selected = bill blocked
  const rule1Pass = !!selectedBOQItemId;
  // Rule 2: MB Qty ≤ BOQ Qty
  const rule2Pass = enteredQty > 0 && newCumulative <= boqMaxQty;
  // Rule 3: MB must be linked to SOR item
  const rule3Pass = !!selectedBOQItemId;
  // Rule 4: Cumulative check
  const rule4Pass = newCumulative <= boqMaxQty;

  const billAmount = enteredQty * (boqItem?.govtRate ?? 0);
  const advAmount = Number(advAdjust) || Math.round(billAmount * 0.1);
  const sdAmount = Number(sdDeduct) || Math.round(billAmount * 0.05);
  const netPayable = billAmount - advAmount - sdAmount;

  const handleSaveMB = () => {
    if (!rule1Pass) {
      ToastService.error(
        'Rule 1 Violated: No BOQ item selected. MB cannot be saved without a BOQ-linked item.'
      );
      return;
    }
    if (!rule2Pass || !rule4Pass) {
      ToastService.error(
        `Rule 2/4 Violated: Cumulative quantity (${newCumulative} ${boqItem?.unit}) exceeds BOQ cap (${boqMaxQty} ${boqItem?.unit}). Entry rejected.`
      );
      return;
    }
    if (enteredQty <= 0) {
      ToastService.error('Executed quantity must be greater than zero.');
      return;
    }
    if (!geoLat || !geoLon) {
      ToastService.error(
        'Geo-tagged location (latitude & longitude) is mandatory for MB entry.'
      );
      return;
    }

    const work = civilWorksList.find(
      w =>
        String(w.id) === String(selectedWorkId) ||
        String(w.workId) === String(selectedWorkId)
    );
    const newEntry: MBEntry = {
      id: String(Date.now()),
      mbNo: nextMBNo(),
      workId: selectedWorkId,
      workName: work?.name ?? selectedWork?.name ?? '',
      boqItemId: selectedBOQItemId,
      sorCode: boqItem?.sorCode ?? '',
      description: boqItem?.description ?? '',
      unit: boqItem?.unit ?? '',
      govtRate: boqItem?.govtRate ?? 0,
      boqQty: boqMaxQty,
      prevBilledQty: prevCum,
      executedQty: enteredQty,
      cumulativeQty: newCumulative,
      balanceQty: boqMaxQty - newCumulative,
      billAmount,
      geoLatitude: geoLat,
      geoLongitude: geoLon,
      geoTimestamp: new Date().toLocaleString('en-IN'),
      engineerName: 'Er. Rajesh Verma (Logged In)',
      deviceInfo: 'Chrome Browser / Web Portal',
      status: 'Submitted',
      advanceAdjusted: advAmount,
      securityDeposit: sdAmount,
      netPayable,
      remarks: mbRemarks,
      milestoneId: boqItem?.milestoneId,
    };

    setData(prev => [newEntry, ...prev]);
    window.dispatchEvent(new Event('storage'));
    ToastService.success(
      'MB Entry submitted successfully. Forwarded to AE for verification.'
    );
    closeCreate();
  };

  const handleApprove = (item: MBEntry) => {
    setData(prev =>
      prev.map(m =>
        m.id === item.id ? { ...m, status: 'Approved by EE' as any } : m
      )
    );
    ToastService.success('MB Approved by EE. RA Bill generation now unlocked.');
    setApprovingEntry(null);
  };

  const openGenerateRABillModal = (work?: CivilWork | null) => {
    const targetWork = work || selectedWork || civilWorksList[0];
    if (!targetWork) return;
    setRaBillWork(targetWork);
    const approved = data.filter(
      m =>
        (String(m.workId) === String(targetWork.id) ||
          String(m.workId) === String(targetWork.workId) ||
          (m.workName &&
            m.workName.toLowerCase() === targetWork.name.toLowerCase())) &&
        (m.status === 'Approved by EE' || m.status === 'Verified by AE')
    );
    setSelectedApprovedMBIds(approved.map(m => m.id));
    setRaBillRemarks('');
    setIsGenerateRABillOpen(true);
  };

  const handleCreateRABill = () => {
    if (!raBillWork) return;
    if (selectedApprovedMBIds.length === 0) {
      ToastService.error(
        'Please select at least one approved MB entry to generate RA Bill.'
      );
      return;
    }

    const selectedEntries = data.filter(m =>
      selectedApprovedMBIds.includes(m.id)
    );
    const gross = selectedEntries.reduce((s, m) => s + (m.billAmount || 0), 0);
    const advDeduct = Math.round(gross * 0.1);
    const sdDeduct = Math.round(gross * 0.05);

    const savedBills = localStorage.getItem('civil_ra_bills');
    const existingBills: RABill[] = savedBills
      ? JSON.parse(savedBills)
      : raBills;
    const billSeq = existingBills.length + 1;
    const nextBillNo = `RA-${new Date().getFullYear()}-${String(billSeq).padStart(3, '0')}`;

    const newBill: RABill = {
      id: String(Date.now()),
      billNo: nextBillNo,
      raNo: `RA-${billSeq}`,
      workId: String(raBillWork.id),
      workName: raBillWork.name,
      contractorId: (raBillWork as any).contractorId || 'CONT-01',
      contractorName:
        (raBillWork as any).contractorName || 'M/s Apex Infrastructure Ltd.',
      billDate: new Date().toISOString().split('T')[0],
      grossAmount: gross,
      advanceRecovery: advDeduct,
      securityDeposit: sdDeduct,
      itTdsRate: 2,
      gstTdsRate: 2,
      labourCessRate: 1,
      otherDeductions: 0,
      netPayable: gross - advDeduct - sdDeduct,
      cumulativePaid: 0,
      status: 'Submitted',
      linkedMBs: selectedApprovedMBIds,
      remarks:
        raBillRemarks ||
        `Auto-generated from verified MB entries (${selectedEntries.map(m => m.mbNo).join(', ')})`,
    };

    const updatedBills = [newBill, ...existingBills];
    civilStorage.set(CIVIL_STORAGE_KEYS.RA_BILLS, updatedBills);

    ToastService.success(
      `RA Bill ${nextBillNo} for ₹${(gross / 100000).toFixed(2)}L created & submitted to Finance for statutory deductions!`
    );
    setIsGenerateRABillOpen(false);
  };

  const currentProjectEntries = getWorkMBEntries(selectedWork);
  const currentProjectGross = currentProjectEntries.reduce(
    (s, m) => s + (m.billAmount || 0),
    0
  );
  const currentProjectNet = currentProjectEntries.reduce(
    (s, m) => s + (m.netPayable || 0),
    0
  );

  const pendingEntries = data.filter(
    m => m.status === 'Submitted' || m.status === 'Verified by AE'
  );

  return (
    <FormPage
      title="E-Measurement Book (E-MB)"
      description="Single source of truth for physical measurements and financial claims, organized project-wise with ERP-enforced 4-rule integrity."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Engineer Portal', to: civilUrls.engineerMenu },
        { label: 'E-Measurement Book' },
      ]}
    >
      {/* SOR → BOQ → MB Chain */}
      <div className="civil-chain">
        <span className="civil-chain-item">SOR Master</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">BOQ Compilation</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">
          E-MB (Project Book) ← You are here
        </span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">RA Bill Generation</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Finance Payment</span>
      </div>

      {/* 4 Rule Engine Cards */}
      <div className="civil-mb-rules">
        <div className="civil-mb-rule-card rule-ok">
          <div className="civil-mb-rule-title" style={{ color: '#166534' }}>
            Rule 1: No MB = No Bill
          </div>
          <div className="civil-mb-rule-desc">
            A bill cannot be raised unless a Measurement Book entry exists and
            is engineer-verified. Linking physical progress directly to
            financial releases.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-warn">
          <div className="civil-mb-rule-title" style={{ color: '#9a3412' }}>
            Rule 2: MB Qty ≤ BOQ Qty
          </div>
          <div className="civil-mb-rule-desc">
            The quantity entered against any SOR item can never exceed the
            sanctioned BOQ quantity cap. Auto-validated during recording.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-ok">
          <div className="civil-mb-rule-title" style={{ color: '#166534' }}>
            Rule 3: MB Must Link to SOR Item
          </div>
          <div className="civil-mb-rule-desc">
            Every MB line item must be selected from the sanctioned BOQ item
            master. Free-text/custom ad-hoc items are strictly blocked by the
            system.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-warn">
          <div className="civil-mb-rule-title" style={{ color: '#9a3412' }}>
            Rule 4: Cumulative MB Check
          </div>
          <div className="civil-mb-rule-desc">
            Cumulative measurement across all previous RA bills is tracked.
            Running total exceeding the sanctioned ceiling is immediately
            rejected.
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            title: `Civil Works & Projects (${civilWorksList.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={civilWorksList}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '50px',
                    },
                    {
                      field: 'workId',
                      header: 'Work Code',
                      cell: (w: CivilWork) => (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#1d4ed8',
                          }}
                        >
                          {w.workId || w.code || `CW-${w.id}`}
                        </span>
                      ),
                      width: '130px',
                    },
                    {
                      field: 'name',
                      header: 'Project / Work Name',
                      cell: (w: CivilWork) => (
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {w.name}
                          </span>
                          <span
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            {w.campus || 'Main Campus'} •{' '}
                            {w.location || 'Site Area'}
                          </span>
                        </div>
                      ),
                      width: '280px',
                    },
                    {
                      field: 'category',
                      header: 'Work Category',
                      cell: (w: CivilWork) => (
                        <span
                          style={{ fontSize: '0.8125rem', color: '#334155' }}
                        >
                          {w.category || 'New Capital Construction'}
                        </span>
                      ),
                      width: '180px',
                    },
                    {
                      field: 'workBasis',
                      header: 'Work Basis',
                      cell: (w: CivilWork) => (
                        <span
                          className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                          style={{ fontSize: '0.6875rem' }}
                        >
                          {w.workBasis || 'SOR Based'}
                        </span>
                      ),
                      width: '110px',
                    },
                    {
                      field: 'estimatedCost',
                      header: 'Sanctioned Cost',
                      cell: (w: CivilWork) => (
                        <span style={{ fontWeight: 600 }}>
                          ₹
                          {(
                            (w.estimatedCost || w.aaAmount || 0) / 10000000
                          ).toFixed(2)}{' '}
                          Cr
                        </span>
                      ),
                      width: '130px',
                    },
                    {
                      field: 'id',
                      header: 'MB Entries',
                      cell: (w: CivilWork) => {
                        const entries = getWorkMBEntries(w);
                        return (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background:
                                entries.length > 0 ? '#eff6ff' : '#f1f5f9',
                              color: entries.length > 0 ? '#1d4ed8' : '#64748b',
                            }}
                          >
                            📖 {entries.length} Entries
                          </span>
                        );
                      },
                      width: '120px',
                    },
                    {
                      field: 'id',
                      header: 'Measured Value',
                      cell: (w: CivilWork) => {
                        const entries = getWorkMBEntries(w);
                        const gross = entries.reduce(
                          (s, m) => s + (m.billAmount || 0),
                          0
                        );
                        return (
                          <span
                            style={{
                              fontWeight: 700,
                              color: gross > 0 ? '#16a34a' : '#64748b',
                            }}
                          >
                            {gross > 0
                              ? `₹${(gross / 100000).toFixed(2)}L`
                              : '—'}
                          </span>
                        );
                      },
                      width: '130px',
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      cell: (w: CivilWork) => (
                        <StatusBadge
                          label={w.status}
                          variant={WORK_STATUS_VARIANT[w.status] ?? 'neutral'}
                        />
                      ),
                      width: '140px',
                    },
                    {
                      field: 'id',
                      header: 'Actions',
                      sortable: false,
                      cell: (w: CivilWork) => {
                        const entries = getWorkMBEntries(w);
                        const hasApproved = entries.some(
                          m => m.status === 'Approved by EE'
                        );
                        return (
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <Button
                              label="Open E-MB"
                              icon="book"
                              variant="primary"
                              size="small"
                              onClick={() => openProjectMBModal(w)}
                            />
                            {hasApproved && (
                              <Button
                                label="RA Bill"
                                icon="receipt"
                                variant="outlined"
                                size="small"
                                onClick={() => openGenerateRABillModal(w)}
                              />
                            )}
                          </div>
                        );
                      },
                      width: '180px',
                    },
                  ]}
                  searchBox
                  searchPlaceholder="Search projects by code, name, category..."
                />
              </FormCard>
            ),
          },
          {
            title: `Pending Approvals (${pendingEntries.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={pendingEntries}
                  columns={[
                    {
                      field: 'mbNo',
                      header: 'MB No',
                      cell: (m: MBEntry) => (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#1d4ed8',
                          }}
                        >
                          {m.mbNo}
                        </span>
                      ),
                    },
                    { field: 'workName', header: 'Project / Work' },
                    { field: 'description', header: 'Measured SOR Item' },
                    {
                      field: 'executedQty',
                      header: 'Executed Qty',
                      cell: (m: MBEntry) => (
                        <span style={{ fontWeight: 600 }}>
                          {m.executedQty} {m.unit}
                        </span>
                      ),
                    },
                    {
                      field: 'netPayable',
                      header: 'Net Payable',
                      cell: (m: MBEntry) => (
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>
                          ₹{(m.netPayable / 100000).toFixed(2)}L
                        </span>
                      ),
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      cell: (m: MBEntry) => (
                        <StatusBadge label={m.status} variant="pending" />
                      ),
                    },
                    {
                      field: 'id',
                      header: 'Action',
                      sortable: false,
                      cell: (item: MBEntry) => (
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <Button
                            size="small"
                            icon="eye"
                            variant="outlined"
                            onClick={() => setViewingEntry(item)}
                          />
                          <Button
                            size="small"
                            label="Approve (EE)"
                            icon="check"
                            variant="primary"
                            onClick={() => setApprovingEntry(item)}
                          />
                        </div>
                      ),
                    },
                  ]}
                  searchBox
                  searchPlaceholder="Search pending MB entries..."
                />
              </FormCard>
            ),
          },
        ]}
      />

      {/* ── PROJECT-SPECIFIC MB POPUP MODAL ────────────────────────────────────── */}
      <FormPopup
        visible={isProjectMBOpen && !!selectedWork}
        onHide={() => setIsProjectMBOpen(false)}
        title={
          selectedWork
            ? `E-Measurement Book — ${selectedWork.workId || selectedWork.code || `CW-${selectedWork.id}`} : ${selectedWork.name}`
            : 'E-Measurement Book'
        }
        subtitle="Measurement entries, cumulative quantities, and billing records for this project."
        size="xl"
      >
        {selectedWork && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Project Summary Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                padding: '1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Sanctioned Cost
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#1e293b',
                  }}
                >
                  ₹
                  {(
                    (selectedWork.estimatedCost || selectedWork.aaAmount || 0) /
                    10000000
                  ).toFixed(2)}{' '}
                  Cr
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Recorded Entries
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#1d4ed8',
                  }}
                >
                  {currentProjectEntries.length} MB Records
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Total Measured Value
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#16a34a',
                  }}
                >
                  ₹{(currentProjectGross / 100000).toFixed(2)}L
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Net Claimed Amount
                </div>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0f766e',
                  }}
                >
                  ₹{(currentProjectNet / 100000).toFixed(2)}L
                </div>
              </div>
            </div>

            {/* Grid of MB Entries for This Project */}
            <FormCard>
              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#1e293b',
                  }}
                >
                  Measurement Entries ({currentProjectEntries.length})
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: '#64748b',
                  }}
                >
                  {
                    currentProjectEntries.filter(
                      m => m.status === 'Approved by EE'
                    ).length
                  }{' '}
                  entries approved by EE ready for RA Bill
                </span>
              </div>
              <GridPanel
                data={currentProjectEntries}
                columns={[
                  {
                    cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                    width: '45px',
                  },
                  {
                    field: 'mbNo',
                    header: 'MB No',
                    cell: (m: MBEntry) => (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#1d4ed8',
                        }}
                      >
                        {m.mbNo}
                      </span>
                    ),
                    width: '120px',
                  },
                  {
                    field: 'sorCode',
                    header: 'SOR Code',
                    cell: (m: MBEntry) => (
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {m.sorCode}
                      </span>
                    ),
                    width: '110px',
                  },
                  {
                    field: 'description',
                    header: 'Description',
                    cell: (m: MBEntry) => (
                      <span style={{ fontSize: '0.8rem', color: '#334155' }}>
                        {m.description}
                      </span>
                    ),
                    width: '240px',
                  },
                  {
                    field: 'boqQty',
                    header: 'BOQ Cap',
                    cell: (m: MBEntry) => (
                      <span>
                        {m.boqQty} {m.unit}
                      </span>
                    ),
                    width: '100px',
                  },
                  {
                    field: 'prevBilledQty',
                    header: 'Prev Billed',
                    cell: (m: MBEntry) => (
                      <span>
                        {m.prevBilledQty} {m.unit}
                      </span>
                    ),
                    width: '100px',
                  },
                  {
                    field: 'executedQty',
                    header: 'This MB Qty',
                    cell: (m: MBEntry) => (
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>
                        {m.executedQty} {m.unit}
                      </span>
                    ),
                    width: '110px',
                  },
                  {
                    field: 'cumulativeQty',
                    header: 'Cumulative',
                    cell: (m: MBEntry) => {
                      const exceeded = m.cumulativeQty > m.boqQty;
                      return (
                        <span
                          style={{
                            fontWeight: 700,
                            color: exceeded ? '#dc2626' : '#16a34a',
                          }}
                        >
                          {m.cumulativeQty} {m.unit} {exceeded ? '⚠' : ''}
                        </span>
                      );
                    },
                    width: '110px',
                  },
                  {
                    field: 'billAmount',
                    header: 'Gross Bill',
                    cell: (m: MBEntry) => (
                      <span>₹{(m.billAmount / 100000).toFixed(2)}L</span>
                    ),
                    width: '100px',
                  },
                  {
                    field: 'advanceAdjusted',
                    header: 'Adv. Adj.',
                    cell: (m: MBEntry) => (
                      <span style={{ color: '#d97706', fontSize: '0.75rem' }}>
                        -₹{(m.advanceAdjusted / 1000).toFixed(0)}K
                      </span>
                    ),
                    width: '90px',
                  },
                  {
                    field: 'securityDeposit',
                    header: 'SD',
                    cell: (m: MBEntry) => (
                      <span style={{ color: '#7c3aed', fontSize: '0.75rem' }}>
                        -₹{(m.securityDeposit / 1000).toFixed(0)}K
                      </span>
                    ),
                    width: '80px',
                  },
                  {
                    field: 'netPayable',
                    header: 'Net Payable',
                    cell: (m: MBEntry) => (
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>
                        ₹{(m.netPayable / 100000).toFixed(2)}L
                      </span>
                    ),
                    width: '110px',
                  },
                  {
                    field: 'status',
                    header: 'Status',
                    cell: (m: MBEntry) => (
                      <StatusBadge
                        label={m.status}
                        variant={MB_STATUS_VARIANT[m.status] ?? 'neutral'}
                      />
                    ),
                    width: '130px',
                  },
                  {
                    field: 'id',
                    header: 'Actions',
                    sortable: false,
                    cell: (item: MBEntry) => (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <Button
                          size="small"
                          icon="eye"
                          variant="outlined"
                          title="View Details"
                          onClick={() => setViewingEntry(item)}
                        />
                        {item.status === 'Verified by AE' && (
                          <Button
                            size="small"
                            label="Approve"
                            icon="check"
                            variant="primary"
                            onClick={() => setApprovingEntry(item)}
                          />
                        )}
                      </div>
                    ),
                    width: '100px',
                  },
                ]}
                toolbar={
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      label="Add New MB Entry"
                      icon="plus"
                      variant="primary"
                      onClick={() => openCreateForWork(selectedWork)}
                    />
                    <Button
                      label="Generate RA Bill"
                      icon="receipt"
                      variant="success"
                      disabled={
                        currentProjectEntries.filter(
                          m => m.status === 'Approved by EE'
                        ).length === 0
                      }
                      onClick={() => openGenerateRABillModal(selectedWork)}
                    />
                  </div>
                }
                searchBox
                searchPlaceholder="Search MB entries by number, item, description..."
              />
            </FormCard>

            <div className="flex justify-end mt-2">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setIsProjectMBOpen(false)}
              />
            </div>
          </div>
        )}
      </FormPopup>

      {/* ── CREATE NEW MB ENTRY POPUP ──────────────────────────────────────── */}
      <FormPopup
        visible={isCreateMBOpen}
        onHide={closeCreate}
        title={
          selectedWork
            ? `New E-MB Entry — ${selectedWork.workId || selectedWork.code} (${selectedWork.name})`
            : 'New E-MB Entry'
        }
        subtitle="All 4 ERP business rules are verified in real-time before saving measurement book claims."
        size="lg"
      >
        {/* Live Rule Status */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {[
            { rule: 'Rule 1: BOQ Linked', pass: rule1Pass },
            { rule: 'Rule 2: Qty ≤ BOQ', pass: rule2Pass },
            { rule: 'Rule 3: SOR Item', pass: rule3Pass },
            { rule: 'Rule 4: Cumulative', pass: rule4Pass },
          ].map(r => (
            <div
              key={r.rule}
              style={{
                textAlign: 'center',
                padding: '0.5rem',
                borderRadius: '0.625rem',
                background: r.pass
                  ? '#f0fdf4'
                  : executedQty
                    ? '#fee2e2'
                    : '#f9fafb',
                border: `1px solid ${r.pass ? '#86efac' : executedQty ? '#fca5a5' : '#e5e7eb'}`,
              }}
            >
              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                {r.pass ? '✅' : executedQty ? '❌' : '⬜'}
              </div>
              <div
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: r.pass ? '#15803d' : '#6b7280',
                }}
              >
                {r.rule}
              </div>
            </div>
          ))}
        </div>

        <FormGrid columns={2}>
          <DropDownList
            label="Selected Civil Work"
            data={WORK_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={selectedWorkId}
            onChange={v => {
              setSelectedWorkId(v as string);
              setSelectedBOQItemId('');
              setExecutedQty('');
            }}
            required
          />
          <DropDownList
            label="BOQ Item (SOR-linked)"
            data={getAvailableBOQItems(selectedWorkId).map(b => {
              const matchedMilestone = milestones.find(
                (m: any) => m.id === b.milestoneId
              );
              const milestoneLabel = matchedMilestone
                ? `${matchedMilestone.milestoneName} (Milestone ${matchedMilestone.sequenceNo}) — ${b.sorCode}`
                : `No Milestone — ${b.sorCode}`;
              return {
                name: milestoneLabel,
                value: b.id,
              };
            })}
            textField={'name' as any}
            optionValue="value"
            value={selectedBOQItemId}
            onChange={v => {
              setSelectedBOQItemId(v as string);
              setExecutedQty('');
            }}
            required
          />
        </FormGrid>

        {boqItem &&
          (() => {
            const matchedMilestone = milestones.find(
              (m: any) => m.id === boqItem.milestoneId
            );
            if (!matchedMilestone) return null;

            const isQualityPassed =
              matchedMilestone.qualityTestStatus === 'Pass';

            return (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.875rem 1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  📍 Linked Milestone: {matchedMilestone.milestoneName}{' '}
                  (Milestone {matchedMilestone.sequenceNo})
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem 1.5rem',
                    color: '#475569',
                  }}
                >
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        color: '#64748b',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      Scope of Work
                    </strong>
                    <span>{matchedMilestone.description || '—'}</span>
                  </div>
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        color: '#64748b',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      Timeline (Start – End)
                    </strong>
                    <span>
                      📅 {matchedMilestone.plannedStartDate} to{' '}
                      {matchedMilestone.plannedEndDate}
                    </span>
                  </div>
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        color: '#64748b',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      Quality Test Gate (TPI) Required?
                    </strong>
                    <span
                      style={{
                        fontWeight: 600,
                        color: matchedMilestone.qualityTestRequired
                          ? '#b45309'
                          : '#475569',
                      }}
                    >
                      {matchedMilestone.qualityTestRequired
                        ? 'Yes (Mandatory Clearance)'
                        : 'No'}
                    </span>
                  </div>
                  {matchedMilestone.qualityTestRequired && (
                    <div>
                      <strong
                        style={{
                          display: 'block',
                          color: '#64748b',
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          marginBottom: '2px',
                        }}
                      >
                        Quality Test Status
                      </strong>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginTop: '2px',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: isQualityPassed ? '#dcfce7' : '#fee2e2',
                            color: isQualityPassed ? '#15803d' : '#ef4444',
                          }}
                        >
                          {isQualityPassed
                            ? '✓ Passed / Cleared'
                            : '✗ Pending / Failed'}
                        </span>
                        {matchedMilestone.testName && (
                          <span
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            ({matchedMilestone.testName})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        {/* Quantity Validator */}
        {boqItem && (
          <div className="civil-qty-row">
            <div className="civil-qty-box">
              <label>BOQ Qty (Cap)</label>
              <div className="civil-qty-val">
                {boqMaxQty} {boqItem.unit}
              </div>
            </div>
            <div className="civil-qty-box">
              <label>Previously Billed</label>
              <div className="civil-qty-val">
                {prevCum} {boqItem.unit}
              </div>
            </div>
            <div className="civil-qty-box">
              <label>Balance Available</label>
              <div className="civil-qty-val">
                {boqMaxQty - prevCum} {boqItem.unit}
              </div>
            </div>
            <div
              className={`civil-qty-box ${!rule4Pass && enteredQty > 0 ? 'exceeded' : ''}`}
            >
              <label>This Entry (Cumulative)</label>
              <div className="civil-qty-val">
                {enteredQty || 0} ({newCumulative}) {boqItem.unit}
              </div>
            </div>
          </div>
        )}

        {!rule4Pass && enteredQty > 0 && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '0.75rem',
              padding: '0.875rem 1rem',
              fontSize: '0.8125rem',
              color: '#991b1b',
              marginBottom: '0.75rem',
            }}
          >
            <strong>❌ Rule 4 Violation:</strong> Cumulative quantity (
            {newCumulative} {boqItem?.unit}) exceeds BOQ cap ({boqMaxQty}{' '}
            {boqItem?.unit}). This entry will be blocked by the system.
          </div>
        )}

        <FormGrid columns={3}>
          <TextBox
            label={`Executed Quantity (${boqItem?.unit ?? 'Unit'})`}
            placeholder={`Max available: ${boqMaxQty - prevCum}`}
            value={executedQty}
            onChange={setExecutedQty}
            required
          />
          <TextBox
            label="Rate (₹)"
            value={
              boqItem
                ? `₹${(boqItem.rate ?? boqItem.govtRate ?? 0).toLocaleString('en-IN')}`
                : '—'
            }
            onChange={() => {}}
            disabled
          />
          <TextBox
            label="Bill Amount (₹)"
            value={
              billAmount > 0 ? `₹${billAmount.toLocaleString('en-IN')}` : '—'
            }
            onChange={() => {}}
            disabled
          />
        </FormGrid>

        <FormGrid columns={3}>
          <TextBox
            label="Advance Adjusted (₹)"
            placeholder="Auto: 10% of bill"
            value={String(advAmount || '')}
            onChange={setAdvAdjust}
          />
          <TextBox
            label="Security Deposit Deducted (₹)"
            placeholder="Auto: 5% of bill"
            value={String(sdAmount || '')}
            onChange={setSdDeduct}
          />
          <TextBox
            label="Net Payable (₹)"
            value={
              netPayable > 0 ? `₹${netPayable.toLocaleString('en-IN')}` : '—'
            }
            onChange={() => {}}
            disabled
          />
        </FormGrid>

        {/* Geo-tagging */}
        <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
          <FormCard
            title="🌍 Geo-tagged Inspection Details (Mandatory)"
            subtitle="Location authenticity enforcement"
          >
            <FormGrid columns={2}>
              <TextBox
                label="GPS Latitude"
                placeholder="e.g. 23.1815"
                value={geoLat}
                onChange={setGeoLat}
                required
              />
              <TextBox
                label="GPS Longitude"
                placeholder="e.g. 77.4200"
                value={geoLon}
                onChange={setGeoLon}
                required
              />
            </FormGrid>
            <div
              style={{
                background: '#f0f9ff',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.875rem',
                fontSize: '0.75rem',
                color: '#0c4a6e',
                marginTop: '0.5rem',
              }}
            >
              <strong>Auto-captured:</strong> Date & Time:{' '}
              {new Date().toLocaleString('en-IN')} | Device: Chrome Web Portal |
              Engineer: Er. Rajesh Verma (Logged In)
            </div>
          </FormCard>
        </div>

        <TextArea
          label="Measurement Remarks / Site Notes"
          placeholder="Describe what was measured, location, references to drawings..."
          value={mbRemarks}
          onChange={setMbRemarks}
          rows={2}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closeCreate} />
          <Button
            label={
              !rule1Pass || !rule2Pass
                ? '❌ Blocked — Rule Violation'
                : 'Submit MB Entry'
            }
            variant={!rule1Pass || !rule2Pass ? 'danger' : 'primary'}
            icon="book"
            onClick={handleSaveMB}
          />
        </div>
      </FormPopup>

      {/* ── VIEW MB POPUP ─────────────────────────────────────────────────── */}
      <FormPopup
        visible={!!viewingEntry}
        onHide={() => setViewingEntry(null)}
        title={`MB Entry — ${viewingEntry?.mbNo ?? ''}`}
        subtitle="Measurement book record with deduction details and audit metadata."
        size="lg"
      >
        {viewingEntry && (
          <>
            {/* Chain reference */}
            <div className="civil-chain" style={{ marginBottom: '1rem' }}>
              <span className="civil-chain-item">{viewingEntry.sorCode}</span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">
                {viewingEntry.boqItemId ? 'BOQ Item' : '—'}
              </span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item active">
                {viewingEntry.mbNo}
              </span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">
                {viewingEntry.raNo ?? 'Bill Pending'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1.5rem',
                fontSize: '0.8125rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {[
                ['MB No', viewingEntry.mbNo],
                ['Work', viewingEntry.workName],
                ['SOR Code', viewingEntry.sorCode],
                ['Description', viewingEntry.description],
                ['BOQ Qty', `${viewingEntry.boqQty} ${viewingEntry.unit}`],
                [
                  'Prev. Billed',
                  `${viewingEntry.prevBilledQty} ${viewingEntry.unit}`,
                ],
                [
                  'This MB Qty',
                  `${viewingEntry.executedQty} ${viewingEntry.unit}`,
                ],
                [
                  'Cumulative',
                  `${viewingEntry.cumulativeQty} ${viewingEntry.unit}`,
                ],
                ['Balance', `${viewingEntry.balanceQty} ${viewingEntry.unit}`],
                [
                  'Govt Rate',
                  `₹${viewingEntry.govtRate?.toLocaleString('en-IN')}`,
                ],
                [
                  'Gross Bill Amount',
                  `₹${(viewingEntry.billAmount / 100000).toFixed(2)}L`,
                ],
                [
                  'Advance Adjusted',
                  `-₹${(viewingEntry.advanceAdjusted / 1000).toFixed(0)}K`,
                ],
                [
                  'Security Deposit',
                  `-₹${(viewingEntry.securityDeposit / 1000).toFixed(0)}K`,
                ],
                [
                  'Net Payable',
                  `₹${(viewingEntry.netPayable / 100000).toFixed(2)}L`,
                ],
                ['Engineer', viewingEntry.engineerName],
                ['Device', viewingEntry.deviceInfo],
                [
                  'Geo Location',
                  `${viewingEntry.geoLatitude}, ${viewingEntry.geoLongitude}`,
                ],
                ['Timestamp', viewingEntry.geoTimestamp],
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

            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setViewingEntry(null)}
              />
            </div>
          </>
        )}
      </FormPopup>

      {/* ── APPROVE MB POPUP (EE) ─────────────────────────────────────────── */}
      <FormPopup
        visible={!!approvingEntry}
        onHide={() => setApprovingEntry(null)}
        title={`Approve MB Entry — ${approvingEntry?.mbNo ?? ''}`}
        subtitle="Executive Engineer Verification & Sanction for RA Billing."
        size="md"
      >
        {approvingEntry && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                padding: '0.875rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: '#166534',
                  marginBottom: '0.25rem',
                }}
              >
                Confirmation for EE Approval
              </div>
              <div style={{ color: '#15803d' }}>
                You are approving measurement entry{' '}
                <strong>{approvingEntry.mbNo}</strong> for work{' '}
                <strong>{approvingEntry.workName}</strong> (
                {approvingEntry.description}) with a Net Payable of{' '}
                <strong>
                  ₹{(approvingEntry.netPayable / 100000).toFixed(2)}L
                </strong>
                .
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setApprovingEntry(null)}
              />
              <Button
                label="Approve MB (EE)"
                variant="primary"
                icon="check"
                onClick={() => handleApprove(approvingEntry)}
              />
            </div>
          </div>
        )}
      </FormPopup>
      {/* ── GENERATE RA BILL POPUP MODAL ────────────────────────────────────── */}
      <FormPopup
        visible={isGenerateRABillOpen && !!raBillWork}
        onHide={() => setIsGenerateRABillOpen(false)}
        title={
          raBillWork
            ? `Generate Running Account (RA) Bill — ${raBillWork.code || raBillWork.workId || `CW-${raBillWork.id}`}`
            : 'Generate RA Bill'
        }
        subtitle="Forward engineer-certified measurements to Finance Department for statutory TDS, GST, and Labour Cess audit."
        size="lg"
      >
        {raBillWork &&
          (() => {
            const eligibleEntries = data.filter(
              m =>
                (String(m.workId) === String(raBillWork.id) ||
                  String(m.workId) === String(raBillWork.workId) ||
                  (m.workName &&
                    m.workName.toLowerCase() ===
                      raBillWork.name.toLowerCase())) &&
                (m.status === 'Approved by EE' || m.status === 'Verified by AE')
            );
            const selectedEntries = data.filter(m =>
              selectedApprovedMBIds.includes(m.id)
            );
            const totalGross = selectedEntries.reduce(
              (s, m) => s + (m.billAmount || 0),
              0
            );
            const advEst = Math.round(totalGross * 0.1);
            const sdEst = Math.round(totalGross * 0.05);
            const netEst = totalGross - advEst - sdEst;

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Summary Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.75rem',
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Project
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.9rem',
                      }}
                    >
                      {raBillWork.name}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Selected Entries
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#1d4ed8',
                        fontSize: '1.1rem',
                      }}
                    >
                      {selectedEntries.length} / {eligibleEntries.length} MBs
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Gross Claim Amount
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#16a34a',
                        fontSize: '1.1rem',
                      }}
                    >
                      ₹{(totalGross / 100000).toFixed(2)}L
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Est. Net Payable
                    </span>
                    <div
                      style={{
                        fontWeight: 700,
                        color: '#0f766e',
                        fontSize: '1.1rem',
                      }}
                    >
                      ₹{(netEst / 100000).toFixed(2)}L
                    </div>
                  </div>
                </div>

                {/* MB Selection List */}
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: '#f1f5f9',
                      padding: '0.625rem 0.875rem',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      color: '#334155',
                    }}
                  >
                    Select Certified Measurements to Include in this Bill (CPWD
                    Rule 1 Enforced)
                  </div>
                  <div
                    style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      padding: '0.5rem',
                    }}
                  >
                    {eligibleEntries.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '1.5rem',
                          color: '#64748b',
                        }}
                      >
                        No EE-approved MB entries available. Please approve
                        pending measurements first.
                      </div>
                    ) : (
                      eligibleEntries.map(entry => {
                        const isSelected = selectedApprovedMBIds.includes(
                          entry.id
                        );
                        return (
                          <div
                            key={entry.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              borderBottom: '1px solid #f1f5f9',
                              background: isSelected ? '#eff6ff' : '#fff',
                              borderRadius: '0.375rem',
                              marginBottom: '0.25rem',
                            }}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                flex: 1,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedApprovedMBIds(prev => [
                                      ...prev,
                                      entry.id,
                                    ]);
                                  } else {
                                    setSelectedApprovedMBIds(prev =>
                                      prev.filter(id => id !== entry.id)
                                    );
                                  }
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  color: '#1d4ed8',
                                }}
                              >
                                {entry.mbNo}
                              </span>
                              <span
                                style={{
                                  color: '#334155',
                                  fontSize: '0.8125rem',
                                }}
                              >
                                {entry.description} ({entry.executedQty}{' '}
                                {entry.unit})
                              </span>
                            </label>
                            <div style={{ textAlign: 'right' }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: '#16a34a',
                                  fontSize: '0.875rem',
                                }}
                              >
                                ₹{(entry.billAmount / 100000).toFixed(2)}L
                              </span>
                              <span
                                style={{
                                  display: 'block',
                                  fontSize: '0.7rem',
                                  color: '#64748b',
                                }}
                              >
                                EE Approved ✓
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Deductions Preview Note */}
                <div
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    color: '#92400e',
                  }}
                >
                  <strong>Finance Audit Handshake:</strong> Finance Department
                  will verify linked MB entries, deduct GST-TDS (2%), IT-TDS Sec
                  194C (2%), BOCW Cess (1%), and 5% Security Deposit before
                  payment release.
                </div>

                <TextArea
                  label="Bill Submission Remarks"
                  placeholder="Add bill notes, measurement reference dates, contractor invoice details..."
                  value={raBillRemarks}
                  onChange={setRaBillRemarks}
                  rows={2}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setIsGenerateRABillOpen(false)}
                  />
                  <Button
                    label={`Submit RA Bill to Finance (₹${(totalGross / 100000).toFixed(2)}L)`}
                    variant="primary"
                    icon="check"
                    disabled={selectedApprovedMBIds.length === 0}
                    onClick={handleCreateRABill}
                  />
                </div>
              </div>
            );
          })()}
      </FormPopup>
    </FormPage>
  );
}
