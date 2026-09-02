import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState, SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  ROOM_TYPE_OPTIONS,
  roomOccupancy,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { RoomChangeRequest as ChangeRequest } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const STATUS_VARIANT = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export default function RoomChangeRequest() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState({
    requestedRoomType: '',
    requestedRoomId: '',
    reason: '',
  });
  const [deciding, setDeciding] = useState<{
    request: ChangeRequest;
    status: 'Approved' | 'Rejected';
  } | null>(null);
  const [decisionRemark, setDecisionRemark] = useState('');
  const [newRoomId, setNewRoomId] = useState('');

  /** The student's own active bed, so the request knows where they are now. */
  const myAllocation = data.allocations.find(
    a => a.studentId === MOCK_STUDENT_ID && a.status === 'Active'
  );
  const myRoom = data.rooms.find(r => r.id === myAllocation?.roomId);

  /**
   * Rooms of the chosen type in the student's own hostel, each labelled with
   * how many beds are free — the room they already hold is excluded.
   */
  const requestableRooms = useMemo(() => {
    if (!form.requestedRoomType) return [];
    const hostelId = myAllocation?.hostelId ?? MOCK_WARDEN_HOSTEL_ID;
    return data.rooms
      .filter(
        r =>
          r.hostelId === hostelId &&
          r.roomType === form.requestedRoomType &&
          r.status === 'Available' &&
          r.id !== myAllocation?.roomId
      )
      .map(r => {
        const { available } = roomOccupancy(r, data.allocations);
        return {
          id: r.id,
          text: `${r.roomNumber} (${
            available === 0
              ? 'Full'
              : `${available} of ${r.beds} bed${r.beds === 1 ? '' : 's'} vacant`
          }) · ${r.floor}, ${r.wing}`,
        };
      });
  }, [data.rooms, data.allocations, form.requestedRoomType, myAllocation]);

  const rows = useMemo(
    () =>
      isStudent
        ? data.roomChangeRequests.filter(r => r.studentId === MOCK_STUDENT_ID)
        : data.roomChangeRequests.filter(
            r => r.hostelId === MOCK_WARDEN_HOSTEL_ID
          ),
    [data.roomChangeRequests, isStudent]
  );

  const counts = useMemo(
    () => ({
      pending: rows.filter(r => r.status === 'Pending').length,
      approved: rows.filter(r => r.status === 'Approved').length,
      rejected: rows.filter(r => r.status === 'Rejected').length,
    }),
    [rows]
  );

  const roomLabel = (id: string) =>
    data.rooms.find(r => r.id === id)?.roomNumber ?? '—';

  /** Rooms free in the type the student asked for, for the warden to move them into. */
  const targetRoomOptions = useMemo(() => {
    if (!deciding) return [];
    return data.rooms
      .filter(
        r =>
          r.hostelId === deciding.request.hostelId &&
          r.status === 'Available' &&
          (!deciding.request.requestedRoomType ||
            r.roomType === deciding.request.requestedRoomType)
      )
      .map(r => {
        const o = roomOccupancy(r, data.allocations);
        return {
          id: r.id,
          text: `${r.roomNumber} — ${o.available} of ${r.beds} free · ${r.floor}, ${r.wing}`,
          disabled: o.available === 0,
        };
      });
  }, [deciding, data.rooms, data.allocations]);

  const handleRaise = () => {
    add('roomChangeRequests', {
      id: uid('RC'),
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: myAllocation?.hostelId ?? MOCK_WARDEN_HOSTEL_ID,
      currentRoomId: myAllocation?.roomId ?? '',
      requestedRoomType: form.requestedRoomType,
      requestedRoomId: form.requestedRoomId,
      reason: form.reason,
      requestedOn: today(),
      status: 'Pending',
      actionBy: '',
      actionDate: '',
      remarks: '',
    });
    setForm({ requestedRoomType: '', requestedRoomId: '', reason: '' });
    ToastService.success('Room change request sent to the warden.');
  };

  const handleDecision = () => {
    if (!deciding) return;
    const { request, status } = deciding;

    update('roomChangeRequests', request.id, {
      ...request,
      status,
      actionBy: MOCK_WARDEN_NAME,
      actionDate: today(),
      remarks: decisionRemark.trim(),
    });

    // Approving with a target room moves the student's bed across.
    if (status === 'Approved' && newRoomId) {
      const existing = data.allocations.find(
        a => a.studentId === request.studentId && a.status === 'Active'
      );
      const target = data.rooms.find(r => r.id === newRoomId);
      if (existing) {
        update('allocations', existing.id, { ...existing, status: 'Vacated' });
      }
      if (target) {
        add('allocations', {
          id: uid('AL'),
          applicationId: existing?.applicationId ?? '',
          studentId: request.studentId,
          studentName: request.studentName,
          hostelId: request.hostelId,
          roomId: target.id,
          roomType: target.roomType,
          allottedOn: today(),
          allottedBy: MOCK_WARDEN_NAME,
          status: 'Active',
        });
      }
    }

    ToastService.success(
      status === 'Approved'
        ? `${request.studentName} moved${newRoomId ? ` to room ${roomLabel(newRoomId)}` : ''}.`
        : `${request.studentName}'s room change request rejected.`
    );
    setDeciding(null);
    setDecisionRemark('');
    setNewRoomId('');
  };

  return (
    <FormPage
      title={isStudent ? 'Room Change Request' : 'Room Change Requests'}
      description={
        isStudent
          ? 'Ask to move to a different room or room type, and follow the warden’s decision.'
          : 'Requests from residents to move room. Approving one can move their bed across in the same step.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Room Change Requests')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Pending"
          value={counts.pending}
          icon="schedule"
          colorScheme="amber"
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon="cancel"
          colorScheme="red"
        />
      </FormGrid>

      {isStudent && (
        <FormCard
          title="Request a Room Change"
          subtitle="Tell the warden which room type would suit you better and why."
          icon="swap"
        >
          {myRoom ? (
            <SectionNote tone="neutral" title="Your current room">
              Room <strong>{myRoom.roomNumber}</strong> · {myRoom.roomType} ·{' '}
              {myRoom.floor}, {myRoom.wing}
            </SectionNote>
          ) : (
            <SectionNote tone="warning">
              You don’t hold a room right now. You can still raise a request and
              the warden will pick a room for you.
            </SectionNote>
          )}

          <FormGrid columns={2}>
            <DropDownList
              label="Requested Room Type"
              data={ROOM_TYPE_OPTIONS}
              textField="text"
              valueField="id"
              value={form.requestedRoomType}
              onChange={v =>
                setForm({
                  ...form,
                  requestedRoomType: (v as string) ?? '',
                  requestedRoomId: '',
                })
              }
            />
            <DropDownList
              label="Preferred Room Number"
              subLabel="Optional"
              data={requestableRooms}
              textField="text"
              valueField="id"
              filter
              defaultOptionText={
                form.requestedRoomType
                  ? 'Select a room number'
                  : 'Pick a room type first'
              }
              value={form.requestedRoomId}
              onChange={v =>
                setForm({ ...form, requestedRoomId: (v as string) ?? '' })
              }
            />
            <div className="md:col-span-2">
              <TextArea
                label="Reason"
                rows={3}
                placeholder="e.g. Prefer a quieter room closer to the reading room"
                value={form.reason}
                onChange={v => setForm({ ...form, reason: v })}
              />
            </div>
          </FormGrid>

          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Request"
              icon="send"
              variant="primary"
              onClick={handleRaise}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() =>
                setForm({
                  requestedRoomType: '',
                  requestedRoomId: '',
                  reason: '',
                })
              }
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title={isStudent ? 'My Requests' : 'Requests from Residents'}
        icon="list"
      >
        {rows.length === 0 ? (
          <EmptyState
            icon="swap_calls"
            title="No room change requests"
            hint={
              isStudent
                ? 'Raise one above if your current room does not suit you.'
                : 'Requests from your residents will appear here.'
            }
          />
        ) : (
          <GridPanel<ChangeRequest>
            data={rows}
            searchBox
            searchPlaceholder="Search by student or reason..."
            searchFields={['studentName', 'reason']}
            pagination
            columns={[
              ...(isStudent
                ? []
                : [
                    {
                      field: 'studentName' as const,
                      header: 'Student',
                      width: 180,
                      cell: (item: ChangeRequest) => (
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {item.studentName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {item.studentId}
                          </span>
                        </div>
                      ),
                    },
                  ]),
              {
                field: 'currentRoomId',
                header: 'Current Room',
                width: 150,
                cell: item => (
                  <span className="font-mono">
                    {roomLabel(item.currentRoomId)}
                  </span>
                ),
              },
              {
                field: 'requestedRoomType',
                header: 'Requested Type',
                width: 165,
                cell: item => (
                  <StatusBadge
                    label={item.requestedRoomType || 'Any'}
                    variant="info"
                  />
                ),
              },
              { field: 'reason', header: 'Reason', width: 280 },
              { field: 'requestedOn', header: 'Requested On', width: 140 },
              {
                field: 'status',
                header: 'Status',
                width: 115,
                cell: item => (
                  <StatusBadge
                    label={item.status}
                    variant={STATUS_VARIANT[item.status]}
                  />
                ),
              },
              {
                field: 'remarks',
                header: 'Warden Remarks',
                width: 220,
                cell: item => <>{item.remarks || '—'}</>,
              },
              ...(isStudent
                ? []
                : [
                    {
                      header: 'Action',
                      sortable: false,
                      width: 190,
                      cell: (item: ChangeRequest) =>
                        item.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <Button
                              label="Approve"
                              icon="check"
                              variant="success"
                              size="small"
                              onClick={() => {
                                setDeciding({
                                  request: item,
                                  status: 'Approved',
                                });
                                setDecisionRemark('');
                                setNewRoomId('');
                              }}
                            />
                            <Button
                              label="Reject"
                              icon="times"
                              variant="danger"
                              size="small"
                              onClick={() => {
                                setDeciding({
                                  request: item,
                                  status: 'Rejected',
                                });
                                setDecisionRemark('');
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {item.actionBy || 'Closed'}
                          </span>
                        ),
                    },
                  ]),
            ]}
          />
        )}
      </FormCard>

      <FormPopup
        visible={Boolean(deciding)}
        onHide={() => setDeciding(null)}
        title={
          deciding?.status === 'Approved'
            ? 'Approve Room Change'
            : 'Reject Room Change'
        }
        subtitle={
          deciding
            ? `${deciding.request.studentName} · currently in ${roomLabel(deciding.request.currentRoomId)}`
            : ''
        }
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setDeciding(null)}
            />
            <Button
              label={
                deciding?.status === 'Approved'
                  ? 'Approve & Move'
                  : 'Confirm Rejection'
              }
              variant={deciding?.status === 'Approved' ? 'success' : 'danger'}
              onClick={handleDecision}
            />
          </div>
        }
      >
        {deciding && (
          <div className="flex flex-col gap-4">
            <SectionNote tone="neutral" title="Reason given">
              {deciding.request.reason || 'No reason stated.'}
            </SectionNote>

            {deciding.status === 'Approved' && (
              <>
                <FormGrid columns={1}>
                  <DropDownList
                    label={`Move to Room${
                      deciding.request.requestedRoomType
                        ? ` (${deciding.request.requestedRoomType})`
                        : ''
                    }`}
                    data={targetRoomOptions}
                    textField="text"
                    valueField="id"
                    placeholder="Leave blank to approve without moving them yet"
                    value={newRoomId}
                    onChange={v => setNewRoomId((v as string) ?? '')}
                  />
                </FormGrid>
                <SectionNote tone="info">
                  Picking a room here vacates their current bed and allots the
                  new one in the same step. Leave it blank to approve now and
                  allot later from Room Allotment.
                </SectionNote>
              </>
            )}

            <TextArea
              label="Remarks to the Student"
              rows={3}
              value={decisionRemark}
              onChange={setDecisionRemark}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
