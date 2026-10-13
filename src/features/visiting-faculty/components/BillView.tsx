import {
  PreviewField,
  PreviewSection,
  StatusBadge,
} from 'shared/new-components';
import { deptName } from '../data';
import type { Bill } from '../types';
import { billVariant, formatDate, inr, periodLabel } from '../utils';
import { UniqueIdChip } from './ui';

/** The visiting faculty bill in the prescribed format (§9.5 of the flow). */
export default function BillView({ bill }: { bill: Bill }) {
  return (
    <div className="flex flex-col gap-4">
      <PreviewSection title="Bill">
        <PreviewField label="Bill No." value={bill.billNo} />
        <PreviewField label="Bill Date" value={formatDate(bill.billDate)} />
        <PreviewField
          label="UTD Department"
          value={deptName(bill.department)}
        />
        <PreviewField label="Billing Period" value={periodLabel(bill.period)} />
        <PreviewField
          label="Unique ID"
          value={<UniqueIdChip value={bill.uniqueId} />}
        />
        <PreviewField label="Faculty" value={bill.facultyName} />
        <PreviewField label="Days Present" value={bill.daysPresent} />
        <PreviewField
          label="Status"
          value={
            <StatusBadge
              label={bill.status}
              variant={billVariant(bill.status)}
            />
          }
        />
      </PreviewSection>

      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-2 font-semibold">Item</th>
              <th className="px-4 py-2 text-right font-semibold">Count</th>
              <th className="px-4 py-2 text-right font-semibold">Rate</th>
              <th className="px-4 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td className="px-4 py-2">Theory lectures</td>
              <td className="px-4 py-2 text-right">{bill.theoryCount}</td>
              <td className="px-4 py-2 text-right">{inr(bill.theoryRate)}</td>
              <td className="px-4 py-2 text-right">
                {inr(bill.theoryCount * bill.theoryRate)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Practicals</td>
              <td className="px-4 py-2 text-right">{bill.practicalCount}</td>
              <td className="px-4 py-2 text-right">
                {inr(bill.practicalRate)}
              </td>
              <td className="px-4 py-2 text-right">
                {inr(bill.practicalCount * bill.practicalRate)}
              </td>
            </tr>
            <tr className="bg-slate-50 font-semibold dark:bg-slate-800">
              <td className="px-4 py-2" colSpan={3}>
                Total bill amount
              </td>
              <td className="px-4 py-2 text-right">{inr(bill.billAmount)}</td>
            </tr>
            {bill.payable !== undefined && (
              <>
                <tr className="text-green-700 dark:text-green-400">
                  <td className="px-4 py-2" colSpan={3}>
                    Payable
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {inr(bill.payable)}
                  </td>
                </tr>
                <tr className="text-red-600 dark:text-red-400">
                  <td className="px-4 py-2" colSpan={3}>
                    Not Payable — limit reached
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {inr(bill.notPayable ?? 0)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {bill.hodCertified
          ? 'Certified by the Head of Department that the lectures and practicals above were taken.'
          : 'Awaiting certification by the Head of Department.'}
        {bill.paidOn &&
          ` · Paid on ${formatDate(bill.paidOn)}${bill.transactionRef ? ` (${bill.transactionRef})` : ''}.`}
      </p>
    </div>
  );
}
