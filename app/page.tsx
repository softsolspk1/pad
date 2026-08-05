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



export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full object-cover shadow-sm" />
            <div className="leading-tight">
              <p className="font-bold text-gray-900 tracking-tight">PAD APP</p>
              <p className="text-[10px] font-medium text-gray-400 -mt-0.5 hidden sm:block">by Pakistan Association of Dermatologists</p>
            </div>
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
              Pakistan Association of Dermatologist Platform
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


      {/* Footer */}
      <footer className="bg-white">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            <p className="font-bold text-gray-900 text-sm">PAD APP</p>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Pakistan Association of Dermatologists. All rights reserved. Powered by Helix Rederm
          </p>
        </div>
      </footer>
    </div>
  );
}
