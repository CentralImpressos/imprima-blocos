import type { DocElement, LayoutContext, TemplateRenderer } from "@/types/template";
import { buildFooter, buildHeader, footerHeight, ptToMm } from "../shared";

export const renderCarne: TemplateRenderer = (ctx: LayoutContext) => {
  const { doc, m, contentW, contentH } = ctx;
  const els: DocElement[] = [];
  const header = buildHeader(ctx, { title: doc.title || "CARNÊ", subtitle: doc.subtitle, compact: true });
  els.push(...header.els);
  let y = header.y;

  const numero = doc.fields["numero"] || "0001";
  const parcela = doc.fields["parcela"] || "01/12";
  const venc = doc.fields["vencimento"] || "____/____/______";
  const valor = doc.fields["valor"] || "____________";

  els.push(
    { kind: "text", x: m, y, size: 7, bold: true, text: `CARNÊ Nº ${numero}` },
    {
      kind: "text",
      x: m,
      y,
      size: 7,
      bold: true,
      align: "right",
      width: contentW,
      text: `PARCELA ${parcela}`,
    },
  );
  y += ptToMm(7) + 2.5;

  els.push({ kind: "text", x: m, y, size: 7, text: "Cliente:", gray: 0.25 });
  els.push({
    kind: "text",
    x: m + 14,
    y,
    size: 8,
    bold: true,
    text: doc.fields["cliente"] || "",
  });
  els.push({
    kind: "line",
    x1: m + 14,
    y1: y + ptToMm(8) + 0.5,
    x2: m + contentW,
    y2: y + ptToMm(8) + 0.5,
    lineWidth: 0.3,
    gray: 0.35,
  });
  y += ptToMm(8) + 4;

  const boxH = 10;
  const halfW = contentW / 2 - 2;
  els.push(
    { kind: "rect", x: m, y, w: halfW, h: boxH, stroke: 0.15, lineWidth: 0.4 },
    { kind: "text", x: m + 1.5, y: y + 1, size: 6, text: "VENCIMENTO", gray: 0.35 },
    { kind: "text", x: m + 1.5, y: y + 4.6, size: 9, bold: true, text: venc },
    { kind: "rect", x: m + halfW + 4, y, w: halfW, h: boxH, stroke: 0.15, lineWidth: 0.4 },
    { kind: "text", x: m + halfW + 5.5, y: y + 1, size: 6, text: "VALOR", gray: 0.35 },
    { kind: "text", x: m + halfW + 5.5, y: y + 4.6, size: 9, bold: true, text: `R$ ${valor}` },
  );
  y += boxH + 3;

  const bottom = m + contentH - ctx.stubH;
  const fH = footerHeight(ctx);
  const payY = bottom - fH - 8;
  els.push(
    { kind: "text", x: m, y: payY, size: 6.5, text: "Pagamento / Autenticação:", gray: 0.3 },
    {
      kind: "line",
      x1: m,
      y1: payY + 7,
      x2: m + contentW,
      y2: payY + 7,
      lineWidth: 0.25,
      gray: 0.5,
    },
  );

  els.push(...buildFooter(ctx, bottom - 1));

  if (ctx.stubH > 0) {
    const sy = bottom + 3;
    els.push(
      { kind: "text", x: m, y: sy, size: 7, bold: true, text: `CANHOTO — Nº ${numero}` },
      {
        kind: "text",
        x: m,
        y: sy,
        size: 7,
        bold: true,
        align: "right",
        width: contentW,
        text: `PARCELA ${parcela}`,
      },
      {
        kind: "text",
        x: m,
        y: sy + 6,
        size: 7,
        text: `Cliente: ${doc.fields["cliente"] || "____________________"}`,
        gray: 0.25,
      },
      { kind: "text", x: m, y: sy + 11, size: 7, text: `Venc.: ${venc}`, gray: 0.25 },
      {
        kind: "text",
        x: m,
        y: sy + 11,
        size: 7,
        align: "right",
        width: contentW,
        text: `R$ ${valor}`,
        gray: 0.25,
      },
    );
  }

  return els;
};
