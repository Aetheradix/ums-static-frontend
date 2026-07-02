import { useNavigate, useParams } from 'react-router-dom';
import {
  DatePicker,
  DropDownList,
  FormWizard,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { ToastService } from 'services';
import {
  advocates,
  caseTypes,
  courts,
  partyTypes,
  type LegalCase,
} from '../../mocks';
import type { CaseFormValues } from '../../api';
import {
  useCasesQuery,
  useCreateCaseMutation,
  useUpdateCaseMutation,
} from '../../queries';
import { legalUrls } from '../../urls';
import { useCaseForm, type CaseFormData } from './case.hook';

const STATUS_OPTIONS = [
  { name: 'Pending', value: 'Pending' },
  { name: 'In-favour', value: 'In-favour' },
  { name: 'Against', value: 'Against' },
  { name: 'Disposed', value: 'Disposed' },
];

const formatDate = (d?: Date) =>
  d
    ? d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : undefined;

const parseDate = (s?: string) => (s ? new Date(s) : undefined);

function toInitialData(c: LegalCase): Partial<CaseFormData> {
  return {
    caseNumber: c.caseNumber,
    title: c.title,
    subject: c.subject,
    brief: c.brief,
    courtId: c.courtId,
    caseTypeId: c.caseTypeId,
    partyTypeId: c.partyTypeId,
    advocateId: c.advocateId,
    filingDate: parseDate(c.filingDate),
    counterAffidavitDate: parseDate(c.counterAffidavitDate),
    disposalDate: parseDate(c.disposalDate),
    status: c.status,
    judgmentDoc: c.judgmentDoc,
    remarks: c.remarks,
  };
}

function CaseFormInner({
  existing,
  casesUrl,
}: {
  existing?: LegalCase;
  casesUrl: string;
}) {
  const navigate = useNavigate();
  const isEdit = !!existing;
  const createMutation = useCreateCaseMutation();
  const updateMutation = useUpdateCaseMutation();

  const { register, handleSubmit, reset, trigger } = useCaseForm(
    async data => {
      const payload: CaseFormValues = {
        caseNumber: data.caseNumber,
        title: data.title,
        subject: data.subject,
        brief: data.brief,
        courtId: Number(data.courtId),
        caseTypeId: Number(data.caseTypeId),
        partyTypeId: Number(data.partyTypeId),
        advocateId: Number(data.advocateId),
        filingDate: formatDate(data.filingDate) ?? '',
        counterAffidavitDate: formatDate(data.counterAffidavitDate),
        disposalDate: formatDate(data.disposalDate),
        status: data.status,
        judgmentDoc: data.judgmentDoc,
        remarks: data.remarks,
      };

      try {
        if (isEdit && existing) {
          await updateMutation.mutateAsync({ id: existing.id, form: payload });
          ToastService.success('Case updated successfully.');
        } else {
          await createMutation.mutateAsync(payload);
          ToastService.success('Case registered successfully.');
        }
        navigate(casesUrl);
      } catch {
        ToastService.error('Failed to save the case. Please try again.');
      }
    },
    existing ? toInitialData(existing) : undefined
  );

  const steps: WizardStep[] = [
    {
      label: 'Basic Info',
      icon: 'file',
      content: (
        <FormCard title="Case Basic Information" icon="file">
          <FormGrid columns={2}>
            <TextBox
              {...register('caseNumber')}
              label="Case Number"
              placeholder="e.g. WP/2024/0142"
              required
              maxLength={40}
            />
            <TextBox
              {...register('title')}
              label="Case Title"
              placeholder="Short descriptive title"
              required
              maxLength={200}
            />
            <div className="col-span-full">
              <TextBox
                {...register('subject')}
                label="Subject"
                placeholder="Subject / matter of the case"
                maxLength={200}
              />
            </div>
            <div className="col-span-full">
              <TextArea
                {...register('brief')}
                label="Case Brief"
                placeholder="Brief description of the case background and issue"
                rows={4}
              />
            </div>
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Classification',
      icon: 'sitemap',
      content: (
        <FormCard title="Court & Classification" icon="sitemap">
          <FormGrid columns={2}>
            <DropDownList
              {...register('courtId')}
              label="Court"
              placeholder="Select Court"
              data={courts}
              textField="name"
              valueField="id"
              required
            />
            <DropDownList
              {...register('caseTypeId')}
              label="Case Type"
              placeholder="Select Case Type"
              data={caseTypes}
              textField="name"
              valueField="id"
              required
            />
            <DropDownList
              {...register('partyTypeId')}
              label="Party Type"
              placeholder="Select Party Type"
              data={partyTypes}
              textField="name"
              valueField="id"
              required
            />
            <DropDownList
              {...register('advocateId')}
              label="Assigned Advocate"
              placeholder="Select Advocate"
              data={advocates}
              textField="name"
              valueField="id"
              required
            />
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Dates & Status',
      icon: 'calendar',
      content: (
        <FormCard title="Timeline & Status" icon="calendar">
          <FormGrid columns={2}>
            <DatePicker
              {...register('filingDate')}
              label="Filing Date"
              placeholder="Select filing date"
              required
            />
            <DatePicker
              {...register('counterAffidavitDate')}
              label="Counter-affidavit Date"
              placeholder="Select date (if any)"
            />
            <DatePicker
              {...register('disposalDate')}
              label="Disposal Date"
              placeholder="Select date (if disposed)"
            />
            <DropDownList
              {...register('status')}
              label="Case Status"
              placeholder="Select Status"
              data={STATUS_OPTIONS}
              textField="name"
              valueField="value"
              required
            />
          </FormGrid>
        </FormCard>
      ),
    },
    {
      label: 'Judgment & Remarks',
      icon: 'check-circle',
      content: (
        <FormCard title="Judgment & Remarks" icon="check-circle">
          <FormGrid columns={1}>
            <TextBox
              {...register('judgmentDoc')}
              label="Judgment Document"
              placeholder="Reference / filename of the judgment copy"
              maxLength={200}
            />
            <TextArea
              {...register('remarks')}
              label="Remarks"
              placeholder="Any closing notes, next steps or observations"
              rows={4}
            />
          </FormGrid>
        </FormCard>
      ),
    },
  ];

  return (
    <FormPage
      title={isEdit ? 'Edit Legal Case' : 'Register Legal Case'}
      description={
        isEdit
          ? 'Update the details of the selected legal case.'
          : 'Register a new legal case in the university legal register.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Register', to: casesUrl },
        { label: isEdit ? 'Edit' : 'Register' },
      ]}
    >
      <FormWizard
        steps={steps}
        onComplete={handleSubmit as () => void}
        isSaving={createMutation.isPending || updateMutation.isPending}
        triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
        onReset={reset}
        isEdit={isEdit}
      />
    </FormPage>
  );
}

export default function CaseForm({
  casesUrl = legalUrls.admin.cases,
}: {
  casesUrl?: string;
}) {
  const { id } = useParams();
  const isEdit = !!id;
  const { data, isLoading } = useCasesQuery();
  const existing = isEdit ? data.find(c => String(c.id) === id) : undefined;

  if (isEdit && !existing) {
    return (
      <FormPage
        title="Edit Legal Case"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Legal Case Management', to: legalUrls.portal },
          { label: 'Case Register', to: casesUrl },
          { label: 'Edit' },
        ]}
      >
        <FormCard>
          <p className="p-4 text-sm text-gray-500">
            {isLoading ? 'Loading case…' : 'Case not found.'}
          </p>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <CaseFormInner
      key={existing?.id ?? 'new'}
      existing={existing}
      casesUrl={casesUrl}
    />
  );
}
