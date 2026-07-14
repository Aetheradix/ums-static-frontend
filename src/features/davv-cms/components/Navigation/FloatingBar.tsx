import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Video,
  Calendar as CalendarIcon,
  Share2,
  Palette,
  CheckCircle2,
  Play,
  Send,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ACTIONS = [
  {
    id: 'enquiry',
    label: 'Enquiry Chat',
    icon: MessageSquare,
    hoverBg: 'hover:bg-indigo-800 hover:border-indigo-800',
  },
  {
    id: 'tour',
    label: 'Virtual Tour',
    icon: Video,
    hoverBg: 'hover:bg-rose-800 hover:border-rose-800',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: CalendarIcon,
    hoverBg: 'hover:bg-[#054751] hover:border-[#054751]',
  },
  {
    id: 'share',
    label: 'Share Portal',
    icon: Share2,
    hoverBg: 'hover:bg-emerald-800 hover:border-emerald-800',
  },
  {
    id: 'accessibility',
    label: 'Theme Colors',
    icon: Palette,
    hoverBg: 'hover:bg-purple-800 hover:border-purple-800',
  },
];

const TOUR_VIDEOS = [
  {
    title: 'DAVV Main Campus (UTD)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    title: 'Central Library Walk',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    title: 'IET Engineering Block',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
];

const THEME_COLORS = [
  { name: 'Default Blue', hex: '#002147', dark: '#001833' },
  { name: 'Ocean Cyan', hex: '#054751', dark: '#022C33' }, // Ultra Deep Teal/Cyan
  { name: 'Royal Purple', hex: '#3B0764', dark: '#22033C' }, // Ultra Deep Purple
  { name: 'Forest Emerald', hex: '#064E3B', dark: '#022C22' }, // Ultra Deep Forest Green
  { name: 'Crimson Rose', hex: '#881337', dark: '#4C0519' }, // Ultra Deep Wine Red/Rose
  { name: 'Saffron Orange', hex: '#7C2D12', dark: '#431407' }, // Ultra Deep Rust/Saffron Orange
];

const DROPDOWN_WIDTHS: Record<string, string> = {
  enquiry: 'w-72 sm:w-[350px]',
  tour: 'w-72 sm:w-[320px]',
  calendar: 'w-72 sm:w-[320px]',
  share: 'w-64 sm:w-72',
  accessibility: 'w-64 sm:w-72',
};

// Key Calendar Events for 2026
const CALENDAR_EVENTS: Record<string, string> = {
  '2026-07-10': 'UG Sem Exams Begin',
  '2026-07-15': 'Registration Deadline',
  '2026-07-28': 'Declaration of Results',
  '2026-08-15': 'Independence Day (Holiday)',
  '2026-08-25': 'PhD Course Work Registration',
};

export default function FloatingBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Enquiry Chat State (Increased Size)
  const [messages, setMessages] = useState<
    Array<{ sender: 'bot' | 'user'; text: string }>
  >([
    {
      sender: 'bot',
      text: 'Namaskar! Welcome to DAVV Enquiry Desk. How can I help you today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Virtual Tour State
  const [activeVideoUrl, setActiveVideoUrl] = useState(TOUR_VIDEOS[0].url);
  const [playVideoImmediately, setPlayVideoImmediately] = useState(false);

  // Share State
  const [copied, setCopied] = useState(false);

  // Selected Theme State (Loaded from localStorage for persistence)
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('davv-cms-theme') || '#002147';
  });

  // Mini Interactive Calendar State
  const [calDate, setCalDate] = useState(new Date(2026, 6, 1)); // Default: July 2026
  const [selectedCalDateStr, setSelectedCalDateStr] = useState<string | null>(
    '2026-07-10'
  );

  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();

  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    setCalDate(new Date(calYear, calMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalDate(new Date(calYear, calMonth + 1, 1));
  };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleActionClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Initialize theme variables from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('davv-cms-theme') || '#002147';
    const savedThemeDark =
      localStorage.getItem('davv-cms-theme-dark') || '#001833';
    const style = document.documentElement.style;
    style.setProperty('--primary-color', savedTheme);
    style.setProperty('--primary-color-dark', savedThemeDark);
    style.setProperty('--color-primary', savedTheme);
  }, []);

  // Theme Switcher Logic (Saves to localStorage)
  const changeTheme = (hex: string, dark: string, name: string) => {
    document.documentElement.style.setProperty('--primary-color', hex);
    document.documentElement.style.setProperty('--primary-color-dark', dark);
    document.documentElement.style.setProperty('--color-primary', hex);
    setSelectedTheme(hex);
    localStorage.setItem('davv-cms-theme', hex);
    localStorage.setItem('davv-cms-theme-dark', dark);
    triggerToast(`Theme switched to ${name}!`);
  };

  // Chat message send logic
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: 'user' as const, text }];
    setMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let reply =
        'Thank you! Our support desk will get back to you shortly at enquiry@dauniv.ac.in.';
      const lower = text.toLowerCase();

      if (lower.includes('admission')) {
        reply =
          'Admission for UG/PG programs (2026-27) is open. Please check the Admission process stepper on the homepage.';
      } else if (
        lower.includes('exam') ||
        lower.includes('timetable') ||
        lower.includes('time table')
      ) {
        reply =
          'Timetables for even semesters (May-June 2026) are released. You can download the PDF under the Circulars category.';
      } else if (lower.includes('fee') || lower.includes('payment')) {
        reply =
          'Fee payments can be processed online through the student portal after logging in.';
      } else if (
        lower.includes('contact') ||
        lower.includes('phone') ||
        lower.includes('call')
      ) {
        reply =
          'You can reach the registrar desk at registrar@dauniv.ac.in or call us at +91 731 2527001.';
      }

      setMessages(prev => [...prev, { sender: 'bot' as const, text: reply }]);
    }, 600);
  };

  // Copy Link logic
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    triggerToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Render specific dropdown contents
  const renderDropdownContent = (id: string) => {
    switch (id) {
      case 'enquiry':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-800">
                  DAVV Enquiry Chat
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-slate-400">
                    Helpdesk Online
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Box (Increased size from h-40 to h-64) */}
            <div className="h-64 overflow-y-auto border border-slate-100 rounded-xl p-2.5 bg-slate-50 space-y-2 text-xs flex flex-col shadow-inner">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200/80 text-slate-700 rounded-tl-none shadow-3xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions Chips */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleSendMessage('Admission 2026')}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600 cursor-pointer transition-colors"
              >
                Admissions?
              </button>
              <button
                onClick={() => handleSendMessage('Exam Schedule')}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600 cursor-pointer transition-colors"
              >
                Exams?
              </button>
              <button
                onClick={() => handleSendMessage('Contact Details')}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600 cursor-pointer transition-colors"
              >
                Contact?
              </button>
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
              <input
                type="text"
                placeholder="Ask your query..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'tour':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-800">
                DAVV Campus Tour
              </h4>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Explore the vibrant campus life clips.
              </p>
            </div>

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video relative border border-slate-200">
              <video
                key={activeVideoUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay={playVideoImmediately}
                src={activeVideoUrl}
                poster="/davv-cms/crousel/Slide1.jpg"
              />
            </div>

            {/* Video List */}
            <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto pr-1">
              {TOUR_VIDEOS.map(v => (
                <button
                  key={v.url}
                  onClick={() => {
                    setActiveVideoUrl(v.url);
                    setPlayVideoImmediately(true);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer ${
                    activeVideoUrl === v.url
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Play className="w-3 h-3 shrink-0 fill-current" />
                  <span className="truncate">{v.title}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-2.5">
            {/* Calendar Header with Controls */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-sans font-bold text-xs text-slate-800 uppercase tracking-wider">
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() =>
                  triggerToast('Calendar PDF downloaded successfully!')
                }
                className="text-slate-400 hover:text-[#054751] transition-colors p-1 cursor-pointer"
                title="Download Calendar"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Month Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-600">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="text-slate-400 font-black py-0.5">
                  {d}
                </div>
              ))}

              {/* Blank spaces before the first day of the month */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="py-1" />
              ))}

              {/* Days in current month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvent = !!CALENDAR_EVENTS[dateStr];
                const isSelected = selectedCalDateStr === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => hasEvent && setSelectedCalDateStr(dateStr)}
                    className={`py-1 rounded-md transition-all flex flex-col items-center justify-center relative cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-[#054751] text-white font-black scale-105'
                        : hasEvent
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50'
                          : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{day}</span>
                    {hasEvent && !isSelected && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Event Description Card */}
            <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-left">
              {selectedCalDateStr && CALENDAR_EVENTS[selectedCalDateStr] ? (
                <div className="space-y-0.5">
                  <span className="block font-black text-[9px] text-[#054751] uppercase tracking-wider">
                    {new Date(selectedCalDateStr).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-bold text-slate-700 text-xs leading-snug block">
                    {CALENDAR_EVENTS[selectedCalDateStr]}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 font-semibold text-[10px] block text-center py-1.5">
                  Click a highlighted day (amber) to view events.
                </span>
              )}
            </div>
          </div>
        );

      case 'share':
        const pageUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(
          'Check out DAVV Centralized Access Portal'
        );
        return (
          <div className="space-y-3">
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-800">
                Share UMS Portal
              </h4>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Copy link or share directly to social networks.
              </p>
            </div>

            {/* Social Share Grid (With Official Brand Logos) */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${pageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-[10px] font-bold text-emerald-600 transition-colors"
              >
                {/* Official WhatsApp Logo SVG */}
                <svg
                  className="w-3.5 h-3.5 fill-current text-emerald-600"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.25 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.713-1.453L0 24zm6.59-4.846l.385.23a9.847 9.847 0 005.03 1.378h.005c5.602 0 10.158-4.56 10.162-10.168.002-2.717-1.054-5.271-2.973-7.191-1.92-1.92-4.47-2.973-7.186-2.975-5.607 0-10.164 4.56-10.168 10.168-.002 2.01.526 3.977 1.527 5.71l.25.434-1.002 3.661 3.75-.984zM17.47 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-[10px] font-bold text-blue-600 transition-colors"
              >
                {/* Official Facebook Logo SVG */}
                <svg
                  className="w-3.5 h-3.5 fill-current text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-[10px] font-bold text-indigo-600 transition-colors"
              >
                {/* Official LinkedIn Logo SVG */}
                <svg
                  className="w-3.5 h-3.5 fill-current text-indigo-600"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${pageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-700 transition-colors"
              >
                {/* Official Twitter/X Logo SVG */}
                <svg
                  className="w-3 h-3 fill-current text-slate-800"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Twitter / X</span>
              </a>
            </div>

            {/* Link Copy Box */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] text-slate-500 truncate select-all">
                {window.location.href}
              </div>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                title="Copy Link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="font-sans font-bold text-sm text-slate-800">
                Customize Theme
              </h4>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Switch accent color globally.
              </p>
            </div>

            {/* Colors Grid */}
            <div className="grid grid-cols-3 gap-2">
              {THEME_COLORS.map(color => (
                <button
                  key={color.hex}
                  onClick={() => changeTheme(color.hex, color.dark, color.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                    selectedTheme === color.hex
                      ? 'bg-purple-50 border-purple-300 text-purple-700 font-bold scale-[1.03]'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-3xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[9px] whitespace-nowrap">
                    {color.name.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Accessibility features info */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <Palette className="w-3.5 h-3.5 text-purple-500" />
              <span>Theme will persist across page panels.</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        /* Overrides for hardcoded Tailwind colors */
        .text-\\[\\#002147\\] {
          color: var(--primary-color) !important;
        }
        .bg-\\[\\#002147\\] {
          background-color: var(--primary-color) !important;
        }
        .border-\\[\\#002147\\] {
          border-color: var(--primary-color) !important;
        }
        .from-\\[\\#002147\\] {
          --tw-gradient-from: var(--primary-color) !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 33, 71, 0)) !important;
        }
        .via-\\[\\#002147\\] {
          --tw-gradient-stops: var(--tw-gradient-from), var(--primary-color) !important;
        }
        .to-\\[\\#002147\\] {
          --tw-gradient-to: var(--primary-color) !important;
        }

        /* Overrides for #001833 (darker primary color variant) */
        .text-\\[\\#001833\\] {
          color: var(--primary-color-dark) !important;
        }
        .bg-\\[\\#001833\\] {
          background-color: var(--primary-color-dark) !important;
        }
        .border-\\[\\#001833\\] {
          border-color: var(--primary-color-dark) !important;
        }
        
        /* Hover overrides */
        .hover\\:text-\\[\\#002147\\]:hover {
          color: var(--primary-color) !important;
        }
        .hover\\:bg-\\[\\#002147\\]:hover {
          background-color: var(--primary-color) !important;
        }
        
        /* Custom scrollbars matching theme color */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--primary-color);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--primary-color-dark);
        }
        
        /* Firefox support */
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--primary-color) #f1f5f9;
        }
      `}</style>

      <div
        ref={dropdownRef}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5 sm:gap-2 items-end select-none"
      >
        {ACTIONS.map(action => {
          const Icon = action.icon;
          const isDropdownOpen = activeDropdown === action.id;
          const activeClass = isDropdownOpen
            ? `text-white ${action.hoverBg.replace(/hover:/g, '')} border-transparent scale-105 shadow-lg`
            : `bg-white text-slate-600 border-slate-200/80 hover:text-white ${action.hoverBg}`;

          return (
            <div
              key={action.id}
              className="relative flex items-center justify-end"
            >
              {/* Dropdown panel (Dynamic Width mapping applied) */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-10 sm:right-13 top-1/2 -translate-y-1/2 mr-2.5 z-50 bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-200 cursor-default text-left ${DROPDOWN_WIDTHS[action.id] || 'w-64 sm:w-72'}`}
                  onClick={e => e.stopPropagation()} // Prevent click from bubbling and closing
                >
                  {renderDropdownContent(action.id)}
                </div>
              )}

              {/* Button */}
              <button
                onClick={e => handleActionClick(action.id, e)}
                className={`group flex items-center justify-center sm:justify-end h-8 sm:h-11 w-8 sm:w-auto shadow-md border border-r-0 rounded-l-lg sm:rounded-l-xl p-0 sm:pl-4 sm:pr-3.5 cursor-pointer transition-all duration-300 ease-in-out sm:max-w-[46px] sm:hover:max-w-[200px] outline-none ${activeClass}`}
              >
                <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-in-out font-sans font-bold text-xs uppercase tracking-wider whitespace-nowrap mr-0 group-hover:mr-2.5 opacity-0 group-hover:opacity-100">
                  {action.label}
                </span>
                <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-9999 flex items-center gap-2 bg-slate-900/95 border border-white/10 text-white px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 text-sm font-semibold backdrop-blur-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
