import type { BlockDoc } from "@/types/block";
import type { Company } from "@/types/company";
import type { ProductionSettings } from "@/types/production";

const K_COMPANY = "ic.company";
const K_PROJECTS = "ic.projects";
const K_PRODUCTION = "ic.production";

export interface Project {
  id: string;
  name: string;
  doc: BlockDoc;
  updatedAt: number;
}

const read = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
};

export const loadCompany = () => read<Company>(K_COMPANY);
export const saveCompany = (c: Company) => write(K_COMPANY, c);

export const loadProduction = () => read<ProductionSettings>(K_PRODUCTION);
export const saveProduction = (p: ProductionSettings) => write(K_PRODUCTION, p);

export const loadProjects = (): Project[] => read<Project[]>(K_PROJECTS) ?? [];
export const saveProjects = (list: Project[]) => write(K_PROJECTS, list);

export function upsertProject(doc: BlockDoc): Project[] {
  const list = loadProjects();
  const now = Date.now();
  const idx = list.findIndex((p) => p.id === doc.id);
  const project: Project = { id: doc.id, name: doc.name, doc: { ...doc, updatedAt: now }, updatedAt: now };
  if (idx >= 0) list[idx] = project;
  else list.unshift(project);
  saveProjects(list);
  return list;
}

export function deleteProject(id: string): Project[] {
  const list = loadProjects().filter((p) => p.id !== id);
  saveProjects(list);
  return list;
}
