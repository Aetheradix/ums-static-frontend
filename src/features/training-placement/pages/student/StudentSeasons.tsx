import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { tpUrls } from '../../urls';
import { Button } from 'primereact/button';
import type { TabViewTabChangeEvent } from 'primereact/tabview';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { Modal } from 'shared/components/popups';

export default function StudentSeasons() {
  const navigate = useNavigate();
  const location = useLocation();

  // If the URL is available vs applied, we can set the default tab
  const defaultTabIndex = location.pathname.includes('available') ? 0 : 1;
  const [activeIndex, setActiveIndex] = useState(defaultTabIndex);
  const [paymentDialogVisible, setPaymentDialogVisible] = useState(false);
  const [selectedSeasonForPayment, setSelectedSeasonForPayment] =
    useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const defaultAvailable = [
    {
      id: 'S-101',
      code: 'PL2025-JUN',
      name: 'Placement 2025 (June Graduating)',
      fee: '₹1,500',
      deadline: '2024-07-15',
    },
    {
      id: 'S-102',
      code: 'INT2024-SUM',
      name: 'Summer Internship 2024',
      fee: 'Free',
      deadline: '2024-03-01',
    },
  ];

  const defaultApplied = [
    {
      id: 'S-099',
      code: 'PL2024-JUN',
      name: 'Placement 2024 (Past)',
      enrolledOn: '2023-08-10',
      feeStatus: 'Paid',
      status: 'Closed',
    },
  ];

  const [availableSeasons, setAvailable] = useLocalStorage(
    'tp_student_availableSeasons',
    defaultAvailable
  );
  const [appliedSeasons, setApplied] = useLocalStorage(
    'tp_student_appliedSeasons',
    defaultApplied
  );

  const handleApply = (id: string) => {
    const season = availableSeasons.find(s => s.id === id);
    if (!season) return;

    if (season.fee !== 'Free') {
      setSelectedSeasonForPayment(season);
      setPaymentDialogVisible(true);
    } else {
      processEnrollment(season, 'Paid'); // Free counts as paid
    }
  };

  const processEnrollment = (season: any, feeStatus: string) => {
    const newApplied = {
      ...season,
      enrolledOn: new Date().toISOString().split('T')[0],
      feeStatus,
      status: 'Active',
    };
    setAvailable(availableSeasons.filter(s => s.id !== season.id));
    setApplied([newApplied, ...appliedSeasons]);
    alert(`Enrolled in season ${season.name}. Check My Enrolled Seasons.`);
  };

  const simulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentDialogVisible(false);
      processEnrollment(selectedSeasonForPayment, 'Paid');
      setSelectedSeasonForPayment(null);
    }, 1500);
  };

  const availableContent = (
    <GridPanel
      data={availableSeasons}
      dataKey="id"
      emptyMessage="No new seasons available."
      columns={
        [
          { field: 'code', header: 'Season Code' },
          { field: 'name', header: 'Name' },
          { field: 'fee', header: 'Student Fee' },
          { field: 'deadline', header: 'Registration Deadline' },
          {
            field: 'actions',
            header: 'Actions',
            body: (row: any) => (
              <Button
                label="Enroll Now"
                size="small"
                onClick={() => handleApply(row.id)}
              />
            ),
          },
        ] as never[]
      }
    />
  );

  const appliedContent = (
    <GridPanel
      data={appliedSeasons}
      dataKey="id"
      emptyMessage="You have not enrolled in any seasons."
      pagination
      columns={
        [
          { field: 'code', header: 'Season Code' },
          { field: 'name', header: 'Name' },
          { field: 'enrolledOn', header: 'Enrolled On' },
          {
            field: 'feeStatus',
            header: 'Fee Status',
            body: (row: any) => (
              <StatusBadge
                label={row.feeStatus}
                variant={row.feeStatus === 'Paid' ? 'approved' : 'rejected'}
              />
            ),
          },
          {
            field: 'status',
            header: 'Season Status',
            body: (row: any) => (
              <StatusBadge
                label={row.status}
                variant={row.status === 'Active' ? 'approved' : 'neutral'}
              />
            ),
          },
        ] as never[]
      }
    />
  );

  const handleTabChange = (e: TabViewTabChangeEvent) => {
    setActiveIndex(e.index);
    if (e.index === 0) {
      navigate(tpUrls.student.availableSeasons, { replace: true });
    } else {
      navigate(tpUrls.student.appliedSeasons, { replace: true });
    }
  };

  return (
    <FormPage
      title="Placement Seasons"
      description="Enroll in upcoming placement drives and track your season registrations."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Student Portal', to: tpUrls.student.portal },
        { label: 'Seasons' },
      ]}
    >
      <FormCard>
        <Tabs
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
          tabs={[
            { title: 'Available Seasons', content: availableContent },
            { title: 'My Enrolled Seasons', content: appliedContent },
          ]}
        />
      </FormCard>

      <Modal
        header="Simulate Application Fee Payment"
        visible={paymentDialogVisible}
        size="medium"
        onHide={() => setPaymentDialogVisible(false)}
      >
        <div className="flex flex-col gap-4 p-4">
          <p>
            You are about to enroll in{' '}
            <strong>{selectedSeasonForPayment?.name}</strong>.
          </p>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600">Registration Fee:</span>
              <span className="font-semibold text-gray-900">
                {selectedSeasonForPayment?.fee}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Gateway:</span>
              <span className="font-semibold text-gray-900">
                Razorpay (Sandbox)
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            This is a mock payment gateway. Clicking "Pay Now" will simulate a
            successful transaction and complete your enrollment.
          </p>
          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setPaymentDialogVisible(false)}
              className="p-button-text"
            />
            <Button
              label="Pay Now"
              icon="pi pi-check"
              onClick={simulatePayment}
              autoFocus
              loading={isProcessingPayment}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
