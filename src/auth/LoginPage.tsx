import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Home,
  Lock,
  Mail,
  Monitor,
  Shield,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from './useAuth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let angle = 0;

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isHoveredRef.current) {
        angle = (angle + (delta * 360) / 85000) % 360;
        if (containerRef.current) {
          containerRef.current.style.setProperty(
            '--rotation-angle',
            `${angle}deg`
          );
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Fallback: generic admin login (accepts any credentials)
    await login();
    setIsLoggingIn(false);
    navigate('/home');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="login-left">
          {/* Decorative Waves */}
          <svg
            className="login-left-waves"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-100,200 C150,150 200,350 450,250 C700,150 750,300 900,250"
              stroke="rgba(99, 102, 241, 0.08)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-100,300 C100,250 250,450 500,350 C750,250 700,450 900,400"
              stroke="rgba(99, 102, 241, 0.06)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M-100,150 C200,100 300,250 550,200 C800,150 850,250 950,200"
              stroke="rgba(99, 102, 241, 0.04)"
              strokeWidth="1"
              fill="none"
            />
          </svg>

          <Link to="/cms" className="home-icon-btn" title="Back to Website">
            <Home size={18} />
          </Link>

          <div className="left-content">
            <h1 className="left-content-title">
              Intelligent Operations.
              <span>Stronger Institutions.</span>
            </h1>
            <p className="left-content-desc">
              Unify every function of your university. Empower every
              stakeholder.
            </p>
          </div>

          <div className="orbit-section">
            <div
              className="orbit-container"
              ref={containerRef}
              onMouseEnter={() => {
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false;
              }}
            >
              {/* SVG connection lines and glowing dots */}
              <svg
                className="orbit-lines-svg"
                viewBox="0 0 600 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Guideline circles */}
                <circle
                  cx="300"
                  cy="300"
                  r="110"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="300"
                  cy="300"
                  r="135"
                  stroke="rgba(99, 102, 241, 0.16)"
                  strokeWidth="1"
                />

                {/* Card Path Guideline Circle - highly visible */}
                <circle
                  cx="300"
                  cy="300"
                  r="225"
                  stroke="rgba(99, 102, 241, 0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />

                {/* Radial lines (remain static) */}
                <line
                  x1="300"
                  y1="300"
                  x2="300"
                  y2="90"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="448"
                  y2="152"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="510"
                  y2="300"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="448"
                  y2="448"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="300"
                  y2="510"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="152"
                  y2="448"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="90"
                  y2="300"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="152"
                  y2="152"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Rotating group for dots only (rotates left/anticlockwise) */}
                <g className="orbit-rotating-group">
                  {/* Dots along lines - aligned exactly on the 110px circle border */}
                  <circle cx="300" cy="190" r="5" fill="#a855f7" />
                  <circle cx="378" cy="222" r="5" fill="#06b6d4" />
                  <circle cx="410" cy="300" r="5" fill="#84cc16" />
                  <circle cx="378" cy="378" r="5" fill="#f59e0b" />
                  <circle cx="300" cy="410" r="5" fill="#ff5219" />
                  <circle cx="222" cy="378" r="5" fill="#ec4899" />
                  <circle cx="190" cy="300" r="5" fill="#f43f5e" />
                  <circle cx="222" cy="222" r="5" fill="#3b82f6" />
                </g>
              </svg>

              <div className="orbit-center">
                <img src="/images/Octagon.png" alt="Octagon logo" />
              </div>

              <div className="orbit-rotator">
                <div className="orbit-card card-academics">
                  <div className="orbit-card-icon">
                    <BookOpen size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Academic Center</span>
                    <span className="orbit-card-desc">
                      Core syllabus and
                      <br />
                      programs
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-student">
                  <div className="orbit-card-icon">
                    <Monitor size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Student Services</span>
                    <span className="orbit-card-desc">
                      Student portal and
                      <br />
                      services
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-admissions">
                  <div className="orbit-card-icon">
                    <Shield size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Governance</span>
                    <span className="orbit-card-desc">
                      Policies, rules and
                      <br />
                      compliance
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-examinations">
                  <div className="orbit-card-icon">
                    <FileText size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Examination Hub</span>
                    <span className="orbit-card-desc">
                      Scheduling, grading
                      <br />
                      and results
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-finance">
                  <div className="orbit-card-icon finance-rupee-icon">
                    <span>₹</span>
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Finance</span>
                    <span className="orbit-card-desc">
                      Fees, billing and
                      <br />
                      accounts
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-analytics">
                  <div className="orbit-card-icon">
                    <Globe size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Auxiliary Services</span>
                    <span className="orbit-card-desc">
                      Hostels, transport
                      <br />
                      and library
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-hr">
                  <div className="orbit-card-icon">
                    <Users size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">HRMS</span>
                    <span className="orbit-card-desc">
                      Staff directory and
                      <br />
                      payroll
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-attendance">
                  <div className="orbit-card-icon">
                    <Building size={16} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Campus Facilities</span>
                    <span className="orbit-card-desc">
                      Classrooms, labs and
                      <br />
                      facilities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <Building size={16} />
                </div>
                <div className="stat-info-wrapper">
                  <span className="stat-value">25+</span>
                  <span className="stat-label">Universities</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <Users size={16} />
                </div>
                <div className="stat-info-wrapper">
                  <span className="stat-value">5 Lakh+</span>
                  <span className="stat-label">Users</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <Activity size={16} />
                </div>
                <div className="stat-info-wrapper">
                  <span className="stat-value">1 Crore+</span>
                  <span className="stat-label">Transactions</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper">
                  <ShieldCheck size={16} />
                </div>
                <div className="stat-info-wrapper">
                  <span className="stat-value">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="right-header">
            <div className="language-dropdown">
              <Globe size={14} />
              <span>English (US)</span>
            </div>
          </div>

          <div className="login-form-container">
            <div className="login-form-wrapper">
              <div className="right-logo-section">
                <img src="/images/Octagon_Login_Logo.png" alt="Octagon Logo" />
              </div>

              {isForgotPassword ? (
                <>
                  <h2 className="form-heading">Forgot Password</h2>
                  <p className="form-subtitle">Recover Your Account Access</p>

                  {!emailSent ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        setEmailSent(true);
                      }}
                    >
                      <div className="input-group">
                        <label htmlFor="email">Registered Email Address</label>
                        <div className="input-wrapper">
                          <span className="input-icon">
                            <Mail size={16} />
                          </span>
                          <input
                            id="email"
                            type="email"
                            className="custom-input"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      <button type="submit" className="signin-btn">
                        <span>Send Reset Link</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  ) : (
                    <div
                      className="success-state-container"
                      style={{ textAlign: 'center', padding: '20px 0' }}
                    >
                      <div
                        className="success-icon-badge"
                        style={{
                          display: 'inline-flex',
                          padding: '16px',
                          background: '#ecfdf5',
                          borderRadius: '50%',
                          marginBottom: '16px',
                        }}
                      >
                        <ShieldCheck size={32} color="#10b981" />
                      </div>
                      <h3
                        className="success-state-title"
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#1e293b',
                          marginBottom: '8px',
                        }}
                      >
                        Check Your Email
                      </h3>
                      <p
                        className="success-state-desc"
                        style={{
                          fontSize: '0.875rem',
                          color: '#64748b',
                          lineHeight: 1.6,
                        }}
                      >
                        If the email <strong>{email}</strong> exists in our
                        system, we have sent a secure link to reset your
                        password.
                      </p>
                    </div>
                  )}

                  <div
                    className="signup-footer"
                    style={{ marginTop: '24px', textAlign: 'center' }}
                  >
                    <a
                      href="#"
                      className="help-link"
                      onClick={e => {
                        e.preventDefault();
                        setIsForgotPassword(false);
                        setEmailSent(false);
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <ArrowLeft size={16} />
                        Back to Login
                      </span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="form-heading">Welcome back 👋</h2>
                  <p className="form-subtitle">
                    Sign in to access your OCTAGON ERP account
                  </p>

                  <form onSubmit={handleLogin}>
                    <div className="input-group">
                      <label htmlFor="username">Username</label>
                      <div className="input-wrapper">
                        <span className="input-icon">
                          <User size={16} />
                        </span>
                        <input
                          id="username"
                          className="custom-input"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <span className="input-icon">
                          <Lock size={16} />
                        </span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="custom-input"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-options">
                      <div className="remember-wrap">
                        <input type="checkbox" id="RememberMe" defaultChecked />
                        <label htmlFor="RememberMe">Remember me</label>
                      </div>
                      <a
                        href="#"
                        className="forgot-password"
                        onClick={e => {
                          e.preventDefault();
                          setIsForgotPassword(true);
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="signin-btn"
                      disabled={isLoggingIn}
                    >
                      <span>{isLoggingIn ? 'Signing in...' : 'Sign in'}</span>
                      {!isLoggingIn && <ArrowRight size={16} />}
                    </button>
                  </form>

                  <div className="divider">OR</div>

                  <a href="#" className="sso-btn">
                    <Shield size={16} />
                    <span>Sign in with University SSO</span>
                  </a>
                </>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
