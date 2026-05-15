import { cn } from "@/lib/utils";
import { RotateCcw, Calculator } from "lucide-react";
import { CodexCourseBanner } from "@/components/codex/CodexCourseBanner";

interface ToolShellProps {
  title: string;
  subtitle?: string;
  formula?: React.ReactNode;
  children: React.ReactNode;
  result: React.ReactNode;
  onCalculate?: () => void;
  onReset?: () => void;
  calcLabel?: string;
  footnote?: React.ReactNode;
  /** When true, calculation is automatic and no calc button is shown */
  liveOnly?: boolean;
  /** When true, shows the CODEX VMI online course banner at the bottom */
  showVmiCourse?: boolean;
}

export function ToolShell({
  title,
  subtitle,
  formula,
  children,
  result,
  onCalculate,
  onReset,
  calcLabel = "Calcular",
  footnote,
  liveOnly,
  showVmiCourse,
}: ToolShellProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="font-display text-[22px] font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground text-balance">{subtitle}</p> : null}
      </div>

      {formula ? (
        <div className={cn("info-block")}>
          {formula}
        </div>
      ) : null}

      <div className="glass-card p-5 sm:p-6">
        <div className="space-y-4">{children}</div>

        {!liveOnly ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={onCalculate} className="btn-primary">
              <Calculator className="h-4 w-4" />
              {calcLabel}
            </button>
            <button type="button" onClick={onReset} className="btn-ghost">
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button type="button" onClick={onReset} className="btn-ghost w-full">
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </button>
          </div>
        )}
      </div>

      <div>{result}</div>

      {footnote ? <div className="info-block">{footnote}</div> : null}

      {showVmiCourse ? <CodexCourseBanner /> : null}
    </div>
  );
}
