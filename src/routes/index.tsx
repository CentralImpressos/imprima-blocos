import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StudioProvider, useStudio } from "@/hooks/useStudio";
import { SectionTitle, Btn } from "@/components/ui-kit/Field";
import { TemplateSelector } from "@/components/TemplateSelector";
import { BlockSettings } from "@/components/BlockSettings";
import { CompanySettings } from "@/components/CompanySettings";
import { DocumentEditor } from "@/components/DocumentEditor";
import { TableEditor } from "@/components/TableEditor";
import { FooterEditor } from "@/components/FooterEditor";
import { ProductionSettingsPanel } from "@/components/ProductionSettings";
import { DocumentPreview } from "@/components/DocumentPreview";
import { BlockSummary, PdfExport } from "@/components/PdfExport";
import { ProjectsPanel } from "@/components/ProjectsPanel";
import { getType } from "@/data/blockTypes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Imprima Cooper — Gerador de Blocos Gráficos" }] }),
  component: () => (<StudioProvider><Studio /></StudioProvider>),
});

const TABS = [{ id: "empresa", label: "Empresa" }, { id: "elementos", label: "Elementos" }, { id: "tabela", label: "Tabela" }, { id: "rodape", label: "Rodapé" }, { id: "producao", label: "Produção" }, { id: "resumo", label: "Resumo" }] as const;
type TabId = (typeof TABS)[number]["id"];
function CmykBar() { return <div className="cmyk-bar"><span style={{ background: "var(--color-cmyk-c)" }} /><span style={{ background: "var(--color-cmyk-m)" }} /><span style={{ background: "var(--color-cmyk-y)" }} /><span style={{ background: "var(--color-cmyk-k)" }} /></div>; }

function Studio() {
  const { doc, newBlock } = useStudio(); const [tab, setTab] = useState<TabId>("empresa"); const hasTable = getType(doc.typeId).hasItemsTable;
  return <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-background">
    <header className="shrink-0 border-b border-border bg-surface"><CmykBar /><div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"><div className="flex items-center gap-4"><img src="/logo.svg" alt="Imprima Cooper" className="h-9 w-auto max-w-[220px] object-contain" /><span className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Gerador de Blocos</span></div><div className="flex items-center gap-3"><Btn onClick={() => newBlock(doc.typeId)}>Novo bloco</Btn><PdfExport /></div></div></header>
    <div className="grid min-h-0 flex-1 overflow-hidden grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)_480px]">
      <aside className="min-h-0 min-w-0 overflow-x-hidden overflow-y-auto border-r border-border bg-surface"><SectionTitle>Tipo de bloco</SectionTitle><TemplateSelector /><SectionTitle>Configuração do bloco</SectionTitle><BlockSettings /><SectionTitle>Projetos</SectionTitle><ProjectsPanel /></aside>
      <main className="min-h-0 min-w-0 overflow-hidden"><DocumentPreview /></main>
      <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-l border-border bg-surface"><div className="flex shrink-0 flex-wrap gap-1 border-b border-border p-2.5">{TABS.filter((t) => t.id !== "tabela" || hasTable).map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={cn("rounded-[3px] px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wide transition-colors", tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary")}>{t.label}</button>)}</div><div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">{tab === "empresa" && <CompanySettings />}{tab === "elementos" && <DocumentEditor />}{tab === "tabela" && hasTable && <TableEditor />}{tab === "rodape" && <FooterEditor />}{tab === "producao" && <ProductionSettingsPanel />}{tab === "resumo" && <BlockSummary />}</div></aside>
    </div>
  </div>;
}
