import { useParams } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { useExamCentersQuery, useHallsQuery } from '../queries';

export default function SeatingPlan() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: centers } = useExamCentersQuery();
  const firstCenterId = (centers ?? [])[0]?.id ?? 0;
  const { data: halls } = useHallsQuery(firstCenterId);

  return (
    <FormPage
      title="Seating Plan"
      description={`Seating arrangement for session #${sessionId}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(halls ?? []).length > 0 ? (
          (halls ?? []).map(hall => (
            <FormCard key={hall.id} title={hall.hallName} icon="meeting_room">
              <div className="p-2">
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Floor: {hall.floor ?? 'N/A'}</span>
                  <span>Capacity: {hall.capacity}</span>
                  <span>Type: {hall.hallType ?? 'N/A'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: Math.min(hall.capacity, 30) }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded text-[10px] flex items-center justify-center font-medium ${
                          i < Math.floor(hall.capacity * 0.6)
                            ? 'bg-blue-100 text-blue-700'
                            : i < Math.floor(hall.capacity * 0.85)
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                        title={
                          i < Math.floor(hall.capacity * 0.6)
                            ? 'Allocated'
                            : i < Math.floor(hall.capacity * 0.85)
                              ? 'Reserved'
                              : 'Available'
                        }
                      >
                        S{i + 1}
                      </div>
                    )
                  )}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-100 inline-block" />{' '}
                    Allocated
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-yellow-100 inline-block" />{' '}
                    Reserved
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-100 inline-block" />{' '}
                    Available
                  </span>
                </div>
              </div>
            </FormCard>
          ))
        ) : (
          <FormCard>
            <p className="text-sm text-gray-400 p-4">
              No halls found. Please configure halls for a center first.
            </p>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
