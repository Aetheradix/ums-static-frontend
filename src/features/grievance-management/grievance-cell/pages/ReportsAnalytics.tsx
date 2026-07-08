import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import '../../Grievance.css';

type AnalyticsTab = 'ugc' | 'aicte' | 'naac' | 'nirf';

export default function GrievanceCellReportsAnalytics() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('ugc');

  const mockExport = (format: string) => {
    ToastService.success(
      `Exporting institutional compliance report as ${format}...`
    );
  };

  return (
    <FormPage
      title="Compliance & Accreditation Reports"
      description="Generate standard reports required for UGC e-Samadhan, AICTE, NAAC criteria 5, and NIRF disclosures."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Reports & Analytics' },
      ]}
    >
      <div className="flex gap-2 mb-4">
        <Button
          label="Export PDF"
          icon="file-pdf"
          variant="outlined"
          size="small"
          onClick={() => mockExport('PDF')}
        />
        <Button
          label="Export Excel"
          icon="file-excel"
          variant="outlined"
          size="small"
          onClick={() => mockExport('Excel')}
        />
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        {[
          { key: 'ugc', label: 'UGC e-Samadhan Report' },
          { key: 'aicte', label: 'AICTE Compliance' },
          { key: 'naac', label: 'NAAC Criteria 5.1.5' },
          { key: 'nirf', label: 'NIRF Public Disclosure' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'ugc' && (
        <FormCard title="UGC e-Samadhan Statutory Disclosures — DAVV Indore">
          <p className="text-xs text-slate-500 mb-4">
            Under UGC Grievance Redressal Regulations 2019, universities must
            declare category-wise totals periodically.
          </p>
          <table className="grv-table">
            <thead>
              <tr>
                <th>UGC Code</th>
                <th>Category Heading</th>
                <th>Total Petitions</th>
                <th>Resolved within 15 Days</th>
                <th>Escalated SGRC Hearings</th>
                <th>Unresolved / Pending</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono font-bold">UGC/ACAD/01</td>
                <td>Academic & Admission</td>
                <td>145</td>
                <td>140</td>
                <td>5</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="font-mono font-bold">UGC/FIN/02</td>
                <td>Financial & Refund Discrepancies</td>
                <td>56</td>
                <td>50</td>
                <td>4</td>
                <td>2</td>
              </tr>
              <tr>
                <td className="font-mono font-bold">UGC/SAFE/03</td>
                <td>Safety / Anti-Ragging Cell</td>
                <td>3</td>
                <td>3</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {activeTab === 'aicte' && (
        <FormCard title="AICTE Technical Campus Compliance Dashboard">
          <table className="grv-table">
            <thead>
              <tr>
                <th>AICTE Standard</th>
                <th>Requirement Metric</th>
                <th>DAVV SCSIT Status</th>
                <th>Accreditation Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Statutory SGRC</td>
                <td>Yes (5 Member Committee constituted)</td>
                <td>
                  <span className="grv-status-pill approved">COMPLIANT</span>
                </td>
                <td>A+</td>
              </tr>
              <tr>
                <td>OMBUDSPERSON</td>
                <td>Prof. S.K. Chaudhary appointed</td>
                <td>
                  <span className="grv-status-pill approved">COMPLIANT</span>
                </td>
                <td>A+</td>
              </tr>
              <tr>
                <td>Online Grievance Mechanism</td>
                <td>Available (Static Mock Portal ERP active)</td>
                <td>
                  <span className="grv-status-pill approved">COMPLIANT</span>
                </td>
                <td>A+</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {activeTab === 'naac' && (
        <FormCard title="NAAC Criteria 5.1.5 Data Verification & Validation (DVV)">
          <div className="grv-alert info mb-4">
            <i className="pi pi-info-circle"></i>
            <span>
              This dashboard exports directly to the NAAC SSR portal format.
            </span>
          </div>
          <table className="grv-table">
            <thead>
              <tr>
                <th>Metric ID</th>
                <th>NAAC Key Indicator</th>
                <th>Year</th>
                <th>Total Grievances Filed</th>
                <th>Avg Resolution Time (Days)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5.1.5.1</td>
                <td>
                  Implementation of guidelines of statutory/regulatory bodies
                </td>
                <td>2025-26</td>
                <td>248 Cases</td>
                <td>2.4 Days</td>
              </tr>
              <tr>
                <td>5.1.5.2</td>
                <td>Proof of constitution of committees / SGRC / ARC / ICC</td>
                <td>2025-26</td>
                <td>Constitution Document attached</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}

      {activeTab === 'nirf' && (
        <FormCard title="NIRF Public Disclosures Section 9">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Disclosed Parameter</th>
                <th>Total Lodged</th>
                <th>Avg Grievance Redressal window</th>
                <th>Academic Year Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Student Grievance Redressal Ratio</td>
                <td>98.2%</td>
                <td>3.2 Days</td>
                <td>&gt; 95% Compliant</td>
              </tr>
            </tbody>
          </table>
        </FormCard>
      )}
    </FormPage>
  );
}

const grvUrls = {
  portal: '/grievance-management',
  cell: {
    portal: '/grievance-management/grievance-cell',
    dashboard: '/grievance-management/grievance-cell/dashboard',
    management: '/grievance-management/grievance-cell/complaint-management',
    assignment: '/grievance-management/grievance-cell/assignment',
    sla: '/grievance-monitoring/cell/sla-monitoring',
    committees: '/grievance-management/grievance-cell/committees',
    reports: '/grievance-management/grievance-cell/reports',
  },
};
