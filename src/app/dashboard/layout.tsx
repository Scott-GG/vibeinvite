import Link from "next/link";
import { Sparkles } from "lucide-react";
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
import { SidebarNav } from "./sidebar-nav";

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
          <Sparkles className="h-5 w-5 text-[#C9A84C]" />
          <span className="font-display text-lg tracking-wide text-[#FAF5E4]">
            VibeInvite
          </span>
        </Link>

        {/* Navigation */}
        <SidebarNav />

        {/* User menu */}
        <div className="border-t border-gold/10 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2.5 text-[#A89880] hover:text-[#C9A84C]"
                >
                  <Avatar
                    className="h-7 w-7"
                    style={{ border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <AvatarFallback
                      className="text-xs"
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        color: "#C9A84C",
                      }}
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
              className="w-48 border-[rgba(201,168,76,0.15)]"
              style={{ background: "#2A2420" }}
            >
              <DropdownMenuItem disabled className="text-xs text-[#A89880]">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ borderColor: "rgba(201,168,76,0.1)" }}
              />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" style={{ background: "#FAF7F2" }}>
        {children}
      </main>
    </div>
  );
}
