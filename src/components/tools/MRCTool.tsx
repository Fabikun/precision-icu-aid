import { useState, useMemo } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import { cn } from "@/lib/utils";
import type { ToolResult } from "@/lib/codex";

interface MrcItem { key: string; label: string; side: "Derecha" | "Izquierda"; group: "upper" | "lower" }

const MRC_UPPER: MrcItem[] = [
  { key: "shoulder_abduction_r", label: "Abducción de hombro", side: "Derecha",  group: "upper" },
  { key: "shoulder_abduction_l", label: "Abducción de hombro", side: "Izquierda", group: "upper" },
  { key: "elbow_flexion_r",      label: "Flexión de codo",      side: "Derecha",  group: "upper" },
  { key: "elbow_flexion_l",      label: "Flexión de codo",      side: "Izquierda", group: "upper" },
  { key: "wrist_extension_r",    label: "Extensión de muñeca",  side: "Derecha",  group: "upper" },
  { key: "wrist_extension_l",    label: "Extensión de muñeca",  side: "Izquierda", group: "upper" },
];
const MRC_LOWER: MrcItem[] = [
  { key: "hip_flexion_r",         label: "Flexión de cadera",      side: "Derecha",  group: "lower" },
  { key: "hip_flexion_l",         label: "Flexión de cadera",      side: "Izquierda", group: "lower" },
  { key: "knee_extension_r",      label: "Extensión de rodilla",   side: "Derecha",  group: "lower" },
  { key: "knee_extension_l",      label: "Extensión de rodilla",   side: "Izquierda", group: "lower" },
  { key: "ankle_dorsiflexion_r",  label: "Dorsiflexión de tobillo", side: "Derecha",  group: "lower" },
  { key: "ankle_dorsiflexion_l",  label: "Dorsiflexión de tobillo", side: "Izquierda", group: "lower" },
];
const ALL = [...MRC_UPPER, ...MRC_LOWER];

const limbClass = (score: number, max: number) => {
  const pct = (score / max) * 100;
  if (pct >= 90) return "Excelente";
  if (pct >= 75) return "Leve compromiso";
  if (pct >= 50) return "Compromiso moderado";
  return "Compromiso severo";
};

const totalClass = (total: number) => {
  if (total >= 48) return { text: "Fuerza normal o casi normal", sev: "ok" as const };
  if (total >= 36) return { text: "Debilidad adquirida en UCI",   sev: "warn" as const };
  return { text: "Debilidad adquirida en UCI severa", sev: "danger" as const };
};

const OPT = [0,1,2,3,4,5].map((v) => ({ value: v, label: String(v) }));

