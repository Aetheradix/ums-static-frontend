import { PortalSelector } from 'shared/new-components';

export default function MasterConfigurationPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Master Configuration Portal"
      moduleDescription="Manage all master configurations for Sports Management."
      backPath="/sports-management"
      backLabel="Sports Management"
      portals={[
        {
          title: 'Sports Games Master',
          description:
            'Configure available sports, teams, and game categories.',
          icon: 'sports_soccer',
          colorScheme: 'indigo',
          path: '/sports-management/master/sports',
        },
        {
          title: 'Facility Master',
          description: 'Manage grounds, courts, and their availability rules.',
          icon: 'stadium',
          colorScheme: 'green',
          path: '/sports-management/master/facilities',
        },
        {
          title: 'Equipment Master',
          description: 'Track equipment inventory across all sports.',
          icon: 'sports_cricket',
          colorScheme: 'orange',
          path: '/sports-management/master/equipment',
        },
        {
          title: 'Achievement Awards Master',
          description: 'Manage achievement types',
          icon: 'emoji_events',
          colorScheme: 'pink',
          path: '/sports-management/master/achievements',
        },
      ]}
    />
  );
}
