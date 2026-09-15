import { rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import type { DocElement } from "@/types/template";
import { mmToPt } from "@/templates/shared";

export interface DrawCtx {
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  /** deslocamento em mm (sangria) */
  offsetMm: number;
  /** altura da página em mm */
  pageHMm: number;
  logo?: PDFImage | null;
}

const g = (v = 0) => rgb(v, v, v);

function toPt(ctx: DrawCtx, xMm: number, yMm: number) {
  return {
    x: mmToPt(xMm + ctx.offsetMm),
    y: mmToPt(ctx.pageHMm - (yMm + ctx.offsetMm)),
  };
}

export function drawElements(ctx: DrawCtx, els: DocElement[]) {
  for (const el of els) {
    if (el.kind === "text") {
      const font = el.bold ? ctx.bold : ctx.regular;
      let text = el.text ?? "";
      if (!text) continue;
      text = sanitize(text);
      const widthPt = font.widthOfTextAtSize(text, el.size);
      let xMm = el.x;
      if (el.width && el.align === "center") xMm = el.x + (el.width - widthPt / (72 / 25.4)) / 2;
      if (el.width && el.align === "right") xMm = el.x + el.width - widthPt / (72 / 25.4);
      const baselineMm = el.y + (el.size * 0.78 * 25.4) / 72;
      const p = toPt(ctx, xMm, baselineMm);
      ctx.page.drawText(text, {
        x: p.x,
        y: p.y,
        size: el.size,
        font,
        color: g(el.gray ?? 0),
      });
    } else if (el.kind === "line") {
      const a = toPt(ctx, el.x1, el.y1);
      const b = toPt(ctx, el.x2, el.y2);
      ctx.page.drawLine({
        start: a,
        end: b,
        thickness: mmToPt(el.lineWidth ?? 0.3),
        color: g(el.gray ?? 0),
        ...(el.dash ? { dashArray: el.dash.map(mmToPt) } : {}),
      });
    } else if (el.kind === "rect") {
      const p = toPt(ctx, el.x, el.y + el.h);
      ctx.page.drawRectangle({
        x: p.x,
        y: p.y,
        width: mmToPt(el.w),
        height: mmToPt(el.h),
        borderWidth: el.stroke != null ? mmToPt(el.lineWidth ?? 0.3) : 0,
        ...(el.stroke != null ? { borderColor: g(el.stroke) } : {}),
        ...(el.fill != null ? { color: g(el.fill) } : {}),
        ...(el.dash ? { borderDashArray: el.dash.map(mmToPt) } : {}),
      });
    } else if (el.kind === "image" && ctx.logo) {
      const p = toPt(ctx, el.x, el.y + el.h);
      ctx.page.drawImage(ctx.logo, {
        x: p.x,
        y: p.y,
        width: mmToPt(el.w),
        height: mmToPt(el.h),
      });
    }
  }
}

/** pdf-lib StandardFonts usam WinAnsi: remove caracteres fora do conjunto */
function sanitize(t: string) {
  return t.replace(/[^\u0000-\u00FF]/g, "-");
}
