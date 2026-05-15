import type { ComponentType } from "react";
import { Brain, Baby } from "lucide-react";
import { LungIcon, RunningManIcon } from "@/components/codex/icons";

export type CategoryId = "respiratoria" | "fisica" | "general" | "pediatria";

export interface CategoryMeta {
  id: CategoryId;
  title: string;
  short: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent: string; // tailwind class for tinting
  count?: number;
}

export interface ToolMeta {
  id: string;
  name: string;
  shortName?: string;
  category: CategoryId;
  description: string;
  tags?: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "respiratoria",
    title: "Terapia Respiratoria",
    short: "Respiratoria",
    description: "Oxigenación, mecánica VMI, weaning y VMNI",
    icon: LungIcon,
    accent: "from-primary/20 to-info/10",
  },
  {
    id: "fisica",
    title: "Terapia Física",
    short: "Física",
    description: "Funcionalidad, fuerza y movilidad temprana",
    icon: RunningManIcon,
    accent: "from-success/20 to-primary/10",
  },
  {
    id: "general",
    title: "Evaluación General",
    short: "General",
    description: "Conciencia, sedación y despertar",
    icon: Brain,
    accent: "from-warning/20 to-destructive/10",
  },
  {
    id: "pediatria",
    title: "Pediatría UCI",
    short: "Pediatría",
    description: "Sedoanalgesia, broncoobstrucción y soporte respiratorio pediátrico",
    icon: Baby,
    accent: "from-info/20 to-primary/10",
  },
];

export const TOOLS: ToolMeta[] = [
  // Respiratoria
  { id: "irox",      name: "iROX",                       category: "respiratoria", description: "Predicción de fracaso de CNAF", tags: ["CNAF", "oxigenación"] },
  { id: "pafi",      name: "PaFi",                       category: "respiratoria", description: "PaO₂ / FiO₂ — gravedad de hipoxemia", tags: ["SDRA"] },
  { id: "iox",       name: "Índice de Oxigenación (IOx)",shortName: "IOx", category: "respiratoria", description: "Incorpora soporte ventilatorio (Pmva)", tags: ["VMI", "SDRA"] },
  { id: "aa",        name: "Gradiente A–a",              category: "respiratoria", description: "PAO₂ − PaO₂, mecanismo de hipoxemia", tags: ["gases"] },
  { id: "vdvt",      name: "Relación VD/VT",             category: "respiratoria", description: "Espacio muerto y eficiencia ventilatoria" },
  { id: "safi",      name: "SaFi",                       category: "respiratoria", description: "Equivalente no invasivo de PaFi" },
  { id: "peso-vm",   name: "Peso para VM",               category: "respiratoria", description: "Peso ideal y predicho · VT 6–8 ml/kg", tags: ["protectora"] },
  { id: "mecanica",  name: "Mecánica VMI",               category: "respiratoria", description: "ΔP, Cest, Cdyn y Raw", tags: ["VMI"] },
  { id: "cabrini",   name: "Índice de Cabrini",          category: "respiratoria", description: "Esfuerzo respiratorio clínico" },
  { id: "hacor",     name: "Score HACOR",                category: "respiratoria", description: "Riesgo de fracaso de VMNI" },
  { id: "pim",       name: "PIm / IMT",                  category: "respiratoria", description: "Cargas de entrenamiento inspiratorio" },
  { id: "weaning",   name: "Weaning",                    category: "respiratoria", description: "Tobin (RSBI) + fracción de engrosamiento diafragmático" },
  { id: "peep-titration", name: "Titulación de PEEP",   shortName: "PEEP", category: "respiratoria", description: "Decremental: Cst, driving pressure y PEEP óptimo", tags: ["VMI", "SDRA", "reclutamiento"] },

  // Física
  { id: "fss",       name: "FSS-ICU",                    category: "fisica", description: "Functional Status Score in ICU (0–35)" },
  { id: "mrc",       name: "MRC Sum Score",              category: "fisica", description: "Fuerza muscular global (0–60)" },
  { id: "ims",       name: "ICU Mobility Scale",         shortName: "IMS", category: "fisica", description: "Nivel de movilidad alcanzado (0–10)" },
  { id: "fcr",       name: "FC de Reserva (Karvonen)",   shortName: "FCR", category: "fisica", description: "FC objetivo para ejercicio" },

  // General
  { id: "s5q",       name: "Escala S5Q",                 category: "general", description: "Despertar e inicio de actividad" },
  { id: "glasgow",   name: "Escala de Glasgow",          category: "general", description: "Nivel de conciencia" },
  { id: "rass",      name: "Escala RASS",                category: "general", description: "Sedación / agitación" },
  { id: "sas",       name: "Escala SAS",                 category: "general", description: "Sedación – agitación (Riker)" },

  // Pediatría UCI
  { id: "comfortb",   name: "COMFORT-B",                 category: "pediatria", description: "Sedoanalgesia pediátrica (6–30)", tags: ["sedación", "pediatría"] },
  { id: "wood-downes",name: "Wood-Downes modificado", shortName: "Wood-Downes", category: "pediatria", description: "severidad de la obstrucción bronquial y la dificultad respiratoria", tags: ["asma", "pediatría"] },
  { id: "cnaf-ped",   name: "Flujo CNAF pediátrico",     category: "pediatria", description: "Flujo recomendado según peso", tags: ["CNAF", "pediatría"] },
  { id: "tal",        name: "Tal score modificado",      category: "pediatria", description: "Severidad de obstrucción bronquial", tags: ["bronquiolitis", "pediatría"] },
];

export function getCategory(id: CategoryId | string) {
  return CATEGORIES.find((c) => c.id === id);
}
export function getTool(id: string) {
  return TOOLS.find((t) => t.id === id);
}
export function toolsByCategory(id: CategoryId) {
  return TOOLS.filter((t) => t.category === id);
}
