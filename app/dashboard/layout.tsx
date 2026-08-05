import Link from "next/link";
import { cookies } from "next/headers";
import {
  Home, Users, Calendar, BookOpen, MessageCircle,
  HelpCircle, Activity, ClipboardList, Info, User,
  Bell, MessageSquare
} from "lucide-react";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { pool } from "@/lib/db";
import SignOutButton from "@/components/SignOutButton";

async function getCurrentMember() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  if (!session) return null;

  const result = await pool.query(
    `SELECT id, full_name, designation, photo_url, membership_number FROM registrations WHERE id = $1`,
    [session.id]
  );
  return result.rows[0] ?? null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <div className="px-6 mb-8 mt-4 flex items-center gap-2 text-crimson">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <span className="font-bold text-lg">REDERM</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard" className="sidebar-item active">
            <Home size={20} /> Home
          </Link>
          <Link href="/dashboard/membership" className="sidebar-item">
            <Users size={20} /> Membership
          </Link>
          <Link href="/dashboard/events" className="sidebar-item">
            <Calendar size={20} /> Events
          </Link>
          <Link href="/dashboard/research" className="sidebar-item">
            <BookOpen size={20} /> Research
          </Link>
          <Link href="/dashboard/ask" className="sidebar-item">
            <HelpCircle size={20} /> Ask the Expert
          </Link>
          <Link href="/dashboard/survey" className="sidebar-item">
            <ClipboardList size={20} /> Survey
          </Link>
          <Link href="/dashboard/chat" className="sidebar-item">
            <MessageCircle size={20} /> Chat
          </Link>
          <Link href="/dashboard/ai" className="sidebar-item">
            <Activity size={20} /> Derma AI
          </Link>
          <Link href="/dashboard/calculators" className="sidebar-item">
            <ClipboardList size={20} /> Calculators
          </Link>
          <Link href="/dashboard/about" className="sidebar-item">
            <Info size={20} /> About PAD
          </Link>
          <Link href="/dashboard/profile" className="sidebar-item">
            <User size={20} /> Profile
          </Link>
        </nav>
        
        <div className="mt-auto mb-4">
          <SignOutButton className="sidebar-item text-red-500 hover:bg-red-50 w-full text-left" />
        </div>
      </aside>

      <div className="main-content bg-[var(--bg-color)] min-h-screen">
        {/* Top Header */}
        <header className="top-header sticky top-0 bg-white z-10 shadow-sm border-b">
           <div className="flex items-center md:hidden">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
           </div>
           <div className="hidden md:flex flex-1">
             <h2 className="font-semibold">Welcome back, {member?.full_name ?? "Doctor"}</h2>
           </div>

           <div className="flex items-center gap-4 text-[var(--primary-color)]">
              <Link href="/dashboard/notifications" className="relative p-2">
                <Bell size={24} />
              </Link>
              <Link href="/dashboard/chat" className="relative p-2">
                <MessageSquare size={24} />
              </Link>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm ml-2">
                <img src={member?.photo_url || "https://i.pravatar.cc/150?u=default"} alt="Profile" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        <main className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 px-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center mb-16 md:mb-0">
          <div>Powered by Rederm Helix</div>
          <div>Developed by Softsols Pakistan</div>
        </footer>
      </div>

      {/* Mobile Nav */}
      <nav className="mobile-nav">
        <Link href="/dashboard" className="nav-item active">
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link href="/dashboard/membership" className="nav-item">
          <Users size={24} />
          <span>Network</span>
        </Link>
        <Link href="/dashboard/events" className="nav-item">
          <Calendar size={24} />
          <span>Events</span>
        </Link>
        <Link href="/dashboard/chat" className="nav-item">
          <MessageCircle size={24} />
          <span>Messages</span>
        </Link>
        <Link href="/dashboard/profile" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
