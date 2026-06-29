import React from 'react';

// Define the props for strict typing
interface IconProps {
  name: string; // The keyword (e.g., "home", "search")
  className?: string; // For adding Tailwind classes or custom CSS
}

// Map common FontAwesome / PrimeIcons / Kebab-case names to valid Material Symbols ligatures
const ICON_MAPPING: Record<string, string> = {
  users: 'groups',
  'user-minus': 'person_remove',
  'user-edit': 'edit_note',
  'user-check': 'person_check',
  compass: 'explore',
  check: 'check',
  clock: 'schedule',
  ban: 'block',
  book: 'menu_book',
  bookmark: 'bookmark',
  verified: 'verified',
  calendar: 'calendar_today',
  'calendar-plus': 'calendar_add_on',
  'calendar-times': 'event_busy',
  file: 'description',
  'file-edit': 'edit_document',
  briefcase: 'work',
  'check-circle': 'check_circle',
};

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const mappedName = ICON_MAPPING[name] || name;
  return (
    // Combine our base CSS class with any passed-in utility classes
    <span className={`icon-base ${className}`}>{mappedName}</span>
  );
};
