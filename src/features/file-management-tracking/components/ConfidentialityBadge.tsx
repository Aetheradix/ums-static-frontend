const levelColors: Record<string, string> = {
  Public: 'bg-green-100 text-green-700',
  Internal: 'bg-blue-100 text-blue-700',
  Confidential: 'bg-orange-100 text-orange-700',
  Restricted: 'bg-red-100 text-red-700',
};

export default function ConfidentialityBadge({ level }: { level: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[level] || 'bg-gray-100 text-gray-700'}`}
    >
      {level}
    </span>
  );
}
