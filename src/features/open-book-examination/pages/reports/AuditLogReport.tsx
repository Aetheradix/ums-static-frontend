import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockAuditLogs } from '../../data';

export default function AuditLogReport() {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const filtered =
    actionFilter === 'all'
      ? mockAuditLogs
      : mockAuditLogs.filter(l => l.action === actionFilter);

  return (
    <FormPage
      title="Audit Log Report"
      description="Track all changes in the system"
    >
      <GridPanel
        title="Audit Logs"
        data={filtered}
        columns={
          [
            {
              field: 'timestamp',
              header: 'Timestamp',
              cell: (row: any) => (
                <span className="text-xs">
                  {new Date(row.timestamp).toLocaleString()}
                </span>
              ),
            },
            { field: 'performedByName', header: 'User' },
            { field: 'tableName', header: 'Table' },
            { field: 'recordId', header: 'Record ID' },
            {
              field: 'action',
              header: 'Action',
              cell: (row: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    row.action === 'INSERT'
                      ? 'bg-green-100 text-green-700'
                      : row.action === 'UPDATE'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {row.action}
                </span>
              ),
            },
            {
              field: 'details',
              header: 'Details',
              cell: (row: any) => (
                <span className="text-xs max-w-xs truncate block">
                  {JSON.stringify(row.newValues || row.oldValues || {})}
                </span>
              ),
            },
          ] as any
        }
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <DropDownList
            value={actionFilter}
            onChange={v => setActionFilter(v as string)}
            data={[
              { value: 'all', label: 'All Actions' },
              { value: 'INSERT', label: 'Insert' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
            ]}
            textField="label"
            valueField="value"
          />
        }
      />
    </FormPage>
  );
}
