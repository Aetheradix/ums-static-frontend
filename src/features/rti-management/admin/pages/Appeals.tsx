import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import {
  type RTIAppeal,
  rtiAppeals as initialAppeals,
  rtis as initialRtis,
  rtiActivities as initialActivities,
} from '../../data';
import { rtiUrls } from '../../urls';

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Returned: 'bg-blue-100 text-blue-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

export default function Appeals() {
  const [appeals, setAppeals] = useState<RTIAppeal[]>(initialAppeals);
  const [, setRtis] = useState(initialRtis);
  const [, setActivities] = useState(initialActivities);
  const [reviewPopup, setReviewPopup] = useState<RTIAppeal | null>(null);
  const [orderText, setOrderText] = useState('');
  const [decision, setDecision] = useState<
    'Approved' | 'Rejected' | 'Returned' | null
  >(null);

  const faaAppeals = appeals.filter(a => a.level === 'FAA');
  const saaAppeals = appeals.filter(a => a.level === 'SAA');

  const handleReview = (appeal: RTIAppeal) => {
    setReviewPopup(appeal);
    setOrderText(appeal.order || '');
    setDecision(null);
  };

  const handleSubmitOrder = () => {
    if (!reviewPopup || !decision) {
      ToastService.error('Please select a decision.');
      return;
    }
    if (!orderText.trim()) {
      ToastService.error('Please enter the order details.');
      return;
    }

    setAppeals(prev =>
      prev.map(a =>
        a.id === reviewPopup.id
          ? {
              ...a,
              status: decision,
              order: orderText.trim(),
              orderDate: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );

    if (decision === 'Returned' || decision === 'Approved') {
      setRtis(prev =>
        prev.map(r =>
          r.id === reviewPopup.rtiId
            ? {
                ...r,
                status: 'In Progress' as const,
                appealLevel:
                  reviewPopup.level === 'FAA'
                    ? ('FAA' as const)
                    : ('SAA' as const),
              }
            : r
        )
      );
    }

    setActivities(prev => [
      {
        id: `L${Date.now()}`,
        rtiId: reviewPopup.rtiId,
        action: `${reviewPopup.level} Order Issued`,
        performedBy: `${reviewPopup.level} Office`,
        role: reviewPopup.level,
        timestamp: new Date().toISOString().split('T')[0],
        details: `Appeal ${decision.toLowerCase()}. ${orderText.trim()}`,
      },
      ...prev,
    ]);

    setReviewPopup(null);
    setOrderText('');
    setDecision(null);
    ToastService.success(`Appeal ${decision.toLowerCase()} successfully.`);
  };

  const appealColumns = [
    { field: 'rtiNumber' as keyof RTIAppeal, header: 'RTI #' },
    { field: 'applicantName' as keyof RTIAppeal, header: 'Applicant' },
    {
      header: 'Grounds',
      cell: (item: RTIAppeal) => (
        <span className="text-sm">
          {item.grounds.length > 50
            ? `${item.grounds.slice(0, 50)}...`
            : item.grounds}
        </span>
      ),
    },
    { field: 'filedOn' as keyof RTIAppeal, header: 'Filed On' },
    {
      header: 'Status',
      cell: (item: RTIAppeal) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (item: RTIAppeal) => (
        <Button
          icon="gavel"
          label={item.status === 'Pending' ? 'Review' : 'View'}
          variant={item.status === 'Pending' ? 'primary' : 'outlined'}
          size="small"
          onClick={() => handleReview(item)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Appeals"
      description="Manage First Appellate Authority (FAA) and Second Appellate Authority (SAA) appeals."
      breadcrumbs={[
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Appeals' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={[
            {
              title: `FAA (${faaAppeals.length})`,
              content: (
                <GridPanel
                  data={faaAppeals}
                  searchBox
                  searchPlaceholder="Search FAA appeals..."
                  columns={appealColumns}
                />
              ),
            },
            {
              title: `SAA (${saaAppeals.length})`,
              content: (
                <GridPanel
                  data={saaAppeals}
                  searchBox
                  searchPlaceholder="Search SAA appeals..."
                  columns={appealColumns}
                />
              ),
            },
          ]}
        />
      </FormCard>

      {reviewPopup && (
        <FormPopup
          visible
          onHide={() => {
            setReviewPopup(null);
            setOrderText('');
            setDecision(null);
          }}
          title={`${reviewPopup.level} Review: ${reviewPopup.rtiNumber}`}
          subtitle={`Filed by ${reviewPopup.applicantName} on ${reviewPopup.filedOn}`}
          size="lg"
        >
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Grounds of Appeal
              </h4>
              <p className="text-sm text-gray-700">{reviewPopup.grounds}</p>
            </div>

            {reviewPopup.status !== 'Pending' && reviewPopup.order && (
              <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                <h4 className="text-sm font-semibold text-green-700 mb-2">
                  Order Issued ({reviewPopup.orderDate})
                </h4>
                <p className="text-sm text-green-700">{reviewPopup.order}</p>
                <div className="mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reviewPopup.status)}`}
                  >
                    {reviewPopup.status}
                  </span>
                </div>
              </div>
            )}

            {reviewPopup.status === 'Pending' && (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Decision
                  </h4>
                  <div className="flex gap-3 mb-3">
                    <Button
                      icon="check_circle"
                      label="Approve"
                      variant={decision === 'Approved' ? 'primary' : 'outlined'}
                      size="small"
                      onClick={() => setDecision('Approved')}
                    />
                    <Button
                      icon="cancel"
                      label="Reject"
                      variant={decision === 'Rejected' ? 'primary' : 'outlined'}
                      size="small"
                      onClick={() => setDecision('Rejected')}
                    />
                    <Button
                      icon="undo"
                      label="Return to CPIO"
                      variant={decision === 'Returned' ? 'primary' : 'outlined'}
                      size="small"
                      onClick={() => setDecision('Returned')}
                    />
                  </div>
                </div>
                <TextArea
                  label="Order Details"
                  placeholder="Enter the order/decision details..."
                  value={orderText}
                  onChange={v => setOrderText(v)}
                  rows={4}
                />
              </>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => {
                setReviewPopup(null);
                setOrderText('');
                setDecision(null);
              }}
            />
            {reviewPopup.status === 'Pending' && (
              <Button
                label="Submit Order"
                variant="primary"
                onClick={handleSubmitOrder}
              />
            )}
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
