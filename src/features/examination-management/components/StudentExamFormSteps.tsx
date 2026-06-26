import {
  DropDownList,
  TextBox,
  Checkbox,
  FormSubSection,
} from 'shared/components/forms';
import { Grid } from 'shared/components/grid';

// --- MOCK DATA ---
export const SUBJECT_DATA = [
  {
    id: 1,
    code: 'CS501',
    name: 'Database Management System',
    type: 'Theory',
    credits: 4,
    status: 'Registered',
    examType: 'Regular',
    selected: 'Yes',
  },
  {
    id: 2,
    code: 'CS502',
    name: 'Operating Systems',
    type: 'Theory',
    credits: 4,
    status: 'Registered',
    examType: 'Regular',
    selected: 'Yes',
  },
];

export const SUBJECT_COLUMNS: Controls.ColumnProps<(typeof SUBJECT_DATA)[0]>[] =
  [
    { field: 'code', header: 'Subject Code' },
    { field: 'name', header: 'Subject Name' },
    { field: 'type', header: 'Subject Type' },
    { field: 'credits', header: 'Credits' },
    { field: 'status', header: 'Registration Status' },
    { field: 'examType', header: 'Exam Type' },
    { field: 'selected', header: 'Selected' },
  ];

export const BACKLOG_DATA = [
  { id: 1, code: 'CS301', grade: 'F', marks: 18, action: 'Backlog' },
  { id: 2, code: 'CS302', grade: 'C', marks: 45, action: 'Improvement' },
];

export const BACKLOG_COLUMNS: Controls.ColumnProps<(typeof BACKLOG_DATA)[0]>[] =
  [
    { field: 'code', header: 'Subject Code' },
    { field: 'grade', header: 'Previous Grade' },
    { field: 'marks', header: 'Previous Marks' },
    { field: 'action', header: 'Action' },
  ];

// --- STEP COMPONENTS ---

export function EligibilityStep({ register }: any) {
  return (
    <FormSubSection title="Eligibility Check">
      <TextBox label="Student Name" {...register('studentName')} disabled />
      <TextBox
        label="Enrollment Number"
        {...register('enrollmentNo')}
        disabled
      />
      <TextBox
        label="Registration Number"
        {...register('registrationNo')}
        disabled
      />
      <TextBox label="Program" {...register('program')} disabled />
      <TextBox label="Faculty" {...register('faculty')} disabled />
      <TextBox label="Department" {...register('department')} disabled />
      <TextBox label="Semester/Year" {...register('semester')} disabled />
      <TextBox label="Academic Session" {...register('session')} disabled />
      <TextBox label="Current Status" {...register('currentStatus')} disabled />

      <div className="col-span-full p-4 bg-sky-100 rounded border border-sky-200">
        <strong>Eligibility Status:</strong>{' '}
        <span className="text-green-600 font-bold ml-2">Eligible</span>
        <p className="mt-2 text-sm">
          You are eligible to fill the examination form. No pending reasons
          found.
        </p>
      </div>
    </FormSubSection>
  );
}

export function PersonalAcademicStep({ register }: any) {
  return (
    <>
      <FormSubSection title="Personal Details">
        <TextBox label="Student Name" {...register('studentName')} disabled />
        <TextBox label="Father's Name" {...register('fatherName')} disabled />
        <TextBox label="Mother's Name" {...register('motherName')} disabled />
        <TextBox label="Date of Birth" {...register('dob')} disabled />
        <TextBox label="Gender" {...register('gender')} disabled />
        <TextBox label="Category" {...register('category')} disabled />
        <TextBox label="Mobile Number" {...register('mobileNo')} disabled />
        <TextBox label="Email Address" {...register('email')} disabled />
      </FormSubSection>

      <FormSubSection title="Academic Details" className="mt-4">
        <TextBox
          label="Enrollment Number"
          {...register('enrollmentNo')}
          disabled
        />
        <TextBox label="Roll Number" {...register('rollNo')} disabled />
        <TextBox label="Program" {...register('program')} disabled />
        <TextBox
          label="Branch/Specialization"
          {...register('branch')}
          disabled
        />
        <TextBox label="Semester" {...register('semester')} disabled />
        <TextBox label="Academic Session" {...register('session')} disabled />
        <TextBox label="Admission Batch" {...register('batch')} disabled />
        <TextBox label="College/Campus" {...register('college')} disabled />
      </FormSubSection>
    </>
  );
}

