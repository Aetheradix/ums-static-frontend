import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { tpUrls } from '../../../urls';
import { Button } from 'primereact/button';
import { Modal } from 'shared/components/popups';
import { DropDownList } from 'shared/components/forms';
import { InputTextarea } from 'primereact/inputtextarea';
import { Column } from 'primereact/column';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

export default function StudentApplicationsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const [applications, setApplications] = useLocalStorage(
    'tp_admin_applications',
    [
      {
        id: 'APP-101',
        studentName: 'John Doe',
        rollNo: '2021CS001',
        jobTitle: 'Software Development Engineer',
        company: 'Infosys Technologies Ltd',
        appliedDate: '2024-07-25',
        round: 'Technical Interview',
        status: 'Shortlisted',
      },
      {
        id: 'APP-102',
        studentName: 'Alice Smith',
        rollNo: '2021ME045',
        jobTitle: 'Data Analyst',
        company: 'TCS',
        appliedDate: '2024-07-10',
        round: 'Aptitude Test',
        status: 'In Progress',
      },
      {
        id: 'APP-103',
        studentName: 'Bob Johnson',
        rollNo: '2021EE023',
        jobTitle: 'Frontend Developer',
        company: 'Wipro',
        appliedDate: '2024-06-15',
        round: 'Final HR',
        status: 'Offered',
      },
    ]
  );

  const [selectedApps, setSelectedApps] = useState<any[]>([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);
  const [bulkRemarks, setBulkRemarks] = useState('');

  const statusOptions = [
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Selected / Offered', value: 'Offered' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'In Progress', value: 'In Progress' },
  ];

  const filteredData = applications.filter(
    (app: any) =>
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Offered':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Shortlisted':
      case 'In Progress':
        return 'pending';
      default:
        return 'neutral';
    }
  };

  const handleView = (id: string) => {
    navigate(`${tpUrls.admin.applications}/view/${id}`);
  };

  const handleBulkUpdate = () => {
    if (!bulkStatus) return;

    setApplications(
      applications.map((app: any) =>
        selectedApps.some(selected => selected.id === app.id)
          ? { ...app, status: bulkStatus }
          : app
      )
    );

    setShowBulkDialog(false);
    setSelectedApps([]);
    setBulkStatus(null);
    setBulkRemarks('');
  };

  return (
    <FormPage
      title="Student Applications"
      description="Review and manage student applications across all placement drives."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Student Applications' },
      ]}
      headerAction={
        <div className="flex gap-2">
          {selectedApps.length > 0 && (
            <Button
              label={`Bulk Update (${selectedApps.length})`}
              icon="pi pi-check-square"
              severity="warning"
              onClick={() => setShowBulkDialog(true)}
            />
          )}
          <Button
            label="Export to Excel"
            icon="pi pi-file-excel"
            severity="success"
            onClick={() => alert('Exporting data...')}
          />
        </div>
      }
    >
      <FormCard>
        <div className="p-4">
          <div className="mb-4 flex w-full sm:w-80 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="pi pi-search" />
            </span>
            <input
              type="text"
              placeholder="Search by student, roll no, or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <GridPanel
            data={filteredData}
            dataKey="id"
            emptyMessage="No applications found."
            pagination
            selection={selectedApps}
            onSelectionChange={(e: any) => setSelectedApps(e.value)}
            columns={
              [
                { field: 'studentName', header: 'Student Name' },
                { field: 'rollNo', header: 'Roll No.' },
                { field: 'company', header: 'Company' },
                { field: 'jobTitle', header: 'Job Title' },
                { field: 'round', header: 'Current Round' },
                {
                  field: 'status',
                  header: 'Status',
                  body: (row: any) => (
                    <StatusBadge
                      label={row.status}
                      variant={getStatusVariant(row.status)}
                    />
                  ),
                },
                {
                  field: 'actions',
                  header: 'Actions',
                  body: (row: any) => (
                    <div className="flex gap-2">
                      <Button
                        icon="pi pi-eye"
                        className="p-button-rounded p-button-text p-button-info p-1"
                        tooltip="View Application"
                        onClick={() => handleView(row.id)}
                      />
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-warning p-1"
                        tooltip="Update Status / Offer"
                        onClick={() => handleView(row.id)}
                      />
                    </div>
                  ),
                },
              ] as never[]
            }
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
          </GridPanel>
        </div>
      </FormCard>

      <Modal
        header="Bulk Update Hiring Status"
        visible={showBulkDialog}
        size="medium"
        onHide={() => setShowBulkDialog(false)}
      >
        <div className="flex flex-col gap-4 p-4">
          <p className="text-gray-600">
            You are updating the status for{' '}
            <strong>{selectedApps.length}</strong> selected applications.
          </p>
          <DropDownList
            label="New Status"
            value={bulkStatus || ''}
            data={statusOptions}
            textField="label"
            valueField="value"
            onChange={v => setBulkStatus(v as string)}
            defaultOptionText="Select a Status"
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Remarks (Optional)
            </label>
            <InputTextarea
              value={bulkRemarks}
              onChange={e => setBulkRemarks(e.target.value)}
              rows={3}
              placeholder="Add any internal remarks..."
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowBulkDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Update Status"
              icon="pi pi-check"
              onClick={handleBulkUpdate}
              autoFocus
              disabled={!bulkStatus}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
