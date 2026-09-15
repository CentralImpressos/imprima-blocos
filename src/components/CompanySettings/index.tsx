import { useStudio } from "@/hooks/useStudio";
import { Field, TextField } from "@/components/ui-kit/Field";
import { LogoUploader } from "@/components/LogoUploader";
import { GOOGLE_FONTS } from "@/data/fonts";

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <Field label={label}><select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>{GOOGLE_FONTS.map((font) => <option key={font} value={font}>{font}</option>)}</select></Field>; }
function FontSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) { return <Field label={`${label} — ${Number.isInteger(value) ? value : value.toFixed(1)} pt`}><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="accent-[var(--color-primary)]" /></Field>; }

export function CompanySettings() {
  const { company, setCompany, doc, setDoc } = useStudio();
  const brandFont = doc.brandFont || doc.titleFont;
  return (
    <div className="flex flex-col gap-3 p-3">
      <LogoUploader />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Nome" value={company.name} onChange={(v) => setCompany({ name: v })} placeholder="NOME DA EMPRESA" className="col-span-2" />
        <TextField label="Nome fantasia" value={company.tradeName} onChange={(v) => setCompany({ tradeName: v })} placeholder="NOME FANTASIA" className="col-span-2" />
        <TextField label="CNPJ" value={company.cnpj} onChange={(v) => setCompany({ cnpj: v })} />
        <TextField label="CEP" value={company.zip} onChange={(v) => setCompany({ zip: v })} />
        <TextField label="Endereço" value={company.address} onChange={(v) => setCompany({ address: v })} className="col-span-2" />
        <TextField label="Número" value={company.number} onChange={(v) => setCompany({ number: v })} />
        <TextField label="Complemento" value={company.complement} onChange={(v) => setCompany({ complement: v })} />
        <TextField label="Bairro" value={company.district} onChange={(v) => setCompany({ district: v })} />
        <TextField label="Cidade" value={company.city} onChange={(v) => setCompany({ city: v })} />
        <TextField label="Estado" value={company.state} onChange={(v) => setCompany({ state: v })} />
        <TextField label="Telefone" value={company.phone} onChange={(v) => setCompany({ phone: v })} />
        <TextField label="WhatsApp" value={company.whatsapp} onChange={(v) => setCompany({ whatsapp: v })} />
        <TextField label="E-mail" value={company.email} onChange={(v) => setCompany({ email: v })} />
        <TextField label="Site" value={company.website} onChange={(v) => setCompany({ website: v })} />
        <TextField label="Instagram" value={company.instagram} onChange={(v) => setCompany({ instagram: v })} />
        <TextField label="Facebook" value={company.facebook} onChange={(v) => setCompany({ facebook: v })} className="col-span-2" />
        <Field label="Observações" className="col-span-2"><textarea className="field-input min-h-16 py-1.5" value={company.notes} onChange={(e) => setCompany({ notes: e.target.value })} /></Field>
        <TextField label="Texto padrão de rodapé" value={company.footerText} onChange={(v) => setCompany({ footerText: v })} className="col-span-2" />
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <span className="panel-label">Tipografia</span>
        <FontSelect label="Fonte do nome da empresa" value={brandFont} onChange={(v) => setDoc({ brandFont: v })} />
        <FontSlider label="Tamanho do nome da empresa" value={doc.brandSize ?? 12} min={8} max={24} step={0.5} onChange={(v) => setDoc({ brandSize: v })} />
        <FontSelect label="Fonte dos títulos" value={doc.titleFont} onChange={(v) => setDoc({ titleFont: v })} />
        <FontSlider label="Tamanho dos títulos" value={doc.titleSize ?? 11} min={7} max={24} step={0.5} onChange={(v) => setDoc({ titleSize: v })} />
        <FontSlider label="Tamanho dos totais" value={doc.totalSize ?? 11} min={7} max={24} step={0.5} onChange={(v) => setDoc({ totalSize: v })} />
        <FontSelect label="Fonte do corpo" value={doc.bodyFont} onChange={(v) => setDoc({ bodyFont: v })} />
        <FontSlider label="Tamanho do corpo" value={doc.bodySize ?? 8} min={5} max={14} step={0.5} onChange={(v) => setDoc({ bodySize: v })} />
        <FontSlider label="Tamanho da tabela" value={doc.table.fontSize} min={5} max={14} step={0.5} onChange={(v) => setDoc({ table: { ...doc.table, fontSize: v } })} />
      </div>

      <p className="text-[10px] text-muted-foreground">Os dados da empresa são independentes do template e reaproveitados em todos os blocos.</p>
    </div>
  );
}
