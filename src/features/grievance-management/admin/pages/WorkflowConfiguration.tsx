import { useState } from 'react';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import {
  grievanceCategories,
  departmentMappings,
  committees,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminWorkflowConfiguration() {
  const [activeTab, setActiveTab] = useState('routing');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [notes, setNotes] = useState('');

  const catOptions = grievanceCategories.map(c => ({
    name: c.name,
    value: c.name,
  }));
  const deptOptions = departmentMappings.map(d => ({
    name: d.primaryDepartment,
    value: d.primaryDepartment,
  }));
  const commOptions = committees.map(c => ({
    name: `${c.acronym} — ${c.name}`,
    value: c.acronym,
  }));

  const handleSave = () => {
    if (!selectedCategory || !selectedDept) {
      ToastService.error('Please fill all required fields.');
      return;
    }
    ToastService.success('Routing rule saved successfully!');
  };

  const tabs = [
    { id: 'routing', label: 'Routing Rules' },
    { id: 'committee', label: 'Committee Bindings' },
    { id: 'notifications', label: 'Notification Events' },
  ];

  return (
    <FormPage
      title="Workflow Configuration"
      description="Configure complaint routing rules, committee assignments, and notification triggers"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Workflow Config' },
      ]}
    >
      <div className="flex gap-1 mb-4 border-b border-slate-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'routing' && (
        <>
          <FormCard title="Add / Update Routing Rule">
            <p className="text-xs text-slate-500 mb-4">
              Define which department handles which grievance category. The
              system will auto-route incoming complaints based on this
              configuration.
            </p>
            <FormGrid columns={2}>
              <DropDownList
                label="Grievance Category *"
                data={catOptions}
                textField="name"
                optionValue="value"
                value={selectedCategory}
                onChange={val => setSelectedCategory(val as string)}
              />
              <DropDownList
                label="Primary Department *"
                data={deptOptions}
                textField="name"
                optionValue="value"
                value={selectedDept}
                onChange={val => setSelectedDept(val as string)}
              />
              <div className="md:col-span-2">
                <TextArea
                  label="Additional Routing Notes"
                  placeholder="Optional notes about this routing rule..."
                  value={notes}
                  onChange={setNotes}
                  rows={2}
                />
              </div>
            </FormGrid>
            <div className="flex justify-end mt-4">
              <Button
                label="Save Routing Rule"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </FormCard>

          <FormCard title="Current Routing Rules">
            <table className="grv-table w-full text-xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Grievance Category</th>
                  <th>Primary Department</th>
                  <th>Contact Officer</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentMappings.map(dm => (
                  <tr key={dm.id}>
                    <td className="font-mono text-slate-400">{dm.id}</td>
                    <td className="font-medium text-slate-700">
                      {dm.categoryName}
                    </td>
                    <td>{dm.primaryDepartment}</td>
                    <td className="text-slate-500">{dm.contactOfficer}</td>
                    <td className="text-center">
                      <span
                        className={`grv-status-pill ${dm.status === 'Active' ? 'approved' : 'closed'}`}
                      >
                        {dm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>
        </>
      )}

      {activeTab === 'committee' && (
        <>
          <FormCard title="Category → Committee Binding">
            <p className="text-xs text-slate-500 mb-4">
              Map which statutory committee handles specific grievance
              categories during the Committee Review stage.
            </p>
            <FormGrid columns={2}>
              <DropDownList
                label="Grievance Category"
                data={catOptions}
                textField="name"
                optionValue="value"
                value={selectedCategory}
                onChange={val => setSelectedCategory(val as string)}
              />
              <DropDownList
                label="Assign Committee"
                data={commOptions}
                textField="name"
                optionValue="value"
                value={selectedCommittee}
                onChange={val => setSelectedCommittee(val as string)}
              />
            </FormGrid>
            <div className="flex justify-end mt-4">
              <Button
                label="Save Binding"
                variant="primary"
                onClick={() => ToastService.success('Committee binding saved!')}
              />
            </div>
          </FormCard>

          <FormCard title="Active Committees">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {committees.map(c => (
                <div key={c.id} className="border rounded-lg p-3 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-blue-700">{c.acronym}</p>
                    <span
                      className={`grv-status-pill ${c.status === 'Active' ? 'approved' : 'closed'}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="font-medium text-slate-700 mb-1">{c.name}</p>
                  <p className="text-slate-500">
                    <span className="font-semibold">Chair:</span> {c.chair}
                  </p>
                  <p className="text-slate-400 mt-1">{c.mandate}</p>
                </div>
              ))}
            </div>
          </FormCard>
        </>
      )}

      {activeTab === 'notifications' && (
        <FormCard title="Notification Event Configuration">
          <p className="text-xs text-slate-500 mb-4">
            System sends automated SMS and Email notifications at key workflow
            events. Toggle to enable or disable each event.
          </p>
          <table className="grv-table w-full text-xs">
            <thead>
              <tr>
                <th>Event</th>
                <th>Channel</th>
                <th>Recipient</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  event: 'Complaint Submitted',
                  channel: 'SMS + Email',
                  recipient: 'Complainant',
                  active: true,
                },
                {
                  event: 'Assigned to Department',
                  channel: 'Email',
                  recipient: 'Department Officer',
                  active: true,
                },
                {
                  event: 'Notesheet Forwarded to HoD',
                  channel: 'Portal + Email',
                  recipient: 'HoD',
                  active: true,
                },
                {
                  event: 'Forwarded to Committee',
                  channel: 'Email',
                  recipient: 'Grievance Cell',
                  active: true,
                },
                {
                  event: 'Final Decision Issued',
                  channel: 'SMS + Email',
                  recipient: 'Complainant',
                  active: true,
                },
                {
                  event: 'Complaint Closed',
                  channel: 'SMS',
                  recipient: 'Complainant',
                  active: true,
                },
              ].map((n, i) => (
                <tr key={i}>
                  <td className="font-medium text-slate-700">{n.event}</td>
                  <td className="text-slate-500">{n.channel}</td>
                  <td className="text-slate-500">{n.recipient}</td>
                  <td className="text-center">
                    <span
                      className={`grv-status-pill ${n.active ? 'approved' : 'closed'}`}
                    >
                      {n.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      )}
    </FormPage>
  );
}
