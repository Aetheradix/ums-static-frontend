import { Button } from 'primereact/button';
import FileUpload from 'shared/components/forms/FileUpload';
import { FormCard, FormPage } from 'shared/new-components';

export default function ImportAlumni() {
  return (
    <FormPage
      title="Import Alumni"
      description="Bulk import alumni data via Excel"
      breadcrumbs={[
        { label: 'Alumni Services', to: '/alumni-management' },
        { label: 'Import Alumni' },
      ]}
    >
      <FormCard>
        <div className="p-4 flex flex-col gap-6 max-w-3xl">
          <div className="flex items-center gap-4">
            <p>1. Download the prescribed Excel format.</p>
            <Button
              label="Download Excel Format"
              icon="pi pi-download"
              severity="secondary"
            />
          </div>
          <div>
            <p className="mb-2">2. Upload the filled Excel sheet.</p>
            <FileUpload maxSizeKB={5000} accept=".xlsx,.xls" />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
