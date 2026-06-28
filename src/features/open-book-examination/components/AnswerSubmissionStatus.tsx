interface Props {
  status: 'saving' | 'saved' | 'unsaved';
  className?: string;
}

export default function AnswerSubmissionStatus({
  status,
  className = '',
}: Props) {
  const config = {
    saving: { icon: 'sync', text: 'Saving...', color: 'text-blue-500' },
    saved: {
      icon: 'check_circle',
      text: 'All changes saved',
      color: 'text-green-500',
    },
    unsaved: {
      icon: 'error_outline',
      text: 'Unsaved changes',
      color: 'text-orange-500',
    },
  };

  const c = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${c.color} ${className}`}
    >
      <span className="material-symbols-outlined text-sm">{c.icon}</span>
      {c.text}
    </span>
  );
}
