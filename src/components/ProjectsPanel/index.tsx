import { useStudio } from "@/hooks/useStudio";
import { Btn } from "@/components/ui-kit/Field";
import { getType } from "@/data/blockTypes";

export function ProjectsPanel() {
  const { projects, openProject, removeProject, duplicateCurrent, doc, saveCurrent } = useStudio();

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex gap-1.5">
        <Btn size="sm" variant="primary" onClick={saveCurrent}>
          Salvar
        </Btn>
        <Btn size="sm" onClick={duplicateCurrent}>
          Duplicar
        </Btn>
      </div>
      <div className="flex flex-col gap-1">
        {projects.length === 0 && (
          <p className="text-[11px] text-muted-foreground">Nenhum projeto salvo ainda.</p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-1 rounded-[3px] border px-2 py-1 ${
              p.id === doc.id ? "border-primary bg-accent" : "border-border bg-surface"
            }`}
          >
            <button className="min-w-0 flex-1 text-left" onClick={() => openProject(p.id)}>
              <span className="block truncate text-xs font-medium">{p.name}</span>
              <span className="block text-[10px] text-muted-foreground">
                {getType(p.doc.typeId).label} • {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            </button>
            <Btn size="sm" variant="danger" onClick={() => removeProject(p.id)} title="Excluir">
              ×
            </Btn>
          </div>
        ))}
      </div>
    </div>
  );
}
