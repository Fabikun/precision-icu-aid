import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function PIMTool() {
  const [pim, setPim] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const p = num(pim);
    if (p === null || p <= 0) {
      setResult({ empty: false, severity: "neutral", title: "PIm", value: "—", interpretation: "Ingresa un valor válido" });
      return;
    }
    const fmt = (x: number) => x.toFixed(1);
    setResult({
      empty: false,
      title: "PIm",
      value: p.toFixed(1),
      unit: "cmH₂O",
      severity: "info",
      interpretation: "Cargas sugeridas para entrenamiento inspiratorio",
      rows: [
        { label: "30%", value: fmt(p * 0.30), unit: "cmH₂O" },
        { label: "40%", value: fmt(p * 0.40), unit: "cmH₂O" },
        { label: "50%", value: fmt(p * 0.50), unit: "cmH₂O" },
        { label: "70%", value: fmt(p * 0.70), unit: "cmH₂O" },
        { label: "80%", value: fmt(p * 0.80), unit: "cmH₂O" },
      ],
    });
  };
  const reset = () => { setPim(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Entrenamiento inspiratorio (PIm / IMT)"
      subtitle="Cargas para válvula IMT"
      formula={<><strong>Carga objetivo</strong> = PIm × % de entrenamiento.</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>Integrar con tolerancia clínica, fatiga, disnea y respuesta del paciente (TQT, debilidad diafragmática).</>}
    >
      <NumberField label="PIm" unit="cmH₂O" placeholder="Ej: 60" value={pim} onChange={(e) => setPim(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
