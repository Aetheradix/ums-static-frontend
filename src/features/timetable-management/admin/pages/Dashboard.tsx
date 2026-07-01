import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  clashes,
  timetableEntries,
  timetables,
  type ClashType,
  type TimetableStatus,
} from '../../mocks';
import { timetableUrls } from '../../urls';
import '../../Timetable.css';

function ClashTypesChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const types: ClashType[] = ['Faculty', 'Room', 'Section', 'Equipment'];
    const counts = types.map(t => clashes.filter(c => c.type === t).length);
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: types,
        datasets: [
          {
            data: counts,
            backgroundColor: ['#ef4444', '#f59e0b', '#6366f1', '#10b981'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function TimetableStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels: TimetableStatus[] = [
      'Draft',
      'Generated',
      'Conflict',
      'Published',
    ];
    const counts = labels.map(
      l => timetables.filter(t => t.status === l).length
    );
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Timetables',
            data: counts,
            backgroundColor: ['#94a3b8', '#f59e0b', '#ef4444', '#10b981'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const active = timetables.filter(t => t.status === 'Published').length;
    const totalClasses = timetables.reduce((sum, t) => sum + t.classesCount, 0);
    const unresolved = clashes.filter(c => c.status !== 'Resolved').length;
    const busySlots = timetableEntries.length;
    const capacity = 6 * 8; // 6 days x 8 periods
    const utilisation = Math.round((busySlots / capacity) * 100);
    return { active, totalClasses, unresolved, utilisation };
  }, []);

  return (
    <FormPage
      title="Timetable Dashboard"
      description="Academic scheduling overview — timetables, classes, clashes and room utilisation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Timetable Admin', to: timetableUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="ttm-stats-grid">
        <StatCard
          title="Active Timetables"
          value={stats.active}
          icon="event_available"
          colorScheme="green"
          subtitle="Published this session"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="menu_book"
          colorScheme="blue"
          subtitle="Scheduled across sections"
        />
        <StatCard
          title="Unresolved Clashes"
          value={stats.unresolved}
          icon="warning"
          colorScheme="red"
          subtitle="Awaiting resolution"
        />
        <StatCard
          title="Room Utilisation"
          value={`${stats.utilisation}%`}
          icon="meeting_room"
          colorScheme="purple"
          subtitle="Slots occupied"
        />
      </div>

      <div className="ttm-charts-row">
        <FormCard title="Clash Types">
          <div className="ttm-chart-box">
            <ClashTypesChart />
          </div>
        </FormCard>
        <FormCard title="Timetable Status">
          <div className="ttm-chart-box">
            <TimetableStatusChart />
          </div>
        </FormCard>
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            label="New Session Setup"
            icon="plus"
            onClick={() => navigate(timetableUrls.admin.setupNew)}
          />
          <Button
            label="Review Clashes"
            icon="filter"
            variant="outlined"
            onClick={() => navigate(timetableUrls.admin.clashes)}
          />
          <Button
            label="Manage Timetables"
            icon="list"
            variant="outlined"
            onClick={() => navigate(timetableUrls.admin.timetables)}
          />
          <Button
            label="Open Reports"
            icon="chart-bar"
            variant="outlined"
            onClick={() => navigate(timetableUrls.admin.reports)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
