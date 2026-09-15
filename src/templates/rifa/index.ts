import type { DocElement, LayoutContext, TemplateRenderer } from "@/types/template";
import { buildFooter, buildHeader, footerHeight, ptToMm } from "../shared";

export const renderRifa: TemplateRenderer = (ctx: LayoutContext) => {
  const { doc, m, contentW, contentH } = ctx;
  const els: DocElement[] = [];
  const header = buildHeader(ctx, { title: doc.title || "RIFA", subtitle: doc.subtitle, compact: true });
  els.push(...header.els);
  let y = header.y;

  const numero = doc.fields["numero"] || "0001";
  const numW = 34;
  els.push(
    { kind: "rect", x: m + contentW - numW, y: y - 2, w: numW, h: 11, stroke: 0.15, lineWidth: 0.6 },
    {
      kind: "text",
      x: m + contentW - numW,
      y: y + 1,
      size: 13,
      bold: true,
      align: "center",
      width: numW,
      text: `Nº ${numero}`,
    },
  );

  const bodyW = contentW - numW - 4;
  els.push({ kind: "text", x: m, y, size: 7, bold: true, text: "PRÊMIO", gray: 0.35 });
  y += ptToMm(7) + 0.8;
  els.push({
    kind: "text",
    x: m,
    y,
    size: 9.5,
    bold: true,
    text: doc.fields["premio"] || "Descreva o prêmio",
    width: bodyW,
  });
  y += ptToMm(9.5) + 3;

  if (doc.fields["promocao"]) {
    els.push({ kind: "text", x: m, y, size: 7, text: doc.fields["promocao"], gray: 0.25 });
    y += ptToMm(7) + 2;
  }

  const bottom = m + contentH - ctx.stubH;
  const fH = footerHeight(ctx);
  const infoY = bottom - fH - 10;
  els.push(
    {
      kind: "text",
      x: m,
      y: infoY,
      size: 7.5,
      bold: true,
      text: `SORTEIO: ${doc.fields["sorteio"] || "____/____/______"}`,
    },
    {
      kind: "text",
      x: m,
      y: infoY,
      size: 7.5,
      bold: true,
      align: "right",
      width: contentW,
      text: `VALOR: R$ ${doc.fields["valorCota"] || "______"}`,
    },
    { kind: "text", x: m, y: infoY + 5, size: 7, text: "Nome:", gray: 0.25 },
    {
      kind: "line",
      x1: m + 11,
      y1: infoY + 5 + ptToMm(7) + 0.5,
      x2: m + contentW * 0.62,
      y2: infoY + 5 + ptToMm(7) + 0.5,
      lineWidth: 0.3,
      gray: 0.35,
    },
    { kind: "text", x: m + contentW * 0.64, y: infoY + 5, size: 7, text: "Fone:", gray: 0.25 },
    {
      kind: "line",
      x1: m + contentW * 0.64 + 10,
      y1: infoY + 5 + ptToMm(7) + 0.5,
      x2: m + contentW,
      y2: infoY + 5 + ptToMm(7) + 0.5,
      lineWidth: 0.3,
      gray: 0.35,
    },
  );

  els.push(...buildFooter(ctx, bottom - 1));

  if (ctx.stubH > 0) {
    const sy = bottom + 3;
    els.push(
      { kind: "text", x: m, y: sy, size: 7, bold: true, text: "CANHOTO" },
      {
        kind: "text",
        x: m,
        y: sy,
        size: 10,
        bold: true,
        align: "right",
        width: contentW,
        text: `Nº ${numero}`,
      },
      { kind: "text", x: m, y: sy + 6, size: 7, text: "Nome:", gray: 0.25 },
      {
        kind: "line",
        x1: m + 11,
        y1: sy + 6 + ptToMm(7) + 0.5,
        x2: m + contentW * 0.6,
        y2: sy + 6 + ptToMm(7) + 0.5,
        lineWidth: 0.3,
        gray: 0.35,
      },
      { kind: "text", x: m + contentW * 0.62, y: sy + 6, size: 7, text: "Fone:", gray: 0.25 },
      {
        kind: "line",
        x1: m + contentW * 0.62 + 10,
        y1: sy + 6 + ptToMm(7) + 0.5,
        x2: m + contentW,
        y2: sy + 6 + ptToMm(7) + 0.5,
        lineWidth: 0.3,
        gray: 0.35,
      },
    );
  }

  return els;
};
