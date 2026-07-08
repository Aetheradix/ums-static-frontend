import { useMemo, useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../context';
import '../hostel.css';

interface FeeReceipt {
  appId: string;
  studentName: string;
  enrollmentNo: string;
  hostelName: string;
  roomNo: string;
  securityDeposit: number;
  hostelFee: number;
  messFee: number;
  electricityCharges: number;
  additionalCharges: number;
  total: number;
  paid: boolean;
}

export default function LedgerInvoice() {
  const { hostels, rooms, applications, setApplications, triggerNotification } =
    useHostel();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<FeeReceipt | null>(null);

  const allottedApps = useMemo(
    () => applications.filter(a => a.allottedHostel),
    [applications]
  );

  const appDD: Data.DataItem<string>[] = allottedApps.map(a => ({
    id: a.id,
    text: `${a.name} (${a.id}) — Fee: ${a.feeStatus}`,
  }));

  const handleGenerate = () => {
    const app = applications.find(a => a.id === selectedAppId);
    if (!app) {
      triggerNotification('Please select an allotted student.', 'error');
      return;
    }
    const hostel = hostels.find(h => h.code === app.allottedHostel);
    const room = rooms.find(
      r =>
        r.hostelCode === app.allottedHostel && r.roomNumber === app.allottedRoom
    );
    if (!hostel) {
      triggerNotification('No hostel allotted to this student.', 'error');
      return;
    }
    const addlCharges = room?.additionalCharges ?? 0;
    setReceipt({
      appId: app.id,
      studentName: app.name,
      enrollmentNo: app.enrollmentNo,
      hostelName: hostel.name,
      roomNo: app.allottedRoom,
      securityDeposit: hostel.securityDeposit,
      hostelFee: hostel.hostelFee,
      messFee: hostel.messFee,
      electricityCharges: hostel.electricityCharges,
      additionalCharges: addlCharges,
      total:
        hostel.securityDeposit +
        hostel.hostelFee +
        hostel.messFee +
        hostel.electricityCharges +
        addlCharges,
      paid: app.feeStatus === 'Paid',
    });
    triggerNotification('Fee statement generated successfully.');
  };

  const handleMarkPaid = () => {
    if (!receipt) return;
    setApplications(prev =>
      prev.map(a => (a.id === receipt.appId ? { ...a, feeStatus: 'Paid' } : a))
    );
    setReceipt(prev => (prev ? { ...prev, paid: true } : null));
    triggerNotification(
      `Payment confirmed: ₹${receipt.total.toLocaleString('en-IN')} cleared.`
    );
  };

  return (
    <FormPage
      title="Ledger Invoice"
      description="Generate semester fee statements and confirm payment clearance before student boarding"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Ledger Invoice' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator */}
        <FormCard title="Generate Fee Statement" icon="credit-card">
          <div className="space-y-4">
            <DropDownList
              label="Select Allotted Student"
              data={appDD}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Student —"
              value={selectedAppId}
              onChange={v => {
                setSelectedAppId(v as string);
                setReceipt(null);
              }}
            />
            <Button
              label="Generate Statement"
              icon="file"
              variant="primary"
              onClick={handleGenerate}
            />
            {allottedApps.length === 0 && (
              <p className="text-xs text-amber-600">
                No allotted students. Complete room allotment first.
              </p>
            )}
          </div>

          {/* Fee Status Overview */}
          {allottedApps.length > 0 && (
            <div className="mt-6">
              <p className="hm-section-heading">Fee Status Overview</p>
              <table className="hm-fee-table">
                <thead>
                  <tr>
                    {[
                      '#',
                      'App ID',
                      'Student',
                      'Hostel',
                      'Room',
                      'Fee Status',
                    ].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allottedApps.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td
                        style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                      >
                        {a.id}
                      </td>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td>{a.allottedHostel}</td>
                      <td>
                        <span className="hm-room-badge">{a.allottedRoom}</span>
                      </td>
                      <td>
                        <span
                          className={`hm-badge ${a.feeStatus === 'Paid' ? 'hm-badge--paid' : 'hm-badge--unpaid'}`}
                        >
                          {a.feeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FormCard>

        {/* Receipt Panel */}
        <FormCard
          title={
            receipt ? `Fee Statement — ${receipt.appId}` : 'Fee Invoice Slip'
          }
          icon="receipt"
        >
          {receipt ? (
            <div className="space-y-4">
              <div className="hm-invoice-header">
                <div>
                  <p className="hm-invoice-name">{receipt.studentName}</p>
                  <span className="hm-invoice-enroll">
                    {receipt.enrollmentNo}
                  </span>
                </div>
                <span
                  className={
                    receipt.paid
                      ? 'hm-invoice-status-paid'
                      : 'hm-invoice-status-unpaid'
                  }
                >
                  {receipt.paid ? '✓ PAID' : 'UNPAID'}
                </span>
              </div>

              <div className="hm-invoice-table">
                <div className="hm-invoice-table-header">
                  Fee Breakdown — Academic Session 2026-27
                </div>
                {[
                  ['Security Deposit', receipt.securityDeposit],
                  ['Hostel Fee (per semester)', receipt.hostelFee],
                  ['Mess Fee (per semester)', receipt.messFee],
                  ['Electricity Charges', receipt.electricityCharges],
                  ['Additional Room Charges', receipt.additionalCharges],
                ].map(([label, amount]) => (
                  <div key={String(label)} className="hm-invoice-row">
                    <span className="hm-invoice-row-label">{label}</span>
                    <span className="hm-invoice-row-value">
                      ₹{Number(amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="hm-invoice-total-row">
                  <span>Total Amount Payable</span>
                  <span className="hm-invoice-total-amount">
                    ₹{receipt.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="form-actions-row">
                {!receipt.paid && (
                  <Button
                    label="Mark as Paid"
                    icon="check-circle"
                    variant="primary"
                    onClick={handleMarkPaid}
                  />
                )}
                <Button
                  label="Print Receipt"
                  icon="print"
                  variant="outlined"
                  onClick={() => window.print()}
                />
              </div>
            </div>
          ) : (
            <div className="hm-empty-state">
              <i className="pi pi-receipt" />
              <p>
                Select an allotted student and click Generate to compile the fee
                statement.
              </p>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}


