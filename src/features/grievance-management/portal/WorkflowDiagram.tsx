import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { grvUrls } from '../urls';
import '../Grievance.css';

// ── Workflow Data ─────────────────────────────────────────────────
const STUDENT_FLOW = [
  {
    step: 1,
    actor: 'Student',
    icon: 'school',
    color: 'bg-blue-600',
    borderColor: 'border-blue-600',
    lightBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    actions: ['Submit Grievance', 'Upload Evidence', 'Track Status'],
    outputs: ['Ticket No. Generated', 'Auto-route to Department'],
  },
  {
    step: 2,
    actor: 'Department Officer',
    icon: 'assignment_ind',
    color: 'bg-green-600',
    borderColor: 'border-green-600',
    lightBg: 'bg-green-50',
    textColor: 'text-green-700',
    actions: [
      'Review Complaint',
      'Create eOffice Notesheet',
      'Gather Info',
      'Forward to HOD',
    ],
    outputs: ['Green Notesheet Created', 'File Forwarded'],
  },
  {
    step: 3,
    actor: 'HOD / Dean',
    icon: 'supervisor_account',
    color: 'bg-teal-600',
    borderColor: 'border-teal-600',
    lightBg: 'bg-teal-50',
    textColor: 'text-teal-700',
    actions: [
      'Evaluate Notesheet',
      'Add Remarks',
      'Approve Resolution',
      'Refer to Committee',
      'Return to Officer',
    ],
    outputs: ['Resolved at Dept Level', 'OR Escalated to Cell'],
  },
  {
    step: 4,
    actor: 'Grievance Cell',
    icon: 'support_agent',
    color: 'bg-purple-600',
    borderColor: 'border-purple-600',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    actions: [
      'Receive Escalation',
      'Assign to Committee',
      'Monitor Hearing',
      'Forward Recommendation',
    ],
    outputs: ['Committee Assigned', 'Case Monitored'],
  },
  {
    step: 5,
    actor: 'Grievance Committee',
    icon: 'groups',
    color: 'bg-orange-600',
    borderColor: 'border-orange-600',
    lightBg: 'bg-orange-50',
    textColor: 'text-orange-700',
    actions: [
      'Conduct Formal Hearing',
      'Examine Evidence',
      'Draft Recommendation',
      'Send to Registrar',
    ],
    outputs: ['Formal Recommendation', 'Sent to Registrar'],
  },
  {
    step: 6,
    actor: 'Registrar',
    icon: 'gavel',
    color: 'bg-indigo-600',
    borderColor: 'border-indigo-600',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    actions: [
      'Review Recommendation',
      'Issue Resolution Order',
      'Generate Official Letter',
      'Close File',
    ],
    outputs: ['Resolution Letter Issued', 'File Closed', 'Student Notified'],
  },
];

const DIRECT_TO_CELL = [
  {
    label: 'Sexual Harassment (ICC)',
    icon: 'report',
    color: 'text-pink-600 bg-pink-50 border-pink-200',
  },
  {
    label: 'Ragging Complaints (ARC)',
    icon: 'no_accounts',
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    label: 'Discrimination / Bias',
    icon: 'diversity_2',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    label: 'Whistleblower Reports',
    icon: 'visibility_off',
    color: 'text-slate-600 bg-slate-50 border-slate-200',
  },
  {
    label: 'Confidential Complaints',
    icon: 'lock',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
];

export default function WorkflowDiagram() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Grievance Workflow — Student / Employee"
      description="Visual diagram of the complete grievance resolution process from submission to final closure."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Workflow Overview' },
      ]}
    >
      <div className="mb-3">
        <Button
          label="← Back to Portal"
          variant="outlined"
          onClick={() => navigate(grvUrls.portal)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ── Main Workflow (3/4) ──────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-blue-600 text-xl">
                account_tree
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Standard Grievance Flow (Step-by-Step)
              </h3>
            </div>

            {/* Vertical flow */}
            <div className="space-y-0">
              {STUDENT_FLOW.map((node, idx) => (
                <div key={node.step}>
                  {/* Node */}
                  <div
                    className={`flex gap-4 p-4 rounded-2xl border-2 ${node.borderColor} ${node.lightBg}`}
                  >
                    {/* Step number + icon */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${node.color} flex items-center justify-center shadow-sm`}
                      >
                        <span className="material-symbols-outlined text-white text-xl">
                          {node.icon}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold ${node.textColor}`}
                      >
                        Step {node.step}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4
                          className={`text-sm font-bold ${node.textColor} mb-2`}
                        >
                          {node.actor}
                        </h4>
                        <div className="space-y-1">
                          {node.actions.map(a => (
                            <div
                              key={a}
                              className="flex items-center gap-1.5 text-xs text-slate-600"
                            >
                              <span
                                className={`material-symbols-outlined text-[13px] ${node.textColor}`}
                              >
                                arrow_right
                              </span>
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">
                          Outputs
                        </p>
                        <div className="space-y-1">
                          {node.outputs.map(o => (
                            <div
                              key={o}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              <span className="material-symbols-outlined text-green-500 text-[13px]">
                                check_circle
                              </span>
                              <span className="text-slate-700 font-medium">
                                {o}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {idx < STUDENT_FLOW.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-slate-300" />
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          arrow_downward
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final Resolution box */}
            <div className="mt-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-2xl p-4 text-center">
              <span className="material-symbols-outlined text-green-600 text-3xl block mb-1">
                task_alt
              </span>
              <h4 className="text-sm font-bold text-green-800">
                Grievance Resolved & Closed
              </h4>
              <p className="text-xs text-green-600 mt-1">
                Resolution letter generated → Complainant notified → File
                archived in eOffice system
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar (1/4) ──────────────────────────────── */}
        <div className="space-y-4">
          {/* Fast Track: Direct to Grievance Cell */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-red-500 text-lg">
                bolt
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Direct to Grievance Cell
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              These categories bypass department routing and go directly to the
              Grievance Cell:
            </p>
            <div className="space-y-2">
              {DIRECT_TO_CELL.map(d => (
                <div
                  key={d.label}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${d.color}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {d.icon}
                  </span>
                  <span className="font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Appeal path */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-purple-500 text-lg">
                balance
              </span>
              <h3 className="text-sm font-bold text-slate-800">Appeal Path</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              If closed complaint is unsatisfactory:
            </p>
            <div className="space-y-2">
              {[
                'Complainant Files Appeal',
                'Registrar Reviews',
                'Committee Hearing',
                'Vice Chancellor (Final)',
              ].map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-teal-500 text-lg">
                schedule
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Resolution Timelines
              </h3>
            </div>
            <div className="space-y-2">
              {[
                {
                  level: 'Department Level',
                  days: '7–10 Days',
                  color: 'text-green-600',
                },
                {
                  level: 'HOD Review',
                  days: '15 Days',
                  color: 'text-amber-600',
                },
                {
                  level: 'Grievance Cell',
                  days: '30 Days',
                  color: 'text-orange-600',
                },
                {
                  level: 'Committee Hearing',
                  days: '45 Days',
                  color: 'text-red-600',
                },
              ].map(r => (
                <div key={r.level} className="flex justify-between text-xs">
                  <span className="text-slate-500">{r.level}</span>
                  <span className={`font-bold ${r.color}`}>{r.days}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
