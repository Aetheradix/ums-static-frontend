import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DavvLayout from '../layout/DavvLayout';
import SectionTitle from '../../public-portal/components/ui/SectionTitle';
import ServiceTile from '../components/ServiceTile';
import NoticeBoard from '../components/NoticeBoard';
import { DAVV, DAVV_STATS, CAMPUSES, SERVICES } from '../data';
import { davvUrls } from '../urls';

const QUICK_CHIPS = [
  'Results',
  'Exam Form',
  'Admissions',
  'Notices',
  'Scholarships',
];

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = `${DAVV.shortName} — ${DAVV.name}`;
  }, []);

  const goSearch = (q: string) => {
    navigate(`${davvUrls.directory}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  };

  const studentServices = SERVICES.filter(s => s.group === 'student');
  const academicServices = SERVICES.filter(s => s.group === 'academic');
  const adminServices = SERVICES.filter(s => s.group === 'admin');

  return (
    <DavvLayout>
      {/* HERO / WELCOME */}
      <section className="relative overflow-hidden bg-gradient-to-b from-davv-light/50 via-white to-white border-b border-davv/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-davv-saffron/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-davv/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* left */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-davv-light text-davv text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-4 border border-davv/10">
              {DAVV.motto} · {DAVV.mottoTranslation}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy leading-tight mb-4">
              Welcome to <span className="text-davv">DAVV</span>
            </h1>
            <p className="text-muted text-sm md:text-lg max-w-xl lg:max-w-none mb-8 mx-auto lg:mx-0">
              {DAVV.tagline}
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                goSearch(query);
              }}
              className="flex items-center gap-2 bg-white border border-border rounded-2xl p-2 shadow-sm max-w-xl mx-auto lg:mx-0"
            >
              <Search className="w-5 h-5 text-muted ml-2 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search institutions, services or notices…"
                className="flex-1 bg-transparent outline-none text-navy text-sm md:text-base px-1 py-2"
              />
              <button
                type="submit"
                className="bg-davv hover:bg-davv-dark text-white font-bold text-sm rounded-xl px-5 py-2.5 transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-5">
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => goSearch(chip)}
                  className="text-xs font-semibold text-navy/70 hover:text-davv bg-white border border-border/60 hover:border-davv/30 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* right — campus image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-davv/10">
              <img
                src="/images/davv-campus.jpg"
                alt="DAVV campus"
                className="w-full h-[340px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-davv-darkest/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <img
                  src="/images/davv-logo.png"
                  alt=""
                  className="w-11 h-11 object-contain bg-white rounded-full p-0.5 shrink-0"
                />
                <div className="text-white">
                  <div className="font-display font-bold text-sm leading-tight">
                    {DAVV.name}
                  </div>
                  <div className="text-white/80 text-[11.5px]">
                    Takshashila · Nalanda · Avanti Parisar
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg border border-border/60 px-4 py-3">
              <div className="font-display text-xl font-bold text-davv">
                294
              </div>
              <div className="text-muted text-[11px]">Affiliated Colleges</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY USED SERVICES */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <SectionTitle
          title="Frequently used services"
          subtitle="Jump straight to what students need most."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {studentServices.map(s => (
            <ServiceTile key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* CAMPUS SELECTOR + NOTICE BOARD */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12 md:pb-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionTitle
            title="Campuses"
            subtitle="Three campuses host DAVV's departments and institutes."
          />
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            {CAMPUSES.map(c => (
              <button
                key={c.slug}
                onClick={() =>
                  navigate(`${davvUrls.directory}?campus=${c.slug}`)
                }
                className="group text-left bg-white border border-border/60 rounded-2xl p-5 hover:border-davv/40 hover:shadow-md transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-davv-light text-davv">
                  {c.role}
                </span>
                <h3 className="font-display font-bold text-navy mt-3">
                  {c.name}
                </h3>
                <p className="text-muted text-[12.5px] mt-1 leading-snug">
                  {c.blurb}
                </p>
                <span className="text-[12px] text-muted mt-2 block">
                  {c.location}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate(davvUrls.directory)}
            className="inline-flex items-center border border-davv text-davv hover:bg-davv hover:text-white font-bold text-sm rounded-xl px-5 py-2.5 transition-colors"
          >
            Browse full directory →
          </button>
        </div>
        <div>
          <SectionTitle title="Announcements" />
          <NoticeBoard />
        </div>
      </section>

      {/* SERVICES BY GROUP */}
      <section className="bg-davv-light/30 border-y border-davv/10 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <SectionTitle
            center
            title="Everything, organised by task"
            subtitle="Student, academic and administrative services in one place."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Student Services', items: studentServices },
              { title: 'Academic Services', items: academicServices },
              { title: 'Administrative Services', items: adminServices },
            ].map(col => (
              <div
                key={col.title}
                className="bg-white border border-border/60 rounded-2xl p-5"
              >
                <h3 className="font-display font-bold text-navy mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-1">
                  {col.items.map(s => {
                    const Icon = s.icon;
                    return (
                      <li key={s.id}>
                        <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-davv-light/60 transition-colors cursor-pointer">
                          <Icon className="w-4 h-4 text-davv shrink-0" />
                          <span className="text-[13.5px] text-navy">
                            {s.label}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DAVV_STATS.map(s => (
            <div
              key={s.label}
              className="bg-white border border-border/60 rounded-2xl p-6 text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-davv">
                {s.value}
              </div>
              <div className="text-muted text-[13px] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </DavvLayout>
  );
}
