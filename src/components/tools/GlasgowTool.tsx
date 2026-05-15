import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

export default function GlasgowTool() {
  const [o, setO] = useState(4);
  const [v, setV] = useState(5);
  const [m, setM] = useState(6);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const total = o + v + m;
    const sev = total <= 8 ? "danger" : total <= 12 ? "warn" : "ok";
    const interp = total <= 8 ? "Grave" : total <= 12 ? "Moderado" : "Leve";
    setResult({ empty: false, title: "Glasgow", value: String(total), unit: "/ 15", severity: sev, interpretation: interp });
  };
  const reset = () => { setO(4); setV(5); setM(6); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Escala de Glasgow"
      subtitle="Nivel de conciencia"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>13–15 leve · 9–12 moderado · ≤8 grave.</>}
    >
      <SelectField label="Apertura ocular" value={o} onChange={(e) => setO(parseInt(e.target.value, 10))}
        options={[
          { value: 4, label: "4 - Espontánea" },
          { value: 3, label: "3 - Al estímulo verbal" },
          { value: 2, label: "2 - Al dolor" },
          { value: 1, label: "1 - Nula" },
        ]} />
      <SelectField label="Respuesta verbal" value={v} onChange={(e) => setV(parseInt(e.target.value, 10))}
        options={[
          { value: 5, label: "5 - Orientado" },
          { value: 4, label: "4 - Desorientado" },
          { value: 3, label: "3 - Palabras inapropiadas" },
          { value: 2, label: "2 - Sonidos incomprensibles" },
          { value: 1, label: "1 - Nula" },
        ]} />
      <SelectField label="Respuesta motora" value={m} onChange={(e) => setM(parseInt(e.target.value, 10))}
        options={[
          { value: 6, label: "6 - Obedece órdenes" },
          { value: 5, label: "5 - Localiza el dolor" },
          { value: 4, label: "4 - Retirada al dolor" },
          { value: 3, label: "3 - Flexión anormal" },
          { value: 2, label: "2 - Extensión anormal" },
          { value: 1, label: "1 - Nulo" },
        ]} />
    </ToolShell>
  );
}
