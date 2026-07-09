import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { serviceCategories, mockCurrentUser } from '../../data';
import { itsmUrls } from '../../urls';
import type { TicketFormData } from '../../data';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TicketFormData>({
    module: '',
    service: '',
    subService: '',
    title: '',
    description: '',
    priority: 'Medium' as any,
    category: '',
    impact: 'Medium' as any,
    urgency: 'Medium' as any,
    requesterId: mockCurrentUser?.id ?? '',
    requesterName: mockCurrentUser?.name ?? '',
    requesterEmail: mockCurrentUser?.email ?? '',
    requesterDepartment: mockCurrentUser?.department ?? '',
    assetTag: '',
    campusBlock: '',
    dynamicFields: {},
  });

  const selectedCategory = useMemo(
    () => serviceCategories.find(c => c.name === form.module),
    [form.module]
  );
  const selectedService = useMemo(
    () => selectedCategory?.services.find(s => s.name === form.service),
    [selectedCategory, form.service]
  );
  const dynamicFields = selectedService?.dynamicFields ?? [];

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));
  const updateDynamic = (name: string, value: string) =>
    setForm(prev => ({
      ...prev,
      dynamicFields: { ...prev.dynamicFields, [name]: value },
    }));

  const canProceed = () => {
    if (step === 1) return form.module && form.service && form.subService;
    if (step === 2) return form.title && form.description;
    if (step === 3) return form.requesterName && form.requesterEmail;
    return true;
  };

  const handleSubmit = () => {
    ToastService.success(
      `Ticket created successfully! Reference: STU-INC-2026-${Math.floor(Math.random() * 900) + 300}`
    );
    navigate(itsmUrls.employee.myTickets);
  };

  return (
    <FormPage
      title="Create Support Ticket"
      description="Submit a new IT support request. Select the relevant service category and fill in the details."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Create Ticket' },
      ]}
    >
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {s}
            </div>
            <span
              className={`text-xs font-medium ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              {s === 1
                ? 'Service'
                : s === 2
                  ? 'Details'
                  : s === 3
                    ? 'Requester'
                    : 'Review'}
            </span>
            {s < 4 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <FormCard title="Step 1: Select Service">
          <FormGrid columns={2}>
            <DropDownList
              label="Module / Category"
              value={form.module}
              onChange={(v: any) => {
                update('module', v);
                update('service', '');
                update('subService', '');
              }}
              data={serviceCategories as any}
              textField="name"
              optionValue="name"
              defaultOptionText="Select module..."
              required
            />
            <DropDownList
              label="Service"
              value={form.service}
              onChange={(v: any) => {
                update('service', v);
                update('subService', '');
              }}
              data={(selectedCategory?.services ?? []) as any}
              textField="name"
              optionValue="name"
              defaultOptionText={
                selectedCategory ? 'Select service...' : 'Select module first'
              }
              disabled={!selectedCategory}
              required
            />
            <DropDownList
              label="Sub-Service"
              value={form.subService}
              onChange={(v: any) => update('subService', v)}
              data={
                (selectedService?.subServices ?? []).map(s => ({
                  name: s,
                })) as any
              }
              textField="name"
              optionValue="name"
              defaultOptionText={
                selectedService
                  ? 'Select sub-service...'
                  : 'Select service first'
              }
              disabled={!selectedService}
              required
            />
          </FormGrid>
          {dynamicFields.length > 0 && (
            <div className="mt-4">
              <FormGrid columns={2}>
                {dynamicFields.map(f =>
                  f.type === 'select' ? (
                    <DropDownList
                      key={f.name}
                      label={f.label}
                      value={form.dynamicFields[f.name] ?? ''}
                      onChange={(v: any) => updateDynamic(f.name, v)}
                      data={(f.options ?? []).map(o => ({ name: o })) as any}
                      textField="name"
                      optionValue="name"
                      defaultOptionText={`Select ${f.label}...`}
                      required={f.required}
                    />
                  ) : f.type === 'textarea' ? (
                    <TextArea
                      key={f.name}
                      label={f.label}
                      value={form.dynamicFields[f.name] ?? ''}
                      onChange={(v: string) => updateDynamic(f.name, v)}
                      required={f.required}
                    />
                  ) : (
                    <TextBox
                      key={f.name}
                      label={f.label}
                      value={form.dynamicFields[f.name] ?? ''}
                      onChange={(v: string) => updateDynamic(f.name, v)}
                      required={f.required}
                    />
                  )
                )}
              </FormGrid>
            </div>
          )}
        </FormCard>
      )}

      {step === 2 && (
        <FormCard title="Step 2: Ticket Details">
          <FormGrid columns={2}>
            <div className="col-span-2">
              <TextBox
                label="Title"
                value={form.title}
                onChange={(v: string) => update('title', v)}
                required
                placeholder="Brief description of the issue"
              />
            </div>
            <div className="col-span-2">
              <TextArea
                label="Description"
                value={form.description}
                onChange={(v: string) => update('description', v)}
                required
                rows={5}
                placeholder="Detailed description of the issue..."
              />
            </div>
            <DropDownList
              label="Priority"
              value={form.priority}
              onChange={(v: any) => update('priority', v)}
              data={
                [
                  { name: 'Low' },
                  { name: 'Medium' },
                  { name: 'High' },
                  { name: 'Critical' },
                ] as any
              }
              textField="name"
              optionValue="name"
              required
            />
            <DropDownList
              label="Impact"
              value={form.impact}
              onChange={(v: any) => update('impact', v)}
              data={
                [{ name: 'Low' }, { name: 'Medium' }, { name: 'High' }] as any
              }
              textField="name"
              optionValue="name"
              required
            />
            <DropDownList
              label="Urgency"
              value={form.urgency}
              onChange={(v: any) => update('urgency', v)}
              data={
                [{ name: 'Low' }, { name: 'Medium' }, { name: 'High' }] as any
              }
              textField="name"
              optionValue="name"
              required
            />
            <TextBox
              label="Asset Tag"
              value={form.assetTag}
              onChange={(v: string) => update('assetTag', v)}
              placeholder="e.g. STU-HPC-NODE04"
            />
          </FormGrid>
        </FormCard>
      )}

      {step === 3 && (
        <FormCard title="Step 3: Requester Information">
          <FormGrid columns={2}>
            <TextBox
              label="Full Name"
              value={form.requesterName}
              onChange={(v: string) => update('requesterName', v)}
              required
            />
            <TextBox
              label="Email"
              value={form.requesterEmail}
              onChange={(v: string) => update('requesterEmail', v)}
              required
            />
            <TextBox
              label="Department"
              value={form.requesterDepartment}
              onChange={(v: string) => update('requesterDepartment', v)}
              required
            />
            <TextBox
              label="Campus Block"
              value={form.campusBlock}
              onChange={(v: string) => update('campusBlock', v)}
              placeholder="Building / Room"
            />
          </FormGrid>
        </FormCard>
      )}

      {step === 4 && (
        <FormCard title="Step 4: Review & Submit">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Module</p>
                <p className="text-sm font-medium">{form.module}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-medium">{form.service}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sub-Service</p>
                <p className="text-sm font-medium">{form.subService}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="text-sm font-medium">{form.priority}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Title</p>
                <p className="text-sm font-medium">{form.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm font-medium">{form.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Requester</p>
                <p className="text-sm font-medium">{form.requesterName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">
                  {form.requesterDepartment}
                </p>
              </div>
            </div>
            {Object.keys(form.dynamicFields).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-bold mb-2">
                  Dynamic Fields
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(form.dynamicFields).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500">{key}</p>
                      <p className="text-sm">{val || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FormCard>
      )}

      <div className="flex justify-between mt-6">
        <Button
          label="Back"
          variant="outlined"
          disabled={step === 1}
          onClick={() => setStep(s => s - 1)}
        />
        {step < 4 ? (
          <Button
            label="Next"
            variant="primary"
            disabled={!canProceed()}
            onClick={() => setStep(s => s + 1)}
          />
        ) : (
          <Button
            label="Submit Ticket"
            variant="success"
            onClick={handleSubmit}
          />
        )}
      </div>
    </FormPage>
  );
}
