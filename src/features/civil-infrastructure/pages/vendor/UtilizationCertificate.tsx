import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  CIVIL_STORAGE_KEYS,
  civilStorage,
  useCivilStorage,
} from '../../civilStorage';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const STORAGE_KEY = 'civil_utilization_certificates';

const INITIAL_UCS: CivilManagement.UtilizationCertificate[] = [
  {
    id: 'UC-2025-01',
    ucNo: 'GFR-12A/UGC/2025/09',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    fundingSourceId: 'FS-01',
    fundingSourceName: 'UGC Development Grant',
    grantSanctionNo: 'F.No. 4-12/2024(CU-UGC)',
    grantSanctionAmount: 25000000,
    periodFrom: '2024-04-01',
    periodTo: '2025-03-31',
    previousExpenditure: 0,
    currentExpenditure: 14200000,
    cumulativeExpenditure: 14200000,
    balanceGrant: 10800000,
    submittedToAgency: true,
    submissionDate: '2025-02-10',
    acknowledgementNo: 'UGC/ACK/2025/8812',
    status: 'Submitted',
    certifiedBy: 'Finance Officer & Registrar',
    certifiedDate: '2025-02-05',
    expenditures: [
      {
        billNo: 'RA-01',
        billDate: '2024-12-10',
        grossAmount: 8500000,
        netPaid: 7650000,
      },
      {
        billNo: 'RA-02',
        billDate: '2025-01-20',
        grossAmount: 6500000,
        netPaid: 5850000,
      },
    ],
  },
  {
    id: 'UC-2025-02',
    ucNo: 'GFR-12A/SGC/2025/03',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    fundingSourceId: 'FS-02',
    fundingSourceName: 'State Govt Capital Grant',
    grantSanctionNo: 'GO-MP/HED/CW-2024/712',
    grantSanctionAmount: 18000000,
    periodFrom: '2024-04-01',
    periodTo: '2025-03-31',
    previousExpenditure: 0,
    currentExpenditure: 6200000,
    cumulativeExpenditure: 6200000,
    balanceGrant: 11800000,
    submittedToAgency: false,
    status: 'Certified',
    certifiedBy: 'Finance Officer & Registrar',
    certifiedDate: '2025-02-18',
    expenditures: [
      {
        billNo: 'RA-01',
        billDate: '2025-01-15',
        grossAmount: 6800000,
        netPaid: 6120000,
      },
    ],
  },
];

const formatCurrency = (val?: number) =>
  '₹' + (val || 0).toLocaleString('en-IN');

