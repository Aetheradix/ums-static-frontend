import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import {
  DAVV,
  INSTITUTION_TYPE_LABEL,
  INSTITUTION_TYPE_REACH,
  campusOf,
  findInstitution,
} from '../constants/davvData';
import { davvUrls } from '../constants/davvUrls';

export default function InstitutionLogin() {
  const { type = '', institution = '' } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const inst = findInstitution(type, institution);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    document.title = inst
      ? `${inst.shortName} — ${DAVV.shortName} Login`
      : `${DAVV.shortName} Login`;
    // Trigger entrance animation
    requestAnimationFrame(() => setPageLoaded(true));
  }, [inst]);

  if (!inst) {
    return (
      <div className="octagon-theme min-h-screen grid place-items-center bg-slate-50 px-6">
        <div className="text-center animate-fade-in">
          <img
            src="/images/davv-logo.png"
            alt={DAVV.shortName}
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold text-navy mb-2">
            Institution not found
          </h1>
          <p className="text-muted mb-6">
            We couldn't find that institution under {DAVV.shortName}.
          </p>
          <Link
            to={davvUrls.directory}
            className="inline-flex items-center gap-1.5 text-davv hover:text-davv-dark font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to directory
          </Link>
        </div>
      </div>
    );
  }

  const campus = campusOf(inst.campusSlug);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await login();
    setIsLoggingIn(false);
    navigate('/home');
  };

  return (
    <div className="octagon-theme min-h-screen grid lg:grid-cols-2 bg-white text-navy transition-colors duration-300">
      {/* LEFT — institution branding over the campus image */}
      <div
        className={`relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white ${
          pageLoaded ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <img
          src="/images/davv-campus.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-davv-darkest/95 via-davv-dark/90 to-davv/80" />

        <div className="relative">
          <Link
            to={davvUrls.directory}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{' '}
            Back to directory
          </Link>
        </div>

        <div className="relative">
          {/* Institution badge */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/images/davv-logo.png"
              alt={`${DAVV.shortName} emblem`}
              className="w-14 h-14 object-contain bg-white/90 rounded-full p-1.5 shadow-lg"
            />
            <div className="h-10 w-px bg-white/20" />
            <div>
              <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.15em]">
                {INSTITUTION_TYPE_LABEL[inst.type]}
              </div>
              <div className="text-white/90 text-xs font-semibold">
                {DAVV.shortName}, {DAVV.city.split(',')[0]}
              </div>
            </div>
          </div>

          {/* Institution name */}
          <h1 className="font-display text-3xl lg:text-4xl font-bold leading-tight mb-3">
            {inst.name}
          </h1>

          {/* Campus info */}
          {campus && (
            <div className="flex items-center gap-3 text-white/80 text-sm mb-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {campus.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {campus.location}
              </span>
            </div>
          )}

          {/* Reach blurb */}
          <p className="text-white/70 text-[13px] leading-relaxed max-w-sm border-l-2 border-davv-saffron pl-4 italic">
            "{INSTITUTION_TYPE_REACH[inst.type]}"
          </p>
        </div>

        {/* Footer */}
        <div className="relative space-y-1">
          <div className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.15em]">
            {DAVV.motto}
          </div>
          <div className="text-white/40 text-xs">
            {DAVV.mottoTranslation} · {DAVV.city}
          </div>
        </div>
      </div>

      {/* RIGHT — sign in */}
      <div
        className={`flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 ${
          pageLoaded ? 'animate-fade-in' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Mobile header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/davv-logo.png"
                alt={`${DAVV.shortName} emblem`}
                className="w-11 h-11 object-contain shrink-0"
              />
              <div>
                <div className="text-muted text-[10px] font-bold uppercase tracking-wide">
                  {INSTITUTION_TYPE_LABEL[inst.type]} · {DAVV.shortName}
                </div>
                <h1 className="font-display text-base font-bold text-navy leading-tight">
                  {inst.name}
                </h1>
              </div>
            </div>
            {campus && (
              <div className="flex items-center gap-2 text-muted text-xs">
                <MapPin className="w-3 h-3" />
                {campus.name} · {campus.location}
              </div>
            )}
            <hr className="mt-4 border-border" />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-navy mb-1">
              Welcome back
            </h2>
            <p className="text-muted text-sm">
              Sign in to your{' '}
              <span className="font-semibold text-navy">{inst.shortName}</span>{' '}
              account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-navy mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-2.5 border border-border rounded-xl px-3.5 focus-within:border-davv focus-within:ring-2 focus-within:ring-davv/10 transition-all">
                <User className="w-4 h-4 text-muted shrink-0" />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none text-navy text-sm py-3 placeholder:text-muted/60"
                  placeholder="Enrollment no. / username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-navy mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2.5 border border-border rounded-xl px-3.5 focus-within:border-davv focus-within:ring-2 focus-within:ring-davv/10 transition-all">
                <Lock className="w-4 h-4 text-muted shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none text-navy text-sm py-3 placeholder:text-muted/60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-muted hover:text-navy transition-colors cursor-pointer p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border text-davv focus:ring-davv/30 focus:ring-offset-0"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {}}
                className="text-davv hover:text-davv-dark font-semibold transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-davv text-white font-bold rounded-xl py-3.5 hover:bg-davv-dark active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-8 text-[12px] text-muted">
            <ShieldCheck className="w-4 h-4 text-davv shrink-0" />
            Secure institution-scoped sign-in
          </div>
        </div>
      </div>
    </div>
  );
}
