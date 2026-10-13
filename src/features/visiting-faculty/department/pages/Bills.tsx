import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import BillView from '../../components/BillView';
import { crumbs, useFaculty } from '../../components/hooks';
import { DeptSwitcher, StageNote, UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import type { Bill, Faculty } from '../../types';
import {
  billAmountOf,
  billVariant,
  countSessions,
  inr,
  periodLabel,
  periodOf,
} from '../../utils';

interface Row {
  faculty: Faculty;
  pending: number;
  days: number;
  theory: number;
  practical: number;
  amount: number;
  bill?: Bill;
}

/** Stages P1–P2 — bill prepared from verified mobile entries, sent to Finance. */
export default function Bills() {
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const logs = useVisitingFacultyStore(s => s.logs);
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const prepareBill = useVisitingFacultyStore(s => s.prepareBill);
  const sendBillToFinance = useVisitingFacultyStore(s => s.sendBillToFinance);
  const faculty = useFaculty();

  const periods = useMemo(
    () =>
      [
        ...new Set(
          logs.filter(l => l.department === dept).map(l => periodOf(l.date))
        ),
      ]
        .sort()
        .reverse(),
    [logs, dept]
  );
  const [period, setPeriod] = useState('');
  const activePeriod = period || periods[1] || periods[0] || '';
  const [viewing, setViewing] = useState<Bill | null>(null);

  const rows: Row[] = faculty
    .filter(f => f.departments.includes(dept))
    .map(f => {
      const own = logs.filter(
        l =>
          l.uniqueId === f.uniqueId &&
          l.department === dept &&
          periodOf(l.date) === activePeriod
      );
      const c = countSessions(own.filter(l => l.status === 'Verified'));
      return {
        faculty: f,
        pending: own.filter(l => l.status === 'Pending').length,
        days: c.days,
        theory: c.theory,
        practical: c.practical,
        amount: billAmountOf(c.theory, c.practical, rates),
        bill: bills.find(
          b =>
            b.uniqueId === f.uniqueId &&
            b.department === dept &&
            b.period === activePeriod
        ),
      };
    })
    .filter(r => r.days || r.pending || r.bill);

  const prepare = (r: Row) => {
    const result = prepareBill(dept, r.faculty, activePeriod);
    if (typeof result === 'string') {
      ToastService.error(result);
      return;
    }
    ToastService.success(
      `Bill ${result.billNo} prepared for ${inr(result.billAmount)}.`
    );
    setViewing(result);
  };

  const send = (b: Bill) => {
    sendBillToFinance(b.id);
    ToastService.success(`Bill ${b.billNo} sent to Finance.`);
    setViewing(null);
  };

  return (
    <FormPage
      title="Bills"
      description="Prepare the monthly bill of each visiting faculty from verified attendance and lectures, then send it to Finance."
      breadcrumbs={crumbs('department', 'Bills')}
      headerAction={<DeptSwitcher />}
    >
      <StageNote>
        Bill = (Theory × {inr(rates.theoryRate)}) + (Practical ×{' '}
        {inr(rates.practicalRate)}). The bill shows the full amount; Finance
        pays at most {inr(rates.limit)} per Unique ID for the month across all
        UTDs. Only one bill per faculty, per department, per month.
      </StageNote>

      <FormCard title="Billing Period" icon="calendar">
        <FormGrid columns={3}>
          <DropDownList
            label="Month"
            data={periods.map(p => ({ id: p, text: periodLabel(p) }))}
            textField="text"
            valueField="id"
            value={activePeriod}
            onChange={v => setPeriod((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title={`Faculty Bills — ${activePeriod ? periodLabel(activePeriod) : ''}`}
        icon="wallet"
      >
        <GridPanel
          data={rows}
          columns={[
            {
              header: 'Unique ID',
              cell: (r: Row) => <UniqueIdChip value={r.faculty.uniqueId} />,
            },
            {
              header: 'Faculty',
              cell: (r: Row) => <span>{r.faculty.fullName}</span>,
            },
            { field: 'days', header: 'Days' },
            { field: 'theory', header: 'Theory' },
            { field: 'practical', header: 'Practical' },
            {
              header: 'Bill Amount',
              cell: (r: Row) => (
                <span className="font-semibold">
                  {inr(r.bill?.billAmount ?? r.amount)}
                  {(r.bill?.billAmount ?? r.amount) > rates.limit && (
                    <span className="block text-xs font-normal text-red-600 dark:text-red-400">
                      Payable capped at {inr(rates.limit)}
                    </span>
                  )}
                </span>
              ),
            },
            {
              header: 'Status',
              cell: (r: Row) =>
                r.bill ? (
                  <StatusBadge
                    label={r.bill.status}
                    variant={billVariant(r.bill.status)}
                  />
                ) : r.pending ? (
                  <span className="text-xs font-medium text-amber-600">
                    {r.pending} entries to verify
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Not prepared</span>
                ),
            },
            {
              header: 'Paid',
              cell: (r: Row) => (
                <span>
                  {r.bill?.payable !== undefined ? inr(r.bill.payable) : '—'}
                </span>
              ),
            },
            {
              header: 'Actions',
              width: '210px',
              cell: (r: Row) =>
                r.bill ? (
                  <div className="flex gap-1">
                    <Button
                      label="View"
                      icon="eye"
                      variant="text"
                      size="small"
                      onClick={() => setViewing(r.bill!)}
                    />
                    {r.bill.status === 'Prepared' && (
                      <Button
                        label="Send"
                        icon="send"
                        variant="text"
                        size="small"
                        onClick={() => send(r.bill!)}
                      />
                    )}
                  </div>
                ) : (
                  <Button
                    label="Prepare Bill"
                    icon="file-edit"
                    variant="text"
                    size="small"
                    disabled={r.pending > 0 || !r.days}
                    onClick={() => prepare(r)}
                  />
                ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={viewing ? `Bill ${viewing.billNo}` : 'Bill'}
        size="lg"
        footer={
          viewing?.status === 'Prepared' ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setViewing(null)}
              />
              <Button
                label="Send to Finance"
                icon="send"
                variant="primary"
                onClick={() => send(viewing)}
              />
            </div>
          ) : undefined
        }
      >
        {viewing && <BillView bill={viewing} />}
      </FormPopup>
    </FormPage>
  );
}
