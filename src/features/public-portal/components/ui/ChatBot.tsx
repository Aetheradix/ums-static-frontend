import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const SAMPLE_QUESTIONS = [
  { id: 'q1', question: 'What is Octagon ERP?', keyword: 'what is octagon' },
  { id: 'q2', question: 'What modules does it offer?', keyword: 'modules' },
  {
    id: 'q3',
    question: 'Is it suitable for large universities?',
    keyword: 'suitable',
  },
  {
    id: 'q4',
    question: 'How can I request a demo?',
    keyword: 'request a demo',
  },
  { id: 'q5', question: 'Who are your clients?', keyword: 'clients' },
];

const AUTO_RESPONSES: Record<string, string> = {
  'what is octagon':
    'Octagon ERP is a modern, comprehensive, and highly-integrated enterprise resource planning suite designed specifically for universities and educational institutions. It streamlines academics, administration, finance, and governance on a single unified platform.',
  modules:
    'Octagon offers 43+ enterprise modules categorized into Academics (Admissions, Alumni, Student Portal), Accounts & Finance (Bill Tracking, Supply Chain), Base Modules (User Management), Employee Services (Payroll, Recruitment, Leave), and Governance (Affiliation, File Tracking, Grievance).',
  suitable:
    'Yes, absolutely! Octagon ERP is built on a high-performance, secure, and scalable architecture. It is designed to handle thousands of concurrent users, complex academic configurations, and large-scale governance and administrative workflows.',
  'request a demo':
    'You can request a personalized demo by visiting our Contact Page and filling out the form, or by reaching out to us directly at hello@octagonerp.in. Our team will schedule a demo for your university within 24 hours!',
  clients:
    'We work with leading universities, colleges, and educational governing bodies across India, helping them transition from legacy paper processes to automated, paperless, and transparent workflows.',
  hello:
    'Hello! Welcome to Octagon ERP. How can I assist you today? Feel free to ask about our modules, pricing, or request a demo.',
  hi: 'Hi there! Welcome to Octagon ERP. How can I help you today?',
  hey: 'Hey! How can I help you learn more about Octagon ERP today?',
  price:
    'Pricing for Octagon ERP is tailored to the size of your institution and the specific modules you select. Please contact our sales team at hello@octagonerp.in or request a demo on our Contact page to get a detailed proposal.',
  cost: 'Pricing for Octagon ERP is tailored to the size of your institution and the specific modules you select. Please contact our sales team at hello@octagonerp.in or request a demo on our Contact page to get a detailed proposal.',
  admission:
    'Our Academic suite includes a complete Admission Admin Guide, Registration portal, and Student Portal to manage the entire student lifecycle from registration to enrollment.',
  security:
    'Octagon ERP features enterprise-grade security including role-based access control, encrypted database communication, audit trails for all actions, and regular security updates to protect student and institutional data.',
  contact:
    'You can contact us via email at hello@octagonerp.in, or by calling +91 755 123 4567. You can also visit our Contact Us page to send an direct message via our contact form.',
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hi! Welcome to Octagon ERP. I am your virtual assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${crypto.randomUUID()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate bot response after delay
    setTimeout(() => {
      const normalizedText = text.toLowerCase().trim();
      let matchedResponse = '';

      // Check for direct keyword matches
      for (const [key, val] of Object.entries(AUTO_RESPONSES)) {
        if (normalizedText.includes(key)) {
          matchedResponse = val;
          break;
        }
      }

      // Default fallback response
      if (!matchedResponse) {
        matchedResponse =
          "That's a great question! I'm an AI assistant. For specific inquiries or a personalized walkthrough, you can submit a query through our contact page or email us at hello@octagonerp.in. Would you like me to guide you to the contact form?";
      }

      const botMessage: Message = {
        id: `bot-${crypto.randomUUID()}`,
        sender: 'bot',
        text: matchedResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSampleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${crypto.randomUUID()}`,
        sender: 'bot',
        text: 'Chat reset. How else can I help you with Octagon ERP today?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999] font-sans flex flex-col items-end">
      {/* Tooltip badge above button */}
      {showTooltip && !isOpen && (
        <div className="absolute bottom-12 sm:bottom-16 right-0 bg-white text-navy text-[13px] font-semibold py-2 px-4 rounded-xl shadow-lg border border-blue/10 flex items-center gap-2 animate-float whitespace-nowrap">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue"></span>
          </span>
          Discuss with us!
          <button
            onClick={e => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-muted hover:text-navy transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={clsx(
          'w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-blue to-blue-dark text-white rounded-full shadow-glow flex items-center justify-center hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue/20',
          isOpen && 'rotate-90'
        )}
      >
        {isOpen ? (
          <X className="w-4 h-4 sm:w-6 sm:h-6" />
        ) : (
          <img
            src="/Chantbot.png"
            alt="Octagon AI Logo"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
          />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={clsx(
          'absolute bottom-12 sm:bottom-20 right-0 w-[calc(100vw-32px)] sm:w-[400px] h-[480px] sm:h-[550px] bg-white rounded-xl shadow-2xl border border-border/80 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right',
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue to-blue-dark p-3 sm:p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 relative shrink-0">
              <img
                src="/Chantbot.png"
                alt="Octagon AI Logo"
                className="w-5 h-5 sm:w-7 sm:h-7 object-contain"
              />
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-blue-dark"></span>
            </div>
            <div>
              <div className="font-display font-bold text-[13px] sm:text-sm tracking-wide flex items-center gap-1 sm:gap-1.5 leading-tight">
                Octagon AI Assistant
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-blue-100 opacity-90 block mt-0.5 sm:mt-0">
                Usually replies instantly
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1 sm:p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 sm:p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-aliceblue/60 space-y-4 no-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={clsx(
                'flex gap-3 max-w-[85%]',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              {/* Avatar */}
              <div
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                  msg.sender === 'user'
                    ? 'bg-blue-light border-blue/20 text-blue'
                    : 'bg-blue border-blue/20 text-white'
                )}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <img
                    src="/Chantbot.png"
                    alt="Octagon AI Logo"
                    className="w-5 h-5 object-contain"
                  />
                )}
              </div>

              {/* Message bubble */}
              <div className="space-y-1">
                <div
                  className={clsx(
                    'p-3 text-[13px] leading-relaxed rounded-xl shadow-card',
                    msg.sender === 'user'
                      ? 'bg-blue text-white rounded-tr-none font-medium'
                      : 'bg-white text-navy rounded-tl-none border border-border/40'
                  )}
                >
                  {msg.text}
                </div>
                <div
                  className={clsx(
                    'text-[9px] text-muted px-1',
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue border-blue/20 text-white">
                <img
                  src="/Chantbot.png"
                  alt="Octagon AI Logo"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="bg-white p-4 rounded-xl rounded-tl-none border border-border/40 flex items-center gap-1.5 shadow-card">
                <span
                  className="w-2 h-2 bg-blue/70 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-blue/70 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-blue/70 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sample Questions Area */}
        <div className="px-2 py-1.5 sm:px-3.5 sm:py-2 bg-white border-t border-border/60">
          <div className="flex items-center gap-1 mb-1 text-muted">
            <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase">
              Sample Questions
            </span>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-1.5 max-h-[70px] sm:max-h-[85px] overflow-y-auto no-scrollbar">
            {SAMPLE_QUESTIONS.map(q => (
              <button
                key={q.id}
                onClick={() => handleSampleQuestionClick(q.question)}
                className="text-[9px] sm:text-[10px] text-blue bg-blue-light border border-blue/10 hover:bg-blue hover:text-white rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 transition-all duration-200 text-left font-medium active:scale-[0.98]"
              >
                {q.question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-3 bg-white border-t border-border/80 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-3.5 py-2.5 text-[13px] bg-surface rounded-xl border border-border focus:outline-none focus:border-blue transition-colors placeholder:text-muted/70 text-navy font-medium"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-blue disabled:bg-blue/40 text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm hover:shadow-glow focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
