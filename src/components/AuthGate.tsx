import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import type { ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading, session, authorized } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !authorized) {
    return <Login />;
  }

  return <>{children}</>;
}
