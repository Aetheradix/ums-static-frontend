import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel, StatusBadge, Tabs } from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import { useApplications } from '../../../queries';

export default function MyApplicationsPage() {
  const { data: applications } = useApplications();
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Filter to show only mock applications where studentName is 'Current Student' or one of the predefined ones to simulate logged-in user
  const myApplications = applications || [];

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Scheme Name', field: 'schemeName' },
    { header: 'Date Applied', field: 'date' },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <StatusBadge label={row.status} variant={statusVariant(row.status)} />
      ),
    },
    {
      header: 'Action',
      field: 'action',
      cell: (row: any) => (
        <Button
          label="View Details"
          size="small"
          variant="outlined"
          onClick={() => setSelectedApp(row)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="My Applications"
      description="Track the real-time status of your scheme applications."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Student Portal', to: '/endowment-management/student' },
        { label: 'My Applications' },
      ]}
    >
      {!selectedApp ? (
        <GridPanel
          title="Submitted Applications"
          columns={columns}
          data={myApplications}
        />
      ) : (
        <div className="space-y-6">
          <Button
            label="Back to Applications"
            icon="arrow_back"
            variant="outlined"
            onClick={() => setSelectedApp(null)}
          />

          <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedApp.schemeName}</h3>
                <p className="text-gray-500">Applied on: {selectedApp.date}</p>
              </div>
              <div className="text-right">
                <StatusBadge
                  label={selectedApp.status}
                  variant={statusVariant(selectedApp.status)}
                />
              </div>
            </div>

            <div className="mt-6">
              <Tabs
                tabs={[
                  { title: 'Application Details', content: null },
                  { title: 'Workflow History', content: null },
                ]}
                activeIndex={activeTab}
                onTabChange={e => setActiveTab(e.index)}
              />

              <div className="mt-4 p-4 border rounded bg-gray-50">
                {activeTab === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>CGPA at time of application:</strong>{' '}
                      {selectedApp.cgpa}
                    </div>
                    <div className="col-span-2">
                      <h4 className="font-bold text-gray-700 mt-2 mb-1">
                        Statement of Purpose
                      </h4>
                      <p className="text-gray-600 text-sm italic">
                        "I am highly interested in pursuing my research in this
                        field and this scholarship would immensely help me focus
                        purely on academics without financial constraints..."
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-bold">Application Submitted</div>
                        <div className="text-sm text-gray-500">
                          {selectedApp.date}
                        </div>
                      </div>
                    </div>
                    {['Eligible', 'Shortlisted', 'Selected'].includes(
                      selectedApp.status
                    ) && (
                      <div className="flex items-center gap-4 border-l-2 border-green-200 ml-4 pl-4 pt-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold -ml-8">
                          2
                        </div>
                        <div>
                          <div className="font-bold">Marked Eligible</div>
                          <div className="text-sm text-gray-500">
                            System Auto-Check
                          </div>
                        </div>
                      </div>
                    )}
                    {['Shortlisted', 'Selected'].includes(
                      selectedApp.status
                    ) && (
                      <div className="flex items-center gap-4 border-l-2 border-green-200 ml-4 pl-4 pt-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold -ml-8">
                          3
                        </div>
                        <div>
                          <div className="font-bold">Shortlisted by Admin</div>
                          <div className="text-sm text-gray-500">
                            Pending Committee Approval
                          </div>
                        </div>
                      </div>
                    )}
                    {['Selected'].includes(selectedApp.status) && (
                      <div className="flex items-center gap-4 border-l-2 border-green-200 ml-4 pl-4 pt-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold -ml-8">
                          4
                        </div>
                        <div>
                          <div className="font-bold">
                            Final Selection Approved
                          </div>
                          <div className="text-sm text-gray-500">
                            Congratulations!
                          </div>
                        </div>
                      </div>
                    )}
                    {['Rejected'].includes(selectedApp.status) && (
                      <div className="flex items-center gap-4 border-l-2 border-red-200 ml-4 pl-4 pt-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold -ml-8">
                          X
                        </div>
                        <div>
                          <div className="font-bold">Application Rejected</div>
                          <div className="text-sm text-gray-500">
                            Did not meet final cut-off.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormPage>
  );
}
