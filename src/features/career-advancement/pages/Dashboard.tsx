import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    aparApplications,
    pbasApplications,
    triggerNotification,
  } = useCareerAdvancement();

  // Calculations for Admin Dashboard
  const stats = useMemo(() => {
    const total = aparApplications.length + pbasApplications.length;
    const aparCount = aparApplications.length;
    const pbasCount = pbasApplications.filter((p: CareerAdvancement.CASPBASApplication) => p.type === 'PBAS').length;
    const casCount = pbasApplications.filter((p: CareerAdvancement.CASPBASApplication) => p.type === 'CAS').length;
    const pendingScreening =
      aparApplications.filter((a: CareerAdvancement.CASAPARApplication) => a.status === 'Pending').length +
      pbasApplications.filter((p: CareerAdvancement.CASPBASApplication) => p.status === 'Pending').length;
    const completed =
      aparApplications.filter((a: CareerAdvancement.CASAPARApplication) => a.status === 'Completed').length +
      pbasApplications.filter((p: CareerAdvancement.CASPBASApplication) => p.status === 'Approved').length;

    return {
      total,
      aparCount,
      pbasCount,
      casCount,
      pendingScreening,
      completed,
    };
  }, [aparApplications, pbasApplications]);

  // Combined applications list for Admin Dashboard
  const recentApplications = useMemo(() => {
    const list: any[] = [];
    aparApplications.forEach((a: CareerAdvancement.CASAPARApplication) => {
      list.push({
        id: a.id,
        name: a.employeeName,
        designation: a.designation,
        scheme: 'APAR',
        session: a.session,
        status: a.status,
        raw: a,
      });
    });
    pbasApplications.forEach((p: CareerAdvancement.CASPBASApplication) => {
      list.push({
        id: p.id,
        name: p.employeeName,
        designation: p.designation,
        scheme: p.type,
        session: p.session,
        status: p.status,
        raw: p,
      });
    });
    return list;
  }, [aparApplications, pbasApplications]);


  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('complete') || s.includes('approved')) {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (s.includes('pending') || s.includes('draft') || s.includes('forwarded')) {
      return 'bg-amber-100 text-amber-700';
    }
    if (s.includes('reject') || s.includes('resubmit') || s.includes('withdraw')) {
      return 'bg-rose-100 text-rose-700';
    }
    return 'bg-cyan-100 text-cyan-700';
  };

  // Render Admin/Other Staff View
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Apps', val: stats.total, color: 'border-indigo-500 bg-indigo-50 text-indigo-700', icon: 'pi-file' },
          { label: 'APAR Apps', val: stats.aparCount, color: 'border-purple-500 bg-purple-50 text-purple-700', icon: 'pi-file-o' },
          { label: 'PBAS Apps', val: stats.pbasCount, color: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: 'pi-chart-bar' },
          { label: 'CAS Apps', val: stats.casCount, color: 'border-amber-500 bg-amber-50 text-amber-700', icon: 'pi-bookmark' },
          { label: 'Pending Screening', val: stats.pendingScreening, color: 'border-rose-500 bg-rose-50 text-rose-700', icon: 'pi-clock' },
          { label: 'Completed', val: stats.completed, color: 'border-teal-500 bg-teal-50 text-teal-700', icon: 'pi-check' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border-l-4 p-4 shadow-sm ${s.color} flex flex-col justify-between`}>
            <div>
              <p className="text-2xl font-black">{s.val}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{s.label}</p>
            </div>
            <div className="text-right mt-2">
              <i className={`pi ${s.icon} opacity-40 text-lg`} />
            </div>
          </div>
        ))}
      </div>

      <FormCard title="Recent Applications" icon="list">
        <GridPanel
          data={recentApplications}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'name', header: 'Employee Name' },
            { field: 'designation', header: 'Designation' },
            {
              field: 'scheme',
              header: 'Scheme',
              cell: (item: any) => (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700">
                  {item.scheme}
                </span>
              ),
            },
            { field: 'session', header: 'Session' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: (item: any) => (
                <div className="flex items-center gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    onClick={() => triggerNotification(`Opening detailed view for ${item.name}`, 'info')}
                  />
                  <Button
                    label="Track"
                    icon="map-marker"
                    variant="primary"
                    onClick={() => navigate(`/career-advancement/apar-track`)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </div>
  );

  return (
    <FormPage
      title="Admin Dashboard"
      description="Overview of Career Advancement Scheme applications across the university"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      {renderAdminDashboard()}
    </FormPage>
  );
}