export function SubjectSelectionStep() {
  return (
    <FormSubSection title="Subject Selection">
      <div className="col-span-full">
        <Grid
          data={SUBJECT_DATA}
          columns={SUBJECT_COLUMNS}
          pagination={false}
        />
      </div>
    </FormSubSection>
  );
}

export function BacklogImprovementStep() {
  return (
    <FormSubSection title="Backlog / Improvement Selection">
      <div className="col-span-full">
        <Grid
          data={BACKLOG_DATA}
          columns={BACKLOG_COLUMNS}
          pagination={false}
        />
      </div>
    </FormSubSection>
  );
}

export function FeeCalculationStep({ register }: any) {
  return (
    <FormSubSection title="Fee Calculation">
      <TextBox label="Exam Fee (₹)" {...register('examFee')} disabled />
      <TextBox
        label="Practical Fee (₹)"
        {...register('practicalFee')}
        disabled
      />
      <TextBox label="Backlog Fee (₹)" {...register('backlogFee')} disabled />
      <TextBox label="Late Fee (₹)" {...register('lateFee')} disabled />
      <TextBox
        label="Processing Fee (₹)"
        {...register('processingFee')}
        disabled
      />

      <div className="col-span-full p-6 bg-slate-50 rounded border border-slate-300">
        <h3 className="mt-0 text-lg font-bold">Fee Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Total Amount</span>
          <strong>₹2550</strong>
        </div>
        <div className="flex justify-between mb-2">
          <span>Payment Gateway Charges</span>
          <strong>₹50</strong>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-xl text-blue-800">
          <strong>Net Payable Amount</strong>
          <strong>₹2600</strong>
        </div>
      </div>
    </FormSubSection>
  );
}

export function DeclarationStep({ control }: any) {
  return (
    <FormSubSection title="Declaration and Submission">
      <div className="col-span-full flex flex-col gap-4 p-4 bg-amber-50 border border-amber-200 rounded">
        <Checkbox
          label="I declare that the information provided is true and correct."
          name="agreeInfo"
          control={control}
          required
        />
        <Checkbox
          label="I agree to abide by the university examination rules and regulations."
          name="agreeRules"
          control={control}
          required
        />
        <Checkbox
          label="I agree to the anti-unfair means policy."
          name="agreePolicy"
          control={control}
          required
        />
      </div>
    </FormSubSection>
  );
}

export function PaymentStep({ register, control }: any) {
  return (
    <FormSubSection title="Payment Details">
      <DropDownList
        label="Payment Gateway"
        name="paymentGateway"
        control={control}
        data={[
          { label: 'BillDesk', value: 'BillDesk' },
          { label: 'Razorpay', value: 'Razorpay' },
          { label: 'PayU', value: 'PayU' },
        ]}
        textField="label"
        valueField="value"
        required
      />
      <TextBox
        label="Net Payable Amount"
        {...register('netPayable')}
        disabled
      />

      <div className="col-span-full mt-8 text-center">
        <p className="text-slate-500 mb-4">
          Click below to proceed securely to the payment gateway.
        </p>
        <button
          type="button"
          className="p-button p-component p-button-success px-8 py-3 text-lg rounded border-none cursor-pointer"
        >
          <i className="pi pi-credit-card mr-2"></i> Proceed to Pay ₹2600
        </button>
      </div>
    </FormSubSection>
  );
}
