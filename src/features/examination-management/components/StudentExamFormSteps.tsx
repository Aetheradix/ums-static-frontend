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

      <div
        className="col-span-full"
        style={{
          padding: '1rem',
          backgroundColor: '#e0f2fe',
          borderRadius: '4px',
          border: '1px solid #bae6fd',
        }}
      >
        <strong>Eligibility Status:</strong>{' '}
        <span
          style={{ color: '#16a34a', fontWeight: 'bold', marginLeft: '0.5rem' }}
        >
          Eligible
        </span>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
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

      <div
        className="col-span-full"
        style={{
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Fee Summary</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span>Total Amount</span>
          <strong>₹2550</strong>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span>Payment Gateway Charges</span>
          <strong>₹50</strong>
        </div>
        <hr style={{ margin: '1rem 0' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            color: '#1e40af',
          }}
        >
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
      <div
        className="col-span-full"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '4px',
        }}
      >
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

      <div
        className="col-span-full"
        style={{ marginTop: '2rem', textAlign: 'center' }}
      >
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Click below to proceed securely to the payment gateway.
        </p>
        <button
          type="button"
          className="p-button p-component p-button-success"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <i
            className="pi pi-credit-card"
            style={{ marginRight: '0.5rem' }}
          ></i>{' '}
          Proceed to Pay ₹2600
        </button>
      </div>
    </FormSubSection>
  );
}
