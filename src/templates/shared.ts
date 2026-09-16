import { fullAddress } from "@/types/company";
import { ICON_VIEWBOX, ICON_GLYPHS, ICON_PATHS } from "@/data/fonts";
import type { DocElement, LayoutContext } from "@/types/template";
export const MM_PER_PT = 25.4 / 72;
export const PT_PER_MM = 72 / 25.4;
export const ptToMm = (pt: number) => pt * MM_PER_PT;
export const mmToPt = (mm: number) => mm * PT_PER_MM;
const iconAdvance = (size: number, icon: keyof typeof ICON_GLYPHS) => ptToMm(size) * (ICON_VIEWBOX[icon][0] / ICON_VIEWBOX[icon][1]);
const textAdvance = (text: string, size: number) => text.length * size * 0.19;
const fitTextSize = (text: string, desired: number, maxWidth: number, icon?: keyof typeof ICON_GLYPHS) => {
  const iconW = icon ? iconAdvance(desired, icon) + 1.2 : 0;
  const estimated = textAdvance(text, desired) + iconW;
  return estimated > maxWidth && estimated > 0 ? Math.max(4.2, desired * maxWidth / estimated) : desired;
};

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
  const longest = Math.max(...items.map((item) => textAdvance(item.text, f.fontSize) + (item.icon ? iconAdvance(f.fontSize, item.icon) + 1.2 : 0)));
  return Math.max(4.2, Math.min(f.fontSize, f.fontSize * ctx.contentW / Math.max(ctx.contentW, longest)));
}

function footerRows(ctx: LayoutContext, size: number): { item: { icon?: keyof typeof ICON_GLYPHS; text: string }; width: number }[][] {
  const items = footerItems(ctx); const sep = 4; const rows: { item: { icon?: keyof typeof ICON_GLYPHS; text: string }; width: number }[][] = [];
  let row: { item: { icon?: keyof typeof ICON_GLYPHS; text: string }; width: number }[] = []; let rowW = 0;
  for (const item of items) {
    const width = textAdvance(item.text, size) + (item.icon ? iconAdvance(size, item.icon) + 1.2 : 0);
    const nextW = row.length ? rowW + sep + width : width;
    if (row.length && nextW > ctx.contentW) { rows.push(row); row = []; rowW = 0; }
    row.push({ item, width }); rowW = row.length === 1 ? width : rowW + sep + width;
  }
  if (row.length) rows.push(row);
  return rows;
}

export function buildHeader(ctx: LayoutContext, opts: { title?: string; subtitle?: string; compact?: boolean } = {}): { els: DocElement[]; y: number } {
  const { company, doc, m, contentW } = ctx; const els: DocElement[] = []; let y = m + ctx.topOffsetMm; const compact = opts.compact ?? false; const logoH = (compact ? 10 : 14) * (company.logoScale || 1); let textX = m; let textW = contentW;
  if (ctx.logoBox) { const h = logoH; const w = Math.min((ctx.logoBox.w / ctx.logoBox.h) * h, contentW * 0.45); els.push({ kind: "image", x: m + company.logoOffsetX, y: y + company.logoOffsetY, w, h, src: company.logo as string }); textX = m + w + 4; textW = Math.max(8, contentW - w - 4); }
  const brandDesired = doc.brandSize ?? 12; const brandSize = fitTextSize(company.tradeName || company.name || "NOME DA EMPRESA", brandDesired, textW); els.push({ kind: "text", x: textX, y, size: brandSize, bold: true, text: company.tradeName || company.name || "NOME DA EMPRESA", align: "left", width: textW, fontFamily: doc.brandFont || doc.titleFont }); y += ptToMm(brandSize) + 1;
  const sub = opts.subtitle || company.name; if (sub && sub !== (company.tradeName || company.name)) { const subDesired = compact ? 6.5 : 7.5; const subSize = fitTextSize(sub, subDesired, textW); els.push({ kind: "text", x: textX, y, size: subSize, text: sub, gray: 0.35, fontFamily: doc.bodyFont }); y += ptToMm(subSize) + 0.6; }
  const addr = fullAddress(company); if (addr) { const addrSize = fitTextSize(addr, 6.5, textW, "location"); addIconText(els, textX, y, addrSize, "location", addr, doc.bodyFont); y += ptToMm(addrSize) + 0.6; }
  const phone = company.phone; const whatsapp = company.whatsapp; const contactDesired = 6.5; const contactTotal = (phone ? textAdvance(phone, contactDesired) + iconAdvance(contactDesired, "phone") + 1.2 : 0) + (phone && whatsapp ? 2 : 0) + (whatsapp ? textAdvance(whatsapp, contactDesired) + iconAdvance(contactDesired, "whatsapp") + 1.2 : 0); const contactSize = contactTotal > textW ? Math.max(4.2, contactDesired * textW / contactTotal) : contactDesired;
  let contactX = textX; if (phone) contactX = addIconText(els, contactX, y, contactSize, "phone", phone, doc.bodyFont); if (whatsapp) contactX = addIconText(els, contactX, y, contactSize, "whatsapp", whatsapp, doc.bodyFont); if (contactX > textX) y += ptToMm(contactSize) + 0.6;
  y = Math.max(y, m + ctx.topOffsetMm + (ctx.logoBox ? logoH : 0)) + 2; els.push({ kind: "line", x1: m, y1: y, x2: m + contentW, y2: y, lineWidth: 0.6 }); y += 3;
  if (opts.title) { const titleSize = fitTextSize(opts.title, doc.titleSize ?? (compact ? 9 : 11), contentW); els.push({ kind: "text", x: m, y, size: titleSize, bold: true, align: "center", width: contentW, text: opts.title, fontFamily: doc.titleFont }); y += ptToMm(titleSize) + 2.5; }
  return { els, y };
}

