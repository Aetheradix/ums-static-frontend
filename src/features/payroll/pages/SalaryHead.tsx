import { useState, useEffect } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  DropDownList,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';
import { ToastService } from 'services';
import {
  usePayrollStore,
  type SalaryHeadValue,
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

const POST_TYPES = [
  { text: 'Regular/Permanent', value: 'Regular/Permanent' },
  { text: 'Temporary', value: 'Temporary' },
  { text: 'Workcharged', value: 'Workcharged' },
];

const COMMISSION_TYPES = [
  { text: 'Fifth Pay Commission', value: 'Fifth Pay Commission' },
  { text: 'Sixth Pay Commission', value: 'Sixth Pay Commission' },
  { text: 'Seventh Pay Commission', value: 'Seventh Pay Commission' },
];

export default function SalaryHead() {
  const {
    heads,
    salaryHeads,
    addSalaryHead,
    updateSalaryHead,
    toggleSalaryHeadStatus,
    deleteSalaryHead,
  } = usePayrollStore();

  // Search parameters
  const [searchPost, setSearchPost] = useState<string>('Regular/Permanent');
  const [searchType, setSearchType] = useState<string>('Earning');
  const [activeSearchPost, setActiveSearchPost] =
    useState<string>('Regular/Permanent');
  const [activeSearchType, setActiveSearchType] = useState<string>('Earning');

  // Form popup state
  const [popup, setPopup] = useState<{
    mode: 'closed' | 'create' | 'edit' | 'view';
    data?: SalaryHeadValue;
  }>({ mode: 'closed' });

  // Popup Form States
  const [typeOfPost, setTypeOfPost] = useState<string>('Regular/Permanent');
  const [earningDeductionType, setEarningDeductionType] = useState<
    'Earning' | 'Deduction'
  >('Earning');
  const [headId, setHeadId] = useState<string>('');
  const [calculationMethod, setCalculationMethod] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderDocument, setOrderDocument] = useState<string>('');
  const [orderDocFile, setOrderDocFile] = useState<File | null>(null);
  const [orderDate, setOrderDate] = useState<Date | null>(new Date());
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date());
  const [payCommission, setPayCommission] = useState<string>(
    'Sixth Pay Commission'
  );

  // Popup Details View state
  const [selectedDetails, setSelectedDetails] =
    useState<SalaryHeadValue | null>(null);

  // Dynamic filter for heads list inside popup
  const activeAvailableHeads = heads.filter(
    h => h.type === earningDeductionType && h.status
  );

  // Prefill calculation method on head change
  useEffect(() => {
    if (headId) {
      const match = heads.find(h => h.id === headId);
      if (match) {
        setCalculationMethod(match.calculationMethod);
      }
    } else {
      setCalculationMethod('');
    }
  }, [headId, heads]);

  // Sync default head when type changes
  useEffect(() => {
    const firstAvailable = activeAvailableHeads[0];
    if (firstAvailable) {
      setHeadId(firstAvailable.id);
    } else {
      setHeadId('');
    }
  }, [earningDeductionType]);

  const handleClearSearch = () => {
    setSearchPost('Regular/Permanent');
    setSearchType('Earning');
    setActiveSearchPost('Regular/Permanent');
    setActiveSearchType('Earning');
  };

  const handleSearch = () => {
    setActiveSearchPost(searchPost);
    setActiveSearchType(searchType);
    ToastService.success('Filtered records based on search criteria.');
  };

  const handleClearForm = () => {
    setTypeOfPost('Regular/Permanent');
    setEarningDeductionType('Earning');
    const firstAvailable = heads.filter(
      h => h.type === 'Earning' && h.status
    )[0];
    setHeadId(firstAvailable?.id || '');
    setValue('');
    setOrderNumber('');
    setOrderDocument('');
    setOrderDocFile(null);
    setOrderDate(new Date());
    setEffectiveDate(new Date());
    setPayCommission('Sixth Pay Commission');
  };

  const handleCreateOpen = () => {
    handleClearForm();
    setPopup({ mode: 'create' });
  };

  const handleEditOpen = (item: SalaryHeadValue) => {
    setTypeOfPost(item.typeOfPost);
    setEarningDeductionType(item.earningDeductionType);
    setHeadId(item.headId);
    setCalculationMethod(item.calculationMethod);
    setValue(String(item.value));
    setOrderNumber(item.orderNumber);
    setOrderDocument(item.orderDocument);
    setOrderDocFile(null);
    setOrderDate(parseDateString(item.orderDate));
    setEffectiveDate(parseDateString(item.effectiveDate));
    setPayCommission(item.payCommission);
    setPopup({ mode: 'edit', data: item });
  };

  const handleViewOpen = (item: SalaryHeadValue) => {
    setSelectedDetails(item);
    setPopup({ mode: 'view', data: item });
  };

  const handleSave = () => {
    if (!typeOfPost) {
      ToastService.error('Type of Post is required');
      return;
    }
    if (!headId) {
      ToastService.error('Earning & Deduction Head is required');
      return;
    }
    if (!value.trim() || isNaN(Number(value))) {
      ToastService.error('A valid percentage or amount value is required');
      return;
    }
    if (!orderNumber.trim()) {
      ToastService.error('Order Number is required');
      return;
    }
    if (!orderDate) {
      ToastService.error('Order Date is required');
      return;
    }
    if (!effectiveDate) {
      ToastService.error('Effective Date is required');
      return;
    }

    const matchedHead = heads.find(h => h.id === headId);
    if (!matchedHead) return;

    const payload = {
      typeOfPost,
      earningDeductionType,
      headId,
      headName: matchedHead.name,
      calculationMethod: matchedHead.calculationMethod,
      value: Number(value),
      orderNumber: orderNumber.trim(),
      orderDocument: orderDocument || 'order_doc.pdf',
      orderDate: formatDate(orderDate),
      effectiveDate: formatDate(effectiveDate),
      status: popup.mode === 'edit' && popup.data ? popup.data.status : true,
      payCommission,
      minAmount: 0.0,
      maxAmount: 0.0,
    };

    if (popup.mode === 'edit' && popup.data) {
      updateSalaryHead(popup.data.id, payload);
      ToastService.success('Salary Head Value updated successfully.');
    } else {
      addSalaryHead(payload);
      ToastService.success('Salary Head Value created successfully.');
    }

    setPopup({ mode: 'closed' });
    handleClearForm();
  };

  // Filter list matching active search constraints
  const displayedHeads = salaryHeads.filter(
    sh =>
      sh.typeOfPost === activeSearchPost &&
      sh.earningDeductionType === activeSearchType
  );

  return (
    <FormPage
      title="Salary Head Values Master"
      description="Define, update, and search salary head value rules for various posts and pay commission order parameters."
      breadcrumbs={[
        { label: 'Home', to: '/home/menu' },
        { label: 'Payroll', to: '/payroll-management/dashboard' },
        {
          label: 'Set Head Value',
          to: '/payroll-management/set-head-value/salary-head',
        },
        { label: 'Salary Head' },
      ]}
    >
      {/* Search Criteria Block */}
      <FormCard title="Salary Head Selection" className="mb-6">
        <FormGrid columns={2} className="gap-6 mb-4">
          <DropDownList
            label="Type Of Post"
            data={POST_TYPES}
            textField="text"
            valueField="value"
            value={searchPost}
            onChange={val => setSearchPost(val as string)}
            required
          />

          <DropDownList
            label="Earning & Deduction Type"
            data={[
              { text: 'Earning', value: 'Earning' },
              { text: 'Deduction', value: 'Deduction' },
            ]}
            textField="text"
            valueField="value"
            value={searchType}
            onChange={val => setSearchType(val as string)}
            required
          />
        </FormGrid>

        <div className="flex gap-3 justify-start mt-2">
          <Button label="Search" variant="primary" onClick={handleSearch} />
          <Button
            label="Clear"
            variant="outlined"
            onClick={handleClearSearch}
          />
        </div>
      </FormCard>

      {/* Grid listing card */}
      <FormCard title="Common Head Values List">
        <GridPanel
          data={displayedHeads}
          searchBox
          searchPlaceholder="Search head name or order..."
          onEdit={handleEditOpen}
          onRemove={item => {
            deleteSalaryHead(item.id);
            ToastService.success('Record deleted.');
          }}
          columns={[
            {
              header: 'Sr.No.',
              width: '70px',
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
            },
            {
              header: 'Earning & Deduction',
              field: 'headName',
              sortable: true,
            },
            {
              header: 'Pay Commission',
              field: 'payCommission',
              sortable: true,
            },
            {
              header: 'Calculation Method',
              field: 'calculationMethod',
              sortable: true,
            },
            {
              header: 'Minimum Amount(₹)',
              cell: (item: SalaryHeadValue) => (
                <span>₹{item.minAmount.toFixed(2)}</span>
              ),
            },
            {
              header: 'Maximum Amount(₹)',
              cell: (item: SalaryHeadValue) => (
                <span>₹{item.maxAmount.toFixed(2)}</span>
              ),
            },
            {
              header: 'Earning & Deduction Value',
              cell: (item: SalaryHeadValue) => (
                <span className="font-bold text-gray-800">
                  {item.calculationMethod.includes('Percentage')
                    ? `${item.value}%`
                    : `₹${item.value.toFixed(2)}`}
                </span>
              ),
            },
            {
              header: 'Order No.',
              field: 'orderNumber',
            },
            {
              header: 'Order Date',
              field: 'orderDate',
            },
            {
              header: 'Order Doc',
              cell: (item: SalaryHeadValue) => (
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    ToastService.success(
                      `Downloading order document: ${item.orderDocument}`
                    );
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 font-semibold"
                >
                  <i className="pi pi-file-pdf" />
                  <span>View</span>
                </a>
              ),
            },
            {
              header: 'Effective Date',
              field: 'effectiveDate',
            },
            {
              header: 'Status',
              cell: (item: SalaryHeadValue) => (
                <button
                  onClick={() => {
                    toggleSalaryHeadStatus(item.id);
                    ToastService.success('Status updated.');
                  }}
                  className="cursor-pointer border-none bg-transparent hover:opacity-85 transition-opacity"
                  title="Toggle status"
                >
                  <StatusBadge
                    label={item.status ? 'Yes' : 'No'}
                    variant={item.status ? 'approved' : 'rejected'}
                  />
                </button>
              ),
            },
            {
              header: 'View',
              width: '70px',
              cell: (item: SalaryHeadValue) => (
                <button
                  onClick={() => handleViewOpen(item)}
                  className="p-1.5 border border-gray-200 hover:bg-gray-50 text-indigo-600 rounded cursor-pointer transition-all"
                  title="View Details"
                >
                  <i className="pi pi-eye text-xs" />
                </button>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Salary Head Value"
              icon="plus"
              variant="outlined"
              onClick={handleCreateOpen}
            />
          }
        />
      </FormCard>

      {/* Create / Edit Form Popup */}
      <FormPopup
        visible={popup.mode === 'create' || popup.mode === 'edit'}
        onHide={() => setPopup({ mode: 'closed' })}
        title={
          popup.mode === 'create'
            ? 'Create Salary Head Value'
            : 'Edit Salary Head Value'
        }
        subtitle="Configure values and legal order attachments."
        size="lg"
      >
        <div className="flex flex-col gap-5 py-2">
          <FormGrid columns={2} className="gap-4">
            <DropDownList
              label="Earning & Deduction Type"
              data={[
                { text: 'Earning', value: 'Earning' },
                { text: 'Deduction', value: 'Deduction' },
              ]}
              textField="text"
              valueField="value"
              value={earningDeductionType}
              onChange={val => setEarningDeductionType(val as any)}
              required
            />

            <DropDownList
              label="Earning & Deduction Head"
              data={activeAvailableHeads.map(h => ({
                text: h.name,
                value: h.id,
              }))}
              textField="text"
              valueField="value"
              value={headId}
              onChange={val => setHeadId(val as string)}
              required
              defaultOptionText="-- Select Head --"
            />
          </FormGrid>

          <FormGrid columns={2} className="gap-4">
            <TextBox
              label="Calculation Method"
              value={calculationMethod}
              placeholder="Prefilled calculation method"
              disabled
            />

            <DropDownList
              label="Type Of Post"
              data={POST_TYPES}
              textField="text"
              valueField="value"
              value={typeOfPost}
              onChange={val => setTypeOfPost(val as string)}
              required
            />
          </FormGrid>

          <FormGrid columns={2} className="gap-4">
            <DropDownList
              label="Pay Commission"
              data={COMMISSION_TYPES}
              textField="text"
              valueField="value"
              value={payCommission}
              onChange={val => setPayCommission(val as string)}
              required
            />

            <TextBox
              label="Earning & Deduction (Percentage/Amount)"
              placeholder="Enter numerical value"
              value={value}
              onChange={setValue}
              required
            />
          </FormGrid>

          <FormGrid columns={2} className="gap-4">
            <TextBox
              label="Order Number"
              placeholder="Enter Order Number"
              value={orderNumber}
              onChange={setOrderNumber}
              required
            />

            <FileUpload
              label="Order Document"
              mode="file"
              accept=".pdf"
              value={orderDocFile}
              onChange={file => {
                setOrderDocFile(file);
                if (file) setOrderDocument(file.name);
              }}
              uploadNote="Document file should be in .pdf format only."
            />
          </FormGrid>

          <FormGrid columns={2} className="gap-4">
            <DatePicker
              label="Order Date"
              value={orderDate || undefined}
              onChange={val => setOrderDate(val || null)}
              required
            />

            <DatePicker
              label="Effective Date"
              value={effectiveDate || undefined}
              onChange={val => setEffectiveDate(val || null)}
              required
            />
          </FormGrid>

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

      {/* Details View Popup */}
      <FormPopup
        visible={popup.mode === 'view'}
        onHide={() => setPopup({ mode: 'closed' })}
        title="Salary Head Values List"
        subtitle={popup.data?.headName}
        size="lg"
      >
        {selectedDetails && (
          <div className="flex flex-col gap-4 py-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 border-b font-semibold text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Sr.No.</th>
                    <th className="px-4 py-3 text-right">Minimum Amount(₹)</th>
                    <th className="px-4 py-3 text-right">Maximum Amount(₹)</th>
                    <th className="px-4 py-3 text-right">
                      Earning & Deduction (Percentage/Amount)
                    </th>
                    <th className="px-4 py-3">Order No.</th>
                    <th className="px-4 py-3">Order Date</th>
                    <th className="px-4 py-3">Effective Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3 text-right">
                      ₹{selectedDetails.minAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{selectedDetails.maxAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {selectedDetails.calculationMethod.includes('Percentage')
                        ? `${selectedDetails.value}%`
                        : `₹${selectedDetails.value.toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3">{selectedDetails.orderNumber}</td>
                    <td className="px-4 py-3">{selectedDetails.orderDate}</td>
                    <td className="px-4 py-3">
                      {selectedDetails.effectiveDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {selectedDetails.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setPopup({ mode: 'closed' })}
                className="bg-red-500 border-none hover:bg-red-600 text-white"
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
