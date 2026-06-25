import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Loader } from 'shared/components/progress';
import { FormPage } from 'shared/new-components';
import EmployeeSelfAssessmentForm from '../components/EmployeeSelfAssessmentForm';
import {
  useCreateEmployeeSelfAssessmentMutation,
  useEmployeeSelfAssessmentQuery,
  useUpdateEmployeeSelfAssessmentMutation,
} from '../queries';

export default function Create() {
  const navigate = useNavigate();
  // Temporary hardcoded employee ID for login.
  const employeeId = 1;

  const { data: existingData, isLoading } =
    useEmployeeSelfAssessmentQuery(employeeId);
  const { mutateAsync: createMutation, isPending: isCreating } =
    useCreateEmployeeSelfAssessmentMutation();
  const { mutateAsync: updateMutation, isPending: isUpdating } =
    useUpdateEmployeeSelfAssessmentMutation();

  const isPending = isCreating || isUpdating;

  const handleBack = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  async function handleSubmit(
    data: CareerAdvancement.EmployeeSelfAssessmentForm
  ) {
    try {
      const payload = {
        ...data,
        employeeId,
        selfAssessmentId: existingData?.selfAssessmentId,
      };

      const result = existingData?.selfAssessmentId
        ? await updateMutation(payload)
        : await createMutation(payload);

      if (result) {
        ToastService.success(
          `Employee Self Assessment ${existingData?.selfAssessmentId ? 'updated' : 'submitted'} successfully.`
        );
        handleBack();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      ToastService.error(
        errorMessage || 'Failed to submit Employee Self Assessment.'
      );
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormPage
      title="Employee Self Assessment"
      description="Annual Performance Assessment Report (APAR) - Employee Self Assessment"
    >
      <EmployeeSelfAssessmentForm
        onSubmit={handleSubmit}
        onCancel={handleBack}
        isSaving={isPending}
        initialData={existingData ?? undefined}
        isReadOnly={existingData?.status === 'Submitted'}
      />
    </FormPage>
  );
}
