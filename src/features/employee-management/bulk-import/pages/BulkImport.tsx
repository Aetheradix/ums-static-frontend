import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FileUpload } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  Tabs,
} from 'shared/new-components';
import {
  mockBulkInvalidEmployees,
  mockBulkValidEmployees,
} from '../../mockData';

export default function BulkImport() {
  const navigate = useNavigate();
  const [isParsed, setIsParsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (f: File | null) => {
    if (f) {
      // Mock parsing automatically on upload
      setIsParsed(true);
      ToastService.success('File parsed successfully.');
    } else {
      setIsParsed(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      ToastService.success('Valid records imported successfully.');
      navigate('/employee-management/manage-employees');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/employee-management/manage-employees');
  };

  const validColumns: Controls.ColumnProps<
    (typeof mockBulkValidEmployees)[0]
  >[] = [
    { field: 'employeeCode', header: 'Employee Code' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'officialEmail', header: 'Email' },
    { field: 'mobileNumber', header: 'Mobile Number' },
  ];

  const invalidColumns: Controls.ColumnProps<
    (typeof mockBulkInvalidEmployees)[0]
  >[] = [
    { field: 'employeeCode', header: 'Employee Code' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'officialEmail', header: 'Email' },
    { field: 'mobileNumber', header: 'Mobile Number' },
    { field: 'validationMessage', header: 'Validation Note' },
  ];

  return (
    <FormPage
      title="Bulk Import"
      breadcrumbs={[
        { label: 'Employee Management', to: '/employee-management' },
        { label: 'Bulk Import' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Upload Excel Sheet" icon="upload">
          <FormGrid columns={1}>
            <div className="max-w-md">
              <FileUpload
                id="bulkFile"
                label="Select Excel File"
                mode="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </div>
          </FormGrid>
        </FormCard>

        {isParsed && (
          <FormCard title="Validation Results" icon="list">
            <Tabs
              tabs={[
                {
                  title: `Valid Data (${mockBulkValidEmployees.length})`,
                  content: (
                    <div className="pt-4">
                      <GridPanel
                        data={mockBulkValidEmployees}
                        columns={validColumns}
                      />
                    </div>
                  ),
                },
                {
                  title: `Invalid Data (${mockBulkInvalidEmployees.length})`,
                  content: (
                    <div className="pt-4">
                      <GridPanel
                        data={mockBulkInvalidEmployees}
                        columns={invalidColumns}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </FormCard>
        )}

        <div className="form-actions-container form-actions-right mt-4">
          <Button
            label="Cancel"
            type="button"
            icon="times"
            variant="outlined"
            onClick={handleCancel}
            disabled={isSaving}
          />
          {isParsed && mockBulkValidEmployees.length > 0 && (
            <Button
              label="Save Valid Records"
              type="button"
              icon="save"
              variant="success"
              onClick={handleSave}
              isLoading={isSaving}
            />
          )}
        </div>
      </div>
    </FormPage>
  );
}
