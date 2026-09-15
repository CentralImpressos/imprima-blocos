import { useStudio } from "@/hooks/useStudio";
import { TextField } from "@/components/ui-kit/Field";
import type { BlockTypeId } from "@/types/block";
import { GOOGLE_FONTS } from "@/data/fonts";

const FIELDS: Record<BlockTypeId, Array<[string, string]>> = {
  comanda: [["mesa", "Rótulo do campo 1"], ["atendente", "Rótulo do campo 2"], ["totalLabel", "Rótulo do total"]],
  pedido: [["mesa", "Rótulo do campo 1"], ["atendente", "Rótulo do campo 2"], ["totalLabel", "Rótulo do total"], ["obsLinhas", "Linhas de observação"]],
  recibo: [["numero", "Número"], ["valor", "Valor (R$)"], ["referente", "Referente a"]],
  rifa: [["numero", "Número da rifa"], ["premio", "Prêmio"], ["sorteio", "Data do sorteio"], ["valorCota", "Valor da cota (R$)"], ["promocao", "Dados da promoção"]],
  carne: [["numero", "Número do carnê"], ["cliente", "Cliente"], ["parcela", "Parcela"], ["vencimento", "Vencimento"], ["valor", "Valor (R$)"]],
};

export function DocumentEditor() {
  const { doc, setDoc } = useStudio();
  const fields = FIELDS[doc.typeId];

  return (
    <div className="flex flex-col gap-2 p-3">
      <TextField label="Título do documento" value={doc.title} onChange={(v) => setDoc({ title: v })} />
      <TextField label="Subtítulo" value={doc.subtitle} onChange={(v) => setDoc({ subtitle: v })} placeholder="Ex.: Controle interno" />

      <div className="mt-1 flex flex-col gap-2 rounded-[3px] border border-border p-2.5">
        <span className="panel-label">Tipografia</span>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Fonte dos títulos</span>
          <select className="field-input" value={doc.titleFont} onChange={(e) => setDoc({ titleFont: e.target.value })} style={{ fontFamily: doc.titleFont }}>
            {GOOGLE_FONTS.map((font) => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">Fonte do corpo</span>
          <select className="field-input" value={doc.bodyFont} onChange={(e) => setDoc({ bodyFont: e.target.value })} style={{ fontFamily: doc.bodyFont }}>
            {GOOGLE_FONTS.map((font) => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
          </select>
        </label>
      </div>

      {fields.map(([key, label]) => <TextField key={key} label={label} value={doc.fields[key] ?? ""} onChange={(v) => setDoc({ fields: { ...doc.fields, [key]: v } })} />)}
      {doc.typeId === "rifa" && <p className="text-[10px] text-muted-foreground">A numeração sequencial automática será adicionada em versão futura.</p>}
    </div>
  );
}
