import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  Mail,
  CreditCard,
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
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r bg-stone-50">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Mail className="h-5 w-5 text-stone-900" />
          <span className="font-semibold tracking-tight">VibeInvite</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="w-full justify-start gap-2.5 px-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{user?.email}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  );
}
