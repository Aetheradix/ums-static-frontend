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
import {
  dlpRecords as initialDlp,
  civilWorks as initialWorks,
  type DLPRecord,
  type DLPDefectItem,
} from '../../mocks';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../civilStorage';
import { civilUrls } from '../../urls';
import '../civil.css';

export default function DLPMonitoring() {
  const [works, setWorks] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.WORKS,
    initialWorks
  );

  const [dlp, setDlp] = useCivilStorage<DLPRecord[]>(
    CIVIL_STORAGE_KEYS.DLP_RECORDS,
    initialDlp
  );

  // Modal states
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'view' | 'defect' | 'release';
    item?: DLPRecord;
  }>({ mode: 'closed' });

  // Defect logging form state
  const [defectForm, setDefectForm] = useState<{
    category: DLPDefectItem['defectCategory'];
    description: string;
    location: string;
    reportedDate: string;
    contractorNotifiedDate: string;
    rectificationDeadline: string;
  }>({
    category: 'Crack',
    description: '',
    location: '',
    reportedDate: new Date().toISOString().split('T')[0],
    contractorNotifiedDate: new Date().toISOString().split('T')[0],
    rectificationDeadline: new Date(Date.now() + 15 * 86400000)
      .toISOString()
      .split('T')[0],
  });

  // Retention release form state
  const [releaseForm, setReleaseForm] = useState<{
    orderNo: string;
    releaseDate: string;
    amount: number;
    penaltyDeduction: number;
    paymentRef: string;
    authorizedBy: string;
    remarks: string;
  }>({
    orderNo: '',
    releaseDate: new Date().toISOString().split('T')[0],
    amount: 0,
    penaltyDeduction: 0,
    paymentRef: '',
    authorizedBy: 'Er. R. K. Sharma (Executive Engineer)',
    remarks: '',
  });

  useEffect(() => {
    localStorage.setItem('civil_dlp_records', JSON.stringify(dlp));
  }, [dlp]);

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatCurrency = (n?: number) =>
    n !== undefined ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

  // Open defect logger
  const openDefectModal = (item: DLPRecord) => {
    setDefectForm({
      category: 'Crack',
      description: '',
      location: '',
      reportedDate: new Date().toISOString().split('T')[0],
      contractorNotifiedDate: new Date().toISOString().split('T')[0],
      rectificationDeadline: new Date(Date.now() + 15 * 86400000)
        .toISOString()
        .split('T')[0],
    });
    setPopup({ mode: 'defect', item });
  };

  // Open retention release modal
  const openReleaseModal = (item: DLPRecord) => {
    const remainingDays = daysLeft(item.dlpEndDate);
    const unrectified = (item.defects || []).filter(
      d => !d.isRectified || !d.verifiedByAE
    ).length;

    if (unrectified > 0) {
      ToastService.error(
        `BLOCKER: Cannot release retention! There are ${unrectified} open/unverified defects pending contractor rectification.`
      );
    } else if (remainingDays > 0) {
      ToastService.warning(
        `Caution: DLP period has ${remainingDays} days remaining. Early retention release requires special Competent Authority sanction.`
      );
    }

    setReleaseForm({
      orderNo: `ORD/RET/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      releaseDate: new Date().toISOString().split('T')[0],
      amount: item.retentionAmount,
      penaltyDeduction: 0,
      paymentRef: `PFMS/RET/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      authorizedBy: 'Er. R. K. Sharma (Executive Engineer)',
      remarks:
        'DLP expired satisfactorily. All defects rectified and certified by AE. Retention released.',
    });
    setPopup({ mode: 'release', item });
  };

  // Save new defect
  const handleSaveDefect = () => {
    if (!popup.item) return;
    if (!defectForm.description.trim() || !defectForm.location.trim()) {
      ToastService.error('Defect description and location are required.');
      return;
    }

    const newDefect: DLPDefectItem = {
      id: `DF-${Date.now().toString().slice(-4)}`,
      defectCategory: defectForm.category,
      description: defectForm.description,
      location: defectForm.location,
      reportedDate: defectForm.reportedDate,
      contractorNotifiedDate: defectForm.contractorNotifiedDate,
      rectificationDeadline: defectForm.rectificationDeadline,
      isRectified: false,
      verifiedByAE: false,
    };

    const updated = dlp.map(d => {
      if (d.id === popup.item!.id) {
        const defectsList = [...(d.defects || []), newDefect];
        return {
          ...d,
          defects: defectsList,
          defectsReported: defectsList.length,
          defectsRectified: defectsList.filter(
            x => x.isRectified && x.verifiedByAE
          ).length,
          status: 'Defects Reported' as const,
        };
      }
      return d;
    });

    setDlp(updated);
    ToastService.success(
      `Defect reported under ${defectForm.category}. Contractor notified with 15-day deadline.`
    );
    setPopup({ mode: 'closed' });
  };

  // Toggle defect rectification & AE verification
  const handleToggleDefectResolved = (recordId: string, defectId: string) => {
    const updated = dlp.map(d => {
      if (d.id === recordId) {
        const updatedDefects = (d.defects || []).map(def => {
          if (def.id === defectId) {
            const nextState = !def.isRectified;
            return {
              ...def,
              isRectified: nextState,
              verifiedByAE: nextState,
              rectifiedDate: nextState
                ? new Date().toISOString().split('T')[0]
                : undefined,
              aeVerificationDate: nextState
                ? new Date().toISOString().split('T')[0]
                : undefined,
              aeRemarks: nextState
                ? 'Re-inspected on site. Defect successfully rectified.'
                : undefined,
            };
          }
          return def;
        });
        const resolvedCount = updatedDefects.filter(
          x => x.isRectified && x.verifiedByAE
        ).length;
        return {
          ...d,
          defects: updatedDefects,
          defectsRectified: resolvedCount,
          status:
            resolvedCount === updatedDefects.length
              ? ('Active' as const)
              : ('Rectification In Progress' as const),
        };
      }
      return d;
    });

    setDlp(updated);
    if (popup.item) {
      const refreshedItem = updated.find(x => x.id === popup.item!.id);
      setPopup({ ...popup, item: refreshedItem });
    }
    ToastService.info('Defect rectification & AE verification status updated.');
  };

  // Authorize Retention Release
  const handleAuthorizeRelease = () => {
    if (!popup.item) return;
    if (!releaseForm.orderNo.trim()) {
      ToastService.error('Release Order Number is required.');
      return;
    }

    const netRelease = releaseForm.amount - releaseForm.penaltyDeduction;

    const updated = dlp.map(d =>
      d.id === popup.item!.id
        ? {
            ...d,
            retentionReleased: true,
            retentionReleaseDate: releaseForm.releaseDate,
            releaseOrderNo: releaseForm.orderNo,
            releaseRemarks: `${releaseForm.remarks} | Net Released: ${formatCurrency(netRelease)} via ${releaseForm.paymentRef}`,
            status: 'Retention Released' as const,
          }
        : d
    );

    setDlp(updated);
    setWorks((prevWorks: any[]) =>
      prevWorks.map((w: any) =>
        String(w.id) === String(popup.item!.workId) ||
        String(w.workId) === String(popup.item!.workId)
          ? { ...w, status: 'Closed' }
          : w
      )
    );
    ToastService.success(
      `Retention Release Order ${releaseForm.orderNo} approved! Net amount ${formatCurrency(netRelease)} processed.`
    );
    setPopup({ mode: 'closed' });
  };

  return (
    <FormPage
      title="DLP Monitoring & Retention Release"
      description="Track Defect Liability Periods, log post-completion structural & architectural snags, enforce contractor rectification deadlines, and authorize Security Deposit / Retention releases."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
        { label: 'Finance & Accounts', to: civilUrls.financeMenu },
        { label: 'DLP Monitoring' },
      ]}
    >
      {/* Policy banner */}
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
          className="pi pi-shield"
          style={{ fontSize: '1.25rem', color: '#16a34a' }}
        />
        <div>
          <strong>Statutory DLP Policy & Retention Safeguard:</strong> Retention
          money (5% of contract value) is held during the full statutory Defect
          Liability Period (12 to 24 months post Completion Certificate).
          Release is strictly prohibited until: (a) DLP duration has fully
          elapsed, (b) 100% defects are rectified and certified by AE, and (c)
          formal release order is issued.
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="civil-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          {
            label: 'Active DLP Works',
            value: String(dlp.filter(d => !d.retentionReleased).length),
            color: '#d97706',
          },
          {
            label: 'Total Retention Held',
            value: `₹${(dlp.filter(d => !d.retentionReleased).reduce((s, d) => s + d.retentionAmount, 0) / 100000).toFixed(2)}L`,
            color: '#7c3aed',
          },
          {
            label: 'Total Defects Reported',
            value: String(
              dlp.reduce(
                (s, d) => s + (d.defects?.length || d.defectsReported),
                0
              )
            ),
            color: '#dc2626',
          },
          {
            label: 'Defects Rectified & Verified',
            value: String(
              dlp.reduce(
                (s, d) =>
                  s +
                  ((d.defects || []).filter(
                    x => x.isRectified && x.verifiedByAE
                  ).length || d.defectsRectified),
                0
              )
            ),
            color: '#16a34a',
          },
        ].map(s => (
          <FormCard key={s.label}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: '1.375rem', fontWeight: 800, color: s.color }}
            >
              {s.value}
            </div>
          </FormCard>
        ))}
      </div>

      {/* Grid of DLP works */}
      <FormCard title="Defect Liability Period (DLP) Works Register">
        <GridPanel
          data={dlp}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '45px' },
            {
              field: 'workId',
              header: 'Work Ref',
              cell: (d: DLPRecord) => (
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                  }}
                >
                  {works.find((w: any) => w.id === d.workId)?.workId ||
                    `CW-${d.workId}`}
                </span>
              ),
            },
            {
              field: 'workName',
              header: 'Work & Contractor',
              cell: (d: DLPRecord) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{d.workName}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    {d.contractorName || 'Registered Contractor'}
                  </div>
                </div>
              ),
            },
            {
              field: 'completionDate',
              header: 'Completion Date',
              cell: (d: DLPRecord) => (
                <span style={{ fontSize: '0.78rem' }}>{d.completionDate}</span>
              ),
            },
            {
              field: 'dlpEndDate',
              header: 'DLP Window',
              cell: (d: DLPRecord) => {
                const days = daysLeft(d.dlpEndDate);
                return (
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#4b5563' }}>
                      {d.dlpStartDate} to {d.dlpEndDate}
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color:
                          days <= 0
                            ? '#16a34a'
                            : days < 60
                              ? '#dc2626'
                              : '#d97706',
                      }}
                    >
                      {days <= 0 ? '✓ DLP Expired' : `${days} days left`}
                    </span>
                  </div>
                );
              },
            },
            {
              field: 'retentionAmount',
              header: 'Retention Held',
              cell: (d: DLPRecord) => (
                <span style={{ fontWeight: 700, color: '#7c3aed' }}>
                  {formatCurrency(d.retentionAmount)}
                </span>
              ),
            },
            {
              field: 'defectsReported',
              header: 'Defects Ledger',
              cell: (d: DLPRecord) => {
                const total = d.defects?.length ?? d.defectsReported;
                const fixed = d.defects
                  ? d.defects.filter(x => x.isRectified && x.verifiedByAE)
                      .length
                  : d.defectsRectified;
                const open = total - fixed;
                return (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>
                      {total} reported / {fixed} fixed
                    </div>
                    {open > 0 ? (
                      <span
                        className="civil-pill red"
                        style={{ fontSize: '0.65rem' }}
                      >
                        {open} Open Defect(s)
                      </span>
                    ) : (
                      <span
                        className="civil-pill green"
                        style={{ fontSize: '0.65rem' }}
                      >
                        Zero Pending ✓
                      </span>
                    )}
                  </div>
                );
              },
            },
            {
              field: 'retentionReleased',
              header: 'Retention Status',
              cell: (d: DLPRecord) =>
                d.retentionReleased ? (
                  <span className="civil-pill green">✓ Released</span>
                ) : (
                  <span className="civil-pill amber">Held in Escrow</span>
                ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (d: DLPRecord) => (
                <StatusBadge
                  label={d.status}
                  variant={
                    d.status === 'Retention Released' || d.status === 'Closed'
                      ? 'approved'
                      : d.status === 'Defects Reported'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: DLPRecord) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    title="View Defects Ledger & Dossier"
                    onClick={() => setPopup({ mode: 'view', item })}
                  />
                  {!item.retentionReleased && (
                    <>
                      <Button
                        size="small"
                        icon="plus"
                        variant="secondary"
                        title="Report New Defect"
                        onClick={() => openDefectModal(item)}
                      />
                      <Button
                        size="small"
                        label="Release SD"
                        icon="check-circle"
                        variant="primary"
                        title="Authorize Retention Release Order"
                        onClick={() => openReleaseModal(item)}
                      />
                    </>
                  )}
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search DLP works, contractors..."
        />
      </FormCard>

      {/* POPUP: VIEW DEFECTS DOSSIER */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`DLP Monitoring & Defects Ledger — ${popup.item?.workName}`}
        subtitle={`Retention Held: ${formatCurrency(popup.item?.retentionAmount)} | DLP Ends: ${popup.item?.dlpEndDate}`}
        size="lg"
      >
        {popup.item && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem 1rem',
                fontSize: '0.8125rem',
                padding: '0.875rem 1rem',
                background: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                  Contractor
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.contractorName || 'Registered Vendor'}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                  DLP Window
                </span>
                <div style={{ fontWeight: 600 }}>
                  {popup.item.dlpStartDate} to {popup.item.dlpEndDate}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                  Retention Status
                </span>
                <div>
                  {popup.item.retentionReleased ? (
                    <span className="civil-pill green">
                      Released ({popup.item.releaseOrderNo})
                    </span>
                  ) : (
                    <span className="civil-pill amber">
                      Held: {formatCurrency(popup.item.retentionAmount)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Defects Table */}
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
                  color: '#1e3a8a',
                }}
              >
                Reported Defects & Rectification Verification Ledger (
                {popup.item.defects?.length || 0})
              </h4>
              {!popup.item.retentionReleased && (
                <Button
                  size="small"
                  label="Report New Defect"
                  icon="plus"
                  variant="danger"
                  onClick={() => openDefectModal(popup.item!)}
                />
              )}
            </div>

            {!popup.item.defects || popup.item.defects.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: '#f0fdf4',
                  borderRadius: '0.5rem',
                  border: '1px dashed #86efac',
                  color: '#166534',
                  fontSize: '0.8125rem',
                }}
              >
                ✓ No defects reported during the DLP period. Quality standards
                maintained.
              </div>
            ) : (
              <table
                className="civil-table"
                style={{ width: '100%', fontSize: '0.78rem' }}
              >
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Defect Description & Location</th>
                    <th>Notice Date</th>
                    <th>Deadline</th>
                    <th>Rectified Status</th>
                    <th>AE Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {popup.item.defects.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {d.id}
                      </td>
                      <td>
                        <span
                          className="civil-pill blue"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {d.defectCategory}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{d.description}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Loc: {d.location}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.72rem' }}>
                        {d.contractorNotifiedDate}
                      </td>
                      <td
                        style={{
                          fontSize: '0.72rem',
                          color: '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        {d.rectificationDeadline}
                      </td>
                      <td>
                        {d.isRectified ? (
                          <span style={{ color: '#15803d', fontWeight: 600 }}>
                            ✓ Rectified ({d.rectifiedDate})
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 600 }}>
                            Pending Fix
                          </span>
                        )}
                      </td>
                      <td>
                        {d.verifiedByAE ? (
                          <span
                            className="civil-pill green"
                            style={{ fontSize: '0.65rem' }}
                          >
                            ✓ AE Certified
                          </span>
                        ) : (
                          <span
                            className="civil-pill amber"
                            style={{ fontSize: '0.65rem' }}
                          >
                            Unverified
                          </span>
                        )}
                      </td>
                      <td>
                        {!popup.item?.retentionReleased && (
                          <Button
                            size="small"
                            label={d.isRectified ? 'Re-open' : 'Verify Fixed'}
                            variant={d.isRectified ? 'outlined' : 'success'}
                            onClick={() =>
                              handleToggleDefectResolved(popup.item!.id, d.id)
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-end mt-4">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>

      {/* POPUP: REPORT DEFECT MODAL */}
      <FormPopup
        visible={popup.mode === 'defect'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Report Defect & Issue Contractor Notice — ${popup.item?.workName}`}
        subtitle="Formally log a defect during the Defect Liability Period with mandatory rectification deadline."
        size="md"
      >
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
              label="Defect Category"
              data={[
                { label: 'Structural Cracks / Settlement', value: 'Crack' },
                { label: 'Roof / Wall Seepage & Dampness', value: 'Seepage' },
                { label: 'Plumbing & Sanitary Leakage', value: 'Plumbing' },
                {
                  label: 'Electrical Wiring / Fixture Failure',
                  value: 'Electrical',
                },
                {
                  label: 'Flooring / Vitrified Tile Hollows',
                  value: 'Flooring / Tile',
                },
                { label: 'Other Construction Defects', value: 'Other' },
              ]}
              textField="label"
              optionValue="value"
              value={defectForm.category}
              onChange={val =>
                setDefectForm({ ...defectForm, category: val as any })
              }
              required
            />
            <TextBox
              label="Specific Location / Grid"
              placeholder="e.g. 2nd Floor Corridor Grid B-3"
              value={defectForm.location}
              onChange={val => setDefectForm({ ...defectForm, location: val })}
              required
            />
          </FormGrid>

          <TextArea
            label="Detailed Defect Description"
            placeholder="Describe the nature, extent, and observed impact of the defect..."
            value={defectForm.description}
            onChange={val => setDefectForm({ ...defectForm, description: val })}
            rows={2}
            required
          />

          <FormGrid columns={3}>
            <TextBox
              label="Reported Date"
              type="date"
              value={defectForm.reportedDate}
              onChange={val =>
                setDefectForm({ ...defectForm, reportedDate: val })
              }
              required
            />
            <TextBox
              label="Notice to Contractor Date"
              type="date"
              value={defectForm.contractorNotifiedDate}
              onChange={val =>
                setDefectForm({ ...defectForm, contractorNotifiedDate: val })
              }
              required
            />
            <TextBox
              label="Rectification Deadline"
              type="date"
              value={defectForm.rectificationDeadline}
              onChange={val =>
                setDefectForm({ ...defectForm, rectificationDeadline: val })
              }
              required
            />
          </FormGrid>

          <div
            style={{
              padding: '0.75rem',
              background: '#fef2f2',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#991b1b',
            }}
          >
            <strong>CPWD GCC Clause 17 Notice:</strong> Notice is transmitted to
            the contractor. Failure to rectify within the deadline empowers the
            Department to execute repairs at the contractor's risk and cost,
            deducting expenses from the retention deposit.
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Submit Defect Notice"
              variant="danger"
              icon="exclamation-triangle"
              onClick={handleSaveDefect}
            />
          </div>
        </div>
      </FormPopup>

      {/* POPUP: AUTHORIZE RETENTION RELEASE */}
      <FormPopup
        visible={popup.mode === 'release'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={`Authorize Retention Release Order — ${popup.item?.workName}`}
        subtitle="Formal statutory order releasing Security Deposit / Retention after DLP completion."
        size="md"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          {/* Validation Checklist Banner */}
          {(() => {
            const days = popup.item ? daysLeft(popup.item.dlpEndDate) : 0;
            const openDefects = popup.item
              ? (popup.item.defects || []).filter(
                  d => !d.isRectified || !d.verifiedByAE
                ).length
              : 0;
            const hasBlockers = openDefects > 0;

            return (
              <div
                style={{
                  background: hasBlockers ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${hasBlockers ? '#fca5a5' : '#86efac'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  color: hasBlockers ? '#991b1b' : '#166534',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                  Release Audit Checklist:
                </div>
                <div>
                  1. DLP Duration:{' '}
                  {days <= 0
                    ? '✓ Fully Elapsed'
                    : `⚠ ${days} days remaining (Requires Exception Approval)`}
                </div>
                <div>
                  2. Defect Liability:{' '}
                  {openDefects === 0
                    ? '✓ Zero Outstanding Defects'
                    : `🔴 BLOCKER: ${openDefects} unresolved defects`}
                </div>
                <div>
                  3. Total Held in Escrow:{' '}
                  <strong>{formatCurrency(popup.item?.retentionAmount)}</strong>
                </div>
              </div>
            );
          })()}

          <FormGrid columns={2}>
            <TextBox
              label="Release Sanction Order No"
              placeholder="ORD/RET/2026/012"
              value={releaseForm.orderNo}
              onChange={val => setReleaseForm({ ...releaseForm, orderNo: val })}
              required
            />
            <TextBox
              label="Sanction Order Date"
              type="date"
              value={releaseForm.releaseDate}
              onChange={val =>
                setReleaseForm({ ...releaseForm, releaseDate: val })
              }
              required
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="Retention Amount to Release (₹)"
              type="number"
              value={String(releaseForm.amount)}
              onChange={val =>
                setReleaseForm({ ...releaseForm, amount: Number(val) || 0 })
              }
              required
            />
            <TextBox
              label="Penalty / Risk & Cost Deductions (₹)"
              type="number"
              placeholder="0"
              value={String(releaseForm.penaltyDeduction)}
              onChange={val =>
                setReleaseForm({
                  ...releaseForm,
                  penaltyDeduction: Number(val) || 0,
                })
              }
            />
          </FormGrid>

          <FormGrid columns={2}>
            <TextBox
              label="PFMS / Bank Disbursement Reference"
              placeholder="PFMS/RET/2026/88921"
              value={releaseForm.paymentRef}
              onChange={val =>
                setReleaseForm({ ...releaseForm, paymentRef: val })
              }
              required
            />
            <TextBox
              label="Sanctioning Authority"
              value={releaseForm.authorizedBy}
              onChange={val =>
                setReleaseForm({ ...releaseForm, authorizedBy: val })
              }
              required
            />
          </FormGrid>

          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#ecfdf5',
              borderRadius: '0.5rem',
              border: '1px solid #a7f3d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{ fontWeight: 600, color: '#065f46', fontSize: '0.85rem' }}
            >
              Net Retention Amount Payable to Contractor:
            </span>
            <strong style={{ fontSize: '1.1rem', color: '#047857' }}>
              {formatCurrency(
                releaseForm.amount - releaseForm.penaltyDeduction
              )}
            </strong>
          </div>

          <TextArea
            label="Finance Clearance Remarks"
            placeholder="Verified no outstanding audit paras or user complaints..."
            value={releaseForm.remarks}
            onChange={val => setReleaseForm({ ...releaseForm, remarks: val })}
            rows={2}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button
              label="Authorize & Release Retention"
              variant="primary"
              icon="check"
              onClick={handleAuthorizeRelease}
            />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
