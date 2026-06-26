import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { feedbackSessions, studentResponses } from '../../data';
import { feedbackUrls } from '../../urls';

const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
  };

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div className={`text-xs font-medium mb-1 ${c.text} opacity-70`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Partial: 'bg-yellow-50 text-yellow-700',
  Pending: 'bg-gray-100 text-gray-500',
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = 'STU001';

  const myResponses = studentResponses.filter(r => r.studentId === studentId);
  const pendingCount = myResponses.filter(
    r => r.completionStatus === 'Pending' || r.completionStatus === 'Partial'
  ).length;
  const completedCount = myResponses.filter(
    r => r.completionStatus === 'Completed'
  ).length;

  const activeSessions = feedbackSessions.filter(
    s => s.status === 'Open' || s.status === 'Published'
  );
  const nearestEndDate =
    activeSessions.length > 0
      ? activeSessions.reduce((a, b) => (a.endDate < b.endDate ? a : b)).endDate
      : '—';

  const total = myResponses.length || 1;
  const completionPct = Math.round((completedCount / total) * 100);

  const tableData = myResponses.map(r => ({
    ...r,
    session: feedbackSessions.find(s => s.id === r.sessionId),
  }));

  return (
    <FormPage
      title="My Feedback"
      description="Overview of your feedback forms."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback', to: feedbackUrls.student.dashboard },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Pending Feedback" value={pendingCount} color="orange" />
        <KpiCard
          label="Completed Feedback"
          value={completedCount}
          color="green"
        />
        <KpiCard
          label="Last Date"
          value={
            nearestEndDate === '—'
              ? '—'
              : new Date(nearestEndDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
          }
          color="blue"
        />
        <KpiCard
          label="Completion"
          value={`${completionPct}%`}
          color="purple"
        />
      </div>

      <FormCard>
        <GridPanel
          data={tableData}
          searchBox
          searchPlaceholder="Search courses..."
          columns={[
            { field: 'course', header: 'Course' },
            { field: 'faculty', header: 'Faculty' },
            {
              header: 'Status',
              cell: (item: (typeof tableData)[0]) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[item.completionStatus]}`}
                >
                  {item.completionStatus}
                </span>
              ),
            },
            {
              header: 'Due Date',
              cell: (item: (typeof tableData)[0]) => (
                <span>
                  {item.session
                    ? new Date(item.session.endDate).toLocaleDateString(
                        'en-GB',
                        { day: 'numeric', month: 'short', year: 'numeric' }
                      )
                    : '—'}
                </span>
              ),
            },
            {
              header: 'Action',
              cell: (item: (typeof tableData)[0]) => {
                if (item.completionStatus === 'Completed') {
                  return (
                    <Button
                      icon="eye"
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/student-feedback-management/student/form/${item.sessionId}/${item.id}`
                        )
                      }
                    />
                  );
                }
                if (item.completionStatus === 'Partial') {
                  return (
                    <Button
                      icon="arrow_forward"
                      variant="primary"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/student-feedback-management/student/form/${item.sessionId}/${item.id}`
                        )
                      }
                    />
                  );
                }
                return (
                  <Button
                    icon="play"
                    variant="primary"
                    size="small"
                    onClick={() =>
                      navigate(
                        `/student-feedback-management/student/form/${item.sessionId}/${item.id}`
                      )
                    }
                  />
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
