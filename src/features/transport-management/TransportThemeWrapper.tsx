import React from 'react';
import './transportTheme.css';

interface TransportThemeWrapperProps {
  children: React.ReactNode;
}

export default function TransportThemeWrapper({
  children,
}: TransportThemeWrapperProps) {
  return (
    <div className="transport-theme w-full h-full flex flex-col relative overflow-auto">
      {/* Very subtle animated map-grid background */}
      <div
        className="panning-grid absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.035 }}
      />
      {/* Page content with fade-in */}
      <div className="relative z-10 flex-1 animate-fade-in-up">{children}</div>
    </div>
  );
}
