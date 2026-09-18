import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  getSpecialServiceRequests,
  raiseSpecialServiceDeficiency,
  updateSpecialServiceDecision,
} from '../../specialServiceStore';
import ScrutinyModal from '../components/ScrutinyModal';
import type {
  SpecialServiceApprovalItem,
  SpecialServiceApprovalStatus,
} from '../types';

export default function SpecialServiceRequestApprovalPage() {
  const [requests, setRequests] = useState<SpecialServiceApprovalItem[]>(() =>
    getSpecialServiceRequests()
  );

  // Auto-sync whenever applications are submitted or updated
  useEffect(() => {
    const handleSync = () => {
      setRequests(getSpecialServiceRequests());
    };
    window.addEventListener('ams_special_service_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('ams_special_service_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Active Scrutiny Modal
  const [selectedItem, setSelectedItem] =
    useState<SpecialServiceApprovalItem | null>(null);
  const [isScrutinyOpen, setIsScrutinyOpen] = useState(false);

  // Open Scrutiny modal
  const handleOpenScrutiny = (item: SpecialServiceApprovalItem) => {
    setSelectedItem(item);
    setIsScrutinyOpen(true);
  };

  // Save Decision from Scrutiny modal
  const handleSaveDecision = (
    updatedItem: SpecialServiceApprovalItem,
    decision: SpecialServiceApprovalStatus,
    orderNo: string,
    remarks: string
  ) => {
    updateSpecialServiceDecision(
      updatedItem.id,
      decision,
      orderNo,
      remarks,
      updatedItem.documents.map(d => ({
        id: d.id,
        isVerified: d.isVerified ?? false,
      }))
    );
    setRequests(getSpecialServiceRequests());
    setIsScrutinyOpen(false);

    if (decision === 'Approved') {
      ToastService.success(
        `Application ${updatedItem.applicationNo} APPROVED. Resolution Order: ${orderNo}`
      );
    } else {
      ToastService.success(
        `Deficiency notice successfully raised for ${updatedItem.applicationNo}.`
      );
    }
  };

  // Raise Deficiency Handler
  const handleRaiseDeficiency = (id: string, remarks: string) => {
    raiseSpecialServiceDeficiency(id, remarks);
    setRequests(getSpecialServiceRequests());
    setIsScrutinyOpen(false);
    ToastService.success(
      `Deficiency notice successfully raised and communicated to college.`
    );
  };

  // Quick Approve action
  const handleQuickApprove = (item: SpecialServiceApprovalItem) => {
    const orderNo = `DAVV/AFF/2026/SP-${Math.floor(100 + Math.random() * 900)}`;
    updateSpecialServiceDecision(
      item.id,
      'Approved',
      orderNo,
      'Fast-track verification complete. Approved by DCDC Standing Committee.'
    );
    setRequests(getSpecialServiceRequests());
    ToastService.success(
      `Special Service Request ${item.applicationNo} (${item.serviceName}) Approved with Order No. ${orderNo}`
    );
  };

  return (
    <FormPage
      title="Special Service Request Approvals"
      description="Manage, review, and approve or reject college special service applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Affiliation Management',
          to: '/affiliation-management-system',
        },
        {
          label: 'Admin Login',
          to: '/affiliation-management-system/admin-login',
        },
        { label: 'Special Service Request Approvals' },
      ]}
    >
      <FormCard>
        <GridPanel<SpecialServiceApprovalItem>
          data={requests}
          searchBox
          searchPlaceholder="Search colleges, application number..."
          searchFields={[
            'applicationNo',
            'collegeName',
            'collegeCode',
            'serviceName',
            'status',
            'academicYear',
          ]}
          emptyMessage="No special service requests found."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => (
                <span>{o?.rowIndex !== undefined ? o.rowIndex + 1 : '-'}</span>
              ),
              sortable: false,
            },
            {
              field: 'applicationNo',
              header: 'Application Number',
              width: '160px',
              cell: item => <span>{item.applicationNo}</span>,
            },
            {
              field: 'collegeCode',
              header: 'College Code',
              width: '120px',
              cell: item => <span>{item.collegeCode}</span>,
            },
            {
              field: 'collegeName',
              header: 'College Name',
              cell: item => <span>{item.collegeName}</span>,
            },
            {
              field: 'collegeType',
              header: 'Category',
              width: '120px',
              cell: item => (
                <span>
                  {item.collegeType === 'govt' ? 'Government' : 'Private'}
                </span>
              ),
            },
            {
              field: 'serviceName',
              header: 'Service Name',
              cell: item => <span>{item.serviceName}</span>,
            },
            {
              field: 'feeAmount',
              header: 'Fee Amount',
              width: '130px',
              cell: item => (
                <span>
                  {item.isFeeExempted
                    ? 'Exempted (Nil)'
                    : `₹${item.feeAmount.toLocaleString('en-IN')}`}
                </span>
              ),
            },
            {
              field: 'submissionDate',
              header: 'Application Date',
              width: '140px',
              cell: item => <span>{item.submissionDate}</span>,
            },
            {
              field: 'status',
              header: 'Approval Status',
              width: '160px',
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Approved'
                      ? 'approved'
                      : item.status === 'Deficiency Raised'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '120px',
              cell: item => {
                const isPending =
                  item.status === 'Pending Scrutiny' ||
                  item.status === 'Deficiency Raised';
                return (
                  <GridActionButtons
                    onView={() => handleOpenScrutiny(item)}
                    viewTooltip="Review Application"
                    onApprove={
                      isPending ? () => handleQuickApprove(item) : undefined
                    }
                    approveTooltip="Approve Request"
                  />
                );
              },
            },
          ]}
        />
      </FormCard>

      {/* SCRUTINY & APPROVAL MODAL */}
      <ScrutinyModal
        visible={isScrutinyOpen}
        item={selectedItem}
        onClose={() => setIsScrutinyOpen(false)}
        onSaveDecision={handleSaveDecision}
        onRaiseDeficiency={handleRaiseDeficiency}
      />
    </FormPage>
  );
}
