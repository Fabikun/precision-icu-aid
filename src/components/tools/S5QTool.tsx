import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

const QS = [
  "1. Míreme",
  "2. Abra y cierre los ojos",
  "3. Saque la lengua",
  "4. Levante las cejas cuando cuente 5",
  "5. Asienta con la cabeza",
];

export default function S5QTool() {
  const [v, setV] = useState<number[]>([0,0,0,0,0]);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const total = v.reduce((a, b) => a + b, 0);
    const sev = total >= 3 ? "ok" : "warn";
    setResult({
      empty: false, title: "S5Q", value: String(total), unit: "/ 5", severity: sev,
      interpretation: total >= 3 ? "Compatible con 'despertar' e inicio de fase de actividad" : "Menos de 3 respuestas positivas",
    });
  };
  const reset = () => { setV([0,0,0,0,0]); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Escala S5Q"
      subtitle="Despertar e inicio de actividad"
      formula={<><strong>3 o más respuestas positivas</strong> sugieren 'despertar' e inicio de fase de actividad.</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
    >
      {QS.map((q, i) => (
        <SelectField key={i} label={q} value={v[i]}
          onChange={(e) => { const c = [...v]; c[i] = parseInt(e.target.value, 10); setV(c); }}
          options={[{ value: 0, label: "No" }, { value: 1, label: "Sí" }]}
        />
      ))}
    </ToolShell>
  );
}
