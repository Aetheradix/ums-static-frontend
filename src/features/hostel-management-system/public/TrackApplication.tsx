import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  PreviewField,
  PreviewSection,
  StatusBadge,
} from 'shared/new-components';
import { KeyValueTile, SectionNote } from '../components/ui';
import { useHms } from '../context/HmsContext';
import type { Application } from '../context/HmsContext';

const VARIANT = {
  Approved: 'approved',
  Rejected: 'rejected',
  Pending: 'pending',
} as const;

export default function TrackApplication() {
  const { data } = useHms();
  const [query, setQuery] = useState({ applicationNo: '', mobileNumber: '' });
  const [result, setResult] = useState<Application | null>(null);
  const [searched, setSearched] = useState(false);

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  const search = () => {
    const key = query.applicationNo.trim().toLowerCase();
    const found = data.applications.find(
      a =>
        (a.applicationNo.toLowerCase() === key ||
          a.rollNumber.toLowerCase() === key) &&
        (!query.mobileNumber.trim() ||
          a.mobileNumber === query.mobileNumber.trim())
    );
    setResult(found ?? null);
    setSearched(true);
    if (!found) ToastService.success('No application matched those details.');
  };

  return (
    <FormPage
      title="Track Hostel Application"
      description="Check the status of an admission form you submitted from the public forum."
    >
      <FormCard title="Find Your Application" icon="search">
        <FormGrid columns={2}>
          <TextBox
            label="Application No. / Roll No."
            placeholder="e.g. HSTL/2026/0001"
            value={query.applicationNo}
            onChange={v => setQuery({ ...query, applicationNo: v })}
          />
          <TextBox
            label="Registered Mobile Number"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={query.mobileNumber}
            onChange={v =>
              setQuery({ ...query, mobileNumber: v.replace(/\D/g, '') })
            }
          />
        </FormGrid>
        <div className="mt-4">
          <Button
            label="Track Status"
            variant="primary"
            icon="search"
            onClick={search}
          />
        </div>
      </FormCard>

      {searched && !result && (
        <FormCard title="No Application Found" icon="exclamation-circle">
          <p className="py-4 text-sm text-slate-600 dark:text-slate-300">
            We could not find an application matching those details. Use the
            application number from your acknowledgement, along with the mobile
            number you applied with.
          </p>
        </FormCard>
      )}

      {result && (
        <FormCard
          title={`Application ${result.applicationNo}`}
          icon="file"
          headerAction={
            <StatusBadge
              label={result.status}
              variant={VARIANT[result.status]}
            />
          }
        >
          <PreviewSection title="Application Summary">
            <PreviewField label="Student Name" value={result.studentName} />
            <PreviewField label="Roll Number" value={result.rollNumber} />
            <PreviewField label="Programme" value={result.programme} />
            <PreviewField label="Branch" value={result.branch} />
            <PreviewField
              label="Applied Hostel"
              value={hostelName(result.preferredHostelId)}
            />
            <PreviewField
              label="Preferred Room Type"
              value={result.preferredRoomType}
            />
            <PreviewField label="Submitted On" value={result.submittedOn} />
            <PreviewField label="Decision Date" value={result.decisionDate} />
            <PreviewField label="Decided By" value={result.decidedBy} />
            <PreviewField label="Remarks" value={result.remarks} fullWidth />
          </PreviewSection>

          {result.status === 'Approved' && result.erpLoginId && (
            <div className="mt-5 flex flex-col gap-4">
              <SectionNote
                tone="success"
                title="Your ERP credentials are ready"
              >
                Sign in to the Student Portal with these, pay the hostel fee and
                caution money, and the warden will allot your room.
              </SectionNote>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <KeyValueTile
                  label="Login ID"
                  value={result.erpLoginId}
                  mono
                  tone="success"
                />
                <KeyValueTile
                  label="Password"
                  value={result.erpPassword}
                  mono
                  tone="success"
                />
              </div>
            </div>
          )}

          {result.status === 'Pending' && (
            <div className="mt-5">
              <SectionNote
                tone="warning"
                title="Awaiting the warden's decision"
              >
                Your application is with {hostelName(result.preferredHostelId)}.
                Your ERP credentials appear here once it is approved.
              </SectionNote>
            </div>
          )}

          {result.status === 'Rejected' && (
            <div className="mt-5">
              <SectionNote tone="danger" title="Application not approved">
                Reason: {result.remarks || 'not stated'}. You may contact the
                hostel office or submit a fresh application.
              </SectionNote>
            </div>
          )}
        </FormCard>
      )}
    </FormPage>
  );
}
