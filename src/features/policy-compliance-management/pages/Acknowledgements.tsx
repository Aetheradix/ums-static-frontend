import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { INITIAL_ACKNOWLEDGEMENTS } from '../data';

export default function Acknowledgements() {
  return (
    <FormPage
      title="Policy Acknowledgements"
      description="Track user acknowledgements — User ID, Date, Time, IP Address, and Version Accepted"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Acknowledgements' },
      ]}
    >
      <FormCard title="Acknowledgement Log" icon="how_to_reg">
        <GridPanel
          data={INITIAL_ACKNOWLEDGEMENTS}
          columns={[
            { field: 'id', header: 'ACK ID', width: '100px' },
            { field: 'policyName', header: 'Policy Name' },
            { field: 'userId', header: 'User ID', width: '140px' },
            { field: 'userName', header: 'User Name' },
            {
              field: 'userType',
              header: 'User Type',
              width: '100px',
              cell: (item: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.userType === 'Student'
                      ? 'bg-blue-100 text-blue-700'
                      : item.userType === 'Faculty'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-teal-100 text-teal-700'
                  }`}
                >
                  {item.userType}
                </span>
              ),
            },
            { field: 'date', header: 'Date', width: '110px' },
            { field: 'time', header: 'Time', width: '100px' },
            { field: 'ipAddress', header: 'IP Address', width: '130px' },
            { field: 'versionAccepted', header: 'Version', width: '80px' },
          ]}
          searchBox
          searchPlaceholder="Search acknowledgements..."
        />
      </FormCard>
    </FormPage>
  );
}
