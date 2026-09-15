import type { DocElement, LayoutContext, TemplateRenderer } from "@/types/template";
import { buildFooter, buildHeader, footerHeight, ptToMm } from "../shared";
import { buildTableElements } from "@/pdf/renderTable";

export const renderComanda: TemplateRenderer = (ctx: LayoutContext) => {
  const { doc, m, contentW, contentH } = ctx;
  const els: DocElement[] = [];
  const header = buildHeader(ctx, { title: doc.title, subtitle: doc.subtitle });
  els.push(...header.els);
  let y = header.y;

  // linha de identificação (mesa / data)
  const half = contentW / 2 - 2;
  const idSize = 8;
  els.push(
    { kind: "text", x: m, y, size: idSize, bold: true, text: `${doc.fields["mesa"] || "MESA"}:` },
    {
      kind: "line",
      x1: m + 16,
      y1: y + ptToMm(idSize) + 0.5,
      x2: m + half,
      y2: y + ptToMm(idSize) + 0.5,
      lineWidth: 0.3,
    },
    { kind: "text", x: m + half + 4, y, size: idSize, bold: true, text: "DATA:" },
    {
      kind: "line",
      x1: m + half + 18,
      y1: y + ptToMm(idSize) + 0.5,
      x2: m + contentW,
      y2: y + ptToMm(idSize) + 0.5,
      lineWidth: 0.3,
    },
  );
  y += ptToMm(idSize) + 4;

  const fH = footerHeight(ctx);
  const totalH = 9;
  const bottom = m + contentH - ctx.stubH;
  const tableMaxH = bottom - fH - totalH - y - 2;

  const t = buildTableElements({ x: m, y, w: contentW, maxH: tableMaxH, table: doc.table });
  els.push(...t.els);

  // área de total
  const ty = bottom - fH - totalH;
  els.push(
    { kind: "rect", x: m, y: ty, w: contentW, h: totalH, stroke: 0.15, lineWidth: 0.5 },
    {
      kind: "text",
      x: m + 2,
      y: ty + (totalH - ptToMm(10)) / 2,
      size: 10,
      bold: true,
      text: doc.fields["totalLabel"] || "TOTAL R$",
    },
  );

  els.push(...buildFooter(ctx, bottom - 1));
  return els;
};
