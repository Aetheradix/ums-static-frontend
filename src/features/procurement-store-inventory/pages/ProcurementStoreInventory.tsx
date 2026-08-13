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
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
  Tabs,
} from 'shared/new-components';

/* ── TAB 1: DASHBOARD ────────────────────────────────────────── */
function DashboardTab() {
  const processStatusData = [
    {
      process: 'Procurement Request',
      total: 42,
      completed: 30,
      pending: 12,
      status: 'In Progress',
    },
    {
      process: 'Goods Receipt / GRN',
      total: 28,
      completed: 25,
      pending: 3,
      status: 'Mostly Complete',
    },
    {
      process: 'Department Demand',
      total: 65,
      completed: 47,
      pending: 18,
      status: 'Pending',
    },
    {
      process: 'Store Issue',
      total: 47,
      completed: 42,
      pending: 5,
      status: 'In Progress',
    },
    {
      process: 'Department Receiving',
      total: 42,
      completed: 39,
      pending: 3,
      status: 'Good',
    },
  ];

  const stockCategoryData = [
    { category: 'Perishable Goods', qty: 438, value: '1,28,450' },
    { category: 'Non-Perishable Goods', qty: 810, value: '8,74,350' },
    { category: 'Total Store Stock', qty: 1248, value: '10,02,800' },
  ];

  const recentActivities = [
    {
      time: '11-08-2026 10:30 AM',
      text: 'Accounts Department submitted demand DM/2026-27/0065 for stationery.',
    },
    {
      time: '11-08-2026 11:15 AM',
      text: 'Store Manager approved demand DM/2026-27/0064.',
    },
    {
      time: '11-08-2026 12:05 PM',
      text: 'Store Incharge issued items against SI/2026-27/0048.',
    },
    {
      time: '11-08-2026 01:20 PM',
      text: 'Department received issued items and confirmed receipt.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Procurement Requests"
          value="12"
          subtitle="Goods: 8 | Service: 4"
          icon="shopping_bag"
          colorScheme="blue"
        />
        <StatCard
          title="Store Stock Items"
          value="1,248"
          subtitle="Perishable: 438 | Non-Perishable: 810"
          icon="inventory_2"
          colorScheme="teal"
        />
        <StatCard
          title="Pending Dept. Demands"
          value="18"
          subtitle="Awaiting Store Manager approval"
          icon="pending_actions"
          colorScheme="amber"
        />
        <StatCard
          title="Items Issued (Month)"
          value="356"
          subtitle="Total Issue Value: ₹ 2,84,650"
          icon="local_shipping"
          colorScheme="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormCard title="Process Status Summary">
            <GridPanel<any>
              data={processStatusData}
              columns={[
                { field: 'process', header: 'Process' },
                { field: 'total', header: 'Total' },
                { field: 'completed', header: 'Completed' },
                { field: 'pending', header: 'Pending' },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (row: { status: string }) => (
                    <StatusBadge
                      label={row.status}
                      variant={
                        row.status === 'Good' ||
                        row.status === 'Mostly Complete'
                          ? 'approved'
                          : 'pending'
                      }
                    />
                  ),
                },
              ]}
            />
          </FormCard>
        </div>

        <div>
          <FormCard title="Stock Category Breakdown">
            <div className="mb-4 space-y-2">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300 flex justify-between">
                <span>Perishable Goods (438 Items)</span>
                <span>35%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 w-[35%]" />
              </div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300 flex justify-between pt-1">
                <span>Non-Perishable Goods (810 Items)</span>
                <span>65%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[65%]" />
              </div>
            </div>
            <GridPanel<any>
              data={stockCategoryData}
              columns={[
                { field: 'category', header: 'Category' },
                { field: 'qty', header: 'Stock Qty' },
                { field: 'value', header: 'Stock Value (₹)' },
              ]}
            />
          </FormCard>
        </div>
      </div>

      <FormCard title="Recent Store Activities">
        <div className="space-y-3 pl-2 border-l-2 border-slate-300 dark:border-slate-700">
          {recentActivities.map((act, i) => (
            <div key={i} className="text-sm pl-4 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[21px] top-1.5" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {act.time}
              </span>{' '}
              — {act.text}
            </div>
          ))}
        </div>
      </FormCard>
    </div>
  );
}

