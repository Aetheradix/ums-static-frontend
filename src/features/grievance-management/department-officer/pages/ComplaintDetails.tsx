import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { complaints } from '../../mocks';
import type { Complaint } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function DepartmentOfficerComplaintDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const complaintId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('complaint');

  // Find grievance details
  const [grievance, setGrievance] = useState(
    complaints.find((c: Complaint) => c.id === complaintId) || complaints[0]
  );

  // Notesheet form state
  const [notesheetRemarks, setNotesheetRemarks] = useState('');
  const [forwardTo, setForwardTo] = useState('');
  const [actionType, setActionType] = useState('Verify & Forward');
  const [notesheetDoc, setNotesheetDoc] = useState('');

  // Comment state for Clarification
  const [clarificationMsg, setClarificationMsg] = useState('');
  const [showClarificationBox, setShowClarificationBox] = useState(false);

  if (!grievance) {
    return (
      <FormPage title="File Details Error">
        <div className="p-4 bg-red-100 border text-red-700">
          Complaint file not found.
        </div>
      </FormPage>
    );
  }

  const handleVerify = () => {
    ToastService.success(
      `Grievance file ${grievance.ticketNo} verification complete. Documents mapped.`
    );
  };

  const handleCreateNotesheet = () => {
    const updated = { ...grievance };
    updated.notesheet = {
      notesheetNo: `NS/GRV/2026/0${Math.floor(100 + Math.random() * 900)}`,
      grievanceNo: grievance.ticketNo,
      department: grievance.department,
      createdDate: '14 Jul 2026 12:45 PM',
      status: 'Draft',
      entries: [
        {
          id: `NSE${Date.now()}`,
          notesheetNo: `NS/GRV/2026/0123`,
          department: grievance.department,
          officerName: 'Dr. Rakesh Verma',
          officerDesignation: 'Assistant Professor / Nodal Officer',
          remarks:
            'Grievance received. Checked with enrollment records. Standard verification process initiated.',
          actionTaken: 'Notesheet Created',
          supportingDocuments: [],
          timestamp: '14 Jul 2026 12:45 PM',
        },
      ],
    };
    updated.status = 'Department Review';
    setGrievance(updated);

    // Also update main complaints array in memory (static simulation)
    const originalIndex = complaints.findIndex(
      (c: Complaint) => c.id === grievance.id
    );
    if (originalIndex !== -1) {
      complaints[originalIndex] = updated;
    }

    ToastService.success(
      `Digital Green Notesheet generated successfully for ${grievance.ticketNo}`
    );
    setActiveTab('notesheet');
  };

  const handleForwardNotesheet = () => {
    if (!notesheetRemarks.trim()) {
      ToastService.error(
        'Officer Remarks are mandatory to forward a notesheet.'
      );
      return;
    }
    if (!forwardTo) {
      ToastService.error(
        'Please specify the next desk to forward the notesheet file.'
      );
      return;
    }

    const updated = { ...grievance };
    if (!updated.notesheet) return;

    // Append new notesheet entry
    const newEntry = {
      id: `NSE${Date.now()}`,
      notesheetNo: updated.notesheet.notesheetNo,
      department: grievance.department,
      officerName: 'Dr. Rakesh Verma',
      officerDesignation: 'Assistant Professor / Nodal Officer',
      remarks: notesheetRemarks,
      actionTaken: actionType,
      supportingDocuments: notesheetDoc ? [notesheetDoc] : [],
      timestamp: '14 Jul 2026 01:00 PM',
    };

    updated.notesheet.entries.push(newEntry);
    updated.notesheet.status = 'Forwarded';

    // Update grievance status and timeline based on forwarding target
    if (forwardTo === 'HoD') {
      updated.status = 'HoD Review';
      updated.timeline.push({
        id: `T${Date.now()}`,
        action: 'Forwarded to HoD',
        performedBy: 'Dr. Rakesh Verma',
        role: 'Department Officer',
        date: '14 Jul 2026 01:00 PM',
        remarks: `Notesheet forwarded to HoD for evaluation. Action: ${actionType}`,
        status: 'HoD Review',
        done: true,
        active: true,
      });
    } else {
      updated.status = 'Committee Review';
      updated.timeline.push({
        id: `T${Date.now()}`,
        action: 'Forwarded to Committee',
        performedBy: 'Dr. Rakesh Verma',
        role: 'Department Officer',
        date: '14 Jul 2026 01:00 PM',
        remarks: `Notesheet forwarded to ${forwardTo} for review. Action: ${actionType}`,
        status: 'Committee Review',
        done: true,
        active: true,
      });
    }

    // Set previous timeline entries done
    updated.timeline = updated.timeline.map((t: any) => {
      if (t.status === 'Department Review')
        return { ...t, active: false, done: true };
      return t;
    });

    setGrievance(updated);
    // Update mock db
    const originalIndex = complaints.findIndex(
      (c: Complaint) => c.id === grievance.id
    );
    if (originalIndex !== -1) {
      complaints[originalIndex] = updated;
    }

    ToastService.success(
      `File successfully forwarded to ${forwardTo} via notesheet.`
    );
    navigate(grvUrls.departmentOfficer.inbox);
  };

  const handleReturnNotesheet = () => {
    if (!notesheetRemarks.trim()) {
      ToastService.error(
        'Officer Remarks are mandatory to return a notesheet file.'
      );
      return;
    }
    const updated = { ...grievance };
    if (!updated.notesheet) return;

    const newEntry = {
      id: `NSE${Date.now()}`,
      notesheetNo: updated.notesheet.notesheetNo,
      department: grievance.department,
      officerName: 'Dr. Rakesh Verma',
      officerDesignation: 'Assistant Professor / Nodal Officer',
      remarks: notesheetRemarks,
      actionTaken: 'Return File',
      supportingDocuments: notesheetDoc ? [notesheetDoc] : [],
      timestamp: '14 Jul 2026 01:00 PM',
    };

    updated.notesheet.entries.push(newEntry);
    updated.notesheet.status = 'Returned';
    updated.status = 'Submitted';

    updated.timeline.push({
      id: `T${Date.now()}`,
      action: 'File Returned',
      performedBy: 'Dr. Rakesh Verma',
      role: 'Department Officer',
      date: '14 Jul 2026 01:00 PM',
      remarks: 'Notesheet returned back to intake registry.',
      status: 'Submitted',
      done: true,
      active: true,
    });

    setGrievance(updated);
    const originalIndex = complaints.findIndex(
      (c: Complaint) => c.id === grievance.id
    );
    if (originalIndex !== -1) {
      complaints[originalIndex] = updated;
    }

    ToastService.error(`File returned back successfully.`);
    navigate(grvUrls.departmentOfficer.inbox);
  };

  const handleSendClarification = () => {
    if (!clarificationMsg.trim()) {
      ToastService.error('Please write clarification instructions.');
      return;
    }

    // Add communication comment
    grievance.comments.push({
      id: `CMT${Date.now()}`,
      author: 'Dr. Rakesh Verma',
      role: 'Department Officer',
      message: `CLARIFICATION REQUESTED: ${clarificationMsg}`,
      date: '14 Jul 2026 01:00 PM',
      isInternal: false,
    });

    // Add timeline action
    grievance.timeline.push({
      id: `T${Date.now()}`,
      action: 'Clarification Requested',
      performedBy: 'Dr. Rakesh Verma',
      role: 'Department Officer',
      date: '14 Jul 2026 01:00 PM',
      remarks: `Clarification requested from complainant: ${clarificationMsg}`,
      status: grievance.status,
      done: true,
      active: true,
    });

    ToastService.success('Clarification request dispatched to complainant.');
    setShowClarificationBox(false);
    setClarificationMsg('');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'submitted';
      case 'Department Review':
        return 'assigned';
      case 'HoD Review':
        return 'under-review';
      case 'Committee Review':
        return 'forwarded';
      case 'Registrar Decision':
        return 'approved';
      case 'Closed':
        return 'closed';
      default:
        return '';
    }
  };

  const forwardTargets = [
    { name: 'Head of Department (HoD)', value: 'HoD' },
    {
      name: 'Student Grievance Redressal Committee (SGRC)',
      value: 'Student Grievance Redressal Committee (SGRC)',
    },
    {
      name: 'Anti-Ragging Committee (ARC)',
      value: 'Anti-Ragging Committee (ARC)',
    },
    {
      name: 'Internal Complaints Committee (ICC)',
      value: 'Internal Complaints Committee (ICC)',
    },
  ];

  const actionTypes = [
    { name: 'Verify & Forward', value: 'Verify & Forward' },
    {
      name: 'Recommend for Committee Hearing',
      value: 'Recommend for Committee Hearing',
    },
    { name: 'Return to Complainant', value: 'Return to Complainant' },
  ];

  return (
    <FormPage
      title={`File Movement Desk: ${grievance.ticketNo}`}
      description={`Review and process active grievance details for ${grievance.isAnonymous ? 'Anonymous Complainant' : grievance.studentName}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: 'Department Officer Portal',
          to: grvUrls.departmentOfficer.portal,
        },
        { label: 'Complaint Details' },
      ]}
    >
      <div className="grv-alert info flex justify-between items-center">
        <div>
          <span className="font-bold">File Status: </span>
          <span
            className={`grv-status-pill ${getStatusClass(grievance.status)} ml-2`}
          >
            {grievance.status}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            label="Verify File"
            icon="check"
            variant="outlined"
            onClick={handleVerify}
          />
          <Button
            label="Ask Clarification"
            icon="question"
            variant="outlined"
            onClick={() => setShowClarificationBox(!showClarificationBox)}
          />
        </div>
      </div>

      {showClarificationBox && (
        <FormCard title="Request Clarification from Complainant">
          <div className="space-y-3">
            <TextArea
              label="Instruction / Clarification Message *"
              placeholder="Explain what clarifications or supporting documents are needed from student..."
              value={clarificationMsg}
              onChange={setClarificationMsg}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowClarificationBox(false)}
              />
              <Button
                label="Send Request"
                variant="primary"
                onClick={handleSendClarification}
              />
            </div>
          </div>
        </FormCard>
      )}

      {/* Tabs Layout */}
      <div className="flex gap-2 border-b border-slate-200 mb-4 bg-white p-2 rounded-t-lg">
        {[
          { label: 'Complaint details', key: 'complaint', icon: 'pi-file' },
          {
            label: 'Student / Complainant Details',
            key: 'student',
            icon: 'pi-user',
          },
          { label: 'Attachments', key: 'attachments', icon: 'pi-paperclip' },
          { label: 'Digital Notesheet', key: 'notesheet', icon: 'pi-file-pdf' },
          { label: 'Activity History', key: 'history', icon: 'pi-history' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`pi ${tab.icon} text-[10px]`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'complaint' && (
        <FormCard title="Grievance Details Summary">
          <div className="text-xs space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-bold text-slate-700">
                  {grievance.category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Sub Category</span>
                <span className="font-bold text-slate-700">
                  {grievance.subCategory}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Incident Date</span>
                <span className="font-bold text-slate-700">
                  {grievance.incidentDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Submitted Date</span>
                <span className="font-bold text-slate-700">
                  {grievance.submittedDate}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-400 block">Subject / Title</span>
              <p className="font-bold text-sm text-slate-800">
                {grievance.subject}
              </p>

              <span className="text-slate-400 block mt-3">
                Grievance Narrative / Description
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 border rounded mt-1">
                {grievance.description}
              </p>
            </div>
          </div>
        </FormCard>
      )}

      {activeTab === 'student' && (
        <FormCard title="Complainant Details profile">
          <div className="text-xs space-y-3">
            {grievance.isAnonymous ? (
              <div className="p-4 bg-amber-50 text-amber-800 rounded border border-amber-200">
                <i className="pi pi-lock-open mr-2"></i>This grievance was
                submitted anonymously. Complainant details are masked under SGRC
                rules.
              </div>
            ) : (
              <FormGrid columns={3}>
                <div>
                  <span className="text-slate-400 block">Complainant Name</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {grievance.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">
                    {grievance.complaintType === 'Student'
                      ? 'Enrollment Number'
                      : 'Employee ID'}
                  </span>
                  <span className="font-bold text-slate-700 font-mono">
                    {grievance.enrollmentNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">
                    {grievance.complaintType === 'Student'
                      ? 'Course Program'
                      : 'Designation'}
                  </span>
                  <span className="font-bold text-slate-700">
                    {grievance.course}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-700">
                    {grievance.department}
                  </span>
                </div>
              </FormGrid>
            )}

            <div className="border-t border-slate-100 pt-3 mt-3">
              <h4 className="font-bold text-slate-700 text-xs mb-2">
                Integrated Student Info System Verification
              </h4>
              <div className="p-3 bg-blue-50 border rounded text-[11px] text-slate-600 flex justify-between">
                <span>
                  Academic Record Sync Status:{' '}
                  <strong className="text-green-700">
                    Verified (SIS active)
                  </strong>
                </span>
                <span>
                  Admissions Data:{' '}
                  <strong className="text-green-700">Cleared</strong>
                </span>
              </div>
            </div>
          </div>
        </FormCard>
      )}

      {activeTab === 'attachments' && (
        <FormCard title="Supporting Documents & DMS File links">
          <div className="text-xs space-y-3">
            {grievance.attachments.length === 0 ? (
              <p className="text-slate-400 text-center py-4">
                No attachments uploaded by complainant.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grievance.attachments.map((att: any) => (
                  <div
                    key={att.id}
                    className="p-3 border rounded-lg bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-700 block font-mono">
                        <i className="pi pi-file mr-1"></i>
                        {att.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Size: {att.size} · Uploaded: {att.uploadedOn} by{' '}
                        {att.uploadedBy}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        ToastService.success(`Opening file ${att.name}...`)
                      }
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-300 font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Open DMS Link
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormCard>
      )}

      {activeTab === 'notesheet' && (
        <div className="space-y-6">
          {grievance.notesheet ? (
            <div className="grv-notesheet-pane">
              <div className="grv-notesheet-header">
                <span className="grv-notesheet-title">
                  Digital Notesheet: {grievance.notesheet.notesheetNo}
                </span>
                <span className="grv-notesheet-meta">
                  File: G-Office/{grievance.ticketNo}
                </span>
              </div>

              {/* Notesheet Chronological Entries */}
              <div className="space-y-4">
                {grievance.notesheet.entries.map((entry: any, idx: number) => (
                  <div key={entry.id} className="grv-notesheet-entry">
                    <span className="grv-notesheet-entry-num">
                      Note #{idx + 1}
                    </span>

                    {entry.actionTaken && (
                      <span className="grv-notesheet-action-taken">
                        {entry.actionTaken}
                      </span>
                    )}

                    <div className="grv-notesheet-remarks">{entry.remarks}</div>

                    {entry.supportingDocuments &&
                      entry.supportingDocuments.length > 0 && (
                        <div className="ml-2 mt-2 text-[11px] font-bold text-green-700">
                          Linked Attachment:{' '}
                          {entry.supportingDocuments.join(', ')}
                        </div>
                      )}

                    <div className="grv-notesheet-sign-block">
                      <span className="grv-notesheet-officer-name">
                        {entry.officerName}
                      </span>
                      <span className="grv-notesheet-officer-desg">
                        {entry.officerDesignation}
                      </span>
                      <span className="grv-notesheet-officer-desg">
                        {entry.department}
                      </span>
                      <span className="text-[10px] opacity-75 mt-0.5">
                        {entry.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Remarks Input (Digital Notesheet drafting) */}
              <div className="border-t-2 border-green-700 mt-6 pt-4 text-xs space-y-4">
                <h4 className="font-bold text-green-900 text-sm">
                  Append Official Note / Remarks
                </h4>

                <TextArea
                  label="Officer Remarks *"
                  placeholder="Draft your detailed remarks on green notesheet paper..."
                  value={notesheetRemarks}
                  onChange={setNotesheetRemarks}
                  rows={4}
                />

                <FormGrid columns={3}>
                  <DropDownList
                    label="Action"
                    data={actionTypes}
                    textField="name"
                    optionValue="value"
                    value={actionType}
                    onChange={val => setActionType(val as string)}
                  />
                  <DropDownList
                    label="Forward To Desk"
                    data={forwardTargets}
                    textField="name"
                    optionValue="value"
                    value={forwardTo}
                    onChange={val => setForwardTo(val as string)}
                  />
                  <TextBox
                    label="Attach Officer Document (Name)"
                    placeholder="e.g. Verification_Report.pdf"
                    value={notesheetDoc}
                    onChange={setNotesheetDoc}
                  />
                </FormGrid>

                <div className="flex justify-end gap-2 border-t border-green-200 pt-4">
                  <Button
                    label="Save Draft"
                    variant="outlined"
                    onClick={() =>
                      ToastService.success('Notesheet draft remarks saved.')
                    }
                  />
                  <Button
                    label="Return File"
                    variant="danger"
                    onClick={handleReturnNotesheet}
                  />
                  <Button
                    label="Forward Notesheet"
                    variant="primary"
                    onClick={handleForwardNotesheet}
                  />
                </div>
              </div>
            </div>
          ) : (
            <FormCard title="Digital eOffice Notesheet System">
              <div className="text-center py-12 space-y-4">
                <i className="pi pi-file-excel text-4xl text-slate-300"></i>
                <h3 className="font-bold text-slate-700">
                  Digital Notesheet Not Created Yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Every grievance processed in eOffice requires a green
                  notesheet file. Click below to initialize drafting for this
                  file.
                </p>
                <Button
                  label="Create Notesheet"
                  icon="plus"
                  variant="primary"
                  onClick={handleCreateNotesheet}
                />
              </div>
            </FormCard>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <FormCard title="Grievance Timeline Audit History">
          <div className="space-y-4 text-xs">
            {grievance.timeline.map((t: any) => (
              <div
                key={t.id}
                className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-b-0"
              >
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    {t.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Performed by: {t.performedBy} ({t.role}) · {t.date}
                  </span>
                  <p className="text-slate-600 bg-slate-50 border p-2 rounded mt-2">
                    {t.remarks}
                  </p>
                </div>
                <span className={`grv-status-pill ${getStatusClass(t.status)}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
