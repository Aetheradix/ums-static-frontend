import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { BookMaterialViewer } from '../../components';
import { mockExams, mockStudyMaterials } from '../../data';

export default function ExamResources() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find(e => e.id === Number(id));
  const [uploadUrl, setUploadUrl] = useState('');

  if (!exam) {
    return (
      <FormPage title="Exam Resources">
        <p className="text-gray-500">Exam not found.</p>
      </FormPage>
    );
  }

  const teacherMaterials = mockStudyMaterials.filter(
    m => m.examId === exam.id && m.type === 'teacher' && m.status === 'approved'
  );
  const studentMaterials = mockStudyMaterials.filter(
    m => m.examId === exam.id && m.type === 'student' && m.status === 'approved'
  );
  const pendingMaterials = mockStudyMaterials.filter(
    m => m.examId === exam.id && m.type === 'student' && m.status === 'pending'
  );

  const handleUploadLink = () => {
    if (!uploadUrl) return;
    mockStudyMaterials.push({
      id: Math.max(...mockStudyMaterials.map(m => m.id)) + 1,
      examId: exam.id,
      examTitle: exam.title,
      uploadedBy: 8,
      uploaderName: 'Rohan Mehta',
      type: 'student',
      title: uploadUrl,
      fileUrl: uploadUrl,
      fileType: 'link',
      fileSize: 0,
      category: 'Student Shared',
      isRestricted: false,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    });
    setUploadUrl('');
  };

  return (
    <FormPage
      title={`Resources — ${exam.title}`}
      description="Access and share open book resources"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormCard title="Teacher-Approved Resources">
          {teacherMaterials.length > 0 ? (
            <BookMaterialViewer materials={teacherMaterials} />
          ) : (
            <p className="text-sm text-gray-400">
              No resources uploaded by teacher.
            </p>
          )}
        </FormCard>
        <FormCard title="Student-Shared Resources">
          {studentMaterials.length > 0 ? (
            <BookMaterialViewer materials={studentMaterials} />
          ) : (
            <p className="text-sm text-gray-400">
              No student-shared resources yet.
            </p>
          )}
          {exam.policyId !== 1 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Share a Resource Link</p>
              <div className="flex gap-2">
                <TextBox
                  value={uploadUrl}
                  onChange={v => setUploadUrl(v)}
                  placeholder="Paste URL..."
                />
                <Button label="Share" icon="send" onClick={handleUploadLink} />
              </div>
              {pendingMaterials.length > 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  {pendingMaterials.length} resource(s) pending approval
                </p>
              )}
            </div>
          )}
        </FormCard>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          label="Back to Instructions"
          icon="arrow_back"
          onClick={() =>
            navigate(`/open-book-examination/student/exam/${id}/instructions`)
          }
        />
      </div>
    </FormPage>
  );
}
