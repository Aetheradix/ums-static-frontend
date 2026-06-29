import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type EmailTemplate, initialEmailTemplates } from '../../data';
import { essentialServicesUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'view'; item: EmailTemplate }
  | { mode: 'edit'; item: EmailTemplate };

const ACTIVE_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

export default function EmailTemplatesPage() {
  const [data, setData] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState({
    name: '',
    subject: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
  }, []);

  const openView = (item: EmailTemplate) => {
    setPopup({ mode: 'view', item });
  };

  const openEdit = (item: EmailTemplate) => {
    setForm({
      name: item.name,
      subject: item.subject,
      description: item.description,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(t =>
          t.id === popup.item.id
            ? {
                ...t,
                subject: form.subject,
                description: form.description,
                status: form.status,
              }
            : t
        )
      );
      ToastService.success('Email template modified successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Email Templates"
      description="Customize formatting, subject, and placeholders for automated system-generated notifications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Email Templates' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => (
                <span className="font-semibold text-gray-700">
                  {option.rowIndex + 1}
                </span>
              ),
              width: '50px',
            },
            { field: 'name', header: 'Template Name' },
            { field: 'subject', header: 'Email Subject' },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
              cell: (item: EmailTemplate) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              header: 'View Details',
              width: '120px',
              cell: (item: EmailTemplate) => (
                <Button
                  label="View"
                  icon="eye"
                  variant="outlined"
                  onClick={() => openView(item)}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      {/* Edit Popup */}
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Email Template"
        subtitle={
          popup.mode === 'edit'
            ? `Modify subject or body content for ${popup.item.name}`
            : ''
        }
        size="lg"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Template Name"
            value={form.name}
            onChange={() => {}}
            disabled
          />
          <TextBox
            label="Email Subject"
            placeholder="Type subject line..."
            value={form.subject}
            onChange={v => setForm(f => ({ ...f, subject: v }))}
            required
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">
              Available Placeholders
            </label>
            <div className="p-2 bg-slate-100 border rounded text-xs text-slate-600 flex gap-2 flex-wrap">
              <code>{'{Applicant}'}</code>
              <code>{'{GuestHouseName}'}</code>
              <code>{'{RoomNo}'}</code>
              <code>{'{ArrivalDate}'}</code>
              <code>{'{Departure}'}</code>
              <code>{'{Arrival}'}</code>
              <code>{'{Vehicle}'}</code>
              <code>{'{DriverName}'}</code>
              <code>{'{ConferenceTitle}'}</code>
            </div>
          </div>
          <TextArea
            label="Email Body (Description)"
            placeholder="Write email contents..."
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            rows={6}
            required
          />
          <DropDownList
            label="Template Status"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select status"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save Changes" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>

      {/* View Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title="View Email Template"
        subtitle={popup.mode === 'view' ? popup.item.name : ''}
        size="lg"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="text-xs uppercase font-semibold text-gray-400">
              Email Subject
            </span>
            <p className="text-gray-800 font-bold mt-0.5">
              {popup.mode === 'view' ? popup.item.subject : ''}
            </p>
          </div>
          <hr className="border-gray-150" />
          <div>
            <span className="text-xs uppercase font-semibold text-gray-400">
              Email Body Description
            </span>
            <pre className="mt-1 p-3 bg-slate-50 border rounded text-xs font-mono whitespace-pre-wrap leading-relaxed text-gray-800">
              {popup.mode === 'view' ? popup.item.description : ''}
            </pre>
          </div>
          <hr className="border-gray-150" />
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-semibold text-gray-400">
                Trigger Status
              </span>
              <div className="mt-0.5">
                {popup.mode === 'view' && (
                  <StatusBadge
                    label={popup.item.status}
                    variant={
                      popup.item.status === 'Active' ? 'approved' : 'neutral'
                    }
                  />
                )}
              </div>
            </div>
            <Button label="Close" variant="outlined" onClick={closePopup} />
          </div>
        </div>
      </FormPopup>
    </FormPage>
  );
}
