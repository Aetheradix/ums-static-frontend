import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function CellApplications() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = studentApplications.filter(a => {
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchCat = !categoryFilter || a.category === categoryFilter;
    const matchSearch =
      !search ||
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.appNo.toLowerCase().includes(search.toLowerCase()) ||
      a.enrollmentNo.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  return (
    <FormPage
      title="Application Management"
      description="View, filter and manage all scholarship applications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Applications' },
      ]}
    >
      {/* Filters */}
      <div className="dbt-filters-row">
        <input
          className="dbt-search-input"
          placeholder="Search by name, app no., enrollment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="dbt-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {[
            'Draft',
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
        <select
          className="dbt-filter-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {['SC', 'ST', 'OBC', 'EWS', 'General'].map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span
          style={{ fontSize: '0.813rem', color: '#6b7280', marginLeft: 'auto' }}
        >
          {filtered.length} records
        </span>
      </div>

      <FormCard title={`Applications (${filtered.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>App No.</th>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Course</th>
                <th>Category</th>
                <th>Scheme</th>
                <th>Amount</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr key={app.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{app.appNo}</td>
                  <td style={{ fontWeight: 600 }}>{app.studentName}</td>
                  <td>{app.enrollmentNo}</td>
                  <td>{app.course}</td>
                  <td>
                    <span
                      className="dbt-status-pill"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      {app.category}
                    </span>
                  </td>
                  <td
                    style={{
                      maxWidth: 180,
                      wordBreak: 'break-word',
                      fontSize: '0.75rem',
                    }}
                  >
                    {app.schemeName.slice(0, 30)}…
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ₹{app.amount.toLocaleString()}
                  </td>
                  <td>{app.submittedDate}</td>
                  <td>
                    <StatusBadge
                      label={app.status}
                      variant={
                        app.status === 'Credited'
                          ? 'approved'
                          : app.status === 'Rejected'
                            ? 'rejected'
                            : 'pending'
                      }
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => navigate(dbtUrls.cell.applicationDetail)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #3b82f6',
                          borderRadius: 4,
                          background: '#eff6ff',
                          color: '#2563eb',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                      {app.status === 'Teacher Verified' && (
                        <button
                          type="button"
                          onClick={() => navigate(dbtUrls.cell.finalApproval)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #16a34a',
                            borderRadius: 4,
                            background: '#f0fdf4',
                            color: '#15803d',
                            fontSize: '0.688rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
