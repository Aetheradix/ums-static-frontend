import React from 'react';

interface InfoBannerProps {
  title?: string;
  message: string | React.ReactNode;
  icon?: string;
  className?: string;
}

export default function InfoBanner({
  title,
  message,
  className = '',
}: InfoBannerProps) {
  return (
    <div
      className={`flex items-start bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6 shadow-sm ${className}`}
    >
      <div className="ml-3">
        {title && (
          <h3 className="text-sm font-semibold text-blue-800 mb-1">{title}</h3>
        )}
        <div className="text-sm text-blue-600 leading-relaxed">{message}</div>
      </div>
    </div>
  );
}
