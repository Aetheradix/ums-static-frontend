import { useMemo, useState } from 'react';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { useHostel } from '../context';
import '../hostel.css';

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
        { label: 'Home', to: '/home' },
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Joining Check-In' },
      ]}
    >
      {/* Boarding Lock Notice */}
      {blockedApps.length > 0 && (
        <div className="hm-alert hm-alert--danger">
          <i className="pi pi-lock" />
          <div>
            <p style={{ fontWeight: 800, margin: '0 0 0.25rem' }}>
              Boarding Locked for {blockedApps.length} Student(s)
            </p>
            <p style={{ fontSize: '0.72rem', margin: 0 }}>
              Fee balance must be cleared before check-in:{' '}
              {blockedApps.map(a => a.name).join(', ')}.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Form */}
        <FormCard title="Student Check-In Form" icon="sign-in">
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="hm-alert hm-alert--guard">
              <i className="pi pi-key" />
              <div>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    margin: '0 0 0.15rem',
                  }}
                >
                  Key Handover Guard:
                </p>
                <p style={{ margin: 0 }}>
                  Keys are released only after fee status is{' '}
                  <strong>'Paid'</strong> in the ledger.
                </p>
              </div>
            </div>

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
              <p className="text-xs text-amber-600">
                No eligible students. Ensure fee is paid and room is allotted.
              </p>
            )}

            <TextArea
              label="Remarks"
              placeholder="Key issued, verification notes, etc."
              value={remarks}
              onChange={v => setRemarks(v)}
              rows={2}
            />

            {/* Student Preview */}
            {selectedApp && (
              <div className="hm-preview-card--student">
                <p className="hm-preview-label hm-preview-label--student">
                  Student Details
                </p>
                <div className="hm-preview-grid">
                  <div className="hm-preview-item">
                    <span>Name: </span>
                    <strong>{selectedApp.name}</strong>
                  </div>
                  <div className="hm-preview-item">
                    <span>Enrollment: </span>
                    <strong>{selectedApp.enrollmentNo}</strong>
                  </div>
                  <div className="hm-preview-item">
                    <span>Hostel: </span>
                    <strong>{selectedApp.allottedHostel}</strong>
                  </div>
                  <div className="hm-preview-item">
                    <span>Room/Bed: </span>
                    <strong>
                      {selectedApp.allottedRoom}/{selectedApp.allottedBed}
                    </strong>
                  </div>
                  <div className="hm-preview-item">
                    <span>Fee: </span>
                    <strong style={{ color: '#15803d' }}>
                      {selectedApp.feeStatus}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions-row mt-2">
              <Button
                label="Complete Check-In &amp; Issue Key"
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

        {/* Check-in Registry */}
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
              { field: 'hostelCode', header: 'Hostel' },
              {
                field: 'roomNo',
                header: 'Room',
                cell: (item: HostelManagement.CheckedInRecord) => (
                  <span className="hm-room-badge">
                    {item.roomNo}/{item.bedNo}
                  </span>
                ),
              },
              { field: 'checkInDate', header: 'Check-In Date' },
              {
                header: 'Key Status',
                sortable: false,
                cell: () => (
                  <span className="hm-badge hm-badge--issued">Issued</span>
                ),
              },
            ]}
            searchBox
          />
        </FormCard>
      </div>
    </FormPage>
  );
}


