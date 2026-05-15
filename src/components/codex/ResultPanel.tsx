import { cn } from "@/lib/utils";
import { severityClasses, type ToolResult } from "@/lib/codex";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  result: ToolResult;
  emptyLabel?: string;
}

export function ResultPanel({ result, emptyLabel = "Ingresa los datos para ver el resultado" }: Props) {
  const sev = result.severity ?? "neutral";
  const s = severityClasses[sev];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border ring-1 transition-colors",
        result.empty ? "border-border ring-transparent bg-surface-2" : "border-border ring-transparent",
        !result.empty && s.bg,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary opacity-70" />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Resultado
            </span>
          </div>
          {!result.empty && result.severity ? (
            <span className={cn("pill", s.text)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
              {s.label}
            </span>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={result.empty ? "empty" : (result.value ?? "x") + (result.interpretation ?? "")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-3"
          >
            {result.empty ? (
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {result.title ? (
                    <span className="text-sm font-medium text-muted-foreground">{result.title}</span>
                  ) : null}
                  {result.value !== undefined ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className={cn("font-display text-4xl sm:text-5xl font-semibold tracking-tight font-mono-num", s.text)}>
                        {result.value}
                      </span>
                      {result.unit ? (
                        <span className="text-sm text-muted-foreground">{result.unit}</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {result.interpretation ? (
                  <p className={cn("text-sm font-medium", s.text)}>{result.interpretation}</p>
                ) : null}

                {result.rows && result.rows.length > 0 ? (
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {result.rows.map((row, i) => {
                      const rs = severityClasses[row.severity ?? "neutral"];
                      return (
                        <li
                          key={i}
                          className="flex items-baseline justify-between gap-3 rounded-xl bg-background/40 px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className={cn("font-mono-num font-semibold", rs.text)}>
                            {row.value}
                            {row.unit ? <span className="ml-1 text-xs text-muted-foreground font-normal">{row.unit}</span> : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                {result.note ? (
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">{result.note}</p>
                ) : null}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
