import { useParams, Navigate, Link } from "react-router-dom";
import { AppHeader } from "@/components/codex/AppHeader";
import { BottomNav } from "@/components/codex/BottomNav";
import { getTool, getCategory } from "@/data/tools";
import { useEffect, lazy, Suspense } from "react";

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  irox:     lazy(() => import("@/components/tools/IROXTool")),
  pafi:     lazy(() => import("@/components/tools/PAFITool")),
  iox:      lazy(() => import("@/components/tools/IOXTool")),
  aa:       lazy(() => import("@/components/tools/AATool")),
  vdvt:     lazy(() => import("@/components/tools/VDVTTool")),
  safi:     lazy(() => import("@/components/tools/SAFITool")),
  "peso-vm":lazy(() => import("@/components/tools/PesoVMTool")),
  mecanica: lazy(() => import("@/components/tools/MecanicaVMITool")),
  cabrini:  lazy(() => import("@/components/tools/CabriniTool")),
  hacor:    lazy(() => import("@/components/tools/HACORTool")),
  pim:      lazy(() => import("@/components/tools/PIMTool")),
  weaning:  lazy(() => import("@/components/tools/WeaningTool")),
  fss:      lazy(() => import("@/components/tools/FSSTool")),
  mrc:      lazy(() => import("@/components/tools/MRCTool")),
  ims:      lazy(() => import("@/components/tools/IMSTool")),
  fcr:      lazy(() => import("@/components/tools/FCRTool")),
  s5q:      lazy(() => import("@/components/tools/S5QTool")),
  glasgow:  lazy(() => import("@/components/tools/GlasgowTool")),
  rass:     lazy(() => import("@/components/tools/RASSTool")),
  sas:      lazy(() => import("@/components/tools/SASTool")),
  // Pediatría UCI
  comfortb:     lazy(() => import("@/components/tools/ComfortBTool")),
  "wood-downes":lazy(() => import("@/components/tools/WoodDownesTool")),
  "cnaf-ped":   lazy(() => import("@/components/tools/CnafPedTool")),
  tal:          lazy(() => import("@/components/tools/TalScoreTool")),
};

const ToolPage = () => {
  const { id } = useParams<{ id: string }>();
  const tool = id ? getTool(id) : undefined;
  const category = tool ? getCategory(tool.category) : undefined;
  const Comp = id ? TOOL_COMPONENTS[id] : undefined;

  useEffect(() => {
    if (tool) document.title = `${tool.name} · CODEX Tools`;
  }, [tool]);

  if (!tool || !category || !Comp) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen pb-28">
      <AppHeader title={tool.shortName ?? tool.name} subtitle={category.title} showBack />

      <main className="mx-auto max-w-2xl px-4 pt-4">
        <div className="mb-4 flex items-center gap-2 text-[11px]">
          <Link to={`/c/${category.id}`} className="pill hover:text-foreground">{category.short}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="pill">{tool.shortName ?? tool.name}</span>
        </div>

        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-10 rounded-xl bg-surface-2" />
            <div className="h-48 rounded-2xl bg-surface-2" />
            <div className="h-32 rounded-2xl bg-surface-2" />
          </div>
        }>
          <Comp />
        </Suspense>
      </main>

      <BottomNav />
    </div>
  );
};

export default ToolPage;
