import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { faculty, substitutions, timetableEntries } from '../../mocks';
import { timetableUrls } from '../../urls';
import '../../Timetable.css';

// Static prototype — assume the logged-in faculty is the first one.
const CURRENT_FACULTY = faculty[0];

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const myClasses = timetableEntries.filter(
      e => e.facultyId === CURRENT_FACULTY.id
    ).length;
    const mySubs = substitutions.filter(
      s => s.requestedBy === CURRENT_FACULTY.name
    ).length;
    const pending = substitutions.filter(
      s => s.status === 'Under Review'
    ).length;
    return { myClasses, mySubs, pending };
  }, []);

  return (
    <FormPage
      title="Faculty Dashboard"
      description={`Welcome, ${CURRENT_FACULTY.name}. Your weekly teaching overview.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Faculty', to: timetableUrls.faculty.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="ttm-stats-grid">
        <StatCard
          title="My Classes / Week"
          value={stats.myClasses}
          icon="menu_book"
          colorScheme="blue"
          subtitle="Assigned to you"
        />
        <StatCard
          title="My Substitutions"
          value={stats.mySubs}
          icon="edit_note"
          colorScheme="purple"
          subtitle="Raised by you"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Awaiting decision"
        />
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            label="View My Schedule"
            icon="calendar"
            onClick={() => navigate(timetableUrls.faculty.schedule)}
          />
          <Button
            label="Request Substitution"
            icon="plus"
            variant="outlined"
            onClick={() => navigate(timetableUrls.faculty.substitutions)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
