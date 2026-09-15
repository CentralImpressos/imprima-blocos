import { fullAddress } from "@/types/company";
import { ICON_VIEWBOX, ICON_GLYPHS, ICON_PATHS } from "@/data/fonts";
import type { DocElement, LayoutContext } from "@/types/template";
export const MM_PER_PT = 25.4 / 72;
export const PT_PER_MM = 72 / 25.4;
export const ptToMm = (pt: number) => pt * MM_PER_PT;
export const mmToPt = (mm: number) => mm * PT_PER_MM;
const iconAdvance = (size: number, icon: keyof typeof ICON_GLYPHS) => ptToMm(size) * (ICON_VIEWBOX[icon][0] / ICON_VIEWBOX[icon][1]);
const textAdvance = (text: string, size: number) => text.length * size * 0.19;

function footerItems(ctx: LayoutContext): { icon?: keyof typeof ICON_GLYPHS; text: string }[] {
  const { company } = ctx; const f = ctx.doc.footer; const items: { icon?: keyof typeof ICON_GLYPHS; text: string }[] = [];
  if (f.showName && (company.tradeName || company.name)) items.push({ text: company.tradeName || company.name });
  if (f.showAddress && fullAddress(company)) items.push({ icon: "location", text: fullAddress(company) });
  if (f.showPhone && company.phone) items.push({ icon: "phone", text: company.phone });
  if (f.showWhatsapp && company.whatsapp) items.push({ icon: "whatsapp", text: company.whatsapp });
  if (f.showEmail && company.email) items.push({ icon: "envelope", text: company.email });
  if (f.showWebsite && company.website) items.push({ icon: "globe", text: company.website });
  if (f.showInstagram && company.instagram) items.push({ icon: "instagram", text: company.instagram });
  if (f.showFacebook && company.facebook) items.push({ icon: "facebook", text: company.facebook });
  if (f.showNotes && company.notes) items.push({ text: company.notes });
  return items;
}

function footerFontSize(ctx: LayoutContext): number {
  const f = ctx.doc.footer; const items = footerItems(ctx); if (!items.length) return f.fontSize;
  const sep = 3; const totalW = items.reduce((sum, item) => sum + textAdvance(item.text, f.fontSize) + (item.icon ? iconAdvance(f.fontSize, item.icon) + 1.2 : 0), 0) + sep * Math.max(0, items.length - 1);
  return Math.max(4.2, Math.min(f.fontSize, f.fontSize * (ctx.contentW / Math.max(ctx.contentW, totalW))));
}

export function buildHeader(ctx: LayoutContext, opts: { title?: string; subtitle?: string; compact?: boolean } = {}): { els: DocElement[]; y: number } {
  const { company, doc, m, contentW } = ctx; const els: DocElement[] = []; let y = m + ctx.topOffsetMm; const compact = opts.compact ?? false; const logoH = (compact ? 10 : 14) * (company.logoScale || 1); let textX = m; let textW = contentW;
  if (ctx.logoBox) { const h = logoH; const w = Math.min((ctx.logoBox.w / ctx.logoBox.h) * h, contentW * 0.45); els.push({ kind: "image", x: m + company.logoOffsetX, y: y + company.logoOffsetY, w, h, src: company.logo as string }); textX = m + w + 4; textW = contentW - w - 4; }
  const brandSize = doc.brandSize ?? 12; els.push({ kind: "text", x: textX, y, size: brandSize, bold: true, text: company.tradeName || company.name || "NOME DA EMPRESA", align: "left", width: textW, fontFamily: doc.brandFont || doc.titleFont }); y += ptToMm(brandSize) + 1;
  const sub = opts.subtitle || company.name; if (sub && sub !== (company.tradeName || company.name)) { const subSize = compact ? 6.5 : 7.5; els.push({ kind: "text", x: textX, y, size: subSize, text: sub, gray: 0.35, fontFamily: doc.bodyFont }); y += ptToMm(subSize) + 0.6; }
  const addr = fullAddress(company); if (addr) { addIconText(els, textX, y, 6.5, "location", addr, doc.bodyFont); y += ptToMm(6.5) + 0.6; }
  let contactX = textX; if (company.phone) contactX = addIconText(els, contactX, y, 6.5, "phone", company.phone, doc.bodyFont); if (company.whatsapp) contactX = addIconText(els, contactX, y, 6.5, "whatsapp", company.whatsapp, doc.bodyFont); if (contactX > textX) y += ptToMm(6.5) + 0.6;
  y = Math.max(y, m + ctx.topOffsetMm + (ctx.logoBox ? logoH : 0)) + 2; els.push({ kind: "line", x1: m, y1: y, x2: m + contentW, y2: y, lineWidth: 0.6 }); y += 3;
  if (opts.title) { const titleSize = doc.titleSize ?? (compact ? 9 : 11); els.push({ kind: "text", x: m, y, size: titleSize, bold: true, align: "center", width: contentW, text: opts.title, fontFamily: doc.titleFont }); y += ptToMm(titleSize) + 2.5; }
  return { els, y };
}

