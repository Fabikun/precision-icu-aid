import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function SAFITool() {
  const [spo2, setSpo2] = useState("");
  const [fio2, setFio2] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const a = num(spo2), b = num(fio2);
    if (a === null || b === null || b <= 0) {
      setResult({ empty: false, severity: "neutral", title: "SaFi", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const v = (a / b) * 100;
    const sev = v < 160 ? "danger" : v < 310 ? "warn" : v <= 460 ? "info" : "ok";
    const interp = v < 160 ? "Severo" : v < 310 ? "Moderado" : v <= 460 ? "Leve" : "Sin alteración en este rango";
    setResult({ empty: false, title: "SaFi", value: v.toFixed(1), severity: sev, interpretation: interp });
  };

  const reset = () => { setSpo2(""); setFio2(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Calculadora SaFi"
      subtitle="Equivalente no invasivo de PaFi"
      formula={<><strong>Fórmula:</strong> SaFi = (SpO₂ / FiO₂%) × 100 · <em>FiO₂ aquí en porcentaje (50% = 50).</em></>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Equivalencia con PaFi:</strong> 310–460 leve · 160–310 moderado · &lt;160 severo.</>}
    >
      <NumberField label="SpO₂" unit="%" placeholder="Ej: 92" value={spo2} onChange={(e) => setSpo2(e.target.value)} step="0.1" />
      <NumberField label="FiO₂" hint="porcentaje" unit="%" placeholder="Ej: 50" value={fio2} onChange={(e) => setFio2(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
