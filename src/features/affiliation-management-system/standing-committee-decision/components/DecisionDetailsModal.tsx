import {
  FormPopup,
  FormGrid,
  PreviewSection,
  PreviewField,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ToastService } from 'services';
import { formatDate } from 'shared/utils/dateUtils';
import type { StandingCommitteeDecisionItem } from '../types';

interface DecisionDetailsModalProps {
  visible: boolean;
  onHide: () => void;
  item: StandingCommitteeDecisionItem | null;
  onEdit?: (item: StandingCommitteeDecisionItem) => void;
}

export default function DecisionDetailsModal({
  visible,
  onHide,
  item,
  onEdit,
}: DecisionDetailsModalProps) {
  if (!item) return null;

  const getStatusVariant = (
    status: string
  ): 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Returned for Compliance':
        return 'warning';
      case 'Deferred':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleDownloadDocument = () => {
    ToastService.success(
      `Downloading document: ${item.supportingDocumentName || 'Decision_Order.pdf'}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <FormPopup
      visible={visible}
      onHide={onHide}
      title="Standing Committee Decision Record"
      size="xl"
      footer={
        <div className="flex gap-2 justify-between w-full items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Ref No: {item.decisionReferenceNo || 'N/A'}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              icon="pi pi-print"
              label="Print Order"
              onClick={handlePrint}
            />
            {item.supportingDocumentName && (
              <Button
                variant="outlined"
                icon="pi pi-download"
                label="Download Document"
                onClick={handleDownloadDocument}
              />
            )}
            {onEdit && (
              <Button
                variant="primary"
                icon="pi pi-pencil"
                label="Edit Decision"
                onClick={() => {
                  onHide();
                  onEdit(item);
                }}
              />
            )}
            <Button variant="outlined" label="Close" onClick={onHide} />
          </div>
        </div>
      }
    >
      <div className="p-4 flex flex-col gap-6">
        {/* Top Status Header Banner */}
        <div
          className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            item.finalDecision === 'Approved'
              ? 'bg-emerald-50 border-emerald-200'
              : item.finalDecision === 'Rejected'
                ? 'bg-rose-50 border-rose-200'
                : item.finalDecision === 'Returned for Compliance'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Final Committee Determination
              </span>
              <StatusBadge
                label={item.finalDecision}
                variant={getStatusVariant(item.finalDecision)}
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {item.collegeName}
            </h3>
            <p className="text-xs text-slate-600 font-mono">
              Application Ref: {item.applicationNo} | Order Ref:{' '}
              {item.decisionReferenceNo || 'N/A'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-700">
                Decision Date:{' '}
              </span>
              <span>{formatDate(item.decisionDate)}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">
                Meeting Date:{' '}
              </span>
              <span>{formatDate(item.meetingDate)}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Institution & Application Reference */}
        <PreviewSection
          title="Institution & Application Reference"
          subtitle="Details of the college applying for university affiliation."
        >
          <FormGrid columns={3}>
            <PreviewField label="COLLEGE NAME" value={item.collegeName} />
            <PreviewField
              label="APPLICATION NUMBER"
              value={item.applicationNo}
            />
            <PreviewField
              label="COLLEGE TYPE"
              value={item.collegeType || 'Private Self-Financed'}
            />
            <PreviewField
              label="DISTRICT"
              value={item.district || 'Madhya Pradesh'}
            />
            <PreviewField
              label="COLLEGE CODE"
              value={item.collegeCode || 'N/A'}
            />
            <PreviewField
              label="COURSES / PROGRAMMES"
              value={item.coursesApplied || 'Undergraduate / Postgraduate'}
            />
          </FormGrid>
        </PreviewSection>

        {/* Section 2: Meeting & Committee Presence */}
        <PreviewSection
          title="Meeting & Committee Observations"
          subtitle="Record of committee attendance and discussion notes."
        >
          <FormGrid columns={2}>
            <PreviewField
              label="MEETING DATE"
              value={formatDate(item.meetingDate)}
            />
            <PreviewField
              label="COMMITTEE MEMBERS PRESENT"
              value={item.committeeMembers}
            />
          </FormGrid>
          <div className="mt-3">
            <PreviewField
              label="DISCUSSION / COMMITTEE OBSERVATION"
              value={item.discussionObservation}
            />
          </div>
        </PreviewSection>

        {/* Section 3: Final Decision & Directives */}
        <PreviewSection
          title="Final Decision & Directive Details"
          subtitle="Official standing committee resolution, justification, and recommendations."
        >
          <FormGrid columns={2}>
            <PreviewField label="FINAL DECISION" value={item.finalDecision} />
            <PreviewField
              label="DECISION DATE"
              value={formatDate(item.decisionDate)}
            />
          </FormGrid>

          <div className="mt-3">
            <PreviewField
              label="DECISION REMARKS / REASON"
              value={item.decisionRemarks}
            />
          </div>
        </PreviewSection>

        {/* Section 4: Supporting Documentation & Order Reference */}
        <PreviewSection
          title="Supporting Documents & Reference"
          subtitle="Uploaded committee minutes and decision order reference."
        >
          <FormGrid columns={2}>
            <PreviewField
              label="DECISION REFERENCE / ORDER NO."
              value={item.decisionReferenceNo || 'N/A'}
            />
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                SUPPORTING DOCUMENT
              </span>
              {item.supportingDocumentName ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                      <i className="pi pi-file-pdf text-red-500 text-base" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.supportingDocumentName}
                      </p>
                      <p className="text-[11px] text-slate-500">PDF Document</p>
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    icon="pi pi-download"
                    label="Download"
                    onClick={handleDownloadDocument}
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400 font-medium">
                  No document uploaded
                </span>
              )}
            </div>
          </FormGrid>
        </PreviewSection>
      </div>
    </FormPopup>
  );
}
