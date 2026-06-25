import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox, Switch, TextArea } from 'shared/components/forms';
import moment from 'moment';

type Props = {
  fetchData?: Cms.NoticeForm;
  isSaving?: boolean;
  onSubmit: (data: Cms.NoticeForm) => void;
};

const DEFAULT_DATA: Cms.NoticeForm = {
  text: '',
  isActive: true,
  expiresAt: null,
  displayOrder: 0,
};

const schema = validation.create<Cms.NoticeForm>(o => ({
  text: o.string().required().label('Notice Text'),
  expiresAt: o.string().optional().allow('', null),
  displayOrder: o.number().optional().allow(null, 0),
  isActive: o.boolean().optional(),
}));

export default function NoticeForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control } = useAppForm<Cms.NoticeForm>({
    defaultValues: {
      ...fetchData,
      expiresAt: fetchData.expiresAt
        ? moment(fetchData.expiresAt).format('YYYY-MM-DD')
        : null,
    },
    resolver: validation.resolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <TextArea label="Notice Text" required {...register('text')} />
        </div>
        <TextBox label="Expires At (Optional)" {...register('expiresAt')} />
        <TextBox label="Display Order" {...register('displayOrder')} />
        <Switch control={control} name="isActive" label="Is Active" />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Notice"
        />
      </div>
    </form>
  );
}