/* ── TAB 2: PROCUREMENT REQUEST ───────────────────────────── */
function ProcurementRequestTab() {
  const [reqType, setReqType] = useState<'goods' | 'service'>('goods');

  const goodsItems = [
    {
      sno: 1,
      item: 'Desktop Computer',
      spec: 'Core i5, 16GB RAM, 512GB SSD',
      nature: 'Non-Perishable',
      qty: 5,
      unit: 'Nos.',
      rate: '25,000',
      amount: '1,25,000',
    },
    {
      sno: 2,
      item: 'Laser Printer',
      spec: 'Network Laser Printer',
      nature: 'Non-Perishable',
      qty: 1,
      unit: 'Nos.',
      rate: '15,000',
      amount: '15,000',
    },
    {
      sno: 3,
      item: 'UPS',
      spec: '600 VA UPS',
      nature: 'Non-Perishable',
      qty: 5,
      unit: 'Nos.',
      rate: '1,500',
      amount: '7,500',
    },
  ];

  const serviceItems = [
    {
      sno: 1,
      service: 'ERP Application Support',
      desc: 'Application maintenance & support',
      duration: '12 Months',
      qty: 1,
      rate: '2,40,000',
      amount: '2,40,000',
    },
    {
      sno: 2,
      service: 'Database Support',
      desc: 'Database monitoring & DB maintenance',
      duration: '12 Months',
      qty: 1,
      rate: '60,000',
      amount: '60,000',
    },
    {
      sno: 3,
      service: 'Technical User Support',
      desc: 'User support & issue resolution',
      duration: '12 Months',
      qty: 1,
      rate: '60,000',
      amount: '60,000',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Request Header">
        <div className="flex gap-3 mb-4">
          <Button
            label="Goods Request"
            variant={reqType === 'goods' ? 'primary' : 'outlined'}
            onClick={() => setReqType('goods')}
          />
          <Button
            label="Service Request"
            variant={reqType === 'service' ? 'primary' : 'outlined'}
            onClick={() => setReqType('service')}
          />
        </div>

        <FormGrid columns={4}>
          <TextBox
            label="Procurement Request No."
            value="PR/2026-27/00015"
            disabled
          />
          <DatePicker label="Request Date" value={new Date('2026-08-11')} />
          <DropDownList
            label="Financial Year"
            data={[{ label: '2026-27', value: '2026-27' }]}
            value="2026-27"
          />
          <TextBox label="Department" value="Finance Department" />
          <TextBox label="Office / Branch" value="Head Office" />
          <TextBox label="Requesting Section" value="Accounts Section" />
          <TextBox label="Requesting Officer" value="Section Officer" />
          <DropDownList
            label="Priority"
            data={[
              { label: 'Normal', value: 'Normal' },
              { label: 'High', value: 'High' },
              { label: 'Low', value: 'Low' },
            ]}
            value="Normal"
          />
          <DatePicker label="Required By Date" value={new Date('2026-08-25')} />
          <TextBox label="Budget Head" value="Office Expenses" />
          <TextBox label="Available Budget ₹" value="500000" />
          <DropDownList
            label="Procurement Mode"
            data={[
              { label: 'As per Applicable Rules', value: 'Rules' },
              { label: 'GeM', value: 'GeM' },
              { label: 'Quotation', value: 'Quotation' },
              { label: 'Tender', value: 'Tender' },
            ]}
            value="Rules"
          />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Purpose / Justification"
            value="Requirement for day-to-day departmental operations and approved departmental activities."
            rows={2}
          />
        </div>
      </FormCard>

      {reqType === 'goods' ? (
        <FormCard title="Goods Details">
          <FormGrid columns={4}>
            <DropDownList
              label="Goods Category"
              data={[
                { label: 'IT Equipment', value: 'IT' },
                { label: 'Office Equipment', value: 'Office' },
                { label: 'Furniture', value: 'Furniture' },
                { label: 'Stationery', value: 'Stationery' },
              ]}
              value="IT"
            />
            <DropDownList
              label="Goods Nature"
              data={[
                { label: 'Non-Perishable', value: 'Non-Perishable' },
                { label: 'Perishable', value: 'Perishable' },
              ]}
              value="Non-Perishable"
            />
            <TextBox label="Delivery Location" value="Head Office Main Store" />
            <DropDownList
              label="Warranty Required"
              data={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
              ]}
              value="Yes"
            />
          </FormGrid>

          <div className="mt-4">
            <GridPanel<any>
              data={goodsItems}
              columns={[
                { field: 'sno', header: 'S.No.' },
                { field: 'item', header: 'Item' },
                { field: 'spec', header: 'Specification' },
                {
                  field: 'nature',
                  header: 'Nature',
                  cell: (row: { nature: string }) => (
                    <StatusBadge label={row.nature} variant="approved" />
                  ),
                },
                { field: 'qty', header: 'Qty' },
                { field: 'unit', header: 'Unit' },
                { field: 'rate', header: 'Rate ₹' },
                { field: 'amount', header: 'Amount ₹' },
              ]}
            />
            <div className="text-right font-bold text-base text-blue-900 dark:text-blue-200 mt-3">
              Goods Estimated Total: ₹ 1,47,500
            </div>
          </div>
        </FormCard>
      ) : (
        <FormCard title="Service Details">
          <FormGrid columns={4}>
            <DropDownList
              label="Service Category"
              data={[
                { label: 'Software / IT Support', value: 'IT' },
                { label: 'AMC', value: 'AMC' },
                { label: 'Consultancy', value: 'Consultancy' },
                { label: 'Training', value: 'Training' },
                { label: 'Manpower', value: 'Manpower' },
              ]}
              value="IT"
            />
            <DatePicker label="Service Start" value={new Date('2026-09-01')} />
            <DatePicker label="Service End" value={new Date('2027-08-31')} />
            <TextBox label="Working Location" value="Head Office" />
          </FormGrid>

          <div className="mt-4 space-y-3">
            <TextArea
              label="Scope of Work"
              value="ERP application support, issue resolution, database monitoring, user support and routine maintenance."
              rows={2}
            />
            <TextArea
              label="Deliverables / KPI / SLA"
              value="Issue resolution within SLA, monthly support report, system monitoring and user support."
              rows={2}
            />
            <GridPanel<any>
              data={serviceItems}
              columns={[
                { field: 'sno', header: 'S.No.' },
                { field: 'service', header: 'Service' },
                { field: 'desc', header: 'Description' },
                { field: 'duration', header: 'Duration' },
                { field: 'qty', header: 'Qty' },
                { field: 'rate', header: 'Rate ₹' },
                { field: 'amount', header: 'Amount ₹' },
              ]}
            />
            <div className="text-right font-bold text-base text-blue-900 dark:text-blue-200 mt-3">
              Service Estimated Total: ₹ 3,60,000
            </div>
          </div>
        </FormCard>
      )}
    </div>
  );
}

