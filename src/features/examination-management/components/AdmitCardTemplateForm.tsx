import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { FormGrid, FormActions } from 'shared/new-components';
import {
  TextBox,
  DropDownList,
  Switch,
  NumberBox,
} from 'shared/components/forms';
import { ToastService } from 'services';
import { useCycleOptionsQuery } from '../queries';

interface AdmitCardTemplateFormProps {
  initialData?: any;
  onClose: () => void;
}

const DEFAULT_VALUES: Examination.AdmitCardTemplateForm = {
  templateCode: '',
  templateName: '',
  applicableCycleId: '',
  applicableFromYear: new Date().getFullYear(),
  orientation: 'Portrait',
  isDefault: false,
  status: 'Draft',
};

const schema = validation.create<Examination.AdmitCardTemplateForm>(o => ({
  templateCode: o.string().required().label('Template Code').max(50),
  templateName: o.string().required().label('Template Name').max(100),
  applicableCycleId: o.number().required().label('Applicable Cycle'),
  applicableCycleName: o.string().optional(),
  applicableFromYear: o.number().required().label('Applicable From Year'),
  orientation: o.string().valid('Portrait', 'Landscape').required(),
  isDefault: o.boolean().optional(),
  status: o.string().valid('Published', 'Draft').required(),
}));

export default function AdmitCardTemplateForm({
  initialData,
  onClose,
}: AdmitCardTemplateFormProps) {
  const isEdit = !!initialData;
  const { data: cycleOptions = [] } = useCycleOptionsQuery();
  const { register, handleSubmit, reset, control } =
    useAppForm<Examination.AdmitCardTemplateForm>({
      resolver: validation.resolver(schema),
      defaultValues: initialData ?? DEFAULT_VALUES,
    });

  const onSubmit = async (_data: Examination.AdmitCardTemplateForm) => {
    // Mock save behavior
    ToastService.success(
      `Admit Card Template ${isEdit ? 'updated' : 'created'} successfully.`
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGrid columns={2}>
        <TextBox label="Template Code" {...register('templateCode')} required />
        <TextBox label="Template Name" {...register('templateName')} required />
        <NumberBox
          label="Applicable From Year"
          {...register('applicableFromYear')}
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
        <DropDownList
          control={control}
          name="orientation"
          label="Orientation"
          data={[
            { text: 'Portrait', value: 'Portrait' },
            { text: 'Landscape', value: 'Landscape' },
          ]}
          textField="text"
          valueField="value"
          required
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
          required
        />
        <Switch
          control={control}
          name="isDefault"
          label="Is Default Template?"
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
