import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

export default function SportsAndTeamsTab({
  registeredSports,
  teamMemberships,
}: any) {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard
        title="Registered Sports"
        icon="flag"
        className="shadow-none border border-gray-100"
      >
        {registeredSports && registeredSports.length > 0 ? (
          <div className="flex flex-col gap-6">
            {registeredSports.map((sport: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Sport" value={sport.name} />
                <PreviewField label="Skill Level" value={sport.skillLevel} />
                <PreviewField label="Position" value={sport.position} />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No registered sports.</p>
        )}
      </FormCard>

      <FormCard
        title="Team Memberships"
        icon="users"
        className="shadow-none border border-gray-100"
      >
        {teamMemberships && teamMemberships.length > 0 ? (
          <div className="flex flex-col gap-6">
            {teamMemberships.map((team: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Team Name" value={team.teamName} />
                <PreviewField label="Sport" value={team.sport} />
                <PreviewField label="Role" value={team.role} />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No team memberships.</p>
        )}
      </FormCard>
    </div>
  );
}
