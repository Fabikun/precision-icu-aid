import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

export default function SASTool() {
  const [v, setV] = useState(4);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    let interp = ""; let sev: ToolResult["severity"] = "ok";
    if (v >= 6)       { interp = "Agitación severa → alto riesgo clínico"; sev = "danger"; }
    else if (v === 5) { interp = "Agitación leve → monitorizar y corregir causa"; sev = "warn"; }
    else if (v >= 3)  { interp = "Rango de sedación generalmente adecuado"; sev = "ok"; }
    else              { interp = "Sedación profunda"; sev = "info"; }
    setResult({ empty: false, title: "SAS", value: String(v), severity: sev, interpretation: interp });
  };
  const reset = () => { setV(4); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Escala SAS"
      subtitle="Sedation–Agitation Scale (Riker)"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>SAS 3–4 suele representar un rango clínico aceptable de sedación a calma, según contexto.</>}
    >
      <SelectField label="Selecciona nivel" value={v} onChange={(e) => setV(parseInt(e.target.value, 10))}
        options={[
          { value: 1, label: "1 - No despierta" },
          { value: 2, label: "2 - Muy sedado" },
          { value: 3, label: "3 - Sedado" },
          { value: 4, label: "4 - Calmo" },
          { value: 5, label: "5 - Agitado" },
          { value: 6, label: "6 - Muy agitado" },
          { value: 7, label: "7 - Agitación peligrosa" },
        ]} />
    </ToolShell>
  );
}
