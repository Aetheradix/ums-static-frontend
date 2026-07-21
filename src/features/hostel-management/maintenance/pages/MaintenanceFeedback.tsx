import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function MaintenanceFeedback() {
  const { maintenanceRequests, setMaintenanceRequests, triggerNotification } =
    useHostel();

  // Mock logged in student
  const loggedInStudentId = 'STU-101';

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackRemarks, setFeedbackRemarks] = useState('');

  // Find requests created by this student that are RESOLVED
  const resolvedRequests = maintenanceRequests.filter(
    m => m.reportedBy === loggedInStudentId && m.status === 'RESOLVED'
  );

  // Find requests that already have feedback provided (CLOSED)
  const closedRequests = maintenanceRequests.filter(
    m => m.reportedBy === loggedInStudentId && m.status === 'CLOSED'
  );

  const selectedRequest = resolvedRequests.find(
    m => m.id === selectedRequestId
  );

  const handleSubmitFeedback = () => {
    if (!selectedRequestId) return;

    setMaintenanceRequests(prev =>
      prev.map(m =>
        m.id === selectedRequestId
          ? { ...m, status: 'CLOSED', feedbackScore, feedbackRemarks }
          : m
      )
    );

    triggerNotification(
      'Feedback submitted successfully. Request is now closed.',
      'success'
    );
    setSelectedRequestId(null);
    setFeedbackScore(5);
    setFeedbackRemarks('');
  };

  return (
    <FormPage
      title="Maintenance Feedback"
      description="Provide feedback on recently resolved maintenance issues and close the requests."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Maintenance', to: '/hostel-management/maintenance/requests' },
        { label: 'Feedback' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Awaiting Feedback" icon="rate_review">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Request ID</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Resolution Remarks</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-slate-500"
                      >
                        No resolved requests awaiting feedback.
                      </td>
                    </tr>
                  )}
                  {resolvedRequests.map(req => (
                    <tr
                      key={req.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 font-medium">{req.id}</td>
                      <td
                        className="p-2 max-w-xs truncate"
                        title={req.description}
                      >
                        {req.description}
                      </td>
                      <td
                        className="p-2 max-w-xs truncate text-slate-500"
                        title={req.resolutionRemarks}
                      >
                        {req.resolutionRemarks || 'N/A'}
                      </td>
                      <td className="p-2">
                        <Button
                          label="Provide Feedback"
                          variant={
                            selectedRequestId === req.id
                              ? 'primary'
                              : 'outlined'
                          }
                          onClick={() => {
                            setSelectedRequestId(req.id);
                            setFeedbackScore(5);
                            setFeedbackRemarks('');
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>

          <div className="mt-8">
            <FormCard
              title="Closed Requests (Past Feedback)"
              icon="check_circle"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                      <th className="p-2">Request ID</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Score</th>
                      <th className="p-2">Your Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedRequests.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-slate-500"
                        >
                          No closed requests.
                        </td>
                      </tr>
                    )}
                    {closedRequests.map(req => (
                      <tr
                        key={req.id}
                        className="border-b border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-2 font-medium">{req.id}</td>
                        <td
                          className="p-2 max-w-xs truncate"
                          title={req.description}
                        >
                          {req.description}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${req.feedbackScore && req.feedbackScore >= 4 ? 'bg-green-100 text-green-700' : req.feedbackScore && req.feedbackScore <= 2 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                          >
                            {req.feedbackScore} / 5
                          </span>
                        </td>
                        <td className="p-2 text-slate-500 max-w-xs truncate">
                          {req.feedbackRemarks || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FormCard>
          </div>
        </div>

        {selectedRequest && (
          <div className="w-full lg:w-1/3">
            <FormCard title="Provide Feedback" icon="star_rate">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Description
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.description}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Resolution by Staff
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.resolutionRemarks ||
                      'No remarks provided.'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Satisfaction Score (1-5) *
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feedbackScore}
                  onChange={e => setFeedbackScore(parseInt(e.target.value))}
                  className="w-full mb-2"
                />
                <div className="text-center font-semibold mb-4 text-primary-600">
                  {feedbackScore} / 5
                </div>

                <TextBox
                  label="Feedback Comments"
                  value={feedbackRemarks}
                  onChange={setFeedbackRemarks}
                  placeholder="Any comments on the work done?"
                />

                <div className="flex gap-2 mt-4">
                  <Button
                    label="Submit & Close Request"
                    variant="primary"
                    onClick={handleSubmitFeedback}
                  />
                </div>
              </div>
            </FormCard>
          </div>
        )}
      </div>
    </FormPage>
  );
}
