import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, StatusBadge } from 'shared/new-components';
import Tabs from 'shared/new-components/Tabs';
import { feedbackSessions, studentResponses } from '../../data';
import { feedbackUrls } from '../../urls';

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Partial: 'bg-yellow-50 text-yellow-700',
  Pending: 'bg-gray-100 text-gray-500',
};

export default function StudentDashboard() {
  const navigate = useNavigate();

  const pendingSessions = feedbackSessions.filter(
    s => s.status === 'Published' || s.status === 'Open'
  );
  const myResponses = studentResponses.filter(r => r.studentId === 'STU001');
  const completedResponses = myResponses.filter(
    r => r.completionStatus === 'Completed'
  );
  const pendingResponses = myResponses.filter(
    r => r.completionStatus !== 'Completed'
  );

  const tabs = [
    {
      title: 'Pending Feedback',
      content: (
        <div className="flex flex-col gap-4">
          {pendingResponses.length === 0 && pendingSessions.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No pending feedback forms.
            </p>
          ) : (
            <>
              {pendingSessions
                .filter(
                  s =>
                    !myResponses.find(
                      r =>
                        r.sessionId === s.id &&
                        r.completionStatus === 'Completed'
                    )
                )
                .map(s => {
                  const existing = myResponses.find(r => r.sessionId === s.id);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {s.sessionName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {s.departments.join(', ')} · {s.programmes.join(', ')}{' '}
                          · Due: {s.endDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {existing && (
                          <StatusBadge
                            label={existing.completionStatus}
                            variant={
                              existing.completionStatus === 'Partial'
                                ? 'pending'
                                : 'rejected'
                            }
                          />
                        )}
                        <Button
                          label={existing ? 'Resume' : 'Start'}
                          icon="arrow_forward"
                          variant="primary"
                          size="small"
                          onClick={() =>
                            navigate(
                              `/student-feedback-management/student/form/${s.id}`
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Completed',
      content: (
        <div className="flex flex-col gap-4">
          {completedResponses.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No completed feedback forms.
            </p>
          ) : (
            completedResponses.map(r => {
              const session = feedbackSessions.find(s => s.id === r.sessionId);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {session?.sessionName ?? r.sessionId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {r.submittedOn}
                    </p>
                  </div>
                  <StatusBadge label="Completed" variant="approved" />
                </div>
              );
            })
          )}
        </div>
      ),
    },
    {
      title: 'History',
      content: (
        <div className="flex flex-col gap-4">
          {myResponses.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No feedback history.
            </p>
          ) : (
            myResponses.map(r => {
              const session = feedbackSessions.find(s => s.id === r.sessionId);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {session?.sessionName ?? r.sessionId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {r.faculty} · {r.course}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[r.completionStatus]}`}
                  >
                    {r.completionStatus}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Student Feedback"
      description="Complete your pending feedback forms and view your history."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Student Portal' },
      ]}
    >
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
