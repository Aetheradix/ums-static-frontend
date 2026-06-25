import { FormWizard } from 'shared/components/forms';
import { FormCard } from 'shared/new-components';
import { useAppForm } from 'shared/hooks/form';
import { ToastService } from 'services';
import {
  EligibilityStep,
  PersonalAcademicStep,
  SubjectSelectionStep,
  BacklogImprovementStep,
  FeeCalculationStep,
  DeclarationStep,
  PaymentStep,
} from './StudentExamFormSteps';

export default function StudentExamFormWizard() {
  const { register, control, handleSubmit, trigger } = useAppForm({
    defaultValues: {
      studentName: 'John Doe',
      fatherName: 'Richard Doe',
      motherName: 'Jane Doe',
      dob: '15-08-2005',
      gender: 'Male',
      category: 'General',
      mobileNo: '+91 9876543210',
      email: 'john.doe@example.com',
      enrollmentNo: 'EN2024001',
      registrationNo: 'REG2024001',
      rollNo: '24CS001',
      program: 'B.Tech',
      faculty: 'Engineering',
      department: 'Computer Science',
      branch: 'Software Engineering',
      semester: '4th Semester',
      session: '2025-2026',
      batch: '2024',
      college: 'Main Campus',
      currentStatus: 'Regular',
      examFee: '1500',
      practicalFee: '300',
      backlogFee: '500',
      lateFee: '200',
      processingFee: '50',
      netPayable: '2600',
      paymentGateway: '',
      agreeInfo: false,
      agreeRules: false,
      agreePolicy: false,
    },
  });

  const onSubmit = async (data: any) => {
    console.log('Form data submitted:', data);
    ToastService.success(
      'Payment successful! Your exam form has been forwarded.'
    );
  };

  const handleComplete = () => {
    handleSubmit(onSubmit)();
  };

  const steps = [
    {
      label: 'Eligibility',
      icon: 'verified',
      content: <EligibilityStep register={register} />,
    },
    {
      label: 'Personal & Academic',
      icon: 'user',
      content: <PersonalAcademicStep register={register} />,
    },
    {
      label: 'Subject Selection',
      icon: 'book',
      content: <SubjectSelectionStep />,
    },
    {
      label: 'Backlog / Improvement',
      icon: 'sync',
      content: <BacklogImprovementStep />,
    },
    {
      label: 'Fee Calculation',
      icon: 'calculator',
      content: <FeeCalculationStep register={register} />,
    },
    {
      label: 'Declaration',
      icon: 'check-square',
      content: <DeclarationStep control={control} />,
    },
    {
      label: 'Payment',
      icon: 'credit-card',
      content: <PaymentStep register={register} control={control} />,
    },
  ];

  return (
    <div className="p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <FormCard
        title="Student Examination Form"
        subtitle="Complete the steps below to register for your exams."
      >
        <FormWizard
          steps={steps}
          onComplete={handleComplete}
          triggerValidation={trigger as any}
          isSaving={false}
        />
      </FormCard>
    </div>
  );
}
