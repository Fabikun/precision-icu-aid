import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

export default function RASSTool() {
  const [v, setV] = useState(0);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    let interp = ""; let sev: ToolResult["severity"] = "ok";
    if (v >= 2)       { interp = "Agitación importante → riesgo de autoextubación o retiro de dispositivos"; sev = "danger"; }
    else if (v >= 1)  { interp = "Inquietud → vigilar confort, dolor o asincronía"; sev = "warn"; }
    else if (v >= -2) { interp = "Rango de sedación generalmente favorable"; sev = "ok"; }
    else              { interp = "Sedación profunda → reevaluar objetivo y necesidad"; sev = "info"; }
    setResult({ empty: false, title: "RASS", value: v > 0 ? `+${v}` : String(v), severity: sev, interpretation: interp });
  };
  const reset = () => { setV(0); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Escala RASS"
      subtitle="Richmond Agitation–Sedation Scale"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>RASS 0 a −2 suele ser un rango favorable de sedación ligera, según contexto clínico.</>}
    >
      <SelectField label="Selecciona nivel" value={v} onChange={(e) => setV(parseInt(e.target.value, 10))}
        options={[
          { value: 4, label: "+4 Combativo" },
          { value: 3, label: "+3 Muy agitado" },
          { value: 2, label: "+2 Agitado" },
          { value: 1, label: "+1 Inquieto" },
          { value: 0, label: " 0 Alerta y calmado" },
          { value: -1, label: "−1 Somnoliento" },
          { value: -2, label: "−2 Sedación leve" },
          { value: -3, label: "−3 Sedación moderada" },
          { value: -4, label: "−4 Sedación profunda" },
          { value: -5, label: "−5 Sin respuesta" },
        ]} />
    </ToolShell>
  );
}
