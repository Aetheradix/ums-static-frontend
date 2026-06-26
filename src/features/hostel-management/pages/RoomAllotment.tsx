import { useMemo, useState } from 'react';
import { DropDownList, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../context';

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

  // Only approved applications
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

  // Dropdown data
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

    // ── Gender guard ──
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

    // ── Capacity guard ──
    if (room.availableBeds <= 0) {
      triggerNotification(`Room ${room.roomNumber} is full.`, 'error');
      return;
    }
    if (hostel.available <= 0) {
      triggerNotification(`Hostel is at full capacity.`, 'error');
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
      {/* ── Guard banners ── */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700">
          <i className="pi pi-shield text-base" />
          Gender Guard: Active — Male students cannot be allotted to Girls
          hostels and vice-versa.
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-700">
          <i className="pi pi-lock text-base" />
          Capacity Guard: Active — Over-allocation beyond available beds is
          blocked.
        </div>
      </div>

      <FormCard title="Allotment Form" icon="user">
        <form onSubmit={handleAllot}>
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

          <div className="mt-4">
            <TextArea
              label="Allotment Remarks"
              placeholder="Optional remarks..."
              value={allotmentRemarks}
              onChange={v => setAllotmentRemarks(v)}
              rows={2}
            />
          </div>

          {/* Room detail preview */}
          {roomDetail && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wider">
                Room Preview
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Room:</span>{' '}
                  <strong>{roomDetail.roomNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Type:</span>{' '}
                  <strong>{roomDetail.roomType}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Total Beds:</span>{' '}
                  <strong>{roomDetail.totalBeds}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Available:</span>{' '}
                  <strong className="text-emerald-700">
                    {roomDetail.availableBeds}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Category:</span>{' '}
                  <strong>{roomDetail.category}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Add. Charges:</span>{' '}
                  <strong>₹{roomDetail.additionalCharges}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Facilities:</span>{' '}
                  <strong>{roomDetail.facilities.join(', ')}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Student preview */}
          {selectedStudent && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                Student Preview
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Name:</span>{' '}
                  <strong>{selectedStudent.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Gender:</span>{' '}
                  <strong>{selectedStudent.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Enrollment:</span>{' '}
                  <strong>{selectedStudent.enrollmentNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Pref. Room:</span>{' '}
                  <strong>{selectedStudent.roomPreference}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions-row mt-4">
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

      {/* ── Allotment summary table ── */}
      <FormCard title="Allotment Summary" icon="users">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold">
                {[
                  '#',
                  'App ID',
                  'Student',
                  'Gender',
                  'Hostel',
                  'Room',
                  'Bed',
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
                  <td className="px-3 py-2">{a.gender}</td>
                  <td className="px-3 py-2">{a.allottedHostel}</td>
                  <td className="px-3 py-2">{a.allottedRoom}</td>
                  <td className="px-3 py-2">{a.allottedBed}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${a.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {a.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {allottedApps.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400">
                    No allotments made yet.
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
