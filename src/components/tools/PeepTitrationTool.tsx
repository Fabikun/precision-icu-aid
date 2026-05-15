import { useState, useMemo } from "react";
import { Plus, X, Activity, AlertTriangle, AlertOctagon, Info, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Row = {
  p: number; v: number; pl: number; m: number | null;
  dp: number; cst: number; note: string;
};

type Severity = "error" | "warning" | "info";
type Alert = { id: string; severity: Severity; msg: string; fix: string };

function validate(
  form: { peep: string; vt: string; pplat: string; pam: string },
  rows: Row[],
): Alert[] {
  const alerts: Alert[] = [];
  const peep = parseFloat(form.peep);
  const vt = parseFloat(form.vt);
  const pl = parseFloat(form.pplat);
  const pam = form.pam ? parseFloat(form.pam) : NaN;

  if (!isNaN(peep) && !isNaN(pl)) {
    if (peep >= pl) {
      alerts.push({ id: "peep-ge-pplat", severity: "error",
        msg: `PEEP (${peep}) ≥ P.Plateau (${pl}). No es físicamente posible.`,
        fix: "Verifica la pausa inspiratoria; P.Plateau debe registrarse en oclusión teleinspiratoria." });
    } else if (pl - peep < 2) {
      alerts.push({ id: "dp-too-low", severity: "warning",
        msg: `Driving pressure muy baja (${(pl - peep).toFixed(1)} cmH₂O).`,
        fix: "Confirma VT y P.Plateau — valores tan bajos suelen indicar lectura previa al equilibrio." });
    }
  }
  if (!isNaN(peep)) {
    if (peep < 0) alerts.push({ id: "peep-neg", severity: "error", msg: "PEEP no puede ser negativa.", fix: "Reingresa un valor ≥ 0 cmH₂O." });
    else if (peep > 24) alerts.push({ id: "peep-high", severity: "warning", msg: `PEEP elevada (${peep} cmH₂O).`, fix: "Vigila hemodinamia y barotrauma; rara vez se requiere PEEP > 20." });
  }
  if (!isNaN(pl)) {
    if (pl > 35) alerts.push({ id: "pplat-danger", severity: "error", msg: `P.Plateau ${pl} cmH₂O excede 30 cmH₂O.`, fix: "Reduce VT (4–6 mL/kg PBW) o reevalúa la mecánica." });
    else if (pl > 30) alerts.push({ id: "pplat-high", severity: "warning", msg: `P.Plateau ${pl} cmH₂O en límite alto.`, fix: "Mantén meta < 30 cmH₂O para limitar VILI." });
  }
  if (!isNaN(vt)) {
    if (vt < 100 || vt > 1200) alerts.push({ id: "vt-range", severity: "error", msg: `VT fuera de rango clínico (${vt} mL).`, fix: "Verifica unidades — VT habitual: 200–600 mL (4–8 mL/kg PBW)." });
    else if (vt > 700) alerts.push({ id: "vt-high", severity: "warning", msg: `VT alto (${vt} mL).`, fix: "Considera ventilación protectora: 4–6 mL/kg de peso predicho." });
  }
  if (!isNaN(peep) && !isNaN(pl) && !isNaN(vt) && pl > peep) {
    const dp = pl - peep;
    if (dp >= 18) alerts.push({ id: "dp-critical", severity: "error", msg: `Driving pressure crítica (${dp.toFixed(1)} cmH₂O).`, fix: "Asociada a mortalidad: reduce VT, optimiza PEEP o reevalúa reclutabilidad." });
    else if (dp >= 15) alerts.push({ id: "dp-high", severity: "warning", msg: `Driving pressure elevada (${dp.toFixed(1)} cmH₂O).`, fix: "Apunta a DP < 15. Reduce VT o ajusta PEEP." });
    const cst = vt / dp;
    if (cst < 20) alerts.push({ id: "cst-low", severity: "warning", msg: `Compliance muy baja (${cst.toFixed(1)} mL/cmH₂O).`, fix: "Descarta neumotórax, atelectasias o intubación selectiva." });
  }
  if (!isNaN(pam)) {
    if (pam < 65) alerts.push({ id: "pam-low", severity: "warning", msg: `PAM baja (${pam} mmHg).`, fix: "Optimiza volemia/vasopresores antes de subir PEEP." });
    else if (pam > 110) alerts.push({ id: "pam-high", severity: "info", msg: `PAM elevada (${pam} mmHg).`, fix: "Verifica sedación y dolor; descarta hipertensión secundaria." });
  }
  if (!isNaN(peep) && rows.length > 0) {
    const last = rows[rows.length - 1].p;
    if (peep >= last) alerts.push({ id: "not-decremental", severity: "info", msg: `Esta PEEP (${peep}) no es menor que la última (${last}).`, fix: "El protocolo es decremental: baja 2 cmH₂O por paso." });
    else if (last - peep > 4) alerts.push({ id: "step-large", severity: "info", msg: `Salto de ${last - peep} cmH₂O respecto al paso anterior.`, fix: "Decrementos de 2 cmH₂O permiten detectar el punto óptimo." });
  }
  if (!isNaN(peep) && rows.some(r => r.p === peep)) {
    alerts.push({ id: "peep-dup", severity: "warning", msg: `Ya existe una medición a PEEP ${peep}.`, fix: "Elimina la lectura previa o usa un nivel distinto." });
  }
  return alerts;
}

const calc = (vt: number, ppl: number, peep: number) => {
  const dp = ppl - peep;
  if (dp <= 0) return null;
  return { dp: +dp.toFixed(1), cst: +(vt / dp).toFixed(1) };
};

const getBest = (rows: Row[]) => {
  if (!rows.length) return { bc: -1, bd: -1 };
  let bc = 0, bd = 0;
  rows.forEach((r, i) => {
    if (r.cst > rows[bc].cst) bc = i;
    if (r.dp < rows[bd].dp) bd = i;
  });
  return { bc, bd };
};


export default function PeepTitrationTool() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ peep: "", vt: "", pplat: "", pam: "", note: "" });

  const preview = useMemo(() => {
    const p = parseFloat(form.peep), v = parseFloat(form.vt), pl = parseFloat(form.pplat);
    if (p && v && pl) return calc(v, pl, p);
    return null;
  }, [form]);

  const alerts = useMemo(() => validate(form, rows), [form, rows]);
  const hasErrors = alerts.some(a => a.severity === "error");

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }));

  const addRow = () => {
    const p = parseFloat(form.peep), v = parseFloat(form.vt), pl = parseFloat(form.pplat);
    const m = form.pam ? parseFloat(form.pam) : null;
    if (!p || !v || !pl) { toast.error("Datos incompletos", { description: "PEEP, VT y P.Plateau son obligatorios." }); return; }
    if (hasErrors) { const first = alerts.find(a => a.severity === "error")!; toast.error("No registrada", { description: first.msg }); return; }
    const d = calc(v, pl, p);
    if (!d) { toast.error("Valores incoherentes", { description: "P.Plateau debe ser mayor que PEEP." }); return; }
    setRows(prev => [...prev, { p, v, pl, m, ...d, note: form.note.trim() }].sort((a, b) => b.p - a.p));
    const warn = alerts.find(a => a.severity === "warning");
    if (warn) toast.warning("Registrada con advertencia", { description: warn.msg });
    else toast.success(`PEEP ${p} registrada`, { description: `DP ${d.dp} · Cst ${d.cst} mL/cmH₂O` });
    setForm({ peep: "", vt: "", pplat: "", pam: "", note: "" });
  };

  const delRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));
  const clearAll = () => { if (rows.length && confirm("¿Limpiar todo?")) setRows([]); };

  const { bc, bd } = getBest(rows);
  const bestPeep = rows[bc]?.p;

  const fields = [
    { f: "peep",  label: "PEEP",      unit: "cmH₂O", ph: "14"  },
    { f: "vt",    label: "VT",        unit: "mL",    ph: "450" },
    { f: "pplat", label: "P.Plateau", unit: "cmH₂O", ph: "26"  },
    { f: "pam",   label: "PAM",       unit: "mmHg",  ph: "75"  },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <Activity className="w-3 h-3" /> UCI · Ventilación mecánica
        </div>
        <h2 className="font-display text-[22px] font-semibold tracking-tight mt-1">
          Titulación decremental de PEEP
        </h2>
        <p className="mt-1 text-sm text-muted-foreground text-balance">
          Compliance estática, driving pressure y PEEP óptimo a partir de mediciones secuenciales.
        </p>
      </div>

      <div className="info-block">
        <strong>Fórmulas:</strong> ΔP = P.Plateau − PEEP · Cst = VT ÷ ΔP
      </div>

      {/* Form */}
      <div className="glass-card p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ f, label, unit, ph }) => (
            <div key={f} className="flex flex-col">
              <label className="field-label">
                {label} <span className="text-muted-foreground/70 font-normal">({unit})</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                placeholder={ph}
                value={form[f as keyof typeof form]}
                onChange={set(f as keyof typeof form)}
                onKeyDown={(e) => e.key === "Enter" && addRow()}
                className="field-input font-mono-num"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="field-label">Nota (opcional)</label>
          <input
            type="text"
            placeholder="Ej: post reclutamiento"
            maxLength={60}
            value={form.note}
            onChange={set("note")}
            onKeyDown={(e) => e.key === "Enter" && addRow()}
            className="field-input text-sm"
          />
        </div>

        {/* Live preview */}
        {preview && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Driving Pressure", sub: "P.Plat − PEEP", val: preview.dp, unit: "cmH₂O", bad: preview.dp >= 15 },
              { label: "Compliance Est.",  sub: "VT ÷ ΔP",       val: preview.cst, unit: "mL/cmH₂O", bad: false },
            ].map(({ label, sub, val, unit, bad }) => (
              <div key={label} className="rounded-xl border border-border bg-surface-2 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
                <div className="text-[10px] text-muted-foreground/70 font-mono-num">{sub}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`font-display text-2xl font-semibold ${bad ? "text-destructive" : "text-primary"}`}>{val}</span>
                  <span className="text-[10px] text-muted-foreground font-mono-num">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((a) => {
              const Icon = a.severity === "error" ? AlertOctagon : a.severity === "warning" ? AlertTriangle : Info;
              const tone =
                a.severity === "error" ? "border-destructive/40 bg-destructive/10 text-destructive"
                : a.severity === "warning" ? "border-warning/40 bg-warning/10 text-warning"
                : "border-info/40 bg-info/10 text-info";
              return (
                <div key={a.id} role={a.severity === "error" ? "alert" : "status"}
                  className={`flex gap-3 px-3 py-2.5 border rounded-xl ${tone}`}>
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{a.msg}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      <span className="uppercase tracking-wider text-[9px]">corrección · </span>{a.fix}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={addRow} disabled={hasErrors} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Agregar
          </button>
          <button onClick={clearAll} className="btn-ghost">
            <RotateCcw className="w-4 h-4" /> Limpiar
          </button>
        </div>
      </div>

      {/* Summary */}
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Resultado</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mejor compliance</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-success">{rows[bc]?.p}</span>
                <span className="text-[10px] text-muted-foreground font-mono-num">cmH₂O</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground font-mono-num">
                Cst {rows[bc]?.cst.toFixed(1)} · DP {rows[bc]?.dp.toFixed(1)}
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Menor driving P.</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-info">{rows[bd]?.p}</span>
                <span className="text-[10px] text-muted-foreground font-mono-num">cmH₂O</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground font-mono-num">
                DP {rows[bd]?.dp.toFixed(1)} · Cst {rows[bd]?.cst.toFixed(1)}
              </div>
            </div>
            <div className="glass-card p-4 ring-1 ring-primary/40">
              <div className="text-[10px] uppercase tracking-wider text-primary">PEEP sugerido</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-primary">{bc === bd ? rows[bc]?.p : "↔"}</span>
                <span className="text-[10px] text-muted-foreground font-mono-num">cmH₂O</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground leading-snug">
                {bc === bd
                  ? `Cst máx y DP mín coinciden en PEEP ${rows[bc]?.p}.`
                  : `Cst → ${rows[bc]?.p} · DP → ${rows[bd]?.p}. Decisión clínica.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Chips */}
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">KPIs por lectura</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[...rows].sort((a, b) => a.p - b.p).map((r, idx) => {
              const dpSev = r.dp >= 18 ? "error" : r.dp >= 15 ? "warning" : "ok";
              const cstSev = r.cst < 20 ? "warning" : "ok";
              const dotCls = (s: string) =>
                s === "error" ? "bg-destructive" :
                s === "warning" ? "bg-warning" : "bg-success";
              return (
                <div key={idx} className="glass-card p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">PEEP</span>
                    <span className="font-display text-lg font-semibold text-primary">{r.p}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">DP</span>
                    <div className="flex items-center gap-1.5">
                      <span className={dpSev === "error" ? "text-destructive font-semibold" : dpSev === "warning" ? "text-warning font-semibold" : "text-success font-semibold"}>
                        {r.dp.toFixed(1)}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotCls(dpSev)}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cst</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cstSev === "warning" ? "text-warning font-semibold" : "text-success font-semibold"}>
                        {r.cst.toFixed(1)}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotCls(cstSev)}`} />
                    </div>
                  </div>
                  {r.note && <div className="text-[10px] text-muted-foreground truncate">{r.note}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Registro</div>
          <span className="text-xs text-muted-foreground font-mono-num">
            {rows.length ? `${rows.length} lectura${rows.length > 1 ? "s" : ""}` : "—"}
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center">
            <div className="font-display text-lg text-muted-foreground italic">Aún sin mediciones</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Ingresa la primera lectura arriba</div>
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 px-3 text-left font-normal">PEEP</th>
                  <th className="py-2 px-3 text-right font-normal">VT</th>
                  <th className="py-2 px-3 text-right font-normal">P.Plat</th>
                  <th className="py-2 px-3 text-right font-normal">PAM</th>
                  <th className="py-2 px-3 text-right font-normal">DP</th>
                  <th className="py-2 px-3 text-right font-normal">Cst</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const ibc = i === bc, ibd = i === bd, bad = r.dp >= 15;
                  return (
                    <tr key={i} className={`border-b border-border/50 last:border-0 transition-colors hover:bg-surface-2 ${(ibc || ibd) ? "bg-success/[0.04]" : ""}`}>
                      <td className="py-2.5 px-3 text-left">
                        <span className="font-display text-base font-semibold text-foreground">{r.p}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-num">{r.v}</td>
                      <td className="py-2.5 px-3 text-right font-mono-num">{r.pl}</td>
                      <td className={`py-2.5 px-3 text-right font-mono-num ${r.m ? "" : "text-muted-foreground"}`}>{r.m ?? "—"}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-mono-num font-medium ${bad ? "text-destructive" : "text-warning"}`}>{r.dp}</span>
                        {ibd && !bad && <span className="ml-1 text-[9px] text-info">↓</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-mono-num font-medium text-success">{r.cst}</span>
                        {ibc && <span className="ml-1 text-[9px] text-success">↑</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button onClick={() => delRow(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1" aria-label="Eliminar">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="info-block">
        <strong>Protocolo —</strong> registrar en descenso (ej. 20 → 18 → 16…). Buscar <span className="text-success">Cst máxima</span> con <span className="text-destructive">DP &lt; 15 cmH₂O</span>. Herramienta de apoyo, no sustituye juicio clínico.
      </div>
    </div>
  );
}
