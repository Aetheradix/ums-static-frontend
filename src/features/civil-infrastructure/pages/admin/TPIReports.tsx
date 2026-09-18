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
import { civilWorks as initialWorks, initialTPIAgencies } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const STORAGE_KEY = 'civil_tpi_reports';

const INITIAL_REPORTS: CivilManagement.TPIInspectionReport[] = [
  {
    id: 'TPI-REP-01',
    reportNo: 'TPI/RITES/2025/08',
    workId: '1',
    workName: 'New Academic Block – Science Wing',
    tpiAgencyId: 'TPI-01',
    tpiAgencyName: 'RITES Limited',
    tpiEngineerName: 'Er. A.K. Sharma (Chief Quality Auditor)',
    visitDate: '2025-01-28',
    milestoneId: 'M-02',
    milestoneName: 'First Floor Slab & Column Casting',
    physicalProgressObserved: 42,
    qualityObservations:
      'Curing of columns satisfactory. Steel cover blocks spacing adequate. Rebound hammer testing on 3 sample columns shows compressive strength > 28 N/mm².',
    overallRating: 'Satisfactory',
    nextVisitDate: '2025-02-28',
    status: 'Acknowledged',
    nonConformances: [
      {
        id: 'NCR-01',
        reportId: 'TPI-REP-01',
        description:
          'Honeycombing observed near beam-column junction on Grid C-4.',
        location: 'Zone A, First Floor Grid C-4',
        severity: 'Minor',
        photoCount: 3,
        atrSubmittedDate: '2025-02-02',
        atrDescription:
          'Chipped loose aggregate, pressure grouted with non-shrink polymer modified mortar.',
        closedDate: '2025-02-04',
        status: 'Closed',
      },
    ],
  },
  {
    id: 'TPI-REP-02',
    reportNo: 'TPI/SGS/2025/14',
    workId: '2',
    workName: 'Boys Hostel Block D – 200 Beds',
    tpiAgencyId: 'TPI-02',
    tpiAgencyName: 'SGS India Pvt Ltd',
    tpiEngineerName: 'Mr. Vivek Patel (Lead Civil Inspector)',
    visitDate: '2025-02-15',
    milestoneId: 'M-01',
    milestoneName: 'Plinth Beam & Earth Backfilling',
    physicalProgressObserved: 18,
    qualityObservations:
      'Compaction of backfill earth in plinth below specified 95% MDD in northern wing.',
    overallRating: 'Needs Improvement',
    nextVisitDate: '2025-03-01',
    status: 'Submitted',
    nonConformances: [
      {
        id: 'NCR-02',
        reportId: 'TPI-REP-02',
        description:
          'Earth backfilling compaction density 89% against 95% Procter density requirement.',
        location: 'Northern wing rooms 101-106 plinth',
        severity: 'Major',
        photoCount: 4,
        status: 'Open',
      },
    ],
  },
];

