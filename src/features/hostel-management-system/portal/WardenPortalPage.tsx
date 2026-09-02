import { PortalSelector } from 'shared/new-components';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function WardenPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Warden"
      moduleDescription="Set up your hostel's rooms and facilities, approve admission requests, allot rooms, and run everything that happens in the hostel day to day."
      backPath={hmsUrls.root}
      backLabel="Hostel Management System"
      breadcrumbs={hmsBreadcrumbs(null, 'Hostel Warden')}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Beds available, pending approvals, students out of the hostel and open grievances for your hostel.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: hmsUrls.warden.dashboard,
        },
        {
          title: 'Room Configuration',
          description:
            'Declare how many rooms of each type your hostel has, then record every room number with its floor and wing.',
          icon: 'meeting_room',
          colorScheme: 'blue',
          path: hmsUrls.warden.roomConfiguration,
        },
        {
          title: 'Hostel Facilities',
          description:
            'Pick the facilities your hostel provides — CCTV, Wi-Fi, guards, water cooler, laundry, mess and more.',
          icon: 'checklist',
          colorScheme: 'green',
          path: hmsUrls.warden.facilities,
        },
        {
          title: 'Admission Requests',
          description:
            'Applications sent to your hostel from the public forum — approve to issue ERP credentials, or reject with a reason.',
          icon: 'how_to_reg',
          colorScheme: 'indigo',
          path: hmsUrls.warden.admissionRequests,
        },
        {
          title: 'Room Allotment',
          description:
            'Allot a room to an approved student — pick the room type, then a room number showing how many beds are free.',
          icon: 'bed',
          colorScheme: 'pink',
          path: hmsUrls.warden.roomAllocation,
        },
        {
          title: 'Daily Attendance',
          description:
            'Mark attendance for residents; every entry shows up on the student portal immediately.',
          icon: 'event_available',
          colorScheme: 'purple',
          path: hmsUrls.warden.attendance,
        },
        {
          title: 'In & Out Register',
          description:
            'Short-duration outings and long-duration absences logged by students, with return times.',
          icon: 'swap_horiz',
          colorScheme: 'teal',
          path: hmsUrls.warden.inOutEntry,
        },
        {
          title: 'Leave Requests',
          description:
            'Leave and outpass requests carrying verified parent consent — approve or reject each one.',
          icon: 'directions_walk',
          colorScheme: 'blue',
          path: hmsUrls.warden.leaveRequests,
        },
        {
          title: 'Student Warnings',
          description:
            'Issue a warning for misbehaviour or indiscipline; the student sees it on their portal.',
          icon: 'warning',
          colorScheme: 'amber',
          path: hmsUrls.warden.warnings,
        },
        {
          title: 'Mess Menu',
          description:
            'Publish the weekly mess menu, meal by meal, for residents to see.',
          icon: 'restaurant_menu',
          colorScheme: 'green',
          path: hmsUrls.warden.messMenu,
        },
        {
          title: 'Mess Feedback',
          description:
            'Food-quality feedback from residents, with the action you took recorded against each.',
          icon: 'rate_review',
          colorScheme: 'orange',
          path: hmsUrls.warden.messFeedback,
        },
        {
          title: 'Hostel & Mess Payments',
          description:
            'Hostel fee, mess fee, caution money and fines recorded against each resident.',
          icon: 'payments',
          colorScheme: 'green',
          path: hmsUrls.warden.payments,
        },
        {
          title: 'Visitor Entry',
          description:
            'Register visitors at the gate and check them out; the student sees who visited them.',
          icon: 'group',
          colorScheme: 'indigo',
          path: hmsUrls.warden.visitors,
        },
        {
          title: 'Curricular Activities',
          description:
            'Schedule sports, cultural and wellness activities and track who has registered.',
          icon: 'sports_soccer',
          colorScheme: 'purple',
          path: hmsUrls.warden.activities,
        },
        {
          title: 'Room Change Requests',
          description:
            'Requests from residents to move room or room type — approve and reallot, or reject.',
          icon: 'swap_calls',
          colorScheme: 'teal',
          path: hmsUrls.warden.roomChangeRequests,
        },
        {
          title: 'Grievances',
          description:
            'Complaints raised by residents; record the action taken and move each to resolution.',
          icon: 'flag',
          colorScheme: 'red',
          path: hmsUrls.warden.grievances,
        },
      ]}
    />
  );
}
