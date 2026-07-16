import { useCallback, useState, useEffect } from 'react';
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
import {
  type MBEntry,
  boqItems,
  civilWorks,
  mbEntries as initialData,
  milestones as initialMilestones,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: MBEntry }
  | { mode: 'approve'; item: MBEntry };

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

let mbCounter = initialData.length + 1;
const nextMBNo = () =>
  `MB-${new Date().getFullYear()}-${String(mbCounter++).padStart(3, '0')}`;

export default function EMeasurementBook() {
  const [civilWorksList] = useState(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const WORK_OPTIONS = civilWorksList
    .filter(
      (w: any) => w.status === 'In Progress' || w.status === 'Work Order Issued'
    )
    .map((w: any) => ({ name: `${w.workId} — ${w.name}`, value: w.id }));

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
    localStorage.setItem('civil_mb_entries', JSON.stringify(data));
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

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Form state for new MB
  const [selectedWorkId, setSelectedWorkId] = useState('');
  const [selectedBOQItemId, setSelectedBOQItemId] = useState('');
  const [executedQty, setExecutedQty] = useState('');
  const [geoLat, setGeoLat] = useState('23.1815');
  const [geoLon, setGeoLon] = useState('77.4200');
  const [mbRemarks, setMbRemarks] = useState('');
  const [advAdjust, setAdvAdjust] = useState('');
  const [sdDeduct, setSdDeduct] = useState('');

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setSelectedWorkId('');
    setSelectedBOQItemId('');
    setExecutedQty('');
    setMbRemarks('');
  }, []);

  // ── RULE ENGINE ───────────────────────────────────────────────────────────
  const getAvailableBOQItems = (workId: string) =>
    boqItems.filter(b => b.workId === workId);

  const getSelectedBOQ = () => boqItems.find(b => b.id === selectedBOQItemId);

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
  const rule3Pass = !!selectedBOQItemId; // enforced by dropdown-only selection
  // Rule 4: Cumulative check
  const rule4Pass = newCumulative <= boqMaxQty;

  const billAmount = enteredQty * (boqItem?.govtRate ?? 0);
  const advAmount = Number(advAdjust) || Math.round(billAmount * 0.1);
  const sdAmount = Number(sdDeduct) || Math.round(billAmount * 0.05);
  const netPayable = billAmount - advAmount - sdAmount;

  const handleSaveMB = () => {
    // Rule 1 Gate
    if (!rule1Pass) {
      ToastService.error(
        'Rule 1 Violated: No BOQ item selected. MB cannot be saved without a BOQ-linked item.'
      );
      return;
    }
    // Rule 2 + Rule 4 Gate
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

    const work = civilWorks.find(w => w.id === selectedWorkId);
    const newEntry: MBEntry = {
      id: String(Date.now()),
      mbNo: nextMBNo(),
      workId: selectedWorkId,
      workName: work?.name ?? '',
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
    // Dispatch window storage event to notify other portals instantly
    window.dispatchEvent(new Event('storage'));
    ToastService.success(
      'MB Entry submitted successfully. Forwarded to AE for verification.'
    );
    close();
  };

  const handleApprove = (item: MBEntry) => {
    setData(prev =>
      prev.map(m =>
        m.id === item.id ? { ...m, status: 'Approved by EE' as any } : m
      )
    );
    ToastService.success('MB Approved by EE. RA Bill generation now unlocked.');
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="E-Measurement Book (E-MB)"
      description="The single source of truth for all physical and financial claims. Four ERP-enforced validation rules protect against over-measurement."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'E-Measurement Book' },
      ]}
    >
      {/* SOR → BOQ → MB Chain */}
      <div className="civil-chain">
        <span className="civil-chain-item">SOR</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">BOQ</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item active">E-MB ← You are here</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Bill</span>
        <span className="civil-chain-arrow">→</span>
        <span className="civil-chain-item">Payment</span>
      </div>

      {/* 4 Rule Engine Cards */}
      <div className="civil-mb-rules">
        <div className="civil-mb-rule-card rule-ok">
          <div className="civil-mb-rule-title" style={{ color: '#166534' }}>
            Rule 1: No MB = No Bill
          </div>
          <div className="civil-mb-rule-desc">
            A bill cannot be raised unless a Measurement Book entry exists and
            is engineer-verified. This is the foundational control linking
            physical progress to financial release.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-warn">
          <div className="civil-mb-rule-title" style={{ color: '#9a3412' }}>
            Rule 2: MB Qty ≤ BOQ Qty
          </div>
          <div className="civil-mb-rule-desc">
            The quantity entered in MB against any SOR item can never exceed the
            locked BOQ quantity. System auto-validates at MB entry point.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-ok">
          <div className="civil-mb-rule-title" style={{ color: '#166534' }}>
            Rule 3: MB Must Link to SOR Item
          </div>
          <div className="civil-mb-rule-desc">
            Every MB line entry must be selected from the BOQ which traces back
            to the SOR master. Free-text / custom items are blocked by the ERP.
            Chain: SOR → BOQ → MB is mandatory.
          </div>
        </div>
        <div className="civil-mb-rule-card rule-warn">
          <div className="civil-mb-rule-title" style={{ color: '#9a3412' }}>
            Rule 4: Cumulative MB Check
          </div>
          <div className="civil-mb-rule-desc">
            Across all RA Bills, cumulative MB quantity per BOQ item is tracked.
            The moment the running total would cross the locked BOQ cap, the
            entry is rejected — even if each individual MB looks valid.
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            title: `All MB Entries (${data.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={data}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '50px',
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
                    },
                    { field: 'workName', header: 'Work Name' },
                    {
                      field: 'workId',
                      header: 'Work Type',
                      cell: (m: MBEntry) => {
                        const wk = civilWorksList.find(
                          (w: any) =>
                            w.name === m.workName ||
                            w.id === m.workId ||
                            w.workId === m.workId
                        );
                        return (
                          <span style={{ fontSize: '0.75rem' }}>
                            {wk?.category ?? '—'}
                          </span>
                        );
                      },
                    },
                    {
                      field: 'workId',
                      header: 'Category',
                      cell: (m: MBEntry) => {
                        const wk = civilWorksList.find(
                          (w: any) =>
                            w.name === m.workName ||
                            w.id === m.workId ||
                            w.workId === m.workId
                        );
                        return (
                          <span style={{ fontSize: '0.75rem' }}>
                            {wk?.department ?? '—'}
                          </span>
                        );
                      },
                    },
                    {
                      field: 'workId',
                      header: 'Work Basis',
                      cell: (m: MBEntry) => {
                        const wk = civilWorksList.find(
                          (w: any) =>
                            w.name === m.workName ||
                            w.id === m.workId ||
                            w.workId === m.workId
                        );
                        return (
                          <span
                            className={`civil-pill ${wk?.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`}
                            style={{ fontSize: '0.65rem' }}
                          >
                            {wk?.workBasis ?? 'SOR Based'}
                          </span>
                        );
                      },
                    },
                    {
                      field: 'sorCode',
                      header: 'SOR Code',
                      cell: (m: MBEntry) => (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {m.sorCode}
                        </span>
                      ),
                    },
                    {
                      field: 'description',
                      header: 'Description',
                      cell: (m: MBEntry) => (
                        <span style={{ fontSize: '0.75rem' }}>
                          {m.description}
                        </span>
                      ),
                    },
                    {
                      field: 'boqQty',
                      header: 'BOQ Qty',
                      cell: (m: MBEntry) => (
                        <span>
                          {m.boqQty} {m.unit}
                        </span>
                      ),
                    },
                    {
                      field: 'prevBilledQty',
                      header: 'Prev. Billed',
                      cell: (m: MBEntry) => (
                        <span>
                          {m.prevBilledQty} {m.unit}
                        </span>
                      ),
                    },
                    {
                      field: 'executedQty',
                      header: 'This MB Qty',
                      cell: (m: MBEntry) => (
                        <span style={{ fontWeight: 700 }}>
                          {m.executedQty} {m.unit}
                        </span>
                      ),
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
                    },
                    {
                      field: 'billAmount',
                      header: 'Bill Amount',
                      cell: (m: MBEntry) => (
                        <span>₹{(m.billAmount / 100000).toFixed(2)}L</span>
                      ),
                    },
                    {
                      field: 'advanceAdjusted',
                      header: 'Adv. Adj.',
                      cell: (m: MBEntry) => (
                        <span style={{ color: '#d97706' }}>
                          -₹{(m.advanceAdjusted / 1000).toFixed(0)}K
                        </span>
                      ),
                    },
                    {
                      field: 'securityDeposit',
                      header: 'SD',
                      cell: (m: MBEntry) => (
                        <span style={{ color: '#7c3aed' }}>
                          -₹{(m.securityDeposit / 1000).toFixed(0)}K
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
                        <StatusBadge
                          label={m.status}
                          variant={MB_STATUS_VARIANT[m.status] ?? 'neutral'}
                        />
                      ),
                    },
                    {
                      field: 'id',
                      header: 'Actions',
                      sortable: false,
                      cell: (item: MBEntry) => (
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <Button
                            size="small"
                            label=""
                            icon="eye"
                            variant="outlined"
                            onClick={() => setPopup({ mode: 'view', item })}
                          />
                          {item.status === 'Verified by AE' && (
                            <Button
                              size="small"
                              label="Approve"
                              icon="check"
                              variant="primary"
                              onClick={() =>
                                setPopup({ mode: 'approve', item })
                              }
                            />
                          )}
                        </div>
                      ),
                    },
                  ]}
                  toolbar={
                    <Button
                      label="New MB Entry"
                      icon="plus"
                      variant="primary"
                      onClick={() => {
                        setPopup({ mode: 'create' });
                      }}
                    />
                  }
                  searchBox
                  searchPlaceholder="Search MB entries..."
                />
              </FormCard>
            ),
          },
          {
            title: `Pending Approval (${data.filter(m => m.status === 'Submitted' || m.status === 'Verified by AE').length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={data.filter(
                    m =>
                      m.status === 'Submitted' || m.status === 'Verified by AE'
                  )}
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
                    { field: 'workName', header: 'Work' },
                    { field: 'description', header: 'Item' },
                    {
                      field: 'executedQty',
                      header: 'Qty',
                      cell: (m: MBEntry) => (
                        <span>
                          {m.executedQty} {m.unit}
                        </span>
                      ),
                    },
                    {
                      field: 'netPayable',
                      header: 'Net Payable',
                      cell: (m: MBEntry) => (
                        <span style={{ fontWeight: 700 }}>
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
                        <Button
                          size="small"
                          label="Approve (EE)"
                          icon="check"
                          variant="primary"
                          onClick={() => handleApprove(item)}
                        />
                      ),
                    },
                  ]}
                />
              </FormCard>
            ),
          },
        ]}
      />

      {/* ── NEW MB ENTRY POPUP ──────────────────────────────────────────────── */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={close}
        title="New E-MB Entry"
        subtitle="All 4 ERP business rules are enforced in real-time during entry."
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
                  fontSize: '0.6rem',
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
            label="Work *"
            data={WORK_OPTIONS}
            textField={'name' as any}
            optionValue="value"
            value={selectedWorkId}
            onChange={v => {
              setSelectedWorkId(v as string);
              setSelectedBOQItemId('');
              setExecutedQty('');
            }}
          />
          <DropDownList
            label="BOQ Item (SOR-linked) * "
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
                  marginTop: '1.25rem',
                  padding: '1rem 1.25rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.875rem',
                  fontSize: '0.8125rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '0.75rem',
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
                    gap: '0.75rem 1.5rem',
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
            label={`Executed Quantity (${boqItem?.unit ?? 'Unit'}) *`}
            placeholder={`Max available: ${boqMaxQty - prevCum}`}
            value={executedQty}
            onChange={setExecutedQty}
            required
          />
          <TextBox
            label="Govt Rate (₹)"
            value={
              boqItem ? `₹${boqItem.govtRate.toLocaleString('en-IN')}` : '—'
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
        <FormCard
          title="🌍 Geo-tagged Inspection Details (Mandatory)"
          subtitle="Location authenticity enforcement"
        >
          <FormGrid columns={2}>
            <TextBox
              label="GPS Latitude *"
              placeholder="e.g. 23.1815"
              value={geoLat}
              onChange={setGeoLat}
              required
            />
            <TextBox
              label="GPS Longitude *"
              placeholder="e.g. 77.4200"
              value={geoLon}
              onChange={setGeoLon}
              required
            />
          </FormGrid>
          <div
            style={{
              background: '#f0f9ff',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              fontSize: '0.75rem',
              color: '#0c4a6e',
              marginTop: '0.5rem',
            }}
          >
            <strong>Auto-captured:</strong> Date & Time:{' '}
            {new Date().toLocaleString('en-IN')} | Device: Chrome Browser |
            Engineer: Er. Rajesh Verma (Logged In)
          </div>
        </FormCard>

        <TextArea
          label="Measurement Remarks / Site Notes"
          placeholder="Describe what was measured, location, references to drawings..."
          value={mbRemarks}
          onChange={setMbRemarks}
          rows={2}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={close} />
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
        visible={popup.mode === 'view' || popup.mode === 'approve'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`MB Entry — ${(popup as any).item?.mbNo ?? ''}`}
        subtitle="Measurement book record with deduction details."
        size="lg"
      >
        {(popup.mode === 'view' || popup.mode === 'approve') && (
          <>
            {/* Chain reference */}
            <div className="civil-chain" style={{ marginBottom: '1rem' }}>
              <span className="civil-chain-item">
                {(popup as any).item?.sorCode}
              </span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">
                {(popup as any).item?.boqItemId ? 'BOQ Item' : '—'}
              </span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item active">
                {(popup as any).item?.mbNo}
              </span>
              <span className="civil-chain-arrow">→</span>
              <span className="civil-chain-item">
                {(popup as any).item?.raNo ?? 'Bill Pending'}
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
                ['MB No', (popup as any).item?.mbNo],
                ['Work', (popup as any).item?.workName],
                ['SOR Code', (popup as any).item?.sorCode],
                ['Description', (popup as any).item?.description],
                [
                  'BOQ Qty',
                  `${(popup as any).item?.boqQty} ${(popup as any).item?.unit}`,
                ],
                [
                  'Prev. Billed',
                  `${(popup as any).item?.prevBilledQty} ${(popup as any).item?.unit}`,
                ],
                [
                  'This MB Qty',
                  `${(popup as any).item?.executedQty} ${(popup as any).item?.unit}`,
                ],
                [
                  'Cumulative',
                  `${(popup as any).item?.cumulativeQty} ${(popup as any).item?.unit}`,
                ],
                [
                  'Balance',
                  `${(popup as any).item?.balanceQty} ${(popup as any).item?.unit}`,
                ],
                [
                  'Govt Rate',
                  `₹${(popup as any).item?.govtRate?.toLocaleString('en-IN')}`,
                ],
                [
                  'Gross Bill Amount',
                  `₹${((popup as any).item?.billAmount / 100000).toFixed(2)}L`,
                ],
                [
                  'Advance Adjusted',
                  `-₹${((popup as any).item?.advanceAdjusted / 1000).toFixed(0)}K`,
                ],
                [
                  'Security Deposit',
                  `-₹${((popup as any).item?.securityDeposit / 1000).toFixed(0)}K`,
                ],
                [
                  'Net Payable',
                  `₹${((popup as any).item?.netPayable / 100000).toFixed(2)}L`,
                ],
                ['Engineer', (popup as any).item?.engineerName],
                ['Device', (popup as any).item?.deviceInfo],
                [
                  'Geo Location',
                  `${(popup as any).item?.geoLatitude}, ${(popup as any).item?.geoLongitude}`,
                ],
                ['Timestamp', (popup as any).item?.geoTimestamp],
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

            {popup.mode === 'approve' && (
              <div className="flex justify-end gap-3 mt-2">
                <Button
                  label="Reject"
                  variant="danger"
                  onClick={() => setPopup({ mode: 'closed' })}
                />
                <Button
                  label="Approve MB (EE)"
                  variant="primary"
                  icon="check"
                  onClick={() => handleApprove((popup as any).item)}
                />
              </div>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
