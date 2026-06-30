import { useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { useResearch } from '../context';

export default function Dashboard() {
  const {
    projects,
    proposals,
    setProjects: _sp,
    disbursedLogs,
  } = useResearch();

  const pendingCount = useMemo(
    () => proposals.filter(p => p.status === 'Pending').length,
    [proposals]
  );
  const approvedCount = useMemo(
    () => proposals.filter(p => p.status === 'Approved').length,
    [proposals]
  );
  const activeGrantsTotal = useMemo(
    () => projects.reduce((acc, curr) => acc + curr.approvedBudget, 0),
    [projects]
  );
  const totalDisbursed = useMemo(
    () => projects.reduce((acc, curr) => acc + curr.disbursedFunds, 0),
    [projects]
  );
  const revisionDraftsCount = useMemo(
    () => proposals.filter(p => p.status === 'Sent Back').length,
    [proposals]
  );

  // Suppress unused warning
  void _sp;
  void disbursedLogs;

  const kpis = [
    {
      label: 'Active Projects',
      value: projects.length,
      icon: 'pi-book',
      color: 'amber',
    },
    {
      label: 'Funds Awarded',
      value: `₹${(activeGrantsTotal / 100000).toFixed(1)}L`,
      icon: 'pi-star',
      color: 'indigo',
    },
    {
      label: 'Compliance Queue',
      value: pendingCount,
      icon: 'pi-check-square',
      color: 'rose',
    },
    {
      label: 'Revision Drafts',
      value: revisionDraftsCount,
      icon: 'pi-refresh',
      color: 'emerald',
    },
  ];

  const colorMap: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <FormPage
      title="Research & Grants Dashboard"
      description="Integrated overview of active projects, proposals queue, and disbursement status"
      breadcrumbs={[
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {kpi.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                {kpi.value}
              </h3>
            </div>
            <div className={`p-3 rounded-2xl ${colorMap[kpi.color]}`}>
              <i className={`pi ${kpi.icon} text-xl`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project funding progress */}
        <FormCard title="Research Projects Breakdown" icon="chart-bar">
          <div className="space-y-4">
            {projects.map(p => {
              const rate =
                p.approvedBudget > 0
                  ? Math.round((p.disbursedFunds / p.approvedBudget) * 100)
                  : 0;
              return (
                <div
                  key={p.code}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-800">
                      {p.piName}
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        • {p.code}
                      </span>
                    </span>
                    <span className="text-xs text-indigo-700 font-bold">
                      ₹{p.disbursedFunds.toLocaleString()} / ₹
                      {p.approvedBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        rate > 80 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>
                      Agency:{' '}
                      <strong className="text-slate-700">{p.agency}</strong>
                    </span>
                    <span>{rate}% Released</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        {/* Proposal queue */}
        <FormCard title="Current Grant Proposals Queue" icon="list">
          <div className="divide-y divide-slate-100">
            {proposals.slice(0, 5).map(prop => (
              <div
                key={prop.id}
                className="py-4 flex justify-between items-center text-sm"
              >
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{prop.piName}</p>
                  <p className="text-xs text-slate-500">
                    {prop.title.substring(0, 50)}...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Budget:{' '}
                    <strong className="text-indigo-700">
                      ₹{(prop.totalRequestedFunds as number).toLocaleString()}
                    </strong>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    prop.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : prop.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {prop.status === 'Sent Back' ? 'Under Revision' : prop.status}
                </span>
              </div>
            ))}
            {proposals.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No proposals submitted yet.
              </p>
            )}
          </div>
        </FormCard>
      </div>

      {/* Approved proposals summary */}
      {approvedCount > 0 && (
        <FormCard title="Approved Proposals Summary" icon="check-circle">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Total Approved
              </p>
              <p className="text-2xl font-black text-emerald-800 mt-1">
                {approvedCount}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Total Disbursed
              </p>
              <p className="text-2xl font-black text-indigo-800 mt-1">
                ₹{(totalDisbursed / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Projects Registered
              </p>
              <p className="text-2xl font-black text-amber-800 mt-1">
                {projects.length}
              </p>
            </div>
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
