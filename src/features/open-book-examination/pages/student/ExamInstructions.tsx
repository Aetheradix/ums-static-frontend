import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { mockExams } from '../../data';

import { InfoBanner } from '../../components';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === Number(id));
  const [agreed, setAgreed] = useState(false);

  if (!exam) {
    return (
      <FormPage title="Exam Instructions">
        <InfoBanner message="Please read all instructions carefully before starting the exam." />
        <p className="text-gray-500">Exam not found.</p>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Exam Instructions"
      description={`${exam.title} — ${exam.subjectName}`}
    >
      <FormCard title="Instructions">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-2">Exam Details</p>
            <p>
              <strong>Date:</strong> {exam.scheduledDate}
            </p>
            <p>
              <strong>Time:</strong> {exam.startTime} — {exam.endTime}
            </p>
            <p>
              <strong>Duration:</strong> {exam.durationMinutes} minutes
            </p>
            <p>
              <strong>Total Marks:</strong> {exam.totalMarks}
            </p>
            <p>
              <strong>Open Book:</strong>{' '}
              {exam.isOpenBook ? 'Yes — Resources allowed' : 'No'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">General Instructions</p>
            <ul className="list-disc pl-5 space-y-1">
              {exam.instructions.split('\n').map((line, i) => (
                <li key={i}>{line}</li>
              ))}
              <li>Ensure stable internet connection throughout the exam.</li>
              <li>
                Do not switch tabs or open other applications during the exam.
              </li>
              <li>Your answers are auto-saved every 30 seconds.</li>
              <li>Once submitted, answers cannot be modified.</li>
            </ul>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            I have read and agree to the exam instructions and academic
            integrity policy.
          </label>

          <div className="flex justify-end gap-2">
            <Button
              label="Go Back"
              variant="outlined"
              onClick={() =>
                navigate('/open-book-examination/student/schedule')
              }
            />
            {exam.isOpenBook && (
              <Button
                label="View Resources"
                icon="menu_book"
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/open-book-examination/student/exam/${id}/resources`
                  )
                }
              />
            )}
            <Button
              label="Start Exam"
              icon="play_arrow"
              disabled={!agreed}
              onClick={() =>
                navigate(`/open-book-examination/student/exam/${id}/take`)
              }
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
