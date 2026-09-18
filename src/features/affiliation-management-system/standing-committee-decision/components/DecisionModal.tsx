import { useState, useEffect } from 'react';
import { FormGrid, FormPopup } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextBox,
  TextArea,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';
import { ToastService } from 'services';
import type {
  FinalDecisionStatus,
  StandingCommitteeDecisionItem,
} from '../types';
import { DUMMY_APPLICATIONS } from '../data';

interface DecisionModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: (decision: StandingCommitteeDecisionItem) => void;
  editingItem?: StandingCommitteeDecisionItem | null;
}

const DECISION_OPTIONS: {
  value: FinalDecisionStatus;
  label: string;
  desc: string;
  icon: string;
  activeColor: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: 'Approved',
    label: 'Approved',
    desc: 'Affiliation granted unconditionally or with standard recommendations',
    icon: 'pi pi-check-circle',
    activeColor: 'text-emerald-700 font-bold',
    bgColor: 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm',
    borderColor: 'border-gray-200 hover:border-emerald-300',
  },
  {
    value: 'Returned for Compliance',
    label: 'Returned for Compliance',
    desc: 'Withheld temporarily pending resolution of specified deficiencies',
    icon: 'pi pi-exclamation-triangle',
    activeColor: 'text-amber-700 font-bold',
    bgColor: 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm',
    borderColor: 'border-gray-200 hover:border-amber-300',
  },
  {
    value: 'Deferred',
    label: 'Deferred',
    desc: 'Postponed for re-inspection, further inquiry, or next meeting',
    icon: 'pi pi-clock',
    activeColor: 'text-blue-700 font-bold',
    bgColor: 'bg-blue-50 border-blue-400 text-blue-800 shadow-sm',
    borderColor: 'border-gray-200 hover:border-blue-300',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    desc: 'Affiliation denied due to non-fulfillment of mandatory statutory norms',
    icon: 'pi pi-times-circle',
    activeColor: 'text-rose-700 font-bold',
    bgColor: 'bg-rose-50 border-rose-400 text-rose-800 shadow-sm',
    borderColor: 'border-gray-200 hover:border-rose-300',
  },
];

