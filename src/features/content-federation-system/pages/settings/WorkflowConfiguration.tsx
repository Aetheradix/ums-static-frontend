import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { ToastService } from 'services';

export default function WorkflowConfiguration() {
  const [reviewerRole, setReviewerRole] = useState('cfs_reviewer');
  const [autoAssign, setAutoAssign] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [escalationDays, setEscalationDays] = useState(3);

  // Notification Triggers
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(true);
  const [notifyOnReview, setNotifyOnReview] = useState(true);
  const [notifyOnApprove, setNotifyOnApprove] = useState(true);
  const [notifyOnReject, setNotifyOnReject] = useState(true);

  const handleSave = () => {
    ToastService.success('Workflow configuration saved successfully.');
  };

  return (
    <FormPage
      title="Workflow Configuration"
      description="Configure reviewer levels, routing logic, and escalation triggers."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Settings', to: cfsUrls.admin.settings.hub },
        { label: 'Workflow Configuration' },
      ]}
    >
      <FormCard title="Workflow Settings">
        <div className="p-6 flex flex-col gap-8">
          {/* Editorial Approval Chain */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
              Editorial Approval Chain
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    OU Administrator
                  </h4>
                  <p className="text-xs text-blue-700">
                    Creates & initiates content
                  </p>
                </div>
              </div>
              <i className="pi pi-arrow-right text-blue-400 hidden md:block text-xl" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">CFS Reviewer</h4>
                  <p className="text-xs text-blue-700">
                    Validates & recommends approval
                  </p>
                </div>
              </div>
              <i className="pi pi-arrow-right text-blue-400 hidden md:block text-xl" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-md">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">
                    CFS Administrator
                  </h4>
                  <p className="text-xs text-green-700">
                    Final review & publication
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Routing Logic & Timelines */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
              Routing Logic & Timelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-150">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Default Reviewer Role
                </label>
                <select
                  value={reviewerRole}
                  onChange={e => setReviewerRole(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="cfs_reviewer">
                    CFS Reviewer (cfs_reviewer)
                  </option>
                  <option value="cfs_admin">CFS Admin (cfs_admin)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Role assigned to step 2 of the approval chain.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Escalation Deadline (Days)
                </label>
                <input
                  type="number"
                  value={escalationDays}
                  onChange={e => setEscalationDays(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Days before pending review is escalated to Admin.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:col-span-2 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    checked={autoAssign}
                    onChange={e => setAutoAssign(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <label
                    htmlFor="autoAssign"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Auto-assign content to reviewers belonging to the initiating
                    Organizational Unit (OU)
                    <p className="text-xs text-gray-500 font-normal mt-0.5">
                      If disabled, goes to a global reviewer pool.
                    </p>
                  </label>
                </div>

                <div className="flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="autoPublish"
                    checked={autoPublish}
                    onChange={e => setAutoPublish(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <label
                    htmlFor="autoPublish"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Enable Auto-Publish on Approval
                    <p className="text-xs text-gray-500 font-normal mt-0.5">
                      Automatically mark content as Published once CFS Admin
                      approves it.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Triggers */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
              Notification Triggers
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Select which workflow events trigger email and in-app
                notifications to involved users.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={notifyOnSubmit}
                    onChange={e => setNotifyOnSubmit(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    On Content Submission (to Reviewers)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={notifyOnReview}
                    onChange={e => setNotifyOnReview(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    On Review Completion (to Admins)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={notifyOnApprove}
                    onChange={e => setNotifyOnApprove(e.target.checked)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    On Final Approval/Publish (to OU Admin)
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={notifyOnReject}
                    onChange={e => setNotifyOnReject(e.target.checked)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    On Rejection/Return (to Initiator)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              label="Reset to Default"
              variant="outlined"
              onClick={() => {
                setReviewerRole('cfs_reviewer');
                setEscalationDays(3);
                setAutoAssign(true);
                setAutoPublish(false);
                setNotifyOnSubmit(true);
                setNotifyOnReview(true);
                setNotifyOnApprove(true);
                setNotifyOnReject(true);
              }}
            />
            <Button
              label="Save Configuration"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
