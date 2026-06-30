import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function FinanceReports() {
  const [reportType, setReportType] = useState('utilization');

  const handleDownload = () => {
    ToastService.success('Financial Report generated. Downloading PDF...');
  };

  return (
    <FormPage
      title="Financial Reports"
      description="Generate and export utilization certificates, outstanding fee reports, and DBT success sheets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'Reports' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Report Parameters">
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}
            >
              Report Type
            </label>
            <select
              className="dbt-filter-select"
              style={{ width: '100%', marginTop: 4, height: 38 }}
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="utilization">
                Fund Utilization Certificate (UC)
              </option>
              <option value="dbt_success">Successful DBT Credit List</option>
              <option value="outstanding_offset">
                Post-Scholarship Fee Outstanding list
              </option>
              <option value="bounced_refund">Bounced DBT Refund Ledger</option>
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Academic Year
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
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
                Scheme Category
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option value="">All Categories</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Button
              label="Generate & Download PDF"
              variant="primary"
              icon="file-pdf"
              onClick={handleDownload}
            />
            <Button
              label="Export to Excel"
              variant="outlined"
              icon="file-excel"
              onClick={() => ToastService.success('Excel file exported.')}
            />
          </div>
        </FormCard>

        <FormCard title="Report Explanation">
          {reportType === 'utilization' && (
            <div>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Fund Utilization Certificate (UC)
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                Generates a formal Utilization Certificate (Format GFR 12-C) to
                be submitted to state/central government departments showing
                total grants received, utilized, and unspent balances.
              </p>
            </div>
          )}
          {reportType === 'dbt_success' && (
            <div>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Successful DBT Credit List
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                Lists all student accounts that have been successfully credited
                via Aadhaar Payment Bridge System (APBS) along with Bank UTR
                reference numbers.
              </p>
            </div>
          )}
          {reportType === 'outstanding_offset' && (
            <div>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Post-Scholarship Fee Outstanding
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                Generates a list of students whose academic fee accounts are
                still outstanding after applying the scholarship amount offset.
              </p>
            </div>
          )}
          {reportType === 'bounced_refund' && (
            <div>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Bounced DBT Refund Ledger
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                Contains transactions that bounced due to account dormancy,
                incorrect seeding, or limit issues, which need to be processed
                for refunds or alternate account credits.
              </p>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
