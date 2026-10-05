import { useState } from 'react';
import { FormPopup } from 'shared/new-components';
import { Button } from 'shared/components/buttons';

interface DocumentViewerModalProps {
  visible: boolean;
  onClose: () => void;
  documentTitle: string;
  fileName?: string;
  collegeName?: string;
  applicationNumber?: string;
}

export default function DocumentViewerModal({
  visible,
  onClose,
  documentTitle,
  fileName = 'Document.pdf',
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!visible) return null;

  const isMapOrPlan =
    documentTitle.toLowerCase().includes('map') ||
    documentTitle.toLowerCase().includes('plan');

  return (
    <FormPopup
      visible={visible}
      onHide={onClose}
      title={documentTitle}
      subtitle={fileName}
      size="lg"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="outlined" label="Close" onClick={onClose} />
        </div>
      }
    >
      <div className="flex flex-col bg-slate-100 rounded-xl overflow-hidden border border-slate-300">
        {/* Simple Viewer Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-200 text-xs">
          <div className="flex items-center gap-2 font-mono truncate max-w-xs sm:max-w-md">
            <i className="pi pi-file-pdf text-red-400 text-sm" />
            <span className="truncate">{fileName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white"
              onClick={() => setZoom(prev => Math.max(75, prev - 15))}
              title="Zoom Out"
            >
              <i className="pi pi-minus text-xs" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoom}%</span>
            <button
              type="button"
              className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white"
              onClick={() => setZoom(prev => Math.min(150, prev + 15))}
              title="Zoom In"
            >
              <i className="pi pi-plus text-xs" />
            </button>
            <span className="border-l border-slate-600 pl-2 ml-1 text-slate-400">
              Page 1 / 1
            </span>
          </div>
        </div>

        {/* Document View Canvas */}
        <div className="p-4 sm:p-6 overflow-auto max-h-[65vh] flex justify-center bg-slate-200/70">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
            className="w-full max-w-[680px] bg-white shadow-xl rounded border border-slate-300 p-8 sm:p-12 min-h-[580px] flex flex-col justify-between transition-transform duration-150 select-none relative"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] rotate-[-30deg]">
              <span className="text-7xl font-black text-slate-900 tracking-widest text-center">
                OFFICIAL RECORD
              </span>
            </div>

            {/* Document Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src="/DAVV_Logo.png"
                    alt="Emblem"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-wide uppercase m-0">
                      {documentTitle}
                    </h3>
                    <p className="text-xs text-slate-500 m-0 font-mono">
                      Ref: {fileName.replace(/\.[^/.]+$/, '').toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <i className="pi pi-check-circle text-[10px]" /> Verified
                  </span>
                </div>
              </div>

              {/* Document Visual Content */}
              {isMapOrPlan ? (
                /* Architectural Blueprint / Map Visual */
                <div className="border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-lg p-6 min-h-[320px] flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="border border-blue-400 bg-white p-4 rounded shadow-xs font-semibold text-blue-900">
                      BLOCK A<br />
                      <span className="text-[10px] text-slate-500 font-normal">
                        Admin & Classrooms
                      </span>
                    </div>
                    <div className="border border-blue-400 bg-white p-4 rounded shadow-xs font-semibold text-blue-900">
                      BLOCK B<br />
                      <span className="text-[10px] text-slate-500 font-normal">
                        Laboratories & Library
                      </span>
                    </div>
                    <div className="border border-blue-400 bg-white p-4 rounded shadow-xs font-semibold text-blue-900">
                      BLOCK C<br />
                      <span className="text-[10px] text-slate-500 font-normal">
                        Auditorium & Sports
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border border-emerald-400 bg-emerald-50/60 p-4 rounded text-center text-xs font-semibold text-emerald-800">
                    OPEN CAMPUS GROUND & PARKING AREA
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono border-t border-blue-200 pt-2">
                    <span>Scale: 1:100</span>
                    <span>Approved Layout Plan</span>
                  </div>
                </div>
              ) : (
                /* Standard Certificate / Sanction Document Body */
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed py-4 min-h-[300px]">
                  {/* Subtle placeholder line bars representing document body */}
                  <div className="space-y-2.5">
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-11/12" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-200 rounded w-9/12" />
                  </div>

                  <div className="my-6 p-4 border border-slate-200 rounded bg-slate-50/60 space-y-2">
                    <div className="h-2.5 bg-slate-300 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                  </div>

                  <div className="space-y-2.5">
                    <div className="h-3 bg-slate-200 rounded w-11/12" />
                    <div className="h-3 bg-slate-200 rounded w-10/12" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              )}
            </div>

            {/* Document Stamp & Signature Footer */}
            <div className="border-t border-slate-300 pt-4 mt-6 flex justify-between items-end text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-blue-600/30 text-blue-700 flex items-center justify-center text-[10px] font-bold text-center leading-tight rotate-[-12deg]">
                  OFFICIAL
                  <br />
                  SEAL
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Document ID Verified
                </span>
              </div>

              <div className="text-right">
                <div className="w-24 border-b border-dashed border-slate-400 mb-1" />
                <span className="font-semibold text-slate-700 text-xs">
                  Authorized Signatory
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormPopup>
  );
}
