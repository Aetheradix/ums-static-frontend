import { useState } from 'react';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import type { Document } from '../../mock/data';
import { MY_CANDIDATE } from '../../mock/data';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; colorClass: string }> = {
    PENDING_UPLOAD: {
      label: 'Pending Upload',
      colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    UPLOADED: {
      label: 'Uploaded',
      colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    LOCKED: {
      label: 'Locked — Awaiting Verification',
      colorClass: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    },
    APPROVED: {
      label: 'Approved',
      colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    REJECTED: {
      label: 'Rejected',
      colorClass: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
  };
  const cfg = map[status] ?? {
    label: status,
    colorClass: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${cfg.colorClass}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Timeline Step ────────────────────────────────────────────────────────────
function TimelineStep({
  step,
  label,
  sublabel,
  done,
  active,
}: {
  step: number;
  label: string;
  sublabel: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-start gap-4 flex-1">
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            done
              ? 'bg-emerald-500 text-white'
              : active
                ? 'bg-violet-500 text-white border-2 border-violet-500'
                : 'bg-slate-400/15 text-slate-500'
          }`}
        >
          {done ? (
            <span className="material-symbols-rounded text-[18px]">check</span>
          ) : (
            step
          )}
        </div>
      </div>
      <div className="pt-1">
        <div
          className={`font-semibold text-[13px] ${active ? 'text-violet-500' : done ? 'text-emerald-500' : 'text-slate-400'}`}
        >
          {label}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">{sublabel}</div>
      </div>
    </div>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────
function DocRow({ doc, locked }: { doc: Document; locked: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <tr className="border-b border-slate-400/10 hover:bg-slate-400/5 transition-colors">
      <td className="p-3 text-[13px] text-slate-300 font-medium">
        {doc.type}
        {doc.required && <span className="text-red-500 ml-1">*</span>}
      </td>
      <td className="p-3">
        {doc.uploaded ? (
          <span className="flex items-center gap-1.5 text-emerald-500 text-xs">
            <span className="material-symbols-rounded text-[16px]">
              description
            </span>
            {doc.fileName}
            <span className="text-slate-500">({doc.fileSize})</span>
          </span>
        ) : (
          <span className="text-slate-500 text-xs">Not uploaded</span>
        )}
      </td>
      <td className="p-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${doc.uploaded ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
        >
          {doc.uploaded ? 'Uploaded' : 'Pending'}
        </span>
      </td>
      <td className="p-3">
        {!locked && (
          <label className="cursor-pointer text-xs text-violet-500 font-medium flex items-center gap-1 hover:text-violet-400 transition-colors">
            <span className="material-symbols-rounded text-[16px]">upload</span>
            {file ? file.name : doc.uploaded ? 'Re-upload' : 'Upload'}
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
        {locked && (
          <span className="text-xs text-slate-500">Profile Locked</span>
        )}
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const candidate = MY_CANDIDATE;
  const [showLockModal, setShowLockModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [locked, setLocked] = useState(candidate.status === 'LOCKED');

  const uploadedCount = candidate.documents.filter(d => d.uploaded).length;
  const totalDocs = candidate.documents.length;
  const allUploaded =
    uploadedCount === candidate.documents.filter(d => d.required).length;

  const steps = [
    {
      label: 'Login via OTP',
      sublabel: 'Credential verified',
      done: true,
      active: false,
    },
    {
      label: 'Upload Documents',
      sublabel: `${uploadedCount}/${totalDocs} uploaded`,
      done: allUploaded && locked,
      active: !locked,
    },
    {
      label: 'Lock Profile',
      sublabel: 'OTP-confirmed lock',
      done: locked,
      active: !locked && allUploaded,
    },
    {
      label: 'Verification',
      sublabel: 'Center Incharge review',
      done: false,
      active: locked,
    },
    {
      label: 'HR Approval',
      sublabel: 'Final clearance',
      done: false,
      active: false,
    },
    {
      label: 'Choice Filling',
      sublabel: 'Post approval',
      done: false,
      active: false,
    },
  ];

  return (
    <FormPage
      title="Candidate Dashboard"
      description={`Welcome, ${candidate.name} — Application No: ${candidate.applicationNo}`}
      breadcrumbs={[
        { label: 'Recruitment Management', to: '/recruitment-management' },
        { label: 'Candidate Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* ── Status Banner ── */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-sm text-slate-400 font-medium">
            Current Status:
          </span>
          <StatusBadge status={candidate.status} />
        </div>
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Application No."
            value={candidate.applicationNo}
            icon="badge"
            colorScheme="blue"
            subtitle={candidate.post}
          />
          <StatCard
            title="Merit Rank"
            value={`#${candidate.merit}`}
            icon="emoji_events"
            colorScheme="orange"
            subtitle={candidate.category}
          />
          <StatCard
            title="Documents"
            value={`${uploadedCount}/${totalDocs}`}
            icon="folder_open"
            colorScheme="purple"
            subtitle="Uploaded"
          />
          <StatCard
            title="Profile Status"
            value={locked ? 'Locked' : 'Open'}
            icon={locked ? 'lock' : 'lock_open'}
            colorScheme={locked ? 'red' : 'green'}
            subtitle={locked ? 'Awaiting verification' : 'Ready to lock'}
          />
        </div>

        {/* ── Application Journey ── */}
        <FormCard title="Application Journey" icon="route">
          <div className="flex gap-2 flex-wrap py-2">
            {steps.map((s, i) => (
              <TimelineStep
                key={i}
                step={i + 1}
                label={s.label}
                sublabel={s.sublabel}
                done={s.done}
                active={s.active}
              />
            ))}
          </div>
        </FormCard>

        {/* ── Personal Info + Verification Center ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard title="Personal Information" icon="person">
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ['Name', candidate.name],
                  ["Father's Name", candidate.fatherName],
                  ['Date of Birth', candidate.dob],
                  ['Category', candidate.category],
                  ['Mobile', candidate.mobile],
                  ['Applied For', candidate.post],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-slate-400/10">
                    <td className="py-2.5 px-2 text-xs text-slate-500 w-2/5">
                      {label}
                    </td>
                    <td className="py-2.5 px-2 text-[13px] text-slate-300 font-medium">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>

          <FormCard title="Verification Center Details" icon="location_on">
            <div className="flex flex-col gap-4 py-2">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <div className="text-xs text-violet-500 font-semibold mb-1">
                  CENTER CODE
                </div>
                <div className="text-xl font-bold text-white">
                  {candidate.verificationCenterCode}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 mb-1">
                  Center Name
                </div>
                <div className="text-sm text-slate-300 font-medium">
                  {candidate.verificationCenter}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 mb-1">
                  Reporting Date &amp; Time
                </div>
                <div className="text-sm text-amber-500 font-semibold">
                  {candidate.reportingDate}
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg py-2.5 px-3.5 text-xs text-blue-300">
                <span className="material-symbols-rounded text-[14px] align-middle mr-1.5">
                  info
                </span>
                Please carry all original documents when reporting to the
                verification center.
              </div>
            </div>
          </FormCard>
        </div>

        {/* ── Document Upload Table ── */}
        <FormCard
          title="Document Uploads"
          icon="upload_file"
          headerAction={
            !locked && allUploaded ? (
              <button
                onClick={() => setShowLockModal(true)}
                className="bg-gradient-to-br from-violet-500 to-violet-700 text-white border-none rounded-lg px-4 py-2 cursor-pointer font-semibold text-[13px] flex items-center gap-1.5 hover:from-violet-600 hover:to-violet-800 transition-colors"
              >
                <span className="material-symbols-rounded text-[16px]">
                  lock
                </span>
                Save &amp; Lock Profile
              </button>
            ) : locked ? (
              <span className="flex items-center gap-1.5 text-emerald-500 text-[13px] font-semibold">
                <span className="material-symbols-rounded text-[16px]">
                  lock
                </span>
                Profile Locked
              </span>
            ) : undefined
          }
        >
          {locked && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-2.5 px-3.5 mb-4 text-[13px] text-red-300 flex items-center gap-2">
              <span className="material-symbols-rounded text-[16px]">lock</span>
              Your profile is locked. Documents can no longer be edited. Your
              application is in the verification queue.
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-400/5">
                  {['Document', 'File', 'Status', 'Action'].map(h => (
                    <th
                      key={h}
                      className="p-2.5 text-left text-[11px] text-slate-500 font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidate.documents.map((doc, i) => (
                  <DocRow key={i} doc={doc} locked={locked} />
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>

      {/* ── Lock Profile Modal ── */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-slate-800 border border-violet-500/30 rounded-2xl p-8 w-[400px] shadow-2xl">
            <div className="text-lg font-bold text-white mb-2">
              🔒 Confirm Profile Lock
            </div>
            <div className="text-[13px] text-slate-400 mb-5 leading-relaxed">
              An OTP has been sent to your registered mobile{' '}
              <strong className="text-slate-300">
                ****{candidate.mobile.slice(-4)}
              </strong>
              . Enter it below to permanently lock your profile.
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-1.5">Enter OTP</div>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-400/10 border border-slate-400/20 rounded-lg text-white text-base tracking-[4px] text-center outline-none box-border focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-2.5 px-3.5 text-xs text-red-300 mb-5">
              ⚠️ This action is <strong>irreversible</strong>. Once locked, you
              cannot re-upload or edit any documents.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-400/20 bg-transparent text-slate-400 cursor-pointer font-semibold text-[13px] hover:bg-slate-400/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (otp.length === 6) {
                    setLocked(true);
                    setShowLockModal(false);
                    setOtp('');
                  }
                }}
                disabled={otp.length !== 6}
                className={`flex-1 py-2.5 rounded-lg border-none text-white font-semibold text-[13px] transition-colors ${otp.length === 6 ? 'bg-gradient-to-br from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 cursor-pointer' : 'bg-violet-500/30 cursor-not-allowed'}`}
              >
                Confirm &amp; Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
