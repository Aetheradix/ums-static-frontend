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
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

interface SnagItem {
  id: string;
  description: string;
  location: string;
  severity: 'Critical' | 'Major' | 'Minor';
  rectified: boolean;
  verifiedByAE: boolean;
}

interface InspectionMember {
  designation: string;
  name: string;
  department: string;
  signed: boolean;
}

interface QualityCheckItem {
  testName: string;
  standard: string;
  result: 'Pass' | 'Fail' | 'Pending';
  certificateRef: string;
}

interface CCRequestItem {
  id: string;
  workId: string;
  workNo: string;
  workName: string;
  status: 'Pending' | 'Joint Inspected' | 'Certificate Issued';
  actualCompletionDate: string;
  certificateNo: string;
  issueDate: string;
  adminRemarks: string;
  dlpDurationMonths: number;
  userDepartment: string;
  estateOfficer: string;
  committeeMembers: InspectionMember[];
  snags: SnagItem[];
  qualityChecks: QualityCheckItem[];
}

const INITIAL_CC_REQUESTS: CCRequestItem[] = [
  {
    id: 'cc_1',
    workId: '1',
    workNo: 'CW-2025-001',
    workName: 'New Academic Block – Science Wing',
    status: 'Pending',
    actualCompletionDate: '2026-06-15',
    certificateNo: '',
    issueDate: '',
    adminRemarks: '',
    dlpDurationMonths: 12,
    userDepartment: 'Faculty of Science & Technology',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Amit Patel',
        department: 'Sub-Division 1',
        signed: true,
      },
      {
        designation: 'Structural Consultant',
        name: 'Dr. P. N. Rao',
        department: 'External Consultant',
        signed: true,
      },
      {
        designation: 'Project Architect',
        name: 'Ar. Sunita Mehta',
        department: 'Design Studio Bhopal',
        signed: true,
      },
      {
        designation: 'Third Party Inspector (TPI)',
        name: 'Er. Vikas Saxena',
        department: 'RITES Limited',
        signed: true,
      },
      {
        designation: 'User Department Representative',
        name: 'Prof. A. C. Joshi',
        department: 'Dean, Science Faculty',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-01',
        description:
          'Touchup painting required near 2nd floor staircase landing',
        location: 'Block A, 2nd Floor',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
      {
        id: 'SN-02',
        description: 'Window latch adjustment in Chemistry Lab 204',
        location: 'Lab 204',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
    ],
    qualityChecks: [
      {
        testName: '28-Day Concrete Cube Compressive Strength (M25/M30)',
        standard: 'IS 456 & IS 516',
        result: 'Pass',
        certificateRef: 'IITB/CIVIL/2026/C-881',
      },
      {
        testName: 'Structural Steel Tensile & Bend Test',
        standard: 'IS 1786 (Fe 500D)',
        result: 'Pass',
        certificateRef: 'MANIT/MTL/2025/S-102',
      },
      {
        testName: 'Roof Waterproofing Ponding Test (72 Hours)',
        standard: 'CPWD Spec 22.1',
        result: 'Pass',
        certificateRef: 'RITES/QA/2026/WP-09',
      },
      {
        testName: 'Plumbing & Drainage Hydraulic Pressure Test',
        standard: 'IS 2065',
        result: 'Pass',
        certificateRef: 'UWD/PLUMB/2026/04',
      },
    ],
  },
  {
    id: 'cc_2',
    workId: '2',
    workNo: 'CW-2025-002',
    workName: 'Boys Hostel Block D – 200 Beds',
    status: 'Certificate Issued',
    actualCompletionDate: '2026-05-10',
    certificateNo: 'COMP/CW/2026/024',
    issueDate: '2026-05-12',
    adminRemarks:
      'Inspected and certified by Chief Engineer. Handover deed executed with Chief Warden.',
    dlpDurationMonths: 24,
    userDepartment: 'Hostel Administration & Chief Warden Office',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Amit Patel',
        department: 'Sub-Division 1',
        signed: true,
      },
      {
        designation: 'Third Party Inspector (TPI)',
        name: 'Er. M. K. Gupta',
        department: 'SGS India Pvt Ltd',
        signed: true,
      },
      {
        designation: 'Chief Warden',
        name: 'Prof. R. S. Rathore',
        department: 'University Hostels',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-03',
        description: 'Mess kitchen exhaust duct sealing',
        location: 'Ground Floor Dining',
        severity: 'Minor',
        rectified: true,
        verifiedByAE: true,
      },
    ],
    qualityChecks: [
      {
        testName: '28-Day Concrete Cube Test',
        standard: 'IS 456:2000',
        result: 'Pass',
        certificateRef: 'MANIT/2026/CC-99',
      },
      {
        testName: 'Sanitary Fixtures Leakage Check',
        standard: 'CPWD Spec',
        result: 'Pass',
        certificateRef: 'UWD/SAN/2026/12',
      },
    ],
  },
  {
    id: 'cc_3',
    workId: '3',
    workNo: 'CW-2025-003',
    workName: 'Internal Campus Road Resurfacing',
    status: 'Pending',
    actualCompletionDate: '2026-07-01',
    certificateNo: '',
    issueDate: '',
    adminRemarks: '',
    dlpDurationMonths: 12,
    userDepartment: 'Estate & Campus Maintenance Section',
    estateOfficer: 'Dr. S. K. Verma (Estate Officer)',
    committeeMembers: [
      {
        designation: 'Executive Engineer (Civil)',
        name: 'Er. R. K. Sharma',
        department: 'University Works Division',
        signed: true,
      },
      {
        designation: 'Assistant Engineer (Civil)',
        name: 'Er. Priya Sen',
        department: 'Sub-Division 2',
        signed: true,
      },
      {
        designation: 'TPI Inspector',
        name: 'Er. S. Nair',
        department: 'WAPCOS Ltd',
        signed: true,
      },
    ],
    snags: [
      {
        id: 'SN-04',
        description:
          'Road berm leveling and curb stone painting along Gate 3 stretch',
        location: 'Gate 3 Avenue',
        severity: 'Critical',
        rectified: false,
        verifiedByAE: false,
      },
    ],
    qualityChecks: [
      {
        testName: 'Bitumen Density & Core Cutter Test',
        standard: 'MoRTH Sec 500',
        result: 'Pass',
        certificateRef: 'PWD/LAB/2026/R-401',
      },
      {
        testName: 'Pavement Unevenness / Roughness Index (IRI)',
        standard: 'IRC:SP:16',
        result: 'Pass',
        certificateRef: 'WAPCOS/QA/2026/02',
      },
    ],
  },
];

