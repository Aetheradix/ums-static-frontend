import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import { Modal } from 'shared/components/popups';
import { Loader } from 'shared/components/progress';
import StudentAdditionalInformationForm from '../components/StudentAdditionalInformationForm';
import {
  useStudentAdditionalInformationQuery,
  useUpdateStudentAdditionalInformationMutation,
} from '../queries';

interface Props {
  onSave: () => void;
  id: number;
}

function EditModalContent(props: Props) {
  const { data, isLoading } = useStudentAdditionalInformationQuery(props.id);
  const { mutateAsync, isPending } =
    useUpdateStudentAdditionalInformationMutation(props.id);

  const handleSubmit = async (form: SIS.StudentAdditionalInformationForm) => {
    try {
      const result = await mutateAsync(form);
      if (result) {
        ToastService.success(
          'Student additional information updated successfully'
        );
        props.onSave();
      }
    } catch {
      ToastService.error('Failed to update student additional information');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <StudentAdditionalInformationForm
      onSubmit={handleSubmit}
      fetchData={data}
      isSaving={isPending}
      isEditMode
    />
  );
}

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Modal
      header="Edit Student Additional Information"
      onHide={handleBack}
      visible
    >
      <EditModalContent id={Number(id)} onSave={handleBack} />
    </Modal>
  );
}
