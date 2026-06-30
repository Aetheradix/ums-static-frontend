import { useState } from 'react';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { activitiesUrls } from '../../urls';
import { ToastService } from 'services';
import { useNavigate } from 'react-router-dom';

export default function ApplyActivity() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: 'Alex Lin',
    enrollmentNo: 'EN2024005',
    course: 'B.Tech CSE',
    activity: '',
    remarks: '',
  });

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Student Activities', path: activitiesUrls.portal },
    { label: 'Student Portal', path: activitiesUrls.student.dashboard },
    { label: 'Apply for Activity' },
  ];

  const handleSave = () => {
    if (!form.activity) {
      ToastService.error('Please select an activity to apply for.');
      return;
    }
    ToastService.success('Application submitted successfully!');
    navigate(activitiesUrls.student.dashboard);
  };

  return (
    <FormPage
      title="Apply for Activity"
      description="Submit your application to participate in university activities."
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        title="Application Details"
        subtitle="Fill out the activity registration form"
      >
        <FormGrid columns={2}>
          <TextBox label="Student Name" value={form.studentName} disabled />
          <TextBox
            label="Enrollment Number"
            value={form.enrollmentNo}
            disabled
          />
          <TextBox label="Course" value={form.course} disabled />
          <DropDownList
            label="Select Activity"
            data={[
              {
                label: 'Inter-College Basketball Tournament',
                value: 'Inter-College Basketball Tournament',
              },
              {
                label: 'Tech Horizon Hackathon',
                value: 'Tech Horizon Hackathon',
              },
              { label: 'Blood Donation Camp', value: 'Blood Donation Camp' },
            ]}
            textField="label"
            optionValue="value"
            value={form.activity}
            onChange={val => setForm({ ...form, activity: String(val ?? '') })}
            required
          />
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Remarks / Motivation (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={4}
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
              placeholder="Why do you want to participate?"
            />
          </div>
        </FormGrid>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(activitiesUrls.student.dashboard)}
          />
          <Button
            label="Submit Application"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
