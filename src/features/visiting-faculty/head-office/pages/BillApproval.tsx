import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { StageNote, UniqueIdChip } from '../../components/ui';
import { deptName } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Bill } from '../../types';
import {
  billVariant,
  formatDate,
  inr,
  limitCheck,
  periodLabel,
} from '../../utils';

interface Batch {
  id: string;
  department: string;
  departmentName: string;
  period: string;
  bills: Bill[];
  total: number;
  payable: number;
  approvedOn?: string;
}

/**
 * Department bills whose monthly total is above the approval threshold
 * (₹50,000), forwarded by Finance. Approval lets Finance release payment.
 */
export default function BillApproval() {
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const approveBatch = useVisitingFacultyStore(s => s.approveBatch);
  const returnBatch = useVisitingFacultyStore(s => s.returnBatch);

  const [tab, setTab] = useState(0);
  const [viewing, setViewing] = useState<Batch | null>(null);
  const [acting, setActing] = useState<{
    batch: Batch;
    mode: 'approve' | 'return';
  } | null>(null);
  const [remarks, setRemarks] = useState('');

  const group = (list: Bill[]): Batch[] => {
    const map = new Map<string, Batch>();
    for (const b of list) {
      const id = `${b.department}|${b.period}`;
      const batch = map.get(id) ?? {
        id,
        department: b.department,
        departmentName: deptName(b.department),
        period: b.period,
        bills: [],
        total: 0,
        payable: 0,
        approvedOn: b.approvedOn,
      };
      batch.bills.push(b);
      batch.total += b.billAmount;
      batch.payable += b.paidOn
        ? (b.payable ?? 0)
        : limitCheck(b, bills, rates).payable;
      map.set(id, batch);
    }
    return [...map.values()].sort((a, b) => b.period.localeCompare(a.period));
  };

  const pending = group(
    bills.filter(b => b.status === 'Pending Registrar & VC Approval')
  );
  const decided = group(bills.filter(b => b.approvedOn));

  const confirm = () => {
    if (!acting) return;
    const { batch, mode } = acting;
    if (mode === 'return' && !remarks.trim()) {
      ToastService.error('Enter remarks for Finance.');
      return;
    }
    if (mode === 'approve') {
      approveBatch(batch.department, batch.period, remarks.trim());
      ToastService.success(
        `${batch.department} bills for ${periodLabel(batch.period)} approved — Finance can release payment.`
      );
    } else {
      returnBatch(batch.department, batch.period, remarks.trim());
      ToastService.success(`${batch.department} bills returned to Finance.`);
    }
    setActing(null);
    setViewing(null);
    setRemarks('');
  };

  const columns = (withActions: boolean): Controls.ColumnProps<Batch>[] => [
    { field: 'department', header: 'UTD', sortable: true },
    { field: 'departmentName', header: 'Department' },
    { header: 'Month', cell: r => <span>{periodLabel(r.period)}</span> },
    { header: 'Bills', cell: r => <span>{r.bills.length}</span> },
    {
      header: 'Department Total',
      cell: r => <span className="font-semibold">{inr(r.total)}</span>,
    },
    {
      header: 'Payable (after ₹30,000 cap)',
      cell: r => (
        <span className="font-semibold text-green-700 dark:text-green-400">
          {inr(r.payable)}
        </span>
      ),
    },
    withActions
      ? {
          header: 'Actions',
          width: '280px',
          cell: r => (
            <div className="flex gap-1">
              <Button
                label="View"
                icon="eye"
                variant="text"
                size="small"
                onClick={() => setViewing(r)}
              />
              <Button
                label="Approve"
                icon="check"
                variant="text"
                size="small"
                onClick={() => {
                  setRemarks('');
                  setActing({ batch: r, mode: 'approve' });
                }}
              />
              <Button
                label="Return"
                icon="replay"
                variant="text"
                size="small"
                onClick={() => {
                  setRemarks('');
                  setActing({ batch: r, mode: 'return' });
                }}
              />
            </div>
          ),
        }
      : {
          header: 'Approved On',
          cell: r => <span>{formatDate(r.approvedOn)}</span>,
        },
  ];

  return (
    <FormPage
      title="Department Bill Approval"
      description={`Bills of a department whose monthly total is above ${inr(rates.approvalThreshold)} come here from Finance. Finance releases the payment only after approval.`}
      breadcrumbs={crumbs('headOffice', 'Department Bill Approval')}
    >
      <StageNote>
        Each faculty is still paid at most {inr(rates.limit)} per month across
        all UTDs — the payable column already applies that cap.
      </StageNote>
      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={[
            {
              title: `Awaiting Approval (${pending.length})`,
              content: (
                <GridPanel
                  data={pending}
                  columns={columns(true)}
                  searchBox
                  searchFields={['department', 'departmentName']}
                />
              ),
            },
            {
              title: `Approved (${decided.length})`,
              content: (
                <GridPanel
                  data={decided}
                  columns={columns(false)}
                  searchBox
                  searchFields={['department', 'departmentName']}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!viewing}
        onHide={() => setViewing(null)}
        title={
          viewing
            ? `${viewing.department} — ${periodLabel(viewing.period)}`
            : ''
        }
        subtitle={
          viewing
            ? `${viewing.bills.length} bills · total ${inr(viewing.total)}`
            : undefined
        }
        size="xl"
      >
        {viewing && (
          <GridPanel
            data={viewing.bills}
            searchBox
            searchFields={['billNo', 'uniqueId', 'facultyName']}
            columns={[
              { field: 'billNo', header: 'Bill No.' },
              {
                header: 'Unique ID',
                cell: (b: Bill) => <UniqueIdChip value={b.uniqueId} />,
              },
              { field: 'facultyName', header: 'Faculty' },
              {
                header: 'T / P',
                cell: (b: Bill) => (
                  <span>
                    {b.theoryCount} / {b.practicalCount}
                  </span>
                ),
              },
              {
                header: 'Bill Amount',
                cell: (b: Bill) => <span>{inr(b.billAmount)}</span>,
              },
              {
                header: 'Payable',
                cell: (b: Bill) => (
                  <span>
                    {inr(
                      b.paidOn
                        ? (b.payable ?? 0)
                        : limitCheck(b, bills, rates).payable
                    )}
                  </span>
                ),
              },
              {
                header: 'Status',
                cell: (b: Bill) => (
                  <StatusBadge
                    label={b.status}
                    variant={billVariant(b.status)}
                  />
                ),
              },
            ]}
          />
        )}
      </FormPopup>

      <FormPopup
        visible={!!acting}
        onHide={() => setActing(null)}
        title={
          acting?.mode === 'approve'
            ? 'Approve Department Bills'
            : 'Return to Finance'
        }
        subtitle={
          acting
            ? `${acting.batch.department} · ${periodLabel(acting.batch.period)} · ${inr(acting.batch.total)}`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setActing(null)}
            />
            <Button
              label={acting?.mode === 'approve' ? 'Approve' : 'Return'}
              icon={acting?.mode === 'approve' ? 'check' : 'replay'}
              variant={acting?.mode === 'approve' ? 'success' : 'warning'}
              onClick={confirm}
            />
          </div>
        }
      >
        <TextArea
          label="Remarks"
          required={acting?.mode === 'return'}
          rows={3}
          value={remarks}
          onChange={setRemarks}
        />
      </FormPopup>
    </FormPage>
  );
}
