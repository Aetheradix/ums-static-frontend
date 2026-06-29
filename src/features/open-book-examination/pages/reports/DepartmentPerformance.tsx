import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockResults, mockUsers } from '../../data';

export default function DepartmentPerformanceReport() {
  const departments = [
    ...new Set(
      mockUsers.filter(u => u.departmentName).map(u => u.departmentName)
    ),
  ];
  const deptData = departments.map(dept => {
    const deptResults = mockResults.filter(r => {
      const student = mockUsers.find(u => u.id === r.studentId);
      return student?.departmentName === dept;
    });
    const passed = deptResults.filter(r => r.isPassed).length;
    return {
      department: dept,
      total: deptResults.length,
      passed,
      failed: deptResults.length - passed,
      passPct:
        deptResults.length > 0
          ? Math.round((passed / deptResults.length) * 100)
          : 0,
    };
  });

  return (
    <FormPage
      title="Department Performance"
      description="Performance analysis by department"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {deptData.map(d => (
          <StatCard
            key={d.department}
            title={d.department ?? ''}
            value={`${d.passPct}%`}
            icon="school"
            colorScheme={
              d.passPct >= 75 ? 'green' : d.passPct >= 50 ? 'orange' : 'red'
            }
          />
        ))}
      </div>
      <GridPanel
        title="Department-wise Performance"
        data={deptData}
        columns={[
          { field: 'department', header: 'Department' },
          { field: 'total', header: 'Total Students' },
          {
            field: 'passed',
            header: 'Pass',
            cell: row => <span className="text-green-600">{row.passed}</span>,
          },
          {
            field: 'failed',
            header: 'Fail',
            cell: row => <span className="text-red-600">{row.failed}</span>,
          },
          {
            field: 'passPct',
            header: 'Pass %',
            cell: row => <span className="font-bold">{row.passPct}%</span>,
          },
        ]}
        dataKey="department"
        pagination={{ rows: 10 }}
        searchBox
      />
    </FormPage>
  );
}
