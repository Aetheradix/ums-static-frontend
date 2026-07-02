import { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { communications, groups } from '../../mocks';
import { commUrls } from '../../urls';
import '../../Communication.css';

function CommsByTypeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const counts = {
      Email: communications.filter(c => c.channel === 'Email').length,
      SMS: communications.filter(c => c.channel === 'SMS').length,
    };
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: ['#3b82f6', '#8b5cf6'],
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

export default function Dashboard() {
  const stats = useMemo(() => {
    const emails = communications.filter(c => c.channel === 'Email').length;
    const sms = communications.filter(c => c.channel === 'SMS').length;
    const reached = communications.reduce(
      (sum, c) => sum + c.recipientCount,
      0
    );
    return { emails, sms, reached, groups: groups.length };
  }, []);

  return (
    <FormPage
      title="Communication Dashboard"
      description="Read-only overview of the bulk messaging activity."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Read-only Viewer', to: commUrls.viewer.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="comm-stats-grid">
        <StatCard
          title="Total Emails Sent"
          value={stats.emails}
          icon="mail"
          colorScheme="blue"
          subtitle="Bulk email campaigns"
        />
        <StatCard
          title="Total SMS Sent"
          value={stats.sms}
          icon="sms"
          colorScheme="purple"
          subtitle="Bulk SMS campaigns"
        />
        <StatCard
          title="Recipients Reached"
          value={stats.reached.toLocaleString('en-IN')}
          icon="groups"
          colorScheme="green"
          subtitle="Across all campaigns"
        />
        <StatCard
          title="Active Groups"
          value={stats.groups}
          icon="diversity_3"
          colorScheme="amber"
          subtitle="Recipient groups"
        />
      </div>

      <div className="comm-charts-row">
        <FormCard title="Communications by Type">
          <div className="comm-chart-box">
            <CommsByTypeChart />
          </div>
        </FormCard>
        <FormCard title="About this view">
          <p className="p-1 text-sm leading-relaxed text-gray-600">
            The Read-only Viewer role provides visibility into bulk
            communication activity. Use the Communication Logs to review the
            email and SMS delivery history across all campaigns.
          </p>
        </FormCard>
      </div>
    </FormPage>
  );
}
