// Student Report Incident — same form as employee, student breadcrumbs
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextArea,
  DatePicker,
  TimePicker,
  FileUpload,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { smsUrls } from '../../urls';

const parseTimeString = (timeStr?: string): Date | null => {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const formatTimeToString = (date?: Date | null): string => {
  if (!date) return '';
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minStr} ${ampm}`;
};

const CATEGORY_OPTIONS = [
  'Physical Security',
  'Cyber Security',
  'Fire & Safety',
  'Medical Emergency',
  'Theft & Robbery',
  'Harassment',
  'Vandalism',
  'Ragging',
  'Natural Disaster',
].map(c => ({ name: c, value: c }));
const TYPE_OPTIONS = [
  'Unauthorized Entry',
  'Trespassing',
  'Phishing Attack',
  'Data Breach',
  'Fire Outbreak',
  'Accident',
  'Ragging',
  'Sexual Harassment',
  'Mobile/Laptop Theft',
  'Bullying',
].map(t => ({ name: t, value: t }));
const LOCATION_OPTIONS = [
  'Main Gate',
  'Computer Lab A',
  'Chemistry Lab',
  'Library',
  'Boys Hostel',
  'Girls Hostel',
  'Cafeteria',
  'Parking Area',
  'Sports Ground',
  'Classroom',
].map(l => ({ name: l, value: l }));
const BUILDING_OPTIONS = [
  'Main Academic Block',
  'Science Block',
  'Engineering Block',
  'Boys Hostel A',
  'Girls Hostel B',
  'Library Block',
  'Sports Complex',
].map(b => ({ name: b, value: b }));
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'].map(p => ({
  name: p,
  value: p,
}));

interface ReportForm {
  category: string;
  incidentType: string;
  location: string;
  building: string;
  priority: string;
  description: string;
  incidentDate: string;
  incidentTime: string;
  photoFile: string;
  videoFile: string;
}

const EMPTY: ReportForm = {
  category: '',
  incidentType: '',
  location: '',
  building: '',
  priority: 'Medium',
  description: '',
  incidentDate: '',
  incidentTime: '',
  photoFile: '',
  videoFile: '',
};

export default function StudentReportIncident() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ReportForm>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [incidentRef, setIncidentRef] = useState('');

  const handleSubmit = () => {
    if (
      !form.category ||
      !form.incidentType ||
      !form.location ||
      !form.description
    ) {
      ToastService.error(
        'Please fill in all required fields: Category, Type, Location, Description.'
      );
      return;
    }
    const ref = `INC-2024-${String(Math.floor(Math.random() * 900) + 100)}`;
    setIncidentRef(ref);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <FormPage
        title="Incident Reported Successfully"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Security Management', to: smsUrls.portal },
          { label: 'Student Portal', to: smsUrls.student.portal },
          { label: 'Report Incident' },
        ]}
      >
        <FormCard>
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <i
                className="pi pi-check-circle"
                style={{ fontSize: '2.5rem', color: '#16a34a' }}
              />
            </div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Incident Submitted Successfully!
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1.5rem',
              }}
            >
              Your incident has been reported to the Security Management team.
            </p>
            <div
              style={{
                background: '#f9fafb',
                borderRadius: 12,
                padding: '1rem 2rem',
                display: 'inline-block',
                border: '2px dashed #e5e7eb',
                marginBottom: '2rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginBottom: 4,
                }}
              >
                YOUR INCIDENT REFERENCE NUMBER
              </p>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  letterSpacing: '0.05em',
                }}
              >
                {incidentRef}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                label="Track My Incident"
                variant="primary"
                icon="search"
                onClick={() => navigate(smsUrls.student.myIncidents)}
              />
              <Button
                label="Report Another"
                variant="outlined"
                icon="plus"
                onClick={() => {
                  setForm(EMPTY);
                  setSubmitted(false);
                }}
              />
              <Button
                label="Go to Dashboard"
                variant="outlined"
                icon="home"
                onClick={() => navigate(smsUrls.student.dashboard)}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Report Incident"
      description="File a security incident report. Stay safe — we're here to help."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Student Portal', to: smsUrls.student.portal },
        { label: 'Report Incident' },
      ]}
    >
      <FormCard title="Incident Information">
        <FormGrid columns={2}>
          <DropDownList
            label="Incident Category *"
            data={CATEGORY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.category}
            onChange={v => setForm(f => ({ ...f, category: v as string }))}
          />
          <DropDownList
            label="Incident Type *"
            data={TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.incidentType}
            onChange={v => setForm(f => ({ ...f, incidentType: v as string }))}
          />
          <DropDownList
            label="Building"
            data={BUILDING_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.building}
            onChange={v => setForm(f => ({ ...f, building: v as string }))}
          />
          <DropDownList
            label="Specific Location *"
            data={LOCATION_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.location}
            onChange={v => setForm(f => ({ ...f, location: v as string }))}
          />
          <DropDownList
            label="Priority"
            data={PRIORITY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.priority}
            onChange={v => setForm(f => ({ ...f, priority: v as string }))}
          />
        </FormGrid>
      </FormCard>
      <FormCard title="Incident Details">
        <TextArea
          label="Description *"
          placeholder="Describe what happened in detail..."
          value={form.description}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          rows={5}
        />
        <FormGrid columns={2}>
          <DatePicker
            label="Incident Date"
            value={form.incidentDate ? new Date(form.incidentDate) : undefined}
            onChange={date =>
              setForm(f => ({
                ...f,
                incidentDate: date ? date.toISOString().split('T')[0] : '',
              }))
            }
          />
          <TimePicker
            label="Incident Time"
            value={parseTimeString(form.incidentTime)}
            onChange={time =>
              setForm(f => ({ ...f, incidentTime: formatTimeToString(time) }))
            }
          />
        </FormGrid>
      </FormCard>
      <FormCard title="Evidence & Attachments">
        <FormGrid columns={2}>
          <FileUpload
            label="Photo Evidence (Optional)"
            mode="photo"
            accept="image/*"
            value={form.photoFile}
            onChange={file =>
              setForm(f => ({ ...f, photoFile: file ? file.name : '' }))
            }
          />
          <FileUpload
            label="Video Evidence (Optional)"
            mode="file"
            accept="video/*"
            value={form.videoFile}
            onChange={file =>
              setForm(f => ({ ...f, videoFile: file ? file.name : '' }))
            }
          />
        </FormGrid>
      </FormCard>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <Button
          label="Cancel"
          variant="outlined"
          onClick={() => navigate(smsUrls.student.dashboard)}
        />
        <Button
          label="Submit Incident Report"
          variant="primary"
          icon="send"
          onClick={handleSubmit}
        />
      </div>
    </FormPage>
  );
}
