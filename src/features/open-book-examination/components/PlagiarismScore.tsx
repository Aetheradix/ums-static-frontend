interface Props {
  score: number;
  className?: string;
}

export default function PlagiarismScore({ score, className = '' }: Props) {
  const color =
    score < 20
      ? 'text-green-600'
      : score < 50
        ? 'text-yellow-600'
        : score < 75
          ? 'text-orange-600'
          : 'text-red-600';

  const bgColor =
    score < 20
      ? 'bg-green-100'
      : score < 50
        ? 'bg-yellow-100'
        : score < 75
          ? 'bg-orange-100'
          : 'bg-red-100';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color} ${className}`}
    >
      <span className="material-symbols-outlined text-sm">plagiarism</span>
      {score}%
    </span>
  );
}
