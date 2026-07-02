import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

// Map common PrimeIcons / Kebab-case names back to valid Material Symbols ligatures
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
  'arrow-up-right': 'trending_up',
  'arrow-down-right': 'trending_down',
  minus: 'remove',
  'th-large': 'grid_view',
};

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  // If the name starts with "pi-", strip it so it gracefully degrades or fails visually (or map it)
  let cleanName = name.replace(/^pi-/, '');
  const mappedName = ICON_MAPPING[cleanName] || cleanName;

  return (
    <i className={`material-symbols-outlined ${className}`}>
      {mappedName.replace(/-/g, '_')}
    </i>
  );
};
