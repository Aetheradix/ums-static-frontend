import { TemplateCard } from 'features/alumni-management/components';
import { alumniUrls } from 'features/alumni-management/urls';
import { useState } from 'react';
import { FormPage } from 'shared/new-components';

const MOCK_TEMPLATES: any[] = [
  {
    id: '1',
    title: 'Welcome to Alumni Network',
    subject: 'Subject: Welcome! We are glad you are here...',
    status: 'active',
    lastEdited: '2 hours ago',
    icon: 'envelope',
    colorScheme: 'blue',
  },
  {
    id: '2',
    title: 'Password Reset',
    subject: 'Subject: Reset your account password',
    status: 'active',
    lastEdited: '1 day ago',
    icon: 'key',
    colorScheme: 'orange',
  },
  {
    id: '3',
    title: 'Annual Gala Invitation',
    subject: 'Subject: You are invited to the 2026 Gala!',
    status: 'draft',
    lastEdited: '3 days ago',
    icon: 'calendar',
    colorScheme: 'purple',
  },
  {
    id: '4',
    title: 'Monthly Newsletter',
    subject: 'Subject: Alumni Updates - June Edition',
    status: 'archived',
    lastEdited: '1 week ago',
    icon: 'megaphone',
    colorScheme: 'teal',
  },
  {
    id: '5',
    title: 'Donation Request',
    subject: 'Subject: Support our new scholarship fund',
    status: 'draft',
    lastEdited: '2 weeks ago',
    icon: 'heart',
    colorScheme: 'green',
  },
];

export default function EmailTemplates() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = MOCK_TEMPLATES.filter(
    t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormPage
      title="Email Templates"
      description="Manage email templates for alumni communications"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        {
          label: 'Communication',
          to: alumniUrls.admin.communication.emailCampaigns,
        },
        { label: 'Email Templates' },
      ]}
      headerAction={
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
          <i className="pi pi-plus" /> Create Template
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{filteredTemplates.length}</span>{' '}
            templates found
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              {...template}
              onEdit={id => console.log('Edit', id)}
              onDuplicate={id => console.log('Duplicate', id)}
              onDelete={id => console.log('Delete', id)}
            />
          ))}
          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <i className="pi pi-inbox text-4xl mb-3 opacity-50" />
              <p>No templates found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </FormPage>
  );
}
