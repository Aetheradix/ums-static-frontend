import { StudentSeedService } from 'features/student-management/seed/students';
import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { Modal } from 'shared/components/popups';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { exportToCSV } from 'shared/utils/exportToCSV';
import {
  ApplicationSeedService,
  type ApplicationStatus,
  type SeedApplication,
} from '../../seed';
import { admissionsUrls } from '../../urls';
import ApplicationDetailModal from '../components/ApplicationDetailModal';

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
  const [enrollConfirmApp, setEnrollConfirmApp] =
    useState<SeedApplication | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [detailApp, setDetailApp] = useState<SeedApplication | null>(null);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectApp, setRejectApp] = useState<SeedApplication | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await ApplicationSeedService.getAll();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const canGoTo = (from: ApplicationStatus, to: ApplicationStatus) => {
    if (from === to) return false;
    if (from === 'Approved') return false;

    if (from === 'Submitted' && to === 'Under Review') return true;
    if (from === 'Under Review' && to === 'Fee Pending') return true;
    if (from === 'Fee Pending' && to === 'Approved') return true;
    if (to === 'Rejected') return true;

    return false;
  };

  const transitionTo = async (app: SeedApplication, to: ApplicationStatus) => {
    await ApplicationSeedService.updateStatus(app.id, to, 'admin');
    ToastService.success(`Application updated to "${to}"`);
    load();
  };

  const openRejectModal = (app: SeedApplication) => {
    setRejectApp(app);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectApp) return;

    if (!rejectReason.trim()) {
      ToastService.error('Please provide a rejection reason.');
      return;
    }

    await ApplicationSeedService.updateStatus(
      rejectApp.id,
      'Rejected',
      'admin',
      rejectReason.trim()
    );

    ToastService.success('Application rejected.');
    setRejectModalVisible(false);
    setRejectApp(null);
    setRejectReason('');
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
                  {canGoTo(item.status, 'Under Review') && (
                    <Button
                      label="Send to Review"
                      icon="pi pi-search"
                      variant="outlined"
                      onClick={() => transitionTo(item, 'Under Review')}
                    />
                  )}

                  {canGoTo(item.status, 'Fee Pending') && (
                    <Button
                      label="Mark Fee Pending"
                      icon="pi pi-credit-card"
                      variant="outlined"
                      onClick={() => transitionTo(item, 'Fee Pending')}
                    />
                  )}

                  {canGoTo(item.status, 'Approved') && (
                    <Button
                      label="Approve"
                      icon="pi pi-check"
                      variant="primary"
                      onClick={() => transitionTo(item, 'Approved')}
                    />
                  )}

                  {canGoTo(item.status, 'Rejected') && (
                    <Button
                      label="Reject"
                      icon="pi pi-times"
                      variant="outlined"
                      className="p-button-danger"
                      onClick={() => openRejectModal(item)}
                    />
                  )}

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

      <Modal
        header={rejectApp ? `Reject — ${rejectApp.applicationNo}` : 'Reject'}
        visible={rejectModalVisible}
        onHide={() => setRejectModalVisible(false)}
        size="medium"
      >
        <div className="flex flex-col gap-3">
          {rejectApp && (
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>
                <strong>Applicant:</strong> {rejectApp.applicantName}
              </span>
              <span>
                <strong>Programme:</strong> {rejectApp.programmeName}
              </span>
              <span>
                <strong>Current Status:</strong> {rejectApp.status}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <TextArea
              label="Rejection reason"
              value={rejectReason}
              onChange={v => setRejectReason(v as string)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setRejectModalVisible(false)}
            />
            <Button
              label="Confirm Reject"
              variant="primary"
              icon="pi pi-times"
              onClick={confirmReject}
            />
          </div>
        </div>
      </Modal>

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
