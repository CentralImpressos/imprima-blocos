import { useStudio } from "@/hooks/useStudio";
import { TextField } from "@/components/ui-kit/Field";
import type { BlockTypeId } from "@/types/block";

const FIELDS: Record<BlockTypeId, Array<[string, string]>> = {
  comanda: [
    ["mesa", "Rótulo do campo 1"],
    ["atendente", "Rótulo do campo 2"],
    ["totalLabel", "Rótulo do total"],
  ],
  pedido: [
    ["mesa", "Rótulo do campo 1"],
    ["atendente", "Rótulo do campo 2"],
    ["totalLabel", "Rótulo do total"],
    ["obsLinhas", "Linhas de observação"],
  ],
  recibo: [
    ["numero", "Número"],
    ["valor", "Valor (R$)"],
    ["referente", "Referente a"],
  ],
  rifa: [
    ["numero", "Número da rifa"],
    ["premio", "Prêmio"],
    ["sorteio", "Data do sorteio"],
    ["valorCota", "Valor da cota (R$)"],
    ["promocao", "Dados da promoção"],
  ],
  carne: [
    ["numero", "Número do carnê"],
    ["cliente", "Cliente"],
    ["parcela", "Parcela"],
    ["vencimento", "Vencimento"],
    ["valor", "Valor (R$)"],
  ],
};

export function DocumentEditor() {
  const { doc, setDoc } = useStudio();
  const fields = FIELDS[doc.typeId];

  return (
    <div className="flex flex-col gap-2 p-3">
      <TextField label="Título do documento" value={doc.title} onChange={(v) => setDoc({ title: v })} />
      <TextField
        label="Subtítulo"
        value={doc.subtitle}
        onChange={(v) => setDoc({ subtitle: v })}
        placeholder="Ex.: Controle interno"
      />
      {fields.map(([key, label]) => (
        <TextField
          key={key}
          label={label}
          value={doc.fields[key] ?? ""}
          onChange={(v) => setDoc({ fields: { ...doc.fields, [key]: v } })}
        />
      ))}
      {doc.typeId === "rifa" && (
        <p className="text-[10px] text-muted-foreground">
          A numeração sequencial automática será adicionada em versão futura.
        </p>
      )}
    </div>
  );
}
