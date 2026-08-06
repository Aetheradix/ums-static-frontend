import { type Control, type Path } from 'react-hook-form';
import {
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { InspectionReportFormData } from './form.hook';

interface ComplianceAndOpinionStepProps {
  register: (key: Path<InspectionReportFormData>) => {
    control: Control<InspectionReportFormData>;
    name: Path<InspectionReportFormData>;
  };
  control: Control<InspectionReportFormData>;
  errors: any;
}

const yesNoNaOptions = [
  { id: 'N/A', name: 'N/A' },
  { id: 'Yes', name: 'Yes' },
  { id: 'No', name: 'No' },
];

export default function ComplianceAndOpinionStep({
  register,
  control,
  errors,
}: ComplianceAndOpinionStepProps) {
  return (
    <>
      <FormCard
        title="Section 11: Statutory Body Compliance"
        subtitle="Compliance details for AICTE, BCI, PCI, etc."
        icon="shield-check"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="AICTE Conditions Fulfilled in Time? (B.Ed/B.P.Ed/M.P.Ed/MBA)"
            placeholder="Select AICTE Conditions Fulfilled in Time"
            name="aicte_conditions_fulfilled"
            control={control}
            data={yesNoNaOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.aicte_conditions_fulfilled?.message}
          />
          <DropDownList
            label="Statutory Approval Obtained? (LLB/MBBS/BAMS/BPT/DMLT/BUMS)"
            placeholder="Select Statutory Approval Obtained"
            name="statutory_approval_obtained"
            control={control}
            data={yesNoNaOptions}
            textField="name"
            valueField="id"
            errorMessage={errors.statutory_approval_obtained?.message}
          />
          <div className="col-span-2">
            <TextBox
              label="Session / Year up to Which Permission / Recognition Granted"
              {...register('permission_session_year')}
              errorMessage={errors.permission_session_year?.message}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Statutory Body Conditions Compliance Status"
              {...register('statutory_compliance_status')}
              errorMessage={errors.statutory_compliance_status?.message}
              rows={2}
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 12: Opinion of the Inspection Committee"
        subtitle="Final recommendations and overall assessment"
        icon="chat-square-text"
      >
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
          <strong>Note:</strong> Committee should recommend only after carefully
          observing all details. Talk to university officers, HOD, and concerned
          staff before forming opinion.
        </div>
        <FormGrid columns={2}>
          <div className="col-span-2">
            <TextArea
              label="Proposed Courses — Recommended? Minimum Requirements Before Affiliation"
              placeholder="Yes/No + Requirements"
              {...register('proposed_courses_opinion')}
              errorMessage={errors.proposed_courses_opinion?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <TextArea
              label="Running Courses — Recommended? Minimum Requirements Before Affiliation"
              placeholder="Yes/No + Requirements"
              {...register('running_courses_opinion')}
              errorMessage={errors.running_courses_opinion?.message}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <TextBox
              label="Information Submitted by College Not Substantiated — Point A"
              {...register('unsubstantiated_point_a')}
              errorMessage={errors.unsubstantiated_point_a?.message}
            />
          </div>
          <div className="col-span-2">
            <TextBox
              label="Information Submitted by College Not Substantiated — Point B"
              {...register('unsubstantiated_point_b')}
              errorMessage={errors.unsubstantiated_point_b?.message}
            />
          </div>
          <div className="col-span-2">
            <TextBox
              label="Information Submitted by College Not Substantiated — Point C"
              {...register('unsubstantiated_point_c')}
              errorMessage={errors.unsubstantiated_point_c?.message}
            />
          </div>
          <TextArea
            label="Positive Points Noticed by Committee"
            {...register('positive_points')}
            errorMessage={errors.positive_points?.message}
            rows={3}
            className="border-green-400 focus:border-green-500"
          />
          <TextArea
            label="Negative Points Noticed by Committee"
            {...register('negative_points')}
            errorMessage={errors.negative_points?.message}
            rows={3}
            className="border-red-400 focus:border-red-500"
          />
          <div className="col-span-2">
            <TextArea
              label="Overall Assessment of Inspection"
              {...register('overall_assessment')}
              errorMessage={errors.overall_assessment?.message}
              rows={3}
              required
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Section 13: Committee Member Signatures"
        subtitle="Signatures and details of the inspecting members"
        icon="pencil-square"
      >
        <FormGrid columns={3}>
          {/* Member 1 */}
          <div className="p-4 border rounded bg-slate-50">
            <h6 className="font-bold mb-3 text-slate-700">Member 1</h6>
            <FormGrid columns={1}>
              <TextBox
                label="Name"
                {...register('m1_signature_name')}
                errorMessage={errors.m1_signature_name?.message}
                required
              />
              <TextBox
                label="Designation & Scale"
                {...register('m1_designation_scale')}
                errorMessage={errors.m1_designation_scale?.message}
                required
              />
              <FileUpload
                name="m1_signature_file"
                control={control}
                label="Upload Signature"
                mode="photo"
                accept="image/*,.pdf"
                errorMessage={errors.m1_signature_file?.message}
              />
            </FormGrid>
          </div>

          {/* Member 2 */}
          <div className="p-4 border rounded bg-slate-50">
            <h6 className="font-bold mb-3 text-slate-700">Member 2</h6>
            <FormGrid columns={1}>
              <TextBox
                label="Name"
                {...register('m2_signature_name')}
                errorMessage={errors.m2_signature_name?.message}
                required
              />
              <TextBox
                label="Designation & Scale"
                {...register('m2_designation_scale')}
                errorMessage={errors.m2_designation_scale?.message}
                required
              />
              <FileUpload
                name="m2_signature_file"
                control={control}
                label="Upload Signature"
                mode="photo"
                accept="image/*,.pdf"
                errorMessage={errors.m2_signature_file?.message}
              />
            </FormGrid>
          </div>

          {/* Member 3 */}
          <div className="p-4 border rounded bg-slate-50">
            <h6 className="font-bold mb-3 text-slate-700">Member 3</h6>
            <FormGrid columns={1}>
              <TextBox
                label="Name"
                {...register('m3_signature_name')}
                errorMessage={errors.m3_signature_name?.message}
              />
              <TextBox
                label="Designation & Scale"
                {...register('m3_designation_scale')}
                errorMessage={errors.m3_designation_scale?.message}
              />
              <FileUpload
                name="m3_signature_file"
                control={control}
                label="Upload Signature"
                mode="photo"
                accept="image/*,.pdf"
                errorMessage={errors.m3_signature_file?.message}
              />
            </FormGrid>
          </div>
        </FormGrid>
      </FormCard>
    </>
  );
}
