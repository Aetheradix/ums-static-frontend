import { useState } from 'react';
import ResourceLink from './ResourceLink';

interface Material {
  id: number;
  title: string;
  fileUrl: string;
  fileType: string;
  externalLink?: string;
  category: string;
}

interface Props {
  materials: Material[];
  className?: string;
}

export default function BookMaterialViewer({
  materials,
  className = '',
}: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const categories = [...new Set(materials.map(m => m.category))];

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-base">menu_book</span>
        Open Book Resources
      </h4>
      {categories.map(cat => (
        <div key={cat} className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(open === cat ? null : cat)}
          >
            {cat}
            <span className="material-symbols-outlined text-base">
              {open === cat ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {open === cat && (
            <div className="px-3 pb-2 space-y-1">
              {materials
                .filter(m => m.category === cat)
                .map(m => (
                  <ResourceLink
                    key={m.id}
                    url={m.externalLink || m.fileUrl}
                    label={m.title}
                    icon={m.fileType === 'pdf' ? 'picture_as_pdf' : 'link'}
                  />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
