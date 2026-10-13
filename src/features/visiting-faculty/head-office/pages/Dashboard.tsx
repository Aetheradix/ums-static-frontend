import { FormCard, FormPage, GridPanel, StatCard } from 'shared/new-components';
import { crumbs, useFaculty } from '../../components/hooks';
import { DEPARTMENTS } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import { inr } from '../../utils';

export default function HeadOfficeDashboard() {
  const applications = useVisitingFacultyStore(s => s.applications);
  const bills = useVisitingFacultyStore(s => s.bills);
  const faculty = useFaculty();

  const pending = applications.filter(
    a => a.status === 'Pending Approval'
  ).length;
  const paid = bills.reduce((s, b) => s + (b.paidOn ? (b.payable ?? 0) : 0), 0);
  const stopped = bills.reduce(
    (s, b) => s + (b.paidOn ? (b.notPayable ?? 0) : 0),
    0
  );

  const byDept = DEPARTMENTS.map(d => {
    const mine = applications.filter(a => a.department === d.code);
    return {
      code: d.code,
      name: d.name,
      applications: mine.length,
      inProcess: mine.filter(
        a => !['Joined', 'Rejected', 'Not Selected'].includes(a.status)
      ).length,
      pending: mine.filter(a => a.status === 'Pending Approval').length,
      joined: faculty.filter(f => f.departments.includes(d.code)).length,
    };
  });

  return (
    <FormPage
      title="Head Office — Visiting Faculty"
      description="University-wide view of visiting faculty joining and payment."
      breadcrumbs={crumbs('headOffice', 'Dashboard')}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Awaiting Approval"
          value={pending}
          icon="inbox"
          colorScheme="amber"
          subtitle="Merit list candidates"
        />
        <StatCard
          title="Visiting Faculty"
          value={faculty.length}
          icon="id-card"
          colorScheme="green"
          subtitle="Unique IDs issued"
        />
        <StatCard
          title="Paid to Date"
          value={inr(paid)}
          icon="wallet"
          colorScheme="blue"
        />
        <StatCard
          title="Stopped by Limit"
          value={inr(stopped)}
          icon="shield"
          colorScheme="red"
          subtitle="Not Payable above the cap"
        />
      </div>
      <FormCard title="Department-wise Status" icon="building">
        <GridPanel
          data={byDept}
          columns={[
            { field: 'code', header: 'UTD' },
            { field: 'name', header: 'Department' },
            { field: 'applications', header: 'Applications' },
            { field: 'inProcess', header: 'In Process' },
            { field: 'pending', header: 'Awaiting Approval' },
            { field: 'joined', header: 'Joined Faculty' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
