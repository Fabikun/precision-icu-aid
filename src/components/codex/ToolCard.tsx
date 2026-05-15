import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ToolMeta } from "@/data/tools";
import { ChevronRight } from "lucide-react";

interface Props {
  tool: ToolMeta;
}

export function ToolCard({ tool }: Props) {
  return (
    <Link
      to={`/t/${tool.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/70 bg-surface px-4 py-3.5",
        "transition-all hover:border-primary/40 hover:bg-surface-2"
      )}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 border border-border text-[12px] font-semibold tracking-wide font-display text-primary">
        {(tool.shortName ?? tool.name).slice(0, 3).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="truncate text-[15px] font-semibold leading-tight">{tool.name}</h4>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{tool.description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
