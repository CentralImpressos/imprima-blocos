import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { BlockDoc } from "@/types/block";
import type { Company } from "@/types/company";
import type { ProductionSettings } from "@/types/production";
import type { DocElement } from "@/types/template";
import { buildDocument } from "@/templates";
import { drawElements } from "./renderElements";
import { mmToPt } from "@/templates/shared";
import { VIA_LABELS } from "@/data/finishingOptions";
import { GOOGLE_FONTS, ICON_BRANDS_FONT, ICON_SOLID_FONT, loadGoogleFont, loadIconFont, type GoogleFont } from "@/data/fonts";

export async function imageAspect(dataUrl: string): Promise<number> { return new Promise((resolve) => { const img = new Image(); img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1); img.onerror = () => resolve(1); img.src = dataUrl; }); }

async function embedSelectedFonts(pdf: PDFDocument, doc: BlockDoc, regular: any, bold: any) {
  const selected = [...new Set([doc.brandFont || doc.titleFont, doc.titleFont, doc.bodyFont])].filter((font): font is GoogleFont => GOOGLE_FONTS.includes(font as GoogleFont));
  const fonts = new Map<string, { regular: typeof regular; bold: typeof bold }>();
  for (const family of selected) { try { const [regularBytes, boldBytes] = await Promise.all([loadGoogleFont(family, 400), loadGoogleFont(family, 700)]); const familyRegular = await pdf.embedFont(regularBytes); const familyBold = await pdf.embedFont(boldBytes); fonts.set(family, { regular: familyRegular, bold: familyBold }); } catch {} }
  try { const font = await pdf.embedFont(await loadIconFont("solid")); fonts.set(ICON_SOLID_FONT, { regular: font, bold: font }); } catch {}
  try { const font = await pdf.embedFont(await loadIconFont("brands")); fonts.set(ICON_BRANDS_FONT, { regular: font, bold: font }); } catch {}
  return fonts;
}

function drawIconElements(ctx: any, els: DocElement[]) {
  for (const el of els) {
    if (el.kind !== "text" || (el.fontFamily !== ICON_SOLID_FONT && el.fontFamily !== ICON_BRANDS_FONT)) continue;
    const pair = ctx.fonts?.get(el.fontFamily); const font = pair?.regular; if (!font) continue;
    const x = mmToPt(el.x + ctx.offsetMm); const baselineMm = el.y + (el.size * 0.78 * 25.4) / 72; const y = mmToPt(ctx.pageHMm - (baselineMm + ctx.offsetMm));
    ctx.page.drawText(el.text, { x, y, size: el.size, font, color: rgb(el.gray ?? 0, el.gray ?? 0, el.gray ?? 0) });
  }
}

function drawDocumentElements(ctx: any, els: DocElement[]) {
  const icons = els.filter((el) => el.kind === "text" && (el.fontFamily === ICON_SOLID_FONT || el.fontFamily === ICON_BRANDS_FONT));
  drawElements(ctx, els.filter((el) => !icons.includes(el)));
  drawIconElements(ctx, icons);
}

export async function generatePdf(company: Company, doc: BlockDoc, prod: ProductionSettings): Promise<Blob> {
  const aspect = company.logo ? await imageAspect(company.logo) : null; const built = buildDocument(company, doc, prod, aspect); const pdf = await PDFDocument.create(); pdf.registerFontkit(fontkit); pdf.setTitle(doc.name); pdf.setProducer("Imprima Cooper — Gerador de Blocos");
  const regular = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold); const fonts = await embedSelectedFonts(pdf, doc, regular, bold);
  let logo = null; if (company.logo) { try { const bytes = await (await fetch(company.logo)).arrayBuffer(); logo = company.logo.startsWith("data:image/png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes); } catch { logo = null; } }
  const bleed = prod.showBleed ? prod.bleedMm : 0; const pageWMm = built.widthMm + bleed * 2; const pageHMm = built.heightMm + bleed * 2; const copies = doc.copies; const sheets = Math.max(1, prod.quantity);
  for (let s = 0; s < sheets; s++) for (let v = 0; v < copies; v++) { const page = pdf.addPage([mmToPt(pageWMm), mmToPt(pageHMm)]); const ctx = { page, regular, bold, fonts, offsetMm: bleed, pageHMm, logo }; drawDocumentElements(ctx, built.content); drawDocumentElements(ctx, built.production); if (copies > 1) drawDocumentElements(ctx, [{ kind: "text", x: prod.safeMm, y: built.heightMm - prod.safeMm + 0.5, size: 5, align: "right", width: built.widthMm - prod.safeMm * 2, text: VIA_LABELS[v] ?? "", gray: 0.5, fontFamily: doc.bodyFont }]); }
  const bytes = await pdf.save(); return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}
