import { StatusBadge } from 'shared/new-components';

export interface TemplateCardProps {
  id: string;
  title: string;
  subject: string;
  status: 'active' | 'draft' | 'archived';
  lastEdited: string;
  icon?: string;
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'teal';
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TemplateCard({
  id,
  title,
  subject,
  status,
  lastEdited,
  icon = 'file',
  colorScheme = 'blue',
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
  };

  const statusMap: Record<
    string,
    'approved' | 'pending' | 'rejected' | 'neutral'
  > = {
    active: 'approved',
    draft: 'pending',
    archived: 'neutral',
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      {/* Icon Area */}
      <div
        className={`h-24 flex items-center justify-center border-b ${colorMap[colorScheme] || colorMap.blue}`}
      >
        <i className={`pi pi-${icon} text-3xl opacity-80`} />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg truncate pr-2">
            {title}
          </h3>
          <StatusBadge
            variant={statusMap[status] || 'neutral'}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          <span className="font-medium text-gray-700">Subject: </span>
          {subject}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <i className="pi pi-clock text-[10px]" /> {lastEdited}
          </span>
        </div>
      </div>

      {/* Hover Actions Overlay */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 border border-blue-200 rounded-2xl">
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
            title="Edit"
          >
            <i className="pi pi-pencil" />
          </button>
        )}
        {onDuplicate && (
          <button
            onClick={() => onDuplicate(id)}
            className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-800 hover:text-white flex items-center justify-center transition-colors shadow-sm"
            title="Duplicate"
          >
            <i className="pi pi-copy" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
            title="Delete"
          >
            <i className="pi pi-trash" />
          </button>
        )}
      </div>
    </div>
  );
}
