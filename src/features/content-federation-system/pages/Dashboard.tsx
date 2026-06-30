import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormPage, FormCard, StatCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';
import { cfsUrls } from '../urls';
import { mockContent, mockActivityLogs } from '../mockdata';
import type { ContentItem } from '../types';
import Chart from 'chart.js/auto';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Infer role from the URL path instead of manual toggle
  const role = location.pathname.includes('/ou-admin')
    ? 'ouAdmin'
    : location.pathname.includes('/reviewer')
      ? 'reviewer'
      : 'admin';

  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);

  // Stats calculation
  const total = mockContent.length;
  const published = mockContent.filter(
    (c: ContentItem) => c.status === 'Published'
  ).length;
  const pending = mockContent.filter(
    (c: ContentItem) => c.status === 'Pending Review'
  ).length;
  const draft = mockContent.filter(
    (c: ContentItem) => c.status === 'Draft'
  ).length;
  const approved = mockContent.filter(
    (c: ContentItem) => c.status === 'Approved'
  ).length;
  const rejected = mockContent.filter(
    (c: ContentItem) => c.status === 'Rejected'
  ).length;
  const onHold = mockContent.filter(
    (c: ContentItem) => c.status === 'On Hold'
  ).length;
  const expired = mockContent.filter(
    (c: ContentItem) => c.status === 'Expired'
  ).length;

  useEffect(() => {
    if (!barRef.current || !doughnutRef.current) return;

    const barCtx = barRef.current.getContext('2d');
    const doughnutCtx = doughnutRef.current.getContext('2d');

    if (!barCtx || !doughnutCtx) return;

    const barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Notices', 'Circulars', 'Press Releases'],
        datasets: [
          {
            label: 'Content items',
            data: [2, 2, 0],
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const doughnutChart = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Published', 'Pending Review', 'Draft', 'Approved'],
        datasets: [
          {
            data: [published, pending, draft, approved],
            backgroundColor: ['#10b981', '#f59e0b', '#6b7280', '#14b8a6'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      barChart.destroy();
      doughnutChart.destroy();
    };
  }, [published, pending, draft, approved]);

  return (
    <FormPage
      title={
        role === 'ouAdmin'
          ? 'OU Admin Dashboard'
          : role === 'reviewer'
            ? 'Reviewer Dashboard'
            : 'CFS Admin Dashboard'
      }
      description="Overview of published, pending review, draft, and expiring documents across OUs."
      breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }, { label: 'Dashboard' }]}
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Submissions"
          value={total}
          icon="layers"
          colorScheme="blue"
        />
        <StatCard
          title="Published"
          value={published}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon="schedule"
          colorScheme="amber"
        />
        <StatCard
          title="Drafts"
          value={draft}
          icon="description"
          colorScheme="indigo"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon="thumb_up"
          colorScheme="teal"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="On Hold"
          value={onHold}
          icon="pause_circle"
          colorScheme="purple"
        />
        <StatCard
          title="Expired"
          value={expired}
          icon="warning"
          colorScheme="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <FormCard title="Submission Status Breakdown">
            <div
              className="p-4 flex items-center justify-center"
              style={{ height: '240px' }}
            >
              <canvas ref={doughnutRef} className="h-full w-full" />
            </div>
          </FormCard>
        </div>
        <div>
          <FormCard title="Quick Actions">
            <div className="flex gap-4 mb-6">
              <Button
                label="Global Stats"
                variant="primary"
                onClick={() => {}}
              />
              <Button
                label="My OU Stats"
                variant="outlined"
                onClick={() => {}}
              />
            </div>
            <div className="p-4 flex flex-col gap-3">
              {(role === 'admin' || role === 'ouAdmin') && (
                <button
                  type="button"
                  onClick={() => navigate(cfsUrls.ouAdmin.addContent)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <i className="pi pi-plus" /> Add Content
                </button>
              )}
              {role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(cfsUrls.admin.settings.hub)}
                    className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <i className="pi pi-cog" /> Module Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(cfsUrls.admin.allContent)}
                    className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <i className="pi pi-list" /> View All OU Content
                  </button>
                </>
              )}
              {role === 'reviewer' && (
                <button
                  type="button"
                  onClick={() => navigate(cfsUrls.reviewer.pending)}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <i className="pi pi-inbox" /> Pending Reviews
                </button>
              )}
            </div>
          </FormCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <FormCard title="Content distribution by Category">
          <div className="p-4" style={{ height: '260px' }}>
            <canvas ref={barRef} className="h-full w-full" />
          </div>
        </FormCard>

        {/* Recent Pending Queue OR Latest Submissions based on role */}
        {role === 'reviewer' ? (
          <FormCard title="Recent Pending Queue">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">OU</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockContent
                    .filter((c: ContentItem) => c.status === 'Pending Review')
                    .map((item: ContentItem) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="p-3">{item.publishingCategoryTitle}</td>
                        <td className="p-3">{item.organizationalUnitName}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(cfsUrls.reviewer.detail(item.id))
                            }
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-xs transition"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        ) : (
          <FormCard title="Latest Content Submissions">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold">
                    <th className="p-3">Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">OU</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockContent.slice(0, 5).map((item: ContentItem) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="p-3">
                        <StatusBadge
                          label={item.status}
                          variant={
                            item.status === 'Published'
                              ? 'approved'
                              : item.status === 'Pending Review'
                                ? 'pending'
                                : 'neutral'
                          }
                        />
                      </td>
                      <td className="p-3">{item.organizationalUnitName}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(cfsUrls.content.view(item.id))
                          }
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-xs transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        )}
      </div>

      {/* Recent Activities Timeline */}
      <FormCard title="Recent Activities">
        <div className="p-4">
          <div className="relative border-l-2 border-gray-200 ml-3 flex flex-col gap-6">
            {mockActivityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="relative pl-6">
                <span className="absolute -left-2 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                <div className="flex flex-col">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                      {log.user}
                    </span>
                    <span className="text-gray-600"> ({log.role}) </span>
                    <span className="text-gray-900 font-medium">
                      {log.action.toLowerCase()}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(cfsUrls.admin.activityLogs)}
                  >
                    "{log.affectedItem}"
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {role === 'admin' && (
            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <button
                onClick={() => navigate(cfsUrls.admin.activityLogs)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                View All Activity Logs →
              </button>
            </div>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
