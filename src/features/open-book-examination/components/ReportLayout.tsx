import React from 'react';
import { Button } from 'shared/components/buttons';

interface ReportLayoutProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export default function ReportLayout({
  title,
  description,
  toolbar,
  children,
}: ReportLayoutProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen print:bg-white print:min-h-0">
      {/* Non-Printable Header Area */}
      <div className="print:hidden px-6 py-5 bg-white border-b flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {description && (
            <p className="text-slate-500 text-sm mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {toolbar}
          <Button
            label="Print Report"
            icon="print"
            variant="outlined"
            onClick={() => window.print()}
          />
        </div>
      </div>

      {/* Printable Report Header (hidden on screen) */}
      <div className="hidden print:block mb-8 text-center border-b pb-4 mt-8">
        <h1 className="text-3xl font-bold text-black mb-2">{title}</h1>
        <p className="text-gray-600">Generated on: {currentDate}</p>
      </div>

      {/* Report Content */}
      <div className="p-6 print:p-0 flex-1 overflow-auto print:overflow-visible">
        <div className="max-w-7xl mx-auto space-y-6 print:max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
