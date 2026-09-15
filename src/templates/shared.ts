import { fullAddress } from "@/types/company";
import type { DocElement, LayoutContext } from "@/types/template";
export const MM_PER_PT = 25.4 / 72;
export const PT_PER_MM = 72 / 25.4;
export const ptToMm = (pt: number) => pt * MM_PER_PT;
export const mmToPt = (mm: number) => mm * PT_PER_MM;
export function buildHeader(ctx: LayoutContext, opts: { title?: string; subtitle?: string; compact?: boolean } = {}): { els: DocElement[]; y: number } {
  const { company, m, contentW } = ctx; const els: DocElement[] = []; let y = m; const compact = opts.compact ?? false;
  const logoH = (compact ? 10 : 14) * (company.logoScale || 1); let textX = m; let textW = contentW;
  if (ctx.logoBox) { const h = logoH; const w = Math.min((ctx.logoBox.w / ctx.logoBox.h) * h, contentW * 0.45); els.push({ kind: "image", x: m + company.logoOffsetX, y: y + company.logoOffsetY, w, h, src: company.logo as string }); textX = m + w + 4; textW = contentW - w - 4; }
  const nameSize = compact ? 10 : 12;
  els.push({ kind: "text", x: textX, y, size: nameSize, bold: true, text: company.tradeName || company.name || "NOME DA EMPRESA", align: "left", width: textW, fontFamily: ctx.doc.titleFont });
  y += ptToMm(nameSize) + 1;
  const sub = opts.subtitle || company.name;
  if (sub && sub !== (company.tradeName || company.name)) { els.push({ kind: "text", x: textX, y, size: compact ? 6.5 : 7.5, text: sub, gray: 0.35 }); y += ptToMm(compact ? 6.5 : 7.5) + 0.6; }
  const contact = [company.phone, company.whatsapp].filter(Boolean).join("  •  "); const addr = fullAddress(company);
  if (addr) { els.push({ kind: "text", x: textX, y, size: 6.5, text: addr, gray: 0.3 }); y += ptToMm(6.5) + 0.6; }
  if (contact) { els.push({ kind: "text", x: textX, y, size: 6.5, text: contact, gray: 0.3 }); y += ptToMm(6.5) + 0.6; }
  y = Math.max(y, m + (ctx.logoBox ? logoH : 0)) + 2; els.push({ kind: "line", x1: m, y1: y, x2: m + contentW, y2: y, lineWidth: 0.6 }); y += 3;
  if (opts.title) { const titleSize = compact ? 9 : 11; els.push({ kind: "text", x: m, y, size: titleSize, bold: true, align: "center", width: contentW, text: opts.title, fontFamily: ctx.doc.titleFont }); y += ptToMm(titleSize) + 2.5; }
  return { els, y };
}
export function buildFooter(ctx: LayoutContext, bottomY: number): DocElement[] { const { company, doc, m, contentW } = ctx; const f = doc.footer; const parts: string[] = []; if (f.showName) parts.push(company.tradeName || company.name); if (f.showAddress) parts.push(fullAddress(company)); if (f.showPhone && company.phone) parts.push(`Tel: ${company.phone}`); if (f.showWhatsapp && company.whatsapp) parts.push(`WhatsApp: ${company.whatsapp}`); if (f.showEmail && company.email) parts.push(company.email); if (f.showWebsite && company.website) parts.push(company.website); if (f.showInstagram && company.instagram) parts.push(company.instagram); if (f.showFacebook && company.facebook) parts.push(company.facebook); if (f.showNotes && company.notes) parts.push(company.notes); const line = parts.filter(Boolean).join("  •  "); const els: DocElement[] = []; let y = bottomY; const msg = f.message || company.footerText; if (msg) y -= ptToMm(f.fontSize + 1) + 1; if (line) y -= ptToMm(f.fontSize) + 1; els.push({ kind: "line", x1: m, y1: y - 2, x2: m + contentW, y2: y - 2, lineWidth: 0.3, gray: 0.6 }); if (line) { els.push({ kind: "text", x: m, y, size: f.fontSize, align: "center", width: contentW, text: line, gray: 0.25 }); y += ptToMm(f.fontSize) + 1; } if (msg) els.push({ kind: "text", x: m, y, size: f.fontSize + 1, bold: true, align: "center", width: contentW, text: msg }); return els; }
export function footerHeight(ctx: LayoutContext): number { const f = ctx.doc.footer; return ptToMm(f.fontSize) + ptToMm(f.fontSize + 1) + 6; }
export function labeledLine(x: number, y: number, w: number, label: string, size = 8): DocElement[] { return [{ kind: "text", x, y, size, text: label, bold: true }, { kind: "line", x1: x + label.length * size * 0.16 + 2, y1: y + ptToMm(size) + 0.3, x2: x + w, y2: y + ptToMm(size) + 0.3, lineWidth: 0.3, gray: 0.4 }]; }
