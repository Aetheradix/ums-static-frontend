import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerAdvancement } from '../context';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import '../career.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { aparApplications, pbasApplications, triggerNotification } =
    useCareerAdvancement();

  const stats = useMemo(() => {
    const total = aparApplications.length + pbasApplications.length;
    const aparCount = aparApplications.length;
    const pbasCount = pbasApplications.filter(
      (p: CareerAdvancement.CASPBASApplication) => p.type === 'PBAS'
    ).length;
    const casCount = pbasApplications.filter(
      (p: CareerAdvancement.CASPBASApplication) => p.type === 'CAS'
    ).length;
    const pendingScreening =
      aparApplications.filter(
        (a: CareerAdvancement.CASAPARApplication) => a.status === 'Pending'
      ).length +
      pbasApplications.filter(
        (p: CareerAdvancement.CASPBASApplication) => p.status === 'Pending'
      ).length;
    const completed =
      aparApplications.filter(
        (a: CareerAdvancement.CASAPARApplication) => a.status === 'Completed'
      ).length +
      pbasApplications.filter(
        (p: CareerAdvancement.CASPBASApplication) => p.status === 'Approved'
      ).length;
    return {
      total,
      aparCount,
      pbasCount,
      casCount,
      pendingScreening,
      completed,
    };
  }, [aparApplications, pbasApplications]);

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
      });
    });
    return list;
  }, [aparApplications, pbasApplications]);

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('complete') || s.includes('approved'))
      return 'ca-badge--complete';
    if (s.includes('pending') || s.includes('draft') || s.includes('forwarded'))
      return 'ca-badge--pending';
    if (
      s.includes('reject') ||
      s.includes('resubmit') ||
      s.includes('withdraw')
    )
      return 'ca-badge--rejected';
    return 'ca-badge--draft';
  };

  const getSchemeClass = (scheme: string) => {
    if (scheme === 'APAR') return 'ca-badge--apar';
    if (scheme === 'PBAS') return 'ca-badge--pbas';
    return 'ca-badge--cas';
  };

  const statCards = [
    { label: 'Total Apps', val: stats.total, color: 'indigo', icon: 'pi-file' },
    {
      label: 'APAR Apps',
      val: stats.aparCount,
      color: 'purple',
      icon: 'pi-file-o',
    },
    {
      label: 'PBAS Apps',
      val: stats.pbasCount,
      color: 'emerald',
      icon: 'pi-chart-bar',
    },
    {
      label: 'CAS Apps',
      val: stats.casCount,
      color: 'amber',
      icon: 'pi-bookmark',
    },
    {
      label: 'Pending Screening',
      val: stats.pendingScreening,
      color: 'rose',
      icon: 'pi-clock',
    },
    {
      label: 'Completed',
      val: stats.completed,
      color: 'teal',
      icon: 'pi-check',
    },
  ];

  return (
    <FormPage
      title="Career Advancement Dashboard"
      description="Overview of APAR, PBAS, and CAS scheme applications across the university"
      breadcrumbs={[
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Hero */}
        <div className="ca-hero">
          <div className="ca-hero-content">
            <h2 className="ca-hero-title">Career Advancement Scheme Centre</h2>
            <p className="ca-hero-desc">
              Track APAR annual performance reports, PBAS self-appraisals, and
              CAS promotion applications across all departments.
            </p>
          </div>
          <div className="ca-hero-action">
            <Button
              label="New APAR Application +"
              variant="primary"
              onClick={() => navigate('/career-advancement/apar-employee')}
            />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="ca-stats-grid">
          {statCards.map(s => (
            <div
              key={s.label}
              className={`ca-stat-card ca-stat-card--${s.color}`}
            >
              <div className="ca-stat-label">{s.label}</div>
              <div className="ca-stat-value">{s.val}</div>
              <div className={`ca-stat-icon`}>
                <i className={`pi ${s.icon}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
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
                  <span className={`ca-badge ${getSchemeClass(item.scheme)}`}>
                    {item.scheme}
                  </span>
                ),
              },
              { field: 'session', header: 'Session' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <span className={`ca-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                ),
              },
              {
                header: 'Action',
                sortable: false,
                cell: (item: any) => (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="ca-btn-view"
                      onClick={() =>
                        triggerNotification(
                          `Opening detailed view for ${item.name}`,
                          'info'
                        )
                      }
                    >
                      <i
                        className="pi pi-eye"
                        style={{ fontSize: '0.65rem' }}
                      />{' '}
                      View
                    </button>
                    <button
                      className="ca-btn-track"
                      onClick={() => navigate('/career-advancement/apar-track')}
                    >
                      <i
                        className="pi pi-map-marker"
                        style={{ fontSize: '0.65rem' }}
                      />{' '}
                      Track
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
