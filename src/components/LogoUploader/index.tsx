import { useRef } from "react";
import { useStudio } from "@/hooks/useStudio";
import { Btn, Field } from "@/components/ui-kit/Field";

/** Converte SVG para PNG (pdf-lib só incorpora PNG/JPG) */
async function toEmbeddable(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  if (!file.type.includes("svg")) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = 600 / Math.max(img.width || 600, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round((img.width || 600) * scale);
      canvas.height = Math.round((img.height || 200) * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function LogoUploader() {
  const { company, setCompany } = useStudio();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <span className="panel-label">Logo</span>
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center border border-dashed border-border-strong bg-surface">
          {company.logo ? (
            <img src={company.logo} alt="Logo da empresa" className="max-h-[72px] max-w-[104px] object-contain" />
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sem logo</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex gap-1.5">
            <Btn size="sm" onClick={() => inputRef.current?.click()}>
              {company.logo ? "Substituir" : "Enviar"}
            </Btn>
            {company.logo && (
              <Btn size="sm" variant="danger" onClick={() => setCompany({ logo: null })}>
                Remover
              </Btn>
            )}
          </div>
          <Field label={`Tamanho ${Math.round(company.logoScale * 100)}%`}>
            <input
              type="range"
              min={0.3}
              max={2}
              step={0.05}
              value={company.logoScale}
              onChange={(e) => setCompany({ logoScale: parseFloat(e.target.value) })}
              className="accent-[var(--color-primary)]"
            />
          </Field>
          <div className="grid grid-cols-2 gap-1.5">
            <Field label="X (mm)">
              <input
                type="number"
                className="field-input"
                value={company.logoOffsetX}
                step={0.5}
                onChange={(e) => setCompany({ logoOffsetX: parseFloat(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Y (mm)">
              <input
                type="number"
                className="field-input"
                value={company.logoOffsetY}
                step={0.5}
                onChange={(e) => setCompany({ logoOffsetY: parseFloat(e.target.value) || 0 })}
              />
            </Field>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setCompany({ logo: await toEmbeddable(f) });
          e.target.value = "";
        }}
      />
      <p className="text-[10px] text-muted-foreground">
        PNG, JPG ou SVG. A proporção é sempre preservada.
      </p>
    </div>
  );
}
