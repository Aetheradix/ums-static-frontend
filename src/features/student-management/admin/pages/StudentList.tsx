import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormPage,
  FormCard,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import type { SeedStudent } from '../../seed/students';
import { StudentSeedService } from '../../seed/students';
import StudentDetailModal from '../components/StudentDetailModal';
import { ToastService } from 'services';
import { Modal } from 'shared/components/popups';
import { exportToCSV } from 'shared/utils/exportToCSV';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<SeedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    const data = await StudentSeedService.getAll();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async () => {
    if (!deleteStudentId) return;
    try {
      await StudentSeedService.delete(deleteStudentId);
      ToastService.success('Student deleted successfully');
      loadStudents();
    } catch (err) {
      ToastService.error('Failed to delete student');
    } finally {
      setDeleteStudentId(null);
    }
  };

  return (
    <FormPage
      title="Student Management"
      description="View and manage all student records, including personal and academic details."
    >
      <FormCard>
        <GridPanel
          data={students}
          loading={loading}
          pagination={true}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
              header: 'S.No',
            },
            {
              header: 'Enrolment No',
              field: 'enrolmentNo',
              sortable: true,
            },
            {
              header: 'Name',
              cell: (item: SeedStudent) => (
                <span>
                  {item.firstName} {item.lastName}
                </span>
              ),
              sortable: true,
            },
            {
              header: 'Programme',
              field: 'programmeName',
              sortable: true,
              filter: true,
            },
            {
              header: 'Session',
              field: 'academicSession',
              sortable: true,
              filter: true,
            },
            {
              header: 'Status',
              field: 'status',
              sortable: true,
              filter: true,
              cell: (item: SeedStudent) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Active'
                      ? 'approved'
                      : item.status === 'Inactive'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              header: 'Actions',
              cell: (item: SeedStudent) => (
                <div className="flex gap-2">
                  <Button
                    icon="pi pi-pencil"
                    variant="text"
                    onClick={() => setEditStudentId(item.id)}
                  />
                  <Button
                    icon="pi pi-trash"
                    variant="text"
                    className="text-red-600"
                    onClick={() => setDeleteStudentId(item.id)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <div className="flex gap-2 ml-auto">
              <Button
                label="Export"
                icon="pi pi-download"
                variant="outlined"
                onClick={() => exportToCSV(students, 'Students_Export')}
              />
              <Button
                label="Add Student"
                icon="pi pi-plus"
                variant="outlined"
                onClick={() => setShowAddModal(true)}
              />
              <Button
                label="Import Students"
                icon="pi pi-upload"
                variant="primary"
                onClick={() => navigate('/student-management/admin/import')}
              />
            </div>
          }
          searchBox={true}
        />
      </FormCard>

      {editStudentId && (
        <StudentDetailModal
          studentId={editStudentId}
          onHide={() => setEditStudentId(null)}
          onSave={() => {
            setEditStudentId(null);
            loadStudents();
          }}
        />
      )}

      {showAddModal && (
        <StudentDetailModal
          onHide={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadStudents();
          }}
        />
      )}

      {deleteStudentId && (
        <Modal
          header="Confirm Delete"
          visible={!!deleteStudentId}
          onHide={() => setDeleteStudentId(null)}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <i className="pi pi-exclamation-triangle text-2xl"></i>
              <p>
                Are you sure you want to delete this student? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setDeleteStudentId(null)}
              />
              <Button
                label="Delete"
                variant="primary"
                className="bg-red-600"
                onClick={handleDelete}
              />
            </div>
          </div>
        </Modal>
      )}
    </FormPage>
  );
}
