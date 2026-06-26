import { useParams } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  useEligibilityListQuery,
  useUpdateEligibilityStatusMutation,
} from '../../../queries';
import { useState, useEffect } from 'react';
import { Button } from 'shared/components/buttons';

export function EligibilityVerification() {
  const { sessionId } = useParams();
  const numericSessionId = Number(sessionId) || 0;

  const { data: eligibilityList, isLoading } =
    useEligibilityListQuery(numericSessionId);
  const saveMutation = useUpdateEligibilityStatusMutation(numericSessionId);

  const [eligibilityState, setEligibilityState] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (eligibilityList) {
      const initial: Record<number, boolean> = {};
      eligibilityList.forEach(item => {
        initial[item.id] = item.isEligible;
      });
      setEligibilityState(initial);
    }
  }, [eligibilityList]);

  const handleToggle = (id: number) => {
    setEligibilityState(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = () => {
    const payload = Object.entries(eligibilityState).map(
      ([id, isEligible]) => ({
        id: Number(id),
        isEligible,
      })
    );
    saveMutation.mutate(payload);
  };

  const columns = [
    { field: 'studentName', header: 'Student Name' },
    { field: 'rollNumber', header: 'Roll Number' },
    { field: 'attendancePercentage', header: 'Attendance %' },
    {
      field: 'feePaid',
      header: 'Fee Paid',
      cell: (item: any) => (item.feePaid ? 'Yes' : 'No'),
    },
    {
      field: 'prerequisitesMet',
      header: 'Prerequisites',
      cell: (item: any) => (item.prerequisitesMet ? 'Met' : 'Pending'),
    },
    {
      field: 'isEligible',
      header: 'Final Eligibility',
      cell: (item: any) => {
        const isEligible = eligibilityState[item.id] ?? item.isEligible;
        return (
          <button
            onClick={() => handleToggle(item.id)}
            className="cursor-pointer border-none bg-transparent p-0 m-0"
            title="Click to toggle eligibility"
          >
            <StatusBadge
              label={isEligible ? 'Eligible' : 'Not Eligible'}
              variant={isEligible ? 'approved' : 'rejected'}
            />
          </button>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Eligibility Verification"
      description="Verify and override student eligibility for the exam session"
    >
      <FormCard>
        <GridPanel
          title="Student Eligibility List"
          data={eligibilityList || []}
          columns={columns as any}
          loading={isLoading}
          toolbar={
            <Button
              label="Save Eligibility"
              icon="save"
              onClick={handleSave}
              disabled={
                !eligibilityList ||
                eligibilityList.length === 0 ||
                saveMutation.isPending
              }
            />
          }
        />
      </FormCard>
    </FormPage>
  );
}
