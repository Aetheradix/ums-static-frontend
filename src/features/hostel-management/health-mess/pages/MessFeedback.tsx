import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

const MEALS = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as const;

export default function MessFeedback() {
  const {
    hostels,
    studentApplications,
    messFeedback,
    setMessFeedback,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<(typeof MEALS)[number]>('LUNCH');
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState('');

  const activeStudents = studentApplications.filter(
    s => s.status === 'APPROVED'
  );
  const studentOptions = activeStudents.map(s => ({
    id: s.id,
    text: `${s.studentName} (${s.id})`,
  }));
  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (!hostelId || !studentId || !date) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const newFeedback: HostelManagement.MessFeedback = {
      id: `MF-${Date.now()}`,
      studentId,
      hostelId,
      date,
      mealType,
      rating,
      comments,
    };

    setMessFeedback([newFeedback, ...messFeedback]);
    triggerNotification(
      'Feedback submitted successfully. Thank you!',
      'success'
    );

    setStudentId('');
    setComments('');
    setRating(5);
  };

  return (
    <FormPage
      title="Mess Feedback"
      description="Provide and review feedback for hostel meals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'Mess Feedback' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <FormCard title="Submit Feedback" icon="rate_review">
            <FormGrid columns={1}>
              <OptionDropDown
                label="Select Hostel *"
                data={hostelOptions}
                value={hostelId}
                onChange={(v: any) => setHostelId(v)}
                textField="text"
                valueField="id"
              />
              <OptionDropDown
                label="Select Student *"
                data={studentOptions}
                value={studentId}
                onChange={(v: any) => setStudentId(v)}
                textField="text"
                valueField="id"
              />

              <TextBox
                label="Date *"
                type="date"
                value={date}
                onChange={setDate}
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Meal Type *
                </label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as any)}
                  className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                >
                  {MEALS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rating (1-5) *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className={`text-2xl transition-colors ${rating >= r ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <TextBox
                label="Comments / Suggestions"
                value={comments}
                onChange={setComments}
                placeholder="How was the food?"
              />
            </FormGrid>

            <div className="flex gap-3 mt-4">
              <Button
                label="Submit Feedback"
                variant="primary"
                onClick={handleSubmit}
              />
            </div>
          </FormCard>
        </div>

        <div className="w-full lg:w-2/3">
          <FormCard title="Recent Feedback" icon="forum">
            <div className="space-y-4">
              {messFeedback.length === 0 && (
                <div className="p-4 text-center text-slate-500 border border-dashed rounded">
                  No feedback received yet.
                </div>
              )}
              {messFeedback.map((fb: HostelManagement.MessFeedback) => {
                const student = activeStudents.find(s => s.id === fb.studentId);
                return (
                  <div
                    key={fb.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">
                          {student?.studentName || 'Unknown'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {fb.date} • {fb.mealType}
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(r => (
                          <span
                            key={r}
                            className={`text-lg ${fb.rating >= r ? 'text-yellow-400' : 'text-slate-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {fb.comments && (
                      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 italic">
                        "{fb.comments}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
