import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { QK, useCreateDonor, useDonors } from '../../../queries';

export default function DonorsPage() {
  const qc = useQueryClient();
  const { data: donors } = useDonors();
  const createDonor = useCreateDonor();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [category, setCategory] = useState('Individual');
  const [type, setType] = useState('Alumni');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pan, setPan] = useState('');
  const [batch, setBatch] = useState('');
  const [cin, setCin] = useState('');

  const handleSave = () => {
    if (!name || !email || !mobile) {
      ToastService.error('Please fill in all required fields');
      return;
    }
    createDonor.mutate(
      {
        name,
        type,
        category,
        lifetimeContribution: 0,
        recognition: 'Silver',
        status: 'Active',
        email,
        mobile,
        pan,
        batch,
        cin,
      },
      {
        onSuccess: () => {
          ToastService.success('Donor registered successfully!');
          setIsPopupOpen(false);
          setName('');
          setEmail('');
          setMobile('');
          setPan('');
          setBatch('');
          setCin('');
        },
      }
    );
  };

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Donor Name', field: 'name' },
    { header: 'Type', field: 'type' },
    { header: 'Category', field: 'category' },
    {
      header: 'Lifetime Contribution',
      field: 'lifetimeContribution',
      cell: (row: any) => (
        <span>₹{row.lifetimeContribution?.toLocaleString()}</span>
      ),
    },
    {
      header: 'Recognition',
      field: 'recognition',
      cell: (row: any) => (
        <StatusBadge label={row.recognition} variant="pending" />
      ),
    },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <button
          type="button"
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
            row.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
          }`}
          onClick={e => {
            e.stopPropagation();
            qc.setQueryData(QK.DONORS, (old: any) =>
              old?.map((item: any) =>
                item.id === row.id
                  ? {
                      ...item,
                      status: item.status === 'Active' ? 'Inactive' : 'Active',
                    }
                  : item
              )
            );
            ToastService.success('Status updated successfully');
          }}
        >
          {row.status || 'Active'}
        </button>
      ),
    },
  ];

  return (
    <FormPage
      title="Donor Management"
      description="Manage individual and institutional donors."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Donors' },
      ]}
    >
      {!selectedDonor ? (
        <FormCard
          title="All Donors"
          headerAction={
            <Button
              label="Register Donor"
              icon="person_add"
              variant="primary"
              onClick={() => setIsPopupOpen(true)}
            />
          }
        >
          <GridPanel
            columns={columns}
            data={donors || []}
            selectionMode="single"
            onSelectionChange={(e: any) => setSelectedDonor(e.value)}
          />
        </FormCard>
      ) : (
        <div className="space-y-6">
          <Button
            label="Back to Donors"
            icon="arrow_back"
            variant="outlined"
            onClick={() => setSelectedDonor(null)}
          />

          <FormCard title="Donor Details">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedDonor.name}</h3>
                <p className="text-gray-500">
                  {selectedDonor.type} • {selectedDonor.category}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge
                  label={selectedDonor.recognition}
                  variant="pending"
                />
                <p className="text-sm font-medium mt-1">
                  Lifetime: ₹
                  {selectedDonor.lifetimeContribution.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Tabs
                tabs={[
                  { title: 'Profile Details', content: null },
                  { title: 'Donations', content: null },
                  { title: 'Documents', content: null },
                ]}
                activeIndex={activeTab}
                onTabChange={e => setActiveTab(e.index)}
              />

              <div className="mt-4 p-4 border rounded bg-gray-50">
                {activeTab === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Email:</strong> {selectedDonor.email}
                    </div>
                    <div>
                      <strong>Mobile:</strong> {selectedDonor.mobile}
                    </div>
                    {selectedDonor.pan && (
                      <div>
                        <strong>PAN Number:</strong> {selectedDonor.pan}
                      </div>
                    )}
                    {selectedDonor.cin && (
                      <div>
                        <strong>CIN:</strong> {selectedDonor.cin}
                      </div>
                    )}
                    {selectedDonor.signatory && (
                      <div>
                        <strong>Signatory:</strong> {selectedDonor.signatory}
                      </div>
                    )}
                    {selectedDonor.batch && (
                      <div>
                        <strong>Batch:</strong> {selectedDonor.batch}
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 1 && (
                  <p className="text-gray-500 italic">
                    Donation history will be listed here.
                  </p>
                )}
                {activeTab === 2 && (
                  <p className="text-gray-500 italic">
                    Uploaded documents (KYC, PAN copy) will be listed here.
                  </p>
                )}
              </div>
            </div>
          </FormCard>
        </div>
      )}

      {isPopupOpen && (
        <FormPopup
          visible={isPopupOpen}
          title="Register New Donor"
          onHide={() => setIsPopupOpen(false)}
          size="lg"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setIsPopupOpen(false)}
              />
              <Button label="Register" variant="primary" onClick={handleSave} />
            </div>
          }
        >
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <DropDownList
                label="Donor Category"
                data={['Individual', 'Institutional'].map(v => ({
                  text: v,
                  value: v,
                }))}
                textField="text"
                valueField="value"
                placeholder="Select Category"
                defaultOptionText="Select Category"
                value={category}
                onChange={val => setCategory((val as string) || 'Individual')}
                required
              />
              <DropDownList
                label="Donor Type"
                data={[
                  'Alumni',
                  'Corporate (CSR)',
                  'Retired Faculty',
                  'Trust/Foundation',
                  'Philanthropist',
                ].map(v => ({ text: v, value: v }))}
                textField="text"
                valueField="value"
                placeholder="Select Type"
                defaultOptionText="Select Type"
                value={type}
                onChange={val => setType((val as string) || 'Alumni')}
                required
              />
              <TextBox
                label="Full Name / Organisation Name"
                placeholder="Enter Full Name / Organisation Name"
                value={name}
                onChange={val => setName(String(val))}
                required
              />
              <TextBox
                label="Email Address"
                placeholder="Enter Email Address"
                value={email}
                onChange={val => setEmail(String(val))}
                required
              />
              <TextBox
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={val => setMobile(String(val))}
                required
              />
              <TextBox
                label="PAN Number (Required for 80G)"
                placeholder="Enter PAN Number"
                value={pan}
                onChange={val => setPan(String(val))}
              />
              <TextBox
                label="Alumni Batch / Dept (If applicable)"
                placeholder="Enter Alumni Batch / Dept"
                value={batch}
                onChange={val => setBatch(String(val))}
              />
              <TextBox
                label="CIN / Registration (If Institutional)"
                placeholder="Enter CIN / Registration"
                value={cin}
                onChange={val => setCin(String(val))}
              />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
