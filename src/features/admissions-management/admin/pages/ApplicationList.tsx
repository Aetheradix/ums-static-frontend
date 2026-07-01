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
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import { exportToCSV } from 'shared/utils/exportToCSV';

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
  const [enrollConfirmApp, setEnrollConfirmApp] =
    useState<SeedApplication | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [detailApp, setDetailApp] = useState<SeedApplication | null>(null);

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
      await ApplicationSeedService.updateStatus(app.id, 'Approved');
      setEnrolledIds(prev => new Set(prev).add(app.id));
      ToastService.success('Student enrolled successfully into SIS!');
      load();
    } catch (error) {
      ToastService.error('Failed to enroll student.');
    } finally {
      setEnrollConfirmApp(null);
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
          pagination={true}
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
            {
              header: 'Programme',
              field: 'programmeName',
              sortable: true,
              filter: true,
            },
            { header: 'Category', field: 'category', sortable: true },
            {
              header: 'Session',
              field: 'academicSession',
              sortable: true,
              filter: true,
            },
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
              filter: true,
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
                    icon="pi pi-eye"
                    variant="text"
                    className="text-blue-600"
                    onClick={() => setDetailApp(item)}
                  />
                  <Button
                    label="Status"
                    icon="pi pi-pencil"
                    variant="outlined"
                    onClick={() => openStatusModal(item)}
                  />
                  {item.status === 'Approved' && item.feePaid && (
                    <Button
                      label={
                        enrolledIds.has(item.id) ? 'Enrolled' : 'Enroll to SIS'
                      }
                      icon={
                        enrolledIds.has(item.id)
                          ? 'pi pi-check'
                          : 'pi pi-user-plus'
                      }
                      variant={
                        enrolledIds.has(item.id) ? 'outlined' : 'primary'
                      }
                      disabled={enrolledIds.has(item.id)}
                      onClick={() => setEnrollConfirmApp(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Export"
              icon="pi pi-download"
              variant="outlined"
              onClick={() => exportToCSV(applications, 'Applications_Export')}
            />
          }
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

      {enrollConfirmApp && (
        <Modal
          header="Confirm Enrollment to SIS"
          visible={!!enrollConfirmApp}
          onHide={() => setEnrollConfirmApp(null)}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-3 rounded-lg">
              <i className="pi pi-exclamation-triangle text-xl mt-0.5" />
              <div>
                <p className="font-semibold">
                  This action will enroll the applicant into the Student
                  Information System.
                </p>
                <p className="text-sm mt-1">
                  This cannot be undone. Please verify the details before
                  proceeding.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>
                <strong>Applicant:</strong> {enrollConfirmApp.applicantName}
              </span>
              <span>
                <strong>Programme:</strong> {enrollConfirmApp.programmeName}
              </span>
              <span>
                <strong>Session:</strong> {enrollConfirmApp.academicSession}
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setEnrollConfirmApp(null)}
              />
              <Button
                label="Confirm Enrollment"
                variant="primary"
                icon="pi pi-user-plus"
                onClick={() => handleEnroll(enrollConfirmApp)}
              />
            </div>
          </div>
        </Modal>
      )}

      {detailApp && (
        <ApplicationDetailModal
          application={detailApp}
          onHide={() => setDetailApp(null)}
        />
      )}
    </FormPage>
  );
}
