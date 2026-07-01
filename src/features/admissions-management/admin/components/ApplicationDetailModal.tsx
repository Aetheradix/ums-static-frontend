import { Modal } from 'shared/components/popups';
import { Button } from 'shared/components/buttons';
import { StatusBadge } from 'shared/new-components';
import { type SeedApplication } from '../../seed';

interface Props {
  application: SeedApplication;
  onHide: () => void;
}

export default function ApplicationDetailModal({ application, onHide }: Props) {
  return (
    <Modal
      header={`Application Details — ${application.applicationNo}`}
      visible
      onHide={onHide}
      className="max-w-2xl w-full"
    >
      <div className="flex flex-col gap-6 p-6 max-h-[80vh] overflow-y-auto bg-gray-50/50">
        <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Applicant Name
            </span>
            <span className="font-semibold text-gray-900 text-lg">
              {application.applicantName}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Application No
            </span>
            <span className="font-semibold text-gray-900">
              {application.applicationNo}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Programme
            </span>
            <span className="font-semibold text-gray-900">
              {application.programmeName}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Category
            </span>
            <span className="font-semibold text-gray-900">
              {application.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Status
            </span>
            <div>
              <StatusBadge
                label={application.status}
                variant={
                  application.status === 'Approved'
                    ? 'approved'
                    : application.status === 'Rejected'
                      ? 'rejected'
                      : 'pending'
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Fee Paid
            </span>
            <div>
              <StatusBadge
                label={application.feePaid ? 'Yes' : 'No'}
                variant={application.feePaid ? 'approved' : 'rejected'}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Submitted At
            </span>
            <span className="font-semibold text-gray-900">
              {application.submittedAt}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Fee Amount
            </span>
            <span className="font-semibold text-gray-900">
              ₹{application.feeAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button label="Close" variant="outlined" onClick={onHide} />
        </div>
      </div>
    </Modal>
  );
}
