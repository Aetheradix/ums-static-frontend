import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  type RTI,
  rtis as initialData,
  categoryOptions,
  citizenTypeOptions,
  identityTypeOptions,
  modeOptions,
  deadlineTypeOptions,
} from '../../data';
import { rtiUrls } from '../../urls';

const EMPTY_FORM = {
  applicantName: '',
  applicantAddress: '',
  applicantMobile: '',
  applicantEmail: '',
  citizenType: 'General' as RTI['citizenType'],
  identityType: 'Aadhaar' as RTI['identityType'],
  identityNumber: '',
  dateReceived: new Date().toISOString().split('T')[0],
  mode: 'Online' as RTI['mode'],
  subject: '',
  keywords: '',
  category: '',
  informationRequested: '',
  deadlineType: 'Standard' as RTI['deadlineType'],
};

const deadlineDays: Record<string, number> = {
  Standard: 30,
  'Life & Liberty': 2,
  'Transfer Case': 35,
  'Disabled Person': 15,
};

export default function RegisterRTI() {
  const [data, setData] = useState<RTI[]>(initialData);
  const [form, setForm] = useState(EMPTY_FORM);
  const [charCount, setCharCount] = useState(0);

  const currentDeadlineDays = deadlineDays[form.deadlineType] || 30;
  const dueDate = form.dateReceived
    ? new Date(
        new Date(form.dateReceived).getTime() + currentDeadlineDays * 86400000
      )
        .toISOString()
        .split('T')[0]
    : '';
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!form.applicantName || !form.subject || !form.informationRequested) {
      ToastService.error('Please fill in all required fields.');
      return;
    }
    const nextNum = String(data.length + 1).padStart(3, '0');
    const newRti: RTI = {
      id: `R${Date.now()}`,
      rtiNumber: `RTI/2025/${nextNum}`,
      ...form,
      keywords: form.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean),
      dueDate,
      remainingDays: currentDeadlineDays,
      status: 'New',
      priority: 'Normal',
      assignedDepartments: [],
      finalReply: '',
      closedOn: '',
      isAppealed: false,
      appealLevel: 'None',
      createdBy: 'CPIO Office',
      createdAt: today,
    };
    setData(prev => [newRti, ...prev]);
    ToastService.success(
      `RTI registered successfully. Tracking Number: ${newRti.rtiNumber}`
    );
    setForm(EMPTY_FORM);
    setCharCount(0);
  };

  return (
    <FormPage
      title="Register RTI"
      description="Register a new RTI application with applicant details and information requested."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Register RTI' },
      ]}
    >
      <FormCard title="Section 1: Applicant Details">
        <FormGrid columns={2}>
          <TextBox
            label="Applicant Name"
            placeholder="Full name as per ID proof"
            value={form.applicantName}
            onChange={v => setForm(f => ({ ...f, applicantName: v }))}
            required
          />
          <TextBox
            label="Mobile"
            placeholder="10-digit mobile number"
            value={form.applicantMobile}
            onChange={v => setForm(f => ({ ...f, applicantMobile: v }))}
          />
          <TextBox
            label="Address"
            placeholder="Complete postal address"
            value={form.applicantAddress}
            onChange={v => setForm(f => ({ ...f, applicantAddress: v }))}
          />
          <TextBox
            label="Email"
            placeholder="email@example.com"
            value={form.applicantEmail}
            onChange={v => setForm(f => ({ ...f, applicantEmail: v }))}
          />
          <DropDownList
            label="Citizen Type"
            data={citizenTypeOptions.map(c => ({ name: c, value: c }))}
            textField="name"
            optionValue="value"
            value={form.citizenType}
            onChange={v =>
              setForm(f => ({
                ...f,
                citizenType: (v as RTI['citizenType']) || 'General',
              }))
            }
          />
          <DropDownList
            label="Identity Type"
            data={identityTypeOptions.map(c => ({ name: c, value: c }))}
            textField="name"
            optionValue="value"
            value={form.identityType}
            onChange={v =>
              setForm(f => ({
                ...f,
                identityType: (v as RTI['identityType']) || 'Aadhaar',
              }))
            }
          />
          <TextBox
            label="Identity Number"
            placeholder="Aadhaar / Voter ID / Passport number"
            value={form.identityNumber}
            onChange={v => setForm(f => ({ ...f, identityNumber: v }))}
          />
        </FormGrid>
      </FormCard>

      <div className="mt-4">
        <FormCard title="Section 2: RTI Details">
          <FormGrid columns={2}>
            <TextBox
              label="Date Received"
              type="date"
              value={form.dateReceived}
              onChange={v => setForm(f => ({ ...f, dateReceived: v }))}
              required
            />
            <DropDownList
              label="Mode of Receipt"
              data={modeOptions.map(m => ({ name: m, value: m }))}
              textField="name"
              optionValue="value"
              value={form.mode}
              onChange={v =>
                setForm(f => ({ ...f, mode: (v as RTI['mode']) || 'Online' }))
              }
            />
            <TextBox
              label="Subject"
              placeholder="Brief subject of the RTI application"
              value={form.subject}
              onChange={v => setForm(f => ({ ...f, subject: v }))}
              required
            />
            <TextBox
              label="Keywords (comma separated)"
              placeholder="e.g. admission, fee, scholarship"
              value={form.keywords}
              onChange={v => setForm(f => ({ ...f, keywords: v }))}
            />
            <DropDownList
              label="Category"
              data={categoryOptions.map(c => ({ name: c, value: c }))}
              textField="name"
              optionValue="value"
              value={form.category}
              onChange={v =>
                setForm(f => ({ ...f, category: String(v ?? '') }))
              }
            />
            <DropDownList
              label="Deadline Type"
              data={deadlineTypeOptions.map(d => ({ name: d, value: d }))}
              textField="name"
              optionValue="value"
              value={form.deadlineType}
              onChange={v =>
                setForm(f => ({
                  ...f,
                  deadlineType: (v as RTI['deadlineType']) || 'Standard',
                }))
              }
            />
          </FormGrid>
        </FormCard>
      </div>

      <div className="mt-4">
        <FormCard title="Section 3: Information Requested">
          <TextArea
            label="Details of Information Requested"
            placeholder="Describe in detail the information being requested under RTI..."
            value={form.informationRequested}
            onChange={v => {
              setForm(f => ({ ...f, informationRequested: v }));
              setCharCount(v.length);
            }}
            rows={5}
            required
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {charCount} characters
          </div>
        </FormCard>
      </div>

      <div className="mt-4">
        <FormCard title="Section 4: Deadline">
          <FormGrid columns={3}>
            <div>
              <label className="form-field-label">
                Due Date (Auto-calculated)
              </label>
              <div className="text-sm font-medium mt-1 text-gray-800">
                {dueDate || '—'}
              </div>
            </div>
            <div>
              <label className="form-field-label">Allowed Days</label>
              <div className="text-sm font-medium mt-1 text-gray-800">
                {currentDeadlineDays} days
              </div>
            </div>
            <div>
              <label className="form-field-label">Status</label>
              <div className="text-sm font-medium mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  New
                </span>
              </div>
            </div>
          </FormGrid>
        </FormCard>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          label="Reset"
          variant="outlined"
          onClick={() => {
            setForm(EMPTY_FORM);
            setCharCount(0);
          }}
        />
        <Button label="Register RTI" variant="primary" onClick={handleSubmit} />
      </div>
    </FormPage>
  );
}
