import { AppHeader } from "@/components/codex/AppHeader";
import { BottomNav } from "@/components/codex/BottomNav";
import { CategoryCard } from "@/components/codex/CategoryCard";
import { CATEGORIES, TOOLS, toolsByCategory } from "@/data/tools";
import { Link } from "react-router-dom";
import { Search, Sparkles, ShieldCheck, Zap, GraduationCap, ArrowUpRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-hero p-6 sm:p-8 text-center animate-fade-in">
          <h1 className="font-display text-[28px] sm:text-[34px] font-semibold leading-tight tracking-tight text-balance">
            Calculadoras y escalas <span className="bg-gradient-primary bg-clip-text text-transparent">de cabecera</span> para fisioterapeutas y kinesiólogos en cuidados intensivos.
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
            {TOOLS.length} herramientas para tu práctica diaria en UCI, con interpretación instantánea y diseño pensado para usar al lado del paciente.
          </p>
        </section>

        {/* Categorías */}
        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-[15px] font-semibold tracking-wide text-muted-foreground uppercase">Categorías</h2>
          </div>
          <div className="grid gap-3">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} category={c} count={toolsByCategory(c.id).length} />
            ))}
          </div>
        </section>

        {/* Acceso rápido */}
        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-[15px] font-semibold tracking-wide text-muted-foreground uppercase">Más usadas</h2>
            <Link to="/c/respiratoria" className="text-xs font-medium text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["pafi", "irox", "mrc", "fss", "hacor", "glasgow"].map((id) => {
              const t = TOOLS.find((x) => x.id === id);
              if (!t) return null;
              return (
                <Link
                  key={id}
                  to={`/t/${id}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border/70 bg-surface p-3 transition-all hover:border-primary/40 hover:bg-surface-2"
                >
                  <span className="font-display text-[13px] font-semibold text-primary">
                    {(t.shortName ?? t.name).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-muted-foreground line-clamp-2">{t.description}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Aprende más con CODEX */}
        <section className="mt-7">
          <a
            href="https://codex-ed.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 sm:p-6 transition-all hover:border-primary/60 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Somos los creadores
                </span>
                <h3 className="mt-1 font-display text-[17px] font-semibold leading-tight">
                  Aprende más sobre soporte respiratorio en CODEX
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                  Cursos, recursos y formación clínica para profundizar en ventilación mecánica,
                  CNAF, VMNI y más. Visita nuestra web para conocer todo lo que tenemos para tí.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary group-hover:underline">
                  Ir a codex-ed.com
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </a>
        </section>

        <p className="mt-10 text-center text-[11px] text-muted-foreground/70">
          Uso clínico orientativo. Integra siempre el resultado al contexto del paciente.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
