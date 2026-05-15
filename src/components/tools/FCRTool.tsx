import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { num, type ToolResult } from "@/lib/codex";

export default function FCRTool() {
  const [edad, setEdad] = useState("");
  const [fcrep, setFcrep] = useState("");
  const [intensidad, setIntensidad] = useState("0.4");
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const e = num(edad), f = num(fcrep), i = parseFloat(intensidad);
    if (e === null || f === null || e <= 0 || f <= 0) {
      setResult({ empty: false, severity: "neutral", title: "FC objetivo", value: "—", interpretation: "Ingresa valores válidos" });
      return;
    }
    const fcm = 208 - (0.7 * e);
    const fcr = fcm - f;
    const obj = (fcr * i) + f;
    const sev = i <= 0.6 ? "ok" : i <= 0.7 ? "warn" : "danger";
    const interp = i <= 0.6 ? "Movilización / inicio" : i <= 0.7 ? "Ejercicio moderado" : "Vigilar respuesta clínica";
    setResult({
      empty: false,
      title: "FC objetivo",
      value: obj.toFixed(0),
      unit: "lpm",
      severity: sev,
      interpretation: interp,
      rows: [
        { label: "FCM estimada", value: fcm.toFixed(0), unit: "lpm" },
        { label: "FCR (reserva)", value: fcr.toFixed(0), unit: "lpm" },
      ],
    });
  };
  const reset = () => { setEdad(""); setFcrep(""); setIntensidad("0.4"); setResult({ empty: true }); };

  return (
    <ToolShell
      title="FC de Reserva (Karvonen)"
      subtitle="FC objetivo según intensidad"
      formula={<>FCR = FCM − FCrep · FC objetivo = (FCR × % intensidad) + FCrep · <strong>FCM</strong> = 208 − (0.7 × edad).</>}
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>Integrar siempre con respuesta hemodinámica, vasoactivos, percepción de esfuerzo y objetivos de movilización.</>}
    >
      <NumberField label="Edad" unit="años" placeholder="Ej: 60" value={edad} onChange={(e) => setEdad(e.target.value)} step="1" />
      <NumberField label="FC en reposo (FCrep)" unit="lpm" placeholder="Ej: 70" value={fcrep} onChange={(e) => setFcrep(e.target.value)} step="1" />
      <SelectField label="Intensidad deseada" value={intensidad} onChange={(e) => setIntensidad(e.target.value)}
        options={[
          { value: "0.4", label: "40% (muy baja)" },
          { value: "0.5", label: "50% (baja)" },
          { value: "0.6", label: "60% (moderada)" },
          { value: "0.7", label: "70% (moderada-alta)" },
          { value: "0.8", label: "80% (alta)" },
        ]} />
    </ToolShell>
  );
}
