import { useState } from 'react';
import { ToastService } from 'services';
import { DropDownList, FileUpload, TextBox } from 'shared/components/forms';
import { useAppForm } from 'shared/hooks/form';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';

interface ResearchRecord {
  id: string;
  title: string;
  type: string;
  journalName: string;
  year: string | number;
  index: string;
  doi: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const INITIAL_HISTORY: ResearchRecord[] = [
  {
    id: 'PUB-4091',
    title: 'Adaptive Learning Models using Neural Attention Systems',
    type: 'Journal',
    journalName: 'IEEE Transactions on Pattern Analysis',
    year: 2025,
    index: 'SCI / Scopus',
    doi: '10.1109/TPAMI.2025.10982',
    status: 'Approved',
  },
  {
    id: 'PUB-3922',
    title:
      'Clustering Student Performance Data using unsupervised hybrid models',
    type: 'Conference',
    journalName: 'International Conference on Educational Technology (ICET)',
    year: 2024,
    index: 'UGC Care List',
    doi: '10.1007/978-3-031-1092-2_14',
    status: 'Approved',
  },
];

export default function ResearchManagement() {
  const { register, handleSubmit, reset } = useAppForm({});
  const [history, setHistory] = useState<ResearchRecord[]>(INITIAL_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publicationTypes = [
    { id: 'Journal', name: 'Journal' },
    { id: 'Conference', name: 'Conference' },
    { id: 'Book Chapter', name: 'Book Chapter' },
    { id: 'Patent', name: 'Patent' },
  ];

  const indices = [
    { id: 'SCI', name: 'SCI' },
    { id: 'Scopus', name: 'Scopus' },
    { id: 'UGC Care List', name: 'UGC Care List' },
    { id: 'None', name: 'None / Others' },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPub: ResearchRecord = {
      id: `PUB-${Math.floor(5000 + Math.random() * 4999)}`,
      title: data.title || 'Untitled Research Paper',
      type: data.type || 'Journal',
      journalName: data.journalName || 'Unknown Journal',
      year: data.year || new Date().getFullYear(),
      index: data.index || 'None',
      doi: data.doi || '-',
      status: 'Pending',
    };

    setHistory([newPub, ...history]);
    setIsSubmitting(false);
    ToastService.success('Research publication record added successfully!');
    reset();
  };

  return (
    <FormPage
      title="Research & Publications"
      description="Add publication records, patents, journal articles, and manage your academic publications."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        {
          label: 'Employee Management',
          to: '/employee-management/manage-employees',
        },
        { label: 'ESS Portal', to: '#' },
        { label: 'Research & Publications', to: '#' },
      ]}
    >
      {/* Add Publication Form */}
      <FormCard title="Add Publication / Patent Record" icon="bookmark">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGrid columns={3}>
            <TextBox
              {...register('title')}
              label="Publication Title"
              placeholder="Enter title of the paper or patent name"
              required
            />

            <DropDownList
              {...register('type')}
              label="Publication Type"
              placeholder="Select Type"
              data={publicationTypes}
              textField="name"
              valueField="id"
              required
            />

            <TextBox
              {...register('journalName')}
              label="Journal / Conference Name"
              placeholder="Name of Journal/Publisher/Conference"
              required
            />

            <TextBox
              {...register('year')}
              label="Year of Publication"
              placeholder="e.g. 2026"
              required
            />

            <DropDownList
              {...register('index')}
              label="Indexing Category"
              placeholder="Select Indexing"
              data={indices}
              textField="name"
              valueField="id"
            />

            <TextBox
              {...register('doi')}
              label="DOI / URL Link"
              placeholder="e.g. 10.1109/..."
            />

            <FileUpload
              {...register('document')}
              label="Supporting Document Proof (PDF)"
              accept=".pdf,.doc,.docx"
              mode="file"
              uploadNote="PDF or Word document, max 5 MB"
            />
          </FormGrid>

          <FormActions
            isLoading={isSubmitting}
            saveLabel="Add Publication"
            onReset={() => reset()}
          />
        </form>
      </FormCard>

      {/* Publications History Table */}
      <FormCard title="My Publication Records" icon="list">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 border-none">Publication ID</th>
                <th className="px-6 py-3 border-none">Title</th>
                <th className="px-6 py-3 border-none">Type</th>
                <th className="px-6 py-3 border-none">Journal/Publisher</th>
                <th className="px-6 py-3 border-none text-center">Year</th>
                <th className="px-6 py-3 border-none">Indexing</th>
                <th className="px-6 py-3 border-none text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.id}
                  </td>
                  <td
                    className="px-6 py-4 font-medium text-gray-900 max-w-sm truncate"
                    title={item.title}
                  >
                    {item.title}
                  </td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={item.journalName}
                  >
                    {item.journalName}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                    {item.index}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge
                      variant={
                        item.status === 'Approved'
                          ? 'approved'
                          : item.status === 'Pending'
                            ? 'pending'
                            : 'rejected'
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
    </FormPage>
  );
}
