import { useState, useEffect, useMemo } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import { CodexPediatricCourseBanner } from "@/components/codex/CodexPediatricCourseBanner";
import type { ToolResult } from "@/lib/codex";

const STORAGE_KEY = "codex:ped:tal";

type Edad = "lt6" | "ge6";

interface State {
  edad: Edad;
  fr: number;
  sib: number;
  sat: number;
  mus: number;
}

const DEFAULT: State = { edad: "lt6", fr: 0, sib: 0, sat: 0, mus: 0 };

const frLt6 = [
  { value: 0, label: "0 — ≤40 rpm" },
  { value: 1, label: "1 — 41–55 rpm" },
  { value: 2, label: "2 — 56–70 rpm" },
  { value: 3, label: "3 — ≥71 rpm" },
];

const frGe6 = [
  { value: 0, label: "0 — ≤30 rpm" },
  { value: 1, label: "1 — 31–45 rpm" },
  { value: 2, label: "2 — 46–60 rpm" },
  { value: 3, label: "3 — ≥61 rpm" },
];

export default function TalScoreTool() {
  const [s, setS] = useState<State>(DEFAULT);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setS({ ...DEFAULT, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
  }, [s]);

  const frOpts = useMemo(() => (s.edad === "lt6" ? frLt6 : frGe6), [s.edad]);

  const set = <K extends keyof State>(k: K, v: State[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const calc = () => {
    const total = s.fr + s.sib + s.sat + s.mus;
    let interpretation = "";
    let severity: ToolResult["severity"] = "ok";

    if (total <= 3) { interpretation = "Bronquiolitis leve"; severity = "ok"; }
    else if (total <= 8) { interpretation = "Bronquiolitis moderada"; severity = "warn"; }
    else { interpretation = "Bronquiolitis grave"; severity = "danger"; }

    setResult({
      empty: false,
      title: "Tal modificado",
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
        title="Tal score modificado"
        subtitle="Severidad de bronquiolitis pediátrica (0–12)."
        formula={
          <>
            <strong>Total</strong> = FR + sibilancias + SatO₂ + musculatura accesoria.
            0–3 leve · 4–8 moderado · 9–12 grave.
          </>
        }
        onCalculate={calc}
        onReset={reset}
        result={<ResultPanel result={result} />}
        footnote={<>Uso clínico orientativo. No reemplaza juicio clínico.</>}
      >
        <SelectField
          label="Edad"
          value={s.edad}
          onChange={(e) => set("edad", e.target.value as Edad)}
          options={[
            { value: "lt6", label: "< 6 meses" },
            { value: "ge6", label: "≥ 6 meses" },
          ]}
        />
        <SelectField
          label="Frecuencia respiratoria"
          hint={s.edad === "lt6" ? "<6 meses" : "≥6 meses"}
          value={s.fr}
          onChange={(e) => set("fr", parseInt(e.target.value, 10))}
          options={frOpts}
        />
        <SelectField
          label="Sibilancias"
          value={s.sib}
          onChange={(e) => set("sib", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — No" },
            { value: 1, label: "1 — Espiración" },
            { value: 2, label: "2 — Insp + esp (con estetoscopio)" },
            { value: 3, label: "3 — Audibles sin estetoscopio" },
          ]}
        />
        <SelectField
          label="Saturación O₂"
          value={s.sat}
          onChange={(e) => set("sat", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — ≥95%" },
            { value: 1, label: "1 — 92–94%" },
            { value: 2, label: "2 — 90–91%" },
            { value: 3, label: "3 — ≤89%" },
          ]}
        />
        <SelectField
          label="Musculatura accesoria"
          value={s.mus}
          onChange={(e) => set("mus", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — No" },
            { value: 1, label: "1 — Leve" },
            { value: 2, label: "2 — Moderado" },
            { value: 3, label: "3 — Severo" },
          ]}
        />
      </ToolShell>

      <div className="mt-6">
        <CodexPediatricCourseBanner />
      </div>
    </>
  );
}
