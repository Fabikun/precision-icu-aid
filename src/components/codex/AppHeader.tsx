import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, UserCircle2 } from "lucide-react";
import codexLogo from "@/assets/codex-logo.png";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
}

export function AppHeader({ title, subtitle, showBack, rightSlot }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 safe-top",
        "backdrop-blur-xl bg-background/70 border-b border-border/60"
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        {showBack && !isHome ? (
          <button
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 border border-border/70 text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 border border-border/70 overflow-hidden shadow-glow"
            aria-label="Inicio"
          >
            <img src={codexLogo} alt="CODEX" className="h-9 w-9 object-contain" />
          </Link>
        )}

        <div className="min-w-0 flex-1">
          {title ? (
            <h1 className="truncate text-[15px] font-semibold leading-tight text-foreground">{title}</h1>
          ) : (
            <h1 className="text-[15px] font-semibold leading-tight">
              <span className="font-display tracking-tight">CODEX</span>
              <span className="ml-1 text-muted-foreground font-medium">Tools</span>
            </h1>
          )}
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>

        {rightSlot ?? (
          <Link
            to="/cuenta"
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 border border-border/70 text-foreground/80 hover:text-foreground transition-colors"
            aria-label="Mi cuenta"
          >
            <UserCircle2 className="h-5 w-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
