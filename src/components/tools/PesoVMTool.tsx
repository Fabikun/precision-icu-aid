import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function PesoVMTool() {
  const [sexo, setSexo] = useState("hombre");
  const [altura, setAltura] = useState("");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const a = num(altura);
    if (a === null || a <= 0) {
      setResult({ empty: false, severity: "neutral", title: "Peso VM", value: "—", interpretation: "Ingresa una talla válida" });
      return;
    }
    const tallaM = a / 100;
    const pesoIdeal = sexo === "hombre" ? Math.pow(tallaM, 2) * 23 : Math.pow(tallaM, 2) * 21.5;
    const pesoPredicho = sexo === "hombre" ? ((a - 152.4) * 0.91) + 50 : ((a - 152.4) * 0.91) + 45;
    const vt6 = pesoPredicho * 6;
    const vt8 = pesoPredicho * 8;
    setResult({
      empty: false,
      title: "Peso predicho",
      value: pesoPredicho.toFixed(1),
      unit: "kg",
      severity: "info",
      interpretation: "Usa peso predicho para ventilación protectora (6–8 ml/kg)",
      rows: [
        { label: "Peso ideal", value: pesoIdeal.toFixed(1), unit: "kg" },
        { label: "VT 6 ml/kg", value: vt6.toFixed(0), unit: "ml" },
        { label: "VT 8 ml/kg", value: vt8.toFixed(0), unit: "ml" },
      ],
    });
  };

  const reset = () => { setSexo("hombre"); setAltura(""); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Peso para Ventilación Mecánica"
      subtitle="Peso ideal y predicho · VT 6–8 ml/kg"
      showVmiCourse
      formula={<>
        <strong>Peso ideal:</strong> H = (talla m)² × 23 · M = (talla m)² × 21.5<br />
        <strong>Peso predicho:</strong> H = ((cm − 152.4) × 0.91) + 50 · M = ((cm − 152.4) × 0.91) + 45
      </>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
    >
      <SelectField
        label="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value)}
        options={[{ value: "hombre", label: "Hombre" }, { value: "mujer", label: "Mujer" }]}
      />
      <NumberField label="Talla" unit="cm" placeholder="Ej: 170" value={altura} onChange={(e) => setAltura(e.target.value)} step="0.1" />
    </ToolShell>
  );
}
