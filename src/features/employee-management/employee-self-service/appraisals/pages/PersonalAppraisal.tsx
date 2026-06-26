import { useState } from 'react';
import { ToastService } from 'services';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';

interface AppraisalRecord {
  id: string;
  period: string;
  reviewer: string;
  reviewerRating: string | number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Completed';
}

const INITIAL_HISTORY: AppraisalRecord[] = [
  {
    id: 'SAR-2024',
    period: 'April 2024 - March 2025',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 4,
    status: 'Completed',
  },
  {
    id: 'SAR-2025',
    period: 'April 2025 - March 2026',
    reviewer: 'Dr. Robert Carter (HOD)',
    reviewerRating: 'Pending',
    status: 'Under Review',
  },
];

export default function PersonalAppraisal() {
  const { register, handleSubmit, reset } = useAppForm({});
  const [history, setHistory] = useState<AppraisalRecord[]>(INITIAL_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const periods = [
    { id: 'April 2025 - March 2026', name: 'April 2025 - March 2026' },
    { id: 'April 2026 - March 2027', name: 'April 2026 - March 2027' },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedPeriod =
      typeof data.period === 'object' && data.period
        ? data.period.id || data.period.name
        : data.period;

    const newSAR: AppraisalRecord = {
      id: `SAR-${Math.floor(2026 + Math.random() * 10)}`,
      period: selectedPeriod || 'April 2025 - March 2026',
      reviewer: data.reviewer || 'Dr. Robert Carter (HOD)',
      reviewerRating: 'Pending',
      status: 'Submitted',
    };

    setHistory([newSAR, ...history]);
    setIsSubmitting(false);
    ToastService.success('Self Appraisal Report (SAR) submitted successfully!');
    reset();
  };

  return (
    <FormPage
      title="Personal Appraisal (SAR) Portal"
      description="Submit your annual Performance Appraisal reports (SAR) and view review statuses."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Employee Services', to: '/home/sub-menu/employee-services' },
        {
          label: 'Employee Self Service',
          to: '/home/sub-menu/employee-self-service',
        },
        { label: 'Personal Appraisal', to: '#' },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* New SAR Form */}
        <FormCard
          title="New Self Appraisal Report (SAR)"
          icon="file-edit"
          subtitle="Please enter your key goals accomplished, trainings attended, and innovations contributed during the review period. Your HOD will evaluate the outcomes and schedule a review interview."
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid columns={2}>
              <DropDownList
                {...register('period')}
                label="Appraisal Period"
                placeholder="Select Period"
                data={periods}
                textField="name"
                valueField="id"
                required
              />

              <TextBox
                {...register('reviewer')}
                label="Assigned Reviewer (HOD)"
                value="Dr. Robert Carter (HOD)"
                readOnly
              />

              <div className="col-span-full">
                <TextArea
                  {...register('performanceGoals')}
                  label="Performance Goals Accomplished"
                  placeholder="Detail the key targets achieved and objectives fulfilled."
                  rows={3}
                  required
                />
              </div>

              <div className="col-span-full">
                <TextArea
                  {...register('innovations')}
                  label="Innovations / Contributions"
                  placeholder="Detail any new methodologies, systems developed, or extra-curricular support provided."
                  rows={2}
                />
              </div>

              <div className="col-span-full">
                <TextArea
                  {...register('training')}
                  label="Training / Workshops Attended"
                  placeholder="List any personal development courses or research seminars attended."
                  rows={2}
                />
              </div>

              <div className="col-span-full">
                <TextArea
                  {...register('comments')}
                  label="Comments to Reviewer"
                  placeholder="Enter optional comments for the approving HOD."
                  rows={2}
                />
              </div>
            </FormGrid>

            <FormActions
              isLoading={isSubmitting}
              saveLabel="Submit Appraisal"
              onReset={() => reset()}
            />
          </form>
        </FormCard>

        {/* Historical Submissions */}
        <FormCard title="My Previous Appraisal Submissions" icon="folder-open">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 border-none">SAR Ref ID</th>
                  <th className="px-6 py-3 border-none">Review Period</th>
                  <th className="px-6 py-3 border-none">Reviewer HOD</th>
                  <th className="px-6 py-3 border-none text-center">
                    Reviewer Rating
                  </th>
                  <th className="px-6 py-3 border-none text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {history.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4">{item.period}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {item.reviewer}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">
                      {typeof item.reviewerRating === 'number'
                        ? `${item.reviewerRating} / 5`
                        : item.reviewerRating}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge
                        variant={
                          item.status === 'Completed'
                            ? 'approved'
                            : item.status === 'Draft'
                              ? 'neutral'
                              : 'pending'
                        }
                        label={item.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
