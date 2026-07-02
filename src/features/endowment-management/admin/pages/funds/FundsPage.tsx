import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import {
  useCreateFund,
  useDonors,
  useEndowmentTypes,
  useFundCategories,
  useFunds,
} from '../../../queries';

export default function FundsPage() {
  const { data: funds } = useFunds();
  const { data: donors } = useDonors();
  const { data: types } = useEndowmentTypes();
  const { data: categories } = useFundCategories();
  const createFund = useCreateFund();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [wizardStep, setWizardStep] = useState(1);

  const [fundName, setFundName] = useState('');
  const [endowmentType, setEndowmentType] = useState('');
  const [fundCategory, setFundCategory] = useState('');
  const [primaryDonor, setPrimaryDonor] = useState('');
  const [targetCorpus, setTargetCorpus] = useState('');
  const [duration, setDuration] = useState('Perpetual');
  const [purposeTerms, setPurposeTerms] = useState('');
  const [investmentMode, setInvestmentMode] = useState('Fixed Deposit');
  const [expectedYield, setExpectedYield] = useState('');

  const handleSave = () => {
    if (!fundName || !endowmentType || !fundCategory || !primaryDonor) {
      ToastService.error('Please fill in all required fields');
      return;
    }
    createFund.mutate(
      {
        name: fundName,
        type: endowmentType,
        category: fundCategory,
        donor: primaryDonor,
        targetCorpus: Number(targetCorpus) || 0,
        currentCorpus: 0,
        duration,
        purpose: purposeTerms,
        investmentMode,
        expectedYield: Number(expectedYield) || 0,
      },
      {
        onSuccess: () => {
          ToastService.success('Endowment Fund created successfully!');
          setIsPopupOpen(false);
          setWizardStep(1);
          setFundName('');
          setEndowmentType('');
          setFundCategory('');
          setPrimaryDonor('');
          setTargetCorpus('');
          setPurposeTerms('');
          setExpectedYield('');
        },
      }
    );
  };

  const donorOptions =
    donors?.map(d => ({ text: d.name, value: d.name })) || [];
  const typeOptions = types?.map(t => ({ text: t.name, value: t.name })) || [];
  const catOptions =
    categories?.map(c => ({ text: c.name, value: c.name })) || [];

  const columns: any[] = [
    { header: 'Fund Code', field: 'fundCode' },
    { header: 'Fund Name', field: 'name' },
    { header: 'Category', field: 'category' },
    {
      header: 'Current Corpus',
      field: 'currentCorpus',
      cell: (row: any) => <span>₹{row.currentCorpus?.toLocaleString()}</span>,
    },
    {
      header: 'Status',
      field: 'status',
      cell: (row: any) => (
        <StatusBadge label={row.status} variant={statusVariant(row.status)} />
      ),
    },
  ];

  return (
    <FormPage
      title="Endowment Funds"
      description="Manage funds, corpus growth, and linked schemes."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Endowment Funds' },
      ]}
    >
      {!selectedFund ? (
        <FormCard
          title="All Funds"
          headerAction={
            <Button
              label="Create Fund"
              icon="add_circle"
              variant="primary"
              onClick={() => {
                setWizardStep(1);
                setIsPopupOpen(true);
              }}
            />
          }
        >
          <GridPanel
            columns={columns}
            data={funds || []}
            selectionMode="single"
            onSelectionChange={(e: any) => setSelectedFund(e.value)}
          />
        </FormCard>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between">
            <Button
              label="Back to Funds"
              icon="arrow_back"
              variant="outlined"
              onClick={() => setSelectedFund(null)}
            />
          </div>

          <FormCard title={`Fund Details: ${selectedFund.name}`}>
            <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border">
              <div>
                <p className="text-xs text-gray-500 font-medium">Fund Code</p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedFund.fundCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Category</p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedFund.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Status</p>
                <StatusBadge
                  label={selectedFund.status}
                  variant={statusVariant(selectedFund.status)}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Current Corpus
                </p>
                <p className="text-sm font-bold text-slate-800">
                  ₹{selectedFund.currentCorpus?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Target Corpus
                </p>
                <p className="text-sm font-bold text-slate-800">
                  ₹{selectedFund.targetCorpus?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Primary Donor
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedFund.donor}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Tabs
                tabs={[
                  { title: 'Overview', content: null },
                  { title: 'Linked Schemes', content: null },
                  { title: 'Donations Log', content: null },
                  { title: 'Disbursement & Yields', content: null },
                ]}
                activeIndex={activeTab}
                onTabChange={e => setActiveTab(e.index)}
              />

              <div className="mt-4 p-4 border rounded bg-white min-h-[150px]">
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-700">
                        Purpose & Terms (MoU)
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedFund.purpose ||
                          'This fund is created to support academic excellence and student research in the designated category.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <strong>Duration:</strong>{' '}
                        {selectedFund.duration || 'Perpetual'}
                      </div>
                      <div>
                        <strong>Investment Mode:</strong>{' '}
                        {selectedFund.investmentMode || 'Fixed Deposit'}
                      </div>
                      {selectedFund.expectedYield && (
                        <div>
                          <strong>Expected Yield:</strong>{' '}
                          {selectedFund.expectedYield}%
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <p className="text-gray-500 italic">
                    List of scholarship/award schemes mapped to this fund will
                    appear here.
                  </p>
                )}
                {activeTab === 2 && (
                  <p className="text-gray-500 italic">
                    History of donor transactions credited to this corpus.
                  </p>
                )}
                {activeTab === 3 && (
                  <p className="text-gray-500 italic">
                    Detailed yearly utilization summary will appear here.
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
          title="Add New Fund"
          onHide={() => setIsPopupOpen(false)}
          size="lg"
          footer={
            <div className="flex gap-2 justify-between w-full">
              {wizardStep === 2 ? (
                <Button
                  label="Back"
                  variant="outlined"
                  onClick={() => setWizardStep(1)}
                />
              ) : (
                <div></div>
              )}
              <div className="flex gap-2">
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => setIsPopupOpen(false)}
                />
                {wizardStep === 1 ? (
                  <Button
                    label="Next"
                    variant="primary"
                    onClick={() => setWizardStep(2)}
                  />
                ) : (
                  <Button
                    label="Create Fund"
                    variant="primary"
                    onClick={handleSave}
                  />
                )}
              </div>
            </div>
          }
        >
          <div className="p-4 h-[400px] overflow-y-auto">
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 border-b pb-2">
                  Basic Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <TextBox
                    label="Fund Name"
                    placeholder="Enter Fund Name"
                    value={fundName}
                    onChange={val => setFundName(String(val))}
                    required
                  />
                  <DropDownList
                    label="Endowment Type"
                    data={typeOptions}
                    textField="text"
                    valueField="value"
                    placeholder="Select Type"
                    defaultOptionText="Select Type"
                    value={endowmentType}
                    onChange={val => setEndowmentType((val as string) || '')}
                    required
                  />
                  <DropDownList
                    label="Fund Category"
                    data={catOptions}
                    textField="text"
                    valueField="value"
                    placeholder="Select Category"
                    defaultOptionText="Select Category"
                    value={fundCategory}
                    onChange={val => setFundCategory((val as string) || '')}
                    required
                  />
                  <DropDownList
                    label="Primary Donor"
                    data={donorOptions}
                    textField="text"
                    valueField="value"
                    placeholder="Select Donor"
                    defaultOptionText="Select Donor"
                    value={primaryDonor}
                    onChange={val => setPrimaryDonor((val as string) || '')}
                    required
                  />
                  <TextBox
                    label="Target Corpus (₹)"
                    type="number"
                    placeholder="Enter Target Corpus"
                    value={targetCorpus}
                    onChange={val => setTargetCorpus(String(val))}
                    required
                  />
                  <DropDownList
                    label="Duration"
                    data={['Perpetual', 'Fixed Term'].map(v => ({
                      text: v,
                      value: v,
                    }))}
                    textField="text"
                    valueField="value"
                    placeholder="Select Duration"
                    defaultOptionText="Select Duration"
                    value={duration}
                    onChange={val =>
                      setDuration((val as string) || 'Perpetual')
                    }
                    required
                  />
                </div>
              </div>
            )}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 border-b pb-2">
                  Terms & Conditions
                </h4>
                <TextArea
                  label="Purpose / Terms (As per MoU)"
                  placeholder="Enter purpose or terms"
                  rows={4}
                  value={purposeTerms}
                  onChange={val => setPurposeTerms(String(val))}
                  required
                />
                <DropDownList
                  label="Investment Mode"
                  data={[
                    'Fixed Deposit',
                    'Bonds',
                    'University Pool',
                    'Managed Portfolio',
                  ].map(v => ({ text: v, value: v }))}
                  textField="text"
                  valueField="value"
                  placeholder="Select Investment Mode"
                  defaultOptionText="Select Investment Mode"
                  value={investmentMode}
                  onChange={val =>
                    setInvestmentMode((val as string) || 'Fixed Deposit')
                  }
                />
                <TextBox
                  label="Expected Yield %"
                  type="number"
                  placeholder="Enter Expected Yield"
                  value={expectedYield}
                  onChange={val => setExpectedYield(String(val))}
                />
              </div>
            )}
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
