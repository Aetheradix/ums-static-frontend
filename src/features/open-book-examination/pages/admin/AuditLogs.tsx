import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockAuditLogs } from '../../data';

export default function AuditLogs() {
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered =
    actionFilter === 'all'
      ? mockAuditLogs
      : mockAuditLogs.filter(l => l.action === actionFilter);

  return (
    <FormPage
      title="Audit Logs"
      description="Complete activity trail for all system changes"
    >
      <InfoBanner
        title="About Audit Logs"
        message="Review a complete, immutable trail of all system activities. You can filter logs by action type to track down who created, updated, or deleted specific records across the university system."
      />
      <GridPanel
        title="Audit Logs"
        data={filtered}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <>
            <DropDownList
              value={actionFilter}
              onChange={v => setActionFilter(v as string)}
              data={[
                { value: 'all', label: 'All Actions' },
                { value: 'INSERT', label: 'Create' },
                { value: 'UPDATE', label: 'Update' },
                { value: 'DELETE', label: 'Delete' },
              ]}
              textField="label"
              valueField="value"
            />
            <div className="flex justify-center">
              <Button
                label="Export CSV"
                icon="download"
                className="whitespace-nowrap"
              />
            </div>
          </>
        }
        columns={
          [
            {
              field: 'timestamp',
              header: 'Timestamp',
              cell: (row: { timestamp: string }) => (
                <span className="font-mono text-xs">
                  {new Date(row.timestamp).toLocaleString()}
                </span>
              ),
            },
            { field: 'performedByName', header: 'User' },
            {
              field: 'action',
              header: 'Action',
              cell: (row: { action: string }) => (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.action === 'INSERT' ? 'bg-green-100 text-green-800' : row.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}
                >
                  {row.action}
                </span>
              ),
            },
            {
              field: 'tableName',
              header: 'Table',
              cell: (row: { tableName: string }) => (
                <span className="font-mono text-xs">{row.tableName}</span>
              ),
            },
            {
              field: 'recordId',
              header: 'Record',
              cell: (row: { recordId: number }) => <span>#{row.recordId}</span>,
            },
            {
              field: 'newValues',
              header: 'Details',
              cell: (row: { newValues?: unknown; oldValues?: unknown }) => (
                <span className="max-w-xs truncate text-gray-500 block">
                  {JSON.stringify(row.newValues || row.oldValues)}
                </span>
              ),
            },
          ] as any
        }
      />
    </FormPage>
  );
}
