import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useExamSessionsQuery } from '../queries';
import ExamSessionForm from '../components/ExamSessionForm';

export default function SessionList() {
  const { data, isLoading } = useExamSessionsQuery();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <FormPage
      title="Examination Sessions"
      description="Manage and configure examination sessions"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search sessions..."
          toolbar={
            <Button
              label="Create Session"
              icon="pi-plus"
              onClick={() => setShowPopup(true)}
            />
          }
          columns={[
            { field: 'sessionName', header: 'Session Name' },
            {
              field: 'sessionType',
              header: 'Type',
              cell: (item: Examination.ExamSessionItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.sessionType === 'Regular'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.sessionType}
                </span>
              ),
            },
            { field: 'academicYearSessionName', header: 'Academic Session' },
            { field: 'examinationYear', header: 'Exam Year' },
            { field: 'cycleName', header: 'Cycle' },
            {
              header: 'Status',
              cell: (item: Examination.ExamSessionItem) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: (item: Examination.ExamSessionItem) => (
                <div className="flex gap-1">
                  <Button
                    icon="pi-calendar"
                    className="p-button-sm p-button-text"
                    tooltip="Timetable"
                    onClick={() => navigate(`${item.id}/timetable`)}
                  />
                  <Button
                    icon="pi-id-card"
                    className="p-button-sm p-button-text"
                    tooltip="Admit Cards"
                    onClick={() => navigate(`${item.id}/admit-cards`)}
                  />
                  <Button
                    icon="pi-pencil"
                    className="p-button-sm p-button-text"
                    tooltip="Marks"
                    onClick={() => navigate(`${item.id}/marks`)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {showPopup && (
        <FormPopup
          visible
          onHide={() => setShowPopup(false)}
          title="Create Session"
          subtitle="Create a new examination session"
        >
          <ExamSessionForm onClose={() => setShowPopup(false)} />
        </FormPopup>
      )}
    </FormPage>
  );
}
