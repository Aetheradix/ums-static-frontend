import { useMemo, useState } from 'react';
import { DropDownList, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../context';
import '../hostel.css';

export default function RoomAllotment() {
  const {
    hostels,
    rooms,
    applications,
    setApplications,
    setRooms,
    setHostels,
    triggerNotification,
  } = useHostel();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedHostelCode, setSelectedHostelCode] = useState<string | null>(
    null
  );
  const [selectedRoomNo, setSelectedRoomNo] = useState<string | null>(null);
  const [selectedBedNo, setSelectedBedNo] = useState<string | null>(null);
  const [allotmentRemarks, setAllotmentRemarks] = useState('');

  const eligibleApps = useMemo(
    () => applications.filter(a => a.status === 'Approved'),
    [applications]
  );
  const selectedStudent = useMemo(
    () => applications.find(a => a.id === selectedAppId) ?? null,
    [applications, selectedAppId]
  );

  const availableRooms = useMemo(() => {
    if (!selectedHostelCode) return [];
    return rooms.filter(
      r => r.hostelCode === selectedHostelCode && r.availableBeds > 0
    );
  }, [rooms, selectedHostelCode]);

  const roomDetail = useMemo(() => {
    if (!selectedHostelCode || !selectedRoomNo) return null;
    return (
      rooms.find(
        r =>
          r.hostelCode === selectedHostelCode && r.roomNumber === selectedRoomNo
      ) ?? null
    );
  }, [rooms, selectedHostelCode, selectedRoomNo]);

  const bedOptions = useMemo((): Data.DataItem<string>[] => {
    if (!roomDetail) return [];
    return Array.from({ length: roomDetail.totalBeds }, (_, i) => ({
      id: `Bed-${i + 1}`,
      text: `Bed-${i + 1}`,
    }));
  }, [roomDetail]);

  const appDD: Data.DataItem<string>[] = eligibleApps.map(a => ({
    id: a.id,
    text: `${a.name} (${a.id})`,
  }));
  const hostelDD: Data.DataItem<string>[] = hostels
    .filter(h => h.available > 0)
    .map(h => ({
      id: h.code,
      text: `${h.name} (${h.type}) — ${h.available} beds free`,
    }));
  const roomDD: Data.DataItem<string>[] = availableRooms.map(r => ({
    id: r.roomNumber,
    text: `${r.roomNumber} — ${r.roomName} (${r.availableBeds} beds free)`,
  }));

  const handleAllot = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedAppId ||
      !selectedHostelCode ||
      !selectedRoomNo ||
      !selectedBedNo
    ) {
      triggerNotification('Please fill in all allotment fields.', 'error');
      return;
    }
    const student = applications.find(a => a.id === selectedAppId);
    const hostel = hostels.find(h => h.code === selectedHostelCode);
    const room = rooms.find(
      r =>
        r.hostelCode === selectedHostelCode && r.roomNumber === selectedRoomNo
    );
    if (!student || !hostel || !room) {
      triggerNotification('Invalid selection.', 'error');
      return;
    }

    const genderOk =
      (student.gender === 'Male' && hostel.type === 'Boys') ||
      (student.gender === 'Female' && hostel.type === 'Girls') ||
      hostel.type === 'Co-Ed';
    if (!genderOk) {
      triggerNotification(
        `Gender mismatch! "${hostel.name}" accommodates ${hostel.type} students only.`,
        'error'
      );
      return;
    }
    if (room.availableBeds <= 0) {
      triggerNotification(`Room ${room.roomNumber} is full.`, 'error');
      return;
    }
    if (hostel.available <= 0) {
      triggerNotification('Hostel is at full capacity.', 'error');
      return;
    }

    setApplications(prev =>
      prev.map(a =>
        a.id === selectedAppId
          ? {
              ...a,
              allottedHostel: selectedHostelCode,
              allottedRoom: selectedRoomNo,
              allottedBed: selectedBedNo,
            }
          : a
      )
    );
    setRooms(prev =>
      prev.map(r => {
        if (
          r.hostelCode === selectedHostelCode &&
          r.roomNumber === selectedRoomNo
        ) {
          const newOccupied = Math.min(r.totalBeds, r.occupiedBeds + 1);
          return {
            ...r,
            occupiedBeds: newOccupied,
            availableBeds: r.totalBeds - newOccupied,
            status: r.totalBeds - newOccupied === 0 ? 'Full' : 'Available',
          };
        }
        return r;
      })
    );
    setHostels(prev =>
      prev.map(h =>
        h.code === selectedHostelCode
          ? {
              ...h,
              occupancy: Math.min(h.beds, h.occupancy + 1),
              available: Math.max(0, h.available - 1),
            }
          : h
      )
    );

    triggerNotification(`Room allotment complete for ${student.name}.`);
    setSelectedAppId(null);
    setSelectedHostelCode(null);
    setSelectedRoomNo(null);
    setSelectedBedNo(null);
    setAllotmentRemarks('');
  };

  const allottedApps = applications.filter(a => a.allottedHostel);

  return (
    <FormPage
      title="Room Allotment Controller"
      description="Map approved students to specific beds — gender and capacity guards are enforced automatically"
      breadcrumbs={[
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Room Allotment' },
      ]}
    >
      <div className="hm-guard-bar">
        <span className="hm-guard-pill hm-guard-pill--blue">
          <i className="pi pi-shield" /> Gender Guard: Active — Male students
          cannot be allotted to Girls hostels.
        </span>
        <span className="hm-guard-pill hm-guard-pill--purple">
          <i className="pi pi-lock" /> Capacity Guard: Active — Over-allocation
          is blocked.
        </span>
      </div>

      <FormCard title="Allotment Form" icon="user">
        <form onSubmit={handleAllot} className="space-y-4">
          <FormGrid columns={2}>
            <DropDownList
              label="Select Approved Student *"
              data={appDD}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Application —"
              value={selectedAppId}
              onChange={v => {
                setSelectedAppId(v as string);
                setSelectedHostelCode(null);
                setSelectedRoomNo(null);
                setSelectedBedNo(null);
              }}
            />
            <DropDownList
              label="Select Hostel *"
              data={hostelDD}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Hostel —"
              value={selectedHostelCode}
              onChange={v => {
                setSelectedHostelCode(v as string);
                setSelectedRoomNo(null);
                setSelectedBedNo(null);
              }}
            />
            <DropDownList
              label="Select Room *"
              data={roomDD}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Room —"
              value={selectedRoomNo}
              onChange={v => {
                setSelectedRoomNo(v as string);
                setSelectedBedNo(null);
              }}
            />
            <DropDownList
              label="Select Bed *"
              data={bedOptions}
              textField="text"
              valueField="id"
              defaultOptionText="— Select Bed —"
              value={selectedBedNo}
              onChange={v => setSelectedBedNo(v as string)}
            />
          </FormGrid>

          <TextArea
            label="Allotment Remarks"
            placeholder="Optional remarks..."
            value={allotmentRemarks}
            onChange={v => setAllotmentRemarks(v)}
            rows={2}
          />

          {roomDetail && (
            <div className="hm-preview-card--room">
              <p className="hm-preview-label hm-preview-label--room">
                Room Preview
              </p>
              <div className="hm-preview-grid">
                <div className="hm-preview-item">
                  <span>Room: </span>
                  <strong>{roomDetail.roomNumber}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Type: </span>
                  <strong>{roomDetail.roomType}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Total Beds: </span>
                  <strong>{roomDetail.totalBeds}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Available: </span>
                  <strong style={{ color: '#15803d' }}>
                    {roomDetail.availableBeds}
                  </strong>
                </div>
                <div className="hm-preview-item">
                  <span>Category: </span>
                  <strong>{roomDetail.category}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Add. Charges: </span>
                  <strong>₹{roomDetail.additionalCharges}</strong>
                </div>
              </div>
            </div>
          )}

          {selectedStudent && (
            <div className="hm-preview-card--student">
              <p className="hm-preview-label hm-preview-label--student">
                Student Preview
              </p>
              <div className="hm-preview-grid">
                <div className="hm-preview-item">
                  <span>Name: </span>
                  <strong>{selectedStudent.name}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Gender: </span>
                  <strong>{selectedStudent.gender}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Enrollment: </span>
                  <strong>{selectedStudent.enrollmentNo}</strong>
                </div>
                <div className="hm-preview-item">
                  <span>Pref. Room: </span>
                  <strong>{selectedStudent.roomPreference}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions-row mt-2">
            <Button
              label="Confirm Allotment"
              icon="check"
              variant="primary"
              type="submit"
            />
            <Button
              label="Reset"
              variant="outlined"
              onClick={() => {
                setSelectedAppId(null);
                setSelectedHostelCode(null);
                setSelectedRoomNo(null);
                setSelectedBedNo(null);
                setAllotmentRemarks('');
              }}
            />
          </div>
        </form>
      </FormCard>

      {/* Summary Table */}
      <FormCard title="Allotment Summary" icon="users">
        <table className="hm-allot-table">
          <thead>
            <tr>
              {[
                '#',
                'App ID',
                'Student',
                'Gender',
                'Hostel',
                'Room/Bed',
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
                <td style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                  {a.id}
                </td>
                <td style={{ fontWeight: 600 }}>{a.name}</td>
                <td>{a.gender}</td>
                <td>{a.allottedHostel}</td>
                <td>
                  <span className="hm-room-badge">
                    {a.allottedRoom}/{a.allottedBed}
                  </span>
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
            {allottedApps.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    color: '#94a3b8',
                  }}
                >
                  No allotments made yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
