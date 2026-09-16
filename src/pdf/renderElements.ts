import { rgb, type PDFFont, type PDFPage, type PDFImage, degrees } from "pdf-lib";
import type { DocElement, RectCorner } from "@/types/template";
import { ICON_PATHS, ICON_VIEWBOX } from "@/data/fonts";
import { mmToPt } from "@/templates/shared";

export interface DrawCtx {
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  fonts?: Map<string, { regular: PDFFont; bold: PDFFont }>;
  offsetMm: number;
  pageHMm: number;
  logo?: PDFImage | null;
}

const g = (v = 0) => rgb(v, v, v);
function toPt(ctx: DrawCtx, xMm: number, yMm: number) {
  return { x: mmToPt(xMm + ctx.offsetMm), y: mmToPt(ctx.pageHMm - (yMm + ctx.offsetMm)) };
}

function roundedRectSvgPath(w: number, h: number, radius: number, corners: RectCorner[] = ["tl", "tr", "br", "bl"]) {
  const r = Math.min(radius, w / 2, h / 2);
  const k = 0.5522847498;
  // drawSvgPath usa origem no canto inferior esquerdo. Nosso layout usa
  // origem no canto superior esquerdo, então espelhamos apenas os nomes dos
  // cantos para preservar a intenção visual do elemento.
  const tl = corners.includes("bl");
  const tr = corners.includes("br");
  const br = corners.includes("tr");
  const bl = corners.includes("tl");
  const x0 = 0, x1 = w, y0 = 0, y1 = h;
  const parts: string[] = [`M ${tl ? r : x0} ${y1}`];
  parts.push(`L ${tr ? x1 - r : x1} ${y1}`);
  if (tr) parts.push(`C ${x1 - r + k * r} ${y1} ${x1} ${y1 - r + k * r} ${x1} ${y1 - r}`);
  parts.push(`L ${x1} ${br ? y0 + r : y0}`);
  if (br) parts.push(`C ${x1} ${y0 + r - k * r} ${x1 - r + k * r} ${y0} ${x1 - r} ${y0}`);
  parts.push(`L ${bl ? x0 + r : x0} ${y0}`);
  if (bl) parts.push(`C ${x0 + r - k * r} ${y0} ${x0} ${y0 + r - k * r} ${x0} ${y0 + r}`);
  parts.push(`L ${x0} ${y1 - (tl ? r : 0)}`);
  if (tl) parts.push(`C ${x0 + r - k * r} ${y1 - r + k * r} ${x0 + r} ${y1} ${x0 + r} ${y1}`);
  parts.push("Z");
  return parts.join(" ");
}

export function drawElements(ctx: DrawCtx, els: DocElement[]) {
  for (const el of els) {
    if (el.kind === "text") {
      const family = el.fontFamily || "Helvetica";
      const pair = ctx.fonts?.get(family);
      const font = pair ? (el.bold ? pair.bold : pair.regular) : (el.bold ? ctx.bold : ctx.regular);
      const text = el.text ?? "";
      if (!text) continue;
      const widthPt = font.widthOfTextAtSize(text, el.size);
      let xMm = el.x;
      if (el.width && el.align === "center") xMm = el.x + (el.width - widthPt / (72 / 25.4)) / 2;
      if (el.width && el.align === "right") xMm = el.x + el.width - widthPt / (72 / 25.4);
      const baselineMm = el.y + (el.size * 0.78 * 25.4) / 72;
      const p = toPt(ctx, xMm, baselineMm);
      ctx.page.drawText(text, { x: p.x, y: p.y, size: el.size, font, color: g(el.gray ?? 0) });
    } else if (el.kind === "icon") {
      // O preview usa um SVG com viewBox em coordenadas Y-down. O PDF usa
      // coordenadas Y-up, então apenas inverter o path em torno do próprio
      // retângulo do viewBox faz o ícone ocupar exatamente a mesma caixa
      // visual do preview, sem alterar el.x/el.y.
      const [vbW, vbH] = ICON_VIEWBOX[el.icon];
      const scale = el.size / vbH;
      const iconWPt = vbW * scale;
      const iconHpt = vbH * scale;
      const leftPt = mmToPt(el.x + ctx.offsetMm);
      const bottomPt = mmToPt(ctx.pageHMm - (el.y + ctx.offsetMm)) - iconHpt;

      ctx.page.drawSvgPath(ICON_PATHS[el.icon], {
        x: leftPt + iconWPt,
        y: bottomPt + iconHpt,
        scale,
        rotate: degrees(180),
        color: g(el.gray ?? 0),
      });
    } else if (el.kind === "line") {
      const a = toPt(ctx, el.x1, el.y1), b = toPt(ctx, el.x2, el.y2);
      ctx.page.drawLine({ start: a, end: b, thickness: mmToPt(el.lineWidth ?? 0.3), color: g(el.gray ?? 0), ...(el.dash ? { dashArray: el.dash.map(mmToPt) } : {}) });
    } else if (el.kind === "rect") {
      if ((el.radius ?? 0) > 0) {
        const top = ctx.pageHMm - (el.y + ctx.offsetMm);
        ctx.page.drawSvgPath(roundedRectSvgPath(mmToPt(el.w), mmToPt(el.h), mmToPt(el.radius ?? 0), el.corners), {
          x: mmToPt(el.x + ctx.offsetMm), y: mmToPt(top),
          ...(el.stroke != null ? { borderColor: g(el.stroke), borderWidth: mmToPt(el.lineWidth ?? 0.3) } : {}),
          ...(el.fill != null ? { color: g(el.fill) } : {}),
          ...(el.dash ? { borderDashArray: el.dash.map(mmToPt) } : {}),
        });
      } else {
        const p = toPt(ctx, el.x, el.y + el.h);
        ctx.page.drawRectangle({ x: p.x, y: p.y, width: mmToPt(el.w), height: mmToPt(el.h), borderWidth: el.stroke != null ? mmToPt(el.lineWidth ?? 0.3) : 0, ...(el.stroke != null ? { borderColor: g(el.stroke) } : {}), ...(el.fill != null ? { color: g(el.fill) } : {}), ...(el.dash ? { borderDashArray: el.dash.map(mmToPt) } : {}) });
      }
    } else if (el.kind === "image" && ctx.logo) {
      const p = toPt(ctx, el.x, el.y + el.h);
      ctx.page.drawImage(ctx.logo, { x: p.x, y: p.y, width: mmToPt(el.w), height: mmToPt(el.h) });
    }
  }
}
