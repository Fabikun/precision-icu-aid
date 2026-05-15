import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

const OPTS = [
  "0 - Ninguna movilidad (restringido en cama)",
  "1 - Sentado en cama, ejercicios en cama",
  "2 - Transferido pasivamente a la cadera (sin ortostatismo)",
  "3 - Sentado al borde de la cama",
  "4 - Ortostatismo",
  "5 - Transferencia cama → sillón",
  "6 - Marcha estacionaria al borde de la cama",
  "7 - Deambular con auxilio de 2+ personas",
  "8 - Deambular con auxilio de 1 persona",
  "9 - Deambulación independiente con dispositivo",
  "10 - Deambulación independiente sin dispositivo",
].map((label, i) => ({ value: i, label }));

export default function IMSTool() {
  const [v, setV] = useState(0);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const sev = v <= 2 ? "danger" : v <= 4 ? "warn" : v <= 6 ? "info" : "ok";
    const interp = v <= 2 ? "Movilidad muy limitada" : v <= 4 ? "Movilidad básica alcanzada" : v <= 6 ? "Transferencia / inicio de marcha" : "Deambulación asistida a independiente";
    setResult({ empty: false, title: "ICU Mobility Scale", value: String(v), unit: "/ 10", severity: sev, interpretation: interp });
  };
  const reset = () => { setV(0); setResult({ empty: true }); };

  return (
    <ToolShell
      title="ICU Mobility Scale (IMS)"
      subtitle="Nivel de movilidad alcanzado"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>0–2 muy limitada · 3–4 ortostatismo · 5–6 inicio de marcha · 7–10 deambulación asistida → independiente.</>}
    >
      <SelectField label="Nivel alcanzado" value={v} onChange={(e) => setV(parseInt(e.target.value, 10))} options={OPTS} />
    </ToolShell>
  );
}
