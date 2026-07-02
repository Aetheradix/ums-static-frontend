import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const ICON_MAPPING: Record<string, string> = {
  // Portal mappings
  calculate: 'calculator',
  folder_open: 'folder-open',
  schema: 'sitemap',
  receipt_long: 'receipt',
  folder_shared: 'users',
  payments: 'money-bill',
  settings: 'cog',
  campaign: 'megaphone',
  dashboard: 'chart-pie',
  plagiarism: 'file-check',
  format_list_numbered: 'list',
  event_seat: 'users',
  swap_horiz: 'sync',
  assignment: 'clipboard',
  list_alt: 'list',
  upload_file: 'upload',
  track_changes: 'clock',
  mail: 'envelope',
  download: 'download',
  admin_panel_settings: 'shield',
  school: 'book',
  person: 'user',
  domain: 'building',
  people: 'users',
  upload: 'upload',
  group_add: 'user-plus',
  view_list: 'list',
  account_tree: 'sitemap',
  upgrade: 'arrow-up-right',
  border_color: 'pencil',
  trending_up: 'chart-line',
  how_to_reg: 'user-plus',
  checklist: 'check-square',
  event_available: 'calendar-plus',
  calendar_month: 'calendar',
  menu_book: 'book',
  grade: 'star',
  history: 'history',
  support_agent: 'headphones',

  // generic
  account_circle: 'user',
  rule: 'check-square',
  description: 'file',
  calendar_today: 'calendar',
  explore: 'compass',
  groups: 'users',
  library_books: 'book',
  home: 'home',
  users: 'users',
  'user-minus': 'user-minus',
  'user-edit': 'user-edit',
  'user-check': 'user-plus',
  compass: 'compass',
  check: 'check',
  clock: 'clock',
  ban: 'ban',
  book: 'book',
  bookmark: 'bookmark',
  verified: 'verified',
  calendar: 'calendar',
  'calendar-plus': 'calendar-plus',
  'calendar-times': 'calendar-times',
  file: 'file',
  'file-edit': 'file-edit',
  briefcase: 'briefcase',
  'check-circle': 'check-circle',
  'arrow-up-right': 'arrow-up-right',
  'arrow-down-right': 'arrow-down-right',
  minus: 'minus',
  'th-large': 'th-large',
};

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const mappedName = ICON_MAPPING[name] || name;
  return <i className={`pi pi-${mappedName} ${className}`}></i>;
};
