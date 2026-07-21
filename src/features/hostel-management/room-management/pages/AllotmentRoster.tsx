import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function AllotmentRoster() {
  const {
    roomAllotments,
    triggerNotification,
    setRoomAllotments,
    setStudentApplications,
  } = useHostel();

  const handleCancelAllotment = (
    allotmentId: string,
    applicationId: string
  ) => {
    setRoomAllotments(prev =>
      prev.map(a => (a.id === allotmentId ? { ...a, status: 'CANCELLED' } : a))
    );
    setStudentApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'APPROVED' } : a))
    );
    triggerNotification('Allotment Cancelled Successfully', 'success');
  };

  return (
    <FormPage
      title="Allotment Roster"
      description="View and manage current room allotments"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Allotment Roster' },
      ]}
    >
      <FormCard title="Current Allotments" icon="list_alt">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Allotment Date</th>
                <th className="p-2">Student Name</th>
                <th className="p-2">Hostel</th>
                <th className="p-2">Room / Bed</th>
                <th className="p-2">Valid Till</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomAllotments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    No allotments found.
                  </td>
                </tr>
              )}
              {roomAllotments.map(a => (
                <tr
                  key={a.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">{a.allotmentDate}</td>
                  <td className="p-2 font-medium">{a.studentName}</td>
                  <td className="p-2">{a.hostelName}</td>
                  <td className="p-2">
                    {a.roomNumber} / {a.bedNumber}
                  </td>
                  <td className="p-2">{a.validTill}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        a.status === 'PENDING_CHECKIN'
                          ? 'bg-yellow-100 text-yellow-700'
                          : a.status === 'CHECKED_IN'
                            ? 'bg-green-100 text-green-700'
                            : a.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-2">
                    {a.status === 'PENDING_CHECKIN' && (
                      <Button
                        label="Cancel"
                        variant="outlined"
                        onClick={() =>
                          handleCancelAllotment(a.id, a.applicationId)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
