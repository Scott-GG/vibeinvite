import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Cookies can only be set in Server Actions or Route Handlers.
          }
        },
      },
    },
  );
}

/**
 * Get the authenticated user, or null if not authenticated.
 * Uses getSession (fast, local) since the proxy already validates the token.
 * Returns null instead of throwing on network errors.
 */
export async function getUserSafe(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  } catch {
    return null;
  }
}

/**
 * Require an authenticated user. Redirects to /login if not authenticated.
 * Use this in protected server pages instead of manually calling getUser().
 */
export async function requireUser(): Promise<User> {
  const user = await getUserSafe();
  if (!user) redirect("/login");
  return user;
}
