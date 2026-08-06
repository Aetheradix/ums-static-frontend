import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function HostelApplication() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isAdmin, isWarden, activePortal } = useHostelRole();

  const initialForm = {
    hostelId: '',
    applicationDate: new Date().toISOString().split('T')[0],
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.hostelId) {
      alert('Please select an Applied Hostel.');
      return;
    }

    addRecord('applications', {
      id: `APP${Date.now()}`,
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: form.hostelId,
      applicationDate:
        form.applicationDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
    });

    setForm(initialForm);
  };

  // Filter data based on role
  const filteredApplications = isStudent
    ? data.applications.filter(app => app.studentId === MOCK_STUDENT_ID)
    : data.applications;

  // Build breadcrumbs based on portal
  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'My Hostel Application' : 'Hostel Application'}
      description={
        isStudent
          ? 'Apply for hostel accommodation and track your application status.'
          : 'Review and process student hostel accommodation applications.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Hostel Application' },
      ]}
    >
      {/* Form is only shown to Students to apply for hostel */}
      {isStudent && (
        <FormCard title="Apply for Hostel" icon="add_circle">
          <FormGrid columns={2}>
            <DropDownList
              label="Applied Hostel *"
              data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
              textField="text"
              valueField="id"
              value={form.hostelId}
              onChange={v => setForm({ ...form, hostelId: v as string })}
            />
            <TextBox
              label="Application Date"
              type="date"
              value={form.applicationDate}
              onChange={v => setForm({ ...form, applicationDate: v })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button label="Apply" variant="primary" onClick={handleSubmit} />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(initialForm)}
            />
          </div>
        </FormCard>
      )}

      {/* Admin / Warden sees only the applications list with Approve/Reject actions */}
      <FormCard
        title={isStudent ? 'My Applications' : 'Applications List'}
        icon="list"
      >
        <GridPanel
          data={filteredApplications}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentId', header: 'Student ID' }]
              : []),
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
            {
              field: 'hostelId',
              header: 'Applied Hostel',
              cell: (item: any) => (
                <>
                  {data.hostels.find(h => h.id === item.hostelId)?.name ||
                    item.hostelId}
                </>
              ),
            },
            { field: 'applicationDate', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            // Admin / Warden can take action
            ...(isAdmin || isWarden
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        {item.status === 'Pending' && (
                          <>
                            <Button
                              label="Approve"
                              variant="primary"
                              size="small"
                              icon="check"
                              onClick={() =>
                                updateRecord('applications', item.id, {
                                  ...item,
                                  status: 'Approved',
                                })
                              }
                            />
                            <Button
                              label="Reject"
                              variant="danger"
                              size="small"
                              icon="close"
                              onClick={() =>
                                updateRecord('applications', item.id, {
                                  ...item,
                                  status: 'Rejected',
                                })
                              }
                            />
                          </>
                        )}
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
