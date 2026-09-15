import type { DocElement, LayoutContext, TemplateRenderer } from "@/types/template";
import { buildFooter, buildHeader, footerHeight, ptToMm } from "../shared";
import { buildTableElements } from "@/pdf/renderTable";

export const renderPedido: TemplateRenderer = (ctx: LayoutContext) => {
  const { doc, m, contentW, contentH } = ctx;
  const els: DocElement[] = [];
  const header = buildHeader(ctx, { title: doc.title, subtitle: doc.subtitle });
  els.push(...header.els);
  let y = header.y;

  const s = 8;
  const third = contentW / 3 - 3;
  const fields = [
    `${doc.fields["mesa"] || "MESA"}:`,
    "DATA:  ____/____/______",
    `${doc.fields["atendente"] || "ATENDENTE"}:`,
  ];
  fields.forEach((label, i) => {
    const x = m + i * (third + 4.5);
    els.push({ kind: "text", x, y, size: s, bold: true, text: label });
    if (i !== 1) {
      els.push({
        kind: "line",
        x1: x + label.length * s * 0.17 + 1,
        y1: y + ptToMm(s) + 0.5,
        x2: x + third,
        y2: y + ptToMm(s) + 0.5,
        lineWidth: 0.3,
      });
    }
  });
  y += ptToMm(s) + 4;

  const fH = footerHeight(ctx);
  const bottom = m + contentH - ctx.stubH;
  const obsLines = Math.max(0, parseInt(doc.fields["obsLinhas"] || "3", 10) || 0);
  const obsH = obsLines > 0 ? 5 + obsLines * 5 : 0;
  const totalH = 9;
  const tableMaxH = bottom - fH - totalH - obsH - y - 4;

  const t = buildTableElements({
    x: m,
    y,
    w: contentW,
    maxH: tableMaxH,
    table: doc.table,
    roundedCorners: doc.roundedCorners,
  });
  els.push(...t.els);
  y = t.y + 3;

  const ty = bottom - fH - obsH - totalH;
  els.push(
    {
      kind: "rect",
      x: m + contentW / 2,
      y: ty,
      w: contentW / 2,
      h: totalH,
      stroke: 0.15,
      lineWidth: 0.5,
      ...(doc.roundedCorners ? { radius: 1.8 } : {}),
    },
    {
      kind: "text",
      x: m + contentW / 2 + 2,
      y: ty + (totalH - ptToMm(10)) / 2,
      size: 10,
      bold: true,
      text: doc.fields["totalLabel"] || "TOTAL R$",
    },
  );

  if (obsLines > 0) {
    let oy = bottom - fH - obsH + 1;
    els.push({ kind: "text", x: m, y: oy, size: 7.5, bold: true, text: "OBSERVAÇÕES:" });
    oy += 5;
    for (let i = 0; i < obsLines; i++) {
      els.push({
        kind: "line",
        x1: m,
        y1: oy + i * 5,
        x2: m + contentW,
        y2: oy + i * 5,
        lineWidth: 0.25,
        gray: 0.5,
      });
    }
  }

  els.push(...buildFooter(ctx, bottom - 1));
  return els;
};
