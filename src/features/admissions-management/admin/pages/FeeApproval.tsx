import { useState, useEffect } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { Modal } from 'shared/components/popups';
import { TextArea } from 'shared/components/forms';
import { ToastService } from 'services';
import { ApplicationSeedService, type SeedApplication } from '../../seed';
import { admissionsUrls } from '../../urls';
import { exportToCSV } from 'shared/utils/exportToCSV';

type ActionType = 'approve' | 'reject' | null;

export default function FeeApproval() {
  const [applications, setApplications] = useState<SeedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmApp, setConfirmApp] = useState<SeedApplication | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    const all = await ApplicationSeedService.getAll();
    setApplications(all.filter(a => a.status === 'Fee Pending'));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openConfirm = (app: SeedApplication, type: ActionType) => {
    setConfirmApp(app);
    setActionType(type);
    setRejectReason('');
  };

  const closeConfirm = () => {
    setConfirmApp(null);
    setActionType(null);
    setRejectReason('');
  };

  const handleConfirm = async () => {
    if (!confirmApp || !actionType) return;
    if (actionType === 'reject' && !rejectReason.trim()) {
      ToastService.error('Please provide a reason for rejection.');
      return;
    }
    if (actionType === 'approve') {
      await ApplicationSeedService.updateStatus(confirmApp.id, 'Approved');
      ToastService.success(`Fee approved for ${confirmApp.applicantName}`);
    } else {
      await ApplicationSeedService.updateStatus(confirmApp.id, 'Rejected');
      ToastService.error(`Fee rejected for ${confirmApp.applicantName}`);
    }
    closeConfirm();
    load();
  };

  return (
    <FormPage
      title="Fee Payment Approval"
      description="Review and approve or reject pending fee payments from applicants."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Fee Approval' },
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
              header: 'Fee Amount',
              cell: (item: SeedApplication) => (
                <span className="font-semibold text-gray-800">
                  ₹{item.feeAmount.toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (item: SeedApplication) => (
                <StatusBadge label={item.status} variant="pending" />
              ),
            },
            {
              header: 'Actions',
              cell: (item: SeedApplication) => (
                <div className="flex gap-2">
                  <Button
                    label="Approve"
                    icon="pi pi-check"
                    variant="success"
                    onClick={() => openConfirm(item, 'approve')}
                  />
                  <Button
                    label="Reject"
                    icon="pi pi-times"
                    variant="danger"
                    onClick={() => openConfirm(item, 'reject')}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Export"
              icon="pi pi-download"
              variant="outlined"
              onClick={() => exportToCSV(applications, 'Fee_Approvals_Export')}
            />
          }
        />
      </FormCard>

      {confirmApp && actionType && (
        <Modal
          header={
            actionType === 'approve'
              ? 'Confirm Fee Approval'
              : 'Confirm Fee Rejection'
          }
          visible={!!confirmApp}
          onHide={closeConfirm}
        >
          <div className="p-4 flex flex-col gap-4">
            {actionType === 'approve' ? (
              <div className="flex items-start gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                <i className="pi pi-check-circle text-xl mt-0.5" />
                <div>
                  <p className="font-semibold">Approve this fee payment?</p>
                  <p className="text-sm mt-1">
                    This will mark the application as <strong>Approved</strong>{' '}
                    and allow the applicant to proceed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 text-red-700 bg-red-50 p-3 rounded-lg">
                <i className="pi pi-times-circle text-xl mt-0.5" />
                <div>
                  <p className="font-semibold">Reject this fee payment?</p>
                  <p className="text-sm mt-1">
                    This action will mark the application as{' '}
                    <strong>Rejected</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>
                <strong>Applicant:</strong> {confirmApp.applicantName}
              </span>
              <span>
                <strong>Programme:</strong> {confirmApp.programmeName}
              </span>
              <span>
                <strong>Fee Amount:</strong> ₹
                {confirmApp.feeAmount.toLocaleString()}
              </span>
            </div>

            {actionType === 'reject' && (
              <TextArea
                label="Reason for Rejection *"
                value={rejectReason}
                onChange={v => setRejectReason(v as string)}
                rows={3}
                placeholder="Please provide a reason for rejecting this fee payment..."
              />
            )}

            <div className="flex justify-end gap-2 mt-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={closeConfirm}
              />
              <Button
                label={
                  actionType === 'approve'
                    ? 'Confirm Approval'
                    : 'Confirm Rejection'
                }
                variant={actionType === 'approve' ? 'success' : 'danger'}
                icon={actionType === 'approve' ? 'pi pi-check' : 'pi pi-times'}
                onClick={handleConfirm}
              />
            </div>
          </div>
        </Modal>
      )}
    </FormPage>
  );
}
