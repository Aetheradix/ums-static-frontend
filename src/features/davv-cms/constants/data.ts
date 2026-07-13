import {
  BookOpen,
  BookOpenCheck,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Compass,
  CreditCard,
  Download,
  FileText,
  FlaskConical,
  FlaskRound,
  Globe,
  GraduationCap,
  Headset,
  HeartHandshake,
  Hotel,
  Landmark,
  Layers,
  Library,
  Lightbulb,
  Megaphone,
  MessageSquare,
  Monitor,
  PhoneCall,
  School,
  ScrollText,
  Search,
  ShieldCheck,
  Trophy,
  UserCheck,
  UserRound,
  Users,
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
    label: 'About',
    megaMenu: true,
    columns: [
      {
        title: 'University',
        items: [
          { label: 'Overview', href: '#', icon: Landmark },
          { label: 'History', href: '#', icon: ScrollText },
          { label: 'Vice Chancellor', href: '#', icon: UserRound },
          { label: 'Campus Life', href: '#', icon: Building },
          { label: 'IQAC', href: '#', icon: Monitor },
        ],
      },
      {
        title: 'More',
        items: [
          { label: 'Affiliated Colleges', href: '#', icon: School },
          { label: 'NIRF', href: '#', icon: Trophy },
          { label: 'International Cell', href: '#', icon: Globe },
        ],
      },
    ],
  },
  {
    label: 'Admissions',
    megaMenu: true,
    columns: [
      {
        title: 'Programmes',
        items: [
          { label: 'UG Admissions', href: '#', icon: GraduationCap },
          { label: 'PG Admissions', href: '#', icon: GraduationCap },
          { label: 'PhD Admissions', href: '#', icon: FlaskRound },
          { label: 'Counselling Schedule', href: '#', icon: Calendar },
        ],
      },
      {
        title: 'Student Services',
        items: [
          { label: 'ABC ID', href: '#', icon: UserCheck },
          { label: 'DigiLocker', href: '#', icon: FileText },
          { label: 'Online Fee Payment', href: '#', icon: CreditCard },
          { label: 'Scholarships', href: '#', icon: HeartHandshake },
        ],
      },
    ],
  },
  {
    label: 'Academics & Research',
    megaMenu: true,
    columns: [
      {
        title: 'Academics',
        items: [
          { label: 'Programmes Offered', href: '#', icon: BookOpenCheck },
          { label: 'Academic Calendar', href: '#', icon: Calendar },
          { label: 'NEP 2020 Guidelines', href: '#', icon: ScrollText },
          { label: 'Syllabus', href: '#', icon: BookOpen },
          { label: 'Ordinances', href: '#', icon: ScrollText },
        ],
      },
      {
        title: 'Departments',
        items: [
          { label: 'School of Computer Science', href: '#', icon: Monitor },
          {
            label: 'Institute of Engineering & Tech (IET)',
            href: '#',
            icon: Building2,
          },
          { label: 'School of Commerce', href: '#', icon: Briefcase },
        ],
      },
      {
        title: 'Research',
        items: [
          { label: 'Research Centers', href: '#', icon: FlaskConical },
          { label: 'Publications', href: '#', icon: FileText },
          { label: 'Patents', href: '#', icon: Lightbulb },
          { label: 'Innovation Cell', href: '#', icon: Lightbulb },
        ],
      },
    ],
  },
  {
    label: 'Students',
    megaMenu: true,
    columns: [
      {
        title: 'Examinations',
        items: [
          { label: 'Exam Schedule', href: '#', icon: Calendar },
          { label: 'Results Portal', href: '#', icon: Search },
          { label: 'Grievance Form', href: '#', icon: MessageSquare },
          { label: 'Downloads', href: '#', icon: Download },
        ],
      },
      {
        title: 'Life at DAVV',
        items: [
          { label: 'Student Union', href: '#', icon: Users },
          { label: 'Hostels', href: '#', icon: Hotel },
          { label: 'Anti-Ragging Cell', href: '#', icon: ShieldCheck },
          { label: 'Library', href: '#', icon: Library },
        ],
      },
      {
        title: 'Support',
        items: [
          { label: 'e-Samadhan', href: '#', icon: Headset },
          { label: 'Grievance', href: '#', icon: MessageSquare },
          { label: 'Contact Us', href: '#', icon: PhoneCall },
        ],
      },
    ],
  },
];

