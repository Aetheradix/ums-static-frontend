import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FormSubSection,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  usePayrollStore,
  type EarningDeductionHead,
} from '../store/usePayrollStore';

// Date Helpers
const formatDate = (date?: Date | null): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export default function EarningAndDeduction() {
  const { heads, addHead, updateHead, toggleStatus, deleteHead } =
    usePayrollStore();

  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit' | 'view';
    data?: EarningDeductionHead;
  }>({ mode: 'closed' });

  // Form states
  const [headType, setHeadType] = useState<string>('Earning');
  const [headCode, setHeadCode] = useState<string>('');
  const [headName, setHeadName] = useState<string>('');
  const [calculationMethod, setCalculationMethod] =
    useState<string>('Amount(Rs)');
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date());

  // Rule checkboxes
  const [calculateBetweenRange, setCalculateBetweenRange] = useState(false);
  const [impactOnLeave, setImpactOnLeave] = useState(false);
  const [da, setDa] = useState(false);
  const [nps, setNps] = useState(false);
  const [tax, setTax] = useState(false);
  const [contribution, setContribution] = useState(false);

  // Show In Page checkboxes
  const [salaryHead, setSalaryHead] = useState(true);
  const [optional, setOptional] = useState(false);
  const [monthly, setMonthly] = useState(true);
  const [policy, setPolicy] = useState(false);
  const [loan, setLoan] = useState(false);

  // Reset form to defaults
  const handleClear = () => {
    setHeadType('Earning');
    setHeadCode('');
    setHeadName('');
    setCalculationMethod('Amount(Rs)');
    setEffectiveDate(new Date());

    setCalculateBetweenRange(false);
    setImpactOnLeave(false);
    setDa(false);
    setNps(false);
    setTax(false);
    setContribution(false);

    setSalaryHead(true);
    setOptional(false);
    setMonthly(true);
    setPolicy(false);
    setLoan(false);
  };

  const handleCreateOpen = () => {
    handleClear();
    setPopup({ mode: 'create' });
  };

  // Load record for editing
  const handleEditOpen = (item: EarningDeductionHead) => {
    setHeadType(item.type);
    setHeadCode(item.code);
    setHeadName(item.name);
    setCalculationMethod(item.calculationMethod);
    setEffectiveDate(parseDateString(item.effectiveDate));

    setCalculateBetweenRange(item.calculateBetweenRange);
    setImpactOnLeave(item.impactOnLeave);
    setDa(item.da);
    setNps(item.nps);
    setTax(item.tax);
    setContribution(item.contribution);

    setSalaryHead(item.salaryHead);
    setOptional(item.optional);
    setMonthly(item.monthly);
    setPolicy(item.policy);
    setLoan(item.loan);

    setPopup({ mode: 'edit', data: item });
  };

  const handleViewOpen = (item: EarningDeductionHead) => {
    setPopup({ mode: 'view', data: item });
  };

  // Submit / Save form
  const handleSave = () => {
    if (!headType || headType === 'Select') {
      ToastService.error('Earning & Deduction Head Type is required');
      return;
    }
    if (!headCode.trim()) {
      ToastService.error('Earning & Deduction Head Code is required');
      return;
    }
    if (!headName.trim()) {
      ToastService.error('Earning & Deduction Head Name is required');
      return;
    }
    if (!calculationMethod || calculationMethod === 'Select') {
      ToastService.error('Calculation Method is required');
      return;
    }
    if (!effectiveDate) {
      ToastService.error('Effective Date is required');
      return;
    }

    const payload = {
      type: headType as 'Earning' | 'Deduction',
      code: headCode.trim(),
      name: headName.trim(),
      calculationMethod,
      effectiveDate: formatDate(effectiveDate),
      status: popup.mode === 'edit' && popup.data ? popup.data.status : true,
      calculateBetweenRange,
      impactOnLeave,
      da,
      nps,
      tax,
      contribution,
      salaryHead,
      optional,
      monthly,
      policy,
      loan,
    };

    if (popup.mode === 'edit' && popup.data) {
      updateHead(popup.data.id, payload);
      ToastService.success('Record updated successfully.');
    } else {
      addHead(payload);
      ToastService.success('Record saved successfully.');
    }

    setPopup({ mode: 'closed' });
    handleClear();
  };

  return (
    <FormPage
      title="Earning & Deduction Head Master"
      description="Create, edit, and configure various types of earning and deduction heads, computation parameters, and page displays."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Payroll Baseline Data',
          to: '/payroll-management/earning-deduction',
        },
        { label: 'Earning And Deduction' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={heads}
          searchBox
          searchPlaceholder="Search head name or code..."
          onEdit={handleEditOpen}
          onRemove={item => {
            deleteHead(item.id);
            ToastService.success(`Record for ${item.name} deleted.`);
          }}
          columns={[
            {
              header: 'Sr.No.',
              width: '70px',
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
            },
            {
              header: 'Earning & Deduction Head Type',
              field: 'type',
              sortable: true,
            },
            {
              header: 'Earning & Deduction Head Code',
              field: 'code',
              sortable: true,
            },
            {
              header: 'Earning & Deduction Head Name',
              field: 'name',
              sortable: true,
            },
            {
              header: 'Calculation Method',
              field: 'calculationMethod',
              sortable: true,
            },
            {
              header: 'Effective Date',
              field: 'effectiveDate',
              sortable: true,
            },
            {
              header: 'Status',
              cell: (item: EarningDeductionHead) => (
                <button
                  onClick={() => {
                    toggleStatus(item.id);
                    ToastService.success(`Status updated for ${item.name}`);
                  }}
                  className="cursor-pointer border-none bg-transparent hover:opacity-85 transition-opacity"
                  title="Click to toggle status"
                >
                  <StatusBadge
                    label={item.status ? 'Yes' : 'No'}
                    variant={item.status ? 'approved' : 'rejected'}
                  />
                </button>
              ),
            },
            {
              header: 'View Details',
              width: '80px',
              cell: (item: EarningDeductionHead) => (
                <button
                  onClick={() => handleViewOpen(item)}
                  className="p-1 px-2 border rounded hover:bg-gray-50 text-indigo-600 border-gray-200 cursor-pointer transition-all"
                  title="View Details"
                >
                  <i className="pi pi-eye text-xs" />
                </button>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Earning & Deduction Head"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
        />
      </FormCard>

      {/* Add / Edit Popup Form */}
      <FormPopup
        visible={popup.mode === 'create' || popup.mode === 'edit'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Create Earning & Deduction Head'
            : 'Edit Earning & Deduction Head'
        }
        subtitle="Define basic parameters, calculations, and rules."
        size="lg"
      >
        <div className="flex flex-col gap-5 py-2">
          {/* Section 1: Basic Head Info */}
          <FormGrid columns={2} className="gap-4">
            <DropDownList
              label="Earning & Deduction Head Type"
              data={[
                { text: 'Earning', value: 'Earning' },
                { text: 'Deduction', value: 'Deduction' },
              ]}
              textField="text"
              valueField="value"
              value={headType}
              onChange={val => setHeadType(val as string)}
              required
            />

            <TextBox
              label="Earning & Deduction Head Code"
              placeholder="e.g. 03"
              value={headCode}
              onChange={setHeadCode}
              required
            />
          </FormGrid>

          <TextBox
            label="Earning & Deduction Head Name"
            placeholder="e.g. CONVEYANCE ALLOWANCE"
            value={headName}
            onChange={setHeadName}
            required
          />

          <FormGrid columns={2} className="gap-4">
            <DropDownList
              label="Calculation Method"
              data={[
                { text: 'Amount(Rs)', value: 'Amount(Rs)' },
                {
                  text: 'Percentage(%) (Basic)',
                  value: 'Percentage(%) (Basic)',
                },
                { text: 'Loan', value: 'Loan' },
              ]}
              textField="text"
              valueField="value"
              value={calculationMethod}
              onChange={val => setCalculationMethod(val as string)}
              required
            />

            <DatePicker
              label="Effective Date"
              value={effectiveDate || undefined}
              onChange={val => setEffectiveDate(val || null)}
              required
            />
          </FormGrid>

          {/* Section 2: Calculation Rules */}
          <FormSubSection title="Calculation Rules & Adjustments" icon="cog">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 mt-3">
              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={calculateBetweenRange}
                  onChange={e => setCalculateBetweenRange(e.checked ?? false)}
                />
                <span className="ml-2.5">Calculate b/w range</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={impactOnLeave}
                  onChange={e => setImpactOnLeave(e.checked ?? false)}
                />
                <span className="ml-2.5">Impact On Leave</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={da}
                  onChange={e => setDa(e.checked ?? false)}
                />
                <span className="ml-2.5">DA</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={nps}
                  onChange={e => setNps(e.checked ?? false)}
                />
                <span className="ml-2.5">NPS</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={tax}
                  onChange={e => setTax(e.checked ?? false)}
                />
                <span className="ml-2.5">TAX</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={contribution}
                  onChange={e => setContribution(e.checked ?? false)}
                />
                <span className="ml-2.5">Contribution</span>
              </label>
            </div>
          </FormSubSection>

          {/* Section 3: Page Visibility */}
          <FormSubSection title="Page Visibility Settings" icon="eye">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 mt-3">
              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={salaryHead}
                  onChange={e => setSalaryHead(e.checked ?? false)}
                />
                <span className="ml-2.5">Salary Head</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={optional}
                  onChange={e => setOptional(e.checked ?? false)}
                />
                <span className="ml-2.5">Optional</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={monthly}
                  onChange={e => setMonthly(e.checked ?? false)}
                />
                <span className="ml-2.5">Monthly</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={policy}
                  onChange={e => setPolicy(e.checked ?? false)}
                />
                <span className="ml-2.5">Policy</span>
              </label>

              <label className="flex items-center text-sm text-gray-700 font-semibold cursor-pointer select-none">
                <PrimeCheckbox
                  checked={loan}
                  onChange={e => setLoan(e.checked ?? false)}
                />
                <span className="ml-2.5">Loan</span>
              </label>
            </div>
          </FormSubSection>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setPopup({ mode: 'closed' })}
            />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </div>
      </FormPopup>

      {/* Read-Only Details View Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Earning & Deduction Details"
        subtitle={popup.data?.name}
        size="lg"
      >
        {popup.data && (
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4 border-b pb-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Head Type</span>
                <span className="font-bold text-gray-700">
                  {popup.data.type}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Head Code</span>
                <span className="font-bold text-gray-700">
                  {popup.data.code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">
                  Calculation Method
                </span>
                <span className="font-bold text-gray-700">
                  {popup.data.calculationMethod}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">
                  Effective Date
                </span>
                <span className="font-bold text-gray-700">
                  {popup.data.effectiveDate}
                </span>
              </div>
            </div>

            <div className="border-b pb-3 text-sm">
              <span className="text-gray-400 block text-xs mb-2">
                Rules & Configuration
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.calculateBetweenRange ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Calculate b/w range</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.impactOnLeave ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Impact On Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.da ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">DA</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.nps ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">NPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.tax ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">TAX</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.contribution ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Contribution</span>
                </div>
              </div>
            </div>

            <div className="pb-3 text-sm">
              <span className="text-gray-400 block text-xs mb-2">
                Show In Page
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.salaryHead ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Salary Head</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.optional ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Optional</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.monthly ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.policy ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <i
                    className={`pi ${popup.data.loan ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-400'}`}
                  />
                  <span className="text-gray-600">Loan</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
