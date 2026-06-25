import { useState, useEffect } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import {
  useStudentApplicationQuery,
  useApproveStudentFeeMutation,
} from '../queries';
import type { StudentApplicationPayload } from '../types';
import '../student-fee-approval.css';

export default function FeeApprovalPage() {
  const [searchId, setSearchId] = useState('');
  const [activeQueryId, setActiveQueryId] = useState<number | null>(null);
  const [lastNotifiedId, setLastNotifiedId] = useState<number | null>(null);

  // Fetch application query
  const {
    data: application,
    isLoading: isQueryLoading,
    isError,
  } = useStudentApplicationQuery(activeQueryId);

  // Approve payment mutation
  const approveMutation = useApproveStudentFeeMutation(activeQueryId || 0);

  // Notify if the fee is already paid, triggered once per loaded application
  useEffect(() => {
    if (
      application &&
      application.isFeePaid &&
      lastNotifiedId !== application.studentApplicationId
    ) {
      ToastService.error('Fee is already paid for this application.', 'Notice');
      setLastNotifiedId(application.studentApplicationId);
    }
  }, [application, lastNotifiedId]);

  const handleSearch = () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      ToastService.error('Please enter a Student Application ID.');
      return;
    }

    if (isNaN(Number(trimmedId))) {
      ToastService.error('Please enter a valid numeric Application ID.');
      return;
    }

    // Reset notified ID for a new search so warning toast works again
    setLastNotifiedId(null);
    setActiveQueryId(Number(trimmedId));
  };

  const handleApprovePayment = async () => {
    if (!application) return;

    try {
      await approveMutation.mutateAsync();
      ToastService.success('Fee payment updated successfully!');
    } catch (err: any) {
      ToastService.error(
        err.message || 'Failed to update fee payment status. Please try again.'
      );
    }
  };

  const getFullName = (basicInfo: StudentApplicationPayload['basicInfo']) => {
    const parts = [
      basicInfo.firstName,
      basicInfo.middleName,
      basicInfo.lastName,
    ];
    return parts.filter(Boolean).join(' ');
  };

  const formatDateString = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const hasSearched = activeQueryId !== null;
  const loading = isQueryLoading;
  const submitting = approveMutation.isPending;

  return (
    <FormPage
      title="Student Fee Payment Approval"
      description="Approve and mark student application fee payments as paid to register them dynamically in the system."
      breadcrumbs={[
        { label: 'Academics', to: '/sis' },
        { label: 'Fee Payment Approval', to: '/sis/student-fee-approval' },
      ]}
    >
      <div className="fee-search-container">
        <div className="fee-search-input-group">
          <i className="pi pi-search" />
          <input
            type="text"
            className="fee-search-input"
            placeholder="Enter Student Application ID (e.g. 5)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <Button
          label="Search"
          icon="search"
          onClick={handleSearch}
          isLoading={loading}
          variant="primary"
          disabled={loading || submitting}
        />
      </div>

      {loading ? (
        <FormCard className="flex justify-center items-center p-8">
          <div className="text-center p-8 text-gray-500">
            <i className="pi pi-spin pi-spinner text-4xl mb-4 text-blue-500" />
            <p className="font-semibold text-lg">
              Fetching application details...
            </p>
          </div>
        </FormCard>
      ) : application ? (
        <div className="student-profile-summary">
          {/* Header Card */}
          <div className="student-detail-header-card">
            <div className="student-hero-info">
              <div className="student-avatar-circle">
                {application.payload.basicInfo.firstName.charAt(0)}
                {application.payload.basicInfo.lastName.charAt(0)}
              </div>
              <div className="student-hero-text">
                <h3>{getFullName(application.payload.basicInfo)}</h3>
                <p>Application ID: #{application.studentApplicationId}</p>
              </div>
            </div>

            <div
              className={`payment-status-badge ${
                application.isFeePaid ? 'paid' : 'unpaid'
              }`}
            >
              <i
                className={`pi pi-${application.isFeePaid ? 'check-circle' : 'exclamation-triangle'}`}
              />
              {application.isFeePaid ? 'Paid' : 'Unpaid'}
            </div>
          </div>

          {/* Details Sections */}
          <div className="info-section-grid">
            {/* Academic Info */}
            <div className="info-card-block">
              <div className="info-card-title-bar">
                <i className="pi pi-book" />
                <h4>Academic details</h4>
              </div>
              <div className="info-details-list">
                <div className="info-detail-item">
                  <span className="info-detail-label">Programme</span>
                  <span className="info-detail-value">
                    {application.programmeName}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Academic Session</span>
                  <span className="info-detail-value">
                    {application.academicSession}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Degree Level</span>
                  <span className="info-detail-value">
                    {application.payload.academic?.degreeLevelName || 'N/A'}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Program of Study</span>
                  <span className="info-detail-value">
                    {application.payload.academic?.programmeName || 'N/A'}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Specialisation</span>
                  <span className="info-detail-value">
                    {application.payload.academic?.specialisationName || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="info-card-block">
              <div className="info-card-title-bar">
                <i className="pi pi-user" />
                <h4>Personal Details</h4>
              </div>
              <div className="info-details-list">
                <div className="info-detail-item">
                  <span className="info-detail-label">Email</span>
                  <span className="info-detail-value">
                    {application.payload.basicInfo.email}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Phone</span>
                  <span className="info-detail-value">
                    {application.payload.basicInfo.phone}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Gender</span>
                  <span className="info-detail-value">
                    {application.payload.basicInfo.gender}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Caste</span>
                  <span className="info-detail-value">
                    {application.payload.basicInfo.casteName}
                  </span>
                </div>
                <div className="info-detail-item">
                  <span className="info-detail-label">Date of Birth</span>
                  <span className="info-detail-value">
                    {formatDateString(
                      application.payload.basicInfo.dateOfBirth
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="fee-action-bar">
            <Button
              label={application.isFeePaid ? 'Fee already paid' : 'FeePaid'}
              icon={application.isFeePaid ? 'check' : 'wallet'}
              onClick={handleApprovePayment}
              isLoading={submitting}
              disabled={application.isFeePaid || submitting}
              variant={application.isFeePaid ? 'outlined' : 'primary'}
            />
          </div>
        </div>
      ) : hasSearched && isError ? (
        <FormCard>
          <div className="fee-empty-state">
            <i className="pi pi-ban text-red-500 mb-4" />
            <h3>No Application Found</h3>
            <p>
              We couldn't find a student application matching ID:{' '}
              <strong>{searchId}</strong>. Please check the ID and try again.
            </p>
          </div>
        </FormCard>
      ) : (
        <FormCard>
          <div className="fee-empty-state">
            <i className="pi pi-search-plus text-blue-500 mb-4" />
            <h3>Search Application</h3>
            <p>
              Please enter a numeric Student Application ID above to retrieve
              details and approve fee payment.
            </p>
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
