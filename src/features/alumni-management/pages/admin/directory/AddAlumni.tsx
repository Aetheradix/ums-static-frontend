import { alumniUrls } from 'features/alumni-management/urls';
import { Button } from 'primereact/button';
import { ToastService } from 'services';
import TextBox from 'shared/components/forms/TextBox';
import { useAppForm } from 'shared/hooks/form';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';

export default function AddAlumni() {
  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: {
      fullName: '',
      enrolmentNo: '',
      program: '',
      department: '',
      yearOfPassing: '',
      personalEmail: '',
      mobileNumber: '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log('Alumni Data Submitted:', data);
    ToastService.success('Alumni registered successfully!');
    reset();
  };

  return (
    <FormPage
      title="Add New Alumni"
      description="Manually register an alumni record into the system"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Directory' },
        { label: 'Add Alumni' },
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormCard title="Personal Information" icon="user">
          <FormGrid columns={2}>
            <TextBox
              name="fullName"
              control={control}
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </FormGrid>
        </FormCard>

        <FormCard title="Academic Details" icon="book">
          <FormGrid columns={2}>
            <TextBox
              name="enrolmentNo"
              control={control}
              label="Enrolment Number"
              placeholder="e.g. A2026-CSE-102"
              required
            />
            <TextBox
              name="program"
              control={control}
              label="Programme"
              placeholder="e.g. B.Tech"
              required
            />
            <TextBox
              name="department"
              control={control}
              label="Department (OU Code)"
              placeholder="e.g. OU-CSE"
              required
            />
            <TextBox
              name="yearOfPassing"
              control={control}
              label="Year of Passing"
              placeholder="e.g. 2024"
              required
            />
          </FormGrid>
        </FormCard>

        <FormCard title="Contact & Employment" icon="briefcase">
          <FormGrid columns={2}>
            <TextBox
              name="personalEmail"
              control={control}
              label="Personal Email Address"
              placeholder="e.g. name@domain.com"
              type="email"
              required
            />
            <TextBox
              name="mobileNumber"
              control={control}
              label="Mobile Number"
              placeholder="e.g. +91 9876543210"
              required
            />
          </FormGrid>
        </FormCard>

        <FormCard>
          <div className="flex items-center justify-between p-2">
            <p className="text-sm text-gray-500">
              * A verification email will be sent automatically to the
              registered personal email address.
            </p>
            <div className="flex gap-3">
              <Button
                label="Reset Form"
                type="button"
                severity="secondary"
                outlined
                onClick={() => reset()}
              />
              <Button
                label="Register Alumni"
                type="submit"
                severity="success"
                icon="pi pi-check"
                iconPos="right"
              />
            </div>
          </div>
        </FormCard>
      </form>
    </FormPage>
  );
}
