import { useParams, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/codex/AppHeader";
import { BottomNav } from "@/components/codex/BottomNav";
import { ToolCard } from "@/components/codex/ToolCard";
import { CATEGORIES, getCategory, toolsByCategory } from "@/data/tools";
import type { CategoryId } from "@/data/tools";
import { useEffect } from "react";

const CategoryPage = () => {
  const { id } = useParams<{ id: CategoryId }>();
  const category = id ? getCategory(id) : undefined;
  const tools = id ? toolsByCategory(id as CategoryId) : [];

  useEffect(() => {
    if (category) document.title = `${category.title} · CODEX Tools`;
  }, [category]);

  if (!category) return <Navigate to="/" replace />;

  const Icon = category.icon;
  return (
    <div className="min-h-screen pb-24">
      <AppHeader title={category.short} subtitle={`${tools.length} herramientas`} showBack />

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-card p-5 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">{category.title}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-2.5">
          {tools.map((t) => <ToolCard key={t.id} tool={t} />)}
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70">
          <span>Otras categorías:</span>
          {CATEGORIES.filter(c => c.id !== category.id).map((c) => (
            <a key={c.id} href={`/c/${c.id}`} className="hover:text-foreground underline-offset-2 hover:underline">{c.short}</a>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryPage;
