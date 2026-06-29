import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { honorariumRecords } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Paid: 'approved',
  Processed: 'neutral',
  Pending: 'pending',
};

export default function HonorariumPage() {
  const [data] = useState(honorariumRecords);

  return (
    <FormPage
      title="Honorarium & Payments"
      description="View session-wise honorarium details, TDS deductions, and payment status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Honorarium' },
      ]}
    >
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <FormCard>
            <div
              style={{
                fontSize: '0.813rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
              }}
            >
              Total Earnings (YTD)
            </div>
            <div
              style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}
            >
              ₹32,500
            </div>
          </FormCard>
        </div>
        <div style={{ flex: 1 }}>
          <FormCard>
            <div
              style={{
                fontSize: '0.813rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
              }}
            >
              Pending Payment
            </div>
            <div
              style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}
            >
              ₹12,000
            </div>
          </FormCard>
        </div>
        <div style={{ flex: 1 }}>
          <FormCard>
            <div
              style={{
                fontSize: '0.813rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
              }}
            >
              Next Payment Cycle
            </div>
            <div
              style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}
            >
              05 Aug
            </div>
          </FormCard>
        </div>
      </div>

      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'training',
              header: 'Training Programme',
              cell: item => (
                <span style={{ fontWeight: 600 }}>{item.trainingTitle}</span>
              ),
            },
            {
              field: 'sessions',
              header: 'Sessions',
              cell: item => (
                <span>
                  {item.sessions} @ ₹{item.ratePerSession}
                </span>
              ),
            },
            {
              field: 'total',
              header: 'Gross Amount',
              cell: item => <span>₹{item.totalAmount}</span>,
            },
            {
              field: 'tds',
              header: 'TDS (10%)',
              cell: item => (
                <span style={{ color: '#ef4444' }}>-₹{item.tdsDeducted}</span>
              ),
            },
            {
              field: 'net',
              header: 'Net Payable',
              cell: item => (
                <span style={{ fontWeight: 700, color: '#10b981' }}>
                  ₹{item.netPayable}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Payment Status',
              cell: item => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <StatusBadge
                    label={item.status}
                    variant={STATUS_VARIANTS[item.status]}
                  />
                  {item.paymentDate && (
                    <span style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                      {item.paymentDate}
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Download Invoice"
              icon="file-pdf"
              variant="outlined"
            />
          }
        />
      </FormCard>
    </FormPage>
  );
}
