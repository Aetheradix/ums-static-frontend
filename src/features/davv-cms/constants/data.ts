import {
  GraduationCap,
  Search,
  FileText,
  Calendar,
  UserCheck,
  Download,
  Megaphone,
  PhoneCall,
  Building2,
  Users,
  BookOpen,
  Compass,
  Layers,
  FlaskConical,
  Briefcase,
  Lightbulb,
  Globe,
  Headset,
  CreditCard,
} from 'lucide-react';

export const TOPBAR_LINKS = [
  { label: 'Student Login', href: '#' },
  { label: 'Staff Login', href: '#' },
  { label: 'Alumni', href: '#' },
  { label: 'Webmail', href: '#' },
  { label: 'Career', href: '#' },
];

export const NAV_LINKS = [
  {
    label: 'About DAVV',
    items: [
      { label: 'Overview', href: '#' },
      { label: 'History', href: '#' },
      { label: 'Vice Chancellor', href: '#' },
    ],
  },
  {
    label: 'Admissions',
    items: [
      { label: 'UG Admissions', href: '#' },
      { label: 'PG Admissions', href: '#' },
      { label: 'PhD Admissions', href: '#' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { label: 'Programmes offered', href: '#' },
      { label: 'Academic Calendar', href: '#' },
      { label: 'NEP 2020 Guidelines', href: '#' },
    ],
  },
  {
    label: 'Departments',
    items: [
      { label: 'School of Computer Science', href: '#' },
      { label: 'Institute of Engineering & Tech (IET)', href: '#' },
      { label: 'School of Commerce', href: '#' },
    ],
  },
  {
    label: 'Research',
    items: [
      { label: 'Research Centers', href: '#' },
      { label: 'Publications', href: '#' },
      { label: 'Patents', href: '#' },
    ],
  },
  {
    label: 'Examinations',
    items: [
      { label: 'Exam Schedule', href: '#' },
      { label: 'Results Portal', href: '#' },
      { label: 'Grievance Form', href: '#' },
    ],
  },
  {
    label: 'Students',
    items: [
      { label: 'Student Union', href: '#' },
      { label: 'Hostels', href: '#' },
      { label: 'Anti-Ragging cell', href: '#' },
    ],
  },
];

export const QUICK_LINKS = [
  {
    label: 'Admissions',
    icon: GraduationCap,
    href: '#',
  },
  {
    label: 'Results',
    icon: Search,
    href: '#',
  },
  {
    label: 'Exam Form',
    icon: FileText,
    href: '#',
  },
  {
    label: 'Time Table',
    icon: Calendar,
    href: '#',
  },
  {
    label: 'Student Login',
    icon: UserCheck,
    href: '#',
  },
  {
    label: 'Downloads',
    icon: Download,
    href: '#',
  },
  {
    label: 'Notice Board',
    icon: Megaphone,
    href: '#',
  },
  {
    label: 'Contact Us',
    icon: PhoneCall,
    href: '#',
  },
];

export const ANNOUNCEMENTS = [
  {
    category: 'Admission',
    tag: 'Important',
    tagColor: 'bg-red-600 text-white',
    title: 'Admission open for various UG, PG & Diploma Programs 2024-25',
    date: '20 May 2024',
  },
  {
    category: 'Examination',
    tag: 'Examination',
    tagColor: 'bg-blue text-white',
    title: 'Time Table for UG/PG Even Semester Exams May-June 2024',
    date: '18 May 2024',
  },
  {
    category: 'Admission',
    tag: 'Admission',
    tagColor: 'bg-emerald-600 text-white',
    title: 'CUET (UG) Counselling Schedule Released',
    date: '17 May 2024',
  },
  {
    category: 'Circular',
    tag: 'Circular',
    tagColor: 'bg-orange-500 text-white',
    title: 'Holiday Notice on account of University Foundation Day',
    date: '15 May 2024',
  },
  {
    category: 'Tender',
    tag: 'Tender',
    tagColor: 'bg-indigo-600 text-white',
    title: 'Tender invited for Supply of Lab Equipment in IET',
    date: '12 May 2024',
  },
  {
    category: 'Events',
    tag: 'Events',
    tagColor: 'bg-purple-600 text-white',
    title: 'National Level Seminar on NEP 2020 Implementations',
    date: '10 May 2024',
  },
];

export const IMPORTANT_LINKS = [
  { label: 'NIRF', href: '#' },
  { label: 'Academic Calendar', href: '#' },
  { label: 'Ordinances', href: '#' },
  { label: 'Syllabus', href: '#' },
  { label: 'Affiliated Colleges', href: '#' },
  { label: 'IQAC', href: '#' },
  { label: 'Tender / Quotations', href: '#' },
];

export const GLANCE_STATS = [
  {
    label: 'Affiliated Colleges',
    value: '250+',
    icon: Building2,
  },
  {
    label: 'Students',
    value: '2.5 Lakh+',
    icon: Users,
  },
  {
    label: 'Teaching Departments',
    value: '34',
    icon: BookOpen,
  },
  {
    label: 'Established',
    value: '1964',
    icon: Calendar,
  },
];

export const EXPLORE_CARDS = [
  {
    title: 'Campus Life',
    image: '/DAVV_Uni.jpg',
    icon: Compass,
  },
  {
    title: 'Departments',
    image: '/Davv_Gate.jpg',
    icon: Layers,
  },
  {
    title: 'Research',
    image: '/DAVV_Uni.jpg',
    icon: FlaskConical,
  },
  {
    title: 'Placements',
    image: '/Davv_Gate.jpg',
    icon: Briefcase,
  },
  {
    title: 'Innovation',
    image: '/DAVV_Uni.jpg',
    icon: Lightbulb,
  },
  {
    title: 'International Cell',
    image: '/Davv_Gate.jpg',
    icon: Globe,
  },
];

export const ADMISSION_STEPS = [
  {
    step: '1',
    title: 'Registration',
    description: 'Register online by filling the required details.',
  },
  {
    step: '2',
    title: 'Merit List',
    description: 'Merit list will be prepared based on eligibility.',
  },
  {
    step: '3',
    title: 'Counselling',
    description: 'Shortlisted candidates will be called for counselling.',
  },
  {
    step: '4',
    title: 'Document Verification',
    description: 'Verification of documents at university.',
  },
  {
    step: '5',
    title: 'Admission Confirmed',
    description: 'Pay fee & confirm your admission.',
  },
];

export const SERVICES_CARDS = [
  {
    label: 'ABC ID',
    icon: Globe,
    colorClass: 'bg-blue/5 text-blue border-blue-500/10',
  },
  {
    label: 'APAAR',
    icon: Users,
    colorClass: 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10',
  },
  {
    label: 'DigiLocker',
    icon: FileText,
    colorClass: 'bg-purple-500/5 text-purple-600 border-purple-500/10',
  },
  {
    label: 'e-Samadhan',
    icon: Headset,
    colorClass: 'bg-green-500/5 text-green-600 border-green-500/10',
  },
  {
    label: 'Grievance',
    icon: PhoneCall,
    colorClass: 'bg-orange-500/5 text-orange-600 border-orange-500/10',
  },
  {
    label: 'Library',
    icon: BookOpen,
    colorClass: 'bg-blue/5 text-blue border-blue-500/10',
  },
  {
    label: 'Online Fee Payment',
    icon: CreditCard,
    colorClass: 'bg-pink-500/5 text-pink-600 border-pink-500/10',
  },
];

export const NEWS_UPDATES = [
  {
    image: '/DAVV_Uni.jpg',
    title:
      'DAVV Signs MoU with Educational Institutions for Academic Collaboration',
    date: '19 May 2024',
  },
  {
    image: '/Davv_Gate.jpg',
    title:
      'National Conference on Emerging Trends in Science & Technology Concludes Successfully',
    date: '16 May 2024',
  },
  {
    image: '/DAVV_Uni.jpg',
    title: 'Workshop on NEP 2020 Implementation Organized at DAVV',
    date: '14 May 2024',
  },
];

export const UPCOMING_EVENTS = [
  {
    day: '25',
    month: 'May',
    title: 'International Yoga Day Celebration',
    location: 'University Campus',
  },
  {
    day: '05',
    month: 'Jun',
    title: 'Foundation Day Celebration',
    location: 'University Campus',
  },
  {
    day: '15',
    month: 'Jun',
    title: 'Convocation Ceremony 2024',
    location: 'DAVV Auditorium',
  },
  {
    day: '21',
    month: 'Jun',
    title: 'One Day Seminar on Research Methodology',
    location: 'University Campus',
  },
];
