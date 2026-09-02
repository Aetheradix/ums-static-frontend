import { PortalSelector } from 'shared/new-components';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal"
      moduleDescription="Your hostel at a glance — room and dues, movement and leave, mess menu and feedback, activities, and anything you need to raise with the warden."
      backPath={hmsUrls.root}
      backLabel="Hostel Management System"
      breadcrumbs={hmsBreadcrumbs(null, 'Student Portal')}
      portals={[
        {
          title: 'Dashboard',
          description:
            'Your room, dues, attendance, open requests and the next hostel activity, all on one screen.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: hmsUrls.student.dashboard,
        },
        {
          title: 'My Room & Hostel',
          description:
            'Your allotted room with its floor and wing, your roommates, and the facilities your hostel provides.',
          icon: 'bed',
          colorScheme: 'blue',
          path: hmsUrls.student.myRoom,
        },
        {
          title: 'Hostel & Mess Payments',
          description:
            'Pay your hostel fee, mess fee and caution money, and download a receipt for every payment.',
          icon: 'payments',
          colorScheme: 'green',
          path: hmsUrls.student.payments,
        },
        {
          title: 'In & Out Entry',
          description:
            'Log a short outing or a long absence as you leave, and mark yourself in on return.',
          icon: 'swap_horiz',
          colorScheme: 'teal',
          path: hmsUrls.student.inOutEntry,
        },
        {
          title: 'Leave & Outpass',
          description:
            'Apply for leave — your parent gets a mail and an OTP, and the request reaches the warden once they consent.',
          icon: 'directions_walk',
          colorScheme: 'indigo',
          path: hmsUrls.student.leaveRequests,
        },
        {
          title: 'My Attendance',
          description:
            'Daily hostel attendance marked by the warden, with your present/absent percentage.',
          icon: 'event_available',
          colorScheme: 'purple',
          path: hmsUrls.student.attendance,
        },
        {
          title: 'My Warnings',
          description:
            'Warnings issued to you by the warden — acknowledge each one so they know you have seen it.',
          icon: 'warning',
          colorScheme: 'amber',
          path: hmsUrls.student.warnings,
        },
        {
          title: 'Mess Menu',
          description:
            'The weekly mess menu published by your warden, meal by meal.',
          icon: 'restaurant_menu',
          colorScheme: 'green',
          path: hmsUrls.student.messMenu,
        },
        {
          title: 'Mess Feedback',
          description:
            'Rate the food served and see the action the warden took on your feedback.',
          icon: 'rate_review',
          colorScheme: 'orange',
          path: hmsUrls.student.messFeedback,
        },
        {
          title: 'My Visitors',
          description:
            'Visitors the gate logged against your name, with their entry and exit times.',
          icon: 'group',
          colorScheme: 'pink',
          path: hmsUrls.student.visitors,
        },
        {
          title: 'Curricular Activities',
          description:
            'Sports, cultural and wellness activities in your hostel — register for the ones you want.',
          icon: 'sports_soccer',
          colorScheme: 'purple',
          path: hmsUrls.student.activities,
        },
        {
          title: 'Room Change Request',
          description:
            'Ask to move to a different room or room type, and follow the warden\u2019s decision.',
          icon: 'swap_calls',
          colorScheme: 'teal',
          path: hmsUrls.student.roomChangeRequest,
        },
        {
          title: 'Grievances',
          description:
            'Raise a complaint about anything in the hostel and follow the action taken on it.',
          icon: 'flag',
          colorScheme: 'red',
          path: hmsUrls.student.grievances,
        },
      ]}
    />
  );
}
