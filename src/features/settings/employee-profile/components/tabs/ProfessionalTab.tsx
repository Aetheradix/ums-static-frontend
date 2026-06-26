import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

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
          <PreviewField label="Aadhaar Number" value={data.aadharNumber} />
          <PreviewField label="PAN Number" value={data.panNumber} />
          <PreviewField label="UAN Number" value={data.uanNumber} />
          <PreviewField label="Driving License" value={data.drivingLicense} />
          <PreviewField label="Passport Number" value={data.passportNumber} />
          <PreviewField
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
                  <PreviewField
                    label="Degree"
                    value={`Qual ID: ${qual.qualificationId}`}
                  />
                  <PreviewField
                    label="University/Board"
                    value={qual.university || qual.board}
                  />
                  <PreviewField
                    label="Year of Passing"
                    value={qual.yearOfPassing}
                  />
                  <PreviewField
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
