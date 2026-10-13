import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { crumbs, useFaculty } from '../../components/hooks';
import { DeptSwitcher, UniqueIdChip } from '../../components/ui';
import { deptName } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import { applicationVariant, formatDate, makeUniqueId } from '../../utils';
import { vfUrls } from '../../urls';

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const dept = useVisitingFacultyStore(s => s.currentDept);
  const applications = useVisitingFacultyStore(s => s.applications);
  const logs = useVisitingFacultyStore(s => s.logs);
  const bills = useVisitingFacultyStore(s => s.bills);
  const faculty = useFaculty();

  const mine = applications.filter(a => a.department === dept);
  const count = (...statuses: Application['status'][]) =>
    mine.filter(a => statuses.includes(a.status)).length;
  const pendingLogs = logs.filter(
    l => l.department === dept && l.status === 'Pending'
  ).length;
  const joined = faculty.filter(f => f.departments.includes(dept)).length;
  const billsAtFinance = bills.filter(
    b =>
      b.department === dept &&
      ['Sent to Finance', 'Under Verification'].includes(b.status)
  ).length;

  return (
    <FormPage
      title={`UTD Department — ${dept}`}
      description={deptName(dept)}
      breadcrumbs={crumbs('department', 'Dashboard')}
      headerAction={<DeptSwitcher />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="New Applications"
          value={count('Submitted')}
          icon="inbox"
          colorScheme="blue"
          subtitle="Awaiting verification"
        />
        <StatCard
          title="Scrutiny / Interview"
          value={count('In Scrutiny List', 'Interview Scheduled')}
          icon="users"
          colorScheme="purple"
          subtitle="Verified candidates"
        />
        <StatCard
          title="Merit List"
          value={count(
            'In Merit List',
            'Returned by Head Office',
            'Pending Approval'
          )}
          icon="list"
          colorScheme="amber"
          subtitle="Finalised & forwarded"
        />
        <StatCard
          title="Joined Faculty"
          value={joined}
          icon="id-card"
          colorScheme="green"
          subtitle="Active visiting faculty"
        />
        <StatCard
          title="Mobile Entries Pending"
          value={pendingLogs}
          icon="mobile"
          colorScheme="orange"
          subtitle="Attendance & lectures to verify"
        />
        <StatCard
          title="Bills at Finance"
          value={billsAtFinance}
          icon="wallet"
          colorScheme="teal"
          subtitle="Sent, awaiting payment"
        />
        <StatCard
          title="Rejected"
          value={count('Rejected')}
          icon="times-circle"
          colorScheme="red"
          subtitle="Closed at verification"
        />
        <StatCard
          title="Not Selected"
          value={count('Not Selected')}
          icon="user-minus"
          colorScheme="pink"
          subtitle="After interview"
        />
      </div>

      <FormCard
        title="Latest Applications"
        subtitle="From the public registration forum"
        icon="inbox"
        headerAction={
          <Button
            label="All Applications"
            variant="outlined"
            size="small"
            onClick={() => navigate(vfUrls.department.applications)}
          />
        }
      >
        <GridPanel
          data={[...mine]
            .sort((a, b) => b.submittedOn.localeCompare(a.submittedOn))
            .slice(0, 6)}
          columns={[
            { field: 'applicationNo', header: 'Application No.' },
            {
              header: 'Unique ID',
              cell: (a: Application) => (
                <UniqueIdChip value={makeUniqueId(a.fullName, a.pan)} />
              ),
            },
            { field: 'fullName', header: 'Name' },
            {
              header: 'Submitted',
              cell: (a: Application) => (
                <span>{formatDate(a.submittedOn)}</span>
              ),
            },
            {
              header: 'Status',
              cell: (a: Application) => (
                <StatusBadge
                  label={a.status}
                  variant={applicationVariant(a.status)}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
