import React from 'react';

// Define the props for strict typing
interface IconProps {
  name: string; // The keyword (e.g., "home", "search")
  className?: string; // For adding Tailwind classes or custom CSS
}

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  return (
    // Combine our base CSS class with any passed-in utility classes
    <span className={`icon-base ${className}`}>{name}</span>
  );
};
