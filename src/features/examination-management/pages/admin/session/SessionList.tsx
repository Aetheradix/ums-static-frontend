import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import ExamSessionForm from '../../../components/ExamSessionForm';
import { useExamSessionsQuery } from '../../../queries';

export default function SessionList() {
  const { data, isLoading } = useExamSessionsQuery();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const handleEdit = (id: number) => {
    setEditId(id);
    setShowPopup(true);
  };

  const handleClose = () => {
    setEditId(undefined);
    setShowPopup(false);
  };

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
              icon="plus"
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
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.sessionType === 'Regular' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
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
                  className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
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
                    icon="pencil"
                    variant="text"
                    tooltip="Edit Session"
                    onClick={() => handleEdit(item.id)}
                  />
                  <Button
                    icon="calendar"
                    variant="text"
                    tooltip="Timetable"
                    onClick={() => navigate(`${item.id}/timetable`)}
                  />
                  <Button
                    icon="pi pi-id-card"
                    variant="text"
                    tooltip="Admit Cards"
                    onClick={() => navigate(`${item.id}/admit-cards`)}
                  />
                  <Button
                    icon="pencil"
                    variant="text"
                    tooltip="Marks"
                    onClick={() =>
                      navigate(`/examination-management/marks/${item.id}`)
                    }
                  />
                  <Button
                    icon="pi-chart-line"
                    variant="text"
                    tooltip="Results"
                    onClick={() =>
                      navigate(`/examination-management/results/${item.id}`)
                    }
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
          onHide={handleClose}
          title={editId ? 'Edit Session' : 'Create Session'}
          subtitle={
            editId
              ? 'Modify examination session'
              : 'Create a new examination session'
          }
        >
          <ExamSessionForm id={editId} onClose={handleClose} />
        </FormPopup>
      )}
    </FormPage>
  );
}
