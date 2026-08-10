import type { Control } from 'react-hook-form';
import { FileUpload } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import './CollegeEnclosureStep.css';

interface CollegeEnclosureStepProps {
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
}

export default function CollegeEnclosureStep({
  control,
}: CollegeEnclosureStepProps) {
  return (
    <div className="college-enclosure-step">
      <FormCard
        title="Enclosure (All enclosures to be submitted in hard copy)"
        subtitle="Please upload clear and legible scanned copies in PDF format."
        icon="folder-open"
        headerAction={
          <div className="enclosure-card-top-note">
            <i className="pi pi-info-circle" />
            <span>Maximum file size: 250 KB each</span>
          </div>
        }
      >
        <FormGrid columns={1}>
          <div className="enclosure-upload-list">
            <FileUpload
              label="Attach scanned copy of Affidavit in .pdf format"
              name="affidavitFile"
              control={control}
              accept=".pdf"
              mode="file"
              uploadNote="PDF format only, maximum size 250 KB"
              required
            />

            <FileUpload
              label="Other documents"
              name="regularAuthorityFile"
              control={control}
              accept=".pdf"
              mode="file"
              uploadNote="PDF format only, maximum size 250 KB (Optional)"
            />
          </div>
        </FormGrid>
      </FormCard>
    </div>
  );
}
