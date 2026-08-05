import Link from "next/link";
import { cookies } from "next/headers";
import {
  LayoutDashboard, UserCheck, Users, Newspaper, Calendar,
  BookOpen, ClipboardList, MessageCircleQuestion, Settings, ShieldCheck,
} from "lucide-react";
import { verifySession, ADMIN_COOKIE } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

async function getCurrentAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  return session;
}

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/registrations", label: "Registrations", icon: UserCheck },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/research", label: "Research", icon: BookOpen },
  { href: "/admin/surveys", label: "Surveys", icon: ClipboardList },
  { href: "/admin/experts", label: "Ask the Expert", icon: MessageCircleQuestion },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-gray-300 min-h-screen sticky top-0">
        <div className="px-6 py-6 flex items-center gap-2.5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-full bg-crimson-600 flex items-center justify-center text-white font-bold">
            R
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Rederm Connect</p>
            <p className="text-[11px] text-gray-500">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
            <ShieldCheck size={14} /> {admin?.name ?? "Admin"}
          </div>
          <SignOutButton className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950 w-full text-left" />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-10 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-crimson-600 flex items-center justify-center font-bold text-sm">R</div>
            <span className="font-bold text-sm">Admin Console</span>
          </div>
          <SignOutButton className="text-xs text-red-300" />
        </header>

        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
