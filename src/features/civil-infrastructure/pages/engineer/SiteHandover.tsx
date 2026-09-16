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
} from 'shared/new-components';
import { civilWorks as initialWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const STORAGE_KEY = 'civil_site_handovers';

const ENCUMBRANCES = [
  'Boundary Demarcation & Benchmarking Completed',
  'Underground Cable / Pipe Utility Shifting Cleared',
  'Tree Cutting & Felling Statutory Clearance Obtained',
  'Site Barricading & Safety Hoardings Erected',
  'Unencumbered Land Possession Free from Encroachments',
  'Construction Water & Power Source Identified',
];

const INITIAL_HANDOVERS: CivilManagement.SiteHandover[] = [
  {
    id: 'SH-01',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    possessionCertNo: 'CERT/POSS/2024/012',
    handoverDate: '2024-11-05',
    handedOverBy: 'Dr. S.K. Dixit',
    handedOverDesignation: 'Estate Officer, University',
    receivedBy: 'Shri Vikram Sharma',
    receivedDesignation: 'Project Director, Apex Infra',
    engineerPresent: 'Er. Rajesh Verma (Executive Engineer)',
    encumbrancesCleared: [
      'Boundary Demarcation & Benchmarking Completed',
      'Underground Cable / Pipe Utility Shifting Cleared',
      'Site Barricading & Safety Hoardings Erected',
      'Unencumbered Land Possession Free from Encroachments',
    ],
    preConstructionPhotoCount: 16,
    geoLatitude: '23.2599° N',
    geoLongitude: '77.4126° E',
    hoarding: true,
    safetySetup: true,
    status: 'Issued',
    remarks:
      'Clear site possession granted with temporary access road provided from North Gate.',
  },
  {
    id: 'SH-02',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    possessionCertNo: 'CERT/POSS/2024/028',
    handoverDate: '2024-12-15',
    handedOverBy: 'Dr. S.K. Dixit',
    handedOverDesignation: 'Estate Officer, University',
    receivedBy: 'Shri Manoj Patel',
    receivedDesignation: 'Authorized Representative, Nirmaan Infra',
    engineerPresent: 'Er. Sandeep Singh (Assistant Engineer)',
    encumbrancesCleared: [
      'Boundary Demarcation & Benchmarking Completed',
      'Tree Cutting & Felling Statutory Clearance Obtained',
      'Unencumbered Land Possession Free from Encroachments',
    ],
    preConstructionPhotoCount: 12,
    geoLatitude: '23.2541° N',
    geoLongitude: '77.4089° E',
    hoarding: true,
    safetySetup: true,
    status: 'Issued',
    remarks:
      'Possession certificate handed over. Benchmark stone fixed at North-East boundary point.',
  },
];

export default function SiteHandover() {
  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [data, setData] = useState<CivilManagement.SiteHandover[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'edit' | 'view';
    item?: CivilManagement.SiteHandover;
  }>({ mode: 'closed' });

  const [formWorkId, setFormWorkId] = useState('');
  const [formCertNo, setFormCertNo] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formHandedBy, setFormHandedBy] = useState('');
  const [formHandedDesig, setFormHandedDesig] = useState('');
  const [formReceivedBy, setFormReceivedBy] = useState('');
  const [formReceivedDesig, setFormReceivedDesig] = useState('');
  const [formEngineer, setFormEngineer] = useState('');
  const [formPhotos, setFormPhotos] = useState('8');
  const [formLat, setFormLat] = useState('23.2599° N');
  const [formLong, setFormLong] = useState('77.4126° E');
  const [formEncumbrances, setFormEncumbrances] = useState<string[]>([]);
  const [formHoarding, setFormHoarding] = useState(true);
  const [formSafety, setFormSafety] = useState(true);
  const [formStatus, setFormStatus] = useState<'Pending' | 'Issued'>('Issued');
  const [formRemarks, setFormRemarks] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    const w = works[0];
    setFormWorkId(w?.id || '1');
    setFormCertNo(
      `CERT/POSS/${new Date().getFullYear()}/${String(data.length + 1).padStart(3, '0')}`
    );
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormHandedBy('Dr. S.K. Dixit');
    setFormHandedDesig('Estate Officer, University');
    setFormReceivedBy('');
    setFormReceivedDesig('Contractor Project Manager');
    setFormEngineer('Er. Rajesh Verma (Executive Engineer)');
    setFormPhotos('10');
    setFormLat('23.2599° N');
    setFormLong('77.4126° E');
    setFormEncumbrances([ENCUMBRANCES[0], ENCUMBRANCES[4]]);
    setFormHoarding(true);
    setFormSafety(true);
    setFormStatus('Issued');
    setFormRemarks('');
    setPopup({ mode: 'add' });
  };

  const openEdit = (item: CivilManagement.SiteHandover) => {
    setFormWorkId(item.workId);
    setFormCertNo(item.possessionCertNo);
    setFormDate(item.handoverDate);
    setFormHandedBy(item.handedOverBy);
    setFormHandedDesig(item.handedOverDesignation || '');
    setFormReceivedBy(item.receivedBy);
    setFormReceivedDesig(item.receivedDesignation || '');
    setFormEngineer(item.engineerPresent);
    setFormPhotos(item.preConstructionPhotoCount.toString());
    setFormLat(item.geoLatitude || '');
    setFormLong(item.geoLongitude || '');
    setFormEncumbrances(item.encumbrancesCleared || []);
    setFormHoarding(item.hoarding);
    setFormSafety(item.safetySetup);
    setFormStatus(item.status);
    setFormRemarks(item.remarks || '');
    setPopup({ mode: 'edit', item });
  };

  const openView = (item: CivilManagement.SiteHandover) => {
    setPopup({ mode: 'view', item });
  };

  const toggleEncumbrance = (item: string) => {
    setFormEncumbrances(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    if (!formReceivedBy.trim() || !formDate) {
      ToastService.error(
        'Contractor Representative and Handover Date are required.'
      );
      return;
    }
    const w = works.find(x => x.id === formWorkId);

    if (popup.mode === 'add') {
      const newItem: CivilManagement.SiteHandover = {
        id: `SH-${Date.now().toString().slice(-4)}`,
        workId: formWorkId,
        workName: w?.name || 'Selected Civil Work',
        possessionCertNo: formCertNo,
        handoverDate: formDate,
        handedOverBy: formHandedBy,
        handedOverDesignation: formHandedDesig,
        receivedBy: formReceivedBy.trim(),
        receivedDesignation: formReceivedDesig,
        engineerPresent: formEngineer,
        encumbrancesCleared: formEncumbrances,
        preConstructionPhotoCount: parseInt(formPhotos, 10) || 0,
        geoLatitude: formLat,
        geoLongitude: formLong,
        hoarding: formHoarding,
        safetySetup: formSafety,
        status: formStatus,
        remarks: formRemarks,
      };
      setData(prev => [newItem, ...prev]);
      ToastService.success(
        `Site Possession Certificate #${newItem.possessionCertNo} generated.`
      );
    } else if (popup.mode === 'edit' && popup.item) {
      setData(prev =>
        prev.map(d =>
          d.id === popup.item!.id
            ? {
                ...d,
                workId: formWorkId,
                workName: w?.name || d.workName,
                possessionCertNo: formCertNo,
                handoverDate: formDate,
                handedOverBy: formHandedBy,
                handedOverDesignation: formHandedDesig,
                receivedBy: formReceivedBy.trim(),
                receivedDesignation: formReceivedDesig,
                engineerPresent: formEngineer,
                encumbrancesCleared: formEncumbrances,
                preConstructionPhotoCount: parseInt(formPhotos, 10) || 0,
                geoLatitude: formLat,
                geoLongitude: formLong,
                hoarding: formHoarding,
                safetySetup: formSafety,
                status: formStatus,
                remarks: formRemarks,
              }
            : d
        )
      );
      ToastService.success('Site handover record updated.');
    }
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Site Handover & Possession Certificate"
      description="Formal legal transfer of physical site possession from the University Estate Office to the contractor, recording bench-marks and encumbrance clearances."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Site Handover' },
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
          label="Issue Site Possession Certificate"
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
              field: 'possessionCertNo',
              header: 'Certificate No.',
              cell: (item: CivilManagement.SiteHandover) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {item.possessionCertNo}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Date: {item.handoverDate}
                  </div>
                </div>
              ),
              width: '160px',
            },
            {
              field: 'workName',
              header: 'Civil Work Scheme',
              cell: (item: CivilManagement.SiteHandover) => (
                <span style={{ fontWeight: 600, color: '#111827' }}>
                  {item.workName}
                </span>
              ),
            },
            {
              field: 'receivedBy',
              header: 'Handover Parties',
              cell: (item: CivilManagement.SiteHandover) => (
                <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                  <div>
                    <strong>Given By:</strong> {item.handedOverBy}
                  </div>
                  <div>
                    <strong>Taken Over:</strong> {item.receivedBy}
                  </div>
                </div>
              ),
            },
            {
              field: 'encumbrancesCleared',
              header: 'Site Readiness',
              cell: (item: CivilManagement.SiteHandover) => (
                <div>
                  <span
                    className="civil-pill green"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.encumbrancesCleared?.length || 0} Cleared
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.preConstructionPhotoCount} Geo-Tagged Photos
                  </div>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Certificate Status',
              cell: (item: CivilManagement.SiteHandover) => {
                const variant =
                  item.status === 'Issued' ? 'approved' : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.SiteHandover) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                    title="View Possession Certificate"
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => openEdit(item)}
                    title="Edit Record"
                  />
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search possession certificates..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `Site Possession Certificate — ${popup.item?.possessionCertNo}`
            : popup.mode === 'add'
              ? 'Issue Site Possession Certificate'
              : `Edit Site Handover — ${popup.item?.possessionCertNo}`
        }
        subtitle="Formal legal record of vacant physical site handover to contractor."
        size="lg"
      >
        {popup.mode === 'view' ? (
          /* View Details Modal with Certificate Preview */
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
                border: '2px solid #1e3a8a',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                background: '#fafafa',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    color: '#64748b',
                  }}
                >
                  OFFICE OF THE ESTATE & WORKS OFFICER
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#1e3a8a',
                    marginTop: '2px',
                  }}
                >
                  SITE POSSESSION CERTIFICATE
                </div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontFamily: 'monospace',
                    color: '#475569',
                    marginTop: '4px',
                  }}
                >
                  Certificate No: {popup.item?.possessionCertNo} • Date:{' '}
                  {popup.item?.handoverDate}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.8125rem',
                  lineHeight: 1.8,
                  color: '#1e293b',
                }}
              >
                <p>
                  This is to certify that physical, unencumbered possession of
                  the construction site for the work entitled:
                </p>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontWeight: 700,
                    margin: '0.5rem 0',
                  }}
                >
                  {popup.item?.workName}
                </div>
                <p>
                  has been formally handed over today on{' '}
                  <strong>{popup.item?.handoverDate}</strong> free from any
                  visible encroachments, underground obstructions, or
                  impediments.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginTop: '1rem',
                  fontSize: '0.8125rem',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Handed Over By:
                  </div>
                  <div>
                    <strong>{popup.item?.handedOverBy}</strong>
                  </div>
                  <div style={{ color: '#64748b' }}>
                    {popup.item?.handedOverDesignation}
                  </div>
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Taken Over By:
                  </div>
                  <div>
                    <strong>{popup.item?.receivedBy}</strong>
                  </div>
                  <div style={{ color: '#64748b' }}>
                    {popup.item?.receivedDesignation}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '0.8125rem',
                  color: '#475569',
                }}
              >
                <strong>Witnessing Engineer:</strong>{' '}
                {popup.item?.engineerPresent}
                <br />
                <strong>Geo-Coordinates:</strong> Lat:{' '}
                {popup.item?.geoLatitude || '23.2599° N'}, Long:{' '}
                {popup.item?.geoLongitude || '77.4126° E'}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    color: '#0f172a',
                    marginBottom: '0.25rem',
                  }}
                >
                  Cleared Pre-requisites & Encumbrances:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.25rem',
                    fontSize: '0.78rem',
                    color: '#334155',
                  }}
                >
                  {popup.item?.encumbrancesCleared?.map((e, i) => (
                    <li key={i}>✓ {e}</li>
                  ))}
                </ul>
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
          /* Form Modal */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <FormGrid columns={2}>
              <DropDownList
                label="Civil Work Project *"
                data={works.map(w => ({
                  label: `${w.workId} — ${w.name}`,
                  value: w.id,
                }))}
                textField="label"
                optionValue="value"
                value={formWorkId}
                onChange={val => setFormWorkId(val as string)}
                required
              />
              <TextBox
                label="Certificate Reference Number *"
                placeholder="CERT/POSS/2026/001"
                value={formCertNo}
                onChange={setFormCertNo}
                required
              />
            </FormGrid>

            <FormGrid columns={3}>
              <TextBox
                label="Handover Date *"
                placeholder="YYYY-MM-DD"
                value={formDate}
                onChange={setFormDate}
                required
              />
              <TextBox
                label="Latitude Coordinates"
                placeholder="23.2599° N"
                value={formLat}
                onChange={setFormLat}
              />
              <TextBox
                label="Longitude Coordinates"
                placeholder="77.4126° E"
                value={formLong}
                onChange={setFormLong}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Handed Over By (University Officer) *"
                placeholder="Dr. S.K. Dixit"
                value={formHandedBy}
                onChange={setFormHandedBy}
                required
              />
              <TextBox
                label="Officer Designation"
                placeholder="Estate Officer / In-Charge"
                value={formHandedDesig}
                onChange={setFormHandedDesig}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Received By (Contractor Rep) *"
                placeholder="Shri Vikram Sharma"
                value={formReceivedBy}
                onChange={setFormReceivedBy}
                required
              />
              <TextBox
                label="Contractor Rep Designation"
                placeholder="Project Director"
                value={formReceivedDesig}
                onChange={setFormReceivedDesig}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Supervising Engineer Present"
                placeholder="Er. Rajesh Verma (EE)"
                value={formEngineer}
                onChange={setFormEngineer}
              />
              <TextBox
                label="Pre-Construction Geo-Tagged Photos Count"
                placeholder="10"
                value={formPhotos}
                onChange={setFormPhotos}
              />
            </FormGrid>

            <div>
              <label
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#374151',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Encumbrances & Pre-requisite Site Checks:
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                }}
              >
                {ENCUMBRANCES.map(item => {
                  const checked = formEncumbrances.includes(item);
                  return (
                    <label
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: checked
                          ? '1px solid #16a34a'
                          : '1px solid #e5e7eb',
                        background: checked ? '#f0fdf4' : '#ffffff',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEncumbrance(item)}
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <TextArea
              label="Site Handover Protocol Remarks"
              placeholder="Record boundary benchmark marks, temporary electricity connection points, or access road instructions..."
              value={formRemarks}
              onChange={setFormRemarks}
              rows={2}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label={
                  popup.mode === 'add' ? 'Issue Certificate' : 'Save Changes'
                }
                variant="primary"
                icon="check"
                onClick={handleSave}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
