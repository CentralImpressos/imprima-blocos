import { useStudio } from "@/hooks/useStudio";
import { Check, NumberField } from "@/components/ui-kit/Field";

export function ProductionSettingsPanel() {
  const { production, setProduction } = useStudio();

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Sangria"
          suffix="mm"
          value={production.bleedMm}
          step={0.5}
          min={0}
          onChange={(v) => setProduction({ bleedMm: isNaN(v) ? 0 : v })}
        />
        <NumberField
          label="Margem segura"
          suffix="mm"
          value={production.safeMm}
          step={0.5}
          min={0}
          onChange={(v) => setProduction({ safeMm: isNaN(v) ? 0 : v })}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <Check
          label="Mostrar sangria"
          checked={production.showBleed}
          onChange={(v) => setProduction({ showBleed: v })}
        />
        <Check
          label="Mostrar área segura"
          checked={production.showSafe}
          onChange={(v) => setProduction({ showSafe: v })}
        />
        <Check
          label="Mostrar marcas de corte"
          checked={production.showCrop}
          onChange={(v) => setProduction({ showCrop: v })}
        />
        <Check
          label="Mostrar indicação de serrilha"
          checked={production.showSerrilha}
          onChange={(v) => setProduction({ showSerrilha: v })}
        />
        <Check
          label="Mostrar indicação de grampo"
          checked={production.showGrampo}
          onChange={(v) => setProduction({ showGrampo: v })}
        />
      </div>
      <NumberField
        label="Cópias do bloco por geração"
        value={production.quantity}
        step={1}
        min={1}
        onChange={(v) => setProduction({ quantity: Math.max(1, Math.round(v) || 1) })}
      />
      <p className="text-[10px] text-muted-foreground">
        A sangria é incorporada ao tamanho final do PDF quando habilitada.
      </p>
    </div>
  );
}
