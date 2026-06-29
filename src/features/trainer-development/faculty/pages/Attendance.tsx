import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { trainingAttendance } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral'> = {
  'Present': 'approved',
  'Absent': 'rejected',
  'Late': 'pending',
  'Excused': 'neutral',
};

export default function MyAttendancePage() {
  const [data] = useState(trainingAttendance.filter(a => a.participantId === 'EMP-1042'));

  return (
    <FormPage
      title="My Attendance"
      description="Track your attendance records across all enrolled training sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Attendance' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            {
              field: 'session', header: 'Training Session',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827', fontWeight: 600 }}>{item.trainingTitle}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Date: {item.date}</span>
                </div>
              ),
            },
            { field: 'punchIn', header: 'Punch In' },
            { field: 'punchOut', header: 'Punch Out' },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status]} />
              ),
            },
            { field: 'remarks', header: 'Remarks' },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
