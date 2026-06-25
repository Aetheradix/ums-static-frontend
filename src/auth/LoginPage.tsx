import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAuth } from './useAuth';
import {
  UserPlus,
  FileText,
  CreditCard,
  BarChart2,
  Users,
  Clock,
  BookOpen,
  GraduationCap,
  Building,
  Activity,
  ShieldCheck,
  Globe,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shield,
  Home,
  Mail,
} from 'lucide-react';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate slight network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    await login();
    setIsLoggingIn(false);
    navigate('/home');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="login-left">
          <Link to="/cms" className="home-icon-btn" title="Back to Website">
            <Home size={18} />
          </Link>

          <div className="left-content">
            <h1 className="left-content-title">
              Intelligent Operations.
              <br />
              <span>Stronger Institutions.</span>
            </h1>
            <p className="left-content-desc">
              Unify every function of your university. Empower every
              stakeholder.
            </p>
          </div>

          <div className="orbit-section">
            <div className="orbit-container">
              <div className="orbit-glow"></div>
              <div className="orbit-ring">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={`o-${i}`}
                    className={`orbit-ring-dot dot-${i}`}
                  ></div>
                ))}
              </div>
              <div className="orbit-ring-inner">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={`i-${i}`}
                    className={`orbit-ring-dot dot-${i}`}
                  ></div>
                ))}
              </div>
              <div className="orbit-center">
                <img src="/images/Octagon.png" alt="Octagon logo" />
              </div>

              <div className="orbit-rotator">
                <div className="orbit-card card-admissions">
                  <div className="orbit-card-icon">
                    <UserPlus size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Admissions</span>
                    <span className="orbit-card-desc">
                      Recruit, admit and onboard students
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-examinations">
                  <div className="orbit-card-icon">
                    <FileText size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Examinations</span>
                    <span className="orbit-card-desc">
                      Assess, evaluate and publish results
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-finance">
                  <div className="orbit-card-icon">
                    <CreditCard size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Finance</span>
                    <span className="orbit-card-desc">
                      Fees, budgets and financial accounting
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-analytics">
                  <div className="orbit-card-icon">
                    <BarChart2 size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Analytics</span>
                    <span className="orbit-card-desc">
                      Real-time insights for smarter decisions
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-hr">
                  <div className="orbit-card-icon">
                    <Users size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">HR & Payroll</span>
                    <span className="orbit-card-desc">
                      Manage staff, payroll and performance
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-attendance">
                  <div className="orbit-card-icon">
                    <Clock size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Attendance</span>
                    <span className="orbit-card-desc">
                      Track attendance and engagement
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-academics">
                  <div className="orbit-card-icon">
                    <BookOpen size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Academics</span>
                    <span className="orbit-card-desc">
                      Curriculum, timetable and faculty management
                    </span>
                  </div>
                </div>

                <div className="orbit-card card-student">
                  <div className="orbit-card-icon">
                    <GraduationCap size={14} />
                  </div>
                  <div className="orbit-card-info">
                    <span className="orbit-card-title">Student Portal</span>
                    <span className="orbit-card-desc">
                      Access schedules, grades, and services
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
