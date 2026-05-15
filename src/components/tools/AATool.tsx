import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function AATool() {
  const [pbSel, setPbSel] = useState("760");
  const [pbManual, setPbManual] = useState("");
  const [fio2, setFio2] = useState("");
  const [pao2, setPao2] = useState("");
  const [paco2, setPaco2] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const f = num(fio2), o = num(pao2), c = num(paco2);
    const pb = pbSel === "manual" ? num(pbManual) : num(pbSel);
    if (f === null || o === null || c === null || pb === null || f <= 0 || o <= 0 || c <= 0 || pb <= 0) {
      setResult({ empty: false, severity: "neutral", title: "Gradiente A-a", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const PAO2 = f * (pb - 47) - (c / 0.8);
    const grad = PAO2 - o;

    const sev = grad < 15 ? "ok" : grad < 50 ? "warn" : "danger";
    const gravedad = grad < 15 ? "Gradiente normal o discretamente elevado" : grad < 50 ? "Gradiente aumentado" : "Gradiente muy elevado";
    let mecanismo = "Interpretar en contexto clínico";
    if (grad < 15 && c > 45) mecanismo = "Compatible con hipoventilación";
    else if (grad >= 15 && grad < 50) mecanismo = "Compatible con alteración V/Q";
    else if (grad >= 50) mecanismo = "Compatible con shunt o alteración severa del intercambio";

    setResult({
      empty: false,
      title: "Gradiente A-a",
      value: grad.toFixed(1),
      unit: "mmHg",
      severity: sev,
      interpretation: gravedad,
      rows: [{ label: "PAO₂ calculada", value: PAO2.toFixed(1), unit: "mmHg" }],
      note: mecanismo,
    });
  };

  const reset = () => { setPbSel("760"); setPbManual(""); setFio2(""); setPao2(""); setPaco2(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Gradiente Alvéolo-Arterial"
      subtitle="Mecanismo de hipoxemia"
      formula={<><strong>Fórmula:</strong> PAO₂ = FiO₂ × (PB − 47) − (PaCO₂ / 0.8) · Gradiente A-a = PAO₂ − PaO₂.</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
    >
      <SelectField
        label="Ubicación / presión barométrica"
        value={pbSel} onChange={(e) => setPbSel(e.target.value)}
        options={[
          { value: "760", label: "Nivel del mar (760 mmHg)" },
          { value: "710", label: "Santiago, Chile (~710 mmHg)" },
          { value: "manual", label: "Otra ubicación" },
        ]}
      />
      {pbSel === "manual" && (
        <NumberField label="PB manual" unit="mmHg" placeholder="Ej: 650" value={pbManual} onChange={(e) => setPbManual(e.target.value)} step="1" />
      )}
      <NumberField label="FiO₂" hint="decimal" placeholder="Ej: 0.40" value={fio2} onChange={(e) => setFio2(e.target.value)} step="0.01" />
      <NumberField label="PaO₂" unit="mmHg" placeholder="Ej: 80" value={pao2} onChange={(e) => setPao2(e.target.value)} step="0.1" />
      <NumberField label="PaCO₂" unit="mmHg" placeholder="Ej: 40" value={paco2} onChange={(e) => setPaco2(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
