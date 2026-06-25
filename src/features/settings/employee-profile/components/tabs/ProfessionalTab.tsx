import { FormCard, FormGrid } from 'shared/new-components';

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm text-gray-500 min-h-[38px] flex items-center">
        {value || '-'}
      </div>
    </div>
  );
}

export default function ProfessionalTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Statutory Details"
        icon="id-card"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <ReadOnlyField label="Aadhaar Number" value={data.aadharNumber} />
          <ReadOnlyField label="PAN Number" value={data.panNumber} />
          <ReadOnlyField label="UAN Number" value={data.uanNumber} />
          <ReadOnlyField label="Driving License" value={data.drivingLicense} />
          <ReadOnlyField label="Passport Number" value={data.passportNumber} />
          <ReadOnlyField
            label="Passport Validity"
            value={data.passportValidity}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Qualifications"
        icon="graduation-cap"
        className="shadow-none border border-gray-100"
      >
        {data.qualifications && data.qualifications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.qualifications.map((qual: any, index: number) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50/30"
              >
                <FormGrid columns={3}>
                  <ReadOnlyField
                    label="Degree"
                    value={`Qual ID: ${qual.qualificationId}`}
                  />
                  <ReadOnlyField
                    label="University/Board"
                    value={qual.university || qual.board}
                  />
                  <ReadOnlyField
                    label="Year of Passing"
                    value={qual.yearOfPassing}
                  />
                  <ReadOnlyField
                    label="Percentage/Grade"
                    value={qual.percentage || qual.grade}
                  />
                </FormGrid>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No qualifications added.
          </p>
        )}
      </FormCard>
    </div>
  );
}
