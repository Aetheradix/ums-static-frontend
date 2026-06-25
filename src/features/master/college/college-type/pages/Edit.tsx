import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import CollegeTypeForm from '../components/CollegeTypeForm';
import { useCollegeTypeQuery, useUpdateCollegeTypeMutation } from '../queries';

const DEFAULT = {
  name: '',
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateCollegeTypeMutation(id);
  const { data = DEFAULT, isLoading } = useCollegeTypeQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.collegeType.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: CollegeMaster.CollegeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Type updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update college type');
    }
  }

  return (
    <FormPage
      title="Edit College Type"
      description="Update the college type details."
    >
      <FormCard title="College Type Details">
        <CollegeTypeForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