export function buildFooter(ctx: LayoutContext, bottomY: number): DocElement[] {
  const { company, doc, m, contentW } = ctx; const f = doc.footer; const items = footerItems(ctx); const size = footerFontSize(ctx); const rows = footerRows(ctx, size); const msg = f.message || company.footerText; const msgSize = msg ? fitTextSize(msg, size + 1, contentW) : size + 1; const els: DocElement[] = []; let y = bottomY - 2;
  if (msg) y -= ptToMm(msgSize) + 1;
  if (rows.length) y -= rows.length * (ptToMm(size) + 1);
  els.push({ kind: "line", x1: m, y1: y - 2, x2: m + contentW, y2: y - 2, lineWidth: 0.3, gray: 0.6 });
  rows.forEach((row) => { const rowW = row.reduce((sum, entry) => sum + entry.width, 0) + 4 * Math.max(0, row.length - 1); let x = m + Math.max(0, (contentW - rowW) / 2); row.forEach((entry) => { const item = entry.item; if (item.icon) { els.push({ kind: "icon", x, y, size, icon: item.icon, gray: 0.25 }); x += iconAdvance(size, item.icon) + 1.2; } els.push({ kind: "text", x, y, size, text: item.text, gray: 0.25, fontFamily: doc.bodyFont }); x += textAdvance(item.text, size) + 4; }); y += ptToMm(size) + 1; });
  if (msg) els.push({ kind: "text", x: m, y, size: msgSize, bold: true, align: "center", width: contentW, text: msg, fontFamily: doc.bodyFont }); return els;
}

export function footerHeight(ctx: LayoutContext): number { const size = footerFontSize(ctx); const rows = footerRows(ctx, size).length; const msg = ctx.doc.footer.message || ctx.company.footerText; const msgSize = msg ? fitTextSize(msg, size + 1, ctx.contentW) : size + 1; return rows * (ptToMm(size) + 1) + (msg ? ptToMm(msgSize) + 1 : 0) + 4; }
export function labeledLine(x: number, y: number, w: number, label: string, size = 8): DocElement[] { return [{ kind: "text", x, y, size, text: label, bold: true }, { kind: "line", x1: x + label.length * size * 0.16 + 2, y1: y + ptToMm(size) + 0.3, x2: x + w, y2: y + ptToMm(size) + 0.3, lineWidth: 0.3, gray: 0.4 }]; }

function addIconText(els: DocElement[], x: number, y: number, size: number, icon: keyof typeof ICON_GLYPHS, text: string, fontFamily: string, gray = 0.3) { if (!text) return x; els.push({ kind: "icon", x, y, size, icon, gray }); const nextX = x + iconAdvance(size, icon) + 1.2; els.push({ kind: "text", x: nextX, y, size, text, gray, fontFamily }); return nextX + textAdvance(text, size) + 2; }

export { ICON_PATHS };