export default function CompletionCertificate() {
  const [works, setWorks] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : civilWorks;
  });

  const [ccRequests, setCcRequests] = useState<CCRequestItem[]>(() => {
    const saved = localStorage.getItem('civil_cc_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CC_REQUESTS;
  });

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'certify';
    item?: CCRequestItem;
  }>({ mode: 'closed' });

  const [certNo, setCertNo] = useState('');
  const [certRemarks, setCertRemarks] = useState('');
  const [dlpMonths, setDlpMonths] = useState(12);
  const [handoverDept, setHandoverDept] = useState('');
  const [estateOfficer, setEstateOfficer] = useState(
    'Dr. S. K. Verma (Estate Officer)'
  );

  useEffect(() => {
    localStorage.setItem('civil_cc_requests', JSON.stringify(ccRequests));
  }, [ccRequests]);

  const openCertifyModal = (item: CCRequestItem) => {
    setCertNo(
      `COMP/CW/${new Date().getFullYear()}/${String(Math.floor(100 + Math.random() * 900))}`
    );
    setCertRemarks(
      item.adminRemarks ||
        'Joint inspection completed satisfactorily. All critical snags rectified and quality tests verified.'
    );
    setDlpMonths(item.dlpDurationMonths || 12);
    setHandoverDept(item.userDepartment || 'Estate Section / User Department');
    setEstateOfficer(item.estateOfficer || 'Dr. S. K. Verma (Estate Officer)');
    setPopup({ mode: 'certify', item });
  };

  // Toggle snag rectification
  const toggleSnagRectified = (snagId: string) => {
    if (!popup.item) return;
    const updatedSnags = popup.item.snags.map(s =>
      s.id === snagId
        ? { ...s, rectified: !s.rectified, verifiedByAE: !s.rectified }
        : s
    );
    const updatedItem = { ...popup.item, snags: updatedSnags };
    setPopup({ ...popup, item: updatedItem });
    setCcRequests(prev =>
      prev.map(r => (r.id === updatedItem.id ? updatedItem : r))
    );
    ToastService.info('Snag resolution status updated.');
  };

  // Handle final CC issuance
  const handleCertify = () => {
    if (!certNo.trim()) {
      ToastService.error('Certificate number is required.');
      return;
    }
    if (!popup.item) return;

    // RULE: Cannot issue CC if there are unrectified snags
    const hasUnresolvedSnags = popup.item.snags.some(
      s => !s.rectified || !s.verifiedByAE
    );
    if (hasUnresolvedSnags) {
      ToastService.error(
        'BLOCKER: Cannot issue Completion Certificate! All punch list / snag items must be rectified by contractor and verified by AE first.'
      );
      return;
    }

    // Update CC request status
    const updatedRequests = ccRequests.map((r: CCRequestItem) =>
      r.id === popup.item!.id
        ? {
            ...r,
            status: 'Certificate Issued' as const,
            certificateNo: certNo,
            issueDate: new Date().toISOString().split('T')[0],
            adminRemarks: certRemarks,
            dlpDurationMonths: dlpMonths,
            userDepartment: handoverDept,
            estateOfficer: estateOfficer,
          }
        : r
    );
    setCcRequests(updatedRequests);

    // Update civil_works status to 'DLP Active'
    const updatedWorks = works.map((w: any) =>
      w.id === popup.item!.workId || w.workId === popup.item!.workId
        ? { ...w, status: 'DLP Active' as any }
        : w
    );
    setWorks(updatedWorks);
    localStorage.setItem('civil_works', JSON.stringify(updatedWorks));

    ToastService.success(
      `Completion Certificate ${certNo} issued! Handed over to ${handoverDept}. DLP timer (${dlpMonths} months) initiated.`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="Project Completion Certificate & Handover"
      description="Joint Technical Inspection Committee audit, snag list clearance blocker checks, mandatory quality tests verification, and asset handover to Estate Section / Using Department."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Admin Login', to: civilUrls.adminMenu },
        { label: 'Completion Certificate' },
      ]}
    >
      {/* Criteria alert */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.875rem',
          padding: '0.875rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#15803d',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <i
          className="pi pi-check-circle"
          style={{ fontSize: '1.25rem', color: '#16a34a' }}
        />
        <div>
          <strong>CPWD Statutory Completion Criteria:</strong> Formal Completion
          Certificate is issued only after: (a) 100% physical progress
          completed, (b) Joint Inspection Committee sign-off, (c) 100% snag
          items rectified and verified, and (d) all structural quality tests
          cleared. Issuance automatically starts the legal Defect Liability
          Period (DLP).
        </div>
      </div>

      <FormCard>
        <GridPanel
          data={ccRequests}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'workNo',
              header: 'Work No',
              cell: (r: CCRequestItem) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {r.workNo}
                </span>
              ),
            },
            { field: 'workName', header: 'Work Name' },
            {
              field: 'userDepartment',
              header: 'Using Department / Handover',
              cell: (r: CCRequestItem) => (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>
                    {r.userDepartment}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    Estate: {r.estateOfficer}
                  </div>
                </div>
              ),
            },
            {
              field: 'snags' as any,
              header: 'Snag Status (Blocker)',
              cell: (r: CCRequestItem) => {
                const totalSnags = r.snags.length;
                const openSnags = r.snags.filter(
                  s => !s.rectified || !s.verifiedByAE
                ).length;
                return (
                  <div>
                    {openSnags > 0 ? (
                      <span
                        className="civil-pill red"
                        style={{ fontWeight: 700, fontSize: '0.7rem' }}
                      >
                        {openSnags} Open Snag(s) ⚠
                      </span>
                    ) : (
                      <span
                        className="civil-pill green"
                        style={{ fontSize: '0.7rem' }}
                      >
                        All {totalSnags} Cleared ✓
                      </span>
                    )}
                  </div>
                );
              },
            },
            {
              field: 'qualityChecks' as any,
              header: 'Quality Test Audit',
              cell: (r: CCRequestItem) => {
                const allPassed = r.qualityChecks.every(
                  q => q.result === 'Pass'
                );
                return (
                  <span
                    className={`civil-pill ${allPassed ? 'green' : 'amber'}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {allPassed
                      ? `${r.qualityChecks.length} Passed ✓`
                      : 'Tests Pending'}
                  </span>
                );
              },
            },
            {
              field: 'actualCompletionDate',
              header: 'Completion Date',
              cell: (r: CCRequestItem) => (
                <span style={{ fontSize: '0.78rem' }}>
                  {r.actualCompletionDate}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (r: CCRequestItem) => (
                <StatusBadge
                  label={r.status}
                  variant={
                    r.status === 'Certificate Issued' ? 'approved' : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Action',
              sortable: false,
              cell: (r: CCRequestItem) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    title="View Joint Inspection Dossier"
                    onClick={() => setPopup({ mode: 'view', item: r })}
                  />
                  {r.status !== 'Certificate Issued' ? (
                    <Button
                      size="small"
                      label="Inspect & Certify"
                      icon="star"
                      variant="primary"
                      onClick={() => openCertifyModal(r)}
                    />
                  ) : (
                    <span
                      className="civil-pill green"
                      style={{ fontSize: '0.65rem', alignSelf: 'center' }}
                    >
                      {r.certificateNo}
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search completion requests, departments, works..."
        />
      </FormCard>

      {/* POPUP: VIEW OR CERTIFY COMPLETION */}
      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'certify'
            ? `Issue Completion Certificate — ${popup.item?.workNo}`
            : `Completion & Handover Dossier — ${popup.item?.workNo}`
        }
        subtitle="Verification of Joint Inspection Committee, Snag Rectifications, Quality Standards, and Estate Handover."
        size="lg"
      >
        {popup.item && (
          <div>
            {/* Header summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1.5rem',
                fontSize: '0.8125rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Work
                </span>
                <div style={{ fontWeight: 600 }}>{popup.item.workName}</div>
              </div>
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Completion Date
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.actualCompletionDate}
                </div>
              </div>
              <div>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Certificate Status
                </span>
                <div>
                  <StatusBadge
                    label={popup.item.status}
                    variant={
                      popup.item.status === 'Certificate Issued'
                        ? 'approved'
                        : 'pending'
                    }
                  />
                </div>
              </div>
            </div>

            {/* PART 1: SNAG LIST TRACKING (BLOCKER CHECK) */}
            <div
              style={{
                border: '1px solid #fecaca',
                background: '#fffbfb',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <i className="pi pi-exclamation-triangle" />
                  <span>
                    Punch List / Snag List Tracking (Mandatory Clearance
                    Blocker)
                  </span>
                </h4>
                {popup.item.snags.some(s => !s.rectified || !s.verifiedByAE) ? (
                  <span className="civil-pill red" style={{ fontWeight: 700 }}>
                    Blocking Certificate Issuance
                  </span>
                ) : (
                  <span className="civil-pill green">All Snags Cleared ✓</span>
                )}
              </div>

              <table
                className="civil-table"
                style={{ width: '100%', fontSize: '0.78rem' }}
              >
                <thead>
                  <tr style={{ background: '#fee2e2' }}>
                    <th>ID</th>
                    <th>Snag Description</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Rectified by Contractor</th>
                    <th>Verified by AE</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {popup.item.snags.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {s.id}
                      </td>
                      <td>{s.description}</td>
                      <td>{s.location}</td>
                      <td>
                        <span
                          className={`civil-pill ${s.severity === 'Critical' ? 'red' : 'amber'}`}
                        >
                          {s.severity}
                        </span>
                      </td>
                      <td>
                        {s.rectified ? (
                          <span style={{ color: '#15803d', fontWeight: 600 }}>
                            ✓ Rectified
                          </span>
                        ) : (
                          <span style={{ color: '#b91c1c', fontWeight: 600 }}>
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {s.verifiedByAE ? (
                          <span style={{ color: '#15803d', fontWeight: 600 }}>
                            ✓ Verified
                          </span>
                        ) : (
                          <span style={{ color: '#d97706', fontWeight: 600 }}>
                            Pending AE Check
                          </span>
                        )}
                      </td>
                      <td>
                        <Button
                          size="small"
                          label={
                            s.rectified
                              ? 'Mark Unresolved'
                              : 'Mark Rectified & Verified'
                          }
                          variant={s.rectified ? 'outlined' : 'success'}
                          onClick={() => toggleSnagRectified(s.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PART 2: MANDATORY QUALITY TESTS VERIFICATION */}
            <div
              style={{
                border: '1px solid #bbf7d0',
                background: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="pi pi-check-circle" />
                <span>
                  Mandatory Structural Quality Tests Verification (IS & CPWD
                  Codes)
                </span>
              </h4>
              <table
                className="civil-table"
                style={{ width: '100%', fontSize: '0.78rem' }}
              >
                <thead>
                  <tr style={{ background: '#dcfce7' }}>
                    <th>Test Name & Material</th>
                    <th>Code / Standard</th>
                    <th>Lab Report Reference</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {popup.item.qualityChecks.map((q, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{q.testName}</td>
                      <td style={{ fontFamily: 'monospace' }}>{q.standard}</td>
                      <td style={{ fontFamily: 'monospace', color: '#1e40af' }}>
                        {q.certificateRef}
                      </td>
                      <td>
                        <span
                          className={`civil-pill ${q.result === 'Pass' ? 'green' : 'red'}`}
                        >
                          {q.result} ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PART 3: JOINT INSPECTION COMMITTEE */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="pi pi-users" />
                <span>Joint Technical Inspection Committee Sign-Off</span>
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {popup.item.committeeMembers.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      background: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {m.designation} ({m.department})
                      </div>
                    </div>
                    <span
                      className="civil-pill green"
                      style={{ fontSize: '0.65rem' }}
                    >
                      ✓ Signed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PART 4: CERTIFICATION & HANDOVER FORM */}
            {popup.mode === 'certify' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  Handover & Defect Liability Period (DLP) Parameters
                </h4>

                <FormGrid columns={3}>
                  <TextBox
                    label="Completion Certificate No *"
                    value={certNo}
                    onChange={setCertNo}
                    required
                  />
                  <DropDownList
                    label="DLP Duration Period *"
                    data={[
                      { label: '12 Months (Standard Civil Works)', value: 12 },
                      { label: '24 Months (Buildings / Hostels)', value: 24 },
                      {
                        label: '36 Months (Major Campus Infrastructure)',
                        value: 36,
                      },
                      {
                        label: '60 Months (Waterproofing / Structural)',
                        value: 60,
                      },
                    ]}
                    textField="label"
                    optionValue="value"
                    value={dlpMonths}
                    onChange={val => setDlpMonths(Number(val))}
                    required
                  />
                  <TextBox
                    label="Handover / Taking Over Date *"
                    value={new Date().toISOString().split('T')[0]}
                    onChange={() => {}}
                    disabled
                  />
                </FormGrid>

                <FormGrid columns={2}>
                  <TextBox
                    label="Taking-Over Department / Faculty *"
                    placeholder="Faculty of Science & Technology"
                    value={handoverDept}
                    onChange={setHandoverDept}
                    required
                  />
                  <TextBox
                    label="Estate Officer / Custodian *"
                    value={estateOfficer}
                    onChange={setEstateOfficer}
                    required
                  />
                </FormGrid>

                <TextArea
                  label="Official Inspection & Certification Remarks *"
                  placeholder="Summary of joint inspection findings, taking-over note, key handover..."
                  value={certRemarks}
                  onChange={setCertRemarks}
                  rows={2}
                />

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    label="Cancel"
                    variant="outlined"
                    onClick={() => setPopup({ mode: 'closed' })}
                  />
                  <Button
                    label="Issue Official Completion Certificate"
                    variant="primary"
                    icon="star"
                    onClick={handleCertify}
                  />
                </div>
              </div>
            )}

            {popup.mode === 'view' && (
              <div className="flex justify-end mt-4">
                <Button
                  label="Close"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'closed' })}
                />
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
