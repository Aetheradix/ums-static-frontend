import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { grievances } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function StudentGrievance() {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!subject || !priority || !desc.trim()) {
      ToastService.error('Fill all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubject('');
      setPriority('');
      setDesc('');
      ToastService.success('Grievance raised! Ticket No: GRV/2025/0051');
    }, 900);
  };

  return (
    <FormPage
      title="Raise Grievance"
      description="Raise and track scholarship-related support tickets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Raise Grievance' },
      ]}
    >
      <div className="dbt-bottom-row">
        {/* Raise Ticket */}
        <div>
          <FormCard title="Raise a New Grievance Ticket">
            <TextBox
              label="Subject"
              value={subject}
              onChange={setSubject}
              placeholder="Briefly describe your issue..."
              required
            />
            <div style={{ marginTop: '0.75rem' }}>
              <DropDownList
                label="Priority"
                data={[
                  { name: 'High', value: 'High' },
                  { name: 'Medium', value: 'Medium' },
                  { name: 'Low', value: 'Low' },
                ]}
                textField="name"
                optionValue="value"
                value={priority}
                onChange={v => setPriority(String(v ?? ''))}
                required
              />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <DropDownList
                label="Category"
                data={[
                  { name: 'Application Status', value: 'Application Status' },
                  { name: 'Document Upload', value: 'Document Upload' },
                  { name: 'Payment Issue', value: 'Payment Issue' },
                  { name: 'NPCI Seeding', value: 'NPCI Seeding' },
                  { name: 'Portal Sync', value: 'Portal Sync' },
                  { name: 'Other', value: 'Other' },
                ]}
                textField="name"
                optionValue="value"
                value=""
                onChange={() => {}}
              />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <TextArea
                label="Detailed Description"
                value={desc}
                onChange={setDesc}
                rows={4}
                required
                placeholder="Provide all relevant details including application number, dates, error messages..."
              />
            </div>
            <div style={{ marginTop: '0.875rem' }}>
              <Button
                label="Submit Grievance"
                variant="primary"
                icon="send"
                isLoading={submitting}
                onClick={handleSubmit}
              />
            </div>
          </FormCard>
        </div>

        {/* My Tickets */}
        <div>
          <FormCard title="My Tickets">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {grievances.map(g => (
                <div
                  key={g.id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.375rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#111827',
                      }}
                    >
                      {g.ticketNo}
                    </span>
                    <span
                      className={`dbt-status-pill ${g.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      color: '#374151',
                      fontWeight: 500,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {g.subject}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.625rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      className={`dbt-status-pill ${g.priority.toLowerCase()}`}
                      style={{ fontSize: '0.625rem' }}
                    >
                      {g.priority}
                    </span>
                    <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                      {g.raisedOn}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.375rem',
                    }}
                  >
                    {g.remarks}
                  </p>
                </div>
              ))}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
