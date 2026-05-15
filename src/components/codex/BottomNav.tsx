import { NavLink } from "react-router-dom";
import { Home, Brain } from "lucide-react";
import { LungIcon, RunningManIcon } from "@/components/codex/icons";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/c/respiratoria", label: "Respiratoria", icon: LungIcon },
  { to: "/c/fisica", label: "Física", icon: RunningManIcon },
  { to: "/c/general", label: "General", icon: Brain },
];

export function BottomNav() {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 safe-bottom",
        "border-t border-border/60 bg-background/80 backdrop-blur-xl"
      )}
      aria-label="Navegación principal"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-4 px-2 py-1.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "group flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "grid h-9 w-12 place-items-center rounded-xl transition-all",
                      isActive ? "bg-primary/15 ring-1 ring-primary/30" : "group-hover:bg-surface-2"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
