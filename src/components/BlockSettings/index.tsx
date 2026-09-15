import { useEffect } from "react";
import { BLOCK_SIZES, getSize } from "@/data/blockSizes";
import { getType } from "@/data/blockTypes";
import { COPIES_OPTIONS } from "@/data/finishingOptions";
import { useStudio } from "@/hooks/useStudio";
import { Check, Field } from "@/components/ui-kit/Field";
import { cn } from "@/lib/utils";

export function BlockSettings() {
  const { doc, setDoc } = useStudio();
  const rules = getType(doc.typeId).rules;
  const landscapeOnly = rules.canhoto === "required";
  const availableSizes = landscapeOnly
    ? BLOCK_SIZES.filter((s) => s.widthMm > s.heightMm)
    : BLOCK_SIZES;

  // Recibo, rifa e carnê são exclusivamente paisagem. Isso também corrige
  // documentos antigos salvos com uma medida retrato.
  useEffect(() => {
    if (landscapeOnly && getSize(doc.sizeId).widthMm <= getSize(doc.sizeId).heightMm) {
      setDoc({ sizeId: getType(doc.typeId).defaultSizeId });
    }
  }, [doc.typeId, doc.sizeId, landscapeOnly, setDoc]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <Field label="Nome do projeto">
        <input
          className="field-input"
          value={doc.name}
          onChange={(e) => setDoc({ name: e.target.value })}
        />
      </Field>

      <Field label="Tamanho">
        <select
          className="field-input"
          value={doc.sizeId}
          onChange={(e) => setDoc({ sizeId: e.target.value })}
        >
          {availableSizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-1">
        <span className="panel-label">Vias</span>
        <div className="flex gap-1">
          {COPIES_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setDoc({ copies: o.value })}
              className={cn(
                "h-7 flex-1 rounded-[3px] border text-[11px] font-semibold transition-colors",
                doc.copies === o.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-surface hover:bg-secondary",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="panel-label">Acabamentos</span>
        <Check
          label="Serrilha"
          checked={doc.serrilha}
          disabled={rules.serrilha !== "optional"}
          hint={rules.serrilha === "required" ? "obrigatório" : undefined}
          onChange={(v) => rules.serrilha === "optional" && setDoc({ serrilha: v })}
        />
        <Check
          label="Grampo"
          checked={doc.grampo}
          disabled={rules.grampo !== "optional"}
          hint={rules.grampo === "required" ? "obrigatório" : undefined}
          onChange={(v) => rules.grampo === "optional" && setDoc({ grampo: v })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="panel-label">Canhoto</span>
        {rules.canhoto === "required" ? (
          <>
            <Check label="Canhoto" checked disabled hint="obrigatório" />
            <Field label={`Altura do canhoto — ${Math.round(doc.stubRatio * 100)}%`}>
              <input
                type="range"
                min={0.15}
                max={0.5}
                step={0.01}
                value={doc.stubRatio}
                onChange={(e) => setDoc({ stubRatio: parseFloat(e.target.value) })}
                className="accent-[var(--color-primary)]"
              />
            </Field>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground">Não aplicável a este tipo de bloco.</p>
        )}
      </div>
    </div>
  );
}
