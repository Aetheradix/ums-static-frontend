import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useExamCentersQuery, useDutyTypesQuery } from '../../../queries';
import { ToastService } from 'services';

export default function DutyAllocation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    data: centers,
    isError: isCentersError,
    isLoading: isCentersLoading,
  } = useExamCentersQuery();
  const {
    data: duties,
    isError: isDutiesError,
    isLoading: isDutiesLoading,
  } = useDutyTypesQuery();
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);

  if (isCentersError || isDutiesError) {
    return (
      <FormPage
        title="Duty Allocation"
        description={`Assign invigilation duties for session #${sessionId}`}
      >
        <div className="flex items-center justify-center h-64 text-red-500">
          Failed to load data for duty allocation
        </div>
      </FormPage>
    );
  }

  if (isCentersLoading || isDutiesLoading) {
    return (
      <FormPage
        title="Duty Allocation"
        description={`Assign invigilation duties for session #${sessionId}`}
      >
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading...
        </div>
      </FormPage>
    );
  }

  const handleAllocate = () => {
    ToastService.success('Duty allocation saved successfully.');
  };

  const assignments =
    selectedCenter && duties
      ? duties.map(d => ({
          id: d.id,
          dutyName: d.name,
          centerName:
            centers?.find(c => c.id === selectedCenter)?.centerName ?? '',
          allocatedCount: Math.floor(Math.random() * 5) + 1,
          maxPerSession: d.maxPerSession ?? '-',
        }))
      : [];

  return (
    <FormPage
      title="Duty Allocation"
      description={`Assign invigilation duties for session #${sessionId}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <FormCard title="Centers" icon="location_city">
          <div className="space-y-2">
            {(centers ?? []).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCenter(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  selectedCenter === c.id
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {c.centerName}
              </button>
            ))}
            {(centers ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No centers available.</p>
            )}
          </div>
        </FormCard>
        <div className="lg:col-span-3">
          <FormCard
            title={
              selectedCenter
                ? `Duty Assignments - ${centers?.find(c => c.id === selectedCenter)?.centerName ?? ''}`
                : 'Select a Center'
            }
          >
            {selectedCenter ? (
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    label="Save Allocation"
                    icon="save"
                    onClick={handleAllocate}
                  />
                </div>
                <GridPanel
                  data={assignments}
                  columns={[
                    { field: 'dutyName', header: 'Duty Type' },
                    { field: 'centerName', header: 'Center' },
                    { field: 'allocatedCount', header: 'Allocated' },
                    { field: 'maxPerSession', header: 'Max Per Session' },
                  ]}
                />
              </>
            ) : (
              <p className="text-sm text-gray-400 p-4">
                Select a center from the left panel to manage duty allocations.
              </p>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
