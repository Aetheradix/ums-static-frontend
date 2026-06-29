import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
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
      `Deduction authorization processed: ₹${generatedFeeReceipt.total} verified.`
    );
    setGeneratedFeeReceipt(prev => (prev ? { ...prev, paid: true } : null));
  };

  return (
    <FormPage
      title="HRA Deduction & Utility Ledger"
      description="Calculate monthly housing payroll deductions, security deposits, and maintenance invoices"
      breadcrumbs={[
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
            <div className="space-y-4 text-xs font-sans">
              <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black">
                    {generatedFeeReceipt.staffName}
                  </h4>
                  <p className="text-slate-400 font-mono">
                    {generatedFeeReceipt.enrollmentNo}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    generatedFeeReceipt.paid
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white animate-pulse'
                  }`}
                >
                  {generatedFeeReceipt.paid ? 'CLEARANCE PAID' : 'UNPAID DUES'}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Assigned Accommodation:
                  </span>
                  <strong className="text-slate-800">
                    {generatedFeeReceipt.estateName} (
                    {generatedFeeReceipt.flatNo})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Refundable Security Deposit:
                  </span>
                  <span className="font-mono">
                    ₹{generatedFeeReceipt.securityDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly HRA Deduction:</span>
                  <span className="font-mono">
                    ₹{generatedFeeReceipt.hraDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Maintenance Charges:</span>
                  <span className="font-mono">
                    ₹{generatedFeeReceipt.maintenanceFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Water Utility Charges:</span>
                  <span className="font-mono">
                    ₹{generatedFeeReceipt.waterCharges.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-indigo-900">
                  <span>Total Payroll Authorization:</span>
                  <span className="font-mono">
                    ₹{generatedFeeReceipt.total.toLocaleString()}
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
            <div className="text-center py-12 text-slate-400 text-sm">
              Select an allotted staff member and click compile to generate the
              deduction statement.
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
