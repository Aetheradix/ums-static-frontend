import { useMemo, useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../context';

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
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Ledger Invoice' },
      ]}
    >
      <FormCard title="Generate Fee Statement" icon="credit-card">
        <FormGrid columns={3}>
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
          <div className="flex items-end">
            <Button
              label="Generate Statement"
              icon="file"
              variant="primary"
              onClick={handleGenerate}
            />
          </div>
        </FormGrid>
        {allottedApps.length === 0 && (
          <p className="text-xs text-amber-600 mt-2">
            No allotted students. Complete room allotment first.
          </p>
        )}
      </FormCard>

      {/* ── Fee Receipt ── */}
      {receipt && (
        <FormCard
          title={`Fee Statement — ${receipt.appId}`}
          icon="receipt"
          headerAction={
            receipt.paid ? (
              <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-300">
                ✓ PAID
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full border border-red-300">
                UNPAID
              </span>
            )
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-slate-400">Student Name</p>
              <p className="font-bold">{receipt.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Enrollment No.</p>
              <p className="font-bold">{receipt.enrollmentNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Hostel</p>
              <p className="font-bold">{receipt.hostelName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Room No.</p>
              <p className="font-bold">{receipt.roomNo}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider">
              Fee Breakdown — Academic Session 2026-27
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Security Deposit', receipt.securityDeposit],
                  ['Hostel Fee (per semester)', receipt.hostelFee],
                  ['Mess Fee (per semester)', receipt.messFee],
                  ['Electricity Charges', receipt.electricityCharges],
                  ['Additional Room Charges', receipt.additionalCharges],
                ].map(([label, amount]) => (
                  <tr key={String(label)} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-600">{label}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ₹{Number(amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-300 bg-slate-50">
                  <td className="px-4 py-3 font-black text-slate-900">
                    Total Amount Payable
                  </td>
                  <td className="px-4 py-3 text-right font-black text-indigo-700 text-base">
                    ₹{receipt.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
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
        </FormCard>
      )}

      {/* ── Fee status overview ── */}
      <FormCard title="Fee Status Overview" icon="list">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold">
                {[
                  '#',
                  'App ID',
                  'Student Name',
                  'Hostel',
                  'Room',
                  'Fee Status',
                ].map(h => (
                  <th key={h} className="px-3 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allottedApps.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-mono">{a.id}</td>
                  <td className="px-3 py-2 font-semibold">{a.name}</td>
                  <td className="px-3 py-2">{a.allottedHostel}</td>
                  <td className="px-3 py-2">{a.allottedRoom}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${a.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {a.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {allottedApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No allotted students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
