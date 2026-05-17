import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthorizedRow = {
  email: string;
  status: string;
  plan: "founder" | "annual" | "student" | "institutional" | "demo" | string;
  expires_at: string | null;
};

export type AuthDenialReason = "not_found" | "expired" | "blocked" | "error" | null;

type AuthCtx = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  authorized: AuthorizedRow | null;
  denialReason: AuthDenialReason;
  signOut: () => Promise<void>;
  revalidate: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState<AuthorizedRow | null>(null);
  const [denialReason, setDenialReason] = useState<AuthDenialReason>(null);

  const validate = useCallback(async (s: Session | null) => {
    if (!s?.user?.email) {
      setAuthorized(null);
      setDenialReason(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("authorized_users")
        .select("email,status,plan,expires_at")
        .eq("email", s.user.email)
        .maybeSingle();

      if (error) {
        setAuthorized(null);
        setDenialReason("error");
        return;
      }
      if (!data) {
        setAuthorized(null);
        setDenialReason("not_found");
        return;
      }
      if (data.status !== "active") {
        setAuthorized(null);
        setDenialReason("blocked");
        return;
      }
      if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
        setAuthorized(null);
        setDenialReason("expired");
        return;
      }
      setAuthorized(data as AuthorizedRow);
      setDenialReason(null);
    } catch {
      setAuthorized(null);
      setDenialReason("error");
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Defer Supabase call to avoid deadlock inside the callback
      setTimeout(() => {
        validate(s).finally(() => setLoading(false));
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      validate(s).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, [validate]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(null);
    setDenialReason(null);
  }, []);

  const revalidate = useCallback(async () => {
    setLoading(true);
    const { data: { session: s } } = await supabase.auth.getSession();
    setSession(s);
    await validate(s);
    setLoading(false);
  }, [validate]);

  return (
    <Ctx.Provider
      value={{
        loading,
        session,
        user: session?.user ?? null,
        authorized,
        denialReason,
        signOut,
        revalidate,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
