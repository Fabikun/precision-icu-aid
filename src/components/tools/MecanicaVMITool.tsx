import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function MecanicaVMITool() {
  const [vt, setVt] = useState("");
  const [ppico, setPpico] = useState("");
  const [pplat, setPplat] = useState("");
  const [peep, setPeep] = useState("");
  const [flujo, setFlujo] = useState("");
  const [unidad, setUnidad] = useState("Lmin");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const v = num(vt), pp = num(ppico), pl = num(pplat), pe = num(peep);
    if (v === null || pp === null || pl === null || pe === null) {
      setResult({ empty: false, severity: "neutral", title: "Mecánica VMI", value: "—", interpretation: "Ingresa VT, P pico, P meseta y PEEP válidos" });
      return;
    }
    const dp = pl - pe;
    const cest = dp > 0 ? v / dp : null;
    const cdyn = (pp - pe) > 0 ? v / (pp - pe) : null;
    const fIn = num(flujo);
    let raw: number | null = null;
    let flujoLseg: number | null = null;
    if (fIn !== null && fIn > 0) {
      flujoLseg = unidad === "Lmin" ? fIn / 60 : fIn;
      raw = (pp - pl) / flujoLseg;
    }

    const dpSev = dp < 15 ? "ok" : "warn";
    const cestSev = cest === null ? "neutral" : cest < 25 ? "danger" : "ok";
    const rawSev = raw === null ? "neutral" : raw < 10 ? "warn" : raw <= 15 ? "ok" : "danger";

    setResult({
      empty: false,
      title: "Driving Pressure (ΔP)",
      value: dp.toFixed(1),
      unit: "cmH₂O",
      severity: dpSev,
      interpretation: dp < 15 ? "ΔP relativamente favorable" : "ΔP elevada — interpretar en contexto",
      rows: [
        { label: "Compliance estática (Cest)", value: cest !== null ? cest.toFixed(1) : "—", unit: "mL/cmH₂O", severity: cestSev },
        { label: "Compliance dinámica (Cdyn)", value: cdyn !== null ? cdyn.toFixed(1) : "—", unit: "mL/cmH₂O" },
        { label: "Resistencia (Raw)", value: raw !== null ? raw.toFixed(1) : "—", unit: "cmH₂O/L/seg", severity: rawSev },
        ...(flujoLseg !== null ? [{ label: "Flujo convertido", value: flujoLseg.toFixed(2), unit: "L/seg" }] : []),
      ],
      note: raw === null ? "Raw no calculada (falta flujo inspiratorio)." : undefined,
    });
  };

  const reset = () => {
    setVt(""); setPpico(""); setPplat(""); setPeep(""); setFlujo(""); setUnidad("Lmin");
    setResult({ empty: true });
  };

  return (
    <ToolShell
      title="Mecánica respiratoria en VMI"
      subtitle="Driving pressure, compliance y resistencia"
      showVmiCourse
      formula={<>
        <strong>ΔP</strong> = Pplat − PEEP · <strong>Cest</strong> = VT / (Pplat − PEEP) · <strong>Cdyn</strong> = VT / (Ppico − PEEP) · <strong>Raw</strong> = (Ppico − Pplat) / Flujo
      </>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>ΔP &lt;15 cmH₂O suele ser más favorable · Cest &lt;25 mL/cmH₂O sugiere pulmones rígidos · Raw orientativa: 10–15 cmH₂O/L/seg en intubado.</>}
    >
      <NumberField label="Volumen tidal (VT)" unit="mL" placeholder="Ej: 420" value={vt} onChange={(e) => setVt(e.target.value)} step="0.1" />
      <NumberField label="Presión pico" unit="cmH₂O" placeholder="Ej: 28" value={ppico} onChange={(e) => setPpico(e.target.value)} step="0.1" />
      <NumberField label="Presión meseta (Pplat)" unit="cmH₂O" placeholder="Ej: 22" value={pplat} onChange={(e) => setPplat(e.target.value)} step="0.1" />
      <NumberField label="PEEP" unit="cmH₂O" placeholder="Ej: 10" value={peep} onChange={(e) => setPeep(e.target.value)} step="0.1" />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Flujo inspiratorio" hint="opcional" placeholder="Ej: 60" value={flujo} onChange={(e) => setFlujo(e.target.value)} step="0.01" />
        <SelectField label="Unidad" value={unidad} onChange={(e) => setUnidad(e.target.value)}
          options={[{ value: "Lmin", label: "L/min" }, { value: "Lseg", label: "L/seg" }]} />
      </div>
    </ToolShell>
  );
}
