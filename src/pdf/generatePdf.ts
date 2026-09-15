import { PDFDocument, StandardFonts } from "pdf-lib";
import type { BlockDoc } from "@/types/block";
import type { Company } from "@/types/company";
import type { ProductionSettings } from "@/types/production";
import { buildDocument } from "@/templates";
import { drawElements } from "./renderElements";
import { mmToPt } from "@/templates/shared";
import { VIA_LABELS } from "@/data/finishingOptions";

export async function imageAspect(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1);
    img.onerror = () => resolve(1);
    img.src = dataUrl;
  });
}

export async function generatePdf(
  company: Company,
  doc: BlockDoc,
  prod: ProductionSettings,
): Promise<Blob> {
  const aspect = company.logo ? await imageAspect(company.logo) : null;
  const built = buildDocument(company, doc, prod, aspect);

  const pdf = await PDFDocument.create();
  pdf.setTitle(doc.name);
  pdf.setProducer("Imprima Cooper — Gerador de Blocos");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logo = null;
  if (company.logo) {
    try {
      const bytes = await (await fetch(company.logo)).arrayBuffer();
      logo = company.logo.startsWith("data:image/png")
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);
    } catch {
      logo = null;
    }
  }

  const bleed = prod.showBleed ? prod.bleedMm : 0;
  const pageWMm = built.widthMm + bleed * 2;
  const pageHMm = built.heightMm + bleed * 2;

  const copies = doc.copies;
  const sheets = Math.max(1, prod.quantity);

  for (let s = 0; s < sheets; s++) {
    for (let v = 0; v < copies; v++) {
      const page = pdf.addPage([mmToPt(pageWMm), mmToPt(pageHMm)]);
      const ctx = { page, regular, bold, offsetMm: bleed, pageHMm, logo };
      drawElements(ctx, built.content);
      drawElements(ctx, built.production);
      if (copies > 1) {
        drawElements(ctx, [
          {
            kind: "text",
            x: prod.safeMm,
            y: built.heightMm - prod.safeMm + 0.5,
            size: 5,
            align: "right",
            width: built.widthMm - prod.safeMm * 2,
            text: VIA_LABELS[v] ?? "",
            gray: 0.5,
          },
        ]);
      }
    }
  }

  const bytes = await pdf.save();
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}
