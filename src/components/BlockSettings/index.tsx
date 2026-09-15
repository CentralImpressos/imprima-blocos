import { useEffect } from "react";
import { BLOCK_SIZES, getSize } from "@/data/blockSizes";
import { getType } from "@/data/blockTypes";
import { GOOGLE_FONTS } from "@/data/fonts";
import { COPIES_OPTIONS } from "@/data/finishingOptions";
import { useStudio } from "@/hooks/useStudio";
import { Check, Field } from "@/components/ui-kit/Field";
import { cn } from "@/lib/utils";

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {GOOGLE_FONTS.map((font) => <option key={font} value={font}>{font}</option>)}
      </select>
    </Field>
  );
}

function FontSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <Field label={`${label} — ${Number.isInteger(value) ? value : value.toFixed(1)} pt`}>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="accent-[var(--color-primary)]" />
    </Field>
  );
}

export function BlockSettings() {
  const { doc, setDoc } = useStudio();
  const rules = getType(doc.typeId).rules;
  const landscapeOnly = rules.canhoto === "required";
  const availableSizes = landscapeOnly ? BLOCK_SIZES.filter((s) => s.widthMm > s.heightMm) : BLOCK_SIZES;

  useEffect(() => {
    if (landscapeOnly && getSize(doc.sizeId).widthMm <= getSize(doc.sizeId).heightMm) setDoc({ sizeId: getType(doc.typeId).defaultSizeId });
  }, [doc.typeId, doc.sizeId, landscapeOnly, setDoc]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <Field label="Nome do projeto">
        <input className="field-input" value={doc.name} onChange={(e) => setDoc({ name: e.target.value })} />
      </Field>
      <Field label="Tamanho">
        <select className="field-input" value={doc.sizeId} onChange={(e) => setDoc({ sizeId: e.target.value })}>
          {availableSizes.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </Field>
      <div className="flex flex-col gap-1">
        <span className="panel-label">Vias</span>
        <div className="flex gap-1">
          {COPIES_OPTIONS.map((o) => <button key={o.value} onClick={() => setDoc({ copies: o.value })} className={cn("h-7 flex-1 rounded-[3px] border text-[11px] font-semibold transition-colors", doc.copies === o.value ? "border-primary bg-primary text-primary-foreground" : "border-input bg-surface hover:bg-secondary")}>{o.label}</button>)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="panel-label">Tipografia</span>
        <FontSelect label="Fonte da marca" value={doc.brandFont || doc.titleFont} onChange={(v) => setDoc({ brandFont: v })} />
        <FontSlider label="Tamanho da marca" value={doc.brandSize ?? 12} min={8} max={24} step={0.5} onChange={(v) => setDoc({ brandSize: v })} />
        <FontSelect label="Fonte dos títulos" value={doc.titleFont} onChange={(v) => setDoc({ titleFont: v })} />
        <FontSlider label="Tamanho dos títulos" value={doc.titleSize ?? 11} min={7} max={24} step={0.5} onChange={(v) => setDoc({ titleSize: v })} />
        <FontSelect label="Fonte do corpo" value={doc.bodyFont} onChange={(v) => setDoc({ bodyFont: v })} />
        <FontSlider label="Tamanho do corpo" value={doc.bodySize ?? 8} min={5} max={14} step={0.5} onChange={(v) => setDoc({ bodySize: v })} />
        <FontSlider label="Tamanho da tabela" value={doc.table.fontSize} min={5} max={14} step={0.5} onChange={(v) => setDoc({ table: { ...doc.table, fontSize: v } })} />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="panel-label">Acabamentos</span>
        <Check label="Serrilha" checked={doc.serrilha} disabled={rules.serrilha !== "optional"} hint={rules.serrilha === "required" ? "obrigatório" : undefined} onChange={(v) => rules.serrilha === "optional" && setDoc({ serrilha: v })} />
        <Check label="Grampo" checked={doc.grampo} disabled={rules.grampo !== "optional"} hint={rules.grampo === "required" ? "obrigatório" : undefined} onChange={(v) => rules.grampo === "optional" && setDoc({ grampo: v })} />
        <Check label="Cantos arredondados" checked={doc.roundedCorners} hint="externos" onChange={(v) => setDoc({ roundedCorners: v })} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="panel-label">Canhoto</span>
        {rules.canhoto === "required" ? <>
          <Check label="Canhoto" checked disabled hint="obrigatório" />
          <Field label={`Altura do canhoto — ${Math.round(doc.stubRatio * 100)}%`}>
            <input type="range" min={0.15} max={0.5} step={0.01} value={doc.stubRatio} onChange={(e) => setDoc({ stubRatio: parseFloat(e.target.value) })} className="accent-[var(--color-primary)]" />
          </Field>
        </> : <p className="text-[11px] text-muted-foreground">Não aplicável a este tipo de bloco.</p>}
      </div>
    </div>
  );
}
