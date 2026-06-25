import { useAuth } from 'auth';
import { useCallback, useEffect, useState } from 'react';
import type { Control, Path } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { FormPage, Tabs } from 'shared/new-components';
import ContactAddressTab from '../components/ContactAddressTab';
import MyProfileSummaryCard from '../components/MyProfileSummaryCard';
import OrganizationDetailsTab from '../components/OrganizationDetailsTab';
import ProfessionalDetailsTab from '../components/ProfessionalDetailsTab';
import ProfileDetailsTab from '../components/ProfileDetailsTab';
import './MyProfile.css';
import type { ProfileFormState } from './types';

export default function MyProfile() {
  const { user } = useAuth();

  const username = user?.profile?.name || user?.profile?.sub || 'User';
  const email = user?.profile?.email || 'admin@gmail.com';

  const [activeTab, setActiveTab] = useState<number>(0);

  const getInitialProfileValues = useCallback(
    (): ProfileFormState => ({
      employeeCode: 'E8123',
      role: 'Admin',
      department: 'HR',
      designation: 'HR Manager',
      organizationUnit: 'SFA Technologies Pvt. Ltd.',
      reportingTo: 'xyz',
      employeeType: 'Permanent',
      natureOfEmployment: 'Regular',
      dateOfJoining: '02-10-2021',
      employeeStatus: 'Active',
      workLocation: 'Bhopal',

      ugQualification: '',
      pgQualification: '',
      councilOrBoard: '',
      registrationNumber: '',
      totalExperience: '',
      specialization: '',

      fullName: username,
      nameInHindi: '',
      gender: '',
      category: '',
      pwdStatus: 'No',
      bloodGroup: '',
      nationality: 'Indian',
      fatherName: '',
      motherName: '',
      maritalStatus: '',
      spouseName: '',
      weddingDate: '',
      dateOfBirth: '',

      officialEmail: email,
      alternateEmail: '',
      officialPhone: '9876543210',
      alternatePhone: '',
      emergencyPhone: '',

      permanentAddress: '',
      localAddress: '',
      bio: '',
      profileImage: null,
    }),
    [username, email]
  );

  const { control, handleSubmit, reset, watch } = useForm<ProfileFormState>({
    defaultValues: getInitialProfileValues(),
  });

  const register = (
    name: Path<ProfileFormState>
  ): {
    control: Control<ProfileFormState>;
    name: Path<ProfileFormState>;
  } => ({
    control,
    name,
  });

  const profileForm = watch();

  useEffect(() => {
    reset(getInitialProfileValues());
  }, [getInitialProfileValues, reset]);

  const initials =
    (profileForm.fullName || username)
      .split(' ')
      .map((item: string) => item[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  const handleSaveProfile = (data: ProfileFormState) => {
    // Profile details API integration yahan aayegi.
    void data;
  };

  const handleSaveContactDetails = (data: ProfileFormState) => {
    // Contact and address API integration yahan aayegi.
    void data;
  };

  const handleResetProfile = () => {
    reset(getInitialProfileValues());
  };

  return (
    <FormPage
      title="My Profile"
      description="Manage your profile information and account preferences."
    >
      <div className="my-profile-layout">
        <MyProfileSummaryCard
          profileForm={profileForm}
          username={username}
          email={email}
          initials={initials}
          register={register}
        />

        <section className="my-profile-content-card">
          <Tabs
            className="my-profile-tabs-wrap"
            panelClassName="my-profile-tab-panel"
            activeIndex={activeTab}
            onTabChange={event => setActiveTab(event.index)}
            tabs={[
              {
                title: 'Profile Details',
                content: (
                  <ProfileDetailsTab
                    register={register}
                    onSubmit={handleSubmit(handleSaveProfile)}
                    onReset={handleResetProfile}
                  />
                ),
              },
              {
                title: 'Contact & Address',
                content: (
                  <ContactAddressTab
                    register={register}
                    onSubmit={handleSubmit(handleSaveContactDetails)}
                    onReset={handleResetProfile}
                  />
                ),
              },
              {
                title: 'Organization Details',
                content: <OrganizationDetailsTab profileForm={profileForm} />,
              },
              {
                title: 'Professional Details',
                content: <ProfessionalDetailsTab profileForm={profileForm} />,
              },
            ]}
          />
        </section>
      </div>
    </FormPage>
  );
}
