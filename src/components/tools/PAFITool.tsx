import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function PAFITool() {
  const [pao2, setPao2] = useState("");
  const [fio2, setFio2] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const a = num(pao2), b = num(fio2);
    if (a === null || b === null || b <= 0) {
      setResult({ empty: false, severity: "neutral", title: "PaFi", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const v = a / b;
    const sev = v < 100 ? "danger" : v < 200 ? "warn" : v <= 300 ? "info" : "ok";
    const interp = v < 100 ? "Severo" : v < 200 ? "Moderado" : v <= 300 ? "Leve" : "Sin alteración en este rango";
    setResult({ empty: false, title: "PaFi", value: v.toFixed(1), severity: sev, interpretation: interp });
  };

  const reset = () => { setPao2(""); setFio2(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Calculadora PaFi"
      subtitle="Gravedad de hipoxemia (Berlin)"
      showVmiCourse
      formula={<><strong>Fórmula:</strong> PaFi = PaO₂ / FiO₂ · <em>FiO₂ en decimal (60% = 0.60).</em></>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Interpretación:</strong> 200–300 leve · 100–200 moderado · &lt;100 severo.</>}
    >
      <NumberField label="PaO₂" unit="mmHg" placeholder="Ej: 80" value={pao2} onChange={(e) => setPao2(e.target.value)} step="0.1" />
      <NumberField label="FiO₂" hint="decimal" placeholder="Ej: 0.40" value={fio2} onChange={(e) => setFio2(e.target.value)} step="0.01" />
    </ToolShell>
  );
}
