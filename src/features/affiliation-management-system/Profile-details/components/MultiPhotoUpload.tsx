import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, Path } from 'react-hook-form';
import type { ProfileDetailsFormData } from './form.hook';

interface MultiPhotoUploadProps {
  control: Control<ProfileDetailsFormData>;
  name: Path<ProfileDetailsFormData>;
  label?: string;
  subLabel?: string;
}

// Repeatable photo picker: stores File[] in the form and shows removable
// thumbnails with an "Add Photo" tile. Used where multiple photos are allowed.
export default function MultiPhotoUpload({
  control,
  name,
  label,
  subLabel,
}: MultiPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const files: File[] = Array.isArray(field.value) ? field.value : [];

        return (
          <div className="input-block vertical">
            {label && (
              <label className="form-label">
                <span className="label-main">
                  {label}
                  {subLabel && <span className="label-sub">{subLabel}</span>}
                </span>
              </label>
            )}
            <div className="flex flex-wrap gap-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative w-28 h-28 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    title="Remove photo"
                    className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-red-500 shadow"
                    onClick={() =>
                      field.onChange(files.filter((_, i) => i !== index))
                    }
                  >
                    <i className="pi pi-times text-xs" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                <i className="pi pi-camera text-xl" />
                <span className="text-xs mt-1">Add Photo</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => {
                  const chosen = Array.from(e.target.files || []);
                  if (chosen.length) field.onChange([...files, ...chosen]);
                  e.target.value = '';
                }}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
