import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BlockDoc, BlockTypeId } from "@/types/block";
import { emptyCompany, type Company } from "@/types/company";
import { defaultProduction, type ProductionSettings } from "@/types/production";
import { applyTypeRules, createBlockDoc, defaultFields, getType } from "@/data/blockTypes";
import {
  deleteProject,
  loadCompany,
  loadProduction,
  loadProjects,
  saveCompany,
  saveProduction,
  upsertProject,
  type Project,
} from "@/lib/storage";
import { imageAspect } from "@/pdf/generatePdf";

interface StudioValue {
  company: Company;
  setCompany: (patch: Partial<Company>) => void;
  doc: BlockDoc;
  setDoc: (patch: Partial<BlockDoc>) => void;
  changeType: (id: BlockTypeId) => void;
  production: ProductionSettings;
  setProduction: (patch: Partial<ProductionSettings>) => void;
  projects: Project[];
  saveCurrent: () => void;
  openProject: (id: string) => void;
  duplicateCurrent: () => void;
  removeProject: (id: string) => void;
  newBlock: (type: BlockTypeId) => void;
  logoAspect: number | null;
  ready: boolean;
}

const Ctx = createContext<StudioValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [company, setCompanyState] = useState<Company>(() => emptyCompany());
  const [doc, setDocState] = useState<BlockDoc>(() => createBlockDoc("comanda", "Novo bloco"));
  const [production, setProductionState] = useState<ProductionSettings>(() => defaultProduction());
  const [projects, setProjects] = useState<Project[]>([]);
  const [logoAspect, setLogoAspect] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = loadCompany();
    if (c) setCompanyState({ ...emptyCompany(), ...c });
    const p = loadProduction();
    if (p) setProductionState({ ...defaultProduction(), ...p });
    const list = loadProjects();
    setProjects(list);
    if (list[0]) setDocState(applyTypeRules(list[0].doc));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!company.logo) {
      setLogoAspect(null);
      return;
    }
    let alive = true;
    imageAspect(company.logo).then((a) => alive && setLogoAspect(a));
    return () => {
      alive = false;
    };
  }, [company.logo]);

  const setCompany = useCallback((patch: Partial<Company>) => {
    setCompanyState((prev) => {
      const next = { ...prev, ...patch };
      saveCompany(next);
      return next;
    });
  }, []);

  const setDoc = useCallback((patch: Partial<BlockDoc>) => {
    setDocState((prev) => applyTypeRules({ ...prev, ...patch }));
  }, []);

  const setProduction = useCallback((patch: Partial<ProductionSettings>) => {
    setProductionState((prev) => {
      const next = { ...prev, ...patch };
      saveProduction(next);
      return next;
    });
  }, []);

  const changeType = useCallback((id: BlockTypeId) => {
    setDocState((prev) => {
      const fresh = createBlockDoc(id, prev.name);
      return applyTypeRules({
        ...fresh,
        id: prev.id,
        name: prev.name,
        sizeId: fresh.sizeId,
        copies: prev.copies,
        footer: prev.footer,
        fields: { ...defaultFields(id) },
        title: getType(id).label.toUpperCase(),
      });
    });
  }, []);

  const saveCurrent = useCallback(() => {
    setProjects(upsertProject(doc));
  }, [doc]);

  const openProject = useCallback((id: string) => {
    const p = loadProjects().find((x) => x.id === id);
    if (p) setDocState(applyTypeRules(p.doc));
  }, []);

  const duplicateCurrent = useCallback(() => {
    const copy: BlockDoc = { ...doc, id: crypto.randomUUID(), name: `${doc.name} (cópia)` };
    setDocState(copy);
    setProjects(upsertProject(copy));
  }, [doc]);

  const removeProject = useCallback((id: string) => {
    setProjects(deleteProject(id));
  }, []);

  const newBlock = useCallback((type: BlockTypeId) => {
    setDocState(createBlockDoc(type));
  }, []);

  const value = useMemo<StudioValue>(
    () => ({
      company,
      setCompany,
      doc,
      setDoc,
      changeType,
      production,
      setProduction,
      projects,
      saveCurrent,
      openProject,
      duplicateCurrent,
      removeProject,
      newBlock,
      logoAspect,
      ready,
    }),
    [
      company,
      setCompany,
      doc,
      setDoc,
      changeType,
      production,
      setProduction,
      projects,
      saveCurrent,
      openProject,
      duplicateCurrent,
      removeProject,
      newBlock,
      logoAspect,
      ready,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudio() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStudio deve ser usado dentro de StudioProvider");
  return v;
}
