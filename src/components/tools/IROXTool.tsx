import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function IROXTool() {
  const [spo2, setSpo2] = useState("");
  const [fio2, setFio2] = useState("");
  const [fr, setFr] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const a = num(spo2), b = num(fio2), c = num(fr);
    if (a === null || b === null || c === null || b <= 0 || c <= 0) {
      setResult({ empty: false, severity: "neutral", title: "iROX", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const irox = (a / b) / c;
    const sev = irox > 4.8 ? "ok" : "warn";
    setResult({
      empty: false,
      title: "iROX",
      value: irox.toFixed(2),
      severity: sev,
      interpretation: sev === "ok" ? "Menor riesgo de intubación" : "Interpretar según tiempo: 2h <2.85 · 6h <3.47 · 12h <3.85 sugieren mayor riesgo de fracaso de CNAF.",
    });
  };

  const reset = () => { setSpo2(""); setFio2(""); setFr(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Calculadora iROX"
      subtitle="Predicción de fracaso de cánula nasal de alto flujo"
      showVmiCourse
      formula={<><strong>Fórmula:</strong> iROX = (SpO₂ / FiO₂) / FR · <em>FiO₂ en decimal (50% = 0.50).</em></>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Cortes:</strong> 2h &lt;2.85 · 6h &lt;3.47 · 12h &lt;3.85 → mayor riesgo de fracaso · &gt;4.8 → menor riesgo de intubación.</>}
    >
      <NumberField label="SpO₂" unit="%" placeholder="Ej: 92" value={spo2} onChange={(e) => setSpo2(e.target.value)} step="0.1" />
      <NumberField label="FiO₂" hint="decimal" unit="" placeholder="Ej: 0.50" value={fio2} onChange={(e) => setFio2(e.target.value)} step="0.01" />
      <NumberField label="Frecuencia respiratoria" unit="rpm" placeholder="Ej: 28" value={fr} onChange={(e) => setFr(e.target.value)} step="1" />
    </ToolShell>
  );
}
