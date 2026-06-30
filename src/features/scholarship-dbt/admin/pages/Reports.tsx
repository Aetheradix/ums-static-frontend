import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminReports() {
  const [district, setDistrict] = useState('');
  const [course, setCourse] = useState('');

  const handleGenerate = () => {
    ToastService.success('Report compiled successfully. Exporting PDF...');
  };

  return (
    <FormPage
      title="Admin Consolidated Reports"
      description="Compile complex reports by district, category, department and gender."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Reports' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Report Compilation Settings">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Target District / State Domicile
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={district}
                onChange={e => setDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                <option value="Indore">Indore</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Dhar">Dhar</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Department / College
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={course}
                onChange={e => setCourse(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="CS">School of Computer Science</option>
                <option value="ME">School of Engineering</option>
                <option value="MGT">School of Management</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <Button
                label="Generate PDF Report"
                variant="primary"
                onClick={handleGenerate}
              />
              <Button
                label="Export spreadsheet"
                variant="outlined"
                onClick={() => ToastService.success('Excel Sheet exported.')}
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Consolidated Summary Notes">
          <p
            style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}
          >
            Multi-dimension report compiler
          </p>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            Use this compiler to create aggregated summaries of total
            applicants, total approved, total synced, and overall disbursements
            sorted by District, Department, Gender, Category, or Scheme.
          </p>
        </FormCard>
      </div>
    </FormPage>
  );
}
