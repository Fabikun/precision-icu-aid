import { useState, useEffect } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import { CodexPediatricCourseBanner } from "@/components/codex/CodexPediatricCourseBanner";
import type { ToolResult } from "@/lib/codex";

const STORAGE_KEY = "codex:ped:scoreresp";

interface State {
  sib: number;
  tir: number;
  fr: number;
  fc: number;
  aire: number;
  cia: number;
}

const DEFAULT: State = { sib: 0, tir: 0, fr: 0, fc: 0, aire: 0, cia: 0 };

export default function WoodDownesTool() {
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

  const set = <K extends keyof State>(k: K, v: State[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const calc = () => {
    const total = s.sib + s.tir + s.fr + s.fc + s.aire + s.cia;
    let interpretation = "";
    let severity: ToolResult["severity"] = "ok";

    if (total === 0) {
      interpretation = "Sin criterios de gravedad relevantes según esta escala";
      severity = "ok";
    } else if (total <= 3) {
      interpretation = "Crisis leve";
      severity = "ok";
    } else if (total <= 7) {
      interpretation = "Crisis moderada";
      severity = "warn";
    } else {
      interpretation = "Crisis grave";
      severity = "danger";
    }

    setResult({
      empty: false,
      title: "Score respiratorio pediátrico modificado",
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
        title="Score respiratorio pediátrico modificado"
        subtitle="Gravedad clínica respiratoria pediátrica · 6 ítems clínicos. Total: 0–14."
        formula={
          <>
            <strong>Total</strong> = sibilancias + tiraje + FR + FC + entrada de aire + cianosis.
            0 sin criterios · 1–3 leve · 4–7 moderada · 8–14 grave.
          </>
        }
        onCalculate={calc}
        onReset={reset}
        result={<ResultPanel result={result} />}
        footnote={<>Uso clínico orientativo. No reemplaza juicio clínico.</>}
      >
        <SelectField
          label="Sibilancias"
          value={s.sib}
          onChange={(e) => set("sib", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — No" },
            { value: 1, label: "1 — Final espiración" },
            { value: 2, label: "2 — Toda la espiración" },
            { value: 3, label: "3 — Inspiración + espiración" },
          ]}
        />
        <SelectField
          label="Tiraje"
          value={s.tir}
          onChange={(e) => set("tir", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — No" },
            { value: 1, label: "1 — Subcostal / intercostal inferior" },
            { value: 2, label: "2 — Nivel 1 + supraclavicular + aleteo nasal" },
            { value: 3, label: "3 — Nivel 2 + intercostal inferior marcado + supraesternal" },
          ]}
        />
        <SelectField
          label="Frecuencia respiratoria (rpm)"
          value={s.fr}
          onChange={(e) => set("fr", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — <30" },
            { value: 1, label: "1 — 31–45" },
            { value: 2, label: "2 — 46–60" },
            { value: 3, label: "3 — >60" },
          ]}
        />
        <SelectField
          label="Frecuencia cardíaca (lpm)"
          value={s.fc}
          onChange={(e) => set("fc", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — <120" },
            { value: 1, label: "1 — >120" },
          ]}
        />
        <SelectField
          label="Entrada de aire"
          value={s.aire}
          onChange={(e) => set("aire", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — Buena" },
            { value: 1, label: "1 — Regular simétrica" },
            { value: 2, label: "2 — Muy disminuida simétrica" },
            { value: 3, label: "3 — Tórax silente, ausencia de sibilancias" },
          ]}
        />
        <SelectField
          label="Cianosis"
          value={s.cia}
          onChange={(e) => set("cia", parseInt(e.target.value, 10))}
          options={[
            { value: 0, label: "0 — No" },
            { value: 1, label: "1 — Sí" },
          ]}
        />
      </ToolShell>

      <div className="mt-6">
        <CodexPediatricCourseBanner />
      </div>
    </>
  );
}
