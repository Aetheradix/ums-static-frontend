import React from 'react';
import { FormPopup } from 'shared/new-components';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';

interface FormDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data?: any) => void;
  title: string;
}

export const ApprovalDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#10b981',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Approve
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div style={{ padding: '1rem' }}>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            marginBottom: '1rem',
          }}
        >
          Are you sure you want to approve this proposal/thesis application?
          This action will advance the workflow to the next status level.
        </p>
        <TextArea
          label="Approval Comments & Feedback"
          placeholder="Enter remarks for the candidate..."
          value=""
          onChange={() => {}}
        />
      </div>
    </FormPopup>
  );
};

export const RejectDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#ef4444',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reject
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div style={{ padding: '1rem' }}>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#b91c1c',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          WARNING: Rejecting this application will terminate the current
          workflow request.
        </p>
        <TextArea
          label="Rejection Reason (Mandatory)"
          placeholder="Please detail the reason for rejection..."
          value=""
          onChange={() => {}}
        />
      </div>
    </FormPopup>
  );
};

export const RevisionDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#f59e0b',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Request Revision
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div style={{ padding: '1rem' }}>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            marginBottom: '1rem',
          }}
        >
          Request revisions from the scholar. The application status will be
          reset to "Returned/Draft".
        </p>
        <TextArea
          label="Requested Modifications & Actions Required"
          placeholder="Detail the revisions needed before resubmission..."
          value=""
          onChange={() => {}}
        />
      </div>
    </FormPopup>
  );
};

export const MeetingDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Schedule
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: '1rem',
        }}
      >
        <TextBox
          label="Meeting Agenda"
          placeholder="e.g. Discussing methodology adapters"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}
        >
          <DatePicker label="Meeting Date" />
          <TextBox label="Time Slot" placeholder="e.g. 11:30 AM" />
        </div>
        <DropDownList
          label="Meeting Mode"
          data={[
            { text: 'Offline Cabin Visit', value: 'offline' },
            { text: 'Virtual MS Teams', value: 'online' },
          ]}
        />
        <TextArea
          label="Pre-requisite / Pre-reads"
          placeholder="Documents scholar needs to prepare..."
        />
      </div>
    </FormPopup>
  );
};

export const EvaluationDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#10b981',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Save Verdict
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: '1rem',
        }}
      >
        <TextBox label="External Examiner Score (Out of 100)" />
        <TextBox label="Internal Review Score (Out of 100)" />
        <DropDownList
          label="Viva Verdict Recommendation"
          data={[
            { text: 'Degree Awarded unconditionally', value: 'approved' },
            {
              text: 'Degree Awarded subject to minor corrections',
              value: 'minor',
            },
            { text: 'Major corrections - Re-viva required', value: 'major' },
            { text: 'Rejected', value: 'reject' },
          ]}
        />
        <TextArea
          label="Jury Consolidated Feedback & Comments"
          placeholder="Write evaluation remarks..."
        />
      </div>
    </FormPopup>
  );
};

export const RepositoryDialog: React.FC<FormDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
}) => {
  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <button
        onClick={onClose}
        style={{
          padding: '0.375rem 0.875rem',
          border: '1px solid #cbd5e1',
          background: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSubmit()}
        style={{
          padding: '0.375rem 0.875rem',
          border: 'none',
          background: '#10b981',
          color: '#fff',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Confirm Archive
      </button>
    </div>
  );

  return (
    <FormPopup visible={visible} onHide={onClose} title={title} footer={footer}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          padding: '1rem',
        }}
      >
        <TextBox
          label="Digital Object Identifier (DOI)"
          placeholder="e.g. 10.2112/davv.thesis.2026.0912"
        />
        <TextBox
          label="Shodhganga Handle URL"
          placeholder="e.g. https://shodhganga.inflibnet.ac.in/handle/10603/4892"
        />
        <DropDownList
          label="Archive Access Visibility"
          data={[
            { text: 'Public Open Access (Global)', value: 'public' },
            { text: 'Intranet Institutional Access', value: 'internal' },
            { text: 'Embargoed (1 Year Restriction)', value: 'embargo' },
          ]}
        />
        <TextArea
          label="Indexing Keywords & Metadata"
          placeholder="Add comma-separated keywords..."
        />
      </div>
    </FormPopup>
  );
};

export const VersionHistoryDrawer: React.FC<{
  visible: boolean;
  onClose: () => void;
  versions: any[];
}> = ({ visible, onClose, versions }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '380px',
        height: '100%',
        background: '#fff',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
          Version History Archive
        </h3>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
        }}
      >
        {versions.map((v, i) => (
          <div
            key={i}
            style={{
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: i === 0 ? '#eff6ff' : '#fafafa',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#1e40af',
                }}
              >
                Version {v.ver}
              </span>
              <span style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                {v.date}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: 4 }}>
              File: {v.fileName}
            </p>
            <p
              style={{
                fontSize: '0.688rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              Remarks: {v.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
