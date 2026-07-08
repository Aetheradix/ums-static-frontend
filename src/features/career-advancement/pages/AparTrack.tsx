import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

export default function AparTrack() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');

  const { aparApplications } = useCareerAdvancement();

  // Find targeted APAR application
  const app = useMemo(() => {
    return (
      aparApplications.find(
        (a: CareerAdvancement.CASAPARApplication) => a.id === appId
      ) ||
      aparApplications.find(
        (a: CareerAdvancement.CASAPARApplication) => a.employeeId === 'EMP001'
      ) ||
      aparApplications[0]
    );
  }, [aparApplications, appId]);

  const steps = useMemo(() => {
    const s = app?.status?.toLowerCase();
    const isCompleted = s === 'completed';
    const isUnderReview = s === 'under review' || isCompleted;
    const isForwarded = s === 'forwarded' || isUnderReview;

    return [
      {
        label: 'APAR Process Initiated',
        done: true,
        date: app?.submittedOn || '12 Jan 2025',
        desc: 'Administrative workflow initialized and configured.',
        by: 'Admin Office',
      },
      {
        label: 'Self-Assessment Submitted',
        done: isForwarded || isUnderReview || isCompleted,
        date:
          isForwarded || isUnderReview || isCompleted
            ? app?.submittedOn || '15 Jan 2025'
            : undefined,
        desc: 'Employee self-appraisal form submitted.',
        by: app?.employeeName,
      },
      {
        label: 'Reporting Officer Appraisal Logged',
        done: isUnderReview || isCompleted,
        date: isUnderReview || isCompleted ? '18 Jan 2025' : undefined,
        desc: 'Verified scores and pen picture logged.',
        by: 'Reporting Officer',
      },
      {
        label: 'Reviewing Officer Final Review Done',
        done: isCompleted,
        date: isCompleted ? app?.lastUpdated || '20 Jan 2025' : undefined,
        desc: 'Final grade authorized and locked.',
        by: 'Reviewing Officer',
      },
    ];
  }, [app]);

  return (
    <FormPage
      title="APAR Application Tracking"
      description="Track the status and stages of your Annual Performance Appraisal Report application"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Track Application' },
      ]}
    >
      <div className="space-y-6">
        <FormCard
          title="Application Profile"
          icon="user"
          className="bg-slate-50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Application ID
              </span>
              <span className="text-slate-800 font-extrabold block mt-1">
                {app?.id}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Employee Name
              </span>
              <span className="text-slate-800 font-extrabold block mt-1">
                {app?.employeeName}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Department
              </span>
              <span className="text-slate-800 font-extrabold block mt-1">
                {app?.department}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Status
              </span>
              <span className="text-slate-800 font-extrabold block mt-1">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    app?.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {app?.status}
                </span>
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard title="Workflow Progress Timeline" icon="map-marker">
          <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 ml-4 mt-4">
            {steps.map((s, i) => (
              <div key={s.label} className="relative">
                {/* Dot */}
                <div
                  className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 flex items-center justify-center text-xs font-black transition-all ${
                    s.done
                      ? 'bg-emerald-500 border-emerald-100 text-white'
                      : 'bg-white border-slate-200 text-slate-300'
                  }`}
                >
                  {s.done ? 'âœ“' : i + 1}
                </div>
                {/* Content */}
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h4
                      className={`text-sm font-bold ${
                        s.done ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </h4>
                    {s.date && (
                      <span className="text-xs text-slate-400 font-semibold italic">
                        {s.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    {s.desc}
                  </p>
                  {s.by && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block">
                      Action By: {s.by}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions-row mt-8 pt-4 border-t border-slate-100">
            <Button
              label="Back to Dashboard"
              variant="outlined"
              onClick={() => navigate('/career-advancement/dashboard')}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
