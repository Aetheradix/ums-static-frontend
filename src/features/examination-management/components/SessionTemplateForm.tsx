import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import {
  TextBox,
  DropDownList,
  TextArea,
  Switch,
  NumberBox,
} from 'shared/components/forms';
import { ToastService } from 'services';
import { useCycleOptionsQuery } from '../queries';

interface SessionTemplateFormProps {
  initialData?: any;
  onClose: () => void;
}

const DEFAULT_VALUES: Examination.SessionTemplateForm = {
  code: '',
  templateName: '',
  applicableYear: new Date().getFullYear(),
  applicableCycleId: '' as unknown as number, // Required field
  description: '',
  isDefault: false,
  status: 'Draft',
};

const schema = validation.create<Examination.SessionTemplateForm>(o => ({
  code: o.string().required().label('Code').max(50),
  templateName: o.string().required().label('Template Name').max(100),
  applicableYear: o.number().required().label('Applicable Year'),
  applicableCycleId: o.number().required().label('Applicable Cycle'),
  description: o.string().optional().allow('').max(500),
  isDefault: o.boolean().optional(),
  status: o.string().valid('Published', 'Draft').required(),
  applicableCycleName: o.string().optional(),
}));

export default function SessionTemplateForm({
  initialData,
  onClose,
}: SessionTemplateFormProps) {
  const isEdit = !!initialData;
  const { data: cycleOptions = [] } = useCycleOptionsQuery();

  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.SessionTemplateForm>({
      resolver: validation.resolver(schema),
      defaultValues: initialData ?? DEFAULT_VALUES,
    });

  const onSubmit = async (_data: Examination.SessionTemplateForm) => {
    // Mock save behavior
    ToastService.success(
      `Session Template ${isEdit ? 'updated' : 'created'} successfully.`
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox label="Template Code" {...register('code')} required />
        <TextBox label="Template Name" {...register('templateName')} required />
        <NumberBox
          label="Applicable Year"
          {...register('applicableYear')}
          required
        />
        <DropDownList
          control={control}
          name="applicableCycleId"
          label="Applicable Cycle"
          data={cycleOptions}
          textField="text"
          valueField="id"
          required
        />
      </FormGrid>

      <div className="mt-4 mb-4">
        <TextArea label="Description" {...register('description')} rows={3} />
      </div>

      <FormGrid columns={2}>
        <Switch
          control={control}
          name="isDefault"
          label="Is Default Template?"
        />
        <DropDownList
          control={control}
          name="status"
          label="Status"
          data={[
            { text: 'Draft', value: 'Draft' },
            { text: 'Published', value: 'Published' },
          ]}
          textField="text"
          valueField="value"
        />
      </FormGrid>

      <FormActions
        isEditMode={isEdit}
        isLoading={false}
        onSave={handleSubmit(onSubmit)}
        onReset={reset}
      />
    </form>
  );
}
