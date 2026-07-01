import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { cases, hearings } from '../../mocks';
import { legalUrls } from '../../urls';
import '../../LegalCase.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      total: cases.length,
      pending: cases.filter(c => c.status === 'Pending').length,
      hearings: hearings.length,
    }),
    []
  );

  return (
    <FormPage
      title="Data Entry Dashboard"
      description="Overview of the cases and hearings maintained by the legal cell."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Data Entry Operator', to: legalUrls.dataEntry.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="lcm-stats-grid">
        <StatCard
          title="Total Cases"
          value={stats.total}
          icon="gavel"
          colorScheme="blue"
          subtitle="In the register"
        />
        <StatCard
          title="Pending Cases"
          value={stats.pending}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Awaiting hearing / judgment"
        />
        <StatCard
          title="Hearings Recorded"
          value={stats.hearings}
          icon="event"
          colorScheme="purple"
          subtitle="Across all cases"
        />
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            label="Register New Case"
            icon="plus"
            onClick={() => navigate(legalUrls.dataEntry.caseNew)}
          />
          <Button
            label="View Case Register"
            icon="list"
            variant="outlined"
            onClick={() => navigate(legalUrls.dataEntry.cases)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
