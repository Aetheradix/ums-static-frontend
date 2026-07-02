import {
  FormCard,
  FormGrid,
  PreviewField,
  StatusBadge,
} from 'shared/new-components';

export default function EquipmentAndAchievementsTab({
  equipmentIssued,
  achievements,
}: any) {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard
        title="Equipment Issued to Me"
        icon="box"
        className="shadow-none border border-gray-100"
      >
        {equipmentIssued && equipmentIssued.length > 0 ? (
          <div className="flex flex-col gap-6">
            {equipmentIssued.map((item: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Equipment" value={item.equipment} />
                <PreviewField label="Quantity" value={item.qty} />
                <PreviewField label="Issue Date" value={item.issueDate} />
                <PreviewField label="Due Date" value={item.dueDate} />
                <PreviewField
                  label="Status"
                  value={
                    <div className="mt-1">
                      <StatusBadge variant="neutral" label={item.status} />
                    </div>
                  }
                />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No equipment issued.</p>
        )}
      </FormCard>

      <FormCard
        title="Achievements & Certificates"
        icon="trophy"
        className="shadow-none border border-gray-100"
      >
        {achievements && achievements.length > 0 ? (
          <div className="flex flex-col gap-6">
            {achievements.map((achievement: any, index: number) => (
              <FormGrid key={index} columns={3}>
                <PreviewField label="Event" value={achievement.event} />
                <PreviewField
                  label="Achievement Type"
                  value={achievement.type}
                />
                <PreviewField label="Position/Rank" value={achievement.rank} />
                <PreviewField label="Date Awarded" value={achievement.date} />
                <PreviewField
                  label="Points"
                  value={
                    <span className="font-semibold text-green-600">
                      +{achievement.points} Pts
                    </span>
                  }
                />
              </FormGrid>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No achievements recorded.
          </p>
        )}
      </FormCard>
    </div>
  );
}
