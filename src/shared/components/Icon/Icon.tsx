import React, { useLayoutEffect, useRef, useState } from 'react';

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
  module: 'view_module',
};

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const [isFallback, setIsFallback] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // If the name starts with "pi-" or "pi ", it's a PrimeIcon!
  const isPrimeIcon = name.startsWith('pi-') || name.startsWith('pi ');

  useLayoutEffect(() => {
    if (isPrimeIcon) {
      setIsFallback(false);
      return;
    }

    const checkWidth = () => {
      if (ref.current) {
        const width = ref.current.getBoundingClientRect().width;
        const height = ref.current.getBoundingClientRect().height || 24;

        // If width is significantly larger than height, it indicates text fallback
        if (width > height * 1.3) {
          setIsFallback(true);
        } else {
          setIsFallback(false);
        }
      }
    };

    // Initial check
    checkWidth();

    // Check again after fonts load (to avoid temporary flash of text triggering fallback)
    if (document.fonts) {
      document.fonts.ready.then(checkWidth);
    }
  }, [name, isPrimeIcon]);

  if (isPrimeIcon) {
    const fullClass = name.startsWith('pi ') ? name : `pi ${name}`;
    return <i className={`${fullClass} ${className}`} />;
  }

  // Otherwise, check if it's mapped to a Material Symbol
  const mappedName = ICON_MAPPING[name] || name;
  const iconNameToShow = isFallback ? 'circle' : mappedName.replace(/-/g, '_');

  return (
    <i
      ref={ref}
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: isFallback ? '10px' : undefined, // Make the fallback dot small and subtle
        opacity: isFallback ? 0.5 : undefined,
      }}
    >
      {iconNameToShow}
    </i>
  );
};
