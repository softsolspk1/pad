import Link from "next/link";
import { 
  Home, Users, Calendar, BookOpen, MessageCircle, 
  HelpCircle, Activity, ClipboardList, Info, User, 
  LogOut, Bell, MessageSquare 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <Activity size={20} /> AI Copilot
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
          <Link href="/" className="sidebar-item text-red-500 hover:bg-red-50">
            <LogOut size={20} /> Sign Out
          </Link>
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
             <h2 className="font-semibold">Welcome back, Dr. Ayesha Khan</h2>
           </div>
           
           <div className="flex items-center gap-4 text-[var(--primary-color)]">
              <button className="relative p-2">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
              <button className="relative p-2">
                <MessageSquare size={24} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm ml-2">
                <img src="https://i.pravatar.cc/150?u=dr_ayesha" alt="Profile" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        <main className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
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
