import { clsx } from 'clsx';
import {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  PenTool,
  CheckCircle,
  Wallet,
  LayoutTemplate,
  MessageSquare,
  FileText,
  Briefcase,
  Laptop,
  Receipt,
  Truck,
  Box,
  Microscope,
  Cpu,
  UserCog,
  TrendingUp,
  UsersRound,
  CalendarDays,
  Banknote,
  PiggyBank,
  UserPlus,
  Workflow,
  Network,
  Database,
  Megaphone,
  Gift,
  ShieldAlert,
  Building,
  FolderTree,
  Bus,
  ThumbsDown,
  HeartPulse,
  Home,
  Scale,
  Archive,
  DoorOpen,
  FileWarning,
  Lock,
  Headset,
  Dumbbell,
  Circle,
  type LucideIcon,
} from 'lucide-react';

interface ModuleChipProps {
  module: { name: string; icon: string };
  index: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Users,
  GraduationCap,
  Award,
  PenTool,
  CheckCircle,
  Wallet,
  LayoutTemplate,
  MessageSquare,
  FileText,
  Briefcase,
  Laptop,
  Receipt,
  Truck,
  Box,
  Microscope,
  Cpu,
  UserCog,
  TrendingUp,
  UsersRound,
  CalendarDays,
  Banknote,
  PiggyBank,
  UserPlus,
  Workflow,
  Network,
  Database,
  Megaphone,
  Gift,
  ShieldAlert,
  Building,
  FolderTree,
  Bus,
  ThumbsDown,
  HeartPulse,
  Home,
  Scale,
  Archive,
  DoorOpen,
  FileWarning,
  Lock,
  Headset,
  Dumbbell,
};

const ICON_COLOR_VARIANTS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-rose-100', text: 'text-rose-600' },
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
];

export default function ModuleChip({ module, index }: ModuleChipProps) {
  const iconColor = ICON_COLOR_VARIANTS[index % ICON_COLOR_VARIANTS.length];
  const IconComponent = ICON_MAP[module.icon] || Circle;

  return (
    <div
      className="px-3 py-2 flex items-center gap-2.5 rounded-md border border-border bg-white text-[13px] font-medium text-navy transition-all duration-75 cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80"
      title={module.name}
    >
      {/* Icon with colored background */}
      <span
        className={clsx(
          'w-6 h-6 rounded flex items-center justify-center shrink-0',
          iconColor.bg,
          iconColor.text
        )}
      >
        <IconComponent className="w-3.5 h-3.5" strokeWidth={2.5} />
      </span>
      <span className="line-clamp-2 leading-snug sm:truncate text-left">
        {module.name}
      </span>
    </div>
  );
}