export default function DecisionModal({
  visible,
  onHide,
  onSave,
  editingItem,
}: DecisionModalProps) {
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null
  );
  const [applicationNo, setApplicationNo] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [collegeType, setCollegeType] = useState('');
  const [district, setDistrict] = useState('');
  const [coursesApplied, setCoursesApplied] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [committeeMembers, setCommitteeMembers] = useState('');
  const [discussionObservation, setDiscussionObservation] = useState('');
  const [finalDecision, setFinalDecision] =
    useState<FinalDecisionStatus>('Approved');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [decisionDate, setDecisionDate] = useState<Date | undefined>(
    new Date()
  );
  const [decisionReferenceNo, setDecisionReferenceNo] = useState('');
  const [supportingDocumentName, setSupportingDocumentName] =
    useState<string>('');

  useEffect(() => {
    if (editingItem) {
      setSelectedCollegeId(editingItem.collegeId);
      setApplicationNo(editingItem.applicationNo);
      setCollegeCode(editingItem.collegeCode || '');
      setCollegeType(editingItem.collegeType || '');
      setDistrict(editingItem.district || '');
      setCoursesApplied(editingItem.coursesApplied || '');
      setMeetingDate(
        editingItem.meetingDate ? new Date(editingItem.meetingDate) : undefined
      );
      setCommitteeMembers(editingItem.committeeMembers || '');
      setDiscussionObservation(editingItem.discussionObservation || '');
      setFinalDecision(editingItem.finalDecision);
      setDecisionRemarks(editingItem.decisionRemarks || '');
      setDecisionDate(
        editingItem.decisionDate
          ? new Date(editingItem.decisionDate)
          : new Date()
      );
      setDecisionReferenceNo(editingItem.decisionReferenceNo || '');
      setSupportingDocumentName(editingItem.supportingDocumentName || '');
    } else {
      setSelectedCollegeId(null);
      setApplicationNo('');
      setCollegeCode('');
      setCollegeType('');
      setDistrict('');
      setCoursesApplied('');
      setMeetingDate(undefined);
      setCommitteeMembers('');
      setDiscussionObservation('');
      setFinalDecision('Approved');
      setDecisionRemarks('');
      setDecisionDate(new Date());
      setDecisionReferenceNo(
        `UMS/AFF/SC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
      );
      setSupportingDocumentName('');
    }
  }, [editingItem, visible]);

  const handleCollegeChange = (id: number | null) => {
    setSelectedCollegeId(id);
    if (!id) {
      setApplicationNo('');
      setCollegeCode('');
      setCollegeType('');
      setDistrict('');
      setCoursesApplied('');
      setCommitteeMembers('');
      setDiscussionObservation('');
      setMeetingDate(undefined);
      return;
    }

    const app = DUMMY_APPLICATIONS.find(a => a.id === id);
    if (app) {
      setApplicationNo(app.applicationNo);
      setCollegeCode(app.collegeCode);
      setCollegeType(app.collegeType);
      setDistrict(app.district);
      setCoursesApplied(app.coursesApplied);
      setCommitteeMembers(app.committeeMembers || '');
      setDiscussionObservation(app.preliminaryObservation || '');
      setMeetingDate(app.lastMeetingDate);
    }
  };

  const handleDecisionChange = (status: FinalDecisionStatus) => {
    setFinalDecision(status);
  };

  const handleSave = () => {
    if (!selectedCollegeId) {
      ToastService.error('Please select a college / application.');
      return;
    }
    if (!meetingDate) {
      ToastService.error('Please specify the Standing Committee Meeting date.');
      return;
    }
    if (!finalDecision) {
      ToastService.error('Please select a Final Decision.');
      return;
    }
    if (!decisionRemarks.trim()) {
      ToastService.error('Please provide Decision Remarks / Reason.');
      return;
    }
    if (!decisionDate) {
      ToastService.error('Please select Decision Date.');
      return;
    }

    const college = DUMMY_APPLICATIONS.find(c => c.id === selectedCollegeId);
    const collegeName =
      college?.name || editingItem?.collegeName || 'Unknown College';

    const savedRecord: StandingCommitteeDecisionItem = {
      id: editingItem?.id || Date.now(),
      collegeId: selectedCollegeId,
      collegeName,
      applicationNo: applicationNo || college?.applicationNo || 'N/A',
      collegeCode: collegeCode || college?.collegeCode,
      collegeType: collegeType || college?.collegeType,
      district: district || college?.district,
      coursesApplied: coursesApplied || college?.coursesApplied,
      meetingDate,
      committeeMembers: committeeMembers || 'N/A',
      discussionObservation: discussionObservation || 'N/A',
      finalDecision,
      decisionRemarks,
      supportingDocumentName:
        supportingDocumentName ||
        `Minutes_${applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      decisionDate,
      decisionReferenceNo:
        decisionReferenceNo ||
        `UMS/AFF/SC/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      recordedBy: 'Standing Committee / Registrar Office',
    };

    onSave(savedRecord);
    onHide();
  };

  return (
    <FormPopup
      visible={visible}
      onHide={onHide}
      title={
        editingItem
          ? `Edit Standing Committee Decision - ${editingItem.collegeName}`
          : 'Record Standing Committee Final Decision'
      }
      size="xl"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="outlined" onClick={onHide} label="Cancel" />
          <Button
            variant="primary"
            onClick={handleSave}
            label={editingItem ? 'Update Decision' : 'Save & Record Decision'}
            icon="pi pi-check"
          />
        </div>
      }
    >
      <div className="p-4 flex flex-col gap-6">
        {/* Section 1: College & Application Information */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="pi pi-building text-slate-700" />
            1. College & Application Reference
          </h4>
          <FormGrid columns={3}>
            <DropDownList
              label="Select College Name"
              defaultOptionText="-- Select College --"
              placeholder="Select College"
              data={DUMMY_APPLICATIONS}
              textField="name"
              valueField="id"
              value={selectedCollegeId}
              onChange={val => handleCollegeChange(val as number)}
              required
            />
            <TextBox
              label="Application Number"
              value={applicationNo}
              readOnly
              placeholder="Auto-populated from college selection"
            />
            <TextBox
              label="College Code"
              value={collegeCode || ''}
              readOnly
              placeholder="Auto-populated"
            />
          </FormGrid>
        </div>

        {/* Section 2: Meeting & Committee Information */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="pi pi-users text-slate-700" />
            2. Meeting & Committee Details
          </h4>
          <FormGrid columns={2}>
            <DatePicker
              label="Meeting Date"
              placeholder="DD/MM/YYYY"
              value={meetingDate}
              onChange={val => setMeetingDate(val || undefined)}
              required
            />
            <TextBox
              label="Committee Members (Present)"
              placeholder="Auto-populated from meeting details"
              value={committeeMembers}
              readOnly
            />
          </FormGrid>
          <div className="mt-4">
            <TextArea
              label="Discussion / Observation"
              placeholder="Auto-populated from meeting discussion & observations"
              value={discussionObservation}
              readOnly
              rows={3}
            />
          </div>
        </div>

        {/* Section 3: Final Decision Selection */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="pi pi-verified text-slate-700" />
            3. Final Decision
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {DECISION_OPTIONS.map(opt => {
              const isSelected = finalDecision === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleDecisionChange(opt.value)}
                  className={`cursor-pointer rounded-lg border-2 p-3.5 transition-all flex flex-col justify-between ${
                    isSelected
                      ? opt.bgColor
                      : `bg-white ${opt.borderColor} hover:bg-slate-50`
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <i
                          className={`${opt.icon} text-lg ${
                            isSelected ? opt.activeColor : 'text-slate-400'
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? opt.activeColor : 'text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="finalDecisionGroup"
                        checked={isSelected}
                        onChange={() => handleDecisionChange(opt.value)}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <TextArea
              label="Decision Remarks / Reason"
              placeholder="Enter the justification, decision summary, and reason for the chosen decision..."
              value={decisionRemarks}
              onChange={val => setDecisionRemarks(val)}
              rows={3}
              required
            />
          </div>
        </div>

        {/* Section 4: Documentation & Order Reference */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="pi pi-file text-slate-700" />
            4. Supporting Documentation & Order Reference
          </h4>
          <FormGrid columns={2}>
            <DatePicker
              label="Final Decision Date"
              placeholder="DD/MM/YYYY"
              value={decisionDate}
              onChange={val => setDecisionDate(val || undefined)}
              required
            />
            <TextBox
              label="Decision Reference / Order No."
              placeholder="e.g. UMS/AFF/SC/2026/089"
              value={decisionReferenceNo}
              onChange={val => setDecisionReferenceNo(val)}
            />
          </FormGrid>
          <div className="mt-4">
            <FileUpload
              label="Supporting Document"
              subLabel="(Meeting Minutes / Order PDF)"
              mode="file"
              accept=".pdf,.doc,.docx"
              value={supportingDocumentName}
              uploadNote="PDF, DOC or DOCX format, maximum size 10 MB"
              onChange={(file: File | null) => {
                if (file) {
                  setSupportingDocumentName(file.name);
                  ToastService.success(`Attached file: ${file.name}`);
                } else {
                  setSupportingDocumentName('');
                }
              }}
            />
          </div>
        </div>
      </div>
    </FormPopup>
  );
}
