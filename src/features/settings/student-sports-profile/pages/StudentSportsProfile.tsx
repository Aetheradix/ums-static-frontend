import { useState } from 'react';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import StudentProfileSidebar from '../components/StudentProfileSidebar';
import BasicInformationTab from '../components/tabs/BasicInformationTab';
import EquipmentAndAchievementsTab from '../components/tabs/EquipmentAndAchievementsTab';
import EventsAndBookingsTab from '../components/tabs/EventsAndBookingsTab';
import SportsAndTeamsTab from '../components/tabs/SportsAndTeamsTab';

export default function StudentSportsProfile() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Mock data for student
  const studentData = {
    name: 'Alice Johnson',
    initials: 'AJ',
    rollNumber: 'CS2026045',
    email: 'alice.j@university.edu',
    phone: '+1 234 567 8900',
    department: 'Computer Science',
    degree: 'B.Tech',
    bio: "Captain of the Women's Basketball team. Enthusiast in track and field.",
    dateOfBirth: '2004-05-14',
    gender: 'Female',
    bloodGroup: 'O+',
    nationality: 'Indian',
    height: '168 cm',
    weight: '62 kg',
    medicalFitnessStatus: 'Fit for all sports',
    emergencyContactName: 'Robert Johnson',
    emergencyContactRelation: 'Father',
    emergencyContactNumber: '+1 987 654 3210',
  };

  const registeredSports = [
    {
      id: 1,
      name: 'Cricket',
      skillLevel: 'State/National',
      position: 'Opening Batsman',
    },
    {
      id: 2,
      name: 'Athletics',
      skillLevel: 'Intermediate',
      position: '100m Sprint',
    },
  ];

  const teamMemberships = [
    {
      id: 1,
      teamName: "University Cricket Team - Men's 2026",
      sport: 'Cricket',
      role: 'Vice-Captain',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      event: 'Inter-University Cricket Cup',
      type: 'Inter-University',
      venue: 'Delhi University',
      startDate: '2026-10-15',
      status: 'Scheduled',
    },
  ];

  const myBookings = [
    {
      id: 1,
      facility: 'Main Cricket Ground',
      date: '2026-07-05',
      timeSlot: '6-8 AM',
      purpose: 'Net Practice',
      status: 'Approved',
    },
    {
      id: 2,
      facility: 'Main Cricket Ground',
      date: '2026-07-06',
      timeSlot: '6-8 AM',
      purpose: 'Net Practice',
      status: 'Pending',
    },
  ];

  const equipmentIssued = [
    {
      id: 1,
      equipment: 'Cricket Bat (English Willow)',
      qty: 1,
      issueDate: '2026-06-25',
      dueDate: '2026-07-25',
      status: 'Issued',
    },
  ];

  const achievements = [
    {
      id: 1,
      event: 'Annual Sports Meet 2025',
      type: 'Gold Medal',
      rank: '1st Place',
      date: '2025-11-20',
      points: 50,
    },
  ];

  return (
    <FormPage
      title="My Profile"
      description="Manage your profile information and account preferences."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Sports Management', to: '/sports-management/student' },
        { label: 'My Sports Profile', to: '#' },
      ]}
    >
      <div className="flex flex-row gap-6 items-start mt-4">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <StudentProfileSidebar
            studentName={studentData.name}
            studentInitials={studentData.initials}
            rollNumber={studentData.rollNumber}
            email={studentData.email}
            phone={studentData.phone}
            department={studentData.department}
            degree={studentData.degree}
            bio={studentData.bio}
          />
        </div>

        {/* Right Main Content Tabs */}
        <FormCard className="flex-1 min-w-0">
          <Tabs
            activeIndex={activeTabIndex}
            onTabChange={e => setActiveTabIndex(e.index)}
            tabs={[
              { title: 'Basic Information', content: null },
              { title: 'Sports & Teams', content: null },
              { title: 'Events & Bookings', content: null },
              { title: 'Equipment & Achievements', content: null },
            ]}
          />

          <div className="mt-4">
            {activeTabIndex === 0 && <BasicInformationTab data={studentData} />}
            {activeTabIndex === 1 && (
              <SportsAndTeamsTab
                registeredSports={registeredSports}
                teamMemberships={teamMemberships}
              />
            )}
            {activeTabIndex === 2 && (
              <EventsAndBookingsTab
                upcomingEvents={upcomingEvents}
                myBookings={myBookings}
              />
            )}
            {activeTabIndex === 3 && (
              <EquipmentAndAchievementsTab
                equipmentIssued={equipmentIssued}
                achievements={achievements}
              />
            )}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
