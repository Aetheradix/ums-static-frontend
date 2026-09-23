import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { CIVIL_STORAGE_KEYS, useCivilStorage } from '../../civilStorage';
import { type CCRequestItem, initialCCRequests } from '../../data/ccRequests';
import { appendAudit, makeAuditEntry } from '../../utils/audit';
import { civilWorks } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const CC_ISSUER = 'Chief Engineer / Estate Officer';

export default function CompletionCertificate() {
  const [works, setWorks] = useCivilStorage<any[]>(
    CIVIL_STORAGE_KEYS.WORKS,
    civilWorks
  );
  const [ccRequests, setCcRequests] = useCivilStorage<CCRequestItem[]>(
    CIVIL_STORAGE_KEYS.CC_REQUESTS,
    initialCCRequests
  );

  const [viewMode, setViewMode] = useState<'list' | 'certify' | 'view'>('list');
  const [selectedItem, setSelectedItem] = useState<CCRequestItem | null>(null);

  const [certNo, setCertNo] = useState('');
  const [certRemarks, setCertRemarks] = useState('');
  const [dlpMonths, setDlpMonths] = useState(12);
  const [handoverDept, setHandoverDept] = useState('');
  const [estateOfficer, setEstateOfficer] = useState(
    'Dr. S. K. Verma (Estate Officer)'
  );
  const [confirmCertify, setConfirmCertify] = useState(false);

  const openCertifyPage = (item: CCRequestItem) => {
    setSelectedItem(item);
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
    setViewMode('certify');
  };

  const openViewPage = (item: CCRequestItem) => {
    setSelectedItem(item);
    setViewMode('view');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  // Toggle snag rectification
  const toggleSnagRectified = (snagId: string) => {
    if (!selectedItem) return;
    const updatedSnags = selectedItem.snags.map(s =>
      s.id === snagId
        ? { ...s, rectified: !s.rectified, verifiedByAE: !s.rectified }
        : s
    );
    const updatedItem = { ...selectedItem, snags: updatedSnags };
    setSelectedItem(updatedItem);
    setCcRequests(prev =>
      prev.map(r => (r.id === updatedItem.id ? updatedItem : r))
    );
    ToastService.info('Snag resolution status updated.');
  };

  // Validate final CC issuance, then confirm (legal DLP + asset handover).
  const handleCertify = () => {
    if (!certNo.trim()) {
      ToastService.error('Certificate number is required.');
      return;
    }
    if (!selectedItem) return;
    if (!handoverDept.trim()) {
      ToastService.error('Taking-Over Department is required.');
      return;
    }
    if (!certRemarks.trim()) {
      ToastService.error('Certification remarks are required.');
      return;
    }

    // RULE: Cannot issue CC if there are unrectified snags
    const hasUnresolvedSnags = selectedItem.snags.some(
      s => !s.rectified || !s.verifiedByAE
    );
    if (hasUnresolvedSnags) {
      ToastService.error(
        'BLOCKER: Cannot issue Completion Certificate! All punch list / snag items must be rectified by contractor and verified by AE first.'
      );
      return;
    }

    setConfirmCertify(true);
  };

  const doCertify = () => {
    if (!selectedItem) return;

    // Update CC request status
    const updatedRequests = ccRequests.map((r: CCRequestItem) =>
      r.id === selectedItem.id
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
      w.id === selectedItem.workId || w.workId === selectedItem.workId
        ? {
            ...w,
            status: 'DLP Active' as any,
            statusHistory: appendAudit(w.statusHistory, {
              ...makeAuditEntry({
                status: 'DLP Active',
                actor: CC_ISSUER,
                remarks: certRemarks.trim() || undefined,
                action: `Issued Completion Certificate ${certNo}; DLP ${dlpMonths} months`,
              }),
            }),
          }
        : w
    );
    setWorks(updatedWorks);

    ToastService.success(
      `Completion Certificate ${certNo} issued! Handed over to ${handoverDept}. DLP timer (${dlpMonths} months) initiated.`
    );
    setConfirmCertify(false);
    handleBackToList();
  };

  if (viewMode !== 'list' && selectedItem) {
    const isCertify = viewMode === 'certify';
    const isBlocked = selectedItem.snags.some(
      s => !s.rectified || !s.verifiedByAE
    );

    return (
      <FormPage
        title={
          isCertify
            ? `Issue Completion Certificate — ${selectedItem.workNo}`
            : `Completion & Handover Dossier — ${selectedItem.workNo}`
        }
        description="Verification of Joint Inspection Committee, Snag Rectifications, Quality Standards, and Estate Handover."
        breadcrumbs={[
          { label: 'Home', to: '/home/menu' },
          { label: 'Civil Infrastructure', to: civilUrls.civilMenu },
          { label: 'Admin Login', to: civilUrls.adminMenu },
          { label: 'Completion Certificate' },
          {
            label: isCertify
              ? `Issue Certificate (${selectedItem.workNo})`
              : `Dossier (${selectedItem.workNo})`,
          },
        ]}
      >
        <div className="flex justify-between items-center mb-4">
          <Button
            label="Back to Requests"
            icon="arrow-left"
            variant="outlined"
            onClick={handleBackToList}
          />
          {selectedItem.status === 'Certificate Issued' && (
            <span className="civil-pill green font-mono text-sm px-3 py-1">
              Certificate No: {selectedItem.certificateNo}
            </span>
          )}
        </div>

        <FormCard title="Project & Completion Overview" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block mb-1">
                Work Name & Code
              </span>
              <div className="font-bold text-slate-900">
                {selectedItem.workName}
              </div>
              <div className="font-mono text-xs text-blue-600 font-semibold mt-0.5">
                {selectedItem.workNo}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block mb-1">
                Actual Completion Date
              </span>
              <div className="font-bold text-slate-900">
                {selectedItem.actualCompletionDate}
              </div>
            </div>
            <div>
              <span className="text-xs uppercase text-slate-500 font-semibold tracking-wider block mb-1">
                Certificate Status
              </span>
              <div>
                <StatusBadge
                  label={selectedItem.status}
                  variant={
                    selectedItem.status === 'Certificate Issued'
                      ? 'approved'
                      : 'pending'
                  }
                />
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Punch List / Snag List Tracking (Mandatory Clearance Blocker)"
          className="mb-4"
        >
          <div className="border border-red-200 bg-red-50/40 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <i className="pi pi-exclamation-triangle text-base" />
                <span>Snag Rectification & AE Verification Status</span>
              </div>
              {isBlocked ? (
                <span className="civil-pill red font-bold text-xs px-2.5 py-1">
                  Blocking Certificate Issuance
                </span>
              ) : (
                <span className="civil-pill green font-bold text-xs px-2.5 py-1">
                  All Snags Cleared ✓
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="civil-table w-full text-xs">
                <thead>
                  <tr className="bg-red-100/70 text-slate-800">
                    <th className="py-2 px-3 text-left">ID</th>
                    <th className="py-2 px-3 text-left">Snag Description</th>
                    <th className="py-2 px-3 text-left">Location</th>
                    <th className="py-2 px-3 text-left">Severity</th>
                    <th className="py-2 px-3 text-left">
                      Rectified by Contractor
                    </th>
                    <th className="py-2 px-3 text-left">Verified by AE</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100 bg-white">
                  {selectedItem.snags.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">
                        {s.id}
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {s.description}
                      </td>
                      <td className="py-2 px-3 text-slate-600">{s.location}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`civil-pill ${s.severity === 'Critical' ? 'red' : 'amber'} text-xs font-semibold`}
                        >
                          {s.severity}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {s.rectified ? (
                          <span className="text-emerald-700 font-bold">
                            ✓ Rectified
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {s.verifiedByAE ? (
                          <span className="text-emerald-700 font-bold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold">
                            Pending AE Check
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">
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
                  {selectedItem.snags.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-slate-500 italic"
                      >
                        No snag items logged for this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Mandatory Structural Quality Tests Verification (IS & CPWD Codes)"
          className="mb-4"
        >
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
              <i className="pi pi-check-circle text-base" />
              <span>Standard Laboratory Material Testing Reports</span>
            </div>

            <div className="overflow-x-auto">
              <table className="civil-table w-full text-xs">
                <thead>
                  <tr className="bg-emerald-100/70 text-slate-800">
                    <th className="py-2 px-3 text-left">
                      Test Name & Material
                    </th>
                    <th className="py-2 px-3 text-left">Code / Standard</th>
                    <th className="py-2 px-3 text-left">
                      Lab Report Reference
                    </th>
                    <th className="py-2 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 bg-white">
                  {selectedItem.qualityChecks.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {q.testName}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">
                        {q.standard}
                      </td>
                      <td className="py-2 px-3 font-mono text-blue-700 font-semibold">
                        {q.certificateRef}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span
                          className={`civil-pill ${q.result === 'Pass' ? 'green' : 'red'} text-xs font-semibold`}
                        >
                          {q.result} ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                  {selectedItem.qualityChecks.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-slate-500 italic"
                      >
                        No quality check records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Joint Technical Inspection Committee Sign-Off"
          className="mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedItem.committeeMembers.map((m, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {m.name}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {m.designation} ({m.department})
                  </div>
                </div>
                <span className="civil-pill green text-xs font-bold px-2 py-0.5">
                  ✓ Signed
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        {isCertify && (
          <FormCard
            title="Handover & Defect Liability Period (DLP) Parameters"
            className="mb-4"
          >
            <FormGrid columns={3}>
              <TextBox
                label="Completion Certificate No"
                value={certNo}
                onChange={setCertNo}
                required
              />
              <DropDownList
                label="DLP Duration Period"
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
                label="Handover / Taking Over Date"
                value={new Date().toISOString().split('T')[0]}
                onChange={() => {}}
                disabled
              />
            </FormGrid>

            <FormGrid columns={2}>
              <TextBox
                label="Taking-Over Department / Faculty"
                placeholder="Faculty of Science & Technology"
                value={handoverDept}
                onChange={setHandoverDept}
                required
              />
              <TextBox
                label="Estate Officer / Custodian"
                value={estateOfficer}
                onChange={setEstateOfficer}
                required
              />
            </FormGrid>

            <TextArea
              label="Official Inspection & Certification Remarks"
              placeholder="Summary of joint inspection findings, taking-over note, key handover..."
              value={certRemarks}
              onChange={setCertRemarks}
              rows={2}
              required
            />

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={handleBackToList}
              />
              <Button
                label="Issue Official Completion Certificate"
                variant="primary"
                icon="star"
                onClick={handleCertify}
              />
            </div>
          </FormCard>
        )}

        <ConfirmDialog
          visible={confirmCertify}
          onHide={() => setConfirmCertify(false)}
          onConfirm={doCertify}
          variant="warning"
          title="Issue Completion Certificate"
          message={`This issues Completion Certificate ${certNo}, hands the asset over to ${handoverDept || 'the using department'}, and starts the ${dlpMonths}-month Defect Liability Period. This is a formal statutory action. Proceed?`}
          confirmLabel="Issue Certificate"
        />
      </FormPage>
    );
  }

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
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 mb-5 flex items-center gap-3 shadow-xs">
        <i className="pi pi-check-circle text-xl text-emerald-600 shrink-0" />
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
                <span className="font-mono font-bold text-blue-700 text-xs">
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
                  <div className="font-semibold text-xs text-slate-900">
                    {r.userDepartment}
                  </div>
                  <div className="text-[11px] text-slate-500">
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
                      <span className="civil-pill red font-bold text-xs">
                        {openSnags} Open Snag(s) ⚠
                      </span>
                    ) : (
                      <span className="civil-pill green text-xs">
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
                    className={`civil-pill ${allPassed ? 'green' : 'amber'} text-xs`}
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
                <span className="text-xs text-slate-700">
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
                <div className="flex items-center gap-1.5">
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    title="View Joint Inspection Dossier"
                    onClick={() => openViewPage(r)}
                  />
                  {r.status !== 'Certificate Issued' ? (
                    <Button
                      size="small"
                      label="Inspect & Certify"
                      icon="star"
                      variant="primary"
                      onClick={() => openCertifyPage(r)}
                    />
                  ) : (
                    <span className="civil-pill green text-[10px] font-mono font-bold self-center">
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
    </FormPage>
  );
}
