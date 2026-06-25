import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Modal } from 'shared/components/popups';
import StudentAdditionalInformationForm from '../components/StudentAdditionalInformationForm';
import { useCreateStudentAdditionalInformationMutation } from '../queries';
import { sisUrls } from '../../urls';

interface Props {
  onSave: () => void;
}

function CreateModalContent(props: Props) {
  const { mutateAsync, isPending } =
    useCreateStudentAdditionalInformationMutation();

  const handleSubmit = async (data: SIS.StudentAdditionalInformationForm) => {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success(
          'Student additional information created successfully'
        );
        props.onSave();
      }
    } catch {
      ToastService.error('Failed to create student additional information');
    }
  };

  return (
    <StudentAdditionalInformationForm
      onSubmit={handleSubmit}
      isSaving={isPending}
    />
  );
}

export default function Create() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    navigate(sisUrls.studentAdditionalInformation.root, {
      state: { fromSave: true },
    });
  };

  return (
    <Modal
      header="Add Student Additional Information"
      onHide={handleCancel}
      visible
    >
      <CreateModalContent onSave={handleSave} />
    </Modal>
  );
}
