export type Severity = "ok" | "info" | "warn" | "danger" | "neutral";

export interface InterpretationLine {
  label?: string;
  value?: string | number;
  unit?: string;
  severity?: Severity;
  note?: string;
}

export interface ToolResult {
  /** Headline numeric result, e.g. "PaFi" */
  title?: string;
  /** Big primary number to display */
  value?: string;
  unit?: string;
  /** Overall severity color of the result */
  severity?: Severity;
  /** Short interpretation line under the value */
  interpretation?: string;
  /** Extra rows (driver pressure, compliance, etc.) */
  rows?: InterpretationLine[];
  /** Free-form helper note */
  note?: string;
  /** Set when no result is available yet */
  empty?: boolean;
}

export const emptyResult: ToolResult = { empty: true };

export const severityClasses: Record<Severity, { dot: string; text: string; bg: string; ring: string; label: string }> = {
  ok:      { dot: "bg-success",     text: "text-success",     bg: "bg-success/10",     ring: "ring-success/30",     label: "Favorable" },
  info:    { dot: "bg-info",        text: "text-info",        bg: "bg-info/10",        ring: "ring-info/30",        label: "Informativo" },
  warn:    { dot: "bg-warning",     text: "text-warning",     bg: "bg-warning/10",     ring: "ring-warning/30",     label: "Vigilar" },
  danger:  { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10", ring: "ring-destructive/30", label: "Crítico" },
  neutral: { dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/40", ring: "ring-border", label: "Sin datos" },
};

export function num(v: string | number | undefined | null): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
