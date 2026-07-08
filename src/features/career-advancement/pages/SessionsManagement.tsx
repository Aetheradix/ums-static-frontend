import React, { useState } from 'react';
import { useCareerAdvancement } from '../context';
import '../career.css';
import { FormCard, FormGrid, FormPage, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

const TYPE_OPTIONS: Data.DataItem<string>[] = [
  { id: 'APAR', text: 'APAR' },
  { id: 'PBAS', text: 'PBAS' },
  { id: 'CAS', text: 'CAS' },
];

const APP_STATUS_OPTIONS: Data.DataItem<string>[] = [
  { id: 'OPEN', text: 'OPEN' },
  { id: 'CLOSE', text: 'CLOSE' },
];

const STATUS_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Active', text: 'Active' },
  { id: 'In-active', text: 'In-active' },
];

type SessionForm = {
  name: string;
  type: 'APAR' | 'PBAS' | 'CAS';
  startDate: string;
  endDate: string;
  applicationStatus: 'OPEN' | 'CLOSE';
  status: 'Active' | 'In-active';
  sessionFrom: string;
  sessionTo: string;
};

const BLANK_FORM: SessionForm = {
  name: '',
  type: 'APAR',
  startDate: '',
  endDate: '',
  applicationStatus: 'OPEN',
  status: 'Active',
  sessionFrom: '',
  sessionTo: '',
};

export default function SessionsManagement() {
  const { sessions, setSessions, triggerNotification } = useCareerAdvancement();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SessionForm>({ ...BLANK_FORM });

  const set = <K extends keyof SessionForm>(key: K, value: SessionForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) {
      triggerNotification(
        'Session Name, Start and End dates are required.',
        'error'
      );
      return;
    }

    const newSession: CareerAdvancement.CASSession = {
      id: sessions.length + 1,
      name: form.name,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      applicationStatus: form.applicationStatus,
      status: form.status,
      sessionFrom: form.sessionFrom,
      sessionTo: form.sessionTo,
    };

    setSessions((prev: CareerAdvancement.CASSession[]) => [
      ...prev,
      newSession,
    ]);
    triggerNotification('Session created successfully!', 'success');
    setForm({ ...BLANK_FORM });
    setShowForm(false);
  };

  return (
    <FormPage
      title="Sessions Management"
      description="Configure sessions for APAR / PBAS / CAS applications"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Career Advancement', to: '/career-advancement/dashboard' },
        { label: 'Sessions Configuration' },
      ]}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-800">
          Available Assessment Sessions
        </h3>
        {!showForm && (
          <Button
            label="Create Session"
            icon="plus"
            variant="primary"
            onClick={() => setShowForm(true)}
          />
        )}
      </div>

      {showForm && (
        <FormCard title="Create New Session" icon="calendar" className="mb-6">
          <form onSubmit={handleSubmit}>
            <FormGrid columns={2}>
              <TextBox
                label="Session Name *"
                placeholder="e.g. APAR 2024-25"
                value={form.name}
                onChange={v => set('name', v)}
              />
              <DropDownList
                label="Type *"
                data={TYPE_OPTIONS}
                textField="text"
                valueField="id"
                value={form.type}
                onChange={v => set('type', v as any)}
              />
              <TextBox
                label="Start Date & Time *"
                value={form.startDate}
                onChange={v => set('startDate', v)}
              />
              <TextBox
                label="End Date & Time *"
                value={form.endDate}
                onChange={v => set('endDate', v)}
              />
              <DropDownList
                label="Application Status *"
                data={APP_STATUS_OPTIONS}
                textField="text"
                valueField="id"
                value={form.applicationStatus}
                onChange={v => set('applicationStatus', v as any)}
              />
              <DropDownList
                label="Status *"
                data={STATUS_OPTIONS}
                textField="text"
                valueField="id"
                value={form.status}
                onChange={v => set('status', v as any)}
              />
              <TextBox
                label="Session From *"
                value={form.sessionFrom}
                onChange={v => set('sessionFrom', v)}
              />
              <TextBox
                label="Session To *"
                value={form.sessionTo}
                onChange={v => set('sessionTo', v)}
              />
            </FormGrid>

            <div className="form-actions-row mt-6">
              <Button
                label="Save Session"
                icon="check"
                variant="success"
                type="submit"
              />
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => {
                  setForm({ ...BLANK_FORM });
                  setShowForm(false);
                }}
              />
            </div>
          </form>
        </FormCard>
      )}

      <FormCard>
        <GridPanel
          data={sessions}
          columns={[
            {
              cell: (_, o) => <span>{(o.rowIndex ?? 0) + 1}</span>,
              width: '40px',
            },
            { field: 'name', header: 'Session Name' },
            {
              field: 'type',
              header: 'Type',
              cell: (item: CareerAdvancement.CASSession) => (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700">
                  {item.type}
                </span>
              ),
            },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              field: 'applicationStatus',
              header: 'App Status',
              cell: (item: CareerAdvancement.CASSession) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.applicationStatus === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.applicationStatus}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: CareerAdvancement.CASSession) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              cell: (item: CareerAdvancement.CASSession) => (
                <div className="flex gap-2">
                  <Button
                    label="View"
                    icon="eye"
                    variant="outlined"
                    onClick={() =>
                      triggerNotification(
                        `Viewing configuration for ${item.name}`,
                        'info'
                      )
                    }
                  />
                  <Button
                    label="Edit"
                    icon="pencil"
                    variant="outlined"
                    onClick={() =>
                      triggerNotification(
                        'Editing session is restricted in preview.',
                        'warning'
                      )
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
