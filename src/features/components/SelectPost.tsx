import type { FieldValues } from 'react-hook-form';
import { DropDownList } from 'shared/components/forms';
import { usePostsQuery } from '../master/hr/post/queries';

interface SelectPostProps<T extends FieldValues> extends Controls.FormProps<T> {
  label?: string;
  disabled?: boolean;
}

export default function SelectPost<T extends FieldValues>({
  defaultOptionText,
  label = 'Post',
  ...props
}: SelectPostProps<T> &
  Controls.InputBlockProps & { defaultOptionText?: string }) {
  const { data, isLoading } = usePostsQuery();
  const activeData = data.filter(item => item.isActive);

  return (
    <DropDownList
      data={activeData}
      loading={isLoading}
      textField="name"
      valueField="id"
      optionValue="id"
      label={label}
      required={true}
      defaultOptionText={defaultOptionText}
      placeholder={
        defaultOptionText === null || defaultOptionText === undefined
          ? `Select ${label}`
          : defaultOptionText
      }
      {...props}
    />
  );
}
