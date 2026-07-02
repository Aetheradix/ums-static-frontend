import { Button } from 'primereact/button';
import { useState } from 'react';
import { ToastService } from 'services';
import {
  DropDownList,
  MultiSelectList,
  NumberBox,
  Switch,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, Tabs } from 'shared/new-components';
import { CONVOCATION_URLS } from '../../../urls';

export default function AdvancedConfigPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [fee, setFee] = useState<number>(2000);

  const handleSave = () => {
    ToastService.success('Configuration saved successfully!');
  };

  const [inAbsentia, setInAbsentia] = useState(true);
  const [proxy, setProxy] = useState(false);
  const [reason, setReason] = useState(false);
  const [postal, setPostal] = useState(true);

  const [autoFetch, setAutoFetch] = useState(true);
  const [fetchFields, setFetchFields] = useState(['Name', 'CGPA']);

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
    {
      title: 'In-Absentia Settings',
      content: (
        <FormCard
          title="In-Absentia Configuration"
          subtitle="Configure options for students who cannot attend the ceremony in person."
        >
          <div className="flex flex-col gap-6 mt-4">
            <FormGrid columns={2}>
              <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50">
                <Switch
                  checked={inAbsentia}
                  onChange={val => setInAbsentia(val)}
                />
                <div>
                  <h4 className="font-medium text-gray-800">
                    Allow In-Absentia Option
                  </h4>
                  <p className="text-sm text-gray-500">
                    Enable if students can opt out of attending.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50">
                <Switch checked={reason} onChange={val => setReason(val)} />
                <div>
                  <h4 className="font-medium text-gray-800">Reason Required</h4>
                  <p className="text-sm text-gray-500">
                    Require students to state why they can't attend.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50">
                <Switch checked={proxy} onChange={val => setProxy(val)} />
                <div>
                  <h4 className="font-medium text-gray-800">
                    Allow Proxy Collection
                  </h4>
                  <p className="text-sm text-gray-500">
                    Allow an authorized person to collect the degree.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50">
                <Switch checked={postal} onChange={val => setPostal(val)} />
                <div>
                  <h4 className="font-medium text-gray-800">Postal Dispatch</h4>
                  <p className="text-sm text-gray-500">
                    Allow degrees to be sent via courier/post.
                  </p>
                </div>
              </div>
            </FormGrid>
            {postal && (
              <div className="flex flex-col gap-2 max-w-sm">
                <DropDownList
                  label="Courier / Speed Post Service"
                  data={[
                    { label: 'India Post - Speed Post', value: 'speed_post' },
                    { label: 'BlueDart Courier', value: 'bluedart' },
                  ]}
                  value="speed_post"
                  onChange={() => {}}
                />
              </div>
            )}
          </div>
        </FormCard>
      ),
    },
    {
      title: 'Form Fields Config',
      content: (
        <FormCard
          title="Auto-Fetch & Extra Fields"
          subtitle="Configure how student data is populated and add custom form fields."
        >
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4 border-b pb-6">
              <Switch checked={autoFetch} onChange={val => setAutoFetch(val)} />
              <div>
                <h4 className="font-medium text-gray-800">
                  Auto-Fetch Student Details
                </h4>
                <p className="text-sm text-gray-500">
                  Automatically pull details from SIS when the student enters
                  their roll number.
                </p>
              </div>
            </div>

            {autoFetch && (
              <div className="flex flex-col gap-2 max-w-md">
                <MultiSelectList
                  label="Auto-Fetch Fields"
                  data={[
                    'Name',
                    'Programme',
                    'Department',
                    'CGPA',
                    'Year of Passing',
                  ]}
                  value={fetchFields}
                  onChange={val => setFetchFields(val)}
                />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-dashed">
              <h4 className="font-medium text-gray-800 mb-2">
                Extra Fields (Custom Form Questions)
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Add custom fields for students to fill out during registration.
              </p>
              <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    T-Shirt Size for Convocation Gown
                  </h4>
                  <p className="text-sm text-gray-500">
                    Type: Dropdown | Required: Yes
                  </p>
                </div>
                <Button label="Edit" outlined />
              </div>
              <div className="mt-4">
                <Button
                  label="Add Custom Field"
                  icon="pi pi-plus"
                  outlined
                  severity="info"
                />
              </div>
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
