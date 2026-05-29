import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { requireUser } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/events/new", label: "New Event", icon: PlusCircle },
  { href: "/dashboard/guests", label: "Guests", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="flex min-h-screen" style={{ background: "#FAF7F2" }}>
      {/* Dark sidebar */}
      <aside
        className="flex w-60 flex-col"
        style={{ background: "#1A1410" }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 border-b border-gold/10 px-5 py-4"
        >
          <Sparkles className="h-5 w-5" style={{ color: "#C9A84C" }} />
          <span
            className="font-display text-lg tracking-wide"
            style={{ color: "#FAF5E4" }}
          >
            VibeInvite
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={{ color: "#A89880" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                e.currentTarget.style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#A89880";
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="border-t border-gold/10 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2.5"
                  style={{ color: "#A89880" }}
                >
                  <Avatar className="h-7 w-7" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                    <AvatarFallback
                      className="text-xs"
                      style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{user?.email}</span>
                </Button>
              }
            />
            <DropdownMenuContent
              align="start"
              className="w-48"
              style={{ background: "#2A2420", borderColor: "rgba(201,168,76,0.15)" }}
            >
              <DropdownMenuItem
                disabled
                className="text-xs"
                style={{ color: "#A89880" }}
              >
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ borderColor: "rgba(201,168,76,0.1)" }} />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-auto"
        style={{ background: "#FAF7F2" }}
      >
        {children}
      </main>
    </div>
  );
}
