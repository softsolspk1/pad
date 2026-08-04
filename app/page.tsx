import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Stethoscope,
  Video,
  PenTool,
  Newspaper,
  CreditCard,
  BookOpen,
  MessagesSquare,
  MessageCircleQuestion,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";

const features = [
  { icon: Newspaper, title: "News Feed", desc: "Share updates, cases and clinical moments with the community." },
  { icon: CreditCard, title: "Digital Membership", desc: "Your verified PAD membership card, always on hand." },
  { icon: Video, title: "Events", desc: "Conferences and workshops — past and upcoming." },
  { icon: BookOpen, title: "Research", desc: "Papers, e-books and the latest dermatology guidelines." },
  { icon: MessageCircleQuestion, title: "Ask the Expert", desc: "Discuss cases and get peer insight, with image support." },
  { icon: ClipboardList, title: "Survey & Polls", desc: "Participate in association-led surveys and polls." },
  { icon: MessagesSquare, title: "Chat", desc: "One-to-one and group chat with fellow members." },
  { icon: Sparkles, title: "AI Dermatology Copilot", desc: "Evidence-based recommendations, guidelines and drug options." },
  { icon: Activity, title: "Clinical Calculators", desc: "PASI, EASI, SCORAD, DLQI, BSA, GAGS and more scoring tools." },
];

const stats = [
  { label: "Verified Members", value: "1,200+" },
  { label: "Research Papers", value: "500+" },
  { label: "Events Hosted", value: "80+" },
  { label: "Clinical Calculators", value: "10+" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-crimson-600 flex items-center justify-center text-white font-bold shadow-sm">
              R
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-900 tracking-tight">REDERM CONNECT</p>
              <p className="text-[10px] font-medium text-gray-400 -mt-0.5 hidden sm:block">by Pakistan Association of Dermatologists</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-crimson-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-crimson-600 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-outline !py-2 !px-4 text-sm">
              Log In
            </Link>
            <Link href="/auth/register" className="btn-primary !py-2 !px-4 text-sm">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-50 via-white to-white -z-10" />
        <div className="container grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-crimson-50 text-crimson-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-crimson-100">
              <ShieldCheck size={14} /> Official Platform of PAD
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900">
              Pakistan's First <span className="text-crimson-600">AI-Powered</span> Dermatology &amp; Aesthetic Professional Platform
            </h1>
            <p className="text-lg text-gray-500 max-w-lg">
              Where experts connect, knowledge evolves, and patient care transforms. Join the exclusive network built for Pakistan's dermatology professionals.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register" className="btn-primary flex items-center gap-2">
                Join the Network <ArrowRight size={18} />
              </Link>
              <Link href="/auth/login" className="btn-outline">
                Member Login
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <CheckCircle2 size={16} className="text-crimson-600" />
              Verified by PMDC registration &amp; admin approval
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="card w-full max-w-sm !rounded-2xl">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crimson-50 rounded-xl text-crimson-600"><Activity size={22} /></div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Clinical Updates</h3>
                    <p className="text-xs text-muted">Latest guidelines &amp; trials</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crimson-50 rounded-xl text-crimson-600"><Stethoscope size={22} /></div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">AI Copilot</h3>
                    <p className="text-xs text-muted">Evidence-based decisions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crimson-50 rounded-xl text-crimson-600"><Video size={22} /></div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Conferences &amp; Workshops</h3>
                    <p className="text-xs text-muted">Stay ahead with live events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-crimson-50 rounded-xl text-crimson-600"><PenTool size={22} /></div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Practice Tools</h3>
                    <p className="text-xs text-muted">Clinical calculators &amp; scales</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:flex card !rounded-xl !p-3 items-center gap-2 shadow-lg">
              <Award size={18} className="text-crimson-600" />
              <span className="text-xs font-semibold text-gray-700">Digital Membership Card</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-crimson-600">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs md:text-sm text-crimson-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-crimson-600 font-semibold text-sm mb-2 tracking-wide uppercase">Everything in one place</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for the modern dermatologist</h2>
          <p className="text-gray-500">
            From an AI diagnostic copilot to clinical scoring tools and a private professional network — Rederm Connect brings the whole practice together.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card !rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="w-11 h-11 rounded-xl bg-crimson-50 text-crimson-600 flex items-center justify-center mb-4">
                <f.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="bg-gray-50 border-y border-gray-100">
        <div className="container py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-crimson-600 font-semibold text-sm mb-2 tracking-wide uppercase">About PAD</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              A platform built by dermatologists, for dermatologists
            </h2>
            <p className="text-gray-500 leading-relaxed">
              The Pakistan Association of Dermatologists (PAD) represents the country's dermatology and aesthetic medicine professionals. Rederm Connect brings PAD's mission online — verified membership, continuing education, peer collaboration and AI-assisted clinical support, all in one hybrid web and mobile experience.
            </p>
          </div>
          <div className="card !rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Users className="text-crimson-600" />
              <p className="font-semibold text-gray-900">Ready to join Pakistan's dermatology network?</p>
            </div>
            <p className="text-sm text-muted">
              Registration takes a few minutes. Once submitted, your profile is reviewed by the PAD admin team and your account is activated on approval.
            </p>
            <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2">
              Register as Member <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-crimson-600 flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <p className="font-bold text-gray-900 text-sm">REDERM CONNECT</p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Pakistan Association of Dermatologists. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
