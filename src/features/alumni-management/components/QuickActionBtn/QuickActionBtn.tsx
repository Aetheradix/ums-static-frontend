interface QuickActionBtnProps {
  icon?: string;
  label: string;
  onClick: () => void;
  colorScheme?: 'teal' | 'blue' | 'purple' | 'green' | 'amber' | 'red';
}

export default function QuickActionBtn({
  icon = 'chevron-right',
  label,
  onClick,
  colorScheme = 'teal',
}: QuickActionBtnProps) {
  const hoverBorderColor = {
    teal: 'hover:border-teal-300',
    blue: 'hover:border-blue-300',
    purple: 'hover:border-purple-300',
    green: 'hover:border-green-300',
    amber: 'hover:border-amber-300',
    red: 'hover:border-red-300',
  }[colorScheme];

  const iconColor = {
    teal: 'text-teal-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  }[colorScheme];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all cursor-pointer ${hoverBorderColor}`}
    >
      <i className={`pi pi-${icon} text-xl ${iconColor}`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
