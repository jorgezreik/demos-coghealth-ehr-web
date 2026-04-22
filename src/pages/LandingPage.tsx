import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Activity,
  Sparkles,
  Shield,
  Search,
  Zap,
  Brain,
  HeartPulse,
  Stethoscope,
  Clock,
  TrendingUp,
  Lock,
  Cpu,
  CheckCircle2,
  Quote,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

const BRAND = {
  accent: 'from-emerald-400 via-teal-300 to-cyan-300',
  accentSolid: 'text-emerald-300',
  glow: 'shadow-[0_0_60px_-15px_rgba(45,212,191,0.35)]',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-300/80 font-medium">
      <span className="h-px w-6 bg-gradient-to-r from-emerald-300/0 to-emerald-300/70" />
      {children}
    </div>
  );
}

function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`bg-gradient-to-r ${BRAND.accent} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

function TypingLine() {
  const lines = [
    'Epic was built in 2002.',
    'Doctors are still paying for it.',
    'We are rebuilding the EHR.',
  ];
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  useEffect(() => {
    const full = lines[idx];
    if (typed.length < full.length) {
      const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 55);
      return () => clearTimeout(t);
    }
    const hold = setTimeout(() => {
      setTyped('');
      setIdx((i) => (i + 1) % lines.length);
    }, 2600);
    return () => clearTimeout(hold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, idx]);
  return (
    <span className="font-mono text-xs sm:text-sm text-emerald-300/90">
      {typed}
      <span className="inline-block w-[1ch] -translate-y-[1px] animate-pulse text-emerald-300">
        ▍
      </span>
    </span>
  );
}

function EkgLine({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 80"
      preserveAspectRatio="none"
      className={`w-full h-16 ${className}`}
    >
      <defs>
        <linearGradient id="ekgGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(45,212,191,0)" />
          <stop offset="50%" stopColor="rgba(45,212,191,0.9)" />
          <stop offset="100%" stopColor="rgba(45,212,191,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0 40 L120 40 L140 40 L150 20 L165 60 L180 10 L195 55 L210 40 L380 40 L395 20 L410 60 L425 30 L440 40 L620 40 L635 15 L650 55 L665 40 L800 40"
        fill="none"
        stroke="url(#ekgGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative mt-20 mx-auto max-w-6xl">
      <div className="absolute -inset-x-10 -top-10 -bottom-10 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className={`relative rounded-2xl border border-white/10 bg-[#0b1018]/80 backdrop-blur-xl overflow-hidden ${BRAND.glow}`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="text-xs text-white/40 font-mono">coghealth.health/app</div>
          <div className="text-xs text-emerald-300/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-3 border-r border-white/10 p-5 space-y-1.5">
            {['Dashboard', 'Patients', 'Schedule', 'Labs', 'Vitals', 'Medications', 'Audit'].map(
              (label, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    i === 0
                      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20'
                      : 'text-white/60 hover:text-white/90'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current/70" />
                  {label}
                </div>
              ),
            )}
          </div>
          <div className="col-span-9 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-emerald-300/70">
                  Today · Springfield Medical Center
                </div>
                <div className="text-xl font-semibold text-white">
                  Good morning, Dr. Anderson
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="px-2.5 py-1 rounded-md bg-white/5 ring-1 ring-white/10">
                  12 patients today
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/20 text-emerald-300">
                  3 notes ready to sign
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Charting time', value: '34m', delta: '−78%' },
                { label: 'Inbox cleared', value: '100%', delta: '+12%' },
                { label: 'After-hours work', value: '0h', delta: '−3.1h' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 px-4 py-3"
                >
                  <div className="text-[11px] uppercase tracking-widest text-white/40">
                    {m.label}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-2xl font-semibold text-white">{m.value}</div>
                    <div className="text-xs text-emerald-300">{m.delta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  AI Scribe · Live
                </div>
                <span className="text-[11px] text-white/40 font-mono">
                  room 204 · 2:14
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-white/70">
                  <span className="text-emerald-300">Assessment ·</span> HTN, stable. LDL trending
                  down on 20mg atorvastatin.
                </div>
                <div className="text-white/70">
                  <span className="text-emerald-300">Plan ·</span> Continue current regimen.
                  BMP + lipid panel in 3 months. Refill rosuvastatin, 90-day supply.
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                  <span>Draft generated in 1.2s · coded to ICD-10 I10, E78.5</span>
                  <span className="text-emerald-300">Sign →</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4">
                <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Proactive flags
                </div>
                <div className="space-y-1.5 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" /> Smith, John · A1c overdue
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300" /> Garcia, M. · BP 168/102
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Davis, J. · Refill ready
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4">
                <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
                  Clinical copilot
                </div>
                <div className="text-sm text-white/70">
                  "Consider adding empagliflozin — T2DM + reduced ejection fraction per 2024 ACC
                  guidelines."
                </div>
                <div className="pt-2 text-[11px] text-emerald-300">Show evidence →</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
        <GradientText>{value}</GradientText>
      </div>
      <div className="mt-2 text-sm text-white/80 font-medium">{label}</div>
      {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition">
      <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
      <div className="w-10 h-10 rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/20 flex items-center justify-center text-emerald-300">
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-4 text-base font-medium text-white">{title}</div>
      <div className="mt-1.5 text-sm text-white/60 leading-relaxed">{body}</div>
    </div>
  );
}

function PartnerLogos() {
  const logos = [
    'Springfield Medical',
    'Cascadia Health',
    'Northstar Clinic',
    'Evergreen Primary',
    'Bay Pediatrics',
    'Ridgeline Cardio',
  ];
  return (
    <div className="mt-16">
      <div className="text-center text-xs uppercase tracking-[0.25em] text-white/40">
        Piloting today at forward-looking clinics
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
        {logos.map((l) => (
          <div
            key={l}
            className="text-center text-white/50 text-sm font-medium tracking-wide"
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-root');
    return () => document.documentElement.classList.remove('landing-root');
  }, []);

  return (
    <div
      className="min-h-screen w-full text-white antialiased overflow-x-hidden"
      style={{
        fontSize: 16,
        fontFamily:
          '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        background:
          'radial-gradient(1200px 600px at 15% -10%, rgba(45,212,191,0.12), transparent 60%),' +
          'radial-gradient(900px 600px at 95% 10%, rgba(56,189,248,0.10), transparent 55%),' +
          'radial-gradient(900px 600px at 50% 110%, rgba(16,185,129,0.10), transparent 55%),' +
          '#050711',
      }}
    >
      {/* Grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
        }}
      />

      {/* NAV */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_8px_32px_-8px_rgba(45,212,191,0.6)]">
              <HeartPulse className="w-4 h-4 text-[#050711]" />
            </div>
            <div className="text-base font-semibold tracking-tight">
              CogHealth
            </div>
            <div className="hidden sm:block text-[11px] text-white/40 font-mono ml-2 px-2 py-0.5 rounded-md bg-white/5 ring-1 ring-white/10">
              YC S26
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#product" className="hover:text-white transition">
              Product
            </a>
            <a href="#physicians" className="hover:text-white transition">
              For physicians
            </a>
            <a href="#metrics" className="hover:text-white transition">
              Traction
            </a>
            <a href="#investors" className="hover:text-white transition">
              Investors
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex text-sm text-white/70 hover:text-white transition"
            >
              Open app
            </Link>
            <a
              href="#investors"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white text-[#050711] text-sm font-medium px-3.5 py-2 hover:bg-emerald-200 transition"
            >
              Book a demo
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now piloting at 12 clinics · 340+ physicians
          </div>
          <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
            The EHR your doctors
            <br />
            <GradientText>actually want to use.</GradientText>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed">
            CogHealth is the AI-native electronic health record replacing Epic, Cerner, and
            athenahealth at forward-looking clinics. We cut charting time by 78% and give
            physicians their evenings back.
          </p>
          <div className="mt-3">
            <TypingLine />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#investors"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#050711] text-sm font-semibold px-5 py-3 hover:bg-emerald-200 transition"
            >
              Book a demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] text-white text-sm font-medium px-5 py-3 hover:bg-white/[0.06] transition"
            >
              See the product
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> HIPAA + SOC 2 ready
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> FHIR R4 native
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Zero-trust by default
            </span>
          </div>
        </div>
        <HeroDashboardPreview />
        <EkgLine className="mt-8 opacity-60" />
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <PartnerLogos />
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="max-w-3xl">
            <SectionLabel>The problem</SectionLabel>
            <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              Healthcare runs on <GradientText>2002 software</GradientText> — and
              it&rsquo;s bankrupting doctors.
            </h2>
            <p className="mt-5 text-white/60 text-base sm:text-lg leading-relaxed">
              Every major EHR — Epic, Cerner (Oracle Health), MEDITECH, athenahealth — was built
              before the smartphone. They&rsquo;re the #1 cited cause of physician burnout and the
              #1 reason medical errors happen. The system is breaking the people trying to keep
              us alive.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              value="2.1h"
              label="charting per 1h of patient care"
              sub="Annals of Internal Medicine, 2023"
            />
            <StatCard
              value="63%"
              label="of physicians report burnout"
              sub="AMA Physician Survey"
            />
            <StatCard
              value="$157B"
              label="spent on legacy EHRs annually"
              sub="CMS, 2024"
            />
            <StatCard
              value="-3"
              label="average physician NPS for Epic"
              sub="KLAS Research"
            />
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section id="product" className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <SectionLabel>The product</SectionLabel>
              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                Every workflow
                <br />
                <GradientText>rebuilt from zero.</GradientText>
              </h2>
              <p className="mt-5 text-white/60 leading-relaxed">
                CogHealth isn&rsquo;t a UI on top of a legacy core. We rewrote the chart, the
                scheduler, the order set, the audit trail — as if healthcare had always been
                built for the cloud, for AI, and for humans.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'Sub-100ms patient search across millions of charts',
                  'Ambient AI scribe with codable, signable SOAP notes',
                  'FHIR R4 native — not a bolt-on translator',
                  'Proactive clinical alerts tuned per physician',
                  'Immutable audit trail, zero-trust access control',
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/80">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Sparkles}
                  title="AI Scribe that signs itself"
                  body="Ambient dictation → coded, signable SOAP note in 1.2 seconds. Fine-tuned on 10M+ de-identified encounters."
                />
                <FeatureCard
                  icon={Search}
                  title="Search faster than thought"
                  body="Every chart, note, lab, and order indexed and searchable in under 100ms. No more clicks-to-find."
                />
                <FeatureCard
                  icon={Brain}
                  title="Clinical copilot"
                  body="Differentials, order suggestions, and guideline nudges — grounded in primary sources, cited inline."
                />
                <FeatureCard
                  icon={Activity}
                  title="Proactive flags"
                  body="Risk-stratification models surface the patient you didn't know to worry about — before the visit."
                />
                <FeatureCard
                  icon={Shield}
                  title="Compliance-native"
                  body="HIPAA, HITECH, 21st Century Cures, TEFCA. Immutable audit, break-glass workflows, row-level PHI controls."
                />
                <FeatureCard
                  icon={Zap}
                  title="Open API, open schema"
                  body="Your data is yours. Every row exportable. Every workflow scriptable. Every integration a first-class citizen."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHYSICIAN TESTIMONIAL */}
      <section id="physicians" className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.02] to-cyan-500/[0.05] p-10 lg:p-14 overflow-hidden">
            <Quote className="w-10 h-10 text-emerald-300/40 mb-6" />
            <p className="text-xl sm:text-2xl leading-relaxed font-medium text-white/90">
              &ldquo;I used to close notes at 10pm. Now I close them between rooms. CogHealth
              gave me back two hours a day and the energy to practice medicine like I wanted
              to when I started.&rdquo;
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[#050711] font-semibold">
                SA
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  Dr. Sarah Anderson, MD
                </div>
                <div className="text-xs text-white/50">
                  Internal Medicine · Springfield Medical Center · 18 years practicing
                </div>
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl"
            />
          </div>
        </div>
      </section>

      {/* TRACTION */}
      <section id="metrics" className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <SectionLabel>Traction</SectionLabel>
              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                The numbers we&rsquo;d
                <br />
                <GradientText>send to YC.</GradientText>
              </h2>
            </div>
            <div className="text-sm text-white/50 max-w-md">
              Signed in the last 12 months. Updated weekly. We&rsquo;re happy to share live
              dashboards with investors under NDA.
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard value="12" label="pilot clinics signed" />
            <StatCard value="340+" label="physicians onboarded" />
            <StatCard value="78%" label="reduction in charting time" />
            <StatCard value="92" label="physician NPS" />
            <StatCard value="$4.2M" label="ARR, current run rate" />
            <StatCard value="34%" label="MoM revenue growth" />
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="max-w-3xl">
            <SectionLabel>Why now</SectionLabel>
            <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              A <GradientText>once-a-century</GradientText> moment for healthcare software.
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Brain,
                title: 'AI finally works for medicine',
                body: 'Ambient scribes, clinical reasoning, and structured extraction crossed the threshold in 2024. The incumbents cannot ship it — we were built for it.',
              },
              {
                icon: Stethoscope,
                title: 'Burnout crisis',
                body: 'The US will be short 124,000 physicians by 2034. Every hour we give back is an hour the system does not have to replace.',
              },
              {
                icon: TrendingUp,
                title: 'TEFCA + Cures Act',
                body: 'Federal mandates around interoperability, data access, and transparency punish closed architectures. Our openness is now a moat.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <c.icon className="w-5 h-5 text-emerald-300" />
                <div className="mt-4 text-base font-medium text-white">{c.title}</div>
                <div className="mt-2 text-sm text-white/60 leading-relaxed">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <SectionLabel>The team</SectionLabel>
              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                Built by the people
                <br />
                <GradientText>who&rsquo;ve done this before.</GradientText>
              </h2>
              <p className="mt-5 text-white/60 leading-relaxed">
                Ex-Epic, ex-Anthropic, ex-Stanford Medicine. Two practicing physicians on the
                founding team. We&rsquo;ve shipped EHR modules used by 240M patients — and we
                know exactly why they&rsquo;re broken.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'J. Zreik',
                  role: 'CEO · ex-Epic, ex-Anthropic',
                  focus: 'Shipped clinical AI modules to 180+ hospitals.',
                },
                {
                  name: 'Dr. M. Chen, MD',
                  role: 'CMO · Stanford Medicine',
                  focus: 'Practicing internist. 4-time NEJM author on EHR usability.',
                },
                {
                  name: 'R. Patel',
                  role: 'CTO · ex-Palantir Health',
                  focus: 'Built Foundry for HHS. FHIR core contributor.',
                },
                {
                  name: 'Dr. L. Okafor, MD',
                  role: 'VP Clinical · Kaiser',
                  focus: 'Led EHR rollouts for 22 clinics. Board-certified FM.',
                },
              ].map((m) => (
                <div
                  key={m.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-[#050711] text-sm font-semibold">
                    {m.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="mt-3 text-sm font-medium text-white">{m.name}</div>
                  <div className="text-xs text-emerald-300/90">{m.role}</div>
                  <div className="mt-2 text-xs text-white/50 leading-relaxed">{m.focus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INVESTOR CTA */}
      <section id="investors" className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="relative rounded-3xl border border-white/10 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(600px 400px at 20% 20%, rgba(45,212,191,0.25), transparent 60%),' +
                  'radial-gradient(500px 400px at 90% 80%, rgba(56,189,248,0.18), transparent 60%),' +
                  'linear-gradient(135deg, #081321 0%, #050911 100%)',
              }}
            />
            <div className="relative p-10 sm:p-14 lg:p-20">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                Dear Y Combinator
              </div>
              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-3xl">
                We&rsquo;re replacing Epic. We&rsquo;d like your help doing it{' '}
                <GradientText>faster.</GradientText>
              </h2>
              <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">
                Epic is a $40B private company running software older than the iPhone. The
                healthcare system is paying for it in burned-out physicians, patient errors, and
                dollars that never reach care. We&rsquo;re the team, with the product, at the
                moment AI finally makes the rewrite possible.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-4 max-w-3xl">
                {[
                  ['$50B+', 'US EHR market, 0% physician NPS'],
                  ['12 → 200', 'pilot clinics by end of year, signed'],
                  ['$4.2M', 'ARR, profitable per-customer gross margin'],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 px-4 py-3"
                  >
                    <div className="text-2xl font-semibold">
                      <GradientText>{v}</GradientText>
                    </div>
                    <div className="text-xs text-white/60 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:founders@coghealth.health?subject=Investor%20intro"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#050711] text-sm font-semibold px-5 py-3 hover:bg-emerald-200 transition"
                >
                  Request the deck
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#product"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.03] text-white text-sm font-medium px-5 py-3 hover:bg-white/[0.06] transition"
                >
                  Explore the product
                </a>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg text-white/70 text-sm font-medium px-5 py-3 hover:text-white transition"
                >
                  Live demo
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4 text-xs text-white/40">
                <Clock className="w-3.5 h-3.5" />
                Raising a $12M seed · closing April 30
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-white/60 text-sm">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5 text-[#050711]" />
            </div>
            <span>CogHealth</span>
            <span className="text-white/20">·</span>
            <span>The EHR physicians actually want.</span>
          </div>
          <div className="flex items-center gap-5 text-white/40">
            <a href="#" className="hover:text-white transition"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
          </div>
          <div className="text-xs text-white/30 font-mono">
            © 2026 CogHealth, Inc. · YC S26 applicant
          </div>
        </div>
      </footer>
    </div>
  );
}
