import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert } from "lucide-react";
import codexLogo from "@/assets/codex-logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Restablecer contraseña · Codex Tools";

    let cancelled = false;

    const verifyRecovery = async () => {
      // Check if URL has a recovery hash. Supabase client will auto-exchange it
      // into a session on load, so we just need to wait briefly then validate.
      const hasRecoveryHash = window.location.hash.includes("type=recovery");

      if (!hasRecoveryHash) {
        // No recovery token in URL; check if there's already a valid session.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) navigate("/", { replace: true });
          return;
        }
        // Session exists but we got here without a recovery hash.
        // Still allow it so the user can set a new password.
      }

      // Wait up to ~3 seconds for Supabase to exchange the recovery token into a session.
      let attempts = 0;
      while (attempts < 15) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!cancelled) {
            setRecoveryReady(true);
            setChecking(false);
          }
          return;
        }
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      // No session established after waiting — redirect to login.
      if (!cancelled) {
        setChecking(false);
        navigate("/", { replace: true });
      }
    };

    verifyRecovery();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    }, 3000);
    return () => clearTimeout(t);
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) {
        setError("Hubo un error al actualizar tu contraseña. Intenta nuevamente.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Hubo un error al actualizar tu contraseña. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!recoveryReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando enlace de recuperación…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border/70 grid place-items-center shadow-glow overflow-hidden">
              <img src={codexLogo} alt="Codex" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
              Restablecer contraseña
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Define una nueva contraseña para tu cuenta.
            </p>
          </div>

          {success ? (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground/90 text-center">
              <p>Tu contraseña fue actualizada. Ahora puedes ingresar.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Nueva contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-surface-2 border-border/70 h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs text-muted-foreground">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="bg-surface-2 border-border/70 h-11"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground/90 flex gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-destructive" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-semibold"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar contraseña"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
