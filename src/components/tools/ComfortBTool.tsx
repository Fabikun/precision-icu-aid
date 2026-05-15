import { useState, useEffect, useMemo } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import { CodexPediatricCourseBanner } from "@/components/codex/CodexPediatricCourseBanner";
import type { ToolResult } from "@/lib/codex";

const STORAGE_KEY = "codex:ped:comfortb";

type Mode = "vm" | "novm";

interface State {
  mode: Mode;
  conciencia: number;
  calma: number;
  respiratoria: number;
  movimientos: number;
  tono: number;
  facial: number;
}

const DEFAULT: State = {
  mode: "vm",
  conciencia: 1,
  calma: 1,
  respiratoria: 1,
  movimientos: 1,
  tono: 1,
  facial: 1,
};

const opt = (items: string[]) =>
  items.map((label, i) => ({ value: i + 1, label: `${i + 1} — ${label}` }));

const concienciaOpts = opt([
  "Sueño profundo",
  "Sueño superficial",
  "Somnoliento",
  "Despierto y alerta",
  "Hiperalerta",
]);

const calmaOpts = opt([
  "Calmado",
  "Ligeramente ansioso",
  "Ansioso",
  "Muy ansioso",
  "Pánico",
]);

const respVmOpts = opt([
  "No respiración espontánea ni tos",
  "Respiración espontánea, acoplado",
  "Tos ocasional / resistencia leve",
  "Lucha contra el respirador",
  "Lucha constante / tos intensa",
]);

const respNoVmOpts = opt([
  "Respiración tranquila",
  "Sollozo ocasional",
  "Llanto leve",
  "Llanto",
  "Grito / inconsolable",
]);

const movOpts = opt([
  "Sin movimientos",
  "Movimientos leves ocasionales",
  "Movimientos frecuentes leves",
  "Movimientos vigorosos en extremidades",
  "Movimientos vigorosos generalizados",
]);

const tonoOpts = opt([
  "Tono muscular relajado / nulo",
  "Tono muscular reducido",
  "Tono muscular normal",
  "Tono aumentado, flexión dedos/manos/pies",
  "Rigidez muscular extrema",
]);

const facialOpts = opt([
  "Musculatura facial totalmente relajada",
  "Tono facial normal",
  "Tensión evidente en algunos músculos",
  "Tensión en toda la musculatura facial",
  "Muecas faciales / distorsión",
]);

export default function ComfortBTool() {
  const [s, setS] = useState<State>(DEFAULT);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  // Cargar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setS({ ...DEFAULT, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);

  // Guardar
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
  }, [s]);

  const respOpts = useMemo(() => (s.mode === "vm" ? respVmOpts : respNoVmOpts), [s.mode]);

  const set = <K extends keyof State>(key: K, val: State[K]) =>
    setS((prev) => ({ ...prev, [key]: val }));

  const calc = () => {
    const total =
      s.conciencia + s.calma + s.respiratoria + s.movimientos + s.tono + s.facial;

    let interpretation = "";
    let severity: ToolResult["severity"] = "ok";

    if (total <= 8) {
      interpretation = "Sobresedación profunda";
      severity = "info";
    } else if (total <= 10) {
      interpretation = "Sedación profunda";
      severity = "info";
    } else if (total <= 22) {
      interpretation = "Sedación adecuada";
      severity = "ok";
    } else {
      interpretation = "Infrasedación / agitación";
      severity = "danger";
    }

    setResult({
      empty: false,
      title: "COMFORT-B",
      value: String(total),
      severity,
      interpretation,
      note: "Uso clínico orientativo. No reemplaza juicio clínico.",
    });
  };

  const reset = () => {
    setS(DEFAULT);
    setResult({ empty: true });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  };

  return (
    <>
      <ToolShell
        title="COMFORT-B"
        subtitle="Sedoanalgesia pediátrica · 6 variables (1–5). Total: 6–30."
        formula={
          <>
            <strong>Score total</strong> = conciencia + calma + respiratoria + movimientos + tono + tensión facial.
            Rangos: 6–8 sobresedación profunda · 9–10 profunda · 11–22 adecuada · 23–30 infrasedación.
          </>
        }
        onCalculate={calc}
        onReset={reset}
        result={<ResultPanel result={result} />}
        footnote={<>Uso clínico orientativo. No reemplaza juicio clínico.</>}
      >
        <SelectField
          label="Tipo de paciente"
          value={s.mode}
          onChange={(e) => set("mode", e.target.value as Mode)}
          options={[
            { value: "vm", label: "Con ventilación mecánica" },
            { value: "novm", label: "Sin ventilación mecánica" },
          ]}
        />
        <SelectField
          label="Nivel de conciencia"
          value={s.conciencia}
          onChange={(e) => set("conciencia", parseInt(e.target.value, 10))}
          options={concienciaOpts}
        />
        <SelectField
          label="Calma / agitación"
          value={s.calma}
          onChange={(e) => set("calma", parseInt(e.target.value, 10))}
          options={calmaOpts}
        />
        <SelectField
          label="Respuesta respiratoria"
          hint={s.mode === "vm" ? "Con VM" : "Sin VM"}
          value={s.respiratoria}
          onChange={(e) => set("respiratoria", parseInt(e.target.value, 10))}
          options={respOpts}
        />
        <SelectField
          label="Movimientos físicos"
          value={s.movimientos}
          onChange={(e) => set("movimientos", parseInt(e.target.value, 10))}
          options={movOpts}
        />
        <SelectField
          label="Tono muscular"
          value={s.tono}
          onChange={(e) => set("tono", parseInt(e.target.value, 10))}
          options={tonoOpts}
        />
        <SelectField
          label="Tensión facial"
          value={s.facial}
          onChange={(e) => set("facial", parseInt(e.target.value, 10))}
          options={facialOpts}
        />
      </ToolShell>

      <div className="mt-6">
        <CodexPediatricCourseBanner />
      </div>
    </>
  );
}
