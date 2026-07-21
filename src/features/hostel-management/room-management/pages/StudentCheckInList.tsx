import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate } from 'react-router-dom';

export default function StudentCheckInList() {
  const { roomAllotments } = useHostel();
  const navigate = useNavigate();

  const pendingCheckIns = roomAllotments.filter(
    a => a.status === 'PENDING_CHECKIN'
  );

  return (
    <FormPage
      title="Student Check-In List"
      description="View students pending check-in and initiate the handover process"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Check-In' },
      ]}
    >
      <FormCard title="Pending Check-Ins" icon="how_to_reg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Allotment ID</th>
                <th className="p-2">Student Name</th>
                <th className="p-2">Hostel</th>
                <th className="p-2">Room / Bed</th>
                <th className="p-2">Allotment Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCheckIns.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No pending check-ins found.
                  </td>
                </tr>
              )}
              {pendingCheckIns.map(a => (
                <tr
                  key={a.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">{a.id}</td>
                  <td className="p-2 font-medium">{a.studentName}</td>
                  <td className="p-2">{a.hostelName}</td>
                  <td className="p-2">
                    Room {a.roomNumber} ({a.bedNumber})
                  </td>
                  <td className="p-2">{a.allotmentDate}</td>
                  <td className="p-2">
                    <Button
                      label="Process Check-In"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/hostel-management/room-management/check-in-details/${a.id}`
                        )
                      }
                    />
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
