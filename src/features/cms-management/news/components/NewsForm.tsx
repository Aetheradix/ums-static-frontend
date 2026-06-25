import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';
import { Button } from 'shared/components/buttons';
import {
  TextBox,
  Switch,
  TextArea,
  DropDownList,
} from 'shared/components/forms';

type Props = {
  fetchData?: Cms.NewsEventForm;
  isSaving?: boolean;
  onSubmit: (data: Cms.NewsEventForm) => void;
};

const DEFAULT_DATA: Cms.NewsEventForm = {
  title: '',
  description: '',
  category: 'news',
  externalLink: '',
  imageUrl: '',
  isPublished: true,
  displayOrder: 0,
};

const schema = validation.create<Cms.NewsEventForm>(o => ({
  title: o.string().required().label('Title'),
  category: o.string().required().label('Category'),
  displayOrder: o.number().optional().allow(null, 0),
  externalLink: o.string().optional().allow('', null),
  imageUrl: o.string().optional().allow('', null),
  description: o.string().optional().allow(''),
  isPublished: o.boolean().optional(),
}));

export default function NewsForm({
  fetchData = DEFAULT_DATA,
  isSaving,
  onSubmit,
}: Props) {
  const { register, handleSubmit, control } = useAppForm<Cms.NewsEventForm>({
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
          <TextBox label="Title" required {...register('title')} />
        </div>
        <DropDownList
          textField="label"
          valueField="value"
          label="Category"
          data={[
            { label: 'News', value: 'news' },
            { label: 'Event', value: 'event' },
            { label: 'Circular', value: 'circular' },
            { label: 'Workshop', value: 'workshop' },
          ]}
          required
          control={control}
          name="category"
        />
        <TextBox label="Display Order" {...register('displayOrder')} />
        <div className="col-span-2">
          <TextBox label="External Link URL" {...register('externalLink')} />
        </div>
        <div className="col-span-2">
          <TextBox label="Image URL" {...register('imageUrl')} />
        </div>
        <div className="col-span-2">
          <TextArea label="Description" {...register('description')} />
        </div>
        <Switch control={control} name="isPublished" label="Is Published" />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          label="Save News/Event"
        />
      </div>
    </form>
  );
}
