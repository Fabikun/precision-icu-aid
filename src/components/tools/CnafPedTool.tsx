import { useState, useEffect } from "react";
import { ToolShell } from "@/components/codex/ToolShell";
import { ResultPanel } from "@/components/codex/ResultPanel";
import { NumberField, SelectField } from "@/components/codex/Fields";
import { CodexPediatricCourseBanner } from "@/components/codex/CodexPediatricCourseBanner";
import { num, type ToolResult } from "@/lib/codex";

const STORAGE_KEY = "codex:ped:cnaf";

interface State {
  peso: string;
  estrategia: string; // "auto" | "1" | "1.5" | "2"
}

const DEFAULT: State = { peso: "", estrategia: "auto" };

function flujoRecomendado(pesoKg: number): number {
  if (pesoKg <= 10) return Math.min(2 * pesoKg, 20);
  return 20 + 0.5 * (pesoKg - 10);
}

export default function CnafPedTool() {
  const [s, setS] = useState<State>(DEFAULT);
  const [result, setResult] = useState<ToolResult>({ empty: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setS({ ...DEFAULT, ...JSON.parse(saved) });
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* noop */ }
  }, [s]);

  const calc = () => {
    const peso = num(s.peso);
    if (peso === null || peso <= 0) {
      setResult({ empty: false, severity: "neutral", title: "Flujo CNAF", value: "—", interpretation: "Ingresa un peso válido (kg)" });
      return;
    }

    const recomendado = flujoRecomendado(peso);

    const rows: { label: string; value: string; unit?: string }[] = [];
    if (s.estrategia !== "auto") {
      const factor = parseFloat(s.estrategia);
      const flujoEstrat = peso * factor;
      rows.push({ label: `Estrategia ${factor} L/kg`, value: flujoEstrat.toFixed(1), unit: "L/min" });
    } else {
      // mostrar referencia rápida
      rows.push({ label: "1 L/kg", value: (peso * 1).toFixed(1), unit: "L/min" });
      rows.push({ label: "1.5 L/kg", value: (peso * 1.5).toFixed(1), unit: "L/min" });
      rows.push({ label: "2 L/kg", value: (peso * 2).toFixed(1), unit: "L/min" });
    }

    setResult({
      empty: false,
      title: "Flujo CNAF",
      value: recomendado.toFixed(1),
      unit: "L/min",
      severity: "ok",
      interpretation: peso <= 10
        ? "Fórmula: 2 × peso (máx. 20 L/min)"
        : "Fórmula: 20 + 0.5 × (peso − 10)",
      rows,
      note: "Uso clínico orientativo. No reemplaza juicio clínico.",
    });
  };

  const reset = () => {
    setS(DEFAULT);
    setResult({ empty: true });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  };

  return (
    <>
      <ToolShell
        title="Flujo CNAF pediátrico"
        subtitle="Cálculo del flujo recomendado en cánula nasal de alto flujo según peso."
        formula={
          <>
            Si peso ≤ 10 kg: <strong>Flujo = 2 × peso</strong> (máx. 20 L/min). <br />
            Si peso &gt; 10 kg: <strong>Flujo = 20 + 0.5 × (peso − 10)</strong>.
          </>
        }
        onCalculate={calc}
        onReset={reset}
        result={<ResultPanel result={result} />}
        footnote={<>Uso clínico orientativo. No reemplaza juicio clínico.</>}
      >
        <NumberField
          label="Peso"
          unit="kg"
          placeholder="Ej: 8.5"
          value={s.peso}
          onChange={(e) => setS((p) => ({ ...p, peso: e.target.value }))}
          step="0.1"
        />
        <SelectField
          label="Estrategia (opcional)"
          hint="Comparar contra L/kg"
          value={s.estrategia}
          onChange={(e) => setS((p) => ({ ...p, estrategia: e.target.value }))}
          options={[
            { value: "auto", label: "Mostrar todas (1 / 1.5 / 2 L/kg)" },
            { value: "1", label: "1 L/kg" },
            { value: "1.5", label: "1.5 L/kg" },
            { value: "2", label: "2 L/kg" },
          ]}
        />
      </ToolShell>

      <div className="mt-6">
        <CodexPediatricCourseBanner />
      </div>
    </>
  );
}
