import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import DraftSearchForm from '../components/DraftRegistrationRequestForm';
import type { DraftSearchFormData } from '../components/form.hook';
import { useGetDraftRegistrationQuery } from '../queries';

export default function Search() {
  const [searchParams, setSearchParams] = useState<DraftSearchFormData | null>(
    null
  );
  const navigate = useNavigate();

  const { data, isFetching, isSuccess } = useGetDraftRegistrationQuery(
    searchParams?.applicationNumber || '',
    searchParams?.establishmentYear || 0
  );

  const handleSubmit = (formData: DraftSearchFormData) => {
    setSearchParams(formData);
  };

  useEffect(() => {
    if (isSuccess && data) {
      ToastService.success('Draft registration data retrieved successfully.');
    }
  }, [isSuccess, data]);

  return (
    <FormPage
      title="Draft Registration Request"
      description="Retrieve and edit a draft college registration using its application number."
    >
      <FormCard title="Search Draft">
        <DraftSearchForm onSubmit={handleSubmit} isFetching={isFetching} />
      </FormCard>

      {isSuccess && data && (
        <FormCard title="Draft Data Details">
          <div className="mt-4">
            <p>
              <strong>Application Number:</strong> {data.applicationNumber}
            </p>
            <p>
              <strong>College Name:</strong> {data.collegeName}
            </p>
            <p>
              <strong>Establishment Year:</strong> {data.establishmentYear}
            </p>
            <p>
              <strong>Email:</strong> {data.collegeEmail}
            </p>
            <div className="mt-4">
              <Button
                label="Edit Registration"
                icon="pi pi-user-edit"
                onClick={() =>
                  navigate(
                    '/affiliation-management-system/college-registration/update',
                    {
                      state: { draftData: data },
                    }
                  )
                }
              />
            </div>
            <p className="text-blue-600 mt-2">
              Click edit to pre-fill the form with these details.
            </p>
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