export default function MRCTool() {
  const [state, setState] = useState<Record<string, number>>(
    Object.fromEntries(ALL.map((i) => [i.key, 0]))
  );
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const sum = (keys: string[]) => keys.reduce((a, k) => a + (state[k] ?? 0), 0);
  const avg = (keys: string[]) => sum(keys) / keys.length;

  const upperKeys = MRC_UPPER.map((i) => i.key);
  const lowerKeys = MRC_LOWER.map((i) => i.key);
  const upperScore = sum(upperKeys);
  const lowerScore = sum(lowerKeys);
  const total = upperScore + lowerScore;
  const completed = Object.values(state).filter((v) => v > 0).length;
  const tCls = totalClass(total);

  const limbVisual = (val: number) => {
    const opacity = 0.2 + (val / 5) * 0.8;
    const width = 2 + (val / 5) * 5;
    return { opacity, width };
  };

  const right = useMemo(() => limbVisual(avg(["shoulder_abduction_r","elbow_flexion_r","wrist_extension_r"])), [state]);
  const left  = useMemo(() => limbVisual(avg(["shoulder_abduction_l","elbow_flexion_l","wrist_extension_l"])), [state]);
  const rLeg  = useMemo(() => limbVisual(avg(["hip_flexion_r","knee_extension_r","ankle_dorsiflexion_r"])), [state]);
  const lLeg  = useMemo(() => limbVisual(avg(["hip_flexion_l","knee_extension_l","ankle_dorsiflexion_l"])), [state]);

  const calc = () => {
    setResult({
      empty: false,
      title: "MRC Sum Score",
      value: String(total),
      unit: "/ 60",
      severity: tCls.sev,
      interpretation: tCls.text,
      rows: [
        { label: "Miembros superiores", value: `${upperScore}`, unit: "/30", severity: limbClass(upperScore, 30) === "Compromiso severo" ? "danger" : limbClass(upperScore, 30) === "Compromiso moderado" ? "warn" : "ok" },
        { label: "Miembros inferiores", value: `${lowerScore}`, unit: "/30", severity: limbClass(lowerScore, 30) === "Compromiso severo" ? "danger" : limbClass(lowerScore, 30) === "Compromiso moderado" ? "warn" : "ok" },
      ],
      note: `Campos con puntaje > 0: ${completed}/12`,
    });
  };
  const reset = () => {
    setState(Object.fromEntries(ALL.map((i) => [i.key, 0])));
    setResult({ empty: true });
  };

  const setVal = (key: string, value: number) => setState((s) => ({ ...s, [key]: value }));

  return (
    <ToolShell
      title="MRC Sum Score"
      subtitle="Fuerza muscular global · 0 a 60"
      formula={<>
        <strong>Escala MRC (0–5):</strong> 0 sin contracción · 1 visible/palpable · 2 con gravedad eliminada · 3 contra gravedad · 4 con resistencia · 5 normal.
      </>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
    >
      {/* Live summary */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryBox label="MS" value={upperScore} max={30} sev={limbClass(upperScore, 30)} />
        <SummaryBox label="MI" value={lowerScore} max={30} sev={limbClass(lowerScore, 30)} />
        <SummaryBox label="Total" value={total} max={60} sev={tCls.text} dark />
      </div>

      {/* Body figure */}
      <div className="rounded-2xl border border-border bg-surface-2 p-3 flex justify-center">
        <svg viewBox="0 0 260 360" className="h-[220px] w-auto" aria-label="Figura corporal MRC">
          <circle cx="130" cy="48" r="26" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
          <line x1="130" y1="74" x2="130" y2="170" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeLinecap="round" />
          <line x1="130" y1="100" x2="66"  y2="148" stroke="hsl(var(--success))" strokeOpacity={left.opacity}  strokeWidth={left.width}  strokeLinecap="round" />
          <line x1="130" y1="100" x2="194" y2="148" stroke="hsl(var(--success))" strokeOpacity={right.opacity} strokeWidth={right.width} strokeLinecap="round" />
          <line x1="130" y1="170" x2="86"  y2="296" stroke="hsl(var(--info))"    strokeOpacity={lLeg.opacity}  strokeWidth={lLeg.width}  strokeLinecap="round" />
          <line x1="130" y1="170" x2="174" y2="296" stroke="hsl(var(--info))"    strokeOpacity={rLeg.opacity}  strokeWidth={rLeg.width}  strokeLinecap="round" />
          <text x="38"  y="150" fill="hsl(var(--muted-foreground))" fontSize="11">MS izq</text>
          <text x="190" y="150" fill="hsl(var(--muted-foreground))" fontSize="11">MS der</text>
          <text x="50"  y="316" fill="hsl(var(--muted-foreground))" fontSize="11">MI izq</text>
          <text x="160" y="316" fill="hsl(var(--muted-foreground))" fontSize="11">MI der</text>
        </svg>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground/90">Miembros superiores</h3>
        <div className="grid grid-cols-2 gap-2">
          {MRC_UPPER.map((it) => (
            <SelectField key={it.key}
              label={`${it.label} · ${it.side}`}
              value={state[it.key]}
              onChange={(e) => setVal(it.key, parseInt(e.target.value, 10))}
              options={OPT}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground/90">Miembros inferiores</h3>
        <div className="grid grid-cols-2 gap-2">
          {MRC_LOWER.map((it) => (
            <SelectField key={it.key}
              label={`${it.label} · ${it.side}`}
              value={state[it.key]}
              onChange={(e) => setVal(it.key, parseInt(e.target.value, 10))}
              options={OPT}
            />
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

function SummaryBox({ label, value, max, sev, dark }: { label: string; value: number; max: number; sev: string; dark?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("rounded-xl border border-border p-3", dark ? "bg-gradient-card" : "bg-surface")}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-2xl font-semibold font-mono-num">{value}</span>
        <span className="text-xs text-muted-foreground">/{max}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{sev}</div>
    </div>
  );
}
