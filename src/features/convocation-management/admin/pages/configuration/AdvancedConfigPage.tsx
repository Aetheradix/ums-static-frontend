import { useState } from 'react';
import { FormPage, Tabs, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'primereact/button';
import { CONVOCATION_URLS } from '../../../urls';
import { ToastService } from 'services';
import { TextBox, NumberBox } from 'shared/components/forms';

export default function AdvancedConfigPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [fee, setFee] = useState<number>(2000);

  const handleSave = () => {
    ToastService.success('Configuration saved successfully!');
  };

  const tabsContent = [
    {
      title: 'Upload Config',
      content: (
        <FormCard
          title="Upload Configuration"
          subtitle="Configure the documents that students must upload."
        >
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-800">
                  Final Marksheet / Provisional Degree
                </h4>
                <p className="text-sm text-gray-500">
                  Required format: PDF. Max size: 2MB.
                </p>
              </div>
              <Button label="Edit" outlined />
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-800">
                  Identity Proof (Aadhaar/PAN)
                </h4>
                <p className="text-sm text-gray-500">
                  Required format: PDF, JPEG. Max size: 2MB.
                </p>
              </div>
              <Button label="Edit" outlined />
            </div>
            <div>
              <Button
                label="Add New Document Requirement"
                icon="pi pi-plus"
                outlined
                severity="info"
              />
            </div>
          </div>
        </FormCard>
      ),
    },
    {
      title: 'Category Config',
      content: (
        <FormCard
          title="Category Configuration"
          subtitle="Define attendance categories for students."
        >
          <div className="flex flex-col gap-4">
            <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
              <h4 className="font-semibold text-indigo-900 mb-2">
                In-Person (In-Presentia)
              </h4>
              <p className="text-sm text-indigo-700">
                Student will attend the ceremony to receive the degree.
              </p>
            </div>
            <div className="p-4 border border-teal-100 rounded-lg bg-teal-50/50">
              <h4 className="font-semibold text-teal-900 mb-2">
                By Post (In-Absentia)
              </h4>
              <p className="text-sm text-teal-700">
                Student cannot attend; degree will be dispatched via post.
              </p>
            </div>
          </div>
        </FormCard>
      ),
    },
    {
      title: 'Fee Matrix',
      content: (
        <FormCard
          title="Fee Matrix"
          subtitle="Configure registration fees by category."
        >
          <FormGrid columns={2}>
            <div className="flex flex-col gap-2">
              <NumberBox
                label="In-Presentia Fee (₹)"
                value={fee}
                onChange={val => setFee(val || 0)}
                mode="currency"
                currency="INR"
              />
            </div>
            <div className="flex flex-col gap-2">
              <NumberBox
                label="In-Absentia Fee (₹)"
                value={fee + 500}
                disabled
                mode="currency"
                currency="INR"
                subLabel="Includes ₹500 postal charges"
              />
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
    {
      title: 'Pass Design',
      content: (
        <FormCard
          title="Pass Design"
          subtitle="Customize the QR-coded entry pass for the ceremony."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <TextBox
                label="Pass Title"
                value="Convocation 2024 Entry Pass"
                disabled
              />
            </div>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                qr_code_2
              </span>
              <p className="text-gray-600 font-medium">QR Code Placement</p>
              <p className="text-sm text-gray-400">
                The generated QR code will be placed at the top right of the
                pass.
              </p>
            </div>
          </div>
        </FormCard>
      ),
    },
  ];

  return (
    <FormPage
      title="Advanced Configuration"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Configuration' },
      ]}
      headerAction={
        <Button
          label="Save Settings"
          icon="pi pi-save"
          severity="info"
          onClick={handleSave}
        />
      }
    >
      <Tabs
        tabs={tabsContent}
        activeIndex={activeTab}
        onTabChange={e => setActiveTab(e.index)}
      />
    </FormPage>
  );
}