export function buildFooter(ctx: LayoutContext, bottomY: number): DocElement[] {
  const { company, doc, m, contentW } = ctx; const f = doc.footer; const items = footerItems(ctx); const size = footerFontSize(ctx); const els: DocElement[] = []; let y = bottomY - 2; const msg = f.message || company.footerText; if (msg) y -= ptToMm(size + 1) + 1; if (items.length) y -= ptToMm(size) + 1; els.push({ kind: "line", x1: m, y1: y - 2, x2: m + contentW, y2: y - 2, lineWidth: 0.3, gray: 0.6 });
  if (items.length) { const sep = 3; const widths = items.map((item) => textAdvance(item.text, size) + (item.icon ? iconAdvance(size, item.icon) + 1.2 : 0)); const totalW = widths.reduce((a, b) => a + b, 0) + sep * Math.max(0, items.length - 1); let x = m + Math.max(0, (contentW - totalW) / 2); items.forEach((item, index) => { if (item.icon) { els.push({ kind: "icon", x, y, size, icon: item.icon, gray: 0.25 }); x += iconAdvance(size, item.icon) + 1.2; } els.push({ kind: "text", x, y, size, text: item.text, gray: 0.25, fontFamily: doc.bodyFont }); x += textAdvance(item.text, size); if (index < items.length - 1) { els.push({ kind: "text", x, y, size, text: "•", gray: 0.35, fontFamily: doc.bodyFont }); x += sep; } }); y += ptToMm(size) + 1; }
  if (msg) els.push({ kind: "text", x: m, y, size: size + 1, bold: true, align: "center", width: contentW, text: msg, fontFamily: doc.bodyFont }); return els;
}

export function footerHeight(ctx: LayoutContext): number { const size = footerFontSize(ctx); return ptToMm(size) + ptToMm(size + 1) + 8; }
export function labeledLine(x: number, y: number, w: number, label: string, size = 8): DocElement[] { return [{ kind: "text", x, y, size, text: label, bold: true }, { kind: "line", x1: x + label.length * size * 0.16 + 2, y1: y + ptToMm(size) + 0.3, x2: x + w, y2: y + ptToMm(size) + 0.3, lineWidth: 0.3, gray: 0.4 }]; }

function addIconText(els: DocElement[], x: number, y: number, size: number, icon: keyof typeof ICON_GLYPHS, text: string, fontFamily: string, gray = 0.3) { if (!text) return x; els.push({ kind: "icon", x, y, size, icon, gray }); const nextX = x + iconAdvance(size, icon) + 1.2; els.push({ kind: "text", x: nextX, y, size, text, gray, fontFamily }); return nextX + textAdvance(text, size) + 2; }

export { ICON_PATHS };
