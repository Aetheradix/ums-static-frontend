import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockFileMovements, mockFiles } from '../../data';

export default function FileHistory() {
  const navigate = useNavigate();
  const [fileFilter, setFileFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered = mockFileMovements
    .filter(m => {
      if (fileFilter !== 'all' && m.fileId !== Number(fileFilter)) return false;
      if (actionFilter !== 'all' && m.action !== actionFilter) return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    );

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Employee' },
        { label: 'File History' },
      ]}
      title="File History"
      description="Complete movement history across all files"
    >
      <GridPanel
        title="History"
        data={filtered}
        columns={
          [
            {
              field: 'fileNumber',
              header: 'File #',
              cell: (row: any) => (
                <span
                  className="text-xs font-medium text-blue-600 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/file-management-tracking/employee/view/${row.fileId}`
                    )
                  }
                >
                  {row.fileNumber}
                </span>
              ),
            },
            {
              field: 'action',
              header: 'Action',
              cell: (row: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.action === 'Created' || row.action === 'Approved'
                      ? 'bg-green-100 text-green-700'
                      : row.action === 'Rejected' || row.action === 'Revoked'
                        ? 'bg-red-100 text-red-700'
                        : row.action === 'Forwarded'
                          ? 'bg-blue-100 text-blue-700'
                          : row.action === 'Sent Back'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {row.action}
                </span>
              ),
            },
            {
              field: 'fromUserName',
              header: 'From',
              cell: (row: any) => <span>{row.fromUserName || '—'}</span>,
            },
            {
              field: 'toUserName',
              header: 'To',
              cell: (row: any) => <span>{row.toUserName || '—'}</span>,
            },
            {
              field: 'remarks',
              header: 'Remarks',
              cell: (row: any) => (
                <span className="text-xs text-gray-500 max-w-[200px] truncate block">
                  {row.remarks || '—'}
                </span>
              ),
            },
            {
              field: 'actionDate',
              header: 'Date',
              cell: (row: any) => (
                <span className="text-xs">{row.actionDate}</span>
              ),
            },
            {
              field: 'slaStatus',
              header: 'SLA',
              cell: (row: any) =>
                row.slaStatus ? (
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      row.slaStatus === 'OnTrack'
                        ? 'bg-green-50 text-green-600'
                        : row.slaStatus === 'Approaching'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {row.slaStatus}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
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
              value={fileFilter}
              onChange={v => setFileFilter(v as string)}
              data={[
                { value: 'all', label: 'All Files' },
                ...mockFiles.map(f => ({
                  value: String(f.id),
                  label: f.fileNumber,
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
                  'Created',
                  'Forwarded',
                  'Approved',
                  'Rejected',
                  'Sent Back',
                  'Escalated',
                  'Closed',
                  'Revoked',
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
