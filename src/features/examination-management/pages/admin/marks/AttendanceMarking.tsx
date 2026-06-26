import { useParams } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  useAttendanceRollCallQuery,
  useSaveAttendanceMutation,
} from '../../../queries';
import { useState, useEffect } from 'react';
import { Button } from 'shared/components/buttons';

export function AttendanceMarking() {
  const { sessionId } = useParams();
  const numericSessionId = Number(sessionId) || 0;

  const { data: rollCall, isLoading } =
    useAttendanceRollCallQuery(numericSessionId);
  const saveMutation = useSaveAttendanceMutation(numericSessionId);

  const [attendanceState, setAttendanceState] = useState<
    Record<number, 'Present' | 'Absent'>
  >({});

  useEffect(() => {
    if (rollCall) {
      const initial: Record<number, 'Present' | 'Absent'> = {};
      rollCall.forEach(item => {
        initial[item.id] = item.status;
      });
      setAttendanceState(initial);
    }
  }, [rollCall]);

  const handleToggle = (id: number) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSave = () => {
    const payload = Object.entries(attendanceState).map(([id, status]) => ({
      id: Number(id),
      status,
    }));
    saveMutation.mutate(payload);
  };

  const columns = [
    { field: 'studentName', header: 'Student Name' },
    { field: 'rollNumber', header: 'Roll Number' },
    { field: 'subjectCode', header: 'Subject Code' },
    {
      field: 'status',
      header: 'Status',
      cell: (item: any) => {
        const status = attendanceState[item.id] ?? item.status;
        const isPresent = status === 'Present';
        return (
          <button
            onClick={() => handleToggle(item.id)}
            className="cursor-pointer border-none bg-transparent p-0 m-0"
            title="Click to toggle attendance"
          >
            <StatusBadge
              label={isPresent ? 'Present' : 'Absent'}
              variant={isPresent ? 'approved' : 'rejected'}
            />
          </button>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Attendance Marking"
      description="Mark student attendance for the exam session"
    >
      <FormCard>
        <GridPanel
          title="Student Roll Call"
          data={rollCall || []}
          columns={columns as any}
          loading={isLoading}
          toolbar={
            <Button
              label="Save Roll Call"
              icon="save"
              onClick={handleSave}
              disabled={
                saveMutation.isPending || !rollCall || rollCall.length === 0
              }
            />
          }
        />
      </FormCard>
    </FormPage>
  );
}
