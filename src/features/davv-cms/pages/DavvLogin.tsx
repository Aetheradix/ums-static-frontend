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
  Lock,
  Mail,
  Monitor,
  Shield,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from 'shared/context/useLanguage';
import './DavvLogin.css';
import { useAuth } from '../../../auth/useAuth';

export const DavvLogin: React.FC = () => {
  const { login } = useAuth();
  const { language, toggleLanguage } = useLanguage();
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
    <div className="davv-login-page-wrapper">
      <div className="davv-login-container">
        {/* LEFT PANEL */}
        <div className="davv-login-left">
          {/* Decorative Waves */}
          <svg
            className="davv-davv-login-left-waves"
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

          <div className="davv-left-content">
            <h1 className="davv-davv-left-content-title">
              Welcome to DAVV, Indore.
              <span>Centralized Portal.</span>
            </h1>
            <p className="davv-davv-left-content-desc">
              Devi Ahilya Vishwavidyalaya — one unified portal for college
              affiliation, legal cases, and access across the university.
            </p>
            <p className="davv-davv-left-content-motto">
              Dhiyo Yonah Prachodayat — May He inspire our intellect
            </p>
          </div>

          <div className="davv-orbit-section">
            <div
              className="davv-orbit-container"
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
                className="davv-orbit-lines-svg"
                viewBox="0 0 600 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Guideline circles */}
                <circle
                  cx="300"
                  cy="300"
                  r="110"
                  stroke="rgba(99, 102, 241, 0.08)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="300"
                  cy="300"
                  r="135"
                  stroke="rgba(99, 102, 241, 0.06)"
                  strokeWidth="1"
                />

                {/* Card Path Guideline Circle - highly visible */}
                <circle
                  cx="300"
                  cy="300"
                  r="225"
                  stroke="rgba(99, 102, 241, 0.15)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />

                {/* Radial lines (remain static) */}
                <line
                  x1="300"
                  y1="300"
                  x2="300"
                  y2="90"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="448"
                  y2="152"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="510"
                  y2="300"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="448"
                  y2="448"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="300"
                  y2="510"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="152"
                  y2="448"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="90"
                  y2="300"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="300"
                  y1="300"
                  x2="152"
                  y2="152"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Rotating group for dots only (rotates left/anticlockwise) */}
                <g className="davv-orbit-rotating-group">
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

              <div className="davv-orbit-center">
                <img src="/images/davv-logo.png" alt="DAVV logo" />
              </div>

              <div className="davv-orbit-rotator">
                <div className="davv-orbit-card davv-card-academics">
                  <div className="davv-davv-orbit-card-icon">
                    <BookOpen size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      College Affiliation
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Registration
                      <br />
                      and renewals
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-student">
                  <div className="davv-davv-orbit-card-icon">
                    <Monitor size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      Legal Cases
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Hearings and
                      <br />
                      judgments
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-admissions">
                  <div className="davv-davv-orbit-card-icon">
                    <Shield size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      User Access
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Roles and
                      <br />
                      permissions
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-examinations">
                  <div className="davv-davv-orbit-card-icon">
                    <FileText size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      Examinations
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Grading
                      <br />
                      and results
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-finance">
                  <div className="davv-davv-orbit-card-icon davv-finance-rupee-icon">
                    <span>₹</span>
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">Finance</span>
                    <span className="davv-davv-orbit-card-desc">
                      Fees and
                      <br />
                      accounts
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-analytics">
                  <div className="davv-davv-orbit-card-icon">
                    <Globe size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">Research</span>
                    <span className="davv-davv-orbit-card-desc">
                      Projects
                      <br />
                      and grants
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-hr">
                  <div className="davv-davv-orbit-card-icon">
                    <Users size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      Employees
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Staff and
                      <br />
                      payroll
                    </span>
                  </div>
                </div>

                <div className="davv-orbit-card davv-card-attendance">
                  <div className="davv-davv-orbit-card-icon">
                    <Building size={16} />
                  </div>
                  <div className="davv-davv-orbit-card-info">
                    <span className="davv-davv-orbit-card-title">
                      Academics
                    </span>
                    <span className="davv-davv-orbit-card-desc">
                      Programmes
                      <br />
                      and subjects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="davv-left-footer">
            <div className="davv-stats-grid">
              <div className="davv-stat-item">
                <div className="davv-stat-icon-wrapper">
                  <Building size={16} />
                </div>
                <div className="davv-stat-info-wrapper">
                  <span className="davv-stat-value">25+</span>
                  <span className="davv-stat-label">Universities</span>
                </div>
              </div>
              <div className="davv-stat-item">
                <div className="davv-stat-icon-wrapper">
                  <Users size={16} />
                </div>
                <div className="davv-stat-info-wrapper">
                  <span className="davv-stat-value">5 Lakh+</span>
                  <span className="davv-stat-label">Users</span>
                </div>
              </div>
              <div className="davv-stat-item">
                <div className="davv-stat-icon-wrapper">
                  <Activity size={16} />
                </div>
                <div className="davv-stat-info-wrapper">
                  <span className="davv-stat-value">1 Crore+</span>
                  <span className="davv-stat-label">Transactions</span>
                </div>
              </div>
              <div className="davv-stat-item">
                <div className="davv-stat-icon-wrapper">
                  <ShieldCheck size={16} />
                </div>
                <div className="davv-stat-info-wrapper">
                  <span className="davv-stat-value">99.9%</span>
                  <span className="davv-stat-label">Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="davv-login-right">
          <div className="davv-right-header">
            <div className="davv-language-dropdown" onClick={toggleLanguage}>
              <Globe size={14} />
              <span>
                {language === 'en' ? 'English (US)' : 'हिन्दी (Hindi)'}
              </span>
            </div>
          </div>

          <div className="davv-login-form-container">
            <div className="davv-login-form-wrapper">
              <div className="davv-right-logo-section">
                <img
                  src="/DAVV_Logo.png"
                  alt="DAVV emblem"
                  className="davv-right-logo-emblem"
                />
                <div className="davv-right-logo-text">
                  <span className="davv-right-logo-name">
                    Devi Ahilya Vishwavidyalaya
                  </span>
                  <span className="davv-right-logo-campus">Indore</span>
                </div>
              </div>

              {isForgotPassword ? (
                <>
                  <h2 className="davv-form-heading">Forgot Password</h2>
                  <p className="davv-form-subtitle">
                    Recover Your Account Access
                  </p>

                  {!emailSent ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        setEmailSent(true);
                      }}
                    >
                      <div className="davv-input-group">
                        <label htmlFor="email">Registered Email Address</label>
                        <div className="davv-input-wrapper">
                          <span className="davv-input-icon">
                            <Mail size={16} />
                          </span>
                          <input
                            id="email"
                            type="email"
                            className="davv-custom-input"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      <button type="submit" className="davv-signin-btn">
                        <span>Send Reset Link</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  ) : (
                    <div className="davv-success-state-container">
                      <div className="davv-success-icon-badge">
                        <ShieldCheck size={32} color="#10b981" />
                      </div>
                      <h3 className="davv-success-state-title">
                        Check Your Email
                      </h3>
                      <p className="davv-success-state-desc">
                        If the email <strong>{email}</strong> exists in our
                        system, we have sent a secure link to reset your
                        password.
                      </p>
                    </div>
                  )}

                  <div className="davv-signup-footer mt-6 text-center">
                    <a
                      href="#"
                      className="davv-help-link"
                      onClick={e => {
                        e.preventDefault();
                        setIsForgotPassword(false);
                        setEmailSent(false);
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Login
                      </span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="davv-form-heading">Sign in to DAVV</h2>
                  <p className="davv-form-subtitle">
                    Access the university management portal
                  </p>

                  <form onSubmit={handleLogin}>
                    <div className="davv-input-group">
                      <label htmlFor="username">Username</label>
                      <div className="davv-input-wrapper">
                        <span className="davv-input-icon">
                          <User size={16} />
                        </span>
                        <input
                          id="username"
                          className="davv-custom-input"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="davv-input-group">
                      <label htmlFor="password">Password</label>
                      <div className="davv-input-wrapper">
                        <span className="davv-input-icon">
                          <Lock size={16} />
                        </span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="davv-custom-input"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="davv-password-toggle"
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

                    <div className="davv-form-options">
                      <div className="davv-remember-wrap">
                        <input type="checkbox" id="RememberMe" defaultChecked />
                        <label htmlFor="RememberMe">Remember me</label>
                      </div>
                      <a
                        href="#"
                        className="davv-forgot-password"
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
                      className="davv-signin-btn"
                      disabled={isLoggingIn}
                    >
                      <span>{isLoggingIn ? 'Signing in...' : 'Sign in'}</span>
                      {!isLoggingIn && <ArrowRight size={16} />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
          <div className="davv-login-page-footer">
            © 2026 Devi Ahilya Vishwavidyalaya, Indore · NAAC A+ Accredited
          </div>
        </div>
      </div>
    </div>
  );
};
