import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { cfsUrls } from '../../urls';

export default function SettingsHub() {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: 'Publishing Categories',
      description:
        'Configure and manage root content categories such as Notices, Circulars, or Press Releases.',
      icon: 'pi pi-tags',
      path: cfsUrls.admin.settings.categories,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Sub Publishing Categories',
      description:
        'Define specific sub-categories under configured root categories (e.g., Admissions, Exams).',
      icon: 'pi pi-sitemap',
      path: cfsUrls.admin.settings.subCategories,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      title: 'Workflow Configuration',
      description:
        'Define structural reviewer mapping, default roles, escalation levels, and approval loops.',
      icon: 'pi pi-sliders-h',
      path: cfsUrls.admin.settings.workflow,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <FormPage
      title="CFS Settings Hub"
      description="Configure classifications and editorial governance rules for the Content Federation System."
      breadcrumbs={[{ label: 'CFS', to: cfsUrls.root }, { label: 'Settings' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {settingsCards.map((card, idx) => (
          <FormCard key={idx}>
            <div className="p-6 flex flex-col items-center text-center gap-4 h-full justify-between">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${card.color}`}
              >
                <i className={card.icon} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {card.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(card.path)}
                className="w-full mt-4 py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-sm transition"
              >
                Configure Settings
              </button>
            </div>
          </FormCard>
        ))}
      </div>
    </FormPage>
  );
}
