import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useGradeBoundariesQuery,
  useSaveGradeBoundariesMutation,
  useTriggerGradeCalculationMutation,
} from '../../../queries';
import { useState, useEffect } from 'react';

export function GradeCalculation() {
  const { sessionId } = useParams();
  const numericSessionId = Number(sessionId) || 0;

  const {
    data: boundaries,
    isLoading,
    isError,
    error,
  } = useGradeBoundariesQuery(numericSessionId);
  const saveMutation = useSaveGradeBoundariesMutation(numericSessionId);
  const triggerMutation = useTriggerGradeCalculationMutation(numericSessionId);

  const [localBoundaries, setLocalBoundaries] = useState<
    Examination.GradeBoundaryItem[]
  >([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (boundaries) {
      setLocalBoundaries(boundaries);
    }
  }, [boundaries]);

  const handleInputChange = (
    index: number,
    field: keyof Examination.GradeBoundaryItem,
    value: number | string
  ) => {
    const updated = [...localBoundaries];
    updated[index] = { ...updated[index], [field]: value };
    setLocalBoundaries(updated);
  };

  const handleSave = () => {
    saveMutation.mutate(localBoundaries, {
      onSuccess: () => {
        setIsEditMode(false);
      },
    });
  };

  const handleTrigger = () => {
    triggerMutation.mutate();
  };

  const errorMessage =
    error instanceof Error ? error.message : 'Failed to load grade boundaries';

  return (
    <FormPage
      title="Grade Calculation"
      description="Configure grade boundaries and calculate final grades"
    >
      <FormCard>
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            {!isEditMode && (
              <Button
                label="Edit Boundaries"
                variant="outlined"
                onClick={() => setIsEditMode(true)}
                disabled={isLoading}
              />
            )}
            <Button
              label={
                triggerMutation.isPending
                  ? 'Calculating...'
                  : 'Calculate Grades'
              }
              icon="calculator"
              onClick={handleTrigger}
              disabled={triggerMutation.isPending || isLoading || isEditMode}
            />
          </div>
        </div>
        {isError ? (
          <div className="text-red-600 p-4 bg-red-50 rounded border border-red-200">
            {errorMessage}
          </div>
        ) : (
          <div>
            <GridPanel
              title="Grade Boundaries Configuration"
              data={localBoundaries}
              loading={isLoading}
              columns={[
                { field: 'grade', header: 'Grade' },
                {
                  field: 'minScore',
                  header: 'Min Score (%)',
                  cell: (item: any, { rowIndex: idx }: { rowIndex: number }) =>
                    isEditMode ? (
                      <input
                        type="number"
                        className="border p-1 w-full rounded"
                        value={item.minScore}
                        onChange={e =>
                          handleInputChange(
                            idx,
                            'minScore',
                            Number(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <span>{item.minScore}</span>
                    ),
                },
                {
                  field: 'maxScore',
                  header: 'Max Score (%)',
                  cell: (item: any, { rowIndex: idx }: { rowIndex: number }) =>
                    isEditMode ? (
                      <input
                        type="number"
                        className="border p-1 w-full rounded"
                        value={item.maxScore}
                        onChange={e =>
                          handleInputChange(
                            idx,
                            'maxScore',
                            Number(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <span>{item.maxScore}</span>
                    ),
                },
                {
                  field: 'point',
                  header: 'Grade Point',
                  cell: (item: any, { rowIndex: idx }: { rowIndex: number }) =>
                    isEditMode ? (
                      <input
                        type="number"
                        className="border p-1 w-full rounded"
                        value={item.point}
                        onChange={e =>
                          handleInputChange(
                            idx,
                            'point',
                            Number(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <span>{item.point}</span>
                    ),
                },
              ]}
              toolbar={
                isEditMode ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      label="Cancel"
                      variant="outlined"
                      onClick={() => {
                        setLocalBoundaries(boundaries || []);
                        setIsEditMode(false);
                      }}
                    />
                    <Button
                      label="Save Boundaries"
                      icon="save"
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    />
                  </div>
                ) : undefined
              }
            />
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
