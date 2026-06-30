import type { FileStatus } from '../data';

const statusColors: Record<FileStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  Forwarded: 'bg-indigo-100 text-indigo-700',
  'Returned for Clarification': 'bg-orange-100 text-orange-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Closed: 'bg-gray-200 text-gray-800',
  Archived: 'bg-purple-100 text-purple-700',
  'On Hold': 'bg-slate-100 text-slate-700',
  'Kept in Abeyance': 'bg-rose-100 text-rose-700',
};

export default function FileStatusBadge({ status }: { status: FileStatus }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}
