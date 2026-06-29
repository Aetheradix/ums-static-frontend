import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage } from 'shared/new-components';
import { scholarshipSchemes } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const TYPE_COLORS: Record<string, string> = {
  Central: '#2563eb',
  State: '#16a34a',
  University: '#be185d',
  Private: '#d97706',
  Minority: '#7c3aed',
};

export default function StudentSchemes() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = scholarshipSchemes.filter(s => {
    const matchType = !typeFilter || s.type === typeFilter;
    const matchCat =
      !catFilter ||
      s.category.some(c => c.toLowerCase().includes(catFilter.toLowerCase()));
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.portal.toLowerCase().includes(search.toLowerCase());
    return matchType && matchCat && matchSearch;
  });

  return (
    <FormPage
      title="Available Scholarship Schemes"
      description="Browse and apply for Central, State, University, Private and Minority scholarship schemes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Available Schemes' },
      ]}
    >
      {/* Filters */}
      <div className="dbt-filters-row" style={{ marginBottom: '1.25rem' }}>
        <input
          className="dbt-search-input"
          placeholder="Search schemes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="dbt-filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Central">Central</option>
          <option value="State">State</option>
          <option value="University">University</option>
          <option value="Private">Private</option>
          <option value="Minority">Minority</option>
        </select>
        <select
          className="dbt-filter-select"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="EWS">EWS</option>
          <option value="General">General</option>
          <option value="Minority">Minority</option>
        </select>
        <span
          style={{ fontSize: '0.813rem', color: '#6b7280', marginLeft: 'auto' }}
        >
          {filtered.length} scheme{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filtered.length === 0 && (
        <div className="dbt-empty">
          <i className="pi pi-inbox" />
          <p>No schemes match your filter criteria.</p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}
      >
        {filtered.map(scheme => (
          <div key={scheme.id} className="dbt-scheme-card">
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <span
                className="dbt-scheme-badge"
                style={{
                  background: TYPE_COLORS[scheme.type] + '1a',
                  color: TYPE_COLORS[scheme.type],
                }}
              >
                {scheme.type}
              </span>
              <span
                className={`dbt-status-pill ${scheme.status.toLowerCase().replace(' ', '-')}`}
              >
                {scheme.status}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '0.5rem',
                marginTop: '0.25rem',
                lineHeight: 1.4,
              }}
            >
              {scheme.name}
            </h3>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  padding: '0.5rem',
                  background: '#f9fafb',
                  borderRadius: 6,
                }}
              >
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Amount
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#16a34a',
                  }}
                >
                  ₹{scheme.amount.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  padding: '0.5rem',
                  background: '#f9fafb',
                  borderRadius: 6,
                }}
              >
                <p
                  style={{
                    fontSize: '0.625rem',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Last Date
                </p>
                <p
                  style={{
                    fontSize: '0.813rem',
                    fontWeight: 600,
                    color: scheme.status === 'Open' ? '#b91c1c' : '#6b7280',
                  }}
                >
                  {scheme.lastDate}
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
                lineHeight: 1.5,
              }}
            >
              <strong>Eligibility:</strong> {scheme.eligibility}
            </p>

            {/* Category tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.25rem',
                marginBottom: '0.875rem',
              }}
            >
              {scheme.category.map(c => (
                <span
                  key={c}
                  style={{
                    padding: '0.125rem 0.5rem',
                    background: '#f3f4f6',
                    borderRadius: 4,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}
                >
                  {c}
                </span>
              ))}
              <span
                style={{
                  padding: '0.125rem 0.5rem',
                  background: '#eff6ff',
                  borderRadius: 4,
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#1d4ed8',
                }}
              >
                {scheme.portal}
              </span>
            </div>

            <Button
              label={
                scheme.status === 'Open'
                  ? 'Apply Now'
                  : scheme.status === 'Upcoming'
                    ? 'Upcoming'
                    : 'Closed'
              }
              variant={scheme.status === 'Open' ? 'primary' : 'outlined'}
              size="small"
              icon={scheme.status === 'Open' ? 'arrow-right' : 'clock'}
              onClick={() =>
                scheme.status === 'Open' && navigate(dbtUrls.student.apply)
              }
              disabled={scheme.status !== 'Open'}
            />
          </div>
        ))}
      </div>
    </FormPage>
  );
}
