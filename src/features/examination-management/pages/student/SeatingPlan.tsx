import { FormPage, FormCard } from 'shared/new-components';
import { useStudentSeatingPlanQuery } from '../../queries';

export default function StudentSeatingPlan() {
  const { data, isLoading, isError, error } = useStudentSeatingPlanQuery();

  if (isLoading) {
    return (
      <FormPage
        title="My Seating Plan"
        description="View your assigned examination hall and seat"
      >
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading seating plan...
        </div>
      </FormPage>
    );
  }

  if (isError || !data) {
    return (
      <FormPage
        title="My Seating Plan"
        description="View your assigned examination hall and seat"
      >
        <div className="flex justify-center items-center h-64 text-red-500">
          {(error as Error)?.message || 'Seating plan not available.'}
        </div>
      </FormPage>
    );
  }

  const { seat, hall: assignedHall, floor, halls } = data;

  return (
    <FormPage
      title="My Seating Plan"
      description="View your assigned examination hall and seat"
    >
      <FormCard>
        <div className="p-4 mb-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            Your Seat: <strong>{seat}</strong>
          </p>
          <p className="text-xs text-blue-600">{floor}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {halls.map(hall => (
            <div key={hall.name} className="border rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span className="font-medium text-gray-700">{hall.name}</span>
                <span>
                  {hall.floor} · Cap: {hall.capacity} · {hall.type}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {hall.seats.map((s, i) => (
                  <div
                    key={i}
                    className={`h-7 rounded text-[10px] flex items-center justify-center font-medium border ${
                      s.status === 'allocated'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : s.status === 'reserved'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                    } ${s.seat === seat.split(' - Seat ')[1] && hall.name === assignedHall ? 'ring-2 ring-blue-500 font-bold' : ''}`}
                  >
                    {s.seat}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-100 inline-block border border-blue-200" />{' '}
                  Allocated
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-yellow-100 inline-block border border-yellow-200" />{' '}
                  Reserved
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gray-50 inline-block border border-gray-200" />{' '}
                  Available
                </span>
              </div>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
