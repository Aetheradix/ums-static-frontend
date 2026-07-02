import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import { statusVariant } from '../../../mocks';
import { useCreateScheme, useFunds, useSchemes } from '../../../queries';

export default function SchemesPage() {
  const { data: schemes } = useSchemes();
  const { data: funds } = useFunds();
  const createScheme = useCreateScheme();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [schemeName, setSchemeName] = useState('');
  const [linkedFund, setLinkedFund] = useState('');
  const [awardNature, setAwardNature] = useState('');
  const [awardValue, setAwardValue] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [targetGroup, setTargetGroup] = useState('All');
  const [department, setDepartment] = useState('Any');
  const [minCGPA, setMinCGPA] = useState('');
  const [incomeCriteria, setIncomeCriteria] = useState('None');
  const [description, setDescription] = useState('');

  const handleSave = (status: string) => {
    if (!schemeName || !linkedFund || !awardNature || !awardValue) {
      ToastService.error('Please fill in all required fields');
      return;
    }
    createScheme.mutate(
      {
        name: schemeName,
        fundName: linkedFund,
        awardType: awardNature,
        budget: Number(awardValue) || 100000,
        status,
        startDate: startDate ? startDate.toLocaleDateString() : '',
        endDate: endDate ? endDate.toLocaleDateString() : '',
        targetGroup,
        department,
        minCGPA: Number(minCGPA) || 0,
        incomeCriteria,
        description,
      },
      {
        onSuccess: () => {
          ToastService.success(
            `Scheme ${status === 'Active' ? 'published' : 'saved as draft'} successfully!`
          );
          setIsPopupOpen(false);
          setSchemeName('');
          setLinkedFund('');
          setAwardNature('');
          setAwardValue('');
          setStartDate(undefined);
          setEndDate(undefined);
          setTargetGroup('All');
          setDepartment('Any');
          setMinCGPA('');
          setIncomeCriteria('None');
          setDescription('');
        },
      }
    );
  };

  const fundOptions = funds?.map(f => ({ text: f.name, value: f.name })) || [];

  const columns: Controls.ColumnProps<any>[] = [
    { header: 'Scheme Name', field: 'name' },
    { header: 'Linked Fund', field: 'fundName' },
    { header: 'Award Type', field: 'awardType' },
    {
      header: 'Budget',
      field: 'budget',
      cell: (row: any) => <span>₹{row.budget?.toLocaleString()}</span>,
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
      title="Schemes & Programmes"
      description="Create scholarships, prizes, and define eligibility."
      breadcrumbs={[
        { label: 'Endowment Management', to: '/endowment-management' },
        { label: 'Admin Portal', to: '/endowment-management/admin' },
        { label: 'Schemes' },
      ]}
    >
      {!selectedScheme ? (
        <FormCard
          title="All Schemes"
          headerAction={
            <Button
              label="Create Scheme"
              icon="add_task"
              variant="primary"
              onClick={() => setIsPopupOpen(true)}
            />
          }
        >
          <GridPanel
            columns={columns}
            data={schemes || []}
            selectionMode="single"
            onSelectionChange={(e: any) => setSelectedScheme(e.value)}
          />
        </FormCard>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between">
            <Button
              label="Back to Schemes"
              icon="arrow_back"
              variant="outlined"
              onClick={() => setSelectedScheme(null)}
            />
          </div>
          <FormCard title="Scheme Details">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedScheme.name}</h3>
                <p className="text-gray-500">Fund: {selectedScheme.fundName}</p>
              </div>
              <div className="text-right">
                <StatusBadge
                  label={selectedScheme.status}
                  variant={statusVariant(selectedScheme.status)}
                />
                <p className="text-sm font-semibold mt-1">
                  Budget: ₹{selectedScheme.budget?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Tabs
                tabs={[
                  { title: 'Overview', content: null },
                  { title: 'Eligibility Rules', content: null },
                  { title: 'Applicants & Shortlist', content: null },
                ]}
                activeIndex={activeTab}
                onTabChange={e => setActiveTab(e.index)}
              />

              <div className="mt-4 p-4 border rounded bg-white min-h-[150px]">
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedScheme.description ||
                          'This scheme provides endowment assistance to qualified students based on the specified criteria.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
                      <div>
                        <strong>Award Nature:</strong>{' '}
                        {selectedScheme.awardType}
                      </div>
                      <div>
                        <strong>Target Students:</strong>{' '}
                        {selectedScheme.targetGroup || 'All'}
                      </div>
                      <div>
                        <strong>Department:</strong>{' '}
                        {selectedScheme.department || 'Any'}
                      </div>
                      {selectedScheme.minCGPA && (
                        <div>
                          <strong>Min CGPA Requirement:</strong>{' '}
                          {selectedScheme.minCGPA}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <p className="text-gray-500 italic">
                    Eligibility parameters and rule validation criteria appear
                    here.
                  </p>
                )}
                {activeTab === 2 && (
                  <p className="text-gray-500 italic">
                    Student applications and current selection status appear
                    here.
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
          title="Create Scheme"
          onHide={() => setIsPopupOpen(false)}
          size="lg"
          footer={
            <div className="flex gap-2 justify-end w-full">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setIsPopupOpen(false)}
              />
              <Button
                label="Save as Draft"
                variant="outlined"
                onClick={() => handleSave('Draft')}
              />
              <Button
                label="Publish Scheme"
                variant="primary"
                onClick={() => handleSave('Active')}
              />
            </div>
          }
        >
          <div className="space-y-4 p-4 h-[450px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <TextBox
                label="Scheme Name"
                placeholder="Enter Scheme Name"
                value={schemeName}
                onChange={val => setSchemeName(String(val))}
                required
              />
              <DropDownList
                label="Linked Fund"
                data={fundOptions}
                textField="text"
                valueField="value"
                placeholder="Select Fund"
                defaultOptionText="Select Fund"
                value={linkedFund}
                onChange={val => setLinkedFund((val as string) || '')}
                required
              />
              <DropDownList
                label="Award Nature"
                data={[
                  'Scholarship',
                  'Medal',
                  'Cash Prize',
                  'Research Grant',
                ].map(v => ({ text: v, value: v }))}
                textField="text"
                valueField="value"
                placeholder="Select Award Nature"
                defaultOptionText="Select Award Nature"
                value={awardNature}
                onChange={val => setAwardNature((val as string) || '')}
                required
              />
              <TextBox
                label="Award Value (₹) / Description"
                placeholder="Enter Value or Description"
                value={awardValue}
                onChange={val => setAwardValue(String(val))}
                required
              />
              <DatePicker
                label="Application Start Date"
                value={startDate}
                onChange={val => setStartDate((val as Date) || undefined)}
              />
              <DatePicker
                label="Application End Date"
                value={endDate}
                onChange={val => setEndDate((val as Date) || undefined)}
              />
            </div>

            <div className="mt-4">
              <h5 className="font-semibold text-gray-700 mb-2">
                Eligibility & Requirements
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <DropDownList
                  label="Target Student Group"
                  data={['UG', 'PG', 'PhD', 'All'].map(v => ({
                    text: v,
                    value: v,
                  }))}
                  textField="text"
                  valueField="value"
                  placeholder="Select Student Group"
                  defaultOptionText="Select Student Group"
                  value={targetGroup}
                  onChange={val => setTargetGroup((val as string) || 'All')}
                />
                <DropDownList
                  label="Department / Faculty"
                  data={['Any', 'Engineering', 'Science', 'Arts'].map(v => ({
                    text: v,
                    value: v,
                  }))}
                  textField="text"
                  valueField="value"
                  placeholder="Select Department / Faculty"
                  defaultOptionText="Select Department / Faculty"
                  value={department}
                  onChange={val => setDepartment((val as string) || 'Any')}
                />
                <TextBox
                  label="Minimum CGPA (if applicable)"
                  placeholder="e.g. 8.5"
                  value={minCGPA}
                  onChange={val => setMinCGPA(String(val))}
                />
                <DropDownList
                  label="Income Criteria"
                  data={['None', 'Below 2L', 'Below 5L', 'Below 8L'].map(v => ({
                    text: v,
                    value: v,
                  }))}
                  textField="text"
                  valueField="value"
                  placeholder="Select Income Criteria"
                  defaultOptionText="Select Income Criteria"
                  value={incomeCriteria}
                  onChange={val => setIncomeCriteria((val as string) || 'None')}
                />
              </div>
            </div>
            <h4 className="font-bold text-gray-700 border-b pb-2 mt-4">
              Description & Eligibility
            </h4>
            <TextArea
              label="Scheme Description (Shown to students)"
              placeholder="Enter scheme details shown to students"
              rows={3}
              value={description}
              onChange={val => setDescription(String(val))}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Note: You can add specific Eligibility Parameters from the detail
              view after creation.
            </p>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
