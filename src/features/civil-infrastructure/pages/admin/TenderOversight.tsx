import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextBox,
  TextArea,
} from 'shared/components/forms';
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
  type CivilTender,
  tenders as initialTenders,
  contractors as initialContractors,
  civilWorks as initialWorks,
  workOrders as initialWorkOrders,
  initialTPIAgencies,
  initialLabAgencies,
} from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const statusVariant = (s: string) => {
  if (s === 'Awarded') return 'approved';
  if (s === 'Cancelled') return 'rejected';
  if (s === 'Published' || s === 'Bids Received') return 'pending';
  return 'neutral';
};

export default function TenderOversight() {
  // Load data from localStorage
  const [tenders, setTenders] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_tenders');
    return saved ? JSON.parse(saved) : initialTenders;
  });
  const [contractors] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_contractors');
    return saved ? JSON.parse(saved) : initialContractors;
  });
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });
  const [workOrders, setWorkOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_work_orders');
    return saved ? JSON.parse(saved) : initialWorkOrders;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'evaluate';
    item?: any;
  }>({ mode: 'closed' });
  const [l1Name, setL1Name] = useState('');
  const [l1Amt, setL1Amt] = useState('');
  const [remarks, setRemarks] = useState('');

  const [tpiAgencies] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_tpi_agencies');
    return saved ? JSON.parse(saved) : initialTPIAgencies;
  });
  const [labAgencies] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_lab_agencies');
    return saved ? JSON.parse(saved) : initialLabAgencies;
  });

  // Mapping Form State
  const [mapWorkId, setMapWorkId] = useState('');
  const [mapContractorId, setMapContractorId] = useState('');
  const [mapTpiAgencyId, setMapTpiAgencyId] = useState('');
  const [mapQualityLabId, setMapQualityLabId] = useState('');
  const [mapContractAmt, setMapContractAmt] = useState('');
  const [mapCommenceDate, setMapCommenceDate] = useState('');
  const [mapComplDate, setMapComplDate] = useState('');
  const [mapSdAmount, setMapSdAmount] = useState('');

  // Persist all data changes to localStorage
  useEffect(() => {
    localStorage.setItem('civil_tenders', JSON.stringify(tenders));
  }, [tenders]);

  useEffect(() => {
    localStorage.setItem('civil_works', JSON.stringify(works));
  }, [works]);

  useEffect(() => {
    localStorage.setItem('civil_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  const handleAward = () => {
    if (!popup.item) return;
    const cont = contractors.find(
      (c: any) => c.companyName === l1Name || c.id === l1Name
    );
    const contractorName = cont ? cont.companyName : l1Name;
    const contractorId = cont ? cont.id : 'CON-UNKNOWN';

    const updatedTenders = tenders.map((t: any) =>
      t.id === popup.item!.id
        ? {
            ...t,
            l1ContractorName: contractorName,
            l1ContractorId: contractorId,
            l1BidAmount: Number(l1Amt),
            status: 'Awarded' as any,
          }
        : t
    );
    setTenders(updatedTenders);

    // Update civil work status & contract amount
    const updatedWorks = works.map((w: any) =>
      w.id === popup.item!.workId
        ? {
            ...w,
            status: 'Tender Awarded' as any,
            contractAmount: Number(l1Amt),
          }
        : w
    );
    setWorks(updatedWorks);

    // Auto-generate Work Order draft
    const newWO = {
      id: String(Date.now()),
      workOrderNo: `WO/CW/${new Date().getFullYear()}/${String(workOrders.length + 1).padStart(3, '0')}`,
      workId: popup.item.workId,
      workName: popup.item.workName,
      contractorId: contractorId,
      contractorName: contractorName,
      issuedDate: new Date().toISOString().split('T')[0],
      commencementDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 7 days later
      completionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 1 year later
      contractAmount: Number(l1Amt),
      advancePaid: Number(l1Amt) * 0.1,
      advanceRecoveryRate: 10,
      sdPercentage: 5,
      sdAmount: Number(l1Amt) * 0.05,
      status: 'Issued' as any,
      signedByContractor: false,
      signedByEE: false,
    };
    setWorkOrders((prev: any[]) => [...prev, newWO]);

    ToastService.success(
      `L1 Bidder identified. Tender awarded & Work Order draft generated.`
    );
    setPopup({ mode: 'closed' });
  };

  const handleCreateMapping = () => {
    if (
      !mapWorkId ||
      !mapContractorId ||
      !mapContractAmt ||
      !mapCommenceDate ||
      !mapComplDate ||
      !mapTpiAgencyId ||
      !mapQualityLabId
    ) {
      ToastService.error(
        'Please fill in all mapping fields, including TPI and Lab agencies.'
      );
      return;
    }

    const selectedWork = works.find((w: any) => w.id === mapWorkId);
    const selectedContractor = contractors.find(
      (c: any) => c.id === mapContractorId
    );
    const selectedTpi = tpiAgencies.find((t: any) => t.id === mapTpiAgencyId);
    const selectedLab = labAgencies.find((l: any) => l.id === mapQualityLabId);

    if (!selectedWork || !selectedContractor) {
      ToastService.error('Selected Work or Contractor is invalid.');
      return;
    }

    // 1. Create a Tender if not exists, or update existing tender
    const existingTender = tenders.find((t: any) => t.workId === mapWorkId);
    if (existingTender) {
      setTenders((prev: any[]) =>
        prev.map((t: any) =>
          t.id === existingTender.id
            ? {
                ...t,
                l1ContractorId: selectedContractor.id,
                l1ContractorName: selectedContractor.companyName,
                l1BidAmount: Number(mapContractAmt),
                status: 'Awarded',
              }
            : t
        )
      );
    } else {
      const newTender: CivilTender = {
        id: String(Date.now()),
        tenderNo: `NIT/CW/${new Date().getFullYear()}/${String(tenders.length + 1).padStart(3, '0')}`,
        workId: selectedWork.id,
        workName: selectedWork.name,
        tenderType: 'Open (e-Procurement)',
        nit: `NIT-CW-${String(tenders.length + 1).padStart(3, '0')}`,
        publishDate: new Date().toISOString().split('T')[0],
        closingDate: mapCommenceDate,
        preBidDate: new Date().toISOString().split('T')[0],
        emdAmount: Number(mapContractAmt) * 0.02,
        estimatedValue: selectedWork.estimatedCost,
        l1ContractorId: selectedContractor.id,
        l1ContractorName: selectedContractor.companyName,
        l1BidAmount: Number(mapContractAmt),
        l1Percentage:
          ((Number(mapContractAmt) - selectedWork.estimatedCost) /
            selectedWork.estimatedCost) *
          100,
        totalBidsReceived: 3,
        eligibilityCriteria: `Class ${selectedContractor.grade} contractor limits apply`,
        status: 'Awarded',
      };
      setTenders((prev: any[]) => [...prev, newTender]);
    }

    // 2. Update the Work status and contract amount
    setWorks((prev: any[]) =>
      prev.map((w: any) =>
        w.id === mapWorkId
          ? {
              ...w,
              status: 'Tender Awarded',
              contractAmount: Number(mapContractAmt),
              tpiAgencyId: mapTpiAgencyId,
              tpiAgencyName: selectedTpi?.name ?? '—',
              qualityLabId: mapQualityLabId,
              qualityLabName: selectedLab?.name ?? '—',
            }
          : w
      )
    );

    // 3. Generate Work Order
    const newWO = {
      id: String(Date.now() + 1),
      workOrderNo: `WO/CW/${new Date().getFullYear()}/${String(workOrders.length + 1).padStart(3, '0')}`,
      workId: selectedWork.id,
      workName: selectedWork.name,
      contractorId: selectedContractor.id,
      contractorName: selectedContractor.companyName,
      issuedDate: new Date().toISOString().split('T')[0],
      commencementDate: mapCommenceDate,
      completionDate: mapComplDate,
      contractAmount: Number(mapContractAmt),
      advancePaid: Number(mapContractAmt) * 0.1,
      advanceRecoveryRate: 10,
      sdPercentage: 5,
      sdAmount: Number(mapSdAmount) || Number(mapContractAmt) * 0.05,
      status: 'Issued' as any,
      signedByContractor: false,
      signedByEE: false,
      tpiAgencyId: mapTpiAgencyId,
      tpiAgencyName: selectedTpi?.name ?? '—',
      qualityLabId: mapQualityLabId,
      qualityLabName: selectedLab?.name ?? '—',
    };
    setWorkOrders((prev: any[]) => [...prev, newWO]);

    ToastService.success(
      `Agency mapped to Work successfully! Work Order created for ${selectedContractor.companyName}.`
    );

    // Reset Form
    setMapWorkId('');
    setMapContractorId('');
    setMapTpiAgencyId('');
    setMapQualityLabId('');
    setMapContractAmt('');
    setMapCommenceDate('');
    setMapComplDate('');
    setMapSdAmount('');
  };

  const publishedBids = tenders.filter(
    (t: any) => t.status === 'Bids Received' || t.status === 'Under Evaluation'
  );
  const awardedTenders = tenders.filter((t: any) => t.status === 'Awarded');

  return (
    <FormPage
      title="Tender Oversight & Mapping"
      description="Publish BOQ to portal, evaluate contractor bids, map agencies to registered works, and award tenders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.adminPortal },
        { label: 'Tender Oversight' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: `All Tenders (${tenders.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={tenders}
                  columns={[
                    {
                      cell: (_, o) => <span>{o.rowIndex + 1}</span>,
                      width: '50px',
                    },
                    {
                      field: 'tenderNo',
                      header: 'NIT No',
                      cell: (t: CivilTender) => (
                        <span
                          style={{ fontFamily: 'monospace', fontWeight: 700 }}
                        >
                          {t.tenderNo}
                        </span>
                      ),
                    },
                    { field: 'workName', header: 'Work Name' },
                    {
                      field: 'tenderType',
                      header: 'Type',
                      cell: (t: CivilTender) => (
                        <span style={{ fontSize: '0.75rem' }}>
                          {t.tenderType}
                        </span>
                      ),
                    },
                    { field: 'closingDate', header: 'Closing Date' },
                    {
                      field: 'estimatedValue',
                      header: 'Est. Value',
                      cell: (t: CivilTender) => (
                        <span>₹{(t.estimatedValue / 100000).toFixed(1)}L</span>
                      ),
                    },
                    {
                      field: 'totalBidsReceived',
                      header: 'Bids',
                      cell: (t: CivilTender) => (
                        <span style={{ fontWeight: 700 }}>
                          {t.totalBidsReceived ?? '—'}
                        </span>
                      ),
                    },
                    {
                      field: 'l1ContractorName',
                      header: 'L1 Bidder',
                      cell: (t: CivilTender) =>
                        t.l1ContractorName ? (
                          <span style={{ fontWeight: 600, color: '#16a34a' }}>
                            {t.l1ContractorName}
                          </span>
                        ) : (
                          <span className="civil-pill gray">Pending</span>
                        ),
                    },
                    {
                      field: 'l1BidAmount',
                      header: 'L1 Bid',
                      cell: (t: CivilTender) =>
                        t.l1BidAmount ? (
                          <span>₹{(t.l1BidAmount / 100000).toFixed(1)}L</span>
                        ) : (
                          <span>—</span>
                        ),
                    },
                    {
                      field: 'status',
                      header: 'Status',
                      cell: (t: CivilTender) => (
                        <StatusBadge
                          label={t.status}
                          variant={statusVariant(t.status)}
                        />
                      ),
                    },
                    {
                      field: 'id',
                      header: 'Action',
                      sortable: false,
                      cell: (item: CivilTender) => (
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <Button
                            size="small"
                            label=""
                            icon="eye"
                            variant="outlined"
                            onClick={() => setPopup({ mode: 'view', item })}
                          />
                          {(item.status === 'Bids Received' ||
                            item.status === 'Under Evaluation') && (
                            <Button
                              size="small"
                              label="Evaluate L1"
                              icon="chart-bar"
                              variant="primary"
                              onClick={() => {
                                setL1Name(item.l1ContractorName ?? '');
                                setL1Amt(String(item.l1BidAmount ?? ''));
                                setRemarks('');
                                setPopup({ mode: 'evaluate', item });
                              }}
                            />
                          )}
                        </div>
                      ),
                    },
                  ]}
                  searchBox
                  searchPlaceholder="Search tenders..."
                />
              </FormCard>
            ),
          },
          {
            title: `Pending Evaluation (${publishedBids.length})`,
            content: (
              <FormCard subtitle="These tenders have received bids and are awaiting L1 evaluation.">
                {publishedBids.length === 0 ? (
                  <div
                    style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#9ca3af',
                    }}
                  >
                    No tenders pending evaluation.
                  </div>
                ) : (
                  <GridPanel
                    data={publishedBids}
                    columns={[
                      {
                        field: 'tenderNo',
                        header: 'NIT No',
                        cell: (t: any) => (
                          <span
                            style={{ fontFamily: 'monospace', fontWeight: 700 }}
                          >
                            {t.tenderNo}
                          </span>
                        ),
                      },
                      { field: 'workName', header: 'Work' },
                      {
                        field: 'totalBidsReceived',
                        header: 'Bids',
                        cell: (t: any) => (
                          <span style={{ fontWeight: 700, color: '#2563eb' }}>
                            {t.totalBidsReceived}
                          </span>
                        ),
                      },
                      { field: 'closingDate', header: 'Closing Date' },
                      {
                        field: 'status',
                        header: 'Status',
                        cell: (t: any) => (
                          <StatusBadge label={t.status} variant="pending" />
                        ),
                      },
                    ]}
                  />
                )}
              </FormCard>
            ),
          },
          {
            title: `Awarded (${awardedTenders.length})`,
            content: (
              <FormCard>
                <GridPanel
                  data={awardedTenders}
                  columns={[
                    {
                      field: 'tenderNo',
                      header: 'NIT No',
                      cell: (t: any) => (
                        <span
                          style={{ fontFamily: 'monospace', fontWeight: 700 }}
                        >
                          {t.tenderNo}
                        </span>
                      ),
                    },
                    { field: 'workName', header: 'Work' },
                    {
                      field: 'l1ContractorName',
                      header: 'L1 (Awarded To)',
                      cell: (t: any) => (
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>
                          {t.l1ContractorName}
                        </span>
                      ),
                    },
                    {
                      field: 'l1BidAmount',
                      header: 'Contract Value',
                      cell: (t: any) => (
                        <span>₹{(t.l1BidAmount / 100000).toFixed(1)}L</span>
                      ),
                    },
                    {
                      field: 'l1Percentage',
                      header: '% vs Estimate',
                      cell: (t: any) => (
                        <span
                          style={{
                            color: t.l1Percentage < 0 ? '#16a34a' : '#dc2626',
                            fontWeight: 700,
                          }}
                        >
                          {t.l1Percentage?.toFixed(2)}%
                        </span>
                      ),
                    },
                  ]}
                />
              </FormCard>
            ),
          },
          {
            title: 'Agency-Work Mapping',
            content: (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem',
                }}
              >
                <FormCard
                  title="Create Agency-Work Mapping"
                  subtitle="Link an onboarded contractor/agency to a registered work project."
                >
                  <FormGrid columns={1}>
                    <DropDownList
                      label="Select Registered Work *"
                      data={works
                        .filter((w: any) =>
                          [
                            'Registered',
                            'Requirement Generated',
                            'AA Approved',
                            'TS Granted',
                            'Budget Locked',
                            'Tender Stage',
                          ].includes(w.status)
                        )
                        .map((w: any) => ({
                          name: `${w.workId} - ${w.name} (Est: ₹${(w.estimatedCost / 100000).toFixed(1)}L)`,
                          value: w.id,
                        }))}
                      textField={'name' as any}
                      optionValue="value"
                      value={mapWorkId}
                      onChange={v => {
                        setMapWorkId(v as string);
                        const wk = works.find((w: any) => w.id === v);
                        if (wk) setMapContractAmt(String(wk.estimatedCost));
                      }}
                    />
                    <DropDownList
                      label="Select Contractor / Agency *"
                      data={contractors
                        .filter((c: any) => c.status === 'Active')
                        .map((c: any) => ({
                          name: `${c.companyName} (${c.grade})`,
                          value: c.id,
                        }))}
                      textField={'name' as any}
                      optionValue="value"
                      value={mapContractorId}
                      onChange={v => setMapContractorId(v as string)}
                    />
                    <DropDownList
                      label="Select TPI Quality Agency *"
                      data={tpiAgencies
                        .filter((t: any) => t.status === 'Active')
                        .map((t: any) => ({ name: t.name, value: t.id }))}
                      textField={'name' as any}
                      optionValue="value"
                      value={mapTpiAgencyId}
                      onChange={v => setMapTpiAgencyId(v as string)}
                    />
                    <DropDownList
                      label="Select Quality Lab Testing Agency *"
                      data={labAgencies
                        .filter((l: any) => l.status === 'Active')
                        .map((l: any) => ({ name: l.name, value: l.id }))}
                      textField={'name' as any}
                      optionValue="value"
                      value={mapQualityLabId}
                      onChange={v => setMapQualityLabId(v as string)}
                    />
                    <TextBox
                      label="Agreed Contract Value (₹) *"
                      placeholder="e.g. 26200000"
                      value={mapContractAmt}
                      onChange={v => setMapContractAmt(v)}
                    />
                    <TextBox
                      label="Security Deposit Amount (₹) - Leave blank for 5% default"
                      placeholder="e.g. 1310000"
                      value={mapSdAmount}
                      onChange={v => setMapSdAmount(v)}
                    />
                    <FormGrid columns={2}>
                      <DatePicker
                        label="Commencement Date *"
                        value={
                          mapCommenceDate
                            ? new Date(mapCommenceDate)
                            : undefined
                        }
                        onChange={v =>
                          setMapCommenceDate(
                            v ? v.toISOString().split('T')[0] : ''
                          )
                        }
                      />
                      <DatePicker
                        label="Scheduled Completion Date *"
                        value={
                          mapComplDate ? new Date(mapComplDate) : undefined
                        }
                        onChange={v =>
                          setMapComplDate(
                            v ? v.toISOString().split('T')[0] : ''
                          )
                        }
                      />
                    </FormGrid>
                    <div style={{ marginTop: '0.5rem', width: '100%' }}>
                      <div style={{ width: '100%' }}>
                        <Button
                          label="Execute Agency-Work Mapping"
                          icon="link"
                          variant="primary"
                          onClick={handleCreateMapping}
                        />
                      </div>
                    </div>
                  </FormGrid>
                </FormCard>

                <FormCard
                  title="Active Mappings & Contract Allocations"
                  subtitle="List of contractors currently mapped to active works."
                >
                  <table className="civil-table">
                    <thead>
                      <tr>
                        <th>Work ID</th>
                        <th>Project Name</th>
                        <th>Contractor Name</th>
                        <th>TPI Agency</th>
                        <th>Quality Lab</th>
                        <th>Contract Value</th>
                        <th>Timeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {works
                        .filter((w: any) =>
                          [
                            'Tender Awarded',
                            'Work Order Issued',
                            'In Progress',
                            'Completed',
                          ].includes(w.status)
                        )
                        .map((w: any) => {
                          const tender = tenders.find(
                            (t: any) => t.workId === w.id
                          );
                          return (
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
                              <td style={{ maxWidth: '150px' }}>{w.name}</td>
                              <td style={{ fontWeight: 600 }}>
                                {tender?.l1ContractorName ??
                                  w.externalAgency ??
                                  '—'}
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {w.tpiAgencyName ?? '—'}
                                </span>
                              </td>
                              <td>
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {w.qualityLabName ?? '—'}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700, color: '#16a34a' }}>
                                ₹
                                {(
                                  (w.contractAmount || w.estimatedCost) / 100000
                                ).toFixed(1)}
                                L
                              </td>
                              <td
                                style={{
                                  fontSize: '0.72rem',
                                  color: '#6b7280',
                                }}
                              >
                                {w.startDate ?? '—'} to{' '}
                                {w.expectedEndDate ?? '—'}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </FormCard>
              </div>
            ),
          },
        ]}
      />

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'evaluate'
            ? `Evaluate L1 — ${popup.item?.tenderNo}`
            : `Tender Details — ${popup.item?.tenderNo}`
        }
        subtitle="Bid ranking and L1 (Lowest Eligible Bidder) identification."
        size="lg"
      >
        {popup.item && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1.5rem',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
              }}
            >
              {[
                ['NIT No', popup.item.tenderNo],
                ['Work Name', popup.item.workName],
                ['Tender Type', popup.item.tenderType],
                ['Published', popup.item.publishDate],
                ['Closing Date', popup.item.closingDate],
                ['EMD Amount', `₹${(popup.item.emdAmount / 1000).toFixed(0)}K`],
                [
                  'Estimated Value',
                  `₹${(popup.item.estimatedValue / 100000).toFixed(2)}L`,
                ],
                ['Bids Received', String(popup.item.totalBidsReceived ?? '—')],
                ['Eligibility', popup.item.eligibilityCriteria],
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

            {popup.mode === 'evaluate' && (
              <>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    marginBottom: '1rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <strong>L1 Identification:</strong> The system ranks all
                  eligible bids by price. The lowest eligible bidder (L1) who
                  meets technical criteria is selected for award.
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        marginBottom: '0.375rem',
                      }}
                    >
                      L1 Contractor Name *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                      placeholder="Select L1 bidder..."
                      value={l1Name}
                      onChange={e => setL1Name(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        marginBottom: '0.375rem',
                      }}
                    >
                      L1 Bid Amount (₹) *
                    </label>
                    <input
                      type="number"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                      placeholder="e.g. 25850000"
                      value={l1Amt}
                      onChange={e => setL1Amt(e.target.value)}
                    />
                  </div>
                </div>
                <TextArea
                  label="Evaluation Committee Remarks"
                  value={remarks}
                  onChange={setRemarks}
                  rows={2}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Confirm L1 & Award Tender"
                    variant="primary"
                    icon="trophy"
                    onClick={handleAward}
                  />
                </div>
              </>
            )}
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
