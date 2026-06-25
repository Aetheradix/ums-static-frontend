import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import { TextBox, InputBlock } from 'shared/components/forms';

type Props = {
  isSaving?: boolean;
  onSubmit: (data: Cms.GalleryForm) => void;
  fetchData?: Cms.GalleryForm;
};

const DEFAULT_DATA: Cms.GalleryForm = {
  label: '',
  emoji: '📸',
  backgroundColor: '#0F4C81',
  imageUrl: '',
  displayOrder: 0,
};

const schema = validation.create<Cms.GalleryForm>(o => ({
  label: o.string().required().label('Label'),
  emoji: o.string().optional().allow(''),
  backgroundColor: o.string().optional().allow(''),
  displayOrder: o.number().optional().allow(null, 0),
  imageUrl: o.string().optional().allow('', null),
}));

export default function GalleryForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit } = useAppForm<Cms.GalleryForm>({
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
        <TextBox label="Label" required {...register('label')} />
        <TextBox label="Emoji" {...register('emoji')} />

        <InputBlock label="Background Color Hex" id="backgroundColor">
          <input
            id="backgroundColor"
            type="color"
            className="w-full h-10 p-1 border rounded-md cursor-pointer"
            {...register('backgroundColor')}
          />
        </InputBlock>

        <TextBox label="Display Order" {...register('displayOrder')} />
        <div className="col-span-2">
          <TextBox label="Image URL" {...register('imageUrl')} />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save Gallery Item"
        />
      </div>
    </form>
  );
}
