import { useEffect } from "react";
import { AppHeader } from "@/components/codex/AppHeader";
import { BottomNav } from "@/components/codex/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Mail, BadgeCheck, CalendarClock } from "lucide-react";

const PLAN_LABEL: Record<string, string> = {
  founder: "Founder",
  annual: "Annual",
  student: "Student",
  institutional: "Institutional",
  demo: "Demo",
};

function formatExpiration(plan: string, expiresAt: string | null) {
  if (plan === "founder" && !expiresAt) return "Sin vencimiento";
  if (!expiresAt) return "Sin vencimiento";
  try {
    return new Date(expiresAt).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Profile() {
  const { user, authorized, signOut } = useAuth();

  useEffect(() => {
    document.title = "Mi cuenta · Codex Tools";
  }, []);

  const plan = authorized?.plan ?? "annual";
  const planLabel = PLAN_LABEL[plan] ?? plan;
  const statusLabel = authorized?.status === "active" ? "Activo" : "Bloqueado";
  const expiration = formatExpiration(plan, authorized?.expires_at ?? null);

  return (
    <div className="min-h-screen pb-28">
      <AppHeader title="Mi cuenta" subtitle="Acceso y suscripción" showBack />

      <main className="mx-auto max-w-2xl px-4 pt-4 space-y-4">
        <section className="rounded-2xl border border-border/70 bg-gradient-card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Correo</p>
              <p className="truncate text-sm font-medium">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Row icon={<BadgeCheck className="h-4 w-4 text-primary" />} label="Plan" value={planLabel} />
          <Row
            icon={<BadgeCheck className="h-4 w-4 text-success" />}
            label="Estado"
            value={statusLabel}
            valueClass={authorized?.status === "active" ? "text-success" : "text-destructive"}
          />
          <Row icon={<CalendarClock className="h-4 w-4 text-primary" />} label="Vencimiento" value={expiration} />
        </section>

        <Button
          variant="outline"
          onClick={signOut}
          className="w-full h-11 mt-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>

        <p className="text-[11px] leading-relaxed text-center text-muted-foreground/80 pt-2">
          Codex Tools es una herramienta educativa de apoyo clínico y no reemplaza el juicio profesional.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface-2/50 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1.5 text-sm font-semibold ${valueClass ?? ""}`}>{value}</p>
    </div>
  );
}
