import { useState } from 'react';
import { FormCard, FormPage, GridPanel, Tabs } from 'shared/new-components';
import { type SystemLog, initialSystemLogs } from '../../data';
import { essentialServicesUrls } from '../../urls';

export default function SystemLogsPage() {
  const [logs] = useState<SystemLog[]>(initialSystemLogs);

  const emailLogs = logs.filter(l => l.type === 'Email');
  const actionLogs = logs.filter(l => l.type === 'Action');

  return (
    <FormPage
      title="System Audit Logs"
      description="View transaction process logs and email notification alerts generated across Parking, Conference, Guest House, and Transport cells."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'System Logs' },
      ]}
    >
      <Tabs
        tabs={[
          {
            title: 'Email Notification Logs',
            content: (
              <FormCard title="Dispatched Email Logs">
                <GridPanel
                  data={emailLogs}
                  columns={[
                    {
                      cell: (_, option) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    {
                      field: 'service',
                      header: 'Section Cell',
                      width: '130px',
                    },
                    {
                      field: 'recipientOrUser',
                      header: 'Recipient Email Address',
                      width: '220px',
                    },
                    { field: 'subjectOrAction', header: 'Mail Subject Line' },
                    { field: 'contentOrRemarks', header: 'Email Preview' },
                    {
                      field: 'timestamp',
                      header: 'Sent Timestamp',
                      width: '160px',
                    },
                  ]}
                  searchBox
                />
              </FormCard>
            ),
          },
          {
            title: 'Workflow Action Logs',
            content: (
              <FormCard title="Process Action Audit Trail">
                <GridPanel
                  data={actionLogs}
                  columns={[
                    {
                      cell: (_, option) => (
                        <span className="font-semibold text-gray-700">
                          {option.rowIndex + 1}
                        </span>
                      ),
                      width: '50px',
                    },
                    {
                      field: 'service',
                      header: 'Section Cell',
                      width: '130px',
                    },
                    {
                      field: 'recipientOrUser',
                      header: 'Operator Username',
                      width: '180px',
                    },
                    { field: 'subjectOrAction', header: 'Workflow Action' },
                    {
                      field: 'contentOrRemarks',
                      header: 'Action Notes / Remarks',
                    },
                    { field: 'timestamp', header: 'Log Date', width: '160px' },
                  ]}
                  searchBox
                />
              </FormCard>
            ),
          },
        ]}
      />
    </FormPage>
  );
}
