import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastService } from 'services';
import {
  DropDownList,
  MultiSelectList,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { mockDepartments } from './List';

const yearOptions = Array.from({ length: 50 }, (_, i) => ({
  text: String(new Date().getFullYear() - i),
  value: new Date().getFullYear() - i,
}));

const programOptions = [
  { name: 'B.Tech', value: 'B.Tech' },
  { name: 'M.Tech', value: 'M.Tech' },
  { name: 'Ph.D.', value: 'Ph.D.' },
  { name: 'B.Sc', value: 'B.Sc' },
  { name: 'M.Sc', value: 'M.Sc' },
  { name: 'BBA', value: 'BBA' },
  { name: 'MBA', value: 'MBA' },
];

export default function Create() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;
  const existingData = isEdit ? mockDepartments.find(d => d.id === id) : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      departmentName: '',
      departmentCode: '',
      establishedYear: null as number | null,
      hodName: '',
      contactEmail: '',
      contactPhone: '',
      intakeCapacity: null as number | null,
      programsOffered: [] as string[],
      description: '',
    },
  });

  useEffect(() => {
    if (existingData) {
      reset(existingData);
    }
  }, [existingData, reset]);

  const onSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      ToastService.success(
        `Department ${isEdit ? 'updated' : 'registered'} successfully.`
      );
      navigate('../list');
    } catch {
      ToastService.error('Failed to save department details.');
    }
  };

  return (
    <FormPage
      title={isEdit ? 'Update Department' : 'Register New Department'}
      description="Provide details to register a new department in your college."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Affiliation Management',
          to: '/affiliation-management-system',
        },
        {
          label: 'College Login',
          to: '/affiliation-management-system/college-login',
        },
        { label: 'Department Registration', to: '../list' },
        { label: isEdit ? 'Update' : 'Create' },
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard title="Department Basic Info">
          <FormGrid columns={2}>
            <TextBox
              label="Department Name"
              name="departmentName"
              control={control}
              placeholder="e.g., Computer Science and Engineering"
              required
            />
            <TextBox
              label="Department Code"
              name="departmentCode"
              control={control}
              placeholder="e.g., CSE"
              required
            />
            <DropDownList
              label="Established Year"
              name="establishedYear"
              control={control}
              data={yearOptions}
              textField="text"
              valueField="value"
              required
            />
            <TextBox
              label="Head of Department (HOD) Name"
              name="hodName"
              control={control}
              placeholder="e.g., Dr. Jane Doe"
              required
            />
            <TextBox
              label="Contact Email"
              name="contactEmail"
              control={control}
              placeholder="e.g., hod.cse@college.edu"
              type="email"
              required
            />
            <TextBox
              label="Contact Phone"
              name="contactPhone"
              control={control}
              placeholder="e.g., 9876543210"
              required
            />
            <NumberBox
              label="Total Intake Capacity"
              name="intakeCapacity"
              control={control}
              placeholder="e.g., 120"
              required
            />
            <MultiSelectList
              label="Programs Offered"
              name="programsOffered"
              control={control}
              data={programOptions}
              textField="name"
              required
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <TextArea
                label="Description / About Department"
                name="description"
                control={control}
                placeholder="Provide a brief overview of the department."
              />
            </div>
          </FormGrid>

          <p className="mt-4 text-xs font-bold text-red-600">
            Note: All Asterisk (*) Marked Fields Are Mandatory
          </p>

          <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-6">
            <FormActions
              align="left"
              isEditMode={isEdit}
              isLoading={isSubmitting}
              onSave={handleSubmit(onSubmit)}
              onReset={() => reset()}
              saveLabel={isEdit ? 'Update Department' : 'Submit Application'}
            />
          </div>
        </FormCard>
      </form>
    </FormPage>
  );
}
