import type {
  Ticket,
  KBArticle,
  KBComment,
  AgentWorkload,
  SettingsData,
  ServiceCategory,
  SLARule,
} from './types';
import { TicketStatus, TicketPriority } from './types';

function makeComments(ticketCode: string): Ticket['comments'] {
  return [
    {
      id: `${ticketCode}-c1`,
      ticketCode,
      author: 'Dr. Neha Sharma',
      authorRole: 'Employee',
      text: 'The issue is affecting my research work. Please prioritize.',
      timestamp: 'Today, 10:15 AM',
      isInternal: false,
    },
    {
      id: `${ticketCode}-c2`,
      ticketCode,
      author: 'Er. Amit Patel',
      authorRole: 'Agent',
      text: 'We are investigating the issue. Will update shortly.',
      timestamp: 'Today, 10:45 AM',
      isInternal: false,
    },
    {
      id: `${ticketCode}-c3`,
      ticketCode,
      author: 'Er. Amit Patel',
      authorRole: 'Agent',
      text: 'This appears to be a hardware fault. Coordinating with vendor.',
      timestamp: 'Today, 11:00 AM',
      isInternal: true,
    },
    {
      id: `${ticketCode}-c4`,
      ticketCode,
      author: 'Dr. Neha Sharma',
      authorRole: 'Employee',
      text: 'Thank you for the update. Please keep me posted.',
      timestamp: 'Today, 11:30 AM',
      isInternal: false,
    },
  ];
}

const timelineBase = (
  code: string,
  status: TicketStatus,
  created: string
): Ticket['timeline'] => {
  const events: Ticket['timeline'] = [
    {
      id: `${code}-t1`,
      ticketCode: code,
      type: 'created',
      timestamp: created,
      actor: 'Dr. Neha Sharma',
      description: 'Ticket created',
    },
  ];
  if (status !== TicketStatus.DRAFT && status !== TicketStatus.SUBMITTED) {
    events.push({
      id: `${code}-t2`,
      ticketCode: code,
      type: 'assigned',
      timestamp: created,
      actor: 'System',
      description: 'Assigned to Er. Amit Patel',
    });
  }
  if (
    status === TicketStatus.IN_PROGRESS ||
    status === TicketStatus.WAITING_FOR_USER ||
    status === TicketStatus.PENDING ||
    status === TicketStatus.RESOLVED ||
    status === TicketStatus.CLOSED ||
    status === TicketStatus.REOPENED
  ) {
    events.push({
      id: `${code}-t3`,
      ticketCode: code,
      type: 'accepted',
      timestamp: created,
      actor: 'Er. Amit Patel',
      description: 'Agent accepted the ticket',
    });
  }
  if (
    status === TicketStatus.RESOLVED ||
    status === TicketStatus.CLOSED ||
    status === TicketStatus.REOPENED
  ) {
    events.push({
      id: `${code}-t4`,
      ticketCode: code,
      type: 'resolved',
      timestamp: created,
      actor: 'Er. Amit Patel',
      description: 'Issue resolved and verified',
    });
  }
  if (status === TicketStatus.CLOSED) {
    events.push({
      id: `${code}-t5`,
      ticketCode: code,
      type: 'closed',
      timestamp: created,
      actor: 'Dr. Arvind Mehta',
      description: 'Ticket closed by admin',
    });
  }
  if (status === TicketStatus.REOPENED) {
    events.push({
      id: `${code}-t6`,
      ticketCode: code,
      type: 'reopened',
      timestamp: created,
      actor: 'Dr. Neha Sharma',
      description: 'Ticket reopened by requester',
    });
  }
  return events;
};

const agents = ['Er. Amit Patel', 'Er. Sandeep Kothari', 'Ms. Priya Nair'];
const teams = [
  'Campus Tier 1 Helpdesk',
  'High-Performance Computing Group',
  'Network Operations Center (NOC)',
  'Software Licensing & Assets',
];

let ticketCounter = 200;

function genCode(): string {
  ticketCounter++;
  return `STU-INC-2026-${ticketCounter}`;
}

function rndAgent(): string {
  return agents[Math.floor(Math.random() * agents.length)];
}

function rndTeam(): string {
  return teams[Math.floor(Math.random() * teams.length)];
}

