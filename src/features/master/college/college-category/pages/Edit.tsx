import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { useParamsId } from 'shared/hooks/params';
import { masterUrls } from '../../../urls';
import CollegeCategoryForm from '../components/CollegeCategoryForm';
import {
  useCollegeCategoryQuery,
  useUpdateCollegeCategoryMutation,
} from '../queries';

const DEFAULT = {
  name: '',
  collegeTypeId: 0,
};

export default function Edit() {
  const navigate = useNavigate();
  const id = useParamsId();
  const { mutateAsync, isPending } = useUpdateCollegeCategoryMutation(id);
  const { data = DEFAULT, isLoading } = useCollegeCategoryQuery(id);

  const handleBack = useCallback(() => {
    navigate(masterUrls.collegeCategory.root);
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  async function handleSubmit(data: CollegeMaster.CollegeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Category updated successfully.');
        handleBack();
      }
    } catch {
      ToastService.error('Failed to update college category');
    }
  }

  return (
    <FormPage
      title="Edit College Category"
      description="Update the college category details."
    >
      <FormCard title="College Category Details">
        <CollegeCategoryForm
          fetchData={data}
          isSaving={isPending}
          isEditMode
          onSubmit={handleSubmit}
        />
      </FormCard>
    </FormPage>
  );
}
