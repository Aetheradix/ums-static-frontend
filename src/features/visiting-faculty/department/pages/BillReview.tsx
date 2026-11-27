import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import BillView from '../../components/BillView';
import { crumbs, useSelection } from '../../components/hooks';
import { useScope } from '../../components/scope';
import SelectableGrid from '../../components/SelectableGrid';
import { StageNote, UniqueIdChip } from '../../components/ui';
import { DEPT_BRANCHES } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Bill } from '../../types';
import { billVariant, formatDate, inr, periodLabel } from '../../utils';

type Row = Bill & { hodBranch: string };

/**
 * Stage P2 at the UTD Department — bills prepared by the branch HODs are
 * reviewed here and forwarded to Finance, or returned to the HOD.
 */
export default function BillReview() {
  const scope = useScope();
  const { dept } = scope;
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const utdForwardBills = useVisitingFacultyStore(s => s.utdForwardBills);
  const utdReturnBill = useVisitingFacultyStore(s => s.utdReturnBill);

  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState('');
  const [branch, setBranch] = useState('');
  const [viewing, setViewing] = useState<Row | null>(null);
  const [returning, setReturning] = useState<Row | null>(null);
  const [remarks, setRemarks] = useState('');
  const [confirming, setConfirming] = useState(false);

  const mine: Row[] = bills.filter(scope.billInScope).map(b => ({
    ...b,
    hodBranch:
      b.branch ?? scope.branchOfFaculty(b.uniqueId, b.department) ?? '—',
  }));
  const periods = [...new Set(mine.map(b => b.period))].sort().reverse();
  const match = (b: Row) =>
    (!period || b.period === period) && (!branch || b.hodBranch === branch);

  const toReview = mine.filter(b => b.status === 'Sent to UTD' && match(b));
  const forwarded = mine.filter(
    b => b.utdForwardedOn && b.status !== 'Sent to UTD' && match(b)
  );
  const returned = mine.filter(b => b.status === 'Returned by UTD' && match(b));
  const sel = useSelection(toReview.map(b => b.id));
  const selectedTotal = toReview
    .filter(b => sel.selected.has(b.id))
    .reduce((s, b) => s + b.billAmount, 0);

  const forward = () => {
    utdForwardBills(sel.ids);
    ToastService.success(
      `${sel.ids.length} bill(s) (${inr(selectedTotal)}) forwarded to Finance.`
    );
    sel.clear();
    setConfirming(false);
  };

  const confirmReturn = () => {
    if (!returning) return;
    if (!remarks.trim()) {
      ToastService.error('Enter remarks for the HOD.');
      return;
    }
    utdReturnBill(returning.id, remarks.trim());
    ToastService.success(
      `Bill ${returning.billNo} returned to the ${returning.hodBranch} HOD.`
    );
    setReturning(null);
    setViewing(null);
    setRemarks('');
  };

  const columns: Controls.ColumnProps<Row>[] = [
    { field: 'billNo', header: 'Bill No.' },
    { field: 'hodBranch', header: 'Branch (HOD)' },
    { header: 'Unique ID', cell: b => <UniqueIdChip value={b.uniqueId} /> },
    { field: 'facultyName', header: 'Faculty', sortable: true },
    { header: 'Month', cell: b => <span>{periodLabel(b.period)}</span> },
    { field: 'daysPresent', header: 'Days' },
    {
      header: 'T / P',
      cell: b => (
        <span>
          {b.theoryCount} / {b.practicalCount}
        </span>
      ),
    },
    {
      header: 'Bill Amount',
      cell: b => <span className="font-semibold">{inr(b.billAmount)}</span>,
    },
    {
      header: 'Status',
      cell: b => (
        <StatusBadge label={b.status} variant={billVariant(b.status)} />
      ),
    },
  ];

  return (
    <FormPage
      title="Bill Review"
      description={`Bills prepared by the branch HODs of ${dept} from verified attendance. Review them and forward to Finance — or return to the HOD with remarks.`}
      breadcrumbs={crumbs(scope.login, 'Bill Review')}
      headerAction={<scope.Switcher />}
    >
      <StageNote>
        Finance pays at most {inr(rates.limit)} per faculty per month across all
        UTDs. If {dept}&apos;s bills for a month total more than{' '}
        {inr(rates.approvalThreshold)}, Finance sends them to the Registrar
        &amp; VC for approval before payment.
      </StageNote>

      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Month"
            data={[
              { id: '', text: 'All Months' },
              ...periods.map(p => ({ id: p, text: periodLabel(p) })),
            ]}
            textField="text"
            valueField="id"
            value={period}
            onChange={v => setPeriod((v as string) ?? '')}
          />
          <DropDownList
            label="Branch (HOD)"
            data={[
              { id: '', text: 'All Branches' },
              ...(DEPT_BRANCHES[dept] ?? []).map(b => ({ id: b, text: b })),
            ]}
            textField="text"
            valueField="id"
            value={branch}
            onChange={v => setBranch((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={[
            {
              title: `From HODs — To Review (${toReview.length})`,
              content: (
                <SelectableGrid
                  data={toReview}
                  selected={toReview.filter(r => sel.selected.has(r.id))}
                  onSelectionChange={r => sel.set(r.map(x => x.id))}
                  noun="bill"
                  searchPlaceholder="Search by faculty, Unique ID or bill no..."
                  searchFields={['facultyName', 'uniqueId', 'billNo']}
                  actions={[
                    {
                      label: 'Forward to Finance',
                      icon: 'send',
                      variant: 'primary',
                      onClick: () => setConfirming(true),
                    },
                  ]}
                  columns={[
                    ...columns.map(c => ({
                      header: String(c.header),
                      field: c.field as keyof Row & string,
                      cell: c.cell
                        ? (b: Row) => c.cell!(b, { rowIndex: 0 })
                        : undefined,
                    })),
                    {
                      header: 'Sent by HOD',
                      cell: b => formatDate(b.sentToUtdOn ?? b.billDate),
                    },
                    {
                      header: 'Actions',
                      cell: b => (
                        <div className="flex gap-1">
                          <Button
                            label="View"
                            icon="eye"
                            variant="text"
                            size="small"
                            onClick={() => setViewing(b)}
                          />
                          <Button
                            label="Return to HOD"
                            icon="replay"
                            variant="text"
                            size="small"
                            onClick={() => {
                              setRemarks('');
                              setReturning(b);
                            }}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: `Forwarded to Finance (${forwarded.length})`,
              content: (
                <GridPanel
                  data={forwarded}
                  columns={[
                    ...columns,
                    {
                      header: 'Forwarded On',
                      cell: b => <span>{formatDate(b.utdForwardedOn)}</span>,
                    },
                  ]}
                />
              ),
            },
            {
              title: `Returned to HOD (${returned.length})`,
              content: (
                <GridPanel
                  data={returned}
                  columns={[
                    ...columns,
                    {
                      header: 'Remarks',
                      cell: b => <span>{b.utdRemarks ?? '—'}</span>,
                    },
                  ]}
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
        subtitle={
          viewing
            ? `${viewing.facultyName} · ${viewing.hodBranch} HOD`
            : undefined
        }
        size="xl"
        footer={
          viewing?.status === 'Sent to UTD' ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Return to HOD"
                icon="replay"
                variant="outlined"
                onClick={() => {
                  setRemarks('');
                  setReturning(viewing);
                }}
              />
              <Button
                label="Forward to Finance"
                icon="send"
                variant="primary"
                onClick={() => {
                  utdForwardBills([viewing.id]);
                  ToastService.success(
                    `Bill ${viewing.billNo} forwarded to Finance.`
                  );
                  setViewing(null);
                }}
              />
            </div>
          ) : undefined
        }
      >
        {viewing && <BillView bill={viewing} />}
      </FormPopup>

      <FormPopup
        visible={!!returning}
        onHide={() => setReturning(null)}
        title="Return Bill to HOD"
        subtitle={
          returning
            ? `${returning.billNo} · ${returning.hodBranch} HOD`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setReturning(null)}
            />
            <Button
              label="Return"
              icon="replay"
              variant="warning"
              onClick={confirmReturn}
            />
          </div>
        }
      >
        <TextArea
          label="Remarks for the HOD"
          required
          rows={3}
          value={remarks}
          onChange={setRemarks}
        />
      </FormPopup>

      <ConfirmDialog
        visible={confirming}
        onHide={() => setConfirming(false)}
        onConfirm={forward}
        title="Forward to Finance"
        message={`Forward ${sel.ids.length} bill(s) of ${dept} (total ${inr(selectedTotal)}) to the Finance Department?`}
        confirmLabel="Forward"
        variant="info"
      />
    </FormPage>
  );
}
