import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { InfoBanner } from '../../components';

export default function BulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [imported, setImported] = useState(false);

  const handleImport = () => {
    if (!file) return;
    setImported(true);
  };

  return (
    <FormPage
      title="Bulk Import Questions"
      description="Upload questions via CSV/Excel"
    >
      <InfoBanner
        title="About Bulk Import"
        message="Import questions and resources in bulk using standard CSV or Excel templates to quickly build up your question bank and course materials."
      />
      <FormCard title="Upload File">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="mb-3"
          />
          <p className="text-sm text-gray-500">Accepted formats: CSV, XLSX</p>
          <Button
            label="Download Template"
            icon="file_download"
            variant="outlined"
            className="mr-2 mt-2"
          />
        </div>
        {file && !imported && (
          <div className="mt-4">
            <p className="text-sm">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
            <Button
              label="Import Questions"
              icon="upload"
              onClick={handleImport}
              className="mt-2"
            />
          </div>
        )}
        {imported && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
            ✅ 15 questions imported successfully. 2 errors (row 4, 12) —{' '}
            <button className="underline">Download error log</button>
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
