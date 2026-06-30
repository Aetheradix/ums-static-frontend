import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import StatCard from 'shared/new-components/StatCard/StatCard';
import { InfoBanner, ReportExportButtons } from '../../components';
import { mockAuditLogs, mockUsers } from '../../data';

export default function AuditLogReport() {
  const [userFilter, setUserFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered = mockAuditLogs.filter(l => {
    if (userFilter !== 'all' && l.performedBy !== Number(userFilter))
      return false;
    if (actionFilter !== 'all' && l.action !== actionFilter) return false;
    return true;
  });

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Reports' },
        { label: 'Audit Log Export' },
      ]}
      title="Audit Log Export"
      description="View and export system audit logs"
    >
      <InfoBanner
        title="About Audit Log Export"
        message="Ensure complete accountability by tracing every system modification, login, and file movement."
      />
      <div className="mb-6 flex justify-end">
        <ReportExportButtons />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Logs"
          value={mockAuditLogs.length}
          icon="history"
          colorScheme="blue"
        />
        <StatCard
          title="Filtered Logs"
          value={filtered.length}
          icon="filter_alt"
          colorScheme="purple"
        />
        <StatCard
          title="Active Users"
          value={new Set(mockAuditLogs.map(l => l.performedBy)).size}
          icon="group"
          colorScheme="green"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
        <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon name="list_alt" className="text-[18px]" />
          </div>
          Audit Log Details
        </h3>
        <GridPanel
          title="Audit Logs"
          data={filtered}
          columns={
            [
              {
                field: 'createdAt',
                header: 'Timestamp',
                cell: (row: any) => (
                  <span className="text-xs">{row.createdAt}</span>
                ),
              },
              { field: 'performedByName', header: 'User' },
              {
                field: 'action',
                header: 'Action',
                cell: (row: any) => (
                  <StatusBadge
                    label={row.action}
                    variant={
                      ['INSERT', 'CREATE', 'APPROVE'].includes(row.action)
                        ? 'approved'
                        : ['DELETE', 'REJECT'].includes(row.action)
                          ? 'rejected'
                          : ['UPDATE', 'FORWARD', 'LOCK', 'UNLOCK'].includes(
                                row.action
                              )
                            ? 'pending'
                            : 'neutral'
                    }
                  />
                ),
              },
              {
                field: 'tableName',
                header: 'Entity',
                cell: (row: any) => (
                  <span className="font-mono text-xs">{row.tableName}</span>
                ),
              },
              {
                field: 'recordId',
                header: 'Record ID',
                cell: (row: any) => <span>#{row.recordId}</span>,
              },
              {
                field: 'ipAddress',
                header: 'IP',
                cell: (row: any) => (
                  <span className="font-mono text-xs text-gray-400">
                    {row.ipAddress || '—'}
                  </span>
                ),
              },
            ] as any
          }
          dataKey="id"
          searchBox
          pagination={{ rows: 20 }}
          toolbar={
            <div className="flex gap-2">
              <DropDownList
                value={userFilter}
                onChange={v => setUserFilter(v as string)}
                data={[
                  { value: 'all', label: 'All Users' },
                  ...mockUsers.map(u => ({
                    value: String(u.id),
                    label: u.name,
                  })),
                ]}
                textField="label"
                valueField="value"
              />
              <DropDownList
                value={actionFilter}
                onChange={v => setActionFilter(v as string)}
                data={[
                  { value: 'all', label: 'All Actions' },
                  ...[
                    'INSERT',
                    'UPDATE',
                    'DELETE',
                    'VIEW',
                    'APPROVE',
                    'REJECT',
                    'FORWARD',
                    'LOCK',
                    'UNLOCK',
                  ].map(a => ({ value: a, label: a })),
                ]}
                textField="label"
                valueField="value"
              />
            </div>
          }
        />
      </div>
    </FormPage>
  );
}
