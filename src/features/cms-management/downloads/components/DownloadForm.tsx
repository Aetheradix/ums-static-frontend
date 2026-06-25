import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox, Switch } from 'shared/components/forms';

type Props = {
  fetchData?: Cms.DownloadForm;
  isSaving?: boolean;
  onSubmit: (data: Cms.DownloadForm) => void;
};

const DEFAULT_DATA: Cms.DownloadForm = {
  name: '',
  icon: 'picture_as_pdf',
  fileType: 'PDF',
  fileSizeDisplay: '1.2 MB',
  fileUrl: '',
  isActive: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.DownloadForm>(o => ({
  name: o.string().required().label('Name'),
  icon: o.string().optional().allow(''),
  fileType: o.string().optional().allow(''),
  fileSizeDisplay: o.string().optional().allow(''),
  displayOrder: o.number().optional().allow(null, 0),
  fileUrl: o.string().optional().allow('', null),
  isActive: o.boolean().optional(),
}));

export default function DownloadForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control } = useAppForm<Cms.DownloadForm>({
    defaultValues: fetchData,
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
          <TextBox label="Name" required {...register('name')} />
        </div>
        <TextBox label="Icon (Material Icon)" {...register('icon')} />
        <TextBox
          label="File Type (e.g., PDF, DOCX)"
          {...register('fileType')}
        />
        <TextBox
          label="File Size Display (e.g., 2.5 MB)"
          {...register('fileSizeDisplay')}
        />
        <TextBox label="Display Order" {...register('displayOrder')} />
        <div className="col-span-2">
          <TextBox label="File URL" {...register('fileUrl')} />
        </div>
        <Switch control={control} name="isActive" label="Is Active" />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Download"
        />
      </div>
    </form>
  );
}