const ticketTemplates: Array<{
  title: string;
  description: string;
  module: string;
  service: string;
  subService: string;
  category: string;
  requesterName: string;
  requesterId: string;
  requesterEmail: string;
  requesterDepartment: string;
  assetTag: string;
  campusBlock: string;
  priority: string;
}> = [
  {
    title: 'HPC Cluster Node Overheating & Thermal Alarm Grid 4B',
    description:
      'The HPC Node-04 rack temperature exceeded 85°C. System automatically throttled execution pipelines. Running jobs for quantum cryptography simulations are stalled.',
    module: 'Infrastructure & Servers',
    service: 'HPC Cluster',
    subService: 'Cooling System',
    category: 'Hardware Failure',
    requesterName: 'Dr. Neha Sharma',
    requesterId: 'USR-EMP-001',
    requesterEmail: 'neha.sharma@stu.ac.in',
    requesterDepartment: 'Computer Science',
    assetTag: 'STU-HPC-NODE04',
    campusBlock: 'Admin Server Farm - Room 102',
    priority: 'Critical',
  },
  {
    title: 'Adobe Creative Suite License Sync Faults for Media Lab',
    description:
      'Students in Heritage Retrofitting labs are receiving activation errors stating the enterprise license pool has reached its max concurrent limit.',
    module: 'Software & Licenses',
    service: 'Adobe Creative Suite',
    subService: 'License Activation',
    category: 'License Issue',
    requesterName: 'Dr. Preeti Deshmukh',
    requesterId: 'USR-EMP-003',
    requesterEmail: 'preeti.d@stu.ac.in',
    requesterDepartment: 'Civil Engineering',
    assetTag: 'STU-LIC-ADOBE09',
    campusBlock: 'Civil Engineering Block C',
    priority: 'Medium',
  },
  {
    title: 'Core Fiber Trunk Transceiver Failure (Block G Switch Uplink)',
    description:
      'Loss of optical sync on primary Uplink fiber. Internet connectivity is fully offline for the agricultural engineering research wing.',
    module: 'Network & Wi-Fi',
    service: 'Fiber Optic',
    subService: 'Transceiver',
    category: 'Network Outage',
    requesterName: 'Prof. H. S. Rawat',
    requesterId: 'USR-EMP-002',
    requesterEmail: 'rawat.hs@stu.ac.in',
    requesterDepartment: 'Agricultural Engineering',
    assetTag: 'STU-SW-G3-CORE',
    campusBlock: 'Agricultural Engineering Wing - Block G',
    priority: 'High',
  },
  {
    title: 'Workstation GPU Failure in CAD Lab 204',
    description:
      'Three workstations in CAD Lab 204 have NVIDIA Quadro cards showing artifacts and crashing under load.',
    module: 'Workstation Hardware',
    service: 'Desktop Workstation',
    subService: 'GPU',
    category: 'Hardware Failure',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: 'STU-WKS-CAD204-07',
    campusBlock: 'Electronics Block - Lab 204',
    priority: 'High',
  },
  {
    title: 'SAP ERP Login Portal Not Responding',
    description:
      'Faculty unable to log into the SAP ERP portal since 9 AM. Receiving gateway timeout errors.',
    module: 'Software & Licenses',
    service: 'ERP Systems',
    subService: 'SAP Login',
    category: 'Application Issue',
    requesterName: 'Dr. Meera Joshi',
    requesterId: 'USR-EMP-005',
    requesterEmail: 'meera.joshi@stu.ac.in',
    requesterDepartment: 'Library Sciences',
    assetTag: '',
    campusBlock: 'Library Main Building',
    priority: 'Critical',
  },
  {
    title: 'Wi-Fi 6 Access Point Dead Zone - Lecture Hall 7',
    description:
      'Students in Lecture Hall 7 (east wing) report no signal from the newly deployed Wi-Fi 6 AP.',
    module: 'Network & Wi-Fi',
    service: 'Wireless Network',
    subService: 'Access Point',
    category: 'Connectivity Issue',
    requesterName: 'Dr. Neha Sharma',
    requesterId: 'USR-EMP-001',
    requesterEmail: 'neha.sharma@stu.ac.in',
    requesterDepartment: 'Computer Science',
    assetTag: 'STU-AP-LH7-E02',
    campusBlock: 'Lecture Hall Complex',
    priority: 'Medium',
  },
  {
    title: 'Printer Queue Stuck - Library Main Branch',
    description:
      'All print jobs stuck in queue on the main library HP LaserJet. Service not responding.',
    module: 'Workstation Hardware',
    service: 'Printers & Scanners',
    subService: 'Network Printer',
    category: 'Hardware Issue',
    requesterName: 'Dr. Meera Joshi',
    requesterId: 'USR-EMP-005',
    requesterEmail: 'meera.joshi@stu.ac.in',
    requesterDepartment: 'Library Sciences',
    assetTag: 'STU-PRN-LIB-M01',
    campusBlock: 'Library Main Building',
    priority: 'Low',
  },
  {
    title: 'VPN Gateway Certificate Expired',
    description:
      'Remote faculty unable to connect via OpenVPN. Certificate expired on June 25. Need urgent renewal.',
    module: 'Network & Wi-Fi',
    service: 'VPN Services',
    subService: 'Certificate Management',
    category: 'Security Issue',
    requesterName: 'Prof. H. S. Rawat',
    requesterId: 'USR-EMP-002',
    requesterEmail: 'rawat.hs@stu.ac.in',
    requesterDepartment: 'Agricultural Engineering',
    assetTag: '',
    campusBlock: 'Remote',
    priority: 'Critical',
  },
  {
    title: 'MATLAB License Server Down',
    description:
      'MATLAB license server not responding. Faculty and research scholars cannot launch MATLAB.',
    module: 'Software & Licenses',
    service: 'MATLAB',
    subService: 'License Server',
    category: 'License Issue',
    requesterName: 'Dr. Neha Sharma',
    requesterId: 'USR-EMP-001',
    requesterEmail: 'neha.sharma@stu.ac.in',
    requesterDepartment: 'Computer Science',
    assetTag: 'STU-LIC-MATLAB01',
    campusBlock: 'Admin Server Farm',
    priority: 'High',
  },
  {
    title: 'Lab 101 Desktop Not Booting',
    description:
      '10 desktops in Lab 101 failing POST. Possible PSU failure across the row.',
    module: 'Workstation Hardware',
    service: 'Desktop Workstation',
    subService: 'Power Supply',
    category: 'Hardware Failure',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: 'STU-WKS-101-01',
    campusBlock: 'Electronics Block - Lab 101',
    priority: 'High',
  },
  {
    title: 'Email Service Outage - Exchange Server 2019',
    description:
      'Faculty unable to send/receive emails. Exchange database corrupted.',
    module: 'Software & Licenses',
    service: 'Email Systems',
    subService: 'Microsoft Exchange',
    category: 'Application Issue',
    requesterName: 'Dr. Preeti Deshmukh',
    requesterId: 'USR-EMP-003',
    requesterEmail: 'preeti.d@stu.ac.in',
    requesterDepartment: 'Civil Engineering',
    assetTag: 'STU-SRV-EXCH01',
    campusBlock: 'Data Center Block B',
    priority: 'Critical',
  },
  {
    title: 'Payroll Portal Access Issues',
    description:
      'New faculty unable to access payroll portal. Account not provisioned in HRMS.',
    module: 'Software & Licenses',
    service: 'ERP Systems',
    subService: 'Payroll Module',
    category: 'Access Issue',
    requesterName: 'Dr. Meera Joshi',
    requesterId: 'USR-EMP-005',
    requesterEmail: 'meera.joshi@stu.ac.in',
    requesterDepartment: 'Library Sciences',
    assetTag: '',
    campusBlock: 'Administrative Block A',
    priority: 'Medium',
  },
  {
    title: 'Smart Classroom AV System Malfunction',
    description:
      'Projector and audio system in Smart Classroom 302 not syncing. HDMI matrix switch faulty.',
    module: 'Workstation Hardware',
    service: 'AV Equipment',
    subService: 'Projector',
    category: 'Hardware Issue',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: 'STU-AV-SC302-P01',
    campusBlock: 'Lecture Hall Complex',
    priority: 'Medium',
  },
  {
    title: 'Campus DNS Resolution Failures',
    description:
      'Intermittent DNS failures across campus. Some websites not resolving. Likely DNS cache poisoning.',
    module: 'Network & Wi-Fi',
    service: 'DNS/DHCP',
    subService: 'DNS Resolution',
    category: 'Network Issue',
    requesterName: 'Dr. Neha Sharma',
    requesterId: 'USR-EMP-001',
    requesterEmail: 'neha.sharma@stu.ac.in',
    requesterDepartment: 'Computer Science',
    assetTag: 'STU-SRV-DNS01',
    campusBlock: 'Data Center Block B',
    priority: 'High',
  },
  {
    title: 'Anti-Virus Definition Update Failure',
    description:
      'Enterprise Symantec AV not updating definitions since June 20. Endpoints at risk.',
    module: 'Software & Licenses',
    service: 'Security Software',
    subService: 'Anti-Virus',
    category: 'Security Issue',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: 'STU-SRV-SEC01',
    campusBlock: 'Admin Server Farm',
    priority: 'High',
  },
  {
    title: 'Research Database Access Denied',
    description:
      'IEEE and ACM digital libraries returning access denied for campus IP range.',
    module: 'Software & Licenses',
    service: 'Research Databases',
    subService: 'IEEE Xplore',
    category: 'Access Issue',
    requesterName: 'Dr. Neha Sharma',
    requesterId: 'USR-EMP-001',
    requesterEmail: 'neha.sharma@stu.ac.in',
    requesterDepartment: 'Computer Science',
    assetTag: '',
    campusBlock: 'Library Main Building',
    priority: 'Medium',
  },
  {
    title: 'CCTV NVR Storage Almost Full',
    description:
      'Network Video Recorder storage at 92%. Need archival or expansion before retention policy violation.',
    module: 'Infrastructure & Servers',
    service: 'Surveillance Systems',
    subService: 'NVR Storage',
    category: 'Capacity Issue',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: 'STU-NVR-CAMPUS01',
    campusBlock: 'Security Control Room',
    priority: 'Low',
  },
  {
    title: 'Biometric Attendance System Sync Failure',
    description:
      'Biometric punches not syncing to HRMS since last night. Daily attendance reports showing gaps.',
    module: 'Infrastructure & Servers',
    service: 'IoT Devices',
    subService: 'Biometric Reader',
    category: 'Integration Issue',
    requesterName: 'Dr. Preeti Deshmukh',
    requesterId: 'USR-EMP-003',
    requesterEmail: 'preeti.d@stu.ac.in',
    requesterDepartment: 'Civil Engineering',
    assetTag: 'STU-BIO-ADMIN-03',
    campusBlock: 'Administrative Block A',
    priority: 'Medium',
  },
  {
    title: 'Guest Wi-Fi Portal Captive Page Broken',
    description:
      'Guest Wi-Fi users not being redirected to captive portal. Direct internet access bypassing authentication.',
    module: 'Network & Wi-Fi',
    service: 'Wireless Network',
    subService: 'Guest Network',
    category: 'Security Issue',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: '',
    campusBlock: 'All Campus',
    priority: 'High',
  },
  {
    title: 'PLC Controller Failure - HVAC System Block D',
    description:
      'PLC controller for HVAC in Block D not responding. Temperature rising in server room.',
    module: 'Infrastructure & Servers',
    service: 'Building Management',
    subService: 'HVAC Controller',
    category: 'Hardware Failure',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: 'STU-PLC-HVAC-D01',
    campusBlock: 'Administrative Block D',
    priority: 'Critical',
  },
  {
    title: 'Online Exam Portal Slow Response',
    description:
      'Exam portal response time > 5 seconds during peak hours. Students complaining of timeout.',
    module: 'Software & Licenses',
    service: 'ERP Systems',
    subService: 'Exam Module',
    category: 'Performance Issue',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: '',
    campusBlock: 'All Campus',
    priority: 'High',
  },
  {
    title: 'Network Switch Port Failure - Block C Floor 3',
    description:
      'Switch port 24 on Stack-3 not providing link. Multiple faculty offline.',
    module: 'Network & Wi-Fi',
    service: 'Switched Network',
    subService: 'Access Switch',
    category: 'Hardware Failure',
    requesterName: 'Dr. Preeti Deshmukh',
    requesterId: 'USR-EMP-003',
    requesterEmail: 'preeti.d@stu.ac.in',
    requesterDepartment: 'Civil Engineering',
    assetTag: 'STU-SW-C3-S03',
    campusBlock: 'Civil Engineering Block C',
    priority: 'High',
  },
  {
    title: 'UPS Battery Replacement Required - Lab 101',
    description:
      'UPS in Lab 101 beeping continuously. Battery bank at end of life. Need replacement before monsoon.',
    module: 'Infrastructure & Servers',
    service: 'Power Infrastructure',
    subService: 'UPS System',
    category: 'Maintenance',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: 'STU-UPS-LAB101',
    campusBlock: 'Electronics Block - Lab 101',
    priority: 'Medium',
  },
  {
    title: 'LDAP Authentication Slowdown',
    description:
      'LDAP queries taking > 3 seconds. All dependent services (Wi-Fi, VPN, Email) affected.',
    module: 'Infrastructure & Servers',
    service: 'Directory Services',
    subService: 'LDAP/AD',
    category: 'Performance Issue',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: 'STU-SRV-LDAP01',
    campusBlock: 'Data Center Block B',
    priority: 'High',
  },
  {
    title: 'Faculty Website CMS Login Broken',
    description:
      'Faculty unable to log into the CMS to update profile pages. Returns 403 error.',
    module: 'Software & Licenses',
    service: 'Web Services',
    subService: 'CMS Platform',
    category: 'Application Issue',
    requesterName: 'Prof. H. S. Rawat',
    requesterId: 'USR-EMP-002',
    requesterEmail: 'rawat.hs@stu.ac.in',
    requesterDepartment: 'Agricultural Engineering',
    assetTag: '',
    campusBlock: 'Agricultural Engineering Wing',
    priority: 'Medium',
  },
  {
    title: 'Storage Array Disk Failure - RAID 5 Degraded',
    description:
      'Disk 7 in storage array SAN-02 failed. RAID 5 array now degraded. Need hot-swap replacement.',
    module: 'Infrastructure & Servers',
    service: 'Storage Systems',
    subService: 'SAN Storage',
    category: 'Hardware Failure',
    requesterName: 'Dr. Arvind Mehta',
    requesterId: 'USR-ADM-001',
    requesterEmail: 'arvind.mehta@stu.ac.in',
    requesterDepartment: 'IT Services',
    assetTag: 'STU-SAN-02-DSK07',
    campusBlock: 'Data Center Block B',
    priority: 'Critical',
  },
  {
    title: 'Video Conferencing System Not Working - Conference Room 1',
    description:
      'Polycom system in Conference Room 1 not connecting. Microphone array not detected.',
    module: 'Workstation Hardware',
    service: 'AV Equipment',
    subService: 'Video Conferencing',
    category: 'Hardware Issue',
    requesterName: 'Dr. Meera Joshi',
    requesterId: 'USR-EMP-005',
    requesterEmail: 'meera.joshi@stu.ac.in',
    requesterDepartment: 'Library Sciences',
    assetTag: 'STU-AV-CR01-POLY',
    campusBlock: 'Administrative Block A',
    priority: 'Medium',
  },
  {
    title: 'Moodle LMS Plugin Compatibility Issue',
    description:
      'New plagiarism plugin incompatible with current Moodle version. Plugin causing white screen of death.',
    module: 'Software & Licenses',
    service: 'LMS Platform',
    subService: 'Moodle Plugins',
    category: 'Application Issue',
    requesterName: 'Prof. Rajesh Khanna',
    requesterId: 'USR-EMP-004',
    requesterEmail: 'rajesh.khanna@stu.ac.in',
    requesterDepartment: 'Electronics & Communication',
    assetTag: '',
    campusBlock: 'All Campus',
    priority: 'Medium',
  },
];

