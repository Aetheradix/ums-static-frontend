import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const APP = studentApplications[0];

export default function StudentPreview() {
  const SECTIONS = [
    {
      title: 'Personal Details',
      fields: [
        ['Full Name', APP.studentName],
        ['Enrollment No.', APP.enrollmentNo],
        ['Mobile', '9876543210'],
        ['Email', 'priya.sharma@davv.ac.in'],
        ['Category', APP.category],
        ['Date of Birth', '05 Mar 2002'],
      ],
    },
    {
      title: 'Admission & Course Details',
      fields: [
        ['Course', APP.course],
        ['Branch', APP.branch],
        ['Semester', APP.semester],
        ['Department', APP.department],
        ['Hosteller / Day Scholar', 'Day Scholar'],
        ['Academic Year', APP.academicYear],
      ],
    },
    {
      title: 'Academic Details',
      fields: [
        ['CGPA', String(APP.cgpa)],
        ['Attendance %', `${APP.attendancePct}%`],
        ['Previous Class', '12th (MP Board)'],
        ['Percentage', '88.5%'],
        ['Passing Year', '2023'],
        ['Backlogs', 'None'],
      ],
    },
    {
      title: 'Financial Details',
      fields: [
        ['Annual Family Income', `₹${APP.annualIncome.toLocaleString()}`],
        ['Disability', 'No'],
        ['Minority', 'No'],
        ['Previous Scholarship', 'No'],
      ],
    },
    {
      title: 'Bank & Aadhaar Details',
      fields: [
        ['Bank Name', APP.bankName],
        ['Account Number', 'XXXXXXXX12'],
        ['IFSC Code', APP.ifsc],
        ['NPCI Seeded', APP.npciSeeded ? 'Yes ✓' : 'No'],
        ['Aadhaar (Masked)', '2345 XXXX XXXX 7890'],
        ['Verification', 'Verified ✓'],
      ],
    },
    {
      title: 'Guardian Details',
      fields: [
        ['Guardian Name', 'Ramesh Sharma'],
        ['Relation', 'Father'],
        ['Mobile', '98765 01234'],
        ['Occupation', 'Farmer'],
      ],
    },
  ];

  return (
    <FormPage
      title="Application Preview"
      description="Review your complete scholarship application before final submission."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Application Preview' },
      ]}
    >
      {/* Application Header */}
      <FormCard className="mb-4">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Application Reference
            </p>
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 800,
                color: '#111827',
              }}
            >
              {APP.appNo}
            </p>
            <p style={{ fontSize: '0.813rem', color: '#6b7280', marginTop: 2 }}>
              {APP.schemeName}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              className="dbt-status-pill"
              style={{
                background: '#dbeafe',
                color: '#1d4ed8',
                fontSize: '0.75rem',
                padding: '0.25rem 0.875rem',
              }}
            >
              {APP.status}
            </span>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              Submitted: {APP.submittedDate}
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#16a34a',
                marginTop: '0.25rem',
              }}
            >
              Amount: ₹{APP.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </FormCard>

      {/* Editable Sections */}
      {SECTIONS.map(section => (
        <FormCard key={section.title} title={section.title} className="mb-4">
          <FormGrid columns={3}>
            {section.fields.map(([label, value]) => (
              <div key={label} className="dbt-info-field">
                <p className="dbt-info-label">{label}</p>
                <input
                  defaultValue={value}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.625rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
              </div>
            ))}
          </FormGrid>
        </FormCard>
      ))}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '0.5rem',
        }}
      >
        <Button
          label="Print Preview"
          variant="outlined"
          icon="print"
          onClick={() => window.print()}
        />
        <Button
          label="Download PDF"
          variant="outlined"
          icon="download"
          onClick={() => ToastService.success('Generating PDF...')}
        />
        <Button
          label="Submit Application"
          variant="primary"
          icon="send"
          onClick={() => ToastService.success('Application submitted!')}
        />
      </div>
    </FormPage>
  );
}
