import { useState } from "react";
import { useStudio } from "@/hooks/useStudio";
import { Btn } from "@/components/ui-kit/Field";
import { generatePdf } from "@/pdf/generatePdf";
import { getSize } from "@/data/blockSizes";
import { getType } from "@/data/blockTypes";

export function BlockSummary() {
  const { doc, company } = useStudio();
  const size = getSize(doc.sizeId);
  const type = getType(doc.typeId);
  const acab = [doc.serrilha && "Serrilha", doc.grampo && "Grampo", doc.canhoto && "Canhoto"]
    .filter(Boolean)
    .join(" • ");

  const rows: Array<[string, string]> = [
    ["Tipo", type.label],
    ["Tamanho", size.label],
    ["Vias", `${doc.copies} via(s)`],
    ["Acabamentos", acab || "Nenhum"],
    ["Empresa", company.tradeName || company.name || "—"],
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 p-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="panel-label">{k}</dt>
          <dd className="text-xs font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PdfExport() {
  const { company, doc, production, saveCurrent } = useStudio();
  const [busy, setBusy] = useState(false);

  const build = async () => {
    setBusy(true);
    try {
      return await generatePdf(company, doc, production);
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    const blob = await build();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.replace(/[^\w\-. ]+/g, "") || "bloco"}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const view = async () => {
    const blob = await build();
    window.open(URL.createObjectURL(blob), "_blank", "noopener");
  };

  const print = async () => {
    const blob = await build();
    const url = URL.createObjectURL(blob);
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.src = url;
    document.body.appendChild(frame);
    frame.onload = () => frame.contentWindow?.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Btn variant="primary" onClick={download} disabled={busy}>
        {busy ? "Gerando…" : "Gerar PDF"}
      </Btn>
      <Btn onClick={view} disabled={busy}>
        Visualizar PDF
      </Btn>
      <Btn onClick={print} disabled={busy}>
        Imprimir
      </Btn>
      <Btn onClick={saveCurrent}>Salvar</Btn>
    </div>
  );
}
