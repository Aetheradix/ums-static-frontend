import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';

export default function TrackDispatch() {
  return (
    <FormPage
      title="Track Physical Certificate"
      description="Track the delivery status of your physically dispatched certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Certificate Management',
          to: '/home/sub-menu/certificate-management',
        },
        { label: 'Student Portal', to: '/home/sub-menu/student-portal' },
        { label: 'Track Dispatch' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Dispatched Certificates">
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-lg mb-2">Degree Certificate</h4>
            <FormGrid columns={1}>
              <TextBox
                label="Application No"
                value="RGPV/DEG/2026/0101"
                disabled
              />
              <TextBox
                label="Courier Service"
                value="India Post (Speed Post)"
                disabled
              />
              <TextBox label="Tracking ID" value="IN987654321" disabled />
              <TextBox label="Dispatch Date" value="26-06-2026" disabled />
            </FormGrid>
            <div className="mt-4">
              <Button
                label="Track on India Post"
                variant="primary"
                icon="local_shipping"
                onClick={() =>
                  window.open('https://www.indiapost.gov.in', '_blank')
                }
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-bold text-lg mb-2">Bonafide Certificate</h4>
            <p className="text-gray-600 m-0">
              This certificate is digital-only and does not require physical
              dispatch. You can download it from the portal.
            </p>
            <div className="mt-4">
              <Button
                label="Download Digital Copy"
                variant="outlined"
                icon="download"
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Delivery Address on Record">
          <FormGrid columns={1}>
            <TextBox
              label="Address Line 1"
              value="Flat No 402, Royal Residency"
              disabled
            />
            <TextBox
              label="Address Line 2"
              value="M.P. Nagar, Zone 1"
              disabled
            />
            <TextBox label="City" value="Bhopal" disabled />
            <TextBox label="State" value="Madhya Pradesh" disabled />
            <TextBox label="Pincode" value="462011" disabled />
            <TextBox label="Contact Number" value="+91-9876543210" disabled />
          </FormGrid>
          <div className="mt-4 text-sm text-gray-500">
            * Note: Certificates are dispatched to the permanent address present
            in your student profile. If you need to update it, please contact
            the administrative office.
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
