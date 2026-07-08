import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { grievanceCategories, slaRules } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminSLAConfig() {
  const [rules, setRules] = useState(slaRules);

  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [responseHrs, setResponseHrs] = useState('8');
  const [resolveHrs, setResolveHrs] = useState('72');
  const [reminderHrs, setReminderHrs] = useState('24');
  const [escalateHrs, setEscalateHrs] = useState('72');
  const [escalateTo, setEscalateTo] = useState('HoD');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      ToastService.error('Please select a category.');
      return;
    }

    const newRule = {
      id: `SLA00${rules.length + 1}`,
      category,
      priority: priority as any,
      responseTimeHrs: Number(responseHrs) || 8,
      resolutionTimeHrs: Number(resolveHrs) || 72,
      reminderHrs: Number(reminderHrs) || 24,
      escalationHrs: Number(escalateHrs) || 72,
      escalateTo,
    };

    setRules(prev => [...prev, newRule]);
    ToastService.success(`SLA configured for ${category} successfully.`);
    setCategory('');
  };

  const handleDelete = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    ToastService.error('SLA rule deleted.');
  };

  return (
    <FormPage
      title="SLA Configuration Center"
      description="Configure warning thresholds, reminder schedules, and statutory resolution windows by priority."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'SLA Configuration' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Form left */}
        <FormCard title="New SLA Rule Form" icon="alarm">
          <form onSubmit={handleAdd}>
            <FormGrid columns={1}>
              <DropDownList
                label="Complaint Category *"
                data={grievanceCategories.map(c => ({
                  name: c.name,
                  value: c.name,
                }))}
                textField="name"
                optionValue="value"
                value={category}
                onChange={val => setCategory(String(val ?? ''))}
                required
              />
              <DropDownList
                label="Priority Level *"
                data={[
                  { name: 'Low', value: 'Low' },
                  { name: 'Medium', value: 'Medium' },
                  { name: 'High', value: 'High' },
                  { name: 'Critical', value: 'Critical' },
                ]}
                textField="name"
                optionValue="value"
                value={priority}
                onChange={val => setPriority(String(val ?? 'Medium'))}
                required
              />
              <TextBox
                label="Acknowledgment SLA (Hours) *"
                placeholder="e.g. 8"
                value={responseHrs}
                onChange={setResponseHrs}
                required
              />
              <TextBox
                label="Resolution SLA (Hours) *"
                placeholder="e.g. 72"
                value={resolveHrs}
                onChange={setResolveHrs}
                required
              />
              <TextBox
                label="Pre-Breach Warning (Hours) *"
                placeholder="e.g. 24"
                value={reminderHrs}
                onChange={setReminderHrs}
                required
              />
              <TextBox
                label="Escalation SLA (Hours) *"
                placeholder="e.g. 72"
                value={escalateHrs}
                onChange={setEscalateHrs}
                required
              />
              <TextBox
                label="Escalation Target Nodal Authority *"
                placeholder="e.g. Registrar"
                value={escalateTo}
                onChange={setEscalateTo}
                required
              />
              <div className="mt-4">
                <Button
                  label="Create SLA Rule"
                  icon="plus"
                  variant="primary"
                  type="submit"
                  className="w-full"
                />
              </div>
            </FormGrid>
          </form>
        </FormCard>

        {/* Right rules table */}
        <FormCard title="Configured SLA Rules Matrix" icon="list">
          <table className="grv-table text-xs">
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Ack (Hrs)</th>
                <th>Resolution (Hrs)</th>
                <th>Warning (Hrs)</th>
                <th>Escalation (Hrs)</th>
                <th>Escalate To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id}>
                  <td className="font-mono font-bold">{r.id}</td>
                  <td className="font-bold text-slate-800">{r.category}</td>
                  <td>
                    <span
                      className={`grv-status-pill ${r.priority.toLowerCase()}`}
                    >
                      {r.priority}
                    </span>
                  </td>
                  <td className="font-mono">{r.responseTimeHrs}h</td>
                  <td className="font-mono font-bold text-indigo-700">
                    {r.resolutionTimeHrs}h
                  </td>
                  <td className="font-mono">{r.reminderHrs}h</td>
                  <td className="font-mono">{r.escalationHrs}h</td>
                  <td className="font-bold text-slate-700">{r.escalateTo}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
