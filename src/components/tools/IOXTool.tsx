import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function IOXTool() {
  const [pmva, setPmva] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const p = num(pmva), f = num(fio2), o = num(pao2);
    if (p === null || f === null || o === null || p <= 0 || f <= 0 || o <= 0) {
      setResult({ empty: false, severity: "neutral", title: "IOx", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const v = (p * f * 100) / o;
    const sev = v < 5 ? "ok" : v < 10 ? "warn" : v < 15 ? "danger" : "danger";
    const interp = v < 5 ? "Compromiso leve" : v < 10 ? "Compromiso moderado" : v < 15 ? "SDRA significativo" : "Alto riesgo";
    setResult({ empty: false, title: "IOx", value: v.toFixed(2), severity: sev, interpretation: interp });
  };

  const reset = () => { setPmva(""); setFio2(""); setPao2(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Índice de Oxigenación (IOx)"
      subtitle="Incorpora soporte ventilatorio (Pmva)"
      showVmiCourse
      formula={<><strong>Fórmula:</strong> IOx = (Pmva × FiO₂ × 100) / PaO₂ · <em>FiO₂ decimal · Pmva en cmH₂O.</em></>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Cortes:</strong> &lt;5 leve · 5–10 moderado · &gt;10 grave. IOx puede reflejar mejor gravedad que PaFi aislado.</>}
    >
      <NumberField label="Pmva" unit="cmH₂O" placeholder="Ej: 12" value={pmva} onChange={(e) => setPmva(e.target.value)} step="0.1" />
      <NumberField label="FiO₂" hint="decimal" placeholder="Ej: 0.60" value={fio2} onChange={(e) => setFio2(e.target.value)} step="0.01" />
      <NumberField label="PaO₂" unit="mmHg" placeholder="Ej: 80" value={pao2} onChange={(e) => setPao2(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
