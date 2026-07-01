// ============================================================
//  Networking & Communication Management — Types & Mock Data
//  Static prototype data modeled on a bulk email/SMS console.
// ============================================================

export type Channel = 'Email' | 'SMS';
export type CommStatus = 'Sent' | 'Failed' | 'Queued' | 'Pending';
export type RecipientType = 'Employees' | 'Students' | 'Group';
export type AudienceType = 'Employee' | 'Student';

export interface Communication {
  id: number;
  channel: Channel;
  date: string;
  recipientType: RecipientType;
  recipientCount: number;
  subject: string;
  from: string;
  status: CommStatus;
}

export interface Group {
  id: number;
  name: string;
  type: AudienceType;
  description: string;
  memberCount: number;
}

export interface MailingList {
  id: number;
  name: string;
  description: string;
  memberCount: number;
}

// ─── Communications (mixed email / sms) ─────────────────────────────────────

export const communications: Communication[] = [
  {
    id: 1,
    channel: 'Email',
    date: '02 Jan 2024',
    recipientType: 'Employees',
    recipientCount: 412,
    subject: 'Revised Academic Calendar 2024',
    from: 'registrar@univ.edu',
    status: 'Sent',
  },
  {
    id: 2,
    channel: 'SMS',
    date: '05 Jan 2024',
    recipientType: 'Students',
    recipientCount: 3120,
    subject: 'Semester fee due reminder — 15 Jan',
    from: 'UNIVMSG',
    status: 'Sent',
  },
  {
    id: 3,
    channel: 'Email',
    date: '11 Jan 2024',
    recipientType: 'Group',
    recipientCount: 86,
    subject: 'Faculty Development Programme — nominations',
    from: 'iqac@univ.edu',
    status: 'Sent',
  },
  {
    id: 4,
    channel: 'SMS',
    date: '18 Jan 2024',
    recipientType: 'Students',
    recipientCount: 2980,
    subject: 'Mid-term exam datesheet published',
    from: 'UNIVMSG',
    status: 'Failed',
  },
  {
    id: 5,
    channel: 'Email',
    date: '24 Jan 2024',
    recipientType: 'Employees',
    recipientCount: 408,
    subject: 'Republic Day flag hoisting — 08:00 AM',
    from: 'admin@univ.edu',
    status: 'Sent',
  },
  {
    id: 6,
    channel: 'Email',
    date: '02 Feb 2024',
    recipientType: 'Group',
    recipientCount: 54,
    subject: 'Research grant submission window open',
    from: 'research@univ.edu',
    status: 'Queued',
  },
  {
    id: 7,
    channel: 'SMS',
    date: '09 Feb 2024',
    recipientType: 'Students',
    recipientCount: 3105,
    subject: 'Scholarship disbursement credited',
    from: 'UNIVMSG',
    status: 'Sent',
  },
  {
    id: 8,
    channel: 'Email',
    date: '14 Feb 2024',
    recipientType: 'Employees',
    recipientCount: 415,
    subject: 'Annual property return — last date 29 Feb',
    from: 'hr@univ.edu',
    status: 'Sent',
  },
  {
    id: 9,
    channel: 'SMS',
    date: '20 Feb 2024',
    recipientType: 'Group',
    recipientCount: 240,
    subject: 'Hostel maintenance drill on Sunday',
    from: 'UNIVMSG',
    status: 'Pending',
  },
  {
    id: 10,
    channel: 'Email',
    date: '27 Feb 2024',
    recipientType: 'Students',
    recipientCount: 3260,
    subject: 'Convocation registration now live',
    from: 'exam@univ.edu',
    status: 'Sent',
  },
  {
    id: 11,
    channel: 'SMS',
    date: '05 Mar 2024',
    recipientType: 'Students',
    recipientCount: 3240,
    subject: 'Holi holiday — campus closed 25 Mar',
    from: 'UNIVMSG',
    status: 'Sent',
  },
  {
    id: 12,
    channel: 'Email',
    date: '12 Mar 2024',
    recipientType: 'Group',
    recipientCount: 32,
    subject: 'Board of Studies meeting agenda',
    from: 'academics@univ.edu',
    status: 'Failed',
  },
  {
    id: 13,
    channel: 'Email',
    date: '19 Mar 2024',
    recipientType: 'Employees',
    recipientCount: 418,
    subject: 'Payroll processed — March 2024',
    from: 'accounts@univ.edu',
    status: 'Sent',
  },
  {
    id: 14,
    channel: 'SMS',
    date: '26 Mar 2024',
    recipientType: 'Students',
    recipientCount: 3288,
    subject: 'Practical exam attendance mandatory',
    from: 'UNIVMSG',
    status: 'Queued',
  },
  {
    id: 15,
    channel: 'Email',
    date: '02 Apr 2024',
    recipientType: 'Group',
    recipientCount: 120,
    subject: 'Alumni meet — save the date',
    from: 'alumni@univ.edu',
    status: 'Sent',
  },
  {
    id: 16,
    channel: 'SMS',
    date: '09 Apr 2024',
    recipientType: 'Employees',
    recipientCount: 402,
    subject: 'Biometric attendance rollout notice',
    from: 'UNIVMSG',
    status: 'Sent',
  },
];

// ─── Groups ─────────────────────────────────────────────────────────────────

export const groups: Group[] = [
  {
    id: 1,
    name: 'All Teaching Faculty',
    type: 'Employee',
    description: 'Every teaching staff member across departments.',
    memberCount: 286,
  },
  {
    id: 2,
    name: 'Non-Teaching Staff',
    type: 'Employee',
    description: 'Administrative and support staff.',
    memberCount: 132,
  },
  {
    id: 3,
    name: 'Final Year Students',
    type: 'Student',
    description: 'Students in their graduating semester.',
    memberCount: 842,
  },
  {
    id: 4,
    name: 'Hostel Residents',
    type: 'Student',
    description: 'Students residing in university hostels.',
    memberCount: 1240,
  },
  {
    id: 5,
    name: 'IQAC Committee',
    type: 'Employee',
    description: 'Internal Quality Assurance Cell members.',
    memberCount: 24,
  },
  {
    id: 6,
    name: 'NSS Volunteers',
    type: 'Student',
    description: 'Enrolled National Service Scheme volunteers.',
    memberCount: 310,
  },
];

// ─── Mailing Lists ──────────────────────────────────────────────────────────

export const mailingLists: MailingList[] = [
  {
    id: 1,
    name: 'announcements@univ.edu',
    description: 'University-wide official announcements.',
    memberCount: 4820,
  },
  {
    id: 2,
    name: 'faculty@univ.edu',
    description: 'All teaching and research faculty.',
    memberCount: 286,
  },
  {
    id: 3,
    name: 'placements@univ.edu',
    description: 'Placement drive and recruiter updates.',
    memberCount: 1560,
  },
  {
    id: 4,
    name: 'research@univ.edu',
    description: 'Research scholars and PI coordinators.',
    memberCount: 214,
  },
  {
    id: 5,
    name: 'events@univ.edu',
    description: 'Cultural, sports and technical event notices.',
    memberCount: 3960,
  },
];

// ─── Status → StatusBadge variant mapper ────────────────────────────────────

export function statusVariant(
  status: CommStatus
): 'success' | 'danger' | 'warning' | 'muted' {
  switch (status) {
    case 'Sent':
      return 'success';
    case 'Failed':
      return 'danger';
    case 'Queued':
      return 'warning';
    case 'Pending':
      return 'muted';
  }
}