/* ── TAB 3: VERIFICATION ─────────────────────────────────────── */
function VerificationTab() {
  const checklist = [
    {
      item: 'Requirement justified',
      status: 'Verified',
      remarks: 'Requirement justified.',
    },
    {
      item: 'Budget available',
      status: 'Verified',
      remarks: 'Budget available.',
    },
    {
      item: 'Specification / Scope attached',
      status: 'Verified',
      remarks: 'Attached.',
    },
    {
      item: 'Duplicate request check',
      status: 'Verified',
      remarks: 'No duplicate found.',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Verification">
        <FormGrid columns={4}>
          <DropDownList
            label="Requirement Verification"
            data={[
              { label: 'Verified', value: 'v' },
              { label: 'Pending', value: 'p' },
              { label: 'Returned', value: 'r' },
            ]}
            value="v"
          />
          <DropDownList
            label="Budget Availability"
            data={[
              { label: 'Available', value: 'a' },
              { label: 'Not Available', value: 'na' },
            ]}
            value="a"
          />
          <DropDownList
            label="Technical Specification"
            data={[
              { label: 'Verified', value: 'v' },
              { label: 'Not Applicable', value: 'na' },
            ]}
            value="v"
          />
          <TextBox label="Verified By" value="Accounts / Procurement Officer" />
          <TextBox label="Supporting Document" value="Requirement_Note.pdf" />
          <DatePicker
            label="Verification Date"
            value={new Date('2026-08-11')}
          />
          <DropDownList
            label="Status"
            data={[
              { label: 'Verified', value: 'v' },
              { label: 'Pending', value: 'p' },
            ]}
            value="v"
          />
        </FormGrid>
        <div className="mt-4">
          <TextArea
            label="Remarks"
            value="Requirement and budget availability checked. Supporting documents found satisfactory."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Verification Checklist">
        <GridPanel<any>
          data={checklist}
          columns={[
            { field: 'item', header: 'Checklist' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
            { field: 'remarks', header: 'Remarks' },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 4: APPROVAL ─────────────────────────────────────────── */
function ApprovalTab() {
  const approvalWorkflow = [
    {
      level: 1,
      role: 'Requesting Officer',
      action: 'Submit',
      date: '11-08-2026',
      remarks: 'Requirement initiated.',
      status: 'Submitted',
    },
    {
      level: 2,
      role: 'Section Officer',
      action: 'Verify / Recommend',
      date: '11-08-2026',
      remarks: 'Recommended.',
      status: 'Recommended',
    },
    {
      level: 3,
      role: 'Accounts / Finance Officer',
      action: 'Budget Concurrence',
      date: '--',
      remarks: 'Budget checked.',
      status: 'Pending',
    },
    {
      level: 4,
      role: 'Department Head',
      action: 'Approve / Reject',
      date: '--',
      remarks: '--',
      status: 'Pending',
    },
    {
      level: 5,
      role: 'Competent Authority',
      action: 'Final Approval',
      date: '--',
      remarks: '--',
      status: 'Pending',
    },
  ];

  return (
    <FormCard title="Approval Workflow">
      <GridPanel<any>
        data={approvalWorkflow}
        columns={[
          { field: 'level', header: 'Level' },
          { field: 'role', header: 'Role' },
          { field: 'action', header: 'Action' },
          { field: 'date', header: 'Date' },
          { field: 'remarks', header: 'Remarks' },
          {
            field: 'status',
            header: 'Status',
            cell: (row: { status: string }) => (
              <StatusBadge
                label={row.status}
                variant={
                  row.status === 'Submitted' || row.status === 'Recommended'
                    ? 'approved'
                    : 'pending'
                }
              />
            ),
          },
        ]}
      />
    </FormCard>
  );
}

/* ── TAB 5: PROCUREMENT ─────────────────────────────────────── */
function ProcurementProcessTab() {
  const vendorEval = [
    {
      vendor: 'ABC Technologies Pvt. Ltd.',
      techScore: '92%',
      amount: '345000',
      rank: 1,
      status: 'Selected',
    },
    {
      vendor: 'XYZ Solutions',
      techScore: '88%',
      amount: '365000',
      rank: 2,
      status: 'Not Selected',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Procurement Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Procurement Method"
            data={[
              { label: 'As per Applicable Rules', value: 'r' },
              { label: 'GeM', value: 'gem' },
              { label: 'Quotation', value: 'q' },
              { label: 'Limited Tender', value: 'lt' },
              { label: 'Open Tender', value: 'ot' },
            ]}
            value="gem"
          />
          <TextBox label="Reference No." value="PROC/2026-27/0042" />
          <DatePicker label="Publication Date" value={new Date('2026-08-13')} />
          <DatePicker label="Bid Closing Date" value={new Date('2026-08-20')} />
          <DropDownList
            label="Technical Evaluation"
            data={[
              { label: 'Completed', value: 'c' },
              { label: 'Pending', value: 'p' },
            ]}
            value="c"
          />
          <DropDownList
            label="Financial Evaluation"
            data={[
              { label: 'Completed', value: 'c' },
              { label: 'Pending', value: 'p' },
            ]}
            value="c"
          />
          <DropDownList
            label="Vendor Selection"
            data={[
              { label: 'Selected', value: 's' },
              { label: 'Pending', value: 'p' },
            ]}
            value="s"
          />
          <TextBox label="Selected Vendor" value="ABC Technologies Pvt. Ltd." />
        </FormGrid>
      </FormCard>

      <FormCard title="Vendor Evaluation">
        <GridPanel<any>
          data={vendorEval}
          columns={[
            { field: 'vendor', header: 'Vendor' },
            { field: 'techScore', header: 'Technical Score' },
            { field: 'amount', header: 'Quoted Amount ₹' },
            { field: 'rank', header: 'Rank' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <StatusBadge
                  label={row.status}
                  variant={row.status === 'Selected' ? 'approved' : 'neutral'}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 6: PO / WO ──────────────────────────────────────────── */
function PurchaseOrderTab() {
  return (
    <FormCard title="Order Details">
      <FormGrid columns={4}>
        <TextBox label="Order Type" value="Purchase Order" disabled />
        <TextBox label="PO / WO No." value="PO/2026-27/00128" />
        <DatePicker label="Order Date" value={new Date('2026-08-22')} />
        <TextBox label="Vendor / Agency" value="ABC Technologies Pvt. Ltd." />
        <TextBox label="Order Amount ₹" value="147500" />
        <DatePicker
          label="Delivery / Service Start"
          value={new Date('2026-08-25')}
        />
        <DatePicker
          label="Expected Completion"
          value={new Date('2026-09-10')}
        />
        <DropDownList
          label="Order Status"
          data={[
            { label: 'Issued', value: 'i' },
            { label: 'Approved', value: 'a' },
            { label: 'Draft', value: 'd' },
          ]}
          value="i"
        />
      </FormGrid>

      <div className="mt-4">
        <TextArea
          label="Terms & Conditions"
          value="Supply/service shall be as per approved specification, applicable procurement rules, delivery schedule and payment terms."
          rows={3}
        />
      </div>
    </FormCard>
  );
}

/* ── TAB 7: RECEIPT / GRN ────────────────────────────────────── */
function GrnReceiptTab() {
  const grnItems = [
    {
      item: 'Desktop Computer',
      ordQty: 5,
      recQty: 5,
      accQty: 5,
      status: 'Accepted',
    },
    {
      item: 'Laser Printer',
      ordQty: 1,
      recQty: 1,
      accQty: 1,
      status: 'Accepted',
    },
    { item: 'UPS', ordQty: 5, recQty: 5, accQty: 5, status: 'Accepted' },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Receipt / Verification">
        <FormGrid columns={4}>
          <TextBox label="Receipt Type" value="Goods Receipt / GRN" />
          <TextBox label="GRN No." value="GRN/2026-27/0098" />
          <DatePicker label="Receipt Date" value={new Date('2026-08-30')} />
          <TextBox label="Store / Warehouse" value="Head Office Main Store" />
          <TextBox label="Verified By" value="Store Incharge" />
          <DropDownList
            label="Quantity Verification"
            data={[
              { label: 'Matched', value: 'm' },
              { label: 'Mismatch', value: 'mm' },
            ]}
            value="m"
          />
          <DropDownList
            label="Quality Verification"
            data={[
              { label: 'Matched', value: 'm' },
              { label: 'Not Matched', value: 'nm' },
            ]}
            value="m"
          />
          <DropDownList
            label="Receipt Status"
            data={[
              { label: 'Accepted', value: 'a' },
              { label: 'Partially Accepted', value: 'pa' },
              { label: 'Rejected', value: 'r' },
            ]}
            value="a"
          />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Remarks"
            value="Goods received as per approved Purchase Order. Quantity and quality verified and accepted by Store Incharge."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Goods Receipt Items">
        <GridPanel<any>
          data={grnItems}
          columns={[
            { field: 'item', header: 'Item' },
            { field: 'ordQty', header: 'Ordered Qty' },
            { field: 'recQty', header: 'Received Qty' },
            { field: 'accQty', header: 'Accepted Qty' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 8: STORE INVENTORY ─────────────────────────────────── */
function StoreInventoryTab() {
  const stockSummary = [
    {
      code: 'IT-CPU-001',
      name: 'Desktop Computer',
      nature: 'Non-Perishable',
      opening: 10,
      receipt: 5,
      issue: 2,
      closing: 13,
      value: '325000',
    },
    {
      code: 'IT-PRN-001',
      name: 'Laser Printer',
      nature: 'Non-Perishable',
      opening: 3,
      receipt: 1,
      issue: 0,
      closing: 4,
      value: '60000',
    },
    {
      code: 'IT-UPS-001',
      name: 'UPS',
      nature: 'Non-Perishable',
      opening: 8,
      receipt: 5,
      issue: 1,
      closing: 12,
      value: '18000',
    },
    {
      code: 'FD-FOOD-001',
      name: 'Refreshment Material',
      nature: 'Perishable',
      opening: 100,
      receipt: 50,
      issue: 30,
      closing: 120,
      value: '24000',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Store Total Stock"
          value="1,248"
          subtitle="Items / Units"
          icon="inventory"
          colorScheme="blue"
        />
        <StatCard
          title="Perishable Stock"
          value="438"
          subtitle="Short shelf-life items"
          icon="fastfood"
          colorScheme="amber"
        />
        <StatCard
          title="Non-Perishable Stock"
          value="810"
          subtitle="Long-life items"
          icon="devices"
          colorScheme="teal"
        />
        <StatCard
          title="Stock Value"
          value="₹ 10.03 L"
          subtitle="Current store value"
          icon="payments"
          colorScheme="purple"
        />
      </div>

      <FormCard title="Store Stock Summary">
        <GridPanel<any>
          data={stockSummary}
          columns={[
            { field: 'code', header: 'Item Code' },
            { field: 'name', header: 'Item Name' },
            {
              field: 'nature',
              header: 'Nature',
              cell: (row: { nature: string }) => (
                <StatusBadge
                  label={row.nature}
                  variant={
                    row.nature === 'Non-Perishable' ? 'approved' : 'pending'
                  }
                />
              ),
            },
            { field: 'opening', header: 'Opening' },
            { field: 'receipt', header: 'Purchase / GRN' },
            { field: 'issue', header: 'Issue' },
            { field: 'closing', header: 'Closing' },
            { field: 'value', header: 'Closing Value ₹' },
          ]}
        />
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-200 rounded-r">
          <strong>Posting Rule:</strong> Only accepted quantity from GRN is
          posted to Store Inventory. Rejected/short quantity remains in
          exception status and is not added to available stock.
        </div>
      </FormCard>
    </div>
  );
}

/* ── TAB 9: DEPT. DEMAND ─────────────────────────────────────── */
function DepartmentDemandTab() {
  const demandItems = [
    {
      sno: 1,
      code: 'ST-STA-001',
      item: 'A4 Paper',
      nature: 'Non-Perishable',
      avail: 250,
      demand: 50,
      uom: 'Ream',
      purpose: 'Office use',
    },
    {
      sno: 2,
      code: 'ST-STA-002',
      item: 'File Folder',
      nature: 'Non-Perishable',
      avail: 180,
      demand: 30,
      uom: 'Nos.',
      purpose: 'Record keeping',
    },
    {
      sno: 3,
      code: 'FD-FOOD-001',
      item: 'Refreshment Material',
      nature: 'Perishable',
      avail: 120,
      demand: 20,
      uom: 'Pack',
      purpose: 'Official meeting',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Demand Header">
        <FormGrid columns={4}>
          <TextBox label="Demand No." value="DM/2026-27/0065" />
          <DatePicker label="Demand Date" value={new Date('2026-08-11')} />
          <TextBox label="Department" value="Accounts Department" />
          <TextBox label="Section" value="Accounts Section" />
          <TextBox label="Requested By" value="Section Officer" />
          <DropDownList
            label="Priority"
            data={[
              { label: 'Normal', value: 'n' },
              { label: 'Urgent', value: 'u' },
            ]}
            value="n"
          />
          <DatePicker label="Required Date" value={new Date('2026-08-12')} />
          <DropDownList
            label="Status"
            data={[
              { label: 'Submitted to Store Manager', value: 's' },
              { label: 'Approved', value: 'a' },
              { label: 'Returned', value: 'r' },
            ]}
            value="s"
          />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Purpose"
            value="Requirement for regular departmental office operations."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Demand Item Details">
        <GridPanel<any>
          data={demandItems}
          columns={[
            { field: 'sno', header: 'S.No.' },
            { field: 'code', header: 'Item Code' },
            { field: 'item', header: 'Item' },
            { field: 'nature', header: 'Nature' },
            { field: 'avail', header: 'Available Store Qty' },
            { field: 'demand', header: 'Demand Qty' },
            { field: 'uom', header: 'UOM' },
            { field: 'purpose', header: 'Purpose' },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 10: STORE ISSUE ─────────────────────────────────────── */
function StoreIssueTab() {
  const issueItems = [
    {
      sno: 1,
      item: 'A4 Paper',
      nature: 'Non-Perishable',
      appQty: 50,
      issQty: 50,
      uom: 'Ream',
      lot: 'LOT-AP-0826',
      bal: 200,
    },
    {
      sno: 2,
      item: 'File Folder',
      nature: 'Non-Perishable',
      appQty: 30,
      issQty: 30,
      uom: 'Nos.',
      lot: 'LOT-FF-0826',
      bal: 150,
    },
    {
      sno: 3,
      item: 'Refreshment Material',
      nature: 'Perishable',
      appQty: 20,
      issQty: 20,
      uom: 'Pack',
      lot: 'LOT-RM-0826',
      bal: 100,
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Issue Header">
        <FormGrid columns={4}>
          <TextBox label="Issue Voucher No." value="SI/2026-27/0048" />
          <DatePicker label="Issue Date" value={new Date('2026-08-11')} />
          <TextBox label="Demand No." value="DM/2026-27/0065" />
          <TextBox label="Department" value="Accounts Department" />
          <TextBox label="Store" value="Head Office Main Store" />
          <TextBox label="Store Incharge" value="Ramesh Kumar" />
          <TextBox label="Approval Reference" value="DM-APP/2026-27/0065" />
          <DropDownList
            label="Issue Status"
            data={[
              { label: 'Issued', value: 'i' },
              { label: 'Partially Issued', value: 'pi' },
              { label: 'Pending', value: 'p' },
            ]}
            value="i"
          />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Issue Remarks"
            value="Items issued as per Store Manager approved demand and available stock."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Issue Item Details">
        <GridPanel<any>
          data={issueItems}
          columns={[
            { field: 'sno', header: 'S.No.' },
            { field: 'item', header: 'Item' },
            { field: 'nature', header: 'Nature' },
            { field: 'appQty', header: 'Approved Qty' },
            { field: 'issQty', header: 'Issued Qty' },
            { field: 'uom', header: 'UOM' },
            { field: 'lot', header: 'Batch / Lot' },
            { field: 'bal', header: 'Balance Store Qty' },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 11: DEPT. RECEIVING ─────────────────────────────────── */
function DepartmentReceivingTab() {
  const receivedItems = [
    {
      item: 'A4 Paper',
      issQty: 50,
      recQty: 50,
      accQty: 50,
      diff: 0,
      status: 'Received',
    },
    {
      item: 'File Folder',
      issQty: 30,
      recQty: 30,
      accQty: 30,
      diff: 0,
      status: 'Received',
    },
    {
      item: 'Refreshment Material',
      issQty: 20,
      recQty: 20,
      accQty: 20,
      diff: 0,
      status: 'Received',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Department Receiving">
        <FormGrid columns={4}>
          <TextBox label="Receiving No." value="DR/2026-27/0048" />
          <DatePicker label="Receiving Date" value={new Date('2026-08-11')} />
          <TextBox label="Issue Voucher No." value="SI/2026-27/0048" />
          <TextBox label="Department" value="Accounts Department" />
          <TextBox label="Received By" value="Assistant Grade-2" />
          <DropDownList
            label="Verification"
            data={[
              { label: 'Accepted', value: 'a' },
              { label: 'Short Received', value: 'sr' },
              { label: 'Rejected', value: 'r' },
            ]}
            value="a"
          />
          <DropDownList
            label="Receiving Status"
            data={[
              { label: 'Received & Confirmed', value: 'rc' },
              { label: 'Pending', value: 'p' },
            ]}
            value="rc"
          />
          <TextBox label="Acknowledgement" value="ACK/2026-27/0048" />
        </FormGrid>

        <div className="mt-4">
          <TextArea
            label="Receiving Remarks"
            value="All items received from Store Incharge as per approved issue voucher. Quantity checked and acknowledged by Department."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Received Items">
        <GridPanel<any>
          data={receivedItems}
          columns={[
            { field: 'item', header: 'Item' },
            { field: 'issQty', header: 'Issued Qty' },
            { field: 'recQty', header: 'Received Qty' },
            { field: 'accQty', header: 'Accepted Qty' },
            { field: 'diff', header: 'Difference' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 12: STOCK REGISTER ──────────────────────────────────── */
function StockRegisterTab() {
  const storeRegData = [
    {
      date: '11-08-2026',
      voucher: 'SI/2026-27/0048',
      item: 'A4 Paper',
      opening: 250,
      receipt: 0,
      issue: 50,
      closing: 200,
      value: '16000',
    },
    {
      date: '11-08-2026',
      voucher: 'SI/2026-27/0048',
      item: 'File Folder',
      opening: 180,
      receipt: 0,
      issue: 30,
      closing: 150,
      value: '7500',
    },
    {
      date: '11-08-2026',
      voucher: 'SI/2026-27/0048',
      item: 'Refreshment Material',
      opening: 120,
      receipt: 0,
      issue: 20,
      closing: 100,
      value: '20000',
    },
  ];

  const deptRegData = [
    {
      date: '11-08-2026',
      receivingNo: 'DR/2026-27/0048',
      item: 'A4 Paper',
      opening: 10,
      rec: 50,
      consumed: 5,
      closing: 55,
      status: 'Available',
    },
    {
      date: '11-08-2026',
      receivingNo: 'DR/2026-27/0048',
      item: 'File Folder',
      opening: 15,
      rec: 30,
      consumed: 3,
      closing: 42,
      status: 'Available',
    },
    {
      date: '11-08-2026',
      receivingNo: 'DR/2026-27/0048',
      item: 'Refreshment Material',
      opening: 5,
      rec: 20,
      consumed: 8,
      closing: 17,
      status: 'Available',
    },
  ];

  const availableReports = [
    {
      name: 'Store Stock Summary',
      level: 'Store',
      purpose: 'Current stock item-wise',
      status: 'Available',
    },
    {
      name: 'Department Stock Register',
      level: 'Department',
      purpose: 'Department-wise received/consumed stock',
      status: 'Available',
    },
    {
      name: 'Item-wise Voucher Details',
      level: 'Store + Department',
      purpose: 'All stock movements',
      status: 'Available',
    },
    {
      name: 'Perishable Stock Report',
      level: 'Store + Department',
      purpose: 'Expiry / batch monitoring',
      status: 'Available',
    },
    {
      name: 'Non-Perishable Stock Report',
      level: 'Store + Department',
      purpose: 'Long-life stock monitoring',
      status: 'Available',
    },
    {
      name: 'Demand Pending Report',
      level: 'Store',
      purpose: 'Pending approvals / issue',
      status: 'Available',
    },
    {
      name: 'Store Issue Report',
      level: 'Store',
      purpose: 'Department-wise issue',
      status: 'Available',
    },
    {
      name: 'Department Receiving Report',
      level: 'Department',
      purpose: 'Receipt acknowledgement',
      status: 'Available',
    },
    {
      name: 'Stock Reconciliation Report',
      level: 'Both',
      purpose: 'Store vs Department reconciliation',
      status: 'Available',
    },
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Stock Register Filters">
        <FormGrid columns={3}>
          <DropDownList
            label="Level"
            data={[
              { label: 'Store Level', value: 'sl' },
              { label: 'Department Level', value: 'dl' },
            ]}
            value="sl"
          />
          <DatePicker label="From Date" value={new Date('2026-08-01')} />
          <DatePicker label="To Date" value={new Date('2026-08-31')} />
          <DropDownList
            label="Item Nature"
            data={[
              { label: 'All', value: 'all' },
              { label: 'Perishable', value: 'p' },
              { label: 'Non-Perishable', value: 'np' },
            ]}
            value="all"
          />
          <DropDownList
            label="Item"
            data={[
              { label: 'All Items', value: 'all' },
              { label: 'A4 Paper', value: 'ap' },
              { label: 'File Folder', value: 'ff' },
            ]}
            value="all"
          />
          <DropDownList
            label="Voucher Type"
            data={[
              { label: 'All', value: 'all' },
              { label: 'GRN', value: 'grn' },
              { label: 'Issue', value: 'iss' },
              { label: 'Department Receiving', value: 'rec' },
            ]}
            value="all"
          />
        </FormGrid>
      </FormCard>

      <FormCard title="Store Level Stock Register">
        <GridPanel<any>
          data={storeRegData}
          columns={[
            { field: 'date', header: 'Date' },
            { field: 'voucher', header: 'Voucher' },
            { field: 'item', header: 'Item' },
            { field: 'opening', header: 'Opening' },
            { field: 'receipt', header: 'Receipt' },
            { field: 'issue', header: 'Issue' },
            { field: 'closing', header: 'Closing' },
            { field: 'value', header: 'Value ₹' },
          ]}
        />
      </FormCard>

      <FormCard title="Department Level Stock Register">
        <GridPanel<any>
          data={deptRegData}
          columns={[
            { field: 'date', header: 'Date' },
            { field: 'receivingNo', header: 'Receiving No.' },
            { field: 'item', header: 'Item' },
            { field: 'opening', header: 'Opening' },
            { field: 'rec', header: 'Received from Store' },
            { field: 'consumed', header: 'Consumed / Issued' },
            { field: 'closing', header: 'Closing' },
            {
              field: 'status',
              header: 'Balance Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard title="Available Reports">
        <GridPanel<any>
          data={availableReports}
          columns={[
            { field: 'name', header: 'Report Name' },
            { field: 'level', header: 'Level' },
            { field: 'purpose', header: 'Purpose' },
            {
              field: 'status',
              header: 'Sample Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
          ]}
        />
      </FormCard>
    </div>
  );
}

/* ── TAB 13: INVOICE ─────────────────────────────────────────── */
function InvoiceTab() {
  return (
    <FormCard title="Invoice Details">
      <FormGrid columns={4}>
        <TextBox label="Invoice No." value="INV/ABC/2026/045" />
        <DatePicker label="Invoice Date" value={new Date('2026-09-01')} />
        <TextBox label="Vendor" value="ABC Technologies Pvt. Ltd." />
        <TextBox label="Invoice Amount ₹" value="147500" />
        <TextBox label="PO / WO Reference" value="PO/2026-27/00128" />
        <TextBox label="GRN / Service Ref." value="GRN/2026-27/0098" />
        <DropDownList
          label="Invoice Verification"
          data={[
            { label: 'Verified', value: 'v' },
            { label: 'Pending', value: 'p' },
            { label: 'Returned', value: 'r' },
          ]}
          value="v"
        />
        <DropDownList
          label="Tax / Deduction Verification"
          data={[
            { label: 'Verified', value: 'v' },
            { label: 'Pending', value: 'p' },
          ]}
          value="v"
        />
      </FormGrid>
      <div className="mt-4">
        <TextArea
          label="Remarks"
          value="Invoice matched with approved order and receipt verification. Submitted for payment processing."
          rows={2}
        />
      </div>
    </FormCard>
  );
}

/* ── TAB 14: PAYMENT ─────────────────────────────────────────── */
function PaymentTab() {
  return (
    <FormCard title="Payment Details">
      <FormGrid columns={4}>
        <TextBox label="Payment Request No." value="PAY/2026-27/00456" />
        <TextBox label="Invoice No." value="INV/ABC/2026/045" />
        <TextBox label="Gross Invoice Amount ₹" value="147500" />
        <TextBox label="Total Deduction ₹" value="2950" />
        <TextBox label="Net Payable ₹" value="144550" />
        <DropDownList
          label="Payment Mode"
          data={[
            { label: 'NEFT / RTGS', value: 'neft' },
            { label: 'Online', value: 'online' },
          ]}
          value="neft"
        />
        <DropDownList
          label="Payment Status"
          data={[
            { label: 'Processed', value: 'pr' },
            { label: 'Pending', value: 'p' },
          ]}
          value="pr"
        />
        <DatePicker label="Payment Date" value={new Date('2026-09-05')} />
        <TextBox label="UTR / Transaction Ref." value="UTR20260905123456" />
      </FormGrid>
      <div className="mt-4">
        <TextArea
          label="Remarks"
          value="Invoice verified and payment processed after applicable statutory deductions."
          rows={2}
        />
      </div>
    </FormCard>
  );
}

/* ── TAB 15: CLOSURE & REPORTS ───────────────────────────────── */
function ClosureTab() {
  const docs = [
    {
      doc: 'Requirement Note',
      ref: 'Requirement_Note.pdf',
      status: 'Available',
    },
    { doc: 'Approval Note', ref: 'Approval_Note.pdf', status: 'Available' },
    { doc: 'PO / WO', ref: 'PO_2026_27_00128.pdf', status: 'Available' },
    { doc: 'GRN', ref: 'GRN_2026_27_0098.pdf', status: 'Available' },
    {
      doc: 'Store Issue Voucher',
      ref: 'SI_2026_27_0048.pdf',
      status: 'Available',
    },
    {
      doc: 'Department Receiving',
      ref: 'DR_2026_27_0048.pdf',
      status: 'Available',
    },
    {
      doc: 'Stock Register',
      ref: 'Stock_Register_Aug_2026.pdf',
      status: 'Available',
    },
    { doc: 'Invoice', ref: 'INV_ABC_2026_045.pdf', status: 'Available' },
    { doc: 'Payment Proof', ref: 'UTR20260905123456.pdf', status: 'Available' },
  ];

  const processFlowSteps = [
    '1. Dept Procurement Request',
    '2. Verification',
    '3. Approval',
    '4. Procurement',
    '5. Purchase Order',
    '6. GRN & Goods Verification',
    '7. Store Inventory Posting',
    '8. Department Demand',
    '9. Store Issue',
    '10. Department Receiving',
    '11. Stock Register',
    '12. Invoice Verification',
    '13. Payment Processing',
    '14. Closure',
  ];

  return (
    <div className="space-y-6">
      <FormCard title="Closure">
        <FormGrid columns={3}>
          <DropDownList
            label="Procurement Status"
            data={[
              { label: 'Closed', value: 'c' },
              { label: 'Completed', value: 'comp' },
              { label: 'Open', value: 'o' },
            ]}
            value="c"
          />
          <DatePicker label="Closure Date" value={new Date('2026-09-05')} />
          <TextBox label="Closed By" value="Procurement / Accounts Officer" />
          <TextBox label="Final Amount ₹" value="144550" />
          <DropDownList
            label="Store Reconciliation"
            data={[
              { label: 'Completed', value: 'c' },
              { label: 'Pending', value: 'p' },
            ]}
            value="c"
          />
          <DropDownList
            label="Department Reconciliation"
            data={[
              { label: 'Completed', value: 'c' },
              { label: 'Pending', value: 'p' },
            ]}
            value="c"
          />
        </FormGrid>
        <div className="mt-4">
          <TextArea
            label="Closure Remarks"
            value="Procurement completed. Goods received and posted in Store, department demand issued and received, stock registers updated, invoice processed and payment completed. All records are available for audit."
            rows={2}
          />
        </div>
      </FormCard>

      <FormCard title="Document Repository">
        <GridPanel<any>
          data={docs}
          columns={[
            { field: 'doc', header: 'Document' },
            { field: 'ref', header: 'Reference' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: { status: string }) => (
                <StatusBadge label={row.status} variant="approved" />
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard title="Complete Goods Process Flow">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {processFlowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-center text-xs font-semibold text-slate-800 dark:text-slate-100"
            >
              {step}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-200 rounded-r">
          <strong>Important Process Rule:</strong> Department पहले Store Manager
          को Perishable / Non-Perishable Goods की Demand देगा → Store Manager
          Demand Approve करेगा → Store Incharge approved demand के अनुसार Goods
          Issue करेगा → Department issued Goods को Receive/Acknowledge करेगा →
          Issue और Receiving के बाद Store Level तथा Department Level दोनों Stock
          Register update होंगे.
        </div>
      </FormCard>
    </div>
  );
}

/* ═══════════════════ MAIN FEATURE PAGE ══════════════════════ */
export default function ProcurementStoreInventory() {
  const tabsList = [
    { title: 'Dashboard', content: <DashboardTab /> },
    { title: '1. Request', content: <ProcurementRequestTab /> },
    { title: '2. Verification', content: <VerificationTab /> },
    { title: '3. Approval', content: <ApprovalTab /> },
    { title: '4. Procurement', content: <ProcurementProcessTab /> },
    { title: '5. PO / WO', content: <PurchaseOrderTab /> },
    { title: '6. Receipt / GRN', content: <GrnReceiptTab /> },
    { title: '7. Store Inventory', content: <StoreInventoryTab /> },
    { title: '8. Dept. Demand', content: <DepartmentDemandTab /> },
    { title: '9. Store Issue', content: <StoreIssueTab /> },
    { title: '10. Dept. Receiving', content: <DepartmentReceivingTab /> },
    { title: '11. Stock Register', content: <StockRegisterTab /> },
    { title: '12. Invoice', content: <InvoiceTab /> },
    { title: '13. Payment', content: <PaymentTab /> },
    { title: '14. Closure & Reports', content: <ClosureTab /> },
  ];

  return (
    <FormPage
      title="Department Procurement, Store & Inventory Management"
      description="Goods & Service Procurement | Store Demand | Issue & Receiving | Department & Store Stock Register | Reports & Dashboard"
    >
      <div className="space-y-4">
        <Tabs tabs={tabsList} />

        {/* Page Footer Action Bar */}
        <FormActions
          isEditMode={false}
          isLoading={false}
          onSave={() =>
            ToastService.success('Transaction submitted successfully.')
          }
          onReset={() => ToastService.success('Draft saved successfully.')}
        />
      </div>
    </FormPage>
  );
}
