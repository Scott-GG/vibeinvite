"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to sign out");
    }
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  );
}
