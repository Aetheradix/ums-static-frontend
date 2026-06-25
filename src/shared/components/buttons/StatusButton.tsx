interface StatusButtonProps {
  value: boolean;
  onClick: () => void;
  className?: string;
}

export default function StatusButton({
  value,
  onClick,
  className,
}: StatusButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200
        bg-black text-white border-black
        [.dark_&]:bg-white [.dark_&]:text-black [.dark_&]:border-white
        ${className ?? ''}
      `}
    >
      {value ? 'Active' : 'Inactive'}
    </button>
  );
}
