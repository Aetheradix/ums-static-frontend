import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function VisitorLogbook() {
  const { visitorRecords, setVisitorRecords, triggerNotification } =
    useHostel();

  const handleCheckIn = (id: string) => {
    setVisitorRecords(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              status: 'CHECKED_IN',
              actualInTime: new Date().toTimeString().split(' ')[0],
            }
          : v
      )
    );
    triggerNotification('Visitor checked in successfully', 'success');
  };

  const handleCheckOut = (id: string) => {
    setVisitorRecords(prev =>
      prev.map(v =>
        v.id === id
          ? {
              ...v,
              status: 'CHECKED_OUT',
              actualOutTime: new Date().toTimeString().split(' ')[0],
            }
          : v
      )
    );
    triggerNotification('Visitor checked out successfully', 'success');
  };

  const handleReject = (id: string) => {
    setVisitorRecords(prev =>
      prev.map(v => (v.id === id ? { ...v, status: 'REJECTED' } : v))
    );
    triggerNotification('Visitor rejected', 'error');
  };

  return (
    <FormPage
      title="Visitor Logbook (Security)"
      description="Manage visitor entry and exit at the hostel gate"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Visitor Logbook' },
      ]}
    >
      <FormCard title="Visitor Log" icon="library_books">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="p-2">Expected Date/Time</th>
                <th className="p-2">Visitor Name</th>
                <th className="p-2">Student Details</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitorRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    No visitors recorded.
                  </td>
                </tr>
              )}
              {visitorRecords.map(v => (
                <tr
                  key={v.id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">
                    {v.expectedDate} {v.expectedTime}
                  </td>
                  <td className="p-2 font-medium">
                    {v.visitorName}{' '}
                    <span className="text-xs text-slate-500">
                      ({v.relation})
                    </span>
                  </td>
                  <td className="p-2">{v.studentName}</td>
                  <td className="p-2">{v.contactNumber}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        v.status === 'PRE_REGISTERED'
                          ? 'bg-blue-100 text-blue-700'
                          : v.status === 'CHECKED_IN'
                            ? 'bg-green-100 text-green-700'
                            : v.status === 'CHECKED_OUT'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {v.status.replace('_', ' ')}
                    </span>
                    {v.actualInTime && (
                      <div className="text-xs mt-1 text-slate-500">
                        In: {v.actualInTime}
                      </div>
                    )}
                    {v.actualOutTime && (
                      <div className="text-xs mt-1 text-slate-500">
                        Out: {v.actualOutTime}
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {v.status === 'PRE_REGISTERED' && (
                      <div className="flex gap-2">
                        <Button
                          label="Check In"
                          variant="primary"
                          onClick={() => handleCheckIn(v.id)}
                        />
                        <Button
                          label="Reject"
                          variant="outlined"
                          onClick={() => handleReject(v.id)}
                        />
                      </div>
                    )}
                    {v.status === 'CHECKED_IN' && (
                      <Button
                        label="Check Out"
                        variant="outlined"
                        onClick={() => handleCheckOut(v.id)}
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
