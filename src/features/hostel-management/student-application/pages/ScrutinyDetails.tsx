import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useParams, useNavigate } from 'react-router-dom';

export default function ScrutinyDetails() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { studentApplications, setStudentApplications, triggerNotification } =
    useHostel();

  const application = studentApplications.find(a => a.id === appId);
  const [remarks, setRemarks] = useState('');

  if (!application) {
    return (
      <div className="p-8 text-center text-red-500">Application not found.</div>
    );
  }

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !remarks) {
      triggerNotification('Please provide remarks for rejection', 'error');
      return;
    }
    setStudentApplications(prev =>
      prev.map(a =>
        a.id === appId
          ? {
              ...a,
              status,
              scrutinyRemarks: remarks,
              scrutinizedBy: 'Admin',
              scrutinizedAt: new Date().toISOString(),
            }
          : a
      )
    );
    triggerNotification(`Application ${status} successfully`);
    navigate('/hostel-management/student-application/scrutiny-list');
  };

  return (
    <FormPage
      title="Application Scrutiny Details"
      description="Review application details before approval or rejection"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Scrutiny',
          to: '/hostel-management/student-application/scrutiny-list',
        },
        { label: 'Details' },
      ]}
    >
      <Button
        label="Back to List"
        icon="arrow_back"
        variant="outlined"
        onClick={() =>
          navigate('/hostel-management/student-application/scrutiny-list')
        }
      />

      <div className="mt-4">
        <FormCard title={`Application: ${application.id}`} icon="info">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs text-slate-500 block">Student ID</span>
              <span className="font-semibold">{application.studentId}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                Enrollment No
              </span>
              <span className="font-semibold">{application.enrollmentNo}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Student Name</span>
              <span className="font-semibold">{application.studentName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Course / Sem</span>
              <span className="font-semibold">
                {application.course} ({application.semester})
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Gender</span>
              <span className="font-semibold">{application.gender}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                Distance from City
              </span>
              <span className="font-semibold">
                {application.distanceFromCity} Km
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                Application Date
              </span>
              <span className="font-semibold">
                {application.applicationDate}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                Current Status
              </span>
              <span className="font-semibold">{application.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <span className="text-xs text-slate-500 block">
                Hostel Preference
              </span>
              <span className="font-semibold text-blue-600">
                {application.hostelName}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                Room Type Preference
              </span>
              <span className="font-semibold text-blue-600">
                {application.roomTypeName}
              </span>
            </div>
          </div>

          <div className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <span className="text-xs text-slate-500 block">
              Medical Conditions
            </span>
            <span className="font-semibold text-red-600">
              {application.hasMedicalCondition
                ? `Yes - ${application.medicalDetails}`
                : 'None'}
            </span>
          </div>

          {application.status === 'SUBMITTED' ||
          application.status === 'UNDER_SCRUTINY' ? (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded mt-4">
              <h3 className="font-semibold mb-4">Scrutiny Action</h3>
              <FormGrid columns={1}>
                <TextBox
                  label="Remarks / Reason for Rejection"
                  value={remarks}
                  onChange={setRemarks}
                />
              </FormGrid>
              <div className="flex gap-3 mt-4">
                <Button
                  label="Approve Application"
                  variant="primary"
                  onClick={() => handleAction('APPROVED')}
                />
                <Button
                  label="Reject Application"
                  variant="outlined"
                  onClick={() => handleAction('REJECTED')}
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded mt-4">
              <span className="text-xs text-slate-500 block">
                Scrutiny Remarks
              </span>
              <span className="font-semibold">
                {application.scrutinyRemarks || 'N/A'}
              </span>
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
