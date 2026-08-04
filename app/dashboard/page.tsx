import Link from "next/link";
import { BookOpen, Activity, ArrowRight, Video, ClipboardList, PenTool, Users, MessageCircle } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #d32f2f 100%)' }}>
        <div className="relative z-10 max-w-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Where Experts Connect. Knowledge Evolves. Patients Transform.</h2>
          <button className="bg-white text-[var(--primary-color)] px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-50">
            Explore Network <ArrowRight size={18} />
          </button>
        </div>
        {/* Placeholder for banner image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-50 md:opacity-100" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600")', backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to right, transparent, black)' }}></div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-bold">Explore Network</h3>
        <Link href="/dashboard/network" className="text-sm font-semibold text-[var(--primary-color)]">View All</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/research" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <BookOpen size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">Clinical Updates</h4>
           <p className="text-xs text-muted">Latest guidelines & trials</p>
        </Link>

        <Link href="/dashboard/ai" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <Activity size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">AI Copilot</h4>
           <p className="text-xs text-muted">Trends & insights</p>
        </Link>

        <Link href="/dashboard/calculators" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <ClipboardList size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">Treatment Protocols</h4>
           <p className="text-xs text-muted">Research-backed approaches</p>
        </Link>

        <Link href="/dashboard/membership" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <Users size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">KOL Network</h4>
           <p className="text-xs text-muted">Connect with leading experts</p>
        </Link>

        <Link href="/dashboard/events" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <Video size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">CME & Webinars</h4>
           <p className="text-xs text-muted">Accredited learning sessions</p>
        </Link>

        <Link href="/dashboard/calculators" className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform border border-red-100 cursor-pointer">
           <PenTool size={32} className="text-crimson mb-3" />
           <h4 className="font-bold text-sm mb-1">Practice Tools</h4>
           <p className="text-xs text-muted">Calculators, scales & clinical tools</p>
        </Link>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Latest News Feed</h3>
        <div className="space-y-4">
           {/* Dummy Post 1 */}
           <div className="card">
              <div className="flex items-center gap-3 mb-3">
                 <img src="https://i.pravatar.cc/150?u=dr_ahmed" alt="Author" className="w-10 h-10 rounded-full" />
                 <div>
                    <h4 className="font-bold text-sm">Dr. Ahmed Ali</h4>
                    <p className="text-xs text-muted">2 hours ago</p>
                 </div>
              </div>
              <p className="text-sm mb-3">Just attended the PAD annual conference in Lahore. Excellent insights on the new biologics for psoriasis management.</p>
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" alt="Conference" className="w-full h-48 object-cover rounded-lg mb-3" />
              <div className="flex gap-4 text-sm text-muted border-t pt-3 mt-3">
                 <button className="flex items-center gap-1 hover:text-crimson"><Activity size={16}/> Like (24)</button>
                 <button className="flex items-center gap-1 hover:text-crimson"><MessageCircle size={16}/> Comment (5)</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
