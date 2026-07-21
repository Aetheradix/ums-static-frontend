import { useState, useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';

// Mock Data for Audit Logs since it's typically fetched directly from a backend audit table
const MOCK_AUDIT_LOGS = [
  {
    id: 'AL-001',
    timestamp: '2024-03-15T08:30:12Z',
    user: 'admin_john',
    action: 'CREATE',
    module: 'Room Allotment',
    details: 'Allotted room 101 to STU001',
    ip: '192.168.1.5',
  },
  {
    id: 'AL-002',
    timestamp: '2024-03-15T09:15:45Z',
    user: 'warden_smith',
    action: 'UPDATE',
    module: 'Gate Pass',
    details: 'Approved gate pass GP-1234',
    ip: '192.168.1.12',
  },
  {
    id: 'AL-003',
    timestamp: '2024-03-15T10:05:00Z',
    user: 'student_jane',
    action: 'LOGIN',
    module: 'Auth',
    details: 'Successful login',
    ip: '10.0.5.55',
  },
  {
    id: 'AL-004',
    timestamp: '2024-03-15T11:20:30Z',
    user: 'admin_john',
    action: 'DELETE',
    module: 'Stock Management',
    details: 'Deleted duplicate vendor record V-099',
    ip: '192.168.1.5',
  },
  {
    id: 'AL-005',
    timestamp: '2024-03-15T13:45:11Z',
    user: 'system',
    action: 'BATCH',
    module: 'Attendance',
    details: 'Auto-marked absentees for breakfast',
    ip: 'localhost',
  },
  {
    id: 'AL-006',
    timestamp: '2024-03-16T07:10:05Z',
    user: 'warden_smith',
    action: 'CREATE',
    module: 'Disciplinary',
    details: 'Logged noise violation for room 205',
    ip: '192.168.1.12',
  },
  {
    id: 'AL-007',
    timestamp: '2024-03-16T08:00:00Z',
    user: 'student_mike',
    action: 'LOGIN_FAILED',
    module: 'Auth',
    details: 'Invalid credentials',
    ip: '10.0.5.88',
  },
];

export default function SystemAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter(log => {
      const matchSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAction = actionFilter ? log.action === actionFilter : true;
      const matchModule = moduleFilter ? log.module === moduleFilter : true;

      return matchSearch && matchAction && matchModule;
    }).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [searchTerm, actionFilter, moduleFilter]);

  const uniqueActions = Array.from(new Set(MOCK_AUDIT_LOGS.map(l => l.action)));
  const uniqueModules = Array.from(new Set(MOCK_AUDIT_LOGS.map(l => l.module)));

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'DELETE':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <FormPage
      title="System Audit Logs"
      description="Track and monitor system usage, administrative actions, and security events."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Audit Logs' },
      ]}
    >
      <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search User or Details
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 border p-2 rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="w-full border p-2 rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-primary-500"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="w-full border p-2 rounded bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-primary-500"
            >
              <option value="">All Modules</option>
              {uniqueModules.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <FormCard title="System Audit Trails" icon="admin_panel_settings">
        <div className="flex justify-end mb-2">
          <span className="text-sm font-bold bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
            {filteredLogs.length} Events
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  Timestamp
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  User
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  Action
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  Module
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700 w-1/3">
                  Details
                </th>
                <th className="p-3 font-medium border-b border-slate-200 dark:border-slate-700">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No audit logs match the current filters.
                  </td>
                </tr>
              )}
              {filteredLogs.map(log => {
                const date = new Date(log.timestamp);
                return (
                  <tr
                    key={log.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div>{date.toLocaleDateString()}</div>
                      <div>{date.toLocaleTimeString()}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {log.user}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                      {log.module}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-500">
                      {log.ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
