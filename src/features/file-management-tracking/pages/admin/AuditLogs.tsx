import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatusBadge } from 'shared/new-components';
import { mockAuditLogs, mockUsers } from '../../data';

export default function AuditLogs() {
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
      title="Audit Logs"
      description="View and filter system audit trail"
    >
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
        pagination={{ rows: 15 }}
        toolbar={
          <div className="flex gap-2">
            <DropDownList
              value={userFilter}
              onChange={v => setUserFilter(v as string)}
              data={[
                { value: 'all', label: 'All Users' },
                ...mockUsers.map(u => ({ value: String(u.id), label: u.name })),
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
    </FormPage>
  );
}