export default function UtilizationCertificate() {
  const [works] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.WORKS,
    initialWorks
  );

  const [data, setData] = useState<CivilManagement.UtilizationCertificate[]>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_UCS;
    }
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'view';
    item?: CivilManagement.UtilizationCertificate;
  }>({ mode: 'closed' });

  const [formWorkId, setFormWorkId] = useState('');
  const [formGrantNo, setFormGrantNo] = useState('');
  const [formGrantAmt, setFormGrantAmt] = useState('20000000');
  const [formFrom, setFormFrom] = useState('2024-04-01');
  const [formTo, setFormTo] = useState('2025-03-31');
  const [formCurrExp, setFormCurrExp] = useState('10000000');
  const [formPrevExp, setFormPrevExp] = useState('0');

  useEffect(() => {
    civilStorage.set(STORAGE_KEY, data);
  }, [data]);

  const openAdd = () => {
    const w = works[0];
    setFormWorkId(w?.id || '1');
    setFormGrantNo('UGC/GR/CW/2026/01');
    setFormGrantAmt((w?.aaAmount || 20000000).toString());
    setFormFrom('2024-04-01');
    setFormTo('2025-03-31');
    setFormCurrExp('8500000');
    setFormPrevExp('0');
    setPopup({ mode: 'add' });
  };

  const openView = (item: CivilManagement.UtilizationCertificate) => {
    setPopup({ mode: 'view', item });
  };

  const handleGenerateUC = () => {
    const w = works.find(x => x.id === formWorkId);
    const grant = Number(formGrantAmt) || 0;
    const curr = Number(formCurrExp) || 0;
    const prev = Number(formPrevExp) || 0;
    const cum = curr + prev;
    const bal = Math.max(0, grant - cum);

    const newUc: CivilManagement.UtilizationCertificate = {
      id: `UC-${Date.now().toString().slice(-4)}`,
      ucNo: `GFR-12A/${w?.fundingSource?.slice(0, 3).toUpperCase() || 'FIN'}/${new Date().getFullYear()}/${String(data.length + 1).padStart(2, '0')}`,
      workId: formWorkId,
      workName: w?.name || 'Civil Work',
      fundingSourceId: w?.fundingSourceId || 'FS-01',
      fundingSourceName: w?.fundingSource || 'University Fund',
      grantSanctionNo: formGrantNo.trim(),
      grantSanctionAmount: grant,
      periodFrom: formFrom,
      periodTo: formTo,
      previousExpenditure: prev,
      currentExpenditure: curr,
      cumulativeExpenditure: cum,
      balanceGrant: bal,
      submittedToAgency: false,
      status: 'Certified',
      certifiedBy: 'Finance Officer & Registrar',
      certifiedDate: new Date().toISOString().split('T')[0],
      expenditures: [],
    };

    setData(prev => [newUc, ...prev]);
    ToastService.success(
      `GFR-12A Utilization Certificate #${newUc.ucNo} generated.`
    );
    setPopup({ mode: 'closed' });
  };

  const markSubmitted = (id: string) => {
    setData(prev =>
      prev.map(u =>
        u.id === id
          ? {
              ...u,
              submittedToAgency: true,
              submissionDate: new Date().toISOString().split('T')[0],
              acknowledgementNo: `ACK/GOVT/${new Date().getFullYear()}/${String(Math.floor(1000 + Math.random() * 9000))}`,
              status: 'Submitted',
            }
          : u
      )
    );
    ToastService.success(
      'Utilization Certificate marked as Submitted to Funding Agency.'
    );
  };

  return (
    <FormPage
      title="Utilization Certificate"
      description="Statutory GFR Annexure 12-A utilization statements mandated by Government funding agencies (UGC, State Govt, Central Ministry) for capital grant release."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Vendor Login', to: civilUrls.vendorMenu },
        { label: 'Utilization Certificate' },
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
          label="Generate GFR-12A UC"
          icon="plus"
          variant="primary"
          onClick={openAdd}
        />
      </div>

      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'ucNo',
              header: 'UC Reference',
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {item.ucNo}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Sanction: {item.grantSanctionNo}
                  </div>
                </div>
              ),
              width: '180px',
            },
            {
              field: 'workName',
              header: 'Civil Work & Agency',
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {item.workName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Funding: {item.fundingSourceName}
                  </div>
                </div>
              ),
            },
            {
              field: 'grantSanctionAmount',
              header: 'Sanctioned Grant',
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <span style={{ fontWeight: 700, color: '#374151' }}>
                  {formatCurrency(item.grantSanctionAmount)}
                </span>
              ),
            },
            {
              field: 'cumulativeExpenditure',
              header: 'Certified Utilized',
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <div>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {formatCurrency(item.cumulativeExpenditure)}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Bal: {formatCurrency(item.balanceGrant)}
                  </div>
                </div>
              ),
            },
            {
              field: 'periodTo',
              header: 'Audit Period',
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                  {item.periodFrom} to {item.periodTo}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Submission Status',
              cell: (item: CivilManagement.UtilizationCertificate) => {
                const variant =
                  item.status === 'Submitted' ? 'approved' : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.UtilizationCertificate) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                    title="View Form GFR 12-A"
                  />
                  {!item.submittedToAgency && (
                    <Button
                      size="small"
                      label="Dispatch"
                      icon="paper-plane"
                      variant="primary"
                      onClick={() => markSubmitted(item.id)}
                      title="Mark Submitted to Govt Agency"
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search utilization certificates..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `GFR Form 12-A Utilization Certificate — ${popup.item?.ucNo}`
            : 'Generate GFR Form 12-A Utilization Certificate'
        }
        subtitle="Mandatory statutory format prescribed under Rule 238(1) of General Financial Rules 2017."
        size="lg"
      >
        {popup.mode === 'view' ? (
          /* View GFR 12-A Formal Display */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                border: '2px solid #334155',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                background: '#ffffff',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '2px solid #0f172a',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#475569',
                  }}
                >
                  FORM GFR 12-A
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  [See Rule 238 (1)]
                </div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginTop: '4px',
                  }}
                >
                  FORM OF UTILIZATION CERTIFICATE FOR CIVIL GRANTS
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontFamily: 'monospace',
                    color: '#1d4ed8',
                    marginTop: '4px',
                  }}
                >
                  Certificate No: {popup.item?.ucNo}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  lineHeight: 1.8,
                }}
              >
                <div>
                  <div>
                    <strong>1. Sponsoring Body:</strong>{' '}
                    {popup.item?.fundingSourceName}
                  </div>
                  <div>
                    <strong>2. Sanction Letter No:</strong>{' '}
                    {popup.item?.grantSanctionNo}
                  </div>
                  <div>
                    <strong>3. Civil Work Entitled:</strong>{' '}
                    {popup.item?.workName}
                  </div>
                </div>
                <div>
                  <div>
                    <strong>4. Accounting Period:</strong>{' '}
                    {popup.item?.periodFrom} to {popup.item?.periodTo}
                  </div>
                  <div>
                    <strong>5. Sanctioned Amount:</strong>{' '}
                    {formatCurrency(popup.item?.grantSanctionAmount)}
                  </div>
                  <div>
                    <strong>6. Cumulative Utilized:</strong>{' '}
                    {formatCurrency(popup.item?.cumulativeExpenditure)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '0.8125rem',
                  lineHeight: 1.8,
                  color: '#1e293b',
                }}
              >
                <p>
                  Certified that out of{' '}
                  <strong>
                    {formatCurrency(popup.item?.grantSanctionAmount)}
                  </strong>{' '}
                  of grants-in-aid sanctioned during the year in favour of this
                  University under letter number cited above, a sum of{' '}
                  <strong>
                    {formatCurrency(popup.item?.cumulativeExpenditure)}
                  </strong>{' '}
                  has been utilized for the civil construction works for which
                  it was sanctioned and that the unspent balance of{' '}
                  <strong>{formatCurrency(popup.item?.balanceGrant)}</strong>{' '}
                  remains at the end of the year and will be adjusted towards
                  the grants-in-aid payable during the next year.
                </p>
                <p>
                  Certified that I have satisfied myself that the conditions on
                  which the grants-in-aid was sanctioned have been duly
                  fulfilled and that I have exercised the following checks to
                  see that the money was actually utilized for the purpose for
                  which it was sanctioned:
                </p>
                <ol style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                  <li>
                    Scrutiny of executive engineer e-Measurement Books and
                    contractor running bills.
                  </li>
                  <li>
                    Inspection of site by University Building & Works Committee.
                  </li>
                  <li>
                    Reconciliation of university ledger balances with state
                    treasury accounts.
                  </li>
                </ol>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  marginTop: '2rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #cbd5e1',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Executive Engineer / Nodal Officer
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    University Civil Engineering Cell
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                    Finance Officer & Registrar
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Certified on {popup.item?.certifiedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        ) : (
          /* Generate UC Form */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <DropDownList
              label="Civil Work Project"
              data={works.map(w => ({
                label: `${w.workId} — ${w.name} (${w.fundingSource})`,
                value: w.id,
              }))}
              textField="label"
              optionValue="value"
              value={formWorkId}
              onChange={val => {
                setFormWorkId(val as string);
                const w = works.find(x => x.id === val);
                if (w) setFormGrantAmt((w.aaAmount || 20000000).toString());
              }}
              required
            />

            <FormGrid columns={2}>
              <TextBox
                label="Grant Sanction Letter Order Number"
                placeholder="F.No. 4-12/2025(CU-UGC)"
                value={formGrantNo}
                onChange={setFormGrantNo}
                required
              />
              <TextBox
                label="Sanctioned Grant Amount (₹)"
                placeholder="25000000"
                value={formGrantAmt}
                onChange={setFormGrantAmt}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Period From"
                placeholder="YYYY-MM-DD"
                value={formFrom}
                onChange={setFormFrom}
                required
              />
              <TextBox
                label="Period To"
                placeholder="YYYY-MM-DD"
                value={formTo}
                onChange={setFormTo}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Current Period Expenditure Utilized (₹)"
                placeholder="14200000"
                value={formCurrExp}
                onChange={setFormCurrExp}
                required
              />
              <TextBox
                label="Previous Unspent / Carried Forward (₹)"
                placeholder="0"
                value={formPrevExp}
                onChange={setFormPrevExp}
              />
            </FormGrid>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Generate Form GFR 12-A"
                variant="primary"
                icon="check"
                onClick={handleGenerateUC}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