function buildTicket(
  template: (typeof ticketTemplates)[number],
  status: TicketStatus,
  overrides?: Partial<Ticket>
): Ticket {
  const code = genCode();
  const daysAgo = Math.floor(Math.random() * 14);
  const createdDate = new Date(Date.now() - daysAgo * 86400000);
  const createdStr =
    createdDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    `, ${10 + Math.floor(Math.random() * 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;

  const slaHours =
    template.priority === 'Critical'
      ? 4
      : template.priority === 'High'
        ? 8
        : template.priority === 'Medium'
          ? 24
          : 72;
  const dueDate = new Date(createdDate.getTime() + slaHours * 3600000);
  const dueStr = dueDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isViolated =
    status === TicketStatus.OPEN ||
    status === TicketStatus.ASSIGNED ||
    status === TicketStatus.IN_PROGRESS;
  const assignedAgent = rndAgent();

  return {
    code,
    title: template.title,
    description: template.description,
    status,
    priority: template.priority as Ticket['priority'],
    module: template.module,
    service: template.service,
    subService: template.subService,
    category: template.category,
    impact:
      template.priority === 'Critical'
        ? 'High'
        : template.priority === 'Low'
          ? 'Low'
          : 'Medium',
    urgency:
      template.priority === 'Critical'
        ? 'High'
        : template.priority === 'Low'
          ? 'Low'
          : 'Medium',
    requesterId: template.requesterId,
    requesterName: template.requesterName,
    requesterEmail: template.requesterEmail,
    requesterDepartment: template.requesterDepartment,
    assignedAgent: status === TicketStatus.DRAFT ? 'Unassigned' : assignedAgent,
    assignedTeam: rndTeam(),
    assignedDepartment: template.requesterDepartment,
    createdDate: createdStr,
    dueDate: dueStr,
    closedDate: status === TicketStatus.CLOSED ? dueStr : undefined,
    slaDeadline: dueStr,
    slaViolated: isViolated,
    resolutionTime:
      status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED
        ? `${Math.floor(Math.random() * slaHours)}h ${Math.floor(Math.random() * 60)}m`
        : undefined,
    attachments: [],
    comments: status !== TicketStatus.DRAFT ? makeComments(code) : [],
    timeline: timelineBase(code, status, createdStr),
    isSpam: false,
    reopenCount: status === TicketStatus.REOPENED ? 1 : 0,
    ...overrides,
  };
}

export const initialTickets: Ticket[] = [
  // Critical
  buildTicket(ticketTemplates[0], TicketStatus.IN_PROGRESS),
  buildTicket(ticketTemplates[4], TicketStatus.OPEN),
  buildTicket(ticketTemplates[7], TicketStatus.ASSIGNED),
  buildTicket(ticketTemplates[10], TicketStatus.IN_PROGRESS),
  buildTicket(ticketTemplates[19], TicketStatus.OPEN),
  buildTicket(ticketTemplates[26], TicketStatus.ASSIGNED),
  // High
  buildTicket(ticketTemplates[2], TicketStatus.ESCALATED),
  buildTicket(ticketTemplates[3], TicketStatus.ACCEPTED),
  buildTicket(ticketTemplates[8], TicketStatus.IN_PROGRESS),
  buildTicket(ticketTemplates[9], TicketStatus.OPEN),
  buildTicket(ticketTemplates[13], TicketStatus.ASSIGNED),
  buildTicket(ticketTemplates[14], TicketStatus.WAITING_FOR_USER),
  buildTicket(ticketTemplates[18], TicketStatus.PENDING),
  buildTicket(ticketTemplates[20], TicketStatus.ASSIGNED),
  buildTicket(ticketTemplates[22], TicketStatus.IN_PROGRESS),
  buildTicket(ticketTemplates[24], TicketStatus.OPEN),
  // Medium
  buildTicket(ticketTemplates[1], TicketStatus.PENDING),
  buildTicket(ticketTemplates[5], TicketStatus.CLOSED),
  buildTicket(ticketTemplates[11], TicketStatus.RESOLVED),
  buildTicket(ticketTemplates[12], TicketStatus.IN_PROGRESS),
  buildTicket(ticketTemplates[15], TicketStatus.OPEN),
  buildTicket(ticketTemplates[17], TicketStatus.ASSIGNED),
  buildTicket(ticketTemplates[23], TicketStatus.OPEN),
  buildTicket(ticketTemplates[25], TicketStatus.WAITING_FOR_USER),
  buildTicket(ticketTemplates[27], TicketStatus.SUBMITTED),
  buildTicket(ticketTemplates[18], TicketStatus.DRAFT),
  buildTicket(ticketTemplates[0], TicketStatus.SUBMITTED),
  buildTicket(ticketTemplates[21], TicketStatus.DRAFT),
  // Low
  buildTicket(ticketTemplates[6], TicketStatus.CLOSED),
  buildTicket(ticketTemplates[16], TicketStatus.RESOLVED),
];

// Spam tickets
initialTickets.push(
  buildTicket(ticketTemplates[0], TicketStatus.SUBMITTED, {
    isSpam: true,
    title: 'BUY NOW: Cheap hosting plans',
    description: 'Visit our site for amazing deals!',
  }),
  buildTicket(ticketTemplates[1], TicketStatus.SUBMITTED, {
    isSpam: true,
    title: 'You won a lottery!',
    description: 'Claim your prize now.',
  })
);

// Reopened tickets
initialTickets.push(
  buildTicket(ticketTemplates[8], TicketStatus.REOPENED),
  buildTicket(ticketTemplates[15], TicketStatus.REOPENED)
);

export const initialKBArticles: KBArticle[] = [
  {
    id: 'KB-IT-0001',
    title: 'How to Reset Your ERP/Campus Portal Password',
    category: 'ERP Login',
    summary:
      'Step-by-step guide to reset your forgotten ERP password using the self-service portal.',
    content:
      '1. Go to https://erp.stu.ac.in\n2. Click "Forgot Password"\n3. Enter your registered email ID\n4. Check inbox for OTP\n5. Enter OTP and set new password\n6. Login with new credentials\n\nIf you do not receive the OTP, contact IT Service Desk.',
    tags: ['password', 'erp', 'login', 'reset'],
    views: 3420,
    rating: 4.7,
    author: 'IT Services',
    createdDate: '15 Jan 2025',
    updatedDate: '20 May 2026',
  },
  {
    id: 'KB-IT-0002',
    title: 'Configuring STU-Secure Wi-Fi (802.1X) on Windows 11',
    category: 'WiFi',
    summary:
      'Complete guide to connect to the secure campus Wi-Fi network on Windows 11 devices.',
    content:
      '1. Open Wi-Fi settings\n2. Select "STU-Secure"\n3. Click Connect\n4. Username: your employee ID\n5. Password: your network password\n6. Ignore certificate warning\n\nFor issues, ensure your device date/time is correct.',
    tags: ['wi-fi', 'network', 'windows', '802.1x'],
    views: 5400,
    rating: 4.5,
    author: 'Network Team',
    createdDate: '10 Feb 2025',
    updatedDate: '01 Jun 2026',
  },
  {
    id: 'KB-IT-0003',
    title: 'Setting Up VPN Access for Remote Work',
    category: 'VPN',
    summary:
      'Instructions to install and configure OpenVPN client for remote access to campus resources.',
    content:
      '1. Download OpenVPN client from https://vpn.stu.ac.in\n2. Install the client\n3. Download your profile from the same URL\n4. Import profile into OpenVPN\n5. Connect using your LDAP credentials\n\nNote: VPN requires Multi-Factor Authentication.',
    tags: ['vpn', 'remote', 'openvpn', 'mfa'],
    views: 2800,
    rating: 4.3,
    author: 'Network Team',
    createdDate: '01 Mar 2025',
    updatedDate: '15 May 2026',
  },
  {
    id: 'KB-IT-0004',
    title: 'Connecting to Campus Wi-Fi on macOS and iOS',
    category: 'WiFi',
    summary:
      'Guide for Apple device users to connect to STU-Secure and STU-Guest networks.',
    content:
      'For STU-Secure:\n1. Go to System Settings > Wi-Fi\n2. Select "STU-Secure"\n3. Username: employee ID\n4. Password: network password\n5. Trust certificate\n\nFor STU-Guest:\n1. Select "STU-Guest"\n2. Open browser\n3. Accept terms and conditions',
    tags: ['wi-fi', 'macos', 'ios', 'apple'],
    views: 3900,
    rating: 4.6,
    author: 'Network Team',
    createdDate: '20 Mar 2025',
    updatedDate: '28 May 2026',
  },
  {
    id: 'KB-IT-0005',
    title: 'Troubleshooting Printer Connectivity Issues',
    category: 'Printer',
    summary:
      'Common fixes for network printer connection problems across campus.',
    content:
      '1. Check printer is powered on\n2. Verify printer has paper and toner\n3. Check network cable is connected\n4. Restart print spooler service\n5. Re-add printer from Control Panel\n\nIf problem persists, note the printer IP address and contact the service desk.',
    tags: ['printer', 'print', 'network', 'troubleshoot'],
    views: 1800,
    rating: 4.2,
    author: 'Hardware Team',
    createdDate: '05 Apr 2025',
    updatedDate: '10 Jun 2026',
  },
  {
    id: 'KB-IT-0006',
    title: 'Installing and Activating Microsoft Office 365',
    category: 'Email',
    summary:
      'How to install Microsoft Office 365 ProPlus on personal devices using your institutional email.',
    content:
      '1. Go to https://portal.office.com\n2. Login with your email (username@stu.ac.in)\n3. Click "Install Office"\n4. Select "Office 365 Apps"\n5. Run the installer\n6. Activate with your institutional credentials\n\nYou can install on up to 5 devices.',
    tags: ['office', 'microsoft', 'email', 'installation'],
    views: 6200,
    rating: 4.8,
    author: 'IT Services',
    createdDate: '01 Jan 2025',
    updatedDate: '01 Jun 2026',
  },
  {
    id: 'KB-IT-0007',
    title: 'Payroll Portal: Viewing and Downloading Payslips',
    category: 'Payroll',
    summary:
      'Step-by-step instructions to access your payslips through the ERP payroll module.',
    content:
      '1. Login to ERP portal\n2. Navigate to Employee Self Service\n3. Click "Payroll"\n4. Select month/year\n5. Click "View Payslip"\n6. Download as PDF\n\nPayslips are available by the 7th of every month.',
    tags: ['payroll', 'salary', 'payslip', 'erp'],
    views: 4100,
    rating: 4.4,
    author: 'Finance & IT',
    createdDate: '15 Jan 2025',
    updatedDate: '25 May 2026',
  },
  {
    id: 'KB-IT-0008',
    title: 'Accessing the Online Exam Portal',
    category: 'Exam Portal',
    summary:
      'Guide for faculty to set up and manage online examinations through the exam portal.',
    content:
      '1. Go to https://exam.stu.ac.in\n2. Login with faculty credentials\n3. Click "Create Exam"\n4. Fill exam details (date, duration, max marks)\n5. Add questions manually or upload question bank\n6. Publish exam\n\nStudents will see the exam in their dashboard on the scheduled date.',
    tags: ['exam', 'online', 'portal', 'faculty'],
    views: 2300,
    rating: 4.1,
    author: 'Academic Systems',
    createdDate: '01 Feb 2025',
    updatedDate: '20 May 2026',
  },
  {
    id: 'KB-IT-0009',
    title: 'Requesting Software Installation via IT Service Desk',
    category: 'Software & Licenses',
    summary:
      'Process for requesting new software installations on campus workstations.',
    content:
      '1. Go to IT Service Desk portal\n2. Click "Create Ticket"\n3. Select category: Software & Licenses\n4. Choose the software name\n5. Provide justification\n6. Attach any required approvals\n\nStandard software is installed within 48 hours.',
    tags: ['software', 'installation', 'request', 'license'],
    views: 1500,
    rating: 4.0,
    author: 'IT Services',
    createdDate: '10 Mar 2025',
    updatedDate: '05 Jun 2026',
  },
  {
    id: 'KB-IT-0010',
    title: 'HPC SLURM Job Submission Best Practices',
    category: 'Infrastructure & Servers',
    summary:
      'Optimizing job submissions on the university HPC cluster for maximum throughput.',
    content:
      '1. Use sbatch for batch jobs\n2. Specify #SBATCH --nodes, --ntasks, --mem\n3. Use /scratch for I/O intensive jobs\n4. Request GPUs with --gres=gpu:1\n5. Monitor jobs with squeue\n6. Cancel with scancel\n\nSample script available in /share/examples.',
    tags: ['hpc', 'slurm', 'cluster', 'gpu'],
    views: 980,
    rating: 4.9,
    author: 'HPC Team',
    createdDate: '01 Apr 2025',
    updatedDate: '12 Jun 2026',
  },
];

export const initialKBComments: KBComment[] = [
  {
    id: 'KB-c1',
    articleId: 'KB-IT-0001',
    author: 'Dr. Neha Sharma',
    text: 'Very helpful. The OTP was delivered within seconds.',
    timestamp: '15 Mar 2026',
  },
  {
    id: 'KB-c2',
    articleId: 'KB-IT-0002',
    author: 'Prof. H. S. Rawat',
    text: 'Worked perfectly on my Windows 11 laptop. Thanks!',
    timestamp: '22 Apr 2026',
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    name: 'Infrastructure & Servers',
    icon: 'dns',
    services: [
      {
        name: 'HPC Cluster',
        subServices: [
          'Job Submission',
          'Node Failure',
          'Storage Quota',
          'Cooling System',
        ],
        dynamicFields: [
          {
            name: 'clusterNode',
            label: 'Cluster Node ID',
            type: 'text',
            required: true,
          },
          {
            name: 'jobId',
            label: 'Job ID (if applicable)',
            type: 'text',
            required: false,
          },
        ],
      },
      {
        name: 'Building Management',
        subServices: [
          'HVAC Controller',
          'Access Control',
          'Elevator',
          'Fire Alarm',
        ],
      },
      {
        name: 'Storage Systems',
        subServices: [
          'SAN Storage',
          'NAS Storage',
          'Backup',
          'Disaster Recovery',
        ],
      },
      {
        name: 'Power Infrastructure',
        subServices: [
          'UPS System',
          'Generator',
          'Power Distribution',
          'Battery',
        ],
      },
      {
        name: 'Directory Services',
        subServices: ['LDAP/AD', 'DNS/DHCP', 'Certificate Services'],
      },
      {
        name: 'Surveillance Systems',
        subServices: ['CCTV Camera', 'NVR Storage', 'Access Control'],
      },
      {
        name: 'IoT Devices',
        subServices: [
          'Biometric Reader',
          'Smart Sensor',
          'Environmental Monitor',
        ],
      },
    ],
  },
  {
    name: 'Network & Wi-Fi',
    icon: 'wifi',
    services: [
      {
        name: 'Wireless Network',
        subServices: [
          'Access Point',
          'Guest Network',
          '802.1X Authentication',
          'Signal Coverage',
        ],
        dynamicFields: [
          {
            name: 'buildingName',
            label: 'Building Name',
            type: 'select',
            required: true,
            options: [
              'Admin Block',
              'Academic Block',
              'Library',
              'Hostel',
              'Lab Complex',
            ],
          },
          {
            name: 'floorNumber',
            label: 'Floor Number',
            type: 'select',
            required: true,
            options: ['Ground', '1st', '2nd', '3rd', '4th', '5th'],
          },
        ],
      },
      {
        name: 'Switched Network',
        subServices: [
          'Access Switch',
          'Core Switch',
          'Stack Issue',
          'Port Failure',
        ],
      },
      {
        name: 'Fiber Optic',
        subServices: ['Transceiver', 'Patch Panel', 'Cable Break', 'Splice'],
      },
      {
        name: 'VPN Services',
        subServices: [
          'Connection Issue',
          'Certificate Management',
          'MFA Setup',
          'Client Configuration',
        ],
      },
      {
        name: 'DNS/DHCP',
        subServices: [
          'DNS Resolution',
          'DHCP Scope',
          'IP Conflict',
          'Reverse Lookup',
        ],
      },
    ],
  },
  {
    name: 'Software & Licenses',
    icon: 'computer',
    services: [
      {
        name: 'Adobe Creative Suite',
        subServices: [
          'License Activation',
          'Installation',
          'Update',
          'Compatibility',
        ],
        dynamicFields: [
          {
            name: 'adobeProduct',
            label: 'Product Name',
            type: 'select',
            required: true,
            options: [
              'Photoshop',
              'Illustrator',
              'Premiere Pro',
              'After Effects',
              'Acrobat Pro',
            ],
          },
          {
            name: 'serialNumber',
            label: 'Serial Number (optional)',
            type: 'text',
            required: false,
          },
        ],
      },
      {
        name: 'MATLAB',
        subServices: [
          'License Server',
          'Toolbox Activation',
          'Installation',
          'Update',
        ],
      },
      {
        name: 'ERP Systems',
        subServices: [
          'SAP Login',
          'Payroll Module',
          'Exam Module',
          'HR Module',
          'Leave Module',
        ],
      },
      {
        name: 'Email Systems',
        subServices: [
          'Microsoft Exchange',
          'Outlook Configuration',
          'Spam Filter',
          'Mailbox Quota',
        ],
      },
      {
        name: 'LMS Platform',
        subServices: [
          'Moodle Access',
          'Course Creation',
          'Plugin Issue',
          'Grade Sync',
        ],
      },
      {
        name: 'Security Software',
        subServices: [
          'Anti-Virus',
          'Firewall',
          'Endpoint Protection',
          'Patch Management',
        ],
      },
      {
        name: 'Research Databases',
        subServices: ['IEEE Xplore', 'ACM Digital', 'Scopus', 'Web of Science'],
      },
      {
        name: 'Web Services',
        subServices: [
          'CMS Platform',
          'Faculty Website',
          'Department Site',
          'SSL Certificate',
        ],
      },
    ],
  },
  {
    name: 'Workstation Hardware',
    icon: 'desktop_windows',
    services: [
      {
        name: 'Desktop Workstation',
        subServices: ['Power Supply', 'Motherboard', 'GPU', 'RAM', 'Storage'],
        dynamicFields: [
          {
            name: 'systemModel',
            label: 'System Model',
            type: 'text',
            required: true,
          },
          {
            name: 'serialNumber',
            label: 'Serial Number',
            type: 'text',
            required: true,
          },
          {
            name: 'location',
            label: 'Room/Lab Number',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        name: 'Printers & Scanners',
        subServices: [
          'Network Printer',
          'Local Printer',
          'Scanner',
          'Consumables',
        ],
      },
      {
        name: 'AV Equipment',
        subServices: [
          'Projector',
          'Video Conferencing',
          'Sound System',
          'Display',
        ],
      },
    ],
  },
];

export const initialAgentWorkloads: AgentWorkload[] = [
  {
    agentName: 'Er. Amit Patel',
    assigned: 8,
    inProgress: 3,
    resolved: 12,
    overdue: 1,
  },
  {
    agentName: 'Er. Sandeep Kothari',
    assigned: 5,
    inProgress: 2,
    resolved: 9,
    overdue: 0,
  },
  {
    agentName: 'Ms. Priya Nair',
    assigned: 6,
    inProgress: 4,
    resolved: 7,
    overdue: 2,
  },
];

export const initialSlaRules: SLARule[] = [
  {
    priority: 'Critical' as TicketPriority,
    resolutionHours: 4,
    responseHours: 1,
    color: 'red',
  },
  {
    priority: 'High' as TicketPriority,
    resolutionHours: 8,
    responseHours: 2,
    color: 'orange',
  },
  {
    priority: 'Medium' as TicketPriority,
    resolutionHours: 24,
    responseHours: 4,
    color: 'amber',
  },
  {
    priority: 'Low' as TicketPriority,
    resolutionHours: 72,
    responseHours: 8,
    color: 'green',
  },
];

export const initialSettings: SettingsData = {
  general: {
    moduleName: 'IT Service Desk',
    defaultPriority: 'Medium' as TicketPriority,
    autoAssign: true,
    allowGuestTickets: false,
    maxAttachments: 5,
  },
  slaRules: initialSlaRules,
  emailTemplates: [
    {
      id: 'ET-001',
      name: 'Ticket Created',
      subject: '[STU-IT] Your ticket {{code}} has been created',
      body: 'Dear {{name}},\n\nYour ticket {{code}} has been created successfully.\n\nTitle: {{title}}\nPriority: {{priority}}\n\nWe will get back to you shortly.\n\nIT Service Desk',
      event: 'ticket.created',
    },
    {
      id: 'ET-002',
      name: 'Ticket Assigned',
      subject: '[STU-IT] Ticket {{code}} assigned to {{agent}}',
      body: 'Dear {{name}},\n\nYour ticket {{code}} has been assigned to {{agent}}.\n\nThey will contact you shortly.\n\nIT Service Desk',
      event: 'ticket.assigned',
    },
    {
      id: 'ET-003',
      name: 'Ticket Resolved',
      subject: '[STU-IT] Your ticket {{code}} has been resolved',
      body: 'Dear {{name}},\n\nYour ticket {{code}} has been marked as resolved.\n\nResolution: {{resolution}}\n\nPlease confirm if the issue is fixed.\n\nIT Service Desk',
      event: 'ticket.resolved',
    },
  ],
  autoAssignment: {
    enabled: true,
    method: 'skill-based',
  },
  notificationSettings: {
    emailNotifications: true,
    inAppNotifications: true,
    dailyDigest: false,
  },
};
