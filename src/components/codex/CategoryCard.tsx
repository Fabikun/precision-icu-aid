import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/data/tools";
import { ChevronRight } from "lucide-react";

interface Props {
  category: CategoryMeta;
  count: number;
}

export function CategoryCard({ category, count }: Props) {
  const Icon = category.icon;
  return (
    <Link
      to={`/c/${category.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-border/70",
        "bg-gradient-card p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5"
      )}
    >
      <div className={cn("absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-2xl bg-gradient-to-br", category.accent)} />
      <div className="relative flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-2 border border-border ring-1 ring-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-[17px] font-semibold tracking-tight">{category.title}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="pill">{count} herramientas</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
