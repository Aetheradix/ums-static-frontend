import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { useScope } from '../../components/scope';
import { crumbs, useFaculty } from '../../components/hooks';
import { ApplicationTypeBadge, UniqueIdChip } from '../../components/ui';
import { deptName } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Application } from '../../types';
import {
  FINANCE_PENDING,
  applicationVariant,
  formatDate,
  makeUniqueId,
} from '../../utils';
import { vfUrls } from '../../urls';

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const scope = useScope();
  const { dept } = scope;
  const applications = useVisitingFacultyStore(s => s.applications);
  const logs = useVisitingFacultyStore(s => s.logs);
  const bills = useVisitingFacultyStore(s => s.bills);
  const faculty = useFaculty();

  const mine = applications.filter(scope.appInScope);
  const count = (...statuses: Application['status'][]) =>
    mine.filter(a => statuses.includes(a.status)).length;
  const pendingLogs = logs.filter(
    l => scope.logInScope(l) && l.status === 'Pending'
  ).length;
  const joined = faculty.filter(scope.facultyInScope).length;
  const scopedBills = bills.filter(scope.billInScope);
  const billsWithMe = scopedBills.filter(b =>
    scope.isHod
      ? ['Prepared', 'Returned by UTD'].includes(b.status)
      : b.status === 'Sent to UTD'
  ).length;
  const billsAtFinance = bills.filter(
    b =>
      scope.billInScope(b) &&
      (FINANCE_PENDING.includes(b.status) ||
        b.status === 'Pending Registrar & VC Approval')
  ).length;

  return (
    <FormPage
      title={scope.title}
      description={
        scope.isHod
          ? `${deptName(dept)} — ${scope.branch}`
          : `${deptName(dept)} — all branch HODs`
      }
      breadcrumbs={crumbs(scope.login, 'Dashboard')}
      headerAction={<scope.Switcher />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          title={scope.isHod ? 'Merit List' : 'Merit Lists to Review'}
          value={
            scope.isHod
              ? count('In Merit List')
              : count('Forwarded to UTD', 'Returned by Registrar & VC')
          }
          icon="list"
          colorScheme="amber"
          subtitle={
            scope.isHod
              ? 'Ready to forward to the UTD Department'
              : 'Forwarded by HODs — send to Registrar & VC'
          }
        />
        <StatCard
          title="Appointed Faculty"
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
          title={scope.isHod ? 'Bills to Send' : 'Bills to Review'}
          value={billsWithMe}
          icon="file-edit"
          colorScheme="indigo"
          subtitle={
            scope.isHod
              ? 'Prepared or returned — send to UTD'
              : 'From HODs — forward to Finance'
          }
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
          scope.isHod ? (
            <Button
              label="All Applications"
              variant="outlined"
              size="small"
              onClick={() => navigate(vfUrls.hod.applications)}
            />
          ) : undefined
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
              header: 'Faculty Type',
              cell: (a: Application) => <ApplicationTypeBadge app={a} />,
            },
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
