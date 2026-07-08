import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import '../residential.css';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

export default function LedgerInvoice() {
  const { estates, applications, setApplications, triggerNotification } =
    useResidentialAllocation();

  const [ledgerSelectedAppId, setLedgerSelectedAppId] = useState('');
  const [generatedFeeReceipt, setGeneratedFeeReceipt] =
    useState<ResidentialAllocationManagement.FeeReceipt | null>(null);

  const allottedApps = applications.filter(a => a.allottedFlat);

  const appOptions: Data.DataItem<string>[] = [
    { id: '', text: '-- Choose Allotted Faculty Member --' },
    ...allottedApps.map(a => ({
      id: a.id,
      text: `${a.name} — ${a.allottedFlat} (${a.feeStatus})`,
    })),
  ];

  const triggerFeeGeneration = () => {
    const app = applications.find(a => a.id === ledgerSelectedAppId);
    if (!app) {
      triggerNotification('Please select an allotted staff member.', 'error');
      return;
    }
    const estate = estates.find(h => h.code === app.allottedEstate);
    if (!estate) {
      triggerNotification(
        'No quarter is currently allotted to this staff member.',
        'error'
      );
      return;
    }

    const calculatedFee: ResidentialAllocationManagement.FeeReceipt = {
      appId: app.id,
      staffName: app.name,
      enrollmentNo: app.enrollmentNo,
      estateName: estate.name,
      flatNo: app.allottedFlat,
      securityDeposit: estate.securityDeposit,
      hraDeduction: estate.hraDeduction,
      maintenanceFee: estate.maintenanceFee,
      waterCharges: estate.waterCharges,
      total:
        estate.securityDeposit +
        estate.hraDeduction +
        estate.maintenanceFee +
        estate.waterCharges,
      paid: app.feeStatus === 'Paid',
    };

    setGeneratedFeeReceipt(calculatedFee);
    triggerNotification('Estate Utility Fee statement compiled.');
  };

  const handlePayFee = () => {
    if (!generatedFeeReceipt) return;
    setApplications(prev =>
      prev.map(app =>
        app.id === generatedFeeReceipt.appId
          ? { ...app, feeStatus: 'Paid' }
          : app
      )
    );
    triggerNotification(
      `Deduction authorization processed: Rs.${generatedFeeReceipt.total} verified.`
    );
    setGeneratedFeeReceipt(prev => (prev ? { ...prev, paid: true } : null));
  };

  return (
    <FormPage
      title="HRA Deduction & Utility Ledger"
      description="Calculate monthly housing payroll deductions, security deposits, and maintenance invoices"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Ledger Invoice' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Generator */}
        <FormCard title="Invoicing Controller" icon="receipt">
          <div className="space-y-5">
            <DropDownList
              label="Select Allotted Staff Member *"
              data={appOptions}
              textField="text"
              valueField="id"
              value={ledgerSelectedAppId}
              onChange={v => setLedgerSelectedAppId(v as string)}
            />

            <Button
              label="Compile Fee & Deduction Statement ✓"
              variant="primary"
              onClick={triggerFeeGeneration}
            />
          </div>
        </FormCard>

        {/* Invoice Statement Slip */}
        <FormCard title="Residential Fee Invoice Slip" icon="file">
          {generatedFeeReceipt ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="ram-invoice-header">
                <div>
                  <p className="ram-invoice-staff-name">
                    {generatedFeeReceipt.staffName}
                  </p>
                  <span className="ram-invoice-enroll">
                    {generatedFeeReceipt.enrollmentNo}
                  </span>
                </div>
                <span
                  className={
                    generatedFeeReceipt.paid
                      ? 'ram-invoice-status-paid'
                      : 'ram-invoice-status-unpaid'
                  }
                >
                  {generatedFeeReceipt.paid ? 'CLEARANCE PAID' : 'UNPAID DUES'}
                </span>
              </div>

              {/* Breakdown */}
              <div className="ram-invoice-body">
                <div className="ram-invoice-row">
                  <span className="ram-invoice-row-label">
                    Assigned Accommodation
                  </span>
                  <strong className="ram-invoice-row-value">
                    {generatedFeeReceipt.estateName} (
                    {generatedFeeReceipt.flatNo})
                  </strong>
                </div>
                <div className="ram-invoice-row">
                  <span className="ram-invoice-row-label">
                    Refundable Security Deposit
                  </span>
                  <span className="ram-invoice-row-value">
                    Rs.{generatedFeeReceipt.securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="ram-invoice-row">
                  <span className="ram-invoice-row-label">
                    Monthly HRA Deduction
                  </span>
                  <span className="ram-invoice-row-value">
                    Rs.{generatedFeeReceipt.hraDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="ram-invoice-row">
                  <span className="ram-invoice-row-label">
                    Maintenance Charges
                  </span>
                  <span className="ram-invoice-row-value">
                    Rs.{generatedFeeReceipt.maintenanceFee.toLocaleString()}
                  </span>
                </div>
                <div className="ram-invoice-row">
                  <span className="ram-invoice-row-label">
                    Water Utility Charges
                  </span>
                  <span className="ram-invoice-row-value">
                    Rs.{generatedFeeReceipt.waterCharges.toLocaleString()}
                  </span>
                </div>
                <div className="ram-invoice-total-row">
                  <span>Total Payroll Authorization</span>
                  <span className="ram-invoice-total-amount">
                    Rs.{generatedFeeReceipt.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {!generatedFeeReceipt.paid && (
                <Button
                  label="Authorize Payroll HRA & Utility Deduction ✓"
                  variant="primary"
                  onClick={handlePayFee}
                />
              )}
            </div>
          ) : (
            <div className="ram-empty-state">
              <i className="pi pi-receipt" />
              <p>
                Select an allotted staff member and click compile to generate
                the deduction statement.
              </p>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}


