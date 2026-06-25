import { ToastService } from 'services';

import {
  DatePicker,
  DropDownList,
  FileUpload,
  RadioButtonList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { useSubmitInspectionReportMutation } from '../api';
import { useInspectionReportForm } from '../components/form.hook';

export default function Create() {
  const { register, control, handleSubmit, formState } =
    useInspectionReportForm();
  const { mutateAsync, isPending } = useSubmitInspectionReportMutation();

  const onFormSubmit = handleSubmit(
    async data => {
      try {
        await mutateAsync(data);
        ToastService.success('Inspection report submitted successfully!');
      } catch (e: any) {
        ToastService.error(e?.message || 'Failed to submit report.');
      }
    },
    errors => {
      console.log('Validation Errors:', errors);

      const getFirstError = (obj: any): string | null => {
        if (!obj || typeof obj !== 'object') return null;
        for (const key in obj) {
          if (obj[key]?.message && typeof obj[key].message === 'string') {
            return obj[key].message;
          }
          const nested = getFirstError(obj[key]);
          if (nested) return nested;
        }
        return null;
      };

      const errorMsg = getFirstError(errors);
      ToastService.error(
        errorMsg
          ? `Validation Error: ${errorMsg}`
          : 'Please fix the validation errors in the form.'
      );
    }
  );

  return (
    <FormPage
      title="Detailed Inspection Report"
      description="College: Bhopal College | App No: 111281524081"
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Inspection Report' }]}
      headerAction={
        <StatusBadge label="Inspection In Progress" variant="pending" />
      }
    >
      <FormCard title="1. INFRASTRUCTURE & PHYSICAL ASSETS">
        <FormGrid columns={3}>
          <DropDownList
            label="Total Built-up Area as per norms?"
            placeholder="Select status"
            name="builtUpArea"
            control={control}
            data={[
              { id: 'yes', name: 'Yes, as per norms' },
              { id: 'no', name: 'No, does not meet norms' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.builtUpArea?.message as string}
            required
          />
          <DropDownList
            label="Number of Classrooms as per norms?"
            placeholder="Select status"
            name="numberOfClassrooms"
            control={control}
            data={[
              { id: 'yes', name: 'Yes, as per norms' },
              { id: 'no', name: 'No, does not meet norms' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.numberOfClassrooms?.message as string
            }
            required
          />
          <DropDownList
            label="Classroom Size as per norms?"
            placeholder="Select status"
            name="classroomSizeStatus"
            control={control}
            data={[
              { id: 'yes', name: 'Yes, as per norms' },
              { id: 'no', name: 'No, does not meet norms' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.classroomSizeStatus?.message as string
            }
            required
          />
          <DropDownList
            label="Number of Laboratories as per norms?"
            placeholder="Select status"
            name="numberOfLaboratories"
            control={control}
            data={[
              { id: 'yes', name: 'Yes, as per norms' },
              { id: 'no', name: 'No, does not meet norms' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.numberOfLaboratories?.message as string
            }
            required
          />
          <DropDownList
            label="Library Books Available as per norms?"
            placeholder="Select status"
            name="libraryBooksAvailable"
            control={control}
            data={[
              { id: 'yes', name: 'Yes, as per norms' },
              { id: 'no', name: 'No, does not meet norms' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.libraryBooksAvailable?.message as string
            }
            required
          />
          <DropDownList
            label="Internet Facility (Bandwidth)"
            placeholder="Select Bandwidth"
            name="internetBandwidth"
            control={control}
            data={[
              { id: '10mbps', name: '10 Mbps or less' },
              { id: '50mbps', name: '10 - 50 Mbps' },
              { id: '100mbps', name: '50 - 100 Mbps' },
              { id: 'high', name: 'Above 100 Mbps' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.internetBandwidth?.message as string}
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard title="2. ACADEMIC & FACULTY STATUS">
        <FormGrid columns={2}>
          <RadioButtonList
            label="Is Principal Qualified as per norms?"
            name="isPrincipalQualified"
            control={control}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            errorMessage={
              formState.errors.isPrincipalQualified?.message as string
            }
            required
          />
          <RadioButtonList
            label="Are Salaries paid via Bank Account?"
            name="areSalariesPaidViaBank"
            control={control}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            errorMessage={
              formState.errors.areSalariesPaidViaBank?.message as string
            }
            required
          />
        </FormGrid>
        <FormGrid columns={3}>
          <TextBox
            label="Total Teaching Faculty"
            placeholder="Available faculty"
            {...register('totalTeachingFaculty')}
            errorMessage={
              formState.errors.totalTeachingFaculty?.message as string
            }
            required
          />
          <TextBox
            label="Required Faculty (as per intake)"
            placeholder="Norm requirement"
            {...register('requiredFaculty')}
            errorMessage={formState.errors.requiredFaculty?.message as string}
            required
          />
          <TextBox
            label="Student-Teacher Ratio"
            placeholder="e.g. 1:20"
            {...register('studentTeacherRatio')}
            errorMessage={
              formState.errors.studentTeacherRatio?.message as string
            }
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard title="3. STATUTORY & SAFETY COMPLIANCES">
        <FormGrid columns={3}>
          <DatePicker
            name="fireSafetyNocValidUpto"
            control={control}
            placeholder="dd-mm-yyyy"
            label="Fire Safety NOC Valid Upto"
            errorMessage={
              formState.errors.fireSafetyNocValidUpto?.message as string
            }
          />
          <DropDownList
            name="structuralSafetyCertificate"
            control={control}
            placeholder="Select verification"
            label="Building Structural Safety Certificate"
            data={[
              { id: 'verified', name: 'Verified & Safe' },
              { id: 'pending', name: 'Pending' },
              { id: 'unsafe', name: 'Not Safe' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.structuralSafetyCertificate?.message as string
            }
          />
          <DropDownList
            name="barrierFreeEnvironment"
            control={control}
            placeholder="Select status"
            label="Barrier-Free Environment (PwD Friendly)"
            data={[
              { id: 'available', name: 'Available & Compliant' },
              { id: 'partial', name: 'Partially Available' },
              { id: 'unavailable', name: 'Not Available' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={
              formState.errors.barrierFreeEnvironment?.message as string
            }
          />
        </FormGrid>
      </FormCard>

      <FormCard title="4. GEO-TAGGED EVIDENCES">
        <FormGrid columns={4}>
          <FileUpload
            name="evidenceMainBuilding"
            control={control}
            label="Main Building Front"
            mode="photo"
            accept="image/jpeg, image/png"
            uploadNote="JPG/PNG max 2MB"
          />
          <FileUpload
            name="evidenceLaboratories"
            control={control}
            label="Laboratories"
            mode="photo"
            accept="image/jpeg, image/png"
            uploadNote="JPG/PNG max 2MB"
          />
          <FileUpload
            name="evidenceLibrary"
            control={control}
            label="Library & Reading Rm"
            mode="photo"
            accept="image/jpeg, image/png"
            uploadNote="JPG/PNG max 2MB"
          />
          <FileUpload
            name="evidenceClassrooms"
            control={control}
            label="Classrooms"
            mode="photo"
            accept="image/jpeg, image/png"
            uploadNote="JPG/PNG max 2MB"
          />
        </FormGrid>
      </FormCard>

      <FormCard title="5. FINAL RECOMMENDATION">
        <FormGrid columns={1}>
          <DropDownList
            label="Committee Final Decision"
            placeholder="-- Select Final Recommendation Outcome --"
            name="finalDecision"
            control={control}
            data={[
              { id: 'recommend', name: 'Recommend for Affiliation' },
              {
                id: 'recommend_conditional',
                name: 'Recommend with Conditions',
              },
              { id: 'reject', name: 'Do Not Recommend (Reject)' },
            ]}
            textField="name"
            valueField="id"
            errorMessage={formState.errors.finalDecision?.message as string}
            required
          />
          <TextArea
            label="List Major Deficiencies (if any)"
            placeholder="Point-wise deficiencies..."
            {...register('majorDeficiencies')}
            errorMessage={formState.errors.majorDeficiencies?.message as string}
            rows={3}
          />
          <TextArea
            label="Overall Inspector Remarks"
            placeholder="Enter detailed observations and summary of the visit..."
            {...register('overallRemarks')}
            errorMessage={formState.errors.overallRemarks?.message as string}
            rows={3}
            required
          />
        </FormGrid>
      </FormCard>

      <FormActions
        align="right"
        saveLabel="Submit Complete Report"
        onSave={onFormSubmit}
        isLoading={isPending}
      />
    </FormPage>
  );
}
