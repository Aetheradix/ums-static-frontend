import { useMemo, useState } from 'react';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';

export default function CheckIn() {
  const { applications, checkedInList, setCheckedInList, triggerNotification } =
    useHostel();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [luggage, setLuggage] = useState('2');
  const [remarks, setRemarks] = useState('');

  const checkedInAppIds = useMemo(
    () => new Set(checkedInList.map(c => c.appId)),
    [checkedInList]
  );

  const eligibleApps = useMemo(
    () =>
      applications.filter(
        a =>
          a.allottedHostel &&
          a.feeStatus === 'Paid' &&
          !checkedInAppIds.has(a.id)
      ),
    [applications, checkedInAppIds]
  );

  const blockedApps = useMemo(
    () => applications.filter(a => a.allottedHostel && a.feeStatus !== 'Paid'),
    [applications]
  );

  const selectedApp = useMemo(
    () => applications.find(a => a.id === selectedAppId) ?? null,
    [applications, selectedAppId]
  );

  const appDD: Data.DataItem<string>[] = eligibleApps.map(a => ({
    id: a.id,
    text: `${a.name} — Room ${a.allottedRoom} / ${a.allottedBed} (${a.allottedHostel})`,
  }));

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) {
      triggerNotification('Please select a student.', 'error');
      return;
    }
    const app = applications.find(a => a.id === selectedAppId);
    if (!app) return;

    // Ledger lock guard
    if (app.feeStatus !== 'Paid') {
      triggerNotification(
        'Boarding Blocked: Student must clear outstanding fee balance first.',
        'error'
      );
      return;
    }

    setCheckedInList(prev => [
      ...prev,
      {
        appId: app.id,
        studentName: app.name,
        enrollmentNo: app.enrollmentNo,
        hostelCode: app.allottedHostel,
        roomNo: app.allottedRoom,
        bedNo: app.allottedBed,
        checkInDate,
        luggage,
        remarks,
      },
    ]);
    triggerNotification(
      `Check-in complete! Key to Room ${app.allottedRoom} handed over.`
    );
    setSelectedAppId(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Joining / Check-In"
      description="Physical key handoff and boarding registration — requires confirmed fee clearance"
      breadcrumbs={[
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Joining Check-In' },
      ]}
    >
      {/* ── Ledger lock notice ── */}
      {blockedApps.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <i className="pi pi-lock text-red-500 text-xl mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">
              Boarding Locked for {blockedApps.length} Student(s)
            </p>
            <p className="text-xs text-red-600 mt-1">
              Fee balance must be cleared before check-in:{' '}
              {blockedApps.map(a => a.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* ── Check-in form ── */}
      <FormCard title="Student Check-In Form" icon="sign-in">
        <form onSubmit={handleCheckIn}>
          <FormGrid columns={2}>
            <DropDownList
              label="Select Fee-Cleared Student *"
              data={appDD}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Student —"
              value={selectedAppId}
              onChange={v => setSelectedAppId(v as string)}
            />
            <TextBox
              label="Check-In Date"
              value={checkInDate}
              onChange={v => setCheckInDate(v)}
            />
            <TextBox
              label="Luggage Count"
              placeholder="2"
              value={luggage}
              onChange={v => setLuggage(v)}
            />
          </FormGrid>

          {eligibleApps.length === 0 && (
            <p className="text-xs text-amber-600 mt-2">
              No eligible students. Ensure fee is paid and room is allotted.
            </p>
          )}

          <div className="mt-4">
            <TextArea
              label="Remarks"
              placeholder="Key issued, verification notes, etc."
              value={remarks}
              onChange={v => setRemarks(v)}
              rows={2}
            />
          </div>

          {/* Student preview */}
          {selectedApp && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wider">
                Student Details
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Name:</span>{' '}
                  <strong>{selectedApp.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Enrollment:</span>{' '}
                  <strong>{selectedApp.enrollmentNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Hostel:</span>{' '}
                  <strong>{selectedApp.allottedHostel}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Room / Bed:</span>{' '}
                  <strong>
                    {selectedApp.allottedRoom} / {selectedApp.allottedBed}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Fee Status:</span>{' '}
                  <strong className="text-emerald-700">
                    {' '}
                    {selectedApp.feeStatus}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions-row mt-4">
            <Button
              label="Complete Check-In & Issue Key"
              icon="key"
              variant="primary"
              type="submit"
            />
            <Button
              label="Reset"
              variant="outlined"
              onClick={() => {
                setSelectedAppId(null);
                setRemarks('');
              }}
            />
          </div>
        </form>
      </FormCard>

      {/* ── Checked-in registry ── */}
      <FormCard title="Check-In Registry" icon="list">
        <GridPanel
          data={checkedInList}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'appId', header: 'App ID' },
            { field: 'studentName', header: 'Student Name' },
            { field: 'enrollmentNo', header: 'Enrollment No.' },
            { field: 'hostelCode', header: 'Hostel' },
            { field: 'roomNo', header: 'Room' },
            { field: 'bedNo', header: 'Bed' },
            { field: 'checkInDate', header: 'Check-In Date' },
            { field: 'luggage', header: 'Luggage' },
            {
              header: 'Key Status',
              sortable: false,
              cell: () => (
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded">
                  Issued
                </span>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
