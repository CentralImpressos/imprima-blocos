import { useStudio } from "@/hooks/useStudio";
import { Check, NumberField, TextField } from "@/components/ui-kit/Field";

const ITEMS = [
  ["showName", "Nome"],
  ["showAddress", "Endereço"],
  ["showPhone", "Telefone"],
  ["showWhatsapp", "WhatsApp"],
  ["showEmail", "E-mail"],
  ["showWebsite", "Site"],
  ["showInstagram", "Instagram"],
  ["showFacebook", "Facebook"],
  ["showNotes", "Observação"],
] as const;

export function FooterEditor() {
  const { doc, setDoc } = useStudio();
  const f = doc.footer;
  const set = (patch: Partial<typeof f>) => setDoc({ footer: { ...f, ...patch } });

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="grid grid-cols-2 gap-x-3">
        {ITEMS.map(([key, label]) => (
          <Check key={key} label={label} checked={f[key]} onChange={(v) => set({ [key]: v })} />
        ))}
      </div>
      <TextField
        label="Mensagem personalizada"
        value={f.message}
        onChange={(v) => set({ message: v })}
        placeholder="Obrigado pela preferência!"
      />
      <NumberField
        label="Fonte do rodapé"
        suffix="pt"
        value={f.fontSize}
        step={0.5}
        min={4}
        onChange={(v) => set({ fontSize: v || 6 })}
      />
    </div>
  );
}
