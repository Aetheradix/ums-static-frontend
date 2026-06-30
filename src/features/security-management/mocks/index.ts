// ─── Types ────────────────────────────────────────────────────────────────────

export interface IncidentCategory {
  id: string;
  categoryName: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface IncidentType {
  id: string;
  typeName: string;
  categoryId: string;
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Priority {
  id: string;
  priorityName: string;
  level: number;
  color: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Severity {
  id: string;
  severityName: string;
  level: number;
  color: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface IncidentStatus {
  id: string;
  statusName: string;
  description: string;
  isDefault: boolean;
  status: 'Active' | 'Inactive';
}

export interface Building {
  id: string;
  buildingName: string;
  buildingCode: string;
  campus: string;
  floors: number;
  status: 'Active' | 'Inactive';
}

export interface Location {
  id: string;
  locationName: string;
  buildingId: string;
  building: string;
  floor: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface DepartmentMapping {
  id: string;
  department: string;
  securityOfficer: string;
  building: string;
  contactNumber: string;
  status: 'Active' | 'Inactive';
}

export interface EmergencyContactType {
  id: string;
  typeName: string;
  description: string;
  priority: number;
  status: 'Active' | 'Inactive';
}

export interface Helpline {
  id: string;
  helplineName: string;
  department: string;
  contactNumber: string;
  alternateNumber: string;
  email: string;
  availability: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Guideline {
  id: string;
  title: string;
  category: string;
  department: string;
  description: string;
  pdfUrl: string;
  videoUrl: string;
  applicableFor: 'All' | 'Employee' | 'Student' | 'Staff';
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Inactive';
}

export interface AwarenessProgram {
  id: string;
  programName: string;
  description: string;
  speaker: string;
  venue: string;
  date: string;
  time: string;
  department: string;
  audience: string;
  attachments: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface Incident {
  id: string;
  incidentId: string;
  reportedBy: string;
  reporterRole: 'Employee' | 'Student';
  reporterDept: string;
  category: string;
  incidentType: string;
  location: string;
  building: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  severity: 'Minor' | 'Moderate' | 'Major' | 'Critical';
  assignedTo: string;
  incidentDate: string;
  incidentTime: string;
  reportedDate: string;
  status:
    | 'Open'
    | 'Assigned'
    | 'Under Investigation'
    | 'Action Taken'
    | 'Resolved'
    | 'Closed';
  description: string;
  evidence: string;
  investigationNotes: string;
  resolutionNotes: string;
  closureNotes: string;
  timeline: IncidentTimelineStep[];
}

export interface IncidentTimelineStep {
  action:
    | 'reported'
    | 'assigned'
    | 'investigating'
    | 'action_taken'
    | 'resolved'
    | 'closed';
  actor: string;
  date: string;
  remarks: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const incidentCategories: IncidentCategory[] = [
  {
    id: '1',
    categoryName: 'Physical Security',
    description: 'Physical threats and unauthorized access incidents',
    status: 'Active',
  },
  {
    id: '2',
    categoryName: 'Cyber Security',
    description: 'Digital threats, hacking, phishing incidents',
    status: 'Active',
  },
  {
    id: '3',
    categoryName: 'Fire & Safety',
    description: 'Fire hazards, gas leaks, emergency situations',
    status: 'Active',
  },
  {
    id: '4',
    categoryName: 'Medical Emergency',
    description: 'Health emergencies and accidents on campus',
    status: 'Active',
  },
  {
    id: '5',
    categoryName: 'Theft & Robbery',
    description: 'Theft of personal or university property',
    status: 'Active',
  },
  {
    id: '6',
    categoryName: 'Harassment',
    description: 'Sexual harassment, ragging, bullying incidents',
    status: 'Active',
  },
  {
    id: '7',
    categoryName: 'Vandalism',
    description: 'Damage to university property',
    status: 'Active',
  },
  {
    id: '8',
    categoryName: 'Natural Disaster',
    description: 'Earthquake, flood, storm related incidents',
    status: 'Inactive',
  },
];

export const incidentTypes: IncidentType[] = [
  {
    id: '1',
    typeName: 'Unauthorized Entry',
    categoryId: '1',
    category: 'Physical Security',
    description: 'Entry without proper authorization',
    status: 'Active',
  },
  {
    id: '2',
    typeName: 'Trespassing',
    categoryId: '1',
    category: 'Physical Security',
    description: 'Unlawful presence in restricted area',
    status: 'Active',
  },
  {
    id: '3',
    typeName: 'Phishing Attack',
    categoryId: '2',
    category: 'Cyber Security',
    description: 'Fraudulent email or message attack',
    status: 'Active',
  },
  {
    id: '4',
    typeName: 'Data Breach',
    categoryId: '2',
    category: 'Cyber Security',
    description: 'Unauthorized access to sensitive data',
    status: 'Active',
  },
  {
    id: '5',
    typeName: 'Fire Outbreak',
    categoryId: '3',
    category: 'Fire & Safety',
    description: 'Active fire on campus',
    status: 'Active',
  },
  {
    id: '6',
    typeName: 'Gas Leak',
    categoryId: '3',
    category: 'Fire & Safety',
    description: 'Dangerous gas leakage',
    status: 'Active',
  },
  {
    id: '7',
    typeName: 'Accident',
    categoryId: '4',
    category: 'Medical Emergency',
    description: 'Physical accident requiring medical attention',
    status: 'Active',
  },
  {
    id: '8',
    typeName: 'Ragging',
    categoryId: '6',
    category: 'Harassment',
    description: 'Ragging incident involving students',
    status: 'Active',
  },
  {
    id: '9',
    typeName: 'Sexual Harassment',
    categoryId: '6',
    category: 'Harassment',
    description: 'Sexual harassment complaint',
    status: 'Active',
  },
  {
    id: '10',
    typeName: 'Mobile/Laptop Theft',
    categoryId: '5',
    category: 'Theft & Robbery',
    description: 'Theft of electronic devices',
    status: 'Active',
  },
];

export const priorities: Priority[] = [
  {
    id: '1',
    priorityName: 'Low',
    level: 1,
    color: '#22c55e',
    description:
      'Non-urgent incidents that can be addressed in routine workflow',
    status: 'Active',
  },
  {
    id: '2',
    priorityName: 'Medium',
    level: 2,
    color: '#f59e0b',
    description: 'Incidents that need attention within 24 hours',
    status: 'Active',
  },
  {
    id: '3',
    priorityName: 'High',
    level: 3,
    color: '#ef4444',
    description: 'Urgent incidents requiring immediate action',
    status: 'Active',
  },
  {
    id: '4',
    priorityName: 'Critical',
    level: 4,
    color: '#7c3aed',
    description: 'Life-threatening or campus-wide emergencies',
    status: 'Active',
  },
];

export const severities: Severity[] = [
  {
    id: '1',
    severityName: 'Minor',
    level: 1,
    color: '#22c55e',
    description: 'Minimal impact, easily resolved',
    status: 'Active',
  },
  {
    id: '2',
    severityName: 'Moderate',
    level: 2,
    color: '#f59e0b',
    description: 'Moderate impact, requires investigation',
    status: 'Active',
  },
  {
    id: '3',
    severityName: 'Major',
    level: 3,
    color: '#ef4444',
    description: 'Significant impact on operations',
    status: 'Active',
  },
  {
    id: '4',
    severityName: 'Critical',
    level: 4,
    color: '#7c3aed',
    description: 'Severe impact, campus-wide emergency',
    status: 'Active',
  },
];

export const incidentStatuses: IncidentStatus[] = [
  {
    id: '1',
    statusName: 'Open',
    description: 'Newly reported incident, not yet assigned',
    isDefault: true,
    status: 'Active',
  },
  {
    id: '2',
    statusName: 'Assigned',
    description: 'Incident assigned to security officer',
    isDefault: false,
    status: 'Active',
  },
  {
    id: '3',
    statusName: 'Under Investigation',
    description: 'Investigation in progress',
    isDefault: false,
    status: 'Active',
  },
  {
    id: '4',
    statusName: 'Action Taken',
    description: 'Action has been taken',
    isDefault: false,
    status: 'Active',
  },
  {
    id: '5',
    statusName: 'Resolved',
    description: 'Incident has been resolved',
    isDefault: false,
    status: 'Active',
  },
  {
    id: '6',
    statusName: 'Closed',
    description: 'Incident officially closed',
    isDefault: false,
    status: 'Active',
  },
];

export const buildings: Building[] = [
  {
    id: '1',
    buildingName: 'Main Academic Block',
    buildingCode: 'MAB',
    campus: 'Main Campus',
    floors: 4,
    status: 'Active',
  },
  {
    id: '2',
    buildingName: 'Science Block',
    buildingCode: 'SCB',
    campus: 'Main Campus',
    floors: 3,
    status: 'Active',
  },
  {
    id: '3',
    buildingName: 'Engineering Block',
    buildingCode: 'ENB',
    campus: 'Main Campus',
    floors: 5,
    status: 'Active',
  },
  {
    id: '4',
    buildingName: 'Boys Hostel A',
    buildingCode: 'BHA',
    campus: 'Hostel Zone',
    floors: 3,
    status: 'Active',
  },
  {
    id: '5',
    buildingName: 'Girls Hostel B',
    buildingCode: 'GHB',
    campus: 'Hostel Zone',
    floors: 3,
    status: 'Active',
  },
  {
    id: '6',
    buildingName: 'Library Block',
    buildingCode: 'LIB',
    campus: 'Main Campus',
    floors: 2,
    status: 'Active',
  },
  {
    id: '7',
    buildingName: 'Sports Complex',
    buildingCode: 'SPC',
    campus: 'Sports Zone',
    floors: 1,
    status: 'Active',
  },
  {
    id: '8',
    buildingName: 'Administrative Block',
    buildingCode: 'ADM',
    campus: 'Main Campus',
    floors: 3,
    status: 'Active',
  },
];

export const locations: Location[] = [
  {
    id: '1',
    locationName: 'Main Gate',
    buildingId: '1',
    building: 'Main Academic Block',
    floor: 'Ground',
    description: 'University main entrance gate',
    status: 'Active',
  },
  {
    id: '2',
    locationName: 'Computer Lab A',
    buildingId: '3',
    building: 'Engineering Block',
    floor: '2nd Floor',
    description: 'Computer lab with 60 workstations',
    status: 'Active',
  },
  {
    id: '3',
    locationName: 'Chemistry Lab',
    buildingId: '2',
    building: 'Science Block',
    floor: '1st Floor',
    description: 'Advanced chemistry laboratory',
    status: 'Active',
  },
  {
    id: '4',
    locationName: 'Library Reading Room',
    buildingId: '6',
    building: 'Library Block',
    floor: '1st Floor',
    description: 'Main reading room',
    status: 'Active',
  },
  {
    id: '5',
    locationName: 'Boys Hostel Corridor',
    buildingId: '4',
    building: 'Boys Hostel A',
    floor: '2nd Floor',
    description: '2nd floor corridor area',
    status: 'Active',
  },
  {
    id: '6',
    locationName: 'Cafeteria',
    buildingId: '1',
    building: 'Main Academic Block',
    floor: 'Ground',
    description: 'Main university cafeteria',
    status: 'Active',
  },
  {
    id: '7',
    locationName: 'Parking Area',
    buildingId: '8',
    building: 'Administrative Block',
    floor: 'Ground',
    description: 'Vehicle parking zone',
    status: 'Active',
  },
  {
    id: '8',
    locationName: 'Sports Ground',
    buildingId: '7',
    building: 'Sports Complex',
    floor: 'Ground',
    description: 'Outdoor sports ground',
    status: 'Active',
  },
];

export const departmentMappings: DepartmentMapping[] = [
  {
    id: '1',
    department: 'Computer Science',
    securityOfficer: 'Officer Rajesh Kumar',
    building: 'Engineering Block',
    contactNumber: '9876543210',
    status: 'Active',
  },
  {
    id: '2',
    department: 'Physics',
    securityOfficer: 'Officer Priya Sharma',
    building: 'Science Block',
    contactNumber: '9876543211',
    status: 'Active',
  },
  {
    id: '3',
    department: 'Administration',
    securityOfficer: 'Officer Amit Singh',
    building: 'Administrative Block',
    contactNumber: '9876543212',
    status: 'Active',
  },
  {
    id: '4',
    department: 'Hostel Management',
    securityOfficer: 'Officer Sunita Devi',
    building: 'Boys Hostel A',
    contactNumber: '9876543213',
    status: 'Active',
  },
  {
    id: '5',
    department: 'Library',
    securityOfficer: 'Officer Ravi Verma',
    building: 'Library Block',
    contactNumber: '9876543214',
    status: 'Active',
  },
];

export const emergencyContactTypes: EmergencyContactType[] = [
  {
    id: '1',
    typeName: 'Medical Emergency',
    description: 'Medical team and ambulance contacts',
    priority: 1,
    status: 'Active',
  },
  {
    id: '2',
    typeName: 'Fire Department',
    description: 'Fire station and fire safety contacts',
    priority: 2,
    status: 'Active',
  },
  {
    id: '3',
    typeName: 'Police',
    description: 'Local police station contacts',
    priority: 3,
    status: 'Active',
  },
  {
    id: '4',
    typeName: 'Cyber Crime',
    description: 'Cyber crime cell contacts',
    priority: 4,
    status: 'Active',
  },
  {
    id: '5',
    typeName: 'Women Safety',
    description: 'Women helpline and safety contacts',
    priority: 5,
    status: 'Active',
  },
];

export const helplines: Helpline[] = [
  {
    id: '1',
    helplineName: "Women's Helpline",
    department: 'ICC Cell',
    contactNumber: '1800-111-111',
    alternateNumber: '9876500001',
    email: 'icc@university.edu',
    availability: '24/7',
    description: 'Internal Complaints Committee helpline for women safety',
    status: 'Active',
  },
  {
    id: '2',
    helplineName: 'Medical Emergency',
    department: 'University Health Centre',
    contactNumber: '1800-222-222',
    alternateNumber: '9876500002',
    email: 'health@university.edu',
    availability: '24/7',
    description: 'Campus medical emergency and ambulance service',
    status: 'Active',
  },
  {
    id: '3',
    helplineName: 'Fire Station',
    department: 'Safety Cell',
    contactNumber: '101',
    alternateNumber: '9876500003',
    email: 'safety@university.edu',
    availability: '24/7',
    description: 'Local fire station connected with campus safety team',
    status: 'Active',
  },
  {
    id: '4',
    helplineName: 'Security Office',
    department: 'Security Department',
    contactNumber: '1800-333-333',
    alternateNumber: '9876500004',
    email: 'security@university.edu',
    availability: '24/7',
    description: 'University security control room',
    status: 'Active',
  },
  {
    id: '5',
    helplineName: 'Police (Campus)',
    department: 'External',
    contactNumber: '100',
    alternateNumber: '9876500005',
    email: '',
    availability: '24/7',
    description: 'Nearest police station emergency number',
    status: 'Active',
  },
  {
    id: '6',
    helplineName: 'Cyber Crime Cell',
    department: 'IT Department',
    contactNumber: '1930',
    alternateNumber: '9876500006',
    email: 'cybercrime@university.edu',
    availability: 'Mon-Sat 9AM-6PM',
    description:
      'Report cyber crimes including phishing, hacking, and online fraud',
    status: 'Active',
  },
  {
    id: '7',
    helplineName: 'Anti Ragging Helpline',
    department: 'Student Affairs',
    contactNumber: '1800-180-5522',
    alternateNumber: '9876500007',
    email: 'antiragging@university.edu',
    availability: '24/7',
    description:
      'National anti-ragging helpline integrated with campus committee',
    status: 'Active',
  },
  {
    id: '8',
    helplineName: 'Ambulance Service',
    department: 'University Health Centre',
    contactNumber: '108',
    alternateNumber: '9876500008',
    email: 'ambulance@university.edu',
    availability: '24/7',
    description: 'Campus ambulance and emergency transport service',
    status: 'Active',
  },
];

export const guidelines: Guideline[] = [
  {
    id: '1',
    title: 'Fire Safety Guidelines',
    category: 'Fire & Safety',
    department: 'All',
    description:
      'Comprehensive fire safety guidelines including evacuation procedures, fire extinguisher usage, and emergency contact protocols for all campus buildings.',
    pdfUrl: 'fire_safety.pdf',
    videoUrl: 'https://youtube.com/watch?v=fire-safety',
    applicableFor: 'All',
    effectiveDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Chemical Lab Safety Protocol',
    category: 'Lab Safety',
    department: 'Science',
    description:
      'Safety protocols for handling chemicals, wearing PPE, and emergency procedures in chemistry and biology laboratories.',
    pdfUrl: 'lab_safety.pdf',
    videoUrl: '',
    applicableFor: 'Employee',
    effectiveDate: '2024-02-01',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Hostel Safety Rules',
    category: 'Hostel Safety',
    department: 'Hostel Management',
    description:
      'Rules and safety guidelines for hostel residents including entry/exit timings, visitor policy, and emergency procedures.',
    pdfUrl: 'hostel_safety.pdf',
    videoUrl: '',
    applicableFor: 'Student',
    effectiveDate: '2024-01-01',
    status: 'Active',
  },
  {
    id: '4',
    title: 'Women Safety on Campus',
    category: 'Harassment Prevention',
    department: 'ICC Cell',
    description:
      'Comprehensive guide on women safety including anti-harassment policies, ICC procedures, and emergency contacts.',
    pdfUrl: 'women_safety.pdf',
    videoUrl: 'https://youtube.com/watch?v=women-safety',
    applicableFor: 'All',
    effectiveDate: '2024-01-01',
    status: 'Active',
  },
  {
    id: '5',
    title: 'Cyber Security Guidelines',
    category: 'Cyber Security',
    department: 'IT Department',
    description:
      'Guidelines on safe internet usage, password policies, phishing awareness, and reporting cyber incidents.',
    pdfUrl: 'cyber_security.pdf',
    videoUrl: 'https://youtube.com/watch?v=cyber-security',
    applicableFor: 'All',
    effectiveDate: '2024-03-01',
    status: 'Active',
  },
  {
    id: '6',
    title: 'Earthquake SOP',
    category: 'Natural Disaster',
    department: 'All',
    description:
      'Standard Operating Procedure for earthquake emergencies including drop-cover-hold protocol, evacuation, and assembly points.',
    pdfUrl: 'earthquake_sop.pdf',
    videoUrl: '',
    applicableFor: 'All',
    effectiveDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: '7',
    title: 'Emergency Evacuation Plan',
    category: 'Fire & Safety',
    department: 'All',
    description:
      'Campus-wide emergency evacuation plan with floor maps, assembly points, and warden responsibilities.',
    pdfUrl: 'evacuation_plan.pdf',
    videoUrl: 'https://youtube.com/watch?v=evacuation',
    applicableFor: 'All',
    effectiveDate: '2024-01-01',
    status: 'Active',
  },
];

export const awarenessPrograms: AwarenessProgram[] = [
  {
    id: '1',
    programName: 'Annual Fire Drill 2024',
    description:
      'Campus-wide fire drill to test evacuation procedures and train staff and students on fire safety protocols.',
    speaker: 'Fire Officer Suresh Nair',
    venue: 'Main Ground',
    date: '2024-07-20',
    time: '10:00 AM',
    department: 'All Departments',
    audience: 'All Staff & Students',
    attachments: 'fire_drill_schedule.pdf',
    status: 'Upcoming',
  },
  {
    id: '2',
    programName: 'Cyber Awareness Week',
    description:
      'Week-long awareness sessions on cyber threats, safe internet usage, and reporting mechanisms.',
    speaker: 'Dr. Priya Menon (IT)',
    venue: 'Seminar Hall A',
    date: '2024-07-15',
    time: '2:00 PM',
    department: 'All Departments',
    audience: 'All Students & Faculty',
    attachments: 'cyber_awareness.pdf',
    status: 'Upcoming',
  },
  {
    id: '3',
    programName: 'First Aid Workshop',
    description:
      'Hands-on first aid training including CPR, wound care, and basic life support techniques.',
    speaker: 'Dr. Ravi Shankar (Health Centre)',
    venue: 'Medical Room',
    date: '2024-06-10',
    time: '11:00 AM',
    department: 'All Departments',
    audience: 'Faculty & Staff',
    attachments: '',
    status: 'Completed',
  },
  {
    id: '4',
    programName: 'Women Safety Awareness',
    description:
      'Awareness session on self-defense, reporting mechanisms, and ICC procedures for women safety.',
    speaker: 'Advocate Meena Joshi',
    venue: 'Auditorium',
    date: '2024-06-25',
    time: '3:00 PM',
    department: 'All Departments',
    audience: 'All Women Students & Staff',
    attachments: 'women_safety_ppt.pdf',
    status: 'Completed',
  },
  {
    id: '5',
    programName: 'Disaster Management Training',
    description:
      'Comprehensive disaster management training covering earthquake, flood, and fire response procedures.',
    speaker: 'District Disaster Officer',
    venue: 'Conference Hall',
    date: '2024-08-05',
    time: '9:00 AM',
    department: 'Administration',
    audience: 'Security Staff & Wardens',
    attachments: 'disaster_training.pdf',
    status: 'Upcoming',
  },
];

export const incidents: Incident[] = [
  {
    id: '1',
    incidentId: 'INC-2024-001',
    reportedBy: 'Anjali Sharma',
    reporterRole: 'Student',
    reporterDept: 'Computer Science',
    category: 'Harassment',
    incidentType: 'Ragging',
    location: 'Boys Hostel Corridor',
    building: 'Boys Hostel A',
    priority: 'High',
    severity: 'Major',
    assignedTo: 'Officer Rajesh Kumar',
    incidentDate: '2024-06-28',
    incidentTime: '08:30 PM',
    reportedDate: '2024-06-28',
    status: 'Under Investigation',
    description:
      'Senior students were reportedly forcing juniors to perform humiliating tasks in the hostel corridor after lights-out time.',
    evidence: 'CCTV footage, witness statements',
    investigationNotes:
      'Spoke to 4 witnesses. CCTV footage retrieved and under review.',
    resolutionNotes: '',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Anjali Sharma',
        date: '2024-06-28 08:45 PM',
        remarks: 'Reported via mobile app.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-28 09:00 PM',
        remarks: 'Assigned to Officer Rajesh Kumar for urgent investigation.',
      },
      {
        action: 'investigating',
        actor: 'Officer Rajesh Kumar',
        date: '2024-06-29 10:00 AM',
        remarks: 'Investigation commenced. Witness statements collected.',
      },
    ],
  },
  {
    id: '2',
    incidentId: 'INC-2024-002',
    reportedBy: 'Prof. Ramesh Gupta',
    reporterRole: 'Employee',
    reporterDept: 'Physics',
    category: 'Theft & Robbery',
    incidentType: 'Mobile/Laptop Theft',
    location: 'Computer Lab A',
    building: 'Engineering Block',
    priority: 'Medium',
    severity: 'Moderate',
    assignedTo: 'Officer Priya Sharma',
    incidentDate: '2024-06-25',
    incidentTime: '02:00 PM',
    reportedDate: '2024-06-25',
    status: 'Resolved',
    description:
      'A Dell laptop went missing from Computer Lab A. It was left unattended during lunch break.',
    evidence: 'Lab attendance register',
    investigationNotes: 'Reviewed CCTV and identified the individual.',
    resolutionNotes:
      'Laptop recovered from the identified student. Counseling done.',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Prof. Ramesh Gupta',
        date: '2024-06-25 02:15 PM',
        remarks: 'Reported theft of laptop from lab.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-25 02:30 PM',
        remarks: 'Assigned to Officer Priya Sharma.',
      },
      {
        action: 'investigating',
        actor: 'Officer Priya Sharma',
        date: '2024-06-25 03:00 PM',
        remarks: 'CCTV reviewed, suspect identified.',
      },
      {
        action: 'action_taken',
        actor: 'Officer Priya Sharma',
        date: '2024-06-26 10:00 AM',
        remarks: 'Student called for inquiry.',
      },
      {
        action: 'resolved',
        actor: 'Officer Priya Sharma',
        date: '2024-06-26 12:00 PM',
        remarks: 'Laptop recovered and returned to complainant.',
      },
    ],
  },
  {
    id: '3',
    incidentId: 'INC-2024-003',
    reportedBy: 'Vikram Nair',
    reporterRole: 'Student',
    reporterDept: 'Mechanical Engineering',
    category: 'Cyber Security',
    incidentType: 'Phishing Attack',
    location: 'Library Reading Room',
    building: 'Library Block',
    priority: 'Critical',
    severity: 'Critical',
    assignedTo: 'Officer Amit Singh',
    incidentDate: '2024-06-30',
    incidentTime: '11:00 AM',
    reportedDate: '2024-06-30',
    status: 'Open',
    description:
      'Received suspicious emails asking for university login credentials, impersonating IT department.',
    evidence: 'Screenshot of phishing email',
    investigationNotes: '',
    resolutionNotes: '',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Vikram Nair',
        date: '2024-06-30 11:15 AM',
        remarks: 'Reported suspicious phishing email.',
      },
    ],
  },
  {
    id: '4',
    incidentId: 'INC-2024-004',
    reportedBy: 'Meena Verma',
    reporterRole: 'Employee',
    reporterDept: 'Administration',
    category: 'Fire & Safety',
    incidentType: 'Fire Outbreak',
    location: 'Cafeteria',
    building: 'Main Academic Block',
    priority: 'Critical',
    severity: 'Major',
    assignedTo: 'Officer Sunita Devi',
    incidentDate: '2024-06-20',
    incidentTime: '01:30 PM',
    reportedDate: '2024-06-20',
    status: 'Closed',
    description:
      'Small fire broke out in the cafeteria kitchen due to a gas leak. Fire was contained quickly.',
    evidence: 'Fire department report, photos',
    investigationNotes: 'Gas cylinder valve was faulty. Contractor identified.',
    resolutionNotes: 'Gas supply shut off, fire extinguished, area sanitized.',
    closureNotes:
      'New gas cylinders installed. Staff re-trained on fire safety.',
    timeline: [
      {
        action: 'reported',
        actor: 'Meena Verma',
        date: '2024-06-20 01:35 PM',
        remarks: 'Reported fire in cafeteria kitchen.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-20 01:40 PM',
        remarks: 'Assigned to Officer Sunita Devi. Fire department called.',
      },
      {
        action: 'investigating',
        actor: 'Officer Sunita Devi',
        date: '2024-06-20 02:00 PM',
        remarks: 'Scene secured. Fire department on site.',
      },
      {
        action: 'action_taken',
        actor: 'Officer Sunita Devi',
        date: '2024-06-20 02:30 PM',
        remarks: 'Fire extinguished. Gas supply disconnected.',
      },
      {
        action: 'resolved',
        actor: 'Officer Sunita Devi',
        date: '2024-06-20 04:00 PM',
        remarks: 'Area cleared and declared safe.',
      },
      {
        action: 'closed',
        actor: 'Security Admin Priya',
        date: '2024-06-21 10:00 AM',
        remarks: 'All corrective actions completed. Case closed.',
      },
    ],
  },
  {
    id: '5',
    incidentId: 'INC-2024-005',
    reportedBy: 'Ravi Shankar',
    reporterRole: 'Student',
    reporterDept: 'Electronics',
    category: 'Physical Security',
    incidentType: 'Unauthorized Entry',
    location: 'Parking Area',
    building: 'Administrative Block',
    priority: 'Medium',
    severity: 'Minor',
    assignedTo: 'Officer Ravi Verma',
    incidentDate: '2024-06-27',
    incidentTime: '07:00 PM',
    reportedDate: '2024-06-27',
    status: 'Assigned',
    description:
      'Unknown person seen loitering in the parking area after 7 PM without university ID.',
    evidence: 'CCTV footage',
    investigationNotes: '',
    resolutionNotes: '',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Ravi Shankar',
        date: '2024-06-27 07:15 PM',
        remarks: 'Reported suspicious person near parking.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-27 07:20 PM',
        remarks: 'Assigned to Officer Ravi Verma for patrolling.',
      },
    ],
  },
  {
    id: '6',
    incidentId: 'INC-2024-006',
    reportedBy: 'Sunita Rao',
    reporterRole: 'Employee',
    reporterDept: 'Chemistry',
    category: 'Harassment',
    incidentType: 'Sexual Harassment',
    location: 'Chemistry Lab',
    building: 'Science Block',
    priority: 'High',
    severity: 'Major',
    assignedTo: 'Officer Priya Sharma',
    incidentDate: '2024-06-29',
    incidentTime: '03:00 PM',
    reportedDate: '2024-06-29',
    status: 'Action Taken',
    description:
      'Employee reported harassment incident by a senior colleague in the chemistry lab.',
    evidence: 'Written complaint, witness statement',
    investigationNotes:
      'ICC committee convened. Both parties counseled separately.',
    resolutionNotes: 'Disciplinary committee meeting scheduled.',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Sunita Rao',
        date: '2024-06-29 03:30 PM',
        remarks: 'Formal complaint lodged with ICC.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-29 04:00 PM',
        remarks: 'Assigned to Officer Priya Sharma with ICC involvement.',
      },
      {
        action: 'investigating',
        actor: 'Officer Priya Sharma',
        date: '2024-06-30 09:00 AM',
        remarks: 'Both parties interviewed.',
      },
      {
        action: 'action_taken',
        actor: 'Officer Priya Sharma',
        date: '2024-06-30 11:00 AM',
        remarks: 'Disciplinary action initiated against the accused.',
      },
    ],
  },
  {
    id: '7',
    incidentId: 'INC-2024-007',
    reportedBy: 'Amit Sharma',
    reporterRole: 'Student',
    reporterDept: 'Computer Science',
    category: 'Theft & Robbery',
    incidentType: 'Mobile/Laptop Theft',
    location: 'Library Reading Room',
    building: 'Library Block',
    priority: 'Medium',
    severity: 'Moderate',
    assignedTo: 'Officer Rajesh Kumar',
    incidentDate: '2024-06-30',
    incidentTime: '10:00 AM',
    reportedDate: '2024-06-30',
    status: 'Assigned',
    description:
      'My iPhone 13 went missing from my study desk in the Library Reading Room while I stepped out for 5 minutes.',
    evidence: 'None',
    investigationNotes: '',
    resolutionNotes: '',
    closureNotes: '',
    timeline: [
      {
        action: 'reported',
        actor: 'Amit Sharma',
        date: '2024-06-30 10:15 AM',
        remarks: 'Reported phone theft.',
      },
      {
        action: 'assigned',
        actor: 'Security Admin Priya',
        date: '2024-06-30 10:30 AM',
        remarks: 'Assigned to Officer Rajesh Kumar.',
      },
    ],
  },
];

// Derived statistics for dashboards
export const incidentStats = {
  total: incidents.length,
  open: incidents.filter(i => i.status === 'Open').length,
  assigned: incidents.filter(i => i.status === 'Assigned').length,
  underInvestigation: incidents.filter(i => i.status === 'Under Investigation')
    .length,
  actionTaken: incidents.filter(i => i.status === 'Action Taken').length,
  resolved: incidents.filter(i => i.status === 'Resolved').length,
  closed: incidents.filter(i => i.status === 'Closed').length,
  highPriority: incidents.filter(
    i => i.priority === 'High' || i.priority === 'Critical'
  ).length,
  todayIncidents: incidents.filter(i => i.reportedDate === '2024-06-30').length,
};