export default function TPIReports() {
  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [tpiAgencies] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_tpi_agencies');
    return saved ? JSON.parse(saved) : initialTPIAgencies;
  });

  const [data, setData] = useState<CivilManagement.TPIInspectionReport[]>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    }
  );

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'add' | 'view' | 'ncr';
    item?: CivilManagement.TPIInspectionReport;
    selectedNcr?: CivilManagement.NonConformance;
  }>({ mode: 'closed' });

  // Form states
  const [formWorkId, setFormWorkId] = useState('');
  const [formAgencyId, setFormAgencyId] = useState('');
  const [formEngineer, setFormEngineer] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formMilestone, setFormMilestone] = useState('');
  const [formProgress, setFormProgress] = useState('35');
  const [formRating, setFormRating] = useState<
    'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory'
  >('Satisfactory');
  const [formObservations, setFormObservations] = useState('');

  // NCR form state
  const [ncrDesc, setNcrDesc] = useState('');
  const [ncrLocation, setNcrLocation] = useState('');
  const [ncrSeverity, setNcrSeverity] =
    useState<CivilManagement.NCRSeverity>('Minor');

  // ATR form state
  const [atrDesc, setAtrDesc] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const openAdd = () => {
    const w = works[0];
    const a = tpiAgencies[0];
    setFormWorkId(w?.id || '1');
    setFormAgencyId(a?.id || 'TPI-01');
    setFormEngineer('Er. A.K. Sharma (Chief Quality Auditor)');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormMilestone('Milestone Inspection / Structural Audit');
    setFormProgress('30');
    setFormRating('Satisfactory');
    setFormObservations('');
    setPopup({ mode: 'add' });
  };

  const openView = (item: CivilManagement.TPIInspectionReport) => {
    setPopup({ mode: 'view', item });
  };

  const openNcrModal = (
    item: CivilManagement.TPIInspectionReport,
    ncr?: CivilManagement.NonConformance
  ) => {
    setNcrDesc(ncr?.description || '');
    setNcrLocation(ncr?.location || '');
    setNcrSeverity(ncr?.severity || 'Minor');
    setAtrDesc(ncr?.atrDescription || '');
    setPopup({ mode: 'ncr', item, selectedNcr: ncr });
  };

  const handleSaveReport = () => {
    if (!formObservations.trim() || !formEngineer.trim()) {
      ToastService.error(
        'Inspection observations and auditor name are required.'
      );
      return;
    }
    const w = works.find(x => x.id === formWorkId);
    const a = tpiAgencies.find(x => x.id === formAgencyId);

    const newReport: CivilManagement.TPIInspectionReport = {
      id: `TPI-REP-${Date.now().toString().slice(-4)}`,
      reportNo: `TPI/${a?.name?.slice(0, 5).toUpperCase() || 'QA'}/${new Date().getFullYear()}/${String(data.length + 1).padStart(2, '0')}`,
      workId: formWorkId,
      workName: w?.name || 'Selected Civil Work',
      tpiAgencyId: formAgencyId,
      tpiAgencyName: a?.name || 'TPI Agency',
      tpiEngineerName: formEngineer.trim(),
      visitDate: formDate,
      milestoneName: formMilestone.trim(),
      physicalProgressObserved: parseInt(formProgress, 10) || 0,
      qualityObservations: formObservations.trim(),
      overallRating: formRating,
      status: 'Submitted',
      nonConformances: [],
    };

    setData(prev => [newReport, ...prev]);
    ToastService.success(
      `TPI Inspection Report #${newReport.reportNo} registered.`
    );
    setPopup({ mode: 'closed' });
  };

  const handleAddNCR = () => {
    if (!ncrDesc.trim() || !ncrLocation.trim() || !popup.item) {
      ToastService.error('NCR Description and Location are required.');
      return;
    }

    const newNcr: CivilManagement.NonConformance = {
      id: `NCR-${Date.now().toString().slice(-4)}`,
      reportId: popup.item.id,
      description: ncrDesc.trim(),
      location: ncrLocation.trim(),
      severity: ncrSeverity,
      photoCount: 2,
      status: 'Open',
    };

    setData(prev =>
      prev.map(r =>
        r.id === popup.item!.id
          ? { ...r, nonConformances: [...(r.nonConformances || []), newNcr] }
          : r
      )
    );
    ToastService.warn(`Non-Conformance (${ncrSeverity}) logged.`);
    setPopup({ mode: 'closed' });
  };

  const handleSaveATR = (reportId: string, ncrId: string) => {
    if (!atrDesc.trim()) {
      ToastService.error('Action Taken Report description is required.');
      return;
    }

    setData(prev =>
      prev.map(r =>
        r.id === reportId
          ? {
              ...r,
              nonConformances: r.nonConformances.map(n =>
                n.id === ncrId
                  ? {
                      ...n,
                      atrDescription: atrDesc.trim(),
                      atrSubmittedDate: new Date().toISOString().split('T')[0],
                      closedDate: new Date().toISOString().split('T')[0],
                      status: 'Closed',
                    }
                  : n
              ),
            }
          : r
      )
    );
    ToastService.success('Action Taken Report recorded. NCR closed.');
    setPopup({ mode: 'closed' });
  };

  const acknowledgeReport = (reportId: string) => {
    setData(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'Acknowledged' } : r))
    );
    ToastService.success(
      'TPI Inspection Report acknowledged by Administration.'
    );
  };

  return (
    <FormPage
      title="Third Party Inspection (TPI) Reports & Quality Audits"
      description="Independent technical quality assurance audits, Non-Conformance Reports (NCRs), and Contractor Action Taken Reports (ATRs)."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'TPI Reports' },
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
          label="Log TPI Inspection Visit"
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
              field: 'reportNo',
              header: 'Report Ref',
              cell: (item: CivilManagement.TPIInspectionReport) => (
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#1d4ed8',
                    }}
                  >
                    {item.reportNo}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    Date: {item.visitDate}
                  </div>
                </div>
              ),
              width: '150px',
            },
            {
              field: 'workName',
              header: 'Civil Work & Stage',
              cell: (item: CivilManagement.TPIInspectionReport) => (
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
                    Audited: {item.milestoneName || 'General Progress'}
                  </div>
                </div>
              ),
            },
            {
              field: 'tpiAgencyName',
              header: 'Auditing Agency',
              cell: (item: CivilManagement.TPIInspectionReport) => (
                <div>
                  <span
                    className="civil-pill blue"
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.tpiAgencyName}
                  </span>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {item.tpiEngineerName}
                  </div>
                </div>
              ),
            },
            {
              field: 'overallRating',
              header: 'Audit Rating',
              cell: (item: CivilManagement.TPIInspectionReport) => {
                const color =
                  item.overallRating === 'Satisfactory'
                    ? 'green'
                    : item.overallRating === 'Needs Improvement'
                      ? 'amber'
                      : 'red';
                return (
                  <span
                    className={`civil-pill ${color}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {item.overallRating}
                  </span>
                );
              },
            },
            {
              field: 'nonConformances',
              header: 'Non-Conformances',
              cell: (item: CivilManagement.TPIInspectionReport) => {
                const openCount =
                  item.nonConformances?.filter(n => n.status !== 'Closed')
                    .length || 0;
                return (
                  <div>
                    {openCount > 0 ? (
                      <span
                        className="civil-pill red"
                        style={{ fontSize: '0.72rem' }}
                      >
                        {openCount} Open NCR(s)
                      </span>
                    ) : (
                      <span
                        className="civil-pill green"
                        style={{ fontSize: '0.72rem' }}
                      >
                        All NCRs Closed
                      </span>
                    )}
                  </div>
                );
              },
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: CivilManagement.TPIInspectionReport) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Acknowledged' ? 'approved' : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: CivilManagement.TPIInspectionReport) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => openView(item)}
                    title="View Inspection Report"
                  />
                  <Button
                    size="small"
                    label="Add NCR"
                    icon="exclamation-circle"
                    variant="outlined"
                    onClick={() => openNcrModal(item)}
                    title="Log Non-Conformance"
                  />
                  {item.status !== 'Acknowledged' && (
                    <Button
                      size="small"
                      label="Acknowledge"
                      icon="check"
                      variant="primary"
                      onClick={() => acknowledgeReport(item.id)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search TPI inspection reports..."
        />
      </FormCard>

      {/* POPUP MODALS */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'view'
            ? `TPI Inspection Dossier — ${popup.item?.reportNo}`
            : popup.mode === 'add'
              ? 'Log TPI Inspection Visit'
              : popup.selectedNcr
                ? `Action Taken Report (ATR) — ${popup.selectedNcr.id}`
                : `Log Non-Conformance (NCR) — ${popup.item?.reportNo}`
        }
        subtitle="Independent quality audit findings, non-conformance records, and rectification proofs."
        size="lg"
      >
        {popup.mode === 'view' ? (
          /* View Details Modal with Non-Conformances List */
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
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Report Ref
                </span>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                  }}
                >
                  {popup.item?.reportNo}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Inspection Date
                </span>
                <div style={{ fontWeight: 600, color: '#111827' }}>
                  {popup.item?.visitDate}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Quality Rating
                </span>
                <div>
                  <span
                    className={`civil-pill ${popup.item?.overallRating === 'Satisfactory' ? 'green' : 'amber'}`}
                  >
                    {popup.item?.overallRating}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Civil Work Scheme
              </span>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginTop: '2px',
                }}
              >
                {popup.item?.workName}
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                padding: '0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                lineHeight: 1.8,
              }}
            >
              <div>
                <strong>TPI Agency:</strong> {popup.item?.tpiAgencyName}
              </div>
              <div>
                <strong>Auditor:</strong> {popup.item?.tpiEngineerName}
              </div>
              <div>
                <strong>Stage Audited:</strong> {popup.item?.milestoneName}
              </div>
              <div>
                <strong>Physical Progress Observed:</strong>{' '}
                {popup.item?.physicalProgressObserved}%
              </div>
              <div>
                <strong>Quality Observations:</strong>{' '}
                {popup.item?.qualityObservations}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                Non-Conformance Reports (NCRs) (
                {popup.item?.nonConformances?.length || 0})
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {popup.item?.nonConformances?.map(ncr => (
                  <div
                    key={ncr.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      background:
                        ncr.status === 'Closed' ? '#f0fdf4' : '#fef2f2',
                      border:
                        ncr.status === 'Closed'
                          ? '1px solid #bbf7d0'
                          : '1px solid #fecaca',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{ncr.id}</strong> —{' '}
                        <span style={{ color: '#111827' }}>
                          {ncr.description}
                        </span>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: '#6b7280',
                            marginTop: '2px',
                          }}
                        >
                          Location: {ncr.location} • Severity:{' '}
                          <strong>{ncr.severity}</strong>
                        </div>
                      </div>
                      <StatusBadge
                        label={ncr.status}
                        variant={
                          ncr.status === 'Closed' ? 'approved' : 'rejected'
                        }
                      />
                    </div>

                    {ncr.atrDescription && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px dashed #cbd5e1',
                          fontSize: '0.75rem',
                          color: '#166534',
                        }}
                      >
                        <strong>Action Taken Report (ATR):</strong>{' '}
                        {ncr.atrDescription} (Closed on: {ncr.closedDate})
                      </div>
                    )}

                    {ncr.status === 'Open' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <Button
                          size="small"
                          label="Submit ATR & Close NCR"
                          variant="primary"
                          onClick={() => openNcrModal(popup.item!, ncr)}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {(!popup.item?.nonConformances ||
                  popup.item.nonConformances.length === 0) && (
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                    No non-conformances observed during this visit.
                  </div>
                )}
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
        ) : popup.mode === 'add' ? (
          /* Log Report Form */
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
                label="Civil Work Scheme *"
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
              <DropDownList
                label="Empaneled TPI Agency *"
                data={tpiAgencies.map(a => ({ label: a.name, value: a.id }))}
                textField="label"
                optionValue="value"
                value={formAgencyId}
                onChange={val => setFormAgencyId(val as string)}
                required
              />
            </FormGrid>

            <FormGrid columns={3}>
              <TextBox
                label="Auditor / Lead Inspector Name *"
                placeholder="Er. A.K. Sharma"
                value={formEngineer}
                onChange={setFormEngineer}
                required
              />
              <TextBox
                label="Inspection Date *"
                placeholder="YYYY-MM-DD"
                value={formDate}
                onChange={setFormDate}
                required
              />
              <DropDownList
                label="Overall Quality Rating *"
                data={[
                  {
                    label: 'Satisfactory (Good Quality)',
                    value: 'Satisfactory',
                  },
                  {
                    label: 'Needs Improvement (Observations noted)',
                    value: 'Needs Improvement',
                  },
                  {
                    label: 'Unsatisfactory (Critical non-conformance)',
                    value: 'Unsatisfactory',
                  },
                ]}
                textField="label"
                optionValue="value"
                value={formRating}
                onChange={val => setFormRating(val as any)}
                required
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Milestone / Component Audited"
                placeholder="e.g. Ground Floor Slab & Column Casting"
                value={formMilestone}
                onChange={setFormMilestone}
              />
              <TextBox
                label="Physical Progress Observed (%)"
                placeholder="40"
                value={formProgress}
                onChange={setFormProgress}
              />
            </FormGrid>

            <TextArea
              label="Detailed Technical Observations *"
              placeholder="Record slump test, concrete compaction, curing frequency, rebar lap lengths, and batch plant inspection findings..."
              value={formObservations}
              onChange={setFormObservations}
              rows={3}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Submit TPI Report"
                variant="primary"
                icon="check"
                onClick={handleSaveReport}
              />
            </div>
          </div>
        ) : popup.selectedNcr ? (
          /* Submit ATR Form */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
              }}
            >
              <strong>Non-Conformance:</strong> {popup.selectedNcr.description}
              <br />
              <strong>Location:</strong> {popup.selectedNcr.location} (Severity:{' '}
              {popup.selectedNcr.severity})
            </div>

            <TextArea
              label="Contractor Action Taken Report (ATR) & Rectification Description *"
              placeholder="Describe corrective actions taken, non-destructive test results post repair, and preventive measures implemented..."
              value={atrDesc}
              onChange={setAtrDesc}
              rows={3}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Submit ATR & Close NCR"
                variant="primary"
                icon="check"
                onClick={() =>
                  handleSaveATR(popup.item!.id, popup.selectedNcr!.id)
                }
              />
            </div>
          </div>
        ) : (
          /* Log New NCR Form */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <TextBox
              label="Non-Conformance Defect Description *"
              placeholder="e.g. Inadequate concrete cover on soffit of beam B-12"
              value={ncrDesc}
              onChange={setNcrDesc}
              required
            />
            <FormGrid columns={2}>
              <TextBox
                label="Defect Location / Grid Coordinates *"
                placeholder="Zone B, Grid 3-4 at First Floor"
                value={ncrLocation}
                onChange={setNcrLocation}
                required
              />
              <DropDownList
                label="Defect Severity Tier *"
                data={[
                  { label: 'Observation (Procedural)', value: 'Observation' },
                  {
                    label: 'Minor (Surface defects/honeycomb)',
                    value: 'Minor',
                  },
                  { label: 'Major (Structural deficiency)', value: 'Major' },
                  {
                    label: 'Critical (Safety/bearing compromise)',
                    value: 'Critical',
                  },
                ]}
                textField="label"
                optionValue="value"
                value={ncrSeverity}
                onChange={val => setNcrSeverity(val as any)}
                required
              />
            </FormGrid>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
              <Button
                label="Log Non-Conformance"
                variant="danger"
                icon="check"
                onClick={handleAddNCR}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
