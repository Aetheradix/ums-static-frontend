import { useEffect, useState } from 'react';
import { getStudentProfileService } from 'shared/di';
import {
  FormPopup,
  PreviewField,
  PreviewSection,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import type { TabItemProps } from 'shared/new-components/Tabs';
import ProfileHeader from '../components/ProfileHeader';
import '../components/StudentProfile.css';
import type { StudentProfile } from '../types';

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalModalOpen, setPersonalModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const service = getStudentProfileService();
      const data = await service.getProfile();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <i className="pi pi-spin pi-spinner text-3xl text-primary" />
        <span className="ml-3 text-gray-500">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500">
        No profile data found.
      </div>
    );
  }

  const tabs: TabItemProps[] = [
    {
      title: 'Personal',
      content: (
        <PersonalTab
          profile={profile}
          onViewDetails={() => setPersonalModalOpen(true)}
        />
      ),
    },
    {
      title: 'Academic',
      content: <AcademicTab profile={profile} />,
    },
    {
      title: 'Documents',
      content: <DocumentsTab profile={profile} />,
    },
    {
      title: 'Admission',
      content: <AdmissionTab profile={profile} />,
    },
    {
      title: 'Fee & Timeline',
      content: <FeeTimelineTab profile={profile} />,
    },
  ];

  return (
    <div className="p-4 w-full">
      <ProfileHeader profile={profile} />

      <div className="quick-actions">
        <button
          type="button"
          className="p-2 px-4 bg-white border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
        >
          <i className="pi pi-download" /> Download ID Card
        </button>
        <button
          type="button"
          className="p-2 px-4 bg-white border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
        >
          <i className="pi pi-receipt" /> Fee Receipt
        </button>
        <button
          type="button"
          className="p-2 px-4 bg-white border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
        >
          <i className="pi pi-print" /> Print Profile
        </button>
      </div>

      <div className="profile-sections">
        <Tabs tabs={tabs} />
      </div>

      <FormPopup
        visible={personalModalOpen}
        onHide={() => setPersonalModalOpen(false)}
        title="Personal Details"
        subtitle="Complete personal, contact and address information"
        size="xl"
      >
        <PersonalDetailsModal profile={profile} />
      </FormPopup>
    </div>
  );
}

