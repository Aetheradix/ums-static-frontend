import { useState, useEffect } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { Modal } from 'shared/components/popups';
import { DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import {
  ApplicationSeedService,
  type SeedApplication,
  type ApplicationStatus,
} from '../../seed';
import { StudentSeedService } from 'features/student-management/seed/students';
import { admissionsUrls } from '../../urls';

const STATUS_OPTIONS: { label: string; value: ApplicationStatus }[] = [
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Fee Pending', value: 'Fee Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const statusVariant = (status: ApplicationStatus) => {
  switch (status) {
    case 'Approved':
      return 'approved';
    case 'Rejected':
      return 'rejected';
    case 'Fee Pending':
      return 'pending' as const;
    case 'Under Review':
      return 'pending';
    default:
      return 'neutral' as const;
  }
};

export default function ApplicationList() {
  const [applications, setApplications] = useState<SeedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<SeedApplication | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await ApplicationSeedService.getAll();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openStatusModal = (app: SeedApplication) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setConfirmVisible(true);
  };

  const handleStatusSave = async () => {
    if (!selectedApp || !newStatus) return;
    await ApplicationSeedService.updateStatus(selectedApp.id, newStatus);
    ToastService.success(`Status updated to "${newStatus}"`);
    setConfirmVisible(false);
    setSelectedApp(null);
    load();
  };

  const handleEnroll = async (app: SeedApplication) => {
    try {
      await StudentSeedService.enrollStudent({
        firstName: app.applicantName.split(' ')[0],
        lastName: app.applicantName.split(' ').slice(1).join(' '),
        email: app.email,
        phone: app.phone,
        gender: app.gender,
        dateOfBirth: app.dateOfBirth,
        programmeId: app.programmeId,
        programmeName: app.programmeName,
        academicSession: app.academicSession,
      });
      // Optionally update status to indicate enrollment is done.
      await ApplicationSeedService.updateStatus(app.id, 'Approved');
      ToastService.success('Student enrolled successfully into SIS!');
      load();
    } catch (error) {
      ToastService.error('Failed to enroll student.');
    }
  };

  return (
    <FormPage
      title="All Applications"
      description="View and manage all admission applications. Update statuses and review applicant details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'All Applications' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={applications}
          loading={loading}
          searchBox
          columns={[
            {
              cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Application No',
              field: 'applicationNo',
              sortable: true,
            },
            {
              header: 'Applicant Name',
              field: 'applicantName',
              sortable: true,
            },
            { header: 'Programme', field: 'programmeName', sortable: true },
            { header: 'Category', field: 'category', sortable: true },
            { header: 'Session', field: 'academicSession', sortable: true },
            { header: 'Submitted', field: 'submittedAt', sortable: true },
            {
              header: 'Fee Paid',
              cell: (item: SeedApplication) => (
                <StatusBadge
                  label={item.feePaid ? 'Yes' : 'No'}
                  variant={item.feePaid ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              header: 'Status',
              field: 'status',
              sortable: true,
              cell: (item: SeedApplication) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: SeedApplication) => (
                <div className="flex gap-2 items-center">
                  <Button
                    label="Status"
                    icon="pi pi-pencil"
                    variant="outlined"
                    onClick={() => openStatusModal(item)}
                  />
                  {item.status === 'Approved' && item.feePaid && (
                    <Button
                      label="Enroll to SIS"
                      icon="pi pi-user-plus"
                      variant="primary"
                      onClick={() => handleEnroll(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {confirmVisible && selectedApp && (
        <Modal
          header={`Update Status — ${selectedApp.applicationNo}`}
          visible={confirmVisible}
          onHide={() => setConfirmVisible(false)}
        >
          <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>
                <strong>Applicant:</strong> {selectedApp.applicantName}
              </span>
              <span>
                <strong>Programme:</strong> {selectedApp.programmeName}
              </span>
              <span>
                <strong>Current Status:</strong> {selectedApp.status}
              </span>
            </div>
            <DropDownList
              label="New Status"
              value={newStatus}
              onChange={(v: any) => setNewStatus(v)}
              data={STATUS_OPTIONS}
              textField="label"
              valueField="value"
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setConfirmVisible(false)}
              />
              <Button
                label="Save Status"
                variant="primary"
                onClick={handleStatusSave}
              />
            </div>
          </div>
        </Modal>
      )}
    </FormPage>
  );
}
