import { useState, useCallback } from 'react';
import { ToastService } from 'services';
import { useUpdateCollegeRegistrationApprovalStatusMutation } from '../queries';

export const useRegistrationApprovalForm = () => {
  const { mutateAsync: updateStatus, isPending } =
    useUpdateCollegeRegistrationApprovalStatusMutation();

  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (id: number) => {
    try {
      const success = await updateStatus({ id, status: 2 });
      if (success) {
        ToastService.success(
          'College registration request approved successfully.'
        );
      } else {
        ToastService.error('Failed to approve college registration.');
      }
    } catch {
      ToastService.error('An error occurred during approval.');
    }
  };

  const handleOpenReject = useCallback((id: number) => {
    setRejectingId(id);
    setRejectionReason('');
  }, []);

  const handleCloseReject = useCallback(() => {
    setRejectingId(null);
    setRejectionReason('');
  }, []);

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      ToastService.error('Please enter a rejection reason.');
      return;
    }
    if (rejectingId === null) return;

    try {
      const success = await updateStatus({
        id: rejectingId,
        status: 3,
        rejectionReason: rejectionReason.trim(),
      });
      if (success) {
        ToastService.success('College registration request rejected.');
        handleCloseReject();
      } else {
        ToastService.error('Failed to reject college registration.');
      }
    } catch {
      ToastService.error('An error occurred during rejection.');
    }
  };

  return {
    isPending,
    rejectingId,
    rejectionReason,
    setRejectionReason,
    handleApprove,
    handleOpenReject,
    handleCloseReject,
    handleRejectSubmit,
  };
};
