import { useState } from 'react';
import { FormPage, FormCard, GridPanel, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { activitiesUrls } from '../../urls';
import { ToastService } from 'services';

type Registration = {
  id: string;
  studentName: string;
  enrollmentNo: string;
  course: string;
  activityName: string;
  registrationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  remarks: string;
};

const initialRegistrations: Registration[] = [
  {
    id: 'R001',
    studentName: 'Aarav Patel',
    enrollmentNo: 'EN2024001',
    course: 'B.Tech CSE',
    activityName: 'Tech Horizon Hackathon',
    registrationDate: '2024-11-20',
    status: 'Pending',
    remarks: '',
  },
  {
    id: 'R002',
    studentName: 'Priya Sharma',
    enrollmentNo: 'EN2024045',
    course: 'B.Sc Mathematics',
    activityName: 'Inter-College Basketball Tournament',
    registrationDate: '2024-11-05',
    status: 'Approved',
    remarks: 'Selected for university team.',
  },
  {
    id: 'R003',
    studentName: 'Rahul Verma',
    enrollmentNo: 'EN2024088',
    course: 'BBA',
    activityName: 'Blood Donation Camp',
    registrationDate: '2024-10-22',
    status: 'Approved',
    remarks: '',
  },
  {
    id: 'R004',
    studentName: 'Neha Gupta',
    enrollmentNo: 'EN2024102',
    course: 'MBA',
    activityName: 'Tech Horizon Hackathon',
    registrationDate: '2024-11-21',
    status: 'Rejected',
    remarks: 'Capacity full.',
  },
];

export default function ActivityRegistrations() {
  const [registrations, setRegistrations] =
    useState<Registration[]>(initialRegistrations);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReg, setCurrentReg] = useState<Registration | null>(null);

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Student Activities & Clubs', path: activitiesUrls.portal },
    { label: 'Admin Portal', path: activitiesUrls.admin.portal },
    { label: 'Activity Registration Approvals' },
  ];

  const columns: any[] = [
    { field: 'studentName', header: 'Student Name' },
    { field: 'enrollmentNo', header: 'Enrollment No' },
    { field: 'course', header: 'Course' },
    { field: 'activityName', header: 'Activity Name' },
    { field: 'registrationDate', header: 'Registration Date' },
    {
      header: 'Status',
      cell: (row: Registration) => {
        let colorClass = '';
        if (row.status === 'Approved')
          colorClass = 'bg-green-100 text-green-700';
        else if (row.status === 'Rejected')
          colorClass = 'bg-red-100 text-red-700';
        else if (row.status === 'Pending')
          colorClass = 'bg-yellow-100 text-yellow-700';
        else colorClass = 'bg-gray-100 text-gray-700';
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      width: '120px',
      cell: (row: Registration) => (
        <div className="flex gap-1">
          <Button
            icon="pencil"
            variant="text"
            size="small"
            onClick={() => {
              setCurrentReg(row);
              setIsEditing(true);
            }}
            tooltip="Edit / View Details"
          />
        </div>
      ),
    },
  ];

  const handleSave = () => {
    if (!currentReg) return;
    setRegistrations(prev =>
      prev.map(r => (r.id === currentReg.id ? currentReg : r))
    );
    ToastService.success('Registration status updated successfully');
    setIsEditing(false);
    setCurrentReg(null);
  };

  return (
    <FormPage
      title="Activity Registration Approvals"
      description="Review and approve student registrations for activities."
      breadcrumbs={breadcrumbs}
    >
      <GridPanel
        title="Student Registrations"
        data={registrations}
        columns={columns}
        searchBox
        searchPlaceholder="Search registrations..."
      />

      {isEditing && currentReg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <FormCard
              title="Review Application"
              subtitle="Update the status and remarks for this student's application."
            >
              <FormGrid columns={2}>
                <TextBox
                  label="Student Name"
                  value={currentReg.studentName}
                  disabled
                />
                <TextBox
                  label="Enrollment No"
                  value={currentReg.enrollmentNo}
                  disabled
                />
                <TextBox label="Course" value={currentReg.course} disabled />
                <TextBox
                  label="Activity Name"
                  value={currentReg.activityName}
                  disabled
                />
                <TextBox
                  label="Registration Date"
                  value={currentReg.registrationDate}
                  disabled
                />
                <div className="col-span-1 md:col-span-2">
                  <DropDownList
                    label="Status"
                    value={currentReg.status}
                    onChange={val =>
                      setCurrentReg({
                        ...currentReg,
                        status: String(val) as any,
                      })
                    }
                    data={[
                      { label: 'Pending', value: 'Pending' },
                      { label: 'Approved', value: 'Approved' },
                      { label: 'Rejected', value: 'Rejected' },
                      { label: 'Cancelled', value: 'Cancelled' },
                    ]}
                    textField="label"
                    optionValue="value"
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    value={currentReg.remarks}
                    onChange={e =>
                      setCurrentReg({ ...currentReg, remarks: e.target.value })
                    }
                    placeholder="Enter any remarks..."
                  />
                </div>
              </FormGrid>

              <div className="mt-8 flex justify-end gap-3">
                <Button
                  label="Cancel"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentReg(null);
                  }}
                />
                <Button
                  label="Save Status"
                  variant="primary"
                  onClick={handleSave}
                />
              </div>
            </FormCard>
          </div>
        </div>
      )}
    </FormPage>
  );
}
