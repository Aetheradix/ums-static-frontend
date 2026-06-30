import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner } from '../../components';
import { mockFiles } from '../../data';

export default function ApproverReports() {
  const navigate = useNavigate();
  const totalFiles = mockFiles.length;
  const approved = mockFiles.filter(f => f.currentStatus === 'Approved').length;
  const rejected = mockFiles.filter(f => f.currentStatus === 'Rejected').length;
  const pending = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  ).length;

  const reportLinks = [
    {
      title: 'File Movement Report',
      description:
        'Track the flow and movement of files across the organization',
      icon: 'swap_horiz',
      path: '/file-management-tracking/reports/file-movement',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Avg Approval Time',
      description:
        'Analytics on the average time taken to process and approve files',
      icon: 'timer',
      path: '/file-management-tracking/reports/avg-approval-time',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Pending Files',
      description: 'Detailed list of all files currently awaiting review',
      icon: 'hourglass_empty',
      path: '/file-management-tracking/reports/pending-files',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'SLA Violations',
      description:
        'Identify files that have breached their Service Level Agreements',
      icon: 'warning',
      path: '/file-management-tracking/reports/sla-violations',
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Approver' },
        { label: 'Approver Reports' },
      ]}
      title="Approver Reports"
      description="File processing analytics for approvers"
    >
      <InfoBanner
        title="About Approver Reports"
        message="View and manage approver reports efficiently. Ensure all information is accurate and fully up to date."
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Files"
          value={totalFiles}
          icon="folder"
          colorScheme="blue"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon="hourglass_empty"
          colorScheme="orange"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="summarize" className="text-[18px]" />
          </div>
          Available Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportLinks.map((report, idx) => (
            <button
              key={idx}
              onClick={() => navigate(report.path)}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${report.color} group-hover:scale-110 transition-transform`}
              >
                <Icon name={report.icon} className="text-[24px]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 mb-1">
                  {report.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {report.description}
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-indigo-500 transition-colors self-center">
                <Icon name="chevron_right" className="text-[20px]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </FormPage>
  );
}