function PersonalTab({
  profile,
  onViewDetails,
}: {
  profile: StudentProfile;
  onViewDetails: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="quick-summary-container">
        <div className="quick-summary-header">
          <h3>Quick Summary</h3>
          <button
            type="button"
            onClick={onViewDetails}
            className="view-details-btn"
          >
            <i className="pi pi-eye" /> View Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <PreviewField
            label="Full Name"
            value={`${profile.firstName} ${profile.middleName} ${profile.lastName}`}
          />
          <PreviewField label="Date of Birth" value={profile.dateOfBirth} />
          <PreviewField label="Age" value={profile.age} />
          <PreviewField label="Gender" value={profile.gender} />
          <PreviewField label="Blood Group" value={profile.bloodGroup} />
          <PreviewField label="Nationality" value={profile.nationality} />
          <PreviewField label="Email" value={profile.email} />
          <PreviewField label="Phone" value={profile.phone} />
          <PreviewField label="Father's Name" value={profile.fatherName} />
          <PreviewField label="Mother's Name" value={profile.motherName} />
          <PreviewField
            label="Current Address"
            value={`${profile.currentAddress.addressLine1}, ${profile.currentAddress.district} - ${profile.currentAddress.zipcode}`}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

function PersonalDetailsModal({ profile }: { profile: StudentProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <PreviewSection
        title="Personal Information"
        subtitle="Basic personal details"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PreviewField label="First Name" value={profile.firstName} />
          <PreviewField
            label="Middle Name"
            value={profile.middleName || 'N/A'}
          />
          <PreviewField label="Last Name" value={profile.lastName} />
          <PreviewField label="Date of Birth" value={profile.dateOfBirth} />
          <PreviewField label="Age" value={profile.age} />
          <PreviewField label="Gender" value={profile.gender} />
          <PreviewField label="Blood Group" value={profile.bloodGroup} />
          <PreviewField label="Nationality" value={profile.nationality} />
          <PreviewField label="Religion" value={profile.religion} />
          <PreviewField label="Caste" value={profile.caste} />
          <PreviewField label="Caste Category" value={profile.casteCategory} />
          <PreviewField label="Ethnicity" value={profile.ethnicity} />
          <PreviewField
            label="Residency Status"
            value={profile.residencyStatus}
          />
          <PreviewField label="Aadhar No" value={profile.aadharNo} />
          <PreviewField label="PAN No" value={profile.panNo} />
        </div>
      </PreviewSection>

      <PreviewSection
        title="Contact Information"
        subtitle="Email, phone and parent details"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PreviewField label="Email" value={profile.email} />
          <PreviewField label="Phone" value={profile.phone} />
        </div>
        <h4 className="font-semibold text-gray-700 mt-4 mb-2">
          Father's Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PreviewField label="Father's Name" value={profile.fatherName} />
          <PreviewField label="Occupation" value={profile.fatherOccupation} />
          <PreviewField label="Designation" value={profile.fatherDesignation} />
          <PreviewField
            label="Annual Income"
            value={`₹${profile.fatherAnnualIncome.toLocaleString()}`}
          />
          <PreviewField
            label="Contact No"
            value={profile.fatherContactNumber}
          />
        </div>
        <h4 className="font-semibold text-gray-700 mt-4 mb-2">
          Mother's Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PreviewField label="Mother's Name" value={profile.motherName} />
          <PreviewField label="Occupation" value={profile.motherOccupation} />
          <PreviewField label="Designation" value={profile.motherDesignation} />
          <PreviewField
            label="Annual Income"
            value={`₹${profile.motherAnnualIncome.toLocaleString()}`}
          />
          <PreviewField
            label="Contact No"
            value={profile.motherContactNumber}
          />
        </div>
      </PreviewSection>

      <PreviewSection title="Address" subtitle="Current and permanent address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">
              Current Address
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <PreviewField
                label="Address Line 1"
                value={profile.currentAddress.addressLine1}
              />
              <PreviewField
                label="Address Line 2"
                value={profile.currentAddress.addressLine2}
              />
              <PreviewField
                label="Landmark"
                value={profile.currentAddress.landmark}
              />
              <PreviewField
                label="Country"
                value={profile.currentAddress.country}
              />
              <PreviewField
                label="State"
                value={profile.currentAddress.state}
              />
              <PreviewField
                label="District"
                value={profile.currentAddress.district}
              />
              <PreviewField
                label="Tehsil"
                value={profile.currentAddress.tehsil}
              />
              <PreviewField
                label="Block"
                value={profile.currentAddress.block}
              />
              <PreviewField
                label="Zipcode"
                value={profile.currentAddress.zipcode}
              />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">
              Permanent Address
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <PreviewField
                label="Address Line 1"
                value={profile.permanentAddress.addressLine1}
              />
              <PreviewField
                label="Address Line 2"
                value={profile.permanentAddress.addressLine2}
              />
              <PreviewField
                label="Landmark"
                value={profile.permanentAddress.landmark}
              />
              <PreviewField
                label="Country"
                value={profile.permanentAddress.country}
              />
              <PreviewField
                label="State"
                value={profile.permanentAddress.state}
              />
              <PreviewField
                label="District"
                value={profile.permanentAddress.district}
              />
              <PreviewField
                label="Tehsil"
                value={profile.permanentAddress.tehsil}
              />
              <PreviewField
                label="Block"
                value={profile.permanentAddress.block}
              />
              <PreviewField
                label="Zipcode"
                value={profile.permanentAddress.zipcode}
              />
            </div>
          </div>
        </div>
      </PreviewSection>
    </div>
  );
}

function AcademicTab({ profile }: { profile: StudentProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <PreviewSection
        title="Programme Details"
        subtitle="Current enrolled programme"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <PreviewField label="Programme" value={profile.programme} />
          <PreviewField label="Degree Level" value={profile.degreeLevel} />
          <PreviewField label="Specialisation" value={profile.specialisation} />
          <PreviewField label="Mode" value={profile.programmeMode} />
          <PreviewField
            label="Academic Session"
            value={profile.academicSession}
          />
        </div>
      </PreviewSection>

      <PreviewSection
        title="Prior Education History"
        subtitle="All educational qualifications"
      >
        <div className="overflow-x-auto">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Level & Institution</th>
                <th>Board/University</th>
                <th>Passing Year</th>
                <th>Score</th>
                <th>Stream</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {profile.priorEducations.map((edu, idx) => (
                <tr key={idx}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-graduation-cap text-primary" />
                      {edu.educationLevel} - {edu.institutionName}
                    </div>
                  </td>
                  <td>{edu.boardOrUniversity}</td>
                  <td>{edu.passingYear}</td>
                  <td>
                    {edu.percentage != null
                      ? `${edu.percentage}%`
                      : edu.cgpa != null
                        ? edu.cgpa
                        : 'N/A'}
                  </td>
                  <td>{edu.subjectsOrStream}</td>
                  <td>{edu.documentName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PreviewSection>
    </div>
  );
}

function DocumentsTab({ profile }: { profile: StudentProfile }) {
  return (
    <PreviewSection
      title="Uploaded Documents"
      subtitle="All verified and pending documents"
    >
      <div className="overflow-x-auto">
        <table className="doc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Document Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {profile.documents.map((doc, idx) => (
              <tr key={doc.id}>
                <td className="text-gray-400">{idx + 1}</td>
                <td className="font-medium">{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.size}</td>
                <td>{doc.uploadedAt}</td>
                <td>
                  <StatusBadge
                    label={doc.status}
                    variant={
                      doc.status === 'Verified'
                        ? 'approved'
                        : doc.status === 'Rejected'
                          ? 'rejected'
                          : 'pending'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PreviewSection>
  );
}

function AdmissionTab({ profile }: { profile: StudentProfile }) {
  const { admissionDetails } = profile;
  return (
    <PreviewSection
      title="Admission Details"
      subtitle="Admission and enrollment information"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <PreviewField label="Application No" value={profile.applicationNo} />
        <PreviewField
          label="Application Date"
          value={profile.applicationDate}
        />
        <PreviewField
          label="Admission Date"
          value={admissionDetails.admissionDate}
        />
        <PreviewField
          label="Admission Quota"
          value={admissionDetails.admissionQuota}
        />
        <PreviewField
          label="Enrollment No"
          value={admissionDetails.enrollmentNo}
        />
        <PreviewField label="Roll No" value={admissionDetails.rollNo} />
        <PreviewField label="Batch" value={admissionDetails.batchYear} />
        <PreviewField
          label="Current Semester"
          value={admissionDetails.semester}
        />
        <PreviewField label="Campus" value={admissionDetails.campus} />
        <PreviewField label="Scheme" value={admissionDetails.scheme} />
      </div>
    </PreviewSection>
  );
}

function FeeTimelineTab({ profile }: { profile: StudentProfile }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <PreviewSection
          title="Application Status"
          subtitle="Current status of your application"
        >
          <div className="grid grid-cols-2 gap-4">
            <PreviewField
              label="Status"
              value={
                <StatusBadge
                  label={profile.applicationStatus.currentStatus}
                  variant={profile.applicationStatus.statusColor}
                />
              }
            />
            <PreviewField
              label="Last Updated"
              value={profile.applicationStatus.lastUpdated}
            />
            <PreviewField
              label="Remarks"
              value={profile.applicationStatus.remarks}
              fullWidth
            />
          </div>
        </PreviewSection>

        <PreviewSection title="Fee Summary" subtitle="Fee payment details">
          <div className="fee-card mb-4">
            <div className="fee-card-item">
              <span className="fee-card-label">Total Fee</span>
              <span className="fee-card-value total">
                ₹{profile.feeSummary.totalFee.toLocaleString()}
              </span>
            </div>
            <div className="fee-card-item">
              <span className="fee-card-label">Paid Amount</span>
              <span className="fee-card-value paid">
                ₹{profile.feeSummary.paidFee.toLocaleString()}
              </span>
            </div>
            <div className="fee-card-item">
              <span className="fee-card-label">Pending Amount</span>
              <span className="fee-card-value pending">
                ₹{profile.feeSummary.pendingFee.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <PreviewField label="Due Date" value={profile.feeSummary.dueDate} />
            <PreviewField
              label="Last Payment Date"
              value={profile.feeSummary.lastPaymentDate}
            />
            <PreviewField
              label="Last Payment Amount"
              value={`₹${profile.feeSummary.lastPaymentAmount.toLocaleString()}`}
            />
          </div>
        </PreviewSection>
      </div>

      <div>
        <PreviewSection
          title="Timeline / Activity"
          subtitle="Application journey so far"
        >
          <div className="timeline-vertical">
            {profile.timeline.map((event, idx) => (
              <div className="timeline-item" key={idx}>
                <div className={`timeline-marker ${event.status}`}>
                  {event.status === 'completed' && (
                    <i
                      className="pi pi-check text-white"
                      style={{ fontSize: '0.5rem' }}
                    />
                  )}
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">{event.date}</div>
                  <div className="timeline-title">{event.title}</div>
                  <div className="timeline-desc">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}
