import { useState, useEffect } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, TextArea } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import {
  PortalSettingsSeedService,
  FAQSeedService,
  type SeedPortalSettings,
  type SeedFAQ,
} from '../../seed';
import { admissionsUrls } from '../../urls';

export default function PortalSettings() {
  const [settings, setSettings] = useState<SeedPortalSettings | null>(null);
  const [faqs, setFaqs] = useState<SeedFAQ[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [s, f] = await Promise.all([
      PortalSettingsSeedService.get(),
      FAQSeedService.getAll(),
    ]);
    setSettings(s);
    setFaqs(f);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (key: keyof SeedPortalSettings, value: string) => {
    setSettings(prev => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await PortalSettingsSeedService.update(settings);
    ToastService.success('Portal settings saved successfully');
    setSaving(false);
  };

  const toggleFaqStatus = async (faq: SeedFAQ) => {
    const updated = await FAQSeedService.update(faq.id, {
      status: faq.status === 'Active' ? 'Inactive' : 'Active',
    });
    if (updated) {
      setFaqs(prev =>
        prev.map(f => (f.id === faq.id ? { ...f, ...updated } : f))
      );
    }
    ToastService.success('FAQ status updated');
  };

  const deleteFaq = async (id: string) => {
    await FAQSeedService.delete(id);
    setFaqs(prev => prev.filter(f => f.id !== id));
    ToastService.success('FAQ deleted');
  };

  if (!settings) return null;

  return (
    <FormPage
      title="Portal Settings"
      description="Configure the admission portal content, deadlines, instructions, and FAQs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions Management', to: admissionsUrls.root },
        { label: 'Admin Portal', to: admissionsUrls.admin.root },
        { label: 'Portal Settings' },
      ]}
    >
      {/* Portal Content */}
      <FormCard title="Portal Content">
        <FormGrid columns={1}>
          <TextArea
            label="Institution Introduction"
            value={settings.institutionIntro}
            onChange={v => handleChange('institutionIntro', v as string)}
            rows={4}
          />
          <TextBox
            label="Prospectus Link (URL)"
            value={settings.prospectusLink}
            onChange={v => handleChange('prospectusLink', v as string)}
          />
          <TextBox
            label="Registration Deadline"
            value={settings.registrationDeadline}
            onChange={v => handleChange('registrationDeadline', v as string)}
            type="date"
          />
          <TextArea
            label="Registration Instructions"
            value={settings.registrationInstructions}
            onChange={v =>
              handleChange('registrationInstructions', v as string)
            }
            rows={5}
          />
          <TextArea
            label="Form Declaration"
            value={settings.formDeclaration}
            onChange={v => handleChange('formDeclaration', v as string)}
            rows={3}
          />
          <TextBox
            label="Support Address"
            value={settings.supportAddress}
            onChange={v => handleChange('supportAddress', v as string)}
          />
          <TextBox
            label="Contact Us Footer"
            value={settings.contactUsFooterAddress}
            onChange={v => handleChange('contactUsFooterAddress', v as string)}
          />
        </FormGrid>
        <div className="flex justify-end mt-4">
          <Button
            label={saving ? 'Saving...' : 'Save Settings'}
            icon="pi pi-save"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormCard>

      {/* FAQs */}
      <FormCard title="Help Center — FAQs">
        <div className="flex flex-col gap-3">
          {faqs.map(faq => (
            <div
              key={faq.id}
              className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{faq.question}</p>
                <p className="text-sm text-gray-500 mt-1">{faq.solution}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  Category: {faq.category}
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  label={faq.status === 'Active' ? 'Active' : 'Inactive'}
                  variant={faq.status === 'Active' ? 'success' : 'outlined'}
                  onClick={() => toggleFaqStatus(faq)}
                />
                <Button
                  icon="pi pi-trash"
                  variant="text"
                  className="text-red-600"
                  onClick={() => deleteFaq(faq.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
