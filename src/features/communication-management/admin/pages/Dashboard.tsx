import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { communications, groups } from '../../mocks';
import { commUrls } from '../../urls';
import '../../Communication.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr'];

function monthOf(date: string): string {
  // date strings look like "02 Jan 2024" — take the middle token.
  return date.split(' ')[1] ?? '';
}

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

function MonthlyVolumeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const emailData = MONTHS.map(
      m =>
        communications.filter(
          c => c.channel === 'Email' && monthOf(c.date) === m
        ).length
    );
    const smsData = MONTHS.map(
      m =>
        communications.filter(c => c.channel === 'SMS' && monthOf(c.date) === m)
          .length
    );
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [
          { label: 'Email', data: emailData, backgroundColor: '#3b82f6' },
          { label: 'SMS', data: smsData, backgroundColor: '#8b5cf6' },
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
    const emails = communications.filter(c => c.channel === 'Email');
    const sms = communications.filter(c => c.channel === 'SMS');
    const reached = communications.reduce(
      (sum, c) => sum + c.recipientCount,
      0
    );
    return {
      emails: emails.length,
      sms: sms.length,
      reached,
      groups: groups.length,
    };
  }, []);

  return (
    <FormPage
      title="Communication Dashboard"
      description="Bulk messaging overview — email vs SMS volume, reach and active groups."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
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
        <FormCard title="Monthly Volume">
          <div className="comm-chart-box">
            <MonthlyVolumeChart />
          </div>
        </FormCard>
      </div>

      <div className="comm-charts-row">
        <FormCard title="Quick Actions">
          <div className="flex flex-col gap-3">
            <Button
              label="Compose Email"
              icon="envelope"
              onClick={() => navigate(commUrls.admin.composeEmail)}
            />
            <Button
              label="Compose SMS"
              icon="comment"
              variant="outlined"
              onClick={() => navigate(commUrls.admin.composeSms)}
            />
            <Button
              label="Manage Groups"
              icon="users"
              variant="outlined"
              onClick={() => navigate(commUrls.admin.groups)}
            />
            <Button
              label="View Communication Logs"
              icon="list"
              variant="outlined"
              onClick={() => navigate(commUrls.admin.logs)}
            />
          </div>
        </FormCard>
        <FormCard title="About this module">
          <p className="p-1 text-sm leading-relaxed text-gray-600">
            The Communication module lets the administration reach employees and
            students in bulk over email and SMS. Compose messages, target
            reusable groups or mailing lists, and audit every send from the
            Communication Logs.
          </p>
        </FormCard>
      </div>
    </FormPage>
  );
}
