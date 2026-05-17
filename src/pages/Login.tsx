import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert } from "lucide-react";
import codexLogo from "@/assets/codex-logo.png";

const DENIAL_MESSAGES: Record<string, string> = {
  not_found:
    "Este correo no tiene acceso activo a Codex Tools. Si compraste la herramienta y crees que esto es un error, escríbenos a contacto@codex-ed.com.",
  expired:
    "Tu acceso a Codex Tools ha vencido. Para renovarlo, revisa las instrucciones enviadas por Codex.",
  blocked:
    "Tu acceso a Codex Tools está inactivo. Si crees que esto es un error, escríbenos a contacto@codex-ed.com.",
  error:
    "No pudimos validar tu acceso en este momento. Intenta nuevamente en unos minutos.",
};

export default function Login() {
  const { session, denialReason, signOut, revalidate } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Acceder · Codex Tools";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setFormError(
          error.message.toLowerCase().includes("invalid")
            ? "Correo o contraseña incorrectos."
            : "No pudimos iniciar sesión. Intenta nuevamente.",
        );
      } else {
        await revalidate();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const blocked = !!session && !!denialReason;
  const denialText = denialReason ? DENIAL_MESSAGES[denialReason] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border/70 grid place-items-center shadow-glow overflow-hidden">
              <img src={codexLogo} alt="Codex" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
              Accede a Codex Tools
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Ingresa con el correo asociado a tu compra.
            </p>
          </div>

          {blocked && denialText && (
            <div className="mb-5 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive-foreground/90 flex gap-2.5">
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
              <p className="leading-snug">{denialText}</p>
            </div>
          )}

          {!blocked && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="bg-surface-2 border-border/70 h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-surface-2 border-border/70 h-11"
                />
              </div>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-semibold"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ingresar"}
              </Button>
            </form>
          )}

          {blocked && (
            <Button
              onClick={signOut}
              variant="outline"
              className="w-full h-11 mt-2"
            >
              Usar otra cuenta
            </Button>
          )}

          <p className="mt-8 text-[11px] leading-relaxed text-center text-muted-foreground/80">
            Codex Tools es una herramienta educativa de apoyo clínico y no reemplaza el juicio profesional.
          </p>
        </div>
      </main>
    </div>
  );
}
