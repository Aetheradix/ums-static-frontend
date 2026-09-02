import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
} from 'shared/new-components';
import { SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_WARDEN_HOSTEL_ID,
  now,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Visitor } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const ID_PROOFS = [
  'Aadhaar',
  'Voter ID',
  'Driving Licence',
  'PAN Card',
  'Other',
].map(t => ({ id: t, text: t }));

const blank = () => ({
  studentId: '',
  visitorName: '',
  relation: '',
  purpose: '',
  contactNumber: '',
  idProofType: 'Aadhaar',
  idProofNumber: '',
  visitDate: today(),
  timeIn: now(),
  timeOut: '',
  remarks: '',
});

export default function Visitors() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();
  const [form, setForm] = useState(blank);

  const residents = useMemo(
    () =>
      data.allocations
        .filter(
          a => a.hostelId === MOCK_WARDEN_HOSTEL_ID && a.status === 'Active'
        )
        .map(a => ({
          id: a.studentId,
          text: `${a.studentName} (${a.studentId})`,
          name: a.studentName,
        })),
    [data.allocations]
  );

  const rows = useMemo(
    () =>
      isStudent
        ? data.visitors.filter(v => v.studentId === MOCK_STUDENT_ID)
        : data.visitors.filter(v => v.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.visitors, isStudent]
  );

  const stats = useMemo(
    () => ({
      total: rows.length,
      inside: rows.filter(v => !v.timeOut).length,
      todayCount: rows.filter(v => v.visitDate === today()).length,
    }),
    [rows]
  );

  const record = () => {
    add('visitors', {
      id: uid('VS'),
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      studentId: form.studentId,
      studentName: residents.find(r => r.id === form.studentId)?.name ?? '',
      visitorName: form.visitorName,
      relation: form.relation,
      purpose: form.purpose,
      contactNumber: form.contactNumber,
      idProofType: form.idProofType,
      idProofNumber: form.idProofNumber,
      visitDate: form.visitDate,
      timeIn: form.timeIn,
      timeOut: form.timeOut,
      remarks: form.remarks,
    });
    setForm(blank());
    ToastService.success('Visitor entry recorded — the student can see it.');
  };

  const checkOut = (v: Visitor) => {
    update('visitors', v.id, { ...v, timeOut: now() });
    ToastService.success(`${v.visitorName} checked out.`);
  };

  return (
    <FormPage
      title={isStudent ? 'My Visitors' : 'Visitor Entry'}
      description={
        isStudent
          ? 'Visitors the hostel gate has logged against your name, with entry and exit times.'
          : 'Register visitors at the gate against the resident they are visiting, and check them out when they leave.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Visitor Entry')}
    >
      <FormGrid columns={3}>
        <StatCard
          title={isStudent ? 'My Visitors' : 'Total Visitors'}
          value={stats.total}
          icon="groups"
          colorScheme="blue"
        />
        <StatCard
          title="Currently Inside"
          value={stats.inside}
          icon="login"
          colorScheme="amber"
        />
        <StatCard
          title="Visits Today"
          value={stats.todayCount}
          icon="calendar_today"
          colorScheme="teal"
        />
      </FormGrid>

      {!isStudent && (
        <FormCard title="New Visitor Entry" icon="user-plus">
          <FormGrid columns={4}>
            <DropDownList
              label="Student Visited"
              data={residents}
              textField="text"
              valueField="id"
              filter
              value={form.studentId}
              onChange={v =>
                setForm({ ...form, studentId: (v as string) ?? '' })
              }
            />
            <TextBox
              label="Visitor Name"
              value={form.visitorName}
              onChange={v => setForm({ ...form, visitorName: v })}
            />
            <TextBox
              label="Relation"
              placeholder="e.g. Father"
              value={form.relation}
              onChange={v => setForm({ ...form, relation: v })}
            />
            <TextBox
              label="Purpose"
              value={form.purpose}
              onChange={v => setForm({ ...form, purpose: v })}
            />
            <TextBox
              label="Contact Number"
              maxLength={10}
              value={form.contactNumber}
              onChange={v =>
                setForm({ ...form, contactNumber: v.replace(/\D/g, '') })
              }
            />
            <DropDownList
              label="ID Proof Type"
              data={ID_PROOFS}
              textField="text"
              valueField="id"
              value={form.idProofType}
              onChange={v =>
                setForm({ ...form, idProofType: (v as string) ?? '' })
              }
            />
            <TextBox
              label="ID Proof Number"
              value={form.idProofNumber}
              onChange={v => setForm({ ...form, idProofNumber: v })}
            />
            <TextBox
              label="Visit Date"
              type="date"
              value={form.visitDate}
              onChange={v => setForm({ ...form, visitDate: v })}
            />
            <TextBox
              label="Time In"
              type="time"
              value={form.timeIn}
              onChange={v => setForm({ ...form, timeIn: v })}
            />
            <TextBox
              label="Time Out"
              type="time"
              value={form.timeOut}
              onChange={v => setForm({ ...form, timeOut: v })}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Remarks"
                rows={1}
                value={form.remarks}
                onChange={v => setForm({ ...form, remarks: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Record Entry"
              variant="primary"
              icon="check"
              onClick={record}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(blank())}
            />
          </div>
        </FormCard>
      )}

      {isStudent && (
        <SectionNote tone="info">
          Visitors are logged by the warden at the hostel gate. Ask them to
          carry a photo ID.
        </SectionNote>
      )}

      <FormCard title="Visitor Register" icon="list">
        <GridPanel<Visitor>
          data={rows}
          searchBox
          searchPlaceholder="Search by visitor, student or purpose..."
          searchFields={['visitorName', 'studentName', 'purpose']}
          pagination
          emptyMessage="No visitor entries recorded."
          columns={[
            {
              field: 'visitorName',
              header: 'Visitor',
              cell: v => (
                <div className="flex flex-col">
                  <span className="font-semibold">{v.visitorName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {v.relation || '—'}
                  </span>
                </div>
              ),
            },
            ...(isStudent
              ? []
              : [{ field: 'studentName' as const, header: 'Student Visited' }]),
            { field: 'purpose', header: 'Purpose' },
            {
              field: 'contactNumber',
              header: 'Contact',
              cell: v => <>{v.contactNumber || '—'}</>,
            },
            {
              field: 'idProofType',
              header: 'ID Proof',
              cell: v => (
                <>
                  {v.idProofType}
                  {v.idProofNumber && (
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {v.idProofNumber}
                    </span>
                  )}
                </>
              ),
            },
            { field: 'visitDate', header: 'Date', width: 120 },
            { field: 'timeIn', header: 'Time In', width: 100 },
            {
              field: 'timeOut',
              header: 'Time Out',
              width: 110,
              cell: v =>
                v.timeOut ? (
                  <>{v.timeOut}</>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Inside
                  </span>
                ),
            },
            ...(isStudent
              ? []
              : [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (v: Visitor) =>
                      v.timeOut ? (
                        <span className="text-xs text-slate-400">Closed</span>
                      ) : (
                        <Button
                          label="Check Out"
                          icon="sign-out"
                          variant="outlined"
                          size="small"
                          onClick={() => checkOut(v)}
                        />
                      ),
                  },
                ]),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
