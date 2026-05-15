import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function CabriniTool() {
  const [fr, setFr] = useState("");
  const [retr, setRetr] = useState("0");
  const [estado, setEstado] = useState("0");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const f = num(fr);
    if (f === null || f <= 0) {
      setResult({ empty: false, severity: "neutral", title: "Cabrini", value: "—", interpretation: "Ingresa una FR válida" });
      return;
    }
    const pFR = f < 20 ? 0 : f <= 30 ? 1 : f <= 40 ? 2 : 4;
    const pR = parseInt(retr, 10);
    const pE = parseInt(estado, 10);
    const total = pFR + pR + pE;
    const sev = total <= 2 ? "ok" : total <= 5 ? "warn" : "danger";
    const interp = total <= 2 ? "Riesgo bajo" : total <= 5 ? "Riesgo moderado" : "Riesgo alto";
    setResult({
      empty: false,
      title: "Puntaje total",
      value: String(total),
      unit: "/ 10",
      severity: sev,
      interpretation: interp,
      rows: [
        { label: "FR", value: pFR, unit: "pts" },
        { label: "Musculatura accesoria", value: pR, unit: "pts" },
        { label: "Estado general", value: pE, unit: "pts" },
      ],
    });
  };

  const reset = () => { setFr(""); setRetr("0"); setEstado("0"); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Índice de Cabrini"
      subtitle="Cabrini Respiratory Strain Scale"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<><strong>Interpretación:</strong> 0–2 bajo · 3–5 moderado · 6–10 alto.</>}
    >
      <NumberField label="Frecuencia respiratoria" unit="rpm" placeholder="Ej: 28" value={fr} onChange={(e) => setFr(e.target.value)} step="1" />
      <SelectField label="Musculatura accesoria / retracciones" value={retr} onChange={(e) => setRetr(e.target.value)}
        options={[
          { value: "0", label: "Ninguna · 0 pts" },
          { value: "1", label: "Leve · 1 pt" },
          { value: "2", label: "Moderada · 2 pts" },
          { value: "3", label: "Severa · 3 pts" },
        ]} />
      <SelectField label="Estado general" value={estado} onChange={(e) => setEstado(e.target.value)}
        options={[
          { value: "0", label: "Relajado · 0 pts" },
          { value: "1", label: "Incómodo · 1 pt" },
          { value: "2", label: "Ansioso · 2 pts" },
          { value: "3", label: "Agitado · 3 pts" },
        ]} />
    </ToolShell>
  );
}
