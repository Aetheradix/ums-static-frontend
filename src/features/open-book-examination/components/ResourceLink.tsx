interface Props {
  url: string;
  label: string;
  icon?: string;
  className?: string;
}

export default function ResourceLink({
  url,
  label,
  icon = 'link',
  className = '',
}: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline text-sm ${className}`}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      {label}
    </a>
  );
}
