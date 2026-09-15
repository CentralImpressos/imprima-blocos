import { rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import type { DocElement, RectCorner } from "@/types/template";
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
function toPt(ctx: DrawCtx, xMm: number, yMm: number) { return { x: mmToPt(xMm + ctx.offsetMm), y: mmToPt(ctx.pageHMm - (yMm + ctx.offsetMm)) }; }

function roundedRectSvgPath(w: number, h: number, radius: number, corners: RectCorner[] = ["tl", "tr", "br", "bl"]) {
  const r = Math.min(radius, w / 2, h / 2);
  const tl = corners.includes("tl"), tr = corners.includes("tr"), br = corners.includes("br"), bl = corners.includes("bl");
  return [`M ${tl ? r : 0} ${h}`, `L ${w - (tr ? r : 0)} ${h}`, tr ? `A ${r} ${r} 0 0 1 ${w} ${h - r}` : `L ${w} ${h}`, `L ${w} ${br ? r : 0}`, br ? `A ${r} ${r} 0 0 1 ${w - r} 0` : `L ${w} 0`, `L ${bl ? r : 0} 0`, bl ? `A ${r} ${r} 0 0 1 0 ${r}` : `L 0 0`, `L 0 ${h - (tl ? r : 0)}`, tl ? `A ${r} ${r} 0 0 1 ${r} ${h}` : `L 0 ${h}`, "Z"].join(" ");
}

export function drawElements(ctx: DrawCtx, els: DocElement[]) {
  for (const el of els) {
    if (el.kind === "text") {
      const family = el.fontFamily || "Helvetica";
      const pair = ctx.fonts?.get(family);
      const font = pair ? (el.bold ? pair.bold : pair.regular) : (el.bold ? ctx.bold : ctx.regular);
      let text = el.text ?? "";
      if (!text) continue;
      text = sanitize(text);
      const widthPt = font.widthOfTextAtSize(text, el.size);
      let xMm = el.x;
      if (el.width && el.align === "center") xMm = el.x + (el.width - widthPt / (72 / 25.4)) / 2;
      if (el.width && el.align === "right") xMm = el.x + el.width - widthPt / (72 / 25.4);
      const baselineMm = el.y + (el.size * 0.78 * 25.4) / 72;
      const p = toPt(ctx, xMm, baselineMm);
      ctx.page.drawText(text, { x: p.x, y: p.y, size: el.size, font, color: g(el.gray ?? 0) });
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

function sanitize(t: string) { return t.replace(/[^\u0000-\u00FF]/g, "-"); }
