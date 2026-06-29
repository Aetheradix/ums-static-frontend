import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { scholarshipSchemes, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function CellReports() {
  const [scheme, setScheme] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const handleGenerate = () => {
    ToastService.success('Report generated successfully. Downloading PDF...');
  };

  const handleExcel = () => {
    ToastService.success('Report generated successfully. Downloading Excel...');
  };

  const filtered = studentApplications.filter(a => {
    if (scheme && a.schemeId !== scheme) return false;
    if (category && a.category !== category) return false;
    if (status && a.status !== status) return false;
    return true;
  });

  return (
    <FormPage
      title="Scholarship Cell Reports"
      description="Generate comprehensive reports by scheme, category, department and status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Reports' },
      ]}
    >
      <FormCard title="Generate Reports Filter" className="mb-4">
        <div className="dbt-filters-row">
          <select
            className="dbt-filter-select"
            value={scheme}
            onChange={e => setScheme(e.target.value)}
          >
            <option value="">All Schemes</option>
            {scholarshipSchemes.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="dbt-filter-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {['SC', 'ST', 'OBC', 'EWS', 'General'].map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="dbt-filter-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {[
              'Submitted',
              'Teacher Verified',
              'Cell Verified',
              'Finance Verified',
              'Admin Approved',
              'Govt Synced',
              'DBT Processed',
              'Credited',
              'Rejected',
              'On Hold',
            ].map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button
            label="Search / View"
            variant="primary"
            icon="search"
            onClick={() => {}}
          />
          <Button
            label="Export PDF"
            variant="outlined"
            icon="file-pdf"
            onClick={handleGenerate}
          />
          <Button
            label="Export Excel"
            variant="outlined"
            icon="file-excel"
            onClick={handleExcel}
          />
        </div>
      </FormCard>

      <FormCard title={`Preview Report Data (${filtered.length} records)`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>App No.</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Category</th>
                <th>Scheme</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 700 }}>{app.appNo}</td>
                  <td>{app.studentName}</td>
                  <td>
                    {app.course} {app.branch}
                  </td>
                  <td>{app.category}</td>
                  <td>{app.schemeName}</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{app.amount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`dbt-status-pill ${app.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#9ca3af',
                    }}
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