export const QUICK_LINKS = [
  {
    label: 'Admissions',
    icon: GraduationCap,
    href: '#',
    colorClass: 'bg-blue/5 text-blue',
  },
  {
    label: 'Results',
    icon: Search,
    href: '#',
    colorClass: 'bg-emerald-500/5 text-emerald-600',
  },
  {
    label: 'Exam Form',
    icon: FileText,
    href: '#',
    colorClass: 'bg-purple-500/5 text-purple-600',
  },
  {
    label: 'Time Table',
    icon: Calendar,
    href: '#',
    colorClass: 'bg-amber-500/5 text-amber-600',
  },
  {
    label: 'Student Login',
    icon: UserCheck,
    href: '#',
    colorClass: 'bg-rose-500/5 text-rose-600',
  },
  {
    label: 'Downloads',
    icon: Download,
    href: '#',
    colorClass: 'bg-cyan-500/5 text-cyan-600',
  },
  {
    label: 'Notice Board',
    icon: Megaphone,
    href: '#',
    colorClass: 'bg-orange-500/5 text-orange-600',
  },
  {
    label: 'Grievance',
    icon: MessageSquare,
    href: '#',
    colorClass: 'bg-pink-500/5 text-pink-600',
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
  {
    category: 'Examination',
    tag: 'Examination',
    tagColor: 'bg-blue text-white',
    title: 'Result of B.Ed. & M.Ed. Semester Exams Declared',
    date: '08 May 2024',
  },
  {
    category: 'Circular',
    tag: 'Circular',
    tagColor: 'bg-orange-500 text-white',
    title: 'Revised Guidelines for PhD Course Work Registration',
    date: '05 May 2024',
  },
  {
    category: 'Events',
    tag: 'Events',
    tagColor: 'bg-purple-600 text-white',
    title: 'Youth Festival & Cultural Activities Registration Open',
    date: '02 May 2024',
  },
  {
    category: 'Tender',
    tag: 'Tender',
    tagColor: 'bg-indigo-600 text-white',
    title: 'E-Tender for Security Services at University Campus',
    date: '28 Apr 2024',
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
    cardBg: 'bg-blue-50/70 border-blue-100/80 hover:bg-blue-100/50',
    iconBg: 'bg-white text-blue-600 border-blue-200/60',
    textColor: 'text-blue-900',
  },
  {
    label: 'APAAR',
    icon: Users,
    cardBg: 'bg-emerald-50/70 border-emerald-100/80 hover:bg-emerald-100/50',
    iconBg: 'bg-white text-emerald-600 border-emerald-200/60',
    textColor: 'text-emerald-900',
  },
  {
    label: 'DigiLocker',
    icon: FileText,
    cardBg: 'bg-purple-50/70 border-purple-100/80 hover:bg-purple-100/50',
    iconBg: 'bg-white text-purple-600 border-purple-200/60',
    textColor: 'text-purple-900',
  },
  {
    label: 'e-Samadhan',
    icon: Headset,
    cardBg: 'bg-teal-50/70 border-teal-100/80 hover:bg-teal-100/50',
    iconBg: 'bg-white text-teal-600 border-teal-200/60',
    textColor: 'text-teal-900',
  },
  {
    label: 'Library',
    icon: BookOpen,
    cardBg: 'bg-amber-50/70 border-amber-100/80 hover:bg-amber-100/50',
    iconBg: 'bg-white text-amber-600 border-amber-200/60',
    textColor: 'text-amber-900',
  },
  {
    label: 'Online Fee Payment',
    icon: CreditCard,
    cardBg: 'bg-pink-50/70 border-pink-100/80 hover:bg-pink-100/50',
    iconBg: 'bg-white text-pink-600 border-pink-200/60',
    textColor: 'text-pink-900',
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
  {
    image: '/Davv_Gate.jpg',
    title: 'DAVV Athletics Team Wins State Championship Trophy',
    date: '10 May 2024',
  },
  {
    image: '/DAVV_Uni.jpg',
    title: 'Research Grant of 2 Crore Approved for Biotech Department',
    date: '08 May 2024',
  },
  {
    image: '/Davv_Gate.jpg',
    title: 'Campus Placement Drive: Highest Package of 24 LPA Offered',
    date: '05 May 2024',
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
  {
    day: '28',
    month: 'Jun',
    title: 'Alumni Meet 2024 - Reconnecting Hearts',
    location: 'IET Seminar Hall',
  },
  {
    day: '02',
    month: 'Jul',
    title: 'DAVV Science Exhibition & Project Expo',
    location: 'School of Physics',
  },
];
