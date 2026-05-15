import { useState, useEffect } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

const PMUS_STORAGE_KEY = "codex:weaning:pmus:dpocc";

export default function WeaningTool() {
  // Tobin
  const [fr, setFr] = useState("");
  const [vt, setVt] = useState("");
  const [tobin, setTobin] = useState<ToolResult>({ empty: true });
  // FED
  const [gi, setGi] = useState("");
  const [ge, setGe] = useState("");
  const [fed, setFed] = useState<ToolResult>({ empty: true });
  // Pmus
  const [dpocc, setDpocc] = useState("");
  const [pmus, setPmus] = useState<ToolResult>({ empty: true });

  // Cargar último ΔPocc desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PMUS_STORAGE_KEY);
      if (saved) setDpocc(saved);
    } catch { /* noop */ }
  }, []);

  // Guardar ΔPocc cuando cambie
  useEffect(() => {
    try {
      if (dpocc) localStorage.setItem(PMUS_STORAGE_KEY, dpocc);
      else localStorage.removeItem(PMUS_STORAGE_KEY);
    } catch { /* noop */ }
  }, [dpocc]);

  const calcTobin = () => {
    const f = num(fr), v = num(vt);
    if (f === null || v === null || f <= 0 || v <= 0) {
      setTobin({ empty: false, severity: "neutral", title: "RSBI", value: "—", interpretation: "Ingresa FR y VT válidos" });
      return;
    }
    const rsbi = f / (v / 1000);
    const sev = rsbi > 105 ? "danger" : "ok";
    setTobin({
      empty: false, title: "RSBI", value: rsbi.toFixed(1), severity: sev,
      interpretation: rsbi > 105 ? "RSBI alto: mayor riesgo de fracaso de extubación" : "RSBI favorable: menor riesgo de fracaso de extubación",
    });
  };

  const calcFED = () => {
    const i = num(gi), e = num(ge);
    if (i === null || e === null || i <= 0 || e <= 0) {
      setFed({ empty: false, severity: "neutral", title: "FED", value: "—", interpretation: "Ingresa grosores válidos" });
      return;
    }
    const v = ((i - e) / e) * 100;
    const sev = v < 20 ? "danger" : v < 30 ? "warn" : "ok";
    setFed({
      empty: false, title: "FED", value: v.toFixed(1), unit: "%", severity: sev,
      interpretation: v < 20 ? "FED baja: posible disfunción / fatiga diafragmática" : v < 30 ? "FED limítrofe: interpretar según contexto" : "FED favorable: función diafragmática conservada",
    });
  };

  const calcPmus = () => {
    const d = num(dpocc);
    if (d === null || d === 0) {
      setPmus({ empty: false, severity: "neutral", title: "Pmus", value: "—", interpretation: "Ingresa un ΔPocc válido" });
      return;
    }
    const value = Math.abs(0.75 * d);
    let severity: ToolResult["severity"];
    let interpretation = "";
    if (value < 5) {
      severity = "warn";
      interpretation = "Esfuerzo bajo (riesgo de sobreasistencia y atrofia diafragmática)";
    } else if (value <= 10) {
      severity = "ok";
      interpretation = "Esfuerzo adecuado (ventilación balanceada)";
    } else {
      severity = "danger";
      interpretation = "Esfuerzo elevado (riesgo de fatiga y subasistencia)";
    }
    setPmus({
      empty: false, title: "Pmus", value: value.toFixed(1), unit: "cmH₂O",
      severity, interpretation,
    });
  };

  return (
    <div className="space-y-7 animate-fade-in">
      <div>
        <h2 className="font-display text-[22px] font-semibold tracking-tight">Weaning</h2>
        <p className="mt-1 text-sm text-muted-foreground">Índice de Tobin (RSBI) + Fracción de engrosamiento diafragmático + Pmus.</p>
      </div>

      <ToolShell
        title="Índice de Tobin (RSBI)"
        formula={<><strong>RSBI</strong> = FR / VT (en litros). RSBI &gt; 105 → alto riesgo de fracaso.</>}
        onCalculate={calcTobin} onReset={() => { setFr(""); setVt(""); setTobin({ empty: true }); }}
        result={<ResultPanel result={tobin} />}
      >
        <NumberField label="FR" unit="rpm" placeholder="Ej: 28" value={fr} onChange={(e) => setFr(e.target.value)} step="1" />
        <NumberField label="VT" unit="mL" placeholder="Ej: 350" value={vt} onChange={(e) => setVt(e.target.value)} step="0.1" />
      </ToolShell>

      <ToolShell
        title="Fracción de engrosamiento diafragmático"
        formula={<>FED = ((Grosor inspiratorio − Grosor espiratorio) / Grosor espiratorio) × 100.</>}
        onCalculate={calcFED} onReset={() => { setGi(""); setGe(""); setFed({ empty: true }); }}
        result={<ResultPanel result={fed} />}
        footnote={<>&gt;30% favorable · 20–30% limítrofe · &lt;20% posible disfunción.</>}
      >
        <NumberField label="Grosor inspiratorio" unit="mm" placeholder="Ej: 2.8" value={gi} onChange={(e) => setGi(e.target.value)} step="0.01" />
        <NumberField label="Grosor espiratorio" unit="mm" placeholder="Ej: 2.0" value={ge} onChange={(e) => setGe(e.target.value)} step="0.01" />
      </ToolShell>

      <ToolShell
        title="Presión muscular estimada (Pmus)"
        subtitle="Estimación no invasiva del esfuerzo inspiratorio basada en ΔPocc durante una pausa espiratoria."
        formula={<><strong>Pmus</strong> = 0.75 × |ΔPocc|. Valores normales 5–10 cmH₂O ayudan a evitar sobreasistencia (&lt;5) y subasistencia (&gt;10).</>}
        onCalculate={calcPmus}
        onReset={() => { setDpocc(""); setPmus({ empty: true }); }}
        result={<ResultPanel result={pmus} />}
        footnote={<>&lt;5 cmH₂O sobreasistencia · 5–10 adecuado · &gt;10 subasistencia / fatiga.</>}
        showVmiCourse
      >
        <NumberField
          label="ΔPocc"
          unit="cmH₂O"
          hint="Suele ser negativa"
          placeholder="Ej: -8.0"
          value={dpocc}
          onChange={(e) => setDpocc(e.target.value)}
          step="0.1"
        />
      </ToolShell>
    </div>
  );
}
