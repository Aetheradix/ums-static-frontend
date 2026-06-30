import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { tpUrls } from '../../../urls';
import { Icon } from 'shared/components/Icon/Icon';

export default function SettingsHub() {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: 'Placement Seasons',
      description: 'Manage placement seasons, drives, and associated fees.',
      icon: 'event',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      path: tpUrls.admin.settings.placementSeasons,
    },
    {
      title: 'OU Mappings',
      description: 'Map Training & Placement cells to academic departments.',
      icon: 'account_tree',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      path: tpUrls.admin.settings.ouMapping,
    },
    {
      title: 'OU Coordinators',
      description: 'Assign T&P coordinators to specific Organization Units.',
      icon: 'manage_accounts',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      path: tpUrls.admin.settings.ouCoordinators,
    },
    {
      title: 'Module Configuration',
      description:
        'Configure global settings, registration URLs, and defaults.',
      icon: 'settings',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      path: tpUrls.admin.settings.moduleConfig,
    },
  ] as const;

  return (
    <FormPage
      title="T&P Settings Hub"
      description="Configure Training & Placement module settings and mappings."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsCards.map(card => (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className={`p-3 rounded-lg ${card.bg} ${card.color} mb-4`}>
              <Icon name={card.icon as any} className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {card.description}
            </p>
          </button>
        ))}
      </div>
    </FormPage>
  );
}
