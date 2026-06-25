import { useEmployeeSelfAssessmentForm } from './form.hook';

import {
  SelectAssessmentSession,
  SelectFaculty,
  SelectPerformanceRating,
} from 'features/components';
import { Button } from 'shared/components/buttons';
import { FileUpload, NumberBox, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';

interface EmployeeSelfAssessmentFormProps {
  onSubmit: (
    data: CareerAdvancement.EmployeeSelfAssessmentForm
  ) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  initialData?: CareerAdvancement.EmployeeSelfAssessmentForm;
  isReadOnly?: boolean;
}

export default function EmployeeSelfAssessmentForm({
  onSubmit,
  onCancel,
  isSaving = false,
  initialData,
  isReadOnly = false,
}: EmployeeSelfAssessmentFormProps) {
  const { control, handleSubmit, reset, setValue } =
    useEmployeeSelfAssessmentForm(onSubmit, initialData);

  const handleDraftClick = () => {
    setValue('status', 'Draft');
  };

  const handleForwardClick = () => {
    setValue('status', 'Submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset
        disabled={isReadOnly}
        className="flex flex-col gap-6 border-none p-0 m-0 min-w-0"
      >
        <FormCard title="General Assessment Information" icon="calendar">
          <FormGrid columns={4}>
            <SelectAssessmentSession
              control={control}
              name="sessionId"
              label="Session"
              required
            />
            <SelectFaculty
              control={control}
              name="reviewingHeadId"
              label="Reporting Officer"
              required
            />
          </FormGrid>
        </FormCard>

        {/* Section A */}
        <FormCard title="Section A: Assessment of Work Output" icon="briefcase">
          <FormGrid columns={1}>
            <TextArea
              control={control}
              name="tasksProject"
              label="Tasks / Projects Assigned"
              placeholder="Describe the tasks and projects assigned during the assessment period"
              rows={4}
              required
            />
            <FormGrid columns={2}>
              <NumberBox
                control={control}
                name="workOutputScore"
                label="Claimed Score"
                subLabel="(Max Score: 40)"
                placeholder="Enter claimed score"
                min={0}
                max={40}
                required
              />
              <TextArea
                control={control}
                name="workOutputRemark"
                label="Remarks"
                placeholder="Enter remarks for Section A"
                rows={2}
              />
            </FormGrid>
          </FormGrid>
        </FormCard>

        {/* Section B */}
        <FormCard
          title="Section B: Assessment of Personal Attributes"
          icon="user"
        >
          <FormGrid columns={3}>
            <SelectPerformanceRating
              control={control}
              name="leadershipQuality"
              label="Leadership Quality"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="communicationSkill"
              label="Communication Skills"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="integrity"
              label="Integrity"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="adaptability"
              label="Adaptability"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="teamWork"
              label="Team Work"
              required
            />
          </FormGrid>
        </FormCard>

        {/* Section C */}
        <FormCard
          title="Section C: Assessment of Functional Competency"
          icon="cog"
        >
          <FormGrid columns={2}>
            <SelectPerformanceRating
              control={control}
              name="domainKnowledge"
              label="Domain Knowledge"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="problemSolvingAbility"
              label="Problem Solving Ability"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="decisionMaking"
              label="Decision Making"
              required
            />
            <SelectPerformanceRating
              control={control}
              name="analyticalSkill"
              label="Analytical Skills"
              required
            />
          </FormGrid>
          <div className="mt-4">
            <TextArea
              control={control}
              name="functionalRemark"
              label="Remarks (Functional Competency)"
              placeholder="Enter remarks for functional competencies"
              rows={3}
            />
          </div>
        </FormCard>

        {/* Section D */}
        <FormCard title="Section D: Supporting Document" icon="file-pdf">
          <FormGrid columns={2}>
            <FileUpload
              control={control}
              name="supportingDocument"
              label="Supporting Document"
              accept="application/pdf/*"
              uploadNote="Upload supporting documents (PDF, Max 5MB)"
              required={!initialData?.selfAssessmentId}
              mode="file"
            />
            <TextArea
              control={control}
              name="additionalRemarks"
              label="Additional Remarks"
              placeholder="Enter any additional remarks"
              rows={4}
            />
          </FormGrid>
        </FormCard>
      </fieldset>

      {/* Actions */}
      <div className="form-actions-container form-actions-right">
        <Button
          label={isReadOnly ? 'Back' : 'Cancel'}
          type="button"
          onClick={onCancel}
          icon={isReadOnly ? 'arrow-left' : 'times'}
          variant="outlined"
          disabled={isSaving}
        />
        {!isReadOnly && (
          <>
            <Button
              label="Reset"
              type="button"
              onClick={() => reset()}
              icon="refresh"
              variant="outlined"
              disabled={isSaving}
            />
            <Button
              label="Save as Draft"
              type="submit"
              onClick={handleDraftClick}
              icon="save"
              variant="outlined"
              className="button-auto-width"
              isLoading={isSaving}
            />
            <Button
              label="Continue & Forward"
              type="submit"
              onClick={handleForwardClick}
              icon="arrow-right"
              variant="success"
              isLoading={isSaving}
            />
          </>
        )}
      </div>
    </form>
  );
}
