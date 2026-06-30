import { useState, useMemo } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  FormPopup,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockActivityLogs } from '../../mockdata';
import type { ActivityLogItem } from '../../types';
import StatusBadge from 'shared/new-components/StatusBadge/StatusBadge';

export default function ActivityLogsList() {
  const [logs] = useState<ActivityLogItem[]>(mockActivityLogs);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const uniqueUsers = useMemo(
    () => Array.from(new Set(logs.map(log => log.user))),
    [logs]
  );
  const uniqueActions = useMemo(
    () => Array.from(new Set(logs.map(log => log.action))),
    [logs]
  );

  const filteredLogs = logs.filter(log => {
    let match = true;
    // Convert log.timestamp like "2024-03-01 10:30 AM" to Date for comparison (simplistic approach for demo)
    const logDate = new Date(log.timestamp.split(' ')[0]);

    if (fromDate && logDate < new Date(fromDate)) match = false;
    if (toDate && logDate > new Date(toDate)) match = false;
    if (userFilter && log.user !== userFilter) match = false;
    if (actionFilter && log.action !== actionFilter) match = false;
    return match;
  });

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Published':
        return 'approved';
      case 'Approved':
        return 'approved';
      case 'Pending Review':
        return 'pending';
      case 'Rejected':
        return 'rejected';
      case 'On Hold':
        return 'neutral';
      case 'Returned':
        return 'pending';
      case 'Submitted':
        return 'neutral';
      case 'Draft':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const renderStatusTransition = (statusChange?: string) => {
    if (!statusChange) return <span className="text-gray-400">-</span>;

    if (statusChange.includes('->')) {
      const [from, to] = statusChange.split('->').map(s => s.trim());
      return (
        <div className="flex items-center gap-2">
          <StatusBadge label={from} variant={getBadgeVariant(from)} />
          <i className="pi pi-arrow-right text-gray-400 text-xs" />
          <StatusBadge label={to} variant={getBadgeVariant(to)} />
        </div>
      );
    }

    return <span>{statusChange}</span>;
  };

  return (
    <FormPage
      title="Activity Audit Logs"
      description="View full historic audit logs of actions performed within the system."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'Activity Logs' },
      ]}
    >
      {/* Filters */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Date From
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded p-1.5 text-sm"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Date To
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded p-1.5 text-sm"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            User
          </label>
          <select
            className="border border-gray-300 rounded p-1.5 text-sm bg-white"
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
          >
            <option value="">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Action
          </label>
          <select
            className="border border-gray-300 rounded p-1.5 text-sm bg-white"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        <Button
          label="Reset Filters"
          variant="text"
          onClick={() => {
            setFromDate('');
            setToDate('');
            setUserFilter('');
            setActionFilter('');
          }}
        />
      </div>

      <FormCard>
        <GridPanel
          data={filteredLogs}
          loading={false}
          searchBox
          pagination={{ rows: 10 }}
          columns={[
            { field: 'timestamp', header: 'Timestamp', sortable: true },
            { field: 'user', header: 'User', sortable: true },
            { field: 'role', header: 'Role' },
            { field: 'ou', header: 'OU', sortable: true },
            {
              field: 'action',
              header: 'Action',
              sortable: true,
              cell: (item: ActivityLogItem) => (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                  {item.action}
                </span>
              ),
            },
            { field: 'affectedItem', header: 'Affected Resource' },
            {
              field: 'statusChange',
              header: 'Transition',
              cell: (item: ActivityLogItem) =>
                renderStatusTransition(item.statusChange),
            },
            {
              field: 'timestamp',
              header: 'Details',
              width: '100px',
              cell: (item: ActivityLogItem) => (
                <button
                  type="button"
                  onClick={() => setSelectedLog(item)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold text-xs transition"
                >
                  View
                </button>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!selectedLog}
        onHide={() => setSelectedLog(null)}
        title="Activity Log Detail"
      >
        {selectedLog && (
          <div className="flex flex-col gap-3 p-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold block text-gray-500">
                Timestamp
              </span>
              <span>{selectedLog.timestamp}</span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">User</span>
              <span>
                {selectedLog.user} ({selectedLog.role})
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Organizational Unit
              </span>
              <span>{selectedLog.ou}</span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Action performed
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-medium text-xs mt-1 inline-block">
                {selectedLog.action}
              </span>
            </div>
            <div>
              <span className="font-semibold block text-gray-500">
                Affected Resource
              </span>
              <span>{selectedLog.affectedItem}</span>
            </div>
            {selectedLog.statusChange && (
              <div>
                <span className="font-semibold block text-gray-500">
                  Status Transition
                </span>
                <div className="mt-1">
                  {renderStatusTransition(selectedLog.statusChange)}
                </div>
              </div>
            )}
            {selectedLog.remarks && (
              <div>
                <span className="font-semibold block text-gray-500">
                  Remarks
                </span>
                <p className="bg-gray-50 p-3 rounded border border-gray-150 mt-1 font-mono text-xs shadow-inner">
                  {selectedLog.remarks}
                </p>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
