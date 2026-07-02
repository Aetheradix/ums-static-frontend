import TransportHeroBanner from '../../assets/transport_hero_banner.png';
import TransportPortalCard from './components/TransportPortalCard';

export default function TransportManagementPortalPage() {
  return (
    <div className="w-full flex-1 px-4 md:px-8 py-6 max-w-[1440px] mx-auto">
      {/* ── HERO CARD ── */}
      <div className="transport-hero-shimmer relative w-full overflow-hidden rounded-[2rem] shadow-2xl mb-8 border border-slate-800/60 bg-slate-900">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={TransportHeroBanner}
            alt="Transport Fleet"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-800/50" />
        </div>

        {/* Animated Dotted Route SVG (right side decoration) */}
        <svg
          className="absolute right-0 top-0 h-full w-auto opacity-20 pointer-events-none"
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main route line */}
          <path
            className="transport-route-line"
            d="M 400 50 C 300 80, 280 120, 200 140 S 100 160, 80 200 S 60 270, 0 300"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="8 6"
            fill="none"
          />
          {/* Stop circles */}
          {[
            { cx: 330, cy: 70 },
            { cx: 200, cy: 140 },
            { cx: 95, cy: 195 },
            { cx: 40, cy: 280 },
          ].map((p, i) => (
            <g key={i}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r="10"
                fill="rgba(245,158,11,0.25)"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <circle cx={p.cx} cy={p.cy} r="4" fill="#f59e0b" />
            </g>
          ))}
          {/* Moving bus dot */}
          <circle r="5" fill="#fbbf24">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M 400 50 C 300 80, 280 120, 200 140 S 100 160, 80 200 S 60 270, 0 300"
            />
          </circle>
        </svg>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-[280px] md:min-h-[320px] px-8 md:px-14 py-10 w-full md:w-3/5">
          {/* Live status pill */}
          <div className="transport-status-bar mb-6">
            <div className="status-item">
              <span className="dot"></span>
              <span>Fleet Active</span>
              <span className="status-value">142</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="status-item">
              <span>Routes</span>
              <span className="status-value">45</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="status-item">
              <span>Students</span>
              <span className="status-value">12.5k</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Central <span className="text-amber-400">Transport</span> Hub
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-lg leading-relaxed">
            Monitor live fleets, configure university routes, and manage driver
            allocations across the entire institutional network.
          </p>
        </div>
      </div>

      {/* ── ACCESS PORTALS ── */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-6 w-1 rounded-full bg-amber-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Access Portals
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-7 ml-4">
          Select your administrative domain to configure operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="transport-portal-card-enter">
            <TransportPortalCard
              title="College Operations"
              description="Configure stops, map students to buses, and manage daily gate passes for your institute."
              icon="directions_bus"
              path="/transport-management/college-login"
            />
          </div>
          <div className="transport-portal-card-enter">
            <TransportPortalCard
              title="Student Services"
              description="Track bus locations live, apply for transport leave, and view your specific pickup details."
              icon="commute"
              path="/transport-management/student-login"
              badge="Live Tracking"
            />
          </div>
          <div className="transport-portal-card-enter">
            <TransportPortalCard
              title="Global Administration"
              description="Register transporters, manage vehicle insurance, and oversee global maintenance logs."
              icon="local_shipping"
              path="/transport-management/admin-login"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
