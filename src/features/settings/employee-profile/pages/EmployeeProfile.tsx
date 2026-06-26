import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'shared/components/progress';
import { FormPage, Tabs } from 'shared/new-components';
import { mockGetEmployeeById } from '../../../employee-management/mockData';
import ProfileSidebar from '../components/ProfileSidebar';
import BankDetailsTab from '../components/tabs/BankDetailsTab';
import ContactAddressTab from '../components/tabs/ContactAddressTab';
import OrganizationTab from '../components/tabs/OrganizationTab';
import ProfessionalTab from '../components/tabs/ProfessionalTab';
import ProfileDetailsTab from '../components/tabs/ProfileDetailsTab';
export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    if (id) {
      mockGetEmployeeById(Number(id)).then(res => {
        setData(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  const employeeName = useMemo(() => {
    if (!data) return '';
    return [data.salutation, data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(' ');
  }, [data]);

  const employeeInitials = useMemo(() => {
    if (!data) return 'EM';
    const first = data.firstName?.charAt(0) ?? '';
    const last = data.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || 'EM';
  }, [data]);

  return (
    <FormPage
      title="My Profile"
      description="Manage your profile information and account preferences."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Settings', to: '/settings' },
        { label: 'My Profile', to: '#' },
      ]}
    >
      {isLoading && <Loader />}

      {!isLoading && data ? (
        <div className="flex flex-row gap-6 items-start mt-4">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <ProfileSidebar
              data={data}
              employeeName={employeeName}
              employeeInitials={employeeInitials}
            />
          </div>

          {/* Right Main Content */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-w-0">
            <Tabs
              activeIndex={activeTabIndex}
              onTabChange={e => setActiveTabIndex(e.index)}
              className="employee-profile-settings-tabs"
              tabs={[
                { title: 'Profile Details', content: null },
                { title: 'Contact & Address', content: null },
                { title: 'Organization Details', content: null },
                { title: 'Professional Details', content: null },
                { title: 'Bank Details', content: null },
              ]}
            />

            <div className="mt-6">
              {activeTabIndex === 0 && <ProfileDetailsTab data={data} />}
              {activeTabIndex === 1 && <ContactAddressTab data={data} />}
              {activeTabIndex === 2 && <OrganizationTab data={data} />}
              {activeTabIndex === 3 && <ProfessionalTab data={data} />}
              {activeTabIndex === 4 && <BankDetailsTab data={data} />}
            </div>
          </div>
        </div>
      ) : (
        !isLoading && <p>Employee not found.</p>
      )}
    </FormPage>
  );
}
