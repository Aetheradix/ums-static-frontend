import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
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
} from '../data';
import { davvUrls } from '../urls';

export default function InstitutionLogin() {
  const { type = '', institution = '' } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const inst = findInstitution(type, institution);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    document.title = inst
      ? `${inst.shortName} — ${DAVV.shortName} Login`
      : `${DAVV.shortName} Login`;
  }, [inst]);

  if (!inst) {
    return (
      <div className="octagon-theme min-h-screen grid place-items-center bg-slate-50 text-navy px-6">
        <div className="text-center">
          <img
            src="/images/davv-logo.png"
            alt="DAVV"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold mb-2">
            Institution not found
          </h1>
          <p className="text-muted mb-6">
            We couldn't find that institution under DAVV.
          </p>
          <Link to={davvUrls.directory} className="text-davv font-semibold">
            ← Back to directory
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
    <div className="octagon-theme min-h-screen grid lg:grid-cols-2 bg-white text-navy">
      {/* LEFT — institution branding over the campus image */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white">
        <img
          src="/images/davv-campus.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-davv-darkest/95 via-davv-dark/90 to-davv/80" />

        <div className="relative">
          <Link
            to={davvUrls.directory}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to directory
          </Link>
        </div>
        <div className="relative">
          <img
            src="/images/davv-logo.png"
            alt="DAVV emblem"
            className="w-16 h-16 object-contain bg-white rounded-full p-1 mb-6"
          />
          <div className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">
            {INSTITUTION_TYPE_LABEL[inst.type]} · {DAVV.shortName}
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight mb-3">
            {inst.name}
          </h1>
          {campus && (
            <p className="text-white/80 text-sm mb-6">
              {campus.name} · {campus.location}
            </p>
          )}
          <p className="text-white/75 text-[13px] leading-relaxed max-w-sm border-l-2 border-davv-saffron pl-4">
            {INSTITUTION_TYPE_REACH[inst.type]}
          </p>
        </div>
        <div className="relative text-white/50 text-xs">
          {DAVV.motto} — {DAVV.mottoTranslation}
        </div>
      </div>

      {/* RIGHT — sign in */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* mobile institution label */}
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <img
              src="/images/davv-logo.png"
              alt="DAVV emblem"
              className="w-12 h-12 object-contain shrink-0"
            />
            <div>
              <div className="text-muted text-[11px] font-bold uppercase tracking-wide">
                {INSTITUTION_TYPE_LABEL[inst.type]} · {DAVV.shortName}
              </div>
              <h1 className="font-display text-lg font-bold text-navy leading-tight">
                {inst.name}
              </h1>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-navy mb-1">
            Sign in
          </h2>
          <p className="text-muted text-sm mb-8">
            Access the {inst.shortName} portal on Octagon.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-navy mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-2 border border-border rounded-xl px-3 focus-within:border-davv transition-colors">
                <User className="w-4 h-4 text-muted shrink-0" />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none text-navy text-sm py-3"
                  placeholder="Enrollment no. / username"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-navy mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 border border-border rounded-xl px-3 focus-within:border-davv transition-colors">
                <Lock className="w-4 h-4 text-muted shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none text-navy text-sm py-3"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-muted hover:text-navy transition-colors"
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
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="text-davv font-semibold"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 bg-davv text-white font-bold rounded-xl py-3.5 hover:bg-davv-dark transition-all disabled:opacity-70"
            >
              {isLoggingIn ? (
                'Signing in…'
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-8 text-[12px] text-muted">
            <ShieldCheck className="w-4 h-4 text-davv" /> Secure
            institution-scoped sign-in
          </div>
        </div>
      </div>
    </div>
  );
}
