import { PortalSelector } from 'shared/new-components';
import { thesisUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Research Scholar Portal — Thesis Management"
      moduleDescription="Submit your topic, upload proposal, track plagiarism, log meetings and submit final thesis."
      backPath={thesisUrls.portal}
      backLabel="Thesis Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Research progress, milestones, upcoming meetings and submission status.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: thesisUrls.student.dashboard,
        },
        {
          title: 'Topic Registration',
          description:
            'Register your research title, domain, problem statement and methodology.',
          icon: 'bookmark_add',
          colorScheme: 'purple',
          path: thesisUrls.student.topicRegistration,
        },
        {
          title: 'Proposal Upload',
          description:
            'Upload and manage research proposal PDF documents with version history.',
          icon: 'upload_file',
          colorScheme: 'indigo',
          path: thesisUrls.student.proposalUpload,
        },
        {
          title: 'Plagiarism Report',
          description:
            'View Turnitin similarity score, detailed match report and clearance status.',
          icon: 'verified_user',
          colorScheme: 'green',
          path: thesisUrls.student.plagiarismReport,
        },
        {
          title: 'Supervisor Details',
          description:
            'View allocated guide, co-guide contact details and meeting history.',
          icon: 'person',
          colorScheme: 'teal',
          path: thesisUrls.student.supervisorDetails,
        },
        {
          title: 'Progress Reports',
          description:
            'Submit monthly and semester progress reports for supervisor review.',
          icon: 'assessment',
          colorScheme: 'orange',
          path: thesisUrls.student.progressReports,
        },
        {
          title: 'Milestone Tracker',
          description:
            'Track your research journey milestones with completion dates and status.',
          icon: 'flag',
          colorScheme: 'amber',
          path: thesisUrls.student.milestoneTracker,
        },
        {
          title: 'Meeting Logs',
          description:
            'Log and view advisory meeting summaries, notes and action items.',
          icon: 'event_note',
          colorScheme: 'blue',
          path: thesisUrls.student.meetingLogs,
        },
        {
          title: 'Synopsis Submission',
          description:
            'Upload synopsis document and track approval status through workflow.',
          icon: 'edit_note',
          colorScheme: 'purple',
          path: thesisUrls.student.synopsisSubmission,
        },
        {
          title: 'Final Thesis',
          description:
            'Submit final consolidated thesis PDF with declaration and publication details.',
          icon: 'send',
          colorScheme: 'red',
          path: thesisUrls.student.finalThesis,
        },
        {
          title: 'Viva Schedule',
          description:
            'View your defense date, time, venue and jury panel composition.',
          icon: 'event',
          colorScheme: 'green',
          path: thesisUrls.student.vivaSchedule,
        },
        {
          title: 'Results',
          description:
            'View viva evaluation scorecard, jury verdict and correction instructions.',
          icon: 'emoji_events',
          colorScheme: 'teal',
          path: thesisUrls.student.results,
        },
        {
          title: 'Repository',
          description:
            'Access your published thesis handle, DOI link and download certificate.',
          icon: 'library_books',
          colorScheme: 'indigo',
          path: thesisUrls.student.repository,
        },
        {
          title: 'Notifications',
          description:
            'View all system alerts, deadline reminders and approval notifications.',
          icon: 'notifications',
          colorScheme: 'pink',
          path: thesisUrls.student.notifications,
        },
      ]}
    />
  );
}
