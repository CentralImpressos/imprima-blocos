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

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="flex flex-col gap-1"><span className="text-[11px] font-medium text-muted-foreground">{label}</span><select className="field-input" value={value} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: value }}>{GOOGLE_FONTS.map((font) => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}</select></label>;
}

function SizeSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{label}</span><strong className="text-foreground">{Number.isInteger(value) ? value : value.toFixed(1)} pt</strong>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
    </label>
  );
}

export function DocumentEditor() {
  const { doc, setDoc } = useStudio();
  const fields = FIELDS[doc.typeId];
  const brandFont = doc.brandFont || doc.titleFont;
  return (
    <div className="flex flex-col gap-2 p-3">
      <TextField label="Título do documento" value={doc.title} onChange={(v) => setDoc({ title: v })} />
      <TextField label="Subtítulo" value={doc.subtitle} onChange={(v) => setDoc({ subtitle: v })} placeholder="Ex.: Controle interno" />
      <div className="mt-1 flex flex-col gap-2 rounded-[3px] border border-border p-2.5">
        <span className="panel-label">Tipografia</span>
        <FontSelect label="Fonte do nome da empresa" value={brandFont} onChange={(v) => setDoc({ brandFont: v })} />
        <SizeSlider label="Tamanho do nome da empresa" value={doc.brandSize ?? 12} min={8} max={24} step={0.5} onChange={(v) => setDoc({ brandSize: v })} />
        <FontSelect label="Fonte dos títulos" value={doc.titleFont} onChange={(v) => setDoc({ titleFont: v })} />
        <SizeSlider label="Tamanho dos títulos" value={doc.titleSize} min={8} max={24} step={0.5} onChange={(v) => setDoc({ titleSize: v })} />
        <SizeSlider label="Tamanho dos totais" value={doc.totalSize} min={7} max={24} step={0.5} onChange={(v) => setDoc({ totalSize: v })} />
        <FontSelect label="Fonte do corpo" value={doc.bodyFont} onChange={(v) => setDoc({ bodyFont: v })} />
        <SizeSlider label="Tamanho do corpo" value={doc.bodySize} min={5} max={14} step={0.5} onChange={(v) => setDoc({ bodySize: v })} />
        <SizeSlider label="Tamanho da tabela" value={doc.table.fontSize} min={5} max={14} step={0.5} onChange={(v) => setDoc({ table: { ...doc.table, fontSize: v } })} />
      </div>
      {fields.map(([key, label]) => <TextField key={key} label={label} value={doc.fields[key] ?? ""} onChange={(v) => setDoc({ fields: { ...doc.fields, [key]: v } })} />)}
      {doc.typeId === "rifa" && <p className="text-[10px] text-muted-foreground">A numeração sequencial automática será adicionada em versão futura.</p>}
    </div>
  );
}
