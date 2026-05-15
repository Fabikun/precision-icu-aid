import { GraduationCap, ArrowUpRight, Baby } from "lucide-react";

/**
 * Banner que invita al curso de Ventilación Mecánica Invasiva Pediátrica de CODEX.
 * Se muestra al final de cada herramienta del módulo Pediatría UCI.
 */
export function CodexPediatricCourseBanner() {
  return (
    <a
      href="https://codex-ed.com/courses/curso-online-ventilacion-mecanica-invasiva-pediatrica/"
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 transition-all hover:border-primary/60 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Baby className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Curso CODEX · Pediatría
            </span>
          </div>
          <p className="mt-0.5 font-display text-[14px] font-semibold leading-tight">
            ¿Quieres aprender ventilación mecánica pediátrica en la práctica real?
          </p>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
            Domina desde lo básico hasta la programación avanzada del ventilador en pacientes pediátricos con un enfoque 100% clínico.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-primary group-hover:underline">
            Ver curso en Codex
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
