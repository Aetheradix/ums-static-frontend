import { FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useNavigate } from 'react-router-dom';
import { cfsUrls } from '../urls';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <FormPage title="Unauthorized Access">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <i className="pi pi-lock text-red-500 text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h2>
        <p className="text-gray-600 mb-8 max-w-md text-lg">
          You do not have the required permissions to view this page. If you
          believe this is an error, please contact your system administrator.
        </p>
        <div className="flex gap-4">
          <Button
            label="Go Back"
            variant="outlined"
            icon="pi pi-arrow-left"
            onClick={() => navigate(-1)}
          />
          <Button
            label="Go to Dashboard"
            variant="primary"
            icon="pi pi-home"
            onClick={() => navigate(cfsUrls.root)}
          />
        </div>
      </div>
    </FormPage>
  );
}
