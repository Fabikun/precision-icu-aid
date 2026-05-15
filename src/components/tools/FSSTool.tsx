import { useState } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { SelectField } from "@/components/codex/Fields";
import type { ToolResult } from "@/lib/codex";

const FSS_OPTIONS = (kind: "giro" | "sup-sed" | "sed-borde" | "sed-bip" | "marcha") => {
  const m: Record<string, string[]> = {
    giro: [
      "7 - No requiere baranda ni objeto",
      "6 - Requiere baranda u otro objeto para girar",
      "5 - Requiere estímulo / instrucción (físicamente puede)",
      "4 - Asistencia mínima",
      "3 - Asistencia moderada",
      "2 - Asistencia máxima",
      "1 - Completamente dependiente",
      "0 - Incapaz por debilidad",
    ],
    "sup-sed": [
      "7 - No requiere baranda ni objeto",
      "6 - Requiere baranda u objeto",
      "5 - Estímulo / instrucción",
      "4 - Asistencia mínima",
      "3 - Asistencia moderada",
      "2 - Asistencia máxima",
      "1 - Completamente dependiente",
      "0 - Incapaz por debilidad",
    ],
    "sed-borde": [
      "7 - No requiere baranda ni objeto",
      "6 - Baranda o manos para equilibrio",
      "5 - Estímulo / instrucción",
      "4 - Asistencia mínima",
      "3 - Asistencia moderada",
      "2 - Asistencia máxima",
      "1 - Completamente dependiente",
      "0 - Incapaz por debilidad",
    ],
    "sed-bip": [
      "7 - No requiere baranda ni objeto",
      "6 - Baranda u objeto para bipedestar",
      "5 - Estímulo / instrucción",
      "4 - Asistencia mínima",
      "3 - Asistencia moderada",
      "2 - Asistencia máxima",
      "1 - Completamente dependiente",
      "0 - Incapaz por debilidad",
    ],
    marcha: [
      "7 - Camina 45 m sin asistencia",
      "6 - Camina 45 m con dispositivo",
      "5 - Supervisión / estímulo, sin asistencia física",
      "4 - Asistencia mínima",
      "3 - Asistencia moderada",
      "2 - <15 m con asistencia de 1 persona",
      "1 - <15 m con asistencia de 1–2 personas",
      "0 - Incapaz por debilidad",
    ],
  };
  return m[kind].map((label) => ({ value: parseInt(label, 10), label }));
};

const ITEMS: { key: keyof typeof initial; title: string; kind: Parameters<typeof FSS_OPTIONS>[0] }[] = [
  { key: "giro",     title: "1. Giro en cama",                          kind: "giro" },
  { key: "supSed",   title: "2. Transferencia supino → sedente",        kind: "sup-sed" },
  { key: "sedBorde", title: "3. Sedente al borde de la cama",           kind: "sed-borde" },
  { key: "sedBip",   title: "4. Transferencia sedente → bípedo",        kind: "sed-bip" },
  { key: "marcha",   title: "5. Marcha",                                kind: "marcha" },
];

const initial = { giro: 7, supSed: 7, sedBorde: 7, sedBip: 7, marcha: 7 };

export default function FSSTool() {
  const [v, setV] = useState(initial);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  const calc = () => {
    const total = v.giro + v.supSed + v.sedBorde + v.sedBip + v.marcha;
    const sev = total <= 10 ? "danger" : total <= 20 ? "warn" : total <= 30 ? "ok" : "ok";
    const interp = total <= 10 ? "Dependencia severa" : total <= 20 ? "Dependencia moderada" : total <= 30 ? "Dependencia leve" : "Funcional";
    setResult({ empty: false, title: "FSS-ICU", value: String(total), unit: "/ 35", severity: sev, interpretation: interp });
  };
  const reset = () => { setV(initial); setResult({ empty: true }); };

  return (
    <ToolShell
      title="FSS-ICU"
      subtitle="Functional Status Score in ICU"
      onCalculate={calc} onReset={reset}
      result={<ResultPanel result={result} />}
      footnote={<>≤10 dependencia severa · 11–20 moderada · 21–30 leve · &gt;30 funcional.</>}
    >
      {ITEMS.map((it) => (
        <SelectField
          key={it.key}
          label={it.title}
          value={v[it.key]}
          onChange={(e) => setV((s) => ({ ...s, [it.key]: parseInt(e.target.value, 10) }))}
          options={FSS_OPTIONS(it.kind)}
        />
      ))}
    </ToolShell>
  );
}
