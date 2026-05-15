import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function VDVTTool() {
  const [paco2, setPaco2] = useState("");
  const [peco2, setPeco2] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const a = num(paco2), b = num(peco2);
    if (a === null || b === null || a <= 0 || b < 0 || b >= a) {
      setResult({ empty: false, severity: "neutral", title: "VD/VT", value: "—", interpretation: "Ingresa valores válidos (PECO₂ < PaCO₂)" });
      return;
    }
    const v = (a - b) / a;
    const sev = v < 0.4 ? "ok" : v < 0.6 ? "warn" : "danger";
    const interp = v < 0.4 ? "Rango habitual" : v < 0.6 ? "Espacio muerto elevado" : "Alteración importante / peor eficiencia ventilatoria";
    setResult({ empty: false, title: "VD/VT", value: v.toFixed(2), severity: sev, interpretation: interp });
  };

  const reset = () => { setPaco2(""); setPeco2(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Relación VD/VT"
      subtitle="Eficiencia ventilatoria — espacio muerto"
      showVmiCourse
      formula={<><strong>Fórmula:</strong> VD/VT = (PaCO₂ − PECO₂) / PaCO₂.</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Cortes:</strong> 0.20–0.40 habitual · 0.41–0.59 elevado · ≥0.60 alteración importante.</>}
    >
      <NumberField label="PaCO₂" unit="mmHg" placeholder="Ej: 45" value={paco2} onChange={(e) => setPaco2(e.target.value)} step="0.1" />
      <NumberField label="PECO₂" unit="mmHg" placeholder="Ej: 25" value={peco2} onChange={(e) => setPeco2(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
