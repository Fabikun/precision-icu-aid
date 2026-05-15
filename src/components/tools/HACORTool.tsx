import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

export default function HACORTool() {
  const [fc, setFc] = useState("0");
  const [ph, setPh] = useState("0");
  const [glasgow, setGlasgow] = useState("0");
  const [pafi, setPafi] = useState("0");
  const [fr, setFr] = useState("0");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const total = +fc + +ph + +glasgow + +pafi + +fr;
    const sev = total >= 5 ? "danger" : "ok";
    setResult({
      empty: false,
      title: "Score HACOR",
      value: String(total),
      severity: sev,
      interpretation: total >= 5 ? "Alto riesgo de fracaso de VMNI · considerar intubación precoz" : "Menor riesgo de fracaso de VMNI",
    });
  };
  const reset = () => { setFc("0"); setPh("0"); setGlasgow("0"); setPafi("0"); setFr("0"); setResult({ empty: true }); };

  return (
    <ToolShell
      title="Score HACOR"
      subtitle="Riesgo de fracaso de VMNI"
      formula={<>Variables: FC, pH, Glasgow, PaFi y FR.</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>≥5 → alto riesgo de fracaso · No retrasar intubación si HACOR elevado.</>}
    >
      <SelectField label="Frecuencia cardíaca (FC)" value={fc} onChange={(e) => setFc(e.target.value)}
        options={[{ value: "0", label: "≤120" }, { value: "1", label: "≥121" }]} />
      <SelectField label="pH" value={ph} onChange={(e) => setPh(e.target.value)}
        options={[
          { value: "0", label: "≥7.35" }, { value: "2", label: "7.30–7.34" },
          { value: "3", label: "7.25–7.29" }, { value: "4", label: "<7.25" },
        ]} />
      <SelectField label="Glasgow" value={glasgow} onChange={(e) => setGlasgow(e.target.value)}
        options={[
          { value: "0", label: "15" }, { value: "2", label: "13–14" },
          { value: "5", label: "11–12" }, { value: "10", label: "≤10" },
        ]} />
      <SelectField label="PaFi" value={pafi} onChange={(e) => setPafi(e.target.value)}
        options={[
          { value: "0", label: ">200" }, { value: "2", label: "176–200" },
          { value: "3", label: "151–175" }, { value: "4", label: "126–150" },
          { value: "5", label: "101–125" }, { value: "6", label: "≤100" },
        ]} />
      <SelectField label="Frecuencia respiratoria (FR)" value={fr} onChange={(e) => setFr(e.target.value)}
        options={[
          { value: "0", label: "≤30" }, { value: "1", label: "31–35" },
          { value: "2", label: "36–40" }, { value: "3", label: "41–45" }, { value: "4", label: "≥46" },
        ]} />
    </ToolShell>
  );
}
