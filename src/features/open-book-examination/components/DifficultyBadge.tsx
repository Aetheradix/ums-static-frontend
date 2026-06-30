import type { Difficulty } from '../data';

const colorMap: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800',
};

interface Props {
  level: Difficulty;
  className?: string;
}

export default function DifficultyBadge({ level, className = '' }: Props) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[level]} ${className}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}
